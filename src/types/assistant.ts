/** 咨询偏好 */
export type ConsultTopic = '信用卡' | '理财' | '贷款' | '保险'

/** 用户风险偏好 */
export type RiskProfile = '保守型' | '稳健型' | '进取型'

/** 用户情感需求 / 沟通风格 */
export type EmotionalStyle = '温和友善引导劝阻' | '专业严谨分析' | '简洁高效提醒'

export interface AssistantPreferences {
  consultTopic: ConsultTopic
  riskProfile: RiskProfile
  emotionalStyle: EmotionalStyle
}

export interface SessionMeta extends AssistantPreferences {
  lastMessagePreview?: string
  updatedAt?: string
}

export interface SessionRecord {
  sessionId: string
  sessionName?: string
  createTime?: string
  meta?: SessionMeta
}

export const CONSULT_TOPICS: ConsultTopic[] = ['信用卡', '理财', '贷款', '保险']
export const RISK_PROFILES: RiskProfile[] = ['保守型', '稳健型', '进取型']
export const EMOTIONAL_STYLES: EmotionalStyle[] = [
  '温和友善引导劝阻',
  '专业严谨分析',
  '简洁高效提醒',
]

export const DEFAULT_PREFERENCES: AssistantPreferences = {
  consultTopic: '信用卡',
  riskProfile: '稳健型',
  emotionalStyle: '温和友善引导劝阻',
}
