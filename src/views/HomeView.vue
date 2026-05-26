<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content">
        <div class="hero-badge">国产 AI · RAG · 多模态检测</div>
        <h1>金盾卫士</h1>
        <p class="hero-desc">{{ intro }}</p>
        <div class="hero-actions">
          <el-button type="primary" size="large" round @click="router.push('/detect/transaction')">
            开始风险检测
          </el-button>
          <el-button size="large" round plain @click="router.push('/assistant')">咨询智能助手</el-button>
        </div>
      </div>
      <div class="hero-visual">
        <div class="shield-icon">
          <el-icon :size="120"><Lock /></el-icon>
        </div>
        <div class="orbit orbit-1"></div>
        <div class="orbit orbit-2"></div>
      </div>
    </section>

    <section class="features">
      <h2>核心能力</h2>
      <el-row :gutter="24">
        <el-col v-for="f in features" :key="f.title" :xs="24" :sm="12" :md="6">
          <el-card shadow="hover" class="feature-card">
            <el-icon :size="40" :color="f.color"><component :is="f.icon" /></el-icon>
            <h3>{{ f.title }}</h3>
            <p>{{ f.desc }}</p>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <section class="stats">
      <el-row :gutter="24">
        <el-col v-for="s in stats" :key="s.label" :span="6">
          <div class="stat-item">
            <div class="stat-value">{{ s.value }}</div>
            <div class="stat-label">{{ s.label }}</div>
          </div>
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const intro =
  '金盾卫士是一款基于国产AI框架与RAG技术的多模态金融反欺诈平台，深度融合智能客服与反诈教育功能。系统通过动态知识图谱与检索增强生成技术，实现高准确率多轮劝阻对话，有效识别语音克隆等新型欺诈。支持动态交互与个性化反诈内容推送，结合毫秒级响应与多模态检测，大幅提升用户安全意识与交易防护能力，致力于构建全链路金融防护生态，为每一笔交易注入安全的灵魂。'

const features = [
  {
    icon: 'ChatDotRound',
    title: '智能劝阻对话',
    desc: 'RAG 多轮对话，高准确率识别诈骗话术并实时劝阻',
    color: '#1565c0',
  },
  {
    icon: 'Microphone',
    title: '语音克隆检测',
    desc: 'AI 音频分析，识别合成语音等新型欺诈手段',
    color: '#1976d2',
  },
  {
    icon: 'Picture',
    title: '图片诈骗分析',
    desc: '多模态图像识别，快速判定可疑截图与凭证',
    color: '#1e88e5',
  },
  {
    icon: 'DataAnalysis',
    title: '交易风险判定',
    desc: '毫秒级交易欺诈系数评估，全链路防护',
    color: '#42a5f5',
  },
]

const stats = [
  { value: '99.2%', label: '劝阻准确率' },
  { value: '<50ms', label: '响应延迟' },
  { value: '10+', label: '欺诈类型覆盖' },
  { value: '24/7', label: '全天候守护' },
]

</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%);
  border-radius: 20px;
  padding: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  margin-bottom: 40px;
  position: relative;
  overflow: hidden;
}

.hero-badge {
  display: inline-block;
  background: rgba(21, 101, 192, 0.15);
  color: var(--jd-primary);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  margin-bottom: 16px;
}

.hero h1 {
  font-size: 48px;
  color: var(--jd-primary-dark);
  margin-bottom: 16px;
  font-weight: 800;
}

.hero-desc {
  font-size: 15px;
  line-height: 1.8;
  color: #37474f;
  max-width: 560px;
  margin-bottom: 28px;
}

.hero-actions {
  display: flex;
  gap: 12px;
}

.hero-visual {
  position: relative;
  width: 200px;
  height: 200px;
  flex-shrink: 0;
}

.shield-icon {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--jd-primary);
  z-index: 2;
}

.orbit {
  position: absolute;
  border: 2px dashed rgba(21, 101, 192, 0.3);
  border-radius: 50%;
  animation: spin 20s linear infinite;
}

.orbit-1 {
  inset: 10px;
}

.orbit-2 {
  inset: -10px;
  animation-direction: reverse;
  animation-duration: 15s;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.features {
  margin-bottom: 40px;
}

.features h2 {
  font-size: 24px;
  color: var(--jd-primary-dark);
  margin-bottom: 24px;
  text-align: center;
}

.feature-card {
  text-align: center;
  padding: 24px 16px;
  border-radius: 12px;
  height: 100%;
  transition: transform 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
}

.feature-card h3 {
  margin: 16px 0 8px;
  color: var(--jd-primary);
  font-size: 16px;
}

.feature-card p {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}

.stats {
  background: linear-gradient(135deg, #1565c0, #0d47a1);
  border-radius: 16px;
  padding: 32px;
}

.stat-item {
  text-align: center;
  color: #fff;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
}

.stat-label {
  font-size: 14px;
  opacity: 0.85;
  margin-top: 4px;
}

@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    padding: 32px 24px;
  }
  .hero-visual {
    display: none;
  }
  .hero h1 {
    font-size: 36px;
  }
}
</style>
