<template>
  <div class="assistant-page">
    <div v-if="!auth.isLoggedIn" class="login-wall">
      <div class="login-card">
        <el-icon :size="56" color="#3b82f6"><Lock /></el-icon>
        <h2>金盾卫士小助手</h2>
        <p>登录后即可使用个性化反诈咨询、历史对话与偏好设置</p>
        <el-button type="primary" size="large" round @click="router.push('/login')">立即登录</el-button>
      <el-button v-if="auth.isDev" type="warning" plain size="large" round @click="devSkipAndEnter">
        跳过登录（开发）
      </el-button>
      </div>
    </div>

    <template v-else>
      <!-- 左：对话历史 -->
      <aside class="col history-col">
        <div class="col-header">
          <span class="col-title">对话历史</span>
          <el-button type="primary" size="small" :icon="Plus" round @click="newChat">新对话</el-button>
        </div>
        <div v-loading="sessionsLoading" class="history-body">
          <template v-if="assistantStore.sessions.length">
            <div
              v-for="s in assistantStore.sessions"
              :key="s.sessionId"
              class="history-item"
              :class="{ active: sessionId === s.sessionId }"
              @click="selectSession(s.sessionId)"
            >
              <div class="history-item-top">
                <span class="history-name">{{ s.sessionName || s.meta?.consultTopic || '咨询对话' }}</span>
                <span class="history-time">{{ formatSessionTime(s) }}</span>
              </div>
              <div class="history-tags">
                <span class="mini-tag">{{ s.meta?.consultTopic }}</span>
                <span class="mini-tag muted">{{ s.meta?.riskProfile }}</span>
              </div>
              <p class="history-preview">{{ s.meta?.lastMessagePreview || '暂无消息' }}</p>
            </div>
          </template>
          <div v-else-if="!sessionsLoading" class="history-empty">
            <el-icon :size="40" color="#c5d5e8"><ChatLineSquare /></el-icon>
            <p>暂无历史</p>
            <span>点击「新对话」开始咨询</span>
          </div>
        </div>
      </aside>

      <!-- 中：对话主区 -->
      <section class="col chat-col">
        <header class="chat-topbar">
          <div class="chat-topbar-left">
            <div class="assistant-avatar">
              <el-icon :size="22"><Lock /></el-icon>
            </div>
            <div>
              <h2>金盾卫士小助手</h2>
              <p>基于 RAG 的多轮反诈劝阻 · 已按您的偏好定制回复</p>
            </div>
          </div>
          <div class="status-tags">
            <span class="status-tag primary">{{ assistantStore.preferences.consultTopic }}</span>
            <span class="status-tag">{{ assistantStore.preferences.riskProfile }}</span>
            <span class="status-tag success">{{ assistantStore.preferences.emotionalStyle }}</span>
          </div>
        </header>

        <div ref="messagesRef" class="chat-body">
          <div
            v-for="(msg, i) in messages"
            :key="i"
            class="msg-block"
            :class="msg.role"
          >
            <template v-if="msg.role === 'assistant' && i === 0">
              <div class="welcome-card">
                <el-icon class="welcome-icon"><Lock /></el-icon>
                <p>{{ msg.content }}</p>
              </div>
            </template>
            <template v-else>
              <el-avatar v-if="msg.role === 'assistant'" :size="36" class="msg-avatar ai">
                <el-icon><Lock /></el-icon>
              </el-avatar>
              <div class="msg-bubble">{{ msg.content }}</div>
              <el-avatar v-if="msg.role === 'user'" :size="36" class="msg-avatar user">
                {{ auth.user?.userName?.charAt(0) || 'U' }}
              </el-avatar>
            </template>
          </div>
          <div v-if="loading" class="msg-block assistant">
            <el-avatar :size="36" class="msg-avatar ai"><el-icon><Lock /></el-icon></el-avatar>
            <div class="msg-bubble typing"><i></i><i></i><i></i></div>
          </div>
        </div>

        <footer class="chat-footer">
          <div class="quick-section">
            <span class="quick-title">快捷提问：</span>
            <div class="quick-list">
              <button
                v-for="tag in quickTags"
                :key="tag"
                type="button"
                class="quick-btn"
                @click="sendMessage(tag)"
              >
                {{ tag }}
              </button>
            </div>
          </div>
          <div class="composer">
            <el-input
              v-model="inputText"
              type="textarea"
              :rows="3"
              placeholder="描述您遇到的疑似诈骗情况，助手将结合您的偏好给出分析..."
              resize="none"
              @keydown.enter.exact.prevent="sendMessage()"
            />
            <el-button
              class="send-btn"
              type="primary"
              :loading="loading"
              :disabled="!inputText.trim()"
              @click="sendMessage()"
            >
              <el-icon><Promotion /></el-icon>
              发送
            </el-button>
          </div>
        </footer>
      </section>

      <!-- 右：偏好设置 -->
      <aside class="col prefs-col">
        <div class="prefs-head">
          <h3><el-icon><Setting /></el-icon> 咨询偏好设置</h3>
          <p>调整后将影响助手回复风格，并保存到当前对话</p>
        </div>

        <div class="prefs-body">
          <section class="pref-section">
            <h4>咨询领域</h4>
            <div class="topic-grid">
              <button
                v-for="t in CONSULT_TOPICS"
                :key="t"
                type="button"
                class="topic-btn"
                :class="{ active: assistantStore.preferences.consultTopic === t }"
                @click="setTopic(t)"
              >
                {{ t }}
              </button>
            </div>
          </section>

          <section class="pref-section">
            <h4>用户风险偏好</h4>
            <div class="option-list">
              <label
                v-for="r in RISK_PROFILES"
                :key="r"
                class="option-card"
                :class="{ active: assistantStore.preferences.riskProfile === r }"
              >
                <input
                  type="radio"
                  name="risk"
                  :value="r"
                  :checked="assistantStore.preferences.riskProfile === r"
                  @change="setRisk(r)"
                />
                <span class="option-radio" />
                <span class="option-text">
                  <strong>{{ r }}</strong>
                  <em>{{ riskDesc[r] }}</em>
                </span>
              </label>
            </div>
          </section>

          <section class="pref-section">
            <h4>用户情感需求</h4>
            <div class="option-list">
              <label
                v-for="e in EMOTIONAL_STYLES"
                :key="e"
                class="option-card compact"
                :class="{ active: assistantStore.preferences.emotionalStyle === e }"
              >
                <input
                  type="radio"
                  name="emotion"
                  :value="e"
                  :checked="assistantStore.preferences.emotionalStyle === e"
                  @change="setEmotion(e)"
                />
                <span class="option-radio" />
                <span class="option-text"><strong>{{ e }}</strong></span>
              </label>
            </div>
          </section>

          <section class="pref-summary-box">
            <h4>当前配置摘要</h4>
            <ul>
              <li>专注 <b>{{ assistantStore.preferences.consultTopic }}</b> 相关反诈场景</li>
              <li>按 <b>{{ assistantStore.preferences.riskProfile }}</b> 评估风险与建议力度</li>
              <li>采用 <b>{{ assistantStore.preferences.emotionalStyle }}</b> 沟通方式</li>
            </ul>
          </section>
        </div>
      </aside>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Plus } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { useAssistantStore } from '@/stores/assistant'
import { useAssistantChat } from '@/composables/useAssistantChat'
import {
  CONSULT_TOPICS,
  RISK_PROFILES,
  EMOTIONAL_STYLES,
  type ConsultTopic,
  type RiskProfile,
  type EmotionalStyle,
} from '@/types/assistant'

const router = useRouter()
const auth = useAuthStore()
const assistantStore = useAssistantStore()
const messagesRef = ref<HTMLElement>()

const {
  loading,
  sessionsLoading,
  inputText,
  sessionId,
  messages,
  quickTags,
  init,
  newChat,
  selectSession,
  sendMessage,
  onPreferencesChange,
  formatSessionTime,
} = useAssistantChat(messagesRef)

const riskDesc: Record<RiskProfile, string> = {
  保守型: '优先保本，强调资金安全与核实',
  稳健型: '平衡收益与风险，理性分析',
  进取型: '关注收益机会，同时提示高风险骗局',
}

function setTopic(t: ConsultTopic) {
  assistantStore.preferences.consultTopic = t
  onPreferencesChange()
}

function setRisk(r: RiskProfile) {
  assistantStore.preferences.riskProfile = r
  onPreferencesChange()
}

function setEmotion(e: EmotionalStyle) {
  assistantStore.preferences.emotionalStyle = e
  onPreferencesChange()
}

function devSkipAndEnter() {
  auth.skipLoginForDev()
  init()
}

onMounted(() => {
  if (auth.isLoggedIn) init()
})
</script>

<style scoped>
.assistant-page {
  --col-border: #e5edf5;
  --text-main: #1e293b;
  --text-sub: #64748b;
  --blue: #2563eb;
  --blue-light: #eff6ff;
  --blue-soft: #dbeafe;
  display: flex;
  height: calc(100vh - 64px);
  margin: -24px;
  background: #f1f5f9;
  gap: 0;
  overflow: hidden;
}

/* 通用列 */
.col {
  display: flex;
  flex-direction: column;
  background: #fff;
  min-height: 0;
}

.col-header {
  flex-shrink: 0;
  height: 56px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--col-border);
}

.col-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-main);
}

/* 左栏 - 历史 */
.history-col {
  width: 240px;
  flex-shrink: 0;
  border-right: 1px solid var(--col-border);
}

.history-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.history-item {
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 8px;
  border: 1px solid transparent;
  transition: background 0.15s, border-color 0.15s;
}

.history-item:hover {
  background: #f8fafc;
}

.history-item.active {
  background: var(--blue-light);
  border-color: var(--blue-soft);
}

.history-item-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.history-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-time {
  font-size: 11px;
  color: #94a3b8;
  flex-shrink: 0;
}

.history-tags {
  display: flex;
  gap: 6px;
  margin-bottom: 6px;
}

.mini-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--blue-soft);
  color: var(--blue);
}

.mini-tag.muted {
  background: #f1f5f9;
  color: var(--text-sub);
}

.history-preview {
  font-size: 12px;
  color: var(--text-sub);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.history-empty {
  height: 100%;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #94a3b8;
  text-align: center;
  padding: 24px;
}

.history-empty p {
  font-size: 14px;
  color: var(--text-sub);
  margin: 8px 0 0;
}

.history-empty span {
  font-size: 12px;
}

/* 中栏 - 对话 */
.chat-col {
  flex: 1;
  min-width: 0;
}

.chat-topbar {
  flex-shrink: 0;
  padding: 16px 24px;
  border-bottom: 1px solid var(--col-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: #fff;
}

.chat-topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.assistant-avatar {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.chat-topbar h2 {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-main);
  margin: 0 0 2px;
  line-height: 1.3;
}

.chat-topbar p {
  font-size: 12px;
  color: var(--text-sub);
  margin: 0;
}

.status-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
  flex-shrink: 0;
}

.status-tag {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 20px;
  background: #f1f5f9;
  color: var(--text-sub);
  white-space: nowrap;
}

.status-tag.primary {
  background: var(--blue-light);
  color: var(--blue);
}

.status-tag.success {
  background: #ecfdf5;
  color: #059669;
}

.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  background: #f8fafc;
}

.welcome-card {
  display: flex;
  gap: 14px;
  padding: 16px 18px;
  background: var(--blue-light);
  border: 1px solid var(--blue-soft);
  border-radius: 12px;
  max-width: 720px;
}

.welcome-icon {
  font-size: 22px;
  color: var(--blue);
  flex-shrink: 0;
  margin-top: 2px;
}

.welcome-card p {
  margin: 0;
  font-size: 14px;
  line-height: 1.75;
  color: #334155;
}

.msg-block {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  margin-top: 16px;
  max-width: 78%;
}

.msg-block.user {
  flex-direction: row-reverse;
  margin-left: auto;
}

.msg-avatar.ai {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: #fff;
  flex-shrink: 0;
}

.msg-avatar.user {
  background: #60a5fa;
  color: #fff;
  flex-shrink: 0;
}

.msg-bubble {
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.7;
  word-break: break-word;
}

.msg-block.assistant .msg-bubble {
  background: #fff;
  border: 1px solid var(--col-border);
  color: #334155;
  border-bottom-left-radius: 4px;
}

.msg-block.user .msg-bubble {
  background: var(--blue);
  color: #fff;
  border-bottom-right-radius: 4px;
}

.msg-bubble.typing {
  display: flex;
  gap: 5px;
  align-items: center;
  padding: 14px 18px;
}

.msg-bubble.typing i {
  width: 7px;
  height: 7px;
  background: #93c5fd;
  border-radius: 50%;
  animation: bounce 1.2s infinite;
}

.msg-bubble.typing i:nth-child(2) {
  animation-delay: 0.15s;
}
.msg-bubble.typing i:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-5px);
  }
}

.chat-footer {
  flex-shrink: 0;
  background: #fff;
  border-top: 1px solid var(--col-border);
}

.quick-section {
  padding: 12px 24px 0;
}

.quick-title {
  font-size: 13px;
  color: var(--text-sub);
  display: block;
  margin-bottom: 8px;
}

.quick-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-bottom: 12px;
}

.quick-btn {
  border: 1px solid var(--col-border);
  background: #fff;
  color: #475569;
  font-size: 13px;
  padding: 6px 14px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.15s;
  line-height: 1.4;
}

.quick-btn:hover {
  border-color: var(--blue);
  color: var(--blue);
  background: var(--blue-light);
}

.composer {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  padding: 12px 24px 16px;
}

.composer :deep(.el-textarea__inner) {
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 14px;
  line-height: 1.6;
  box-shadow: none;
}

.composer :deep(.el-textarea) {
  flex: 1;
}

.send-btn {
  height: 44px;
  padding: 0 20px;
  border-radius: 10px;
  flex-shrink: 0;
}

/* 右栏 - 偏好 */
.prefs-col {
  width: 300px;
  flex-shrink: 0;
  border-left: 1px solid var(--col-border);
}

.prefs-head {
  flex-shrink: 0;
  padding: 16px 18px;
  border-bottom: 1px solid var(--col-border);
}

.prefs-head h3 {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 6px;
}

.prefs-head p {
  font-size: 12px;
  color: var(--text-sub);
  line-height: 1.5;
  margin: 0;
}

.prefs-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 18px 24px;
}

.pref-section {
  margin-bottom: 22px;
}

.pref-section h4 {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
  margin: 0 0 10px;
}

.topic-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.topic-btn {
  height: 36px;
  border: 1px solid var(--col-border);
  border-radius: 8px;
  background: #fff;
  color: #475569;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
}

.topic-btn:hover {
  border-color: #93c5fd;
  color: var(--blue);
}

.topic-btn.active {
  background: var(--blue);
  border-color: var(--blue);
  color: #fff;
  font-weight: 600;
}

.option-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-card {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  border: 1px solid var(--col-border);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s;
  background: #fff;
}

.option-card:hover {
  border-color: #93c5fd;
  background: #fafbff;
}

.option-card.active {
  border-color: var(--blue);
  background: var(--blue-light);
  box-shadow: 0 0 0 1px var(--blue-soft);
}

.option-card input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.option-radio {
  width: 16px;
  height: 16px;
  border: 2px solid #cbd5e1;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 2px;
  position: relative;
}

.option-card.active .option-radio {
  border-color: var(--blue);
}

.option-card.active .option-radio::after {
  content: '';
  position: absolute;
  inset: 3px;
  background: var(--blue);
  border-radius: 50%;
}

.option-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.option-text strong {
  font-size: 13px;
  color: var(--text-main);
  font-weight: 600;
}

.option-text em {
  font-size: 11px;
  color: var(--text-sub);
  font-style: normal;
  line-height: 1.4;
}

.option-card.compact {
  padding: 10px 14px;
}

.pref-summary-box {
  background: var(--blue-light);
  border: 1px solid var(--blue-soft);
  border-radius: 10px;
  padding: 14px 16px;
}

.pref-summary-box h4 {
  font-size: 13px;
  font-weight: 600;
  color: var(--blue);
  margin: 0 0 10px;
}

.pref-summary-box ul {
  margin: 0;
  padding-left: 18px;
  font-size: 12px;
  color: #475569;
  line-height: 1.9;
}

.pref-summary-box b {
  color: var(--blue);
  font-weight: 600;
}

/* 登录墙 */
.login-wall {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
}

.login-card {
  background: #fff;
  padding: 48px;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  text-align: center;
  max-width: 400px;
}

.login-card h2 {
  margin: 16px 0 8px;
  color: var(--text-main);
}

.login-card p {
  color: var(--text-sub);
  font-size: 14px;
  margin-bottom: 24px;
  line-height: 1.6;
}

@media (max-width: 1200px) {
  .prefs-col {
    width: 260px;
  }
}

@media (max-width: 992px) {
  .prefs-col {
    display: none;
  }
  .history-col {
    width: 200px;
  }
}
</style>
