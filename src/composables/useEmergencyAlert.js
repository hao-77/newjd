import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { submitComplaint } from '@/api/ai'

const SPACE_WINDOW_MS = 2000
const SPACE_TRIGGER_COUNT = 3

export function useEmergencyAlert() {
  const visible = ref(false)
  const triggering = ref(false)
  let spaceCount = 0
  let lastSpaceAt = 0

  function isEditableTarget(target) {
    if (!target || !(target instanceof HTMLElement)) return false
    const tag = target.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
    if (target.isContentEditable) return true
    return !!target.closest('[contenteditable="true"]')
  }

  function playAlarmSound() {
    try {
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 880
      osc.type = 'sine'
      gain.gain.value = 0.15
      osc.start()
      setTimeout(() => {
        osc.stop()
        ctx.close()
      }, 400)
    } catch {
      /* ignore */
    }
  }

  function vibrate() {
    if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 400])
  }

  async function triggerEmergency() {
    if (triggering.value) return
    triggering.value = true
    visible.value = true
    vibrate()
    playAlarmSound()

    const auth = useAuthStore()
    if (auth.isLoggedIn && !auth.devSkipLogin) {
      try {
        const userLabel = auth.user?.userName || auth.user?.userId || '用户'
        await submitComplaint(
          `[紧急求助-三连空格触发] 用户 ${userLabel} 于 ${new Date().toLocaleString('zh-CN')} 触发隐蔽报警，请立即关注。`,
        )
      } catch {
        /* ignore */
      }
    }

    triggering.value = false
  }

  function onKeyDown(e) {
    if (e.code !== 'Space' && e.key !== ' ') return
    if (isEditableTarget(e.target)) return
    if (e.repeat) return

    const now = Date.now()
    if (now - lastSpaceAt > SPACE_WINDOW_MS) spaceCount = 0
    spaceCount += 1
    lastSpaceAt = now

    if (spaceCount >= SPACE_TRIGGER_COUNT) {
      spaceCount = 0
      lastSpaceAt = 0
      e.preventDefault()
      triggerEmergency()
    }
  }

  function closeAlert() {
    visible.value = false
  }

  function callHotline(tel) {
    window.open(`tel:${tel}`, '_self')
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeyDown, true)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown, true)
  })

  return { visible, triggering, closeAlert, callHotline }
}

