import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { DEFAULT_PREFERENCES } from '@/types/assistant'

const PREFS_KEY = 'jindun_assistant_prefs'
const SESSION_META_KEY = 'jindun_session_meta'

function loadGlobalPrefs() {
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    if (raw) return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  return { ...DEFAULT_PREFERENCES }
}

function loadAllSessionMeta() {
  try {
    const raw = localStorage.getItem(SESSION_META_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  return {}
}

export const useAssistantStore = defineStore('assistant', () => {
  const preferences = ref(loadGlobalPrefs())
  const sessions = ref([])
  const currentSessionId = ref('')
  const sessionMetaMap = ref(loadAllSessionMeta())

  watch(
    preferences,
    (val) => {
      localStorage.setItem(PREFS_KEY, JSON.stringify(val))
      if (currentSessionId.value) saveSessionMeta(currentSessionId.value, val)
    },
    { deep: true },
  )

  function saveSessionMeta(sessionId, prefs, preview) {
    const existing = sessionMetaMap.value[sessionId] || {}
    sessionMetaMap.value[sessionId] = {
      ...existing,
      ...prefs,
      lastMessagePreview: preview ?? existing.lastMessagePreview,
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem(SESSION_META_KEY, JSON.stringify(sessionMetaMap.value))
  }

  function getSessionMeta(sessionId) {
    return {
      ...preferences.value,
      ...sessionMetaMap.value[sessionId],
    }
  }

  function applySessionMeta(sessionId) {
    const meta = sessionMetaMap.value[sessionId]
    if (meta) {
      preferences.value = {
        consultTopic: meta.consultTopic,
        riskProfile: meta.riskProfile,
        emotionalStyle: meta.emotionalStyle,
      }
    }
  }

  function setSessions(list) {
    sessions.value = list.map((s) => ({ ...s, meta: getSessionMeta(s.sessionId) }))
  }

  function buildSessionTitle(prefs = preferences.value) {
    return `${prefs.consultTopic} · ${prefs.riskProfile}`
  }

  function buildContextPrefix(prefs = preferences.value) {
    return `【咨询偏好】${prefs.consultTopic}【风险偏好】${prefs.riskProfile}【情感风格】${prefs.emotionalStyle}`
  }

  function wrapUserContent(text, prefs = preferences.value) {
    return `${buildContextPrefix(prefs)}\n【用户提问】${text}`
  }

  return {
    preferences,
    sessions,
    currentSessionId,
    sessionMetaMap,
    saveSessionMeta,
    getSessionMeta,
    applySessionMeta,
    setSessions,
    buildSessionTitle,
    buildContextPrefix,
    wrapUserContent,
  }
})

