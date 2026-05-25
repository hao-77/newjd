import { ref, nextTick, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useAssistantStore } from '@/stores/assistant'
import { createSession, getSessions, getSessionHistory, aiPredict } from '@/api/ai'
import type { ChatMessage } from '@/types/api'
import type { SessionRecord } from '@/types/assistant'

export function useAssistantChat(messagesRef?: { value: HTMLElement | undefined }) {
  const auth = useAuthStore()
  const assistantStore = useAssistantStore()

  const loading = ref(false)
  const sessionsLoading = ref(false)
  const inputText = ref('')
  const sessionId = ref('')
  const messages = ref<ChatMessage[]>([])

  const quickTags = computed(() => {
    const topic = assistantStore.preferences.consultTopic
    const map: Record<string, string[]> = {
      信用卡: ['信用卡提额诈骗如何识别？', '被盗刷后该怎么办？', '伪冒客服换卡套路'],
      理财: ['高收益理财骗局特征', '虚假投资平台如何分辨', '熟人推荐理财靠谱吗'],
      贷款: ['无抵押贷款诈骗套路', 'AB贷骗局是什么', '提前缴费放款是诈骗吗'],
      保险: ['退保理财骗局识别', '虚假保险推销话术', '保单质押贷款陷阱'],
    }
    return map[topic] || ['什么是杀猪盘？', '如何识别语音克隆？', '转账前如何自查？']
  })

  function buildWelcome(): ChatMessage {
    const p = assistantStore.preferences
    return {
      role: 'assistant',
      content: `您好！我是金盾卫士智能助手。当前为您服务：【${p.consultTopic}】领域咨询，按【${p.riskProfile}】风险偏好为您分析，并以【${p.emotionalStyle}】的方式与您沟通。请描述您遇到的情况，我会帮您识别风险并给出劝阻建议。`,
    }
  }

  async function scrollBottom() {
    await nextTick()
    if (messagesRef?.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight
    }
  }

  async function loadSessionList() {
    if (!auth.isLoggedIn) return
    sessionsLoading.value = true
    try {
      const res = await getSessions()
      const list = Array.isArray(res.data) ? res.data : []
      const records: SessionRecord[] = list.map((s) => ({
        sessionId: String(s.sessionId),
        sessionName: s.sessionName,
        createTime: s.createTime,
        meta: assistantStore.getSessionMeta(String(s.sessionId)),
      }))
      records.sort((a, b) => {
        const ta = a.meta?.updatedAt || a.createTime || ''
        const tb = b.meta?.updatedAt || b.createTime || ''
        return tb.localeCompare(ta)
      })
      assistantStore.setSessions(records)
    } catch {
      assistantStore.setSessions([])
    } finally {
      sessionsLoading.value = false
    }
  }

  async function selectSession(id: string) {
    if (sessionId.value === id) return
    sessionId.value = id
    assistantStore.currentSessionId = id
    assistantStore.applySessionMeta(id)
    messages.value = [buildWelcome()]
    await loadHistory()
    await scrollBottom()
  }

  async function init() {
    if (!auth.isLoggedIn) return
    await loadSessionList()
    if (assistantStore.sessions.length > 0) {
      await selectSession(assistantStore.sessions[0].sessionId)
    } else {
      await newChat()
    }
  }

  async function newChat() {
    const title = assistantStore.buildSessionTitle()
    try {
      const res = await createSession(title)
      const data = res.data as { sessionId?: string }
      const id = data?.sessionId ? String(data.sessionId) : String(res.data || '')
      sessionId.value = id || 'local-' + Date.now()
    } catch {
      sessionId.value = 'local-' + Date.now()
      ElMessage.warning('创建对话失败，使用本地会话')
    }
    assistantStore.currentSessionId = sessionId.value
    assistantStore.saveSessionMeta(sessionId.value, assistantStore.preferences)
    messages.value = [buildWelcome()]
    await loadSessionList()
    ElMessage.success('已创建新对话')
  }

  async function loadHistory() {
    if (!sessionId.value || sessionId.value.startsWith('local-')) return
    try {
      const res = await getSessionHistory(sessionId.value)
      const history = res.data
      if (Array.isArray(history) && history.length > 0) {
        const parsed = history.map(
          (h: { role?: string; content?: string; message?: string; createTime?: string }) => ({
            role: (h.role === 'assistant' || h.role === 'AI' ? 'assistant' : 'user') as
              | 'user'
              | 'assistant',
            content: stripContextPrefix(h.content || h.message || ''),
            time: h.createTime,
          }),
        )
        messages.value = [buildWelcome(), ...parsed]
      }
    } catch {
      /* keep welcome */
    }
  }

  function stripContextPrefix(content: string) {
    const idx = content.indexOf('【用户提问】')
    return idx >= 0 ? content.slice(idx + 6).trim() : content
  }

  function parseReply(data: unknown): string {
    if (typeof data === 'string') return data
    if (data && typeof data === 'object') {
      const d = data as Record<string, unknown>
      return String(d.content || d.reply || d.answer || d.message || JSON.stringify(data))
    }
    return '已收到您的问题。如遇紧急诈骗请立即拨打 96110。'
  }

  async function sendMessage(text?: string) {
    const raw = (text ?? inputText.value).trim()
    if (!raw || loading.value) return

    messages.value.push({ role: 'user', content: raw })
    inputText.value = ''
    loading.value = true
    assistantStore.saveSessionMeta(sessionId.value, assistantStore.preferences, raw)
    await scrollBottom()

    try {
      if (!sessionId.value) await newChat()

      const userId = auth.user?.userId || ''
      const payload = assistantStore.wrapUserContent(raw)
      const res = await aiPredict({
        userId,
        sessionId: sessionId.value,
        content: payload,
      })

      const reply = parseReply(res.data)
      messages.value.push({ role: 'assistant', content: reply })
      assistantStore.saveSessionMeta(sessionId.value, assistantStore.preferences, reply.slice(0, 40))
      await loadSessionList()
    } catch {
      messages.value.push({
        role: 'assistant',
        content:
          '抱歉，服务暂时不可用。建议您：① 不要向陌生账户转账；② 通过官方渠道核实；③ 拨打 96110 反诈专线。',
      })
    } finally {
      loading.value = false
      await scrollBottom()
    }
  }

  function onPreferencesChange() {
    messages.value = [buildWelcome()]
    if (sessionId.value) {
      assistantStore.saveSessionMeta(sessionId.value, assistantStore.preferences)
    }
  }

  function formatSessionTime(s: SessionRecord) {
    const t = s.meta?.updatedAt || s.createTime
    if (!t) return ''
    try {
      const d = new Date(t)
      const now = new Date()
      const isToday = d.toDateString() === now.toDateString()
      return isToday
        ? d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        : d.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
    } catch {
      return ''
    }
  }

  return {
    loading,
    sessionsLoading,
    inputText,
    sessionId,
    messages,
    quickTags,
    buildWelcome,
    init,
    newChat,
    selectSession,
    loadSessionList,
    sendMessage,
    onPreferencesChange,
    formatSessionTime,
    scrollBottom,
  }
}
