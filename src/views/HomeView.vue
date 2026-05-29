<template>
  <div class="home">
    <section class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-label">国产AI·RAG·多模态检测</div>
        <h1 class="hero-title">
          金盾卫士
          <span class="subtitle">全链路金融防护平台</span>
        </h1>
        <p class="hero-desc">
          金盾卫士是一款基于国产AI框架与RAG技术的多模态金融反欺诈平台，深度融合智能客服与反诈教育功能。系统通过动态知识图谱与检索增强生成技术，实现高准确率多轮劝阻对话，有效识别语音克隆等新型欺诈。支持动态交互与个性化反诈内容推送，结合毫秒级响应与多模态检测，大幅提升用户安全意识与交易防护能力，致力于构建全链路金融防护生态，为每一笔交易注入安全的灵魂。
        </p>
      </div>
    </section>

    <section class="features-section">
      <div class="section-header">
        <h2 class="section-title">核心能力</h2>
        <div class="section-divider"></div>
      </div>
      <div class="features-grid">
        <div v-for="(feature, index) in features" :key="index" class="feature-card">
          <div class="feature-icon">
            <el-icon :size="32"><component :is="feature.icon" /></el-icon>
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-desc">{{ feature.desc }}</p>
        </div>
      </div>
    </section>

    <section id="transaction-section" class="transaction-section">
      <div class="section-header">
        <h2 class="section-title">交易欺诈检测</h2>
        <div class="section-divider"></div>
      </div>
      <div class="detection-container">
        <div class="detection-info">
          <div class="detection-icon">
            <el-icon :size="48"><DataAnalysis /></el-icon>
          </div>
          <h3>毫秒级交易风险判定</h3>
          <p>基于国产AI框架与RAG技术，实时评估每笔交易的欺诈系数，提供全链路防护建议。</p>
          <div class="detection-features">
            <div class="detection-feature-item">
              <el-icon><Check /></el-icon>
              <span>实时风险评估</span>
            </div>
            <div class="detection-feature-item">
              <el-icon><Check /></el-icon>
              <span>多维度数据分析</span>
            </div>
            <div class="detection-feature-item">
              <el-icon><Check /></el-icon>
              <span>智能劝阻建议</span>
            </div>
            <div class="detection-feature-item">
              <el-icon><Check /></el-icon>
              <span>交易历史追溯</span>
            </div>
          </div>
          <el-button type="primary" @click="router.push('/detect/transaction')">
            立即检测
          </el-button>
        </div>
        <div class="detection-preview">
          <div class="preview-card">
            <div class="preview-header">
              <span class="preview-title">检测流程</span>
              <span class="preview-badge">三步完成</span>
            </div>
            <div class="preview-content">
              <div class="step-item">
                <div class="step-number">1</div>
                <div class="step-info">
                  <span class="step-title">输入交易信息</span>
                  <span class="step-desc">填写交易金额、收款账户等基本信息</span>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">2</div>
                <div class="step-info">
                  <span class="step-title">AI智能分析</span>
                  <span class="step-desc">系统自动评估交易风险系数</span>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">3</div>
                <div class="step-info">
                  <span class="step-title">获取检测结果</span>
                  <span class="step-desc">查看风险评估报告及建议</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="content-section" class="content-section">
      <div class="section-header">
        <h2 class="section-title">文本/链接检测</h2>
        <div class="section-divider"></div>
      </div>
      <div class="detection-container">
        <div class="detection-preview">
          <div class="preview-card">
            <div class="preview-header">
              <span class="preview-title">支持检测类型</span>
              <span class="preview-badge warning">全覆盖</span>
            </div>
            <div class="preview-content">
              <div class="type-item">
                <el-icon><Link /></el-icon>
                <span>钓鱼链接检测</span>
              </div>
              <div class="type-item">
                <el-icon><ChatLineSquare /></el-icon>
                <span>诈骗话术识别</span>
              </div>
              <div class="type-item">
                <el-icon><Grid /></el-icon>
                <span>恶意二维码扫描</span>
              </div>
              <div class="type-item">
                <el-icon><Lock /></el-icon>
                <span>敏感信息过滤</span>
              </div>
            </div>
          </div>
        </div>
        <div class="detection-info">
          <div class="detection-icon">
            <el-icon :size="48"><Document /></el-icon>
          </div>
          <h3>智能文本与链接分析</h3>
          <p>通过AI算法识别诈骗文本、钓鱼链接，实时预警可疑内容，保护用户信息与财产安全。</p>
          <div class="detection-features">
            <div class="detection-feature-item">
              <el-icon><Check /></el-icon>
              <span>诈骗话术识别</span>
            </div>
            <div class="detection-feature-item">
              <el-icon><Check /></el-icon>
              <span>钓鱼链接检测</span>
            </div>
            <div class="detection-feature-item">
              <el-icon><Check /></el-icon>
              <span>恶意二维码扫描</span>
            </div>
            <div class="detection-feature-item">
              <el-icon><Check /></el-icon>
              <span>敏感信息过滤</span>
            </div>
          </div>
          <el-button type="primary" @click="router.push('/detect/content')">
            立即检测
          </el-button>
        </div>
      </div>
    </section>

    <section id="image-section" class="image-section">
      <div class="section-header">
        <h2 class="section-title">图片诈骗分析</h2>
        <div class="section-divider"></div>
      </div>
      <div class="detection-container">
        <div class="detection-info">
          <div class="detection-icon">
            <el-icon :size="48"><Picture /></el-icon>
          </div>
          <h3>多模态图像识别</h3>
          <p>利用深度学习技术，快速识别截图中的可疑元素、伪造凭证和诈骗图像，辅助用户判断。</p>
          <div class="detection-features">
            <div class="detection-feature-item">
              <el-icon><Check /></el-icon>
              <span>伪造截图识别</span>
            </div>
            <div class="detection-feature-item">
              <el-icon><Check /></el-icon>
              <span>OCR文字提取</span>
            </div>
            <div class="detection-feature-item">
              <el-icon><Check /></el-icon>
              <span>水印检测</span>
            </div>
            <div class="detection-feature-item">
              <el-icon><Check /></el-icon>
              <span>图像篡改分析</span>
            </div>
          </div>
          <el-button type="primary" @click="router.push('/detect/image')">
            立即检测
          </el-button>
        </div>
        <div class="detection-preview">
          <div class="preview-card">
            <div class="preview-header">
              <span class="preview-title">支持图片格式</span>
              <span class="preview-badge">多格式</span>
            </div>
            <div class="preview-content">
              <div class="format-item">
                <span class="format-tag">JPG</span>
                <span class="format-tag">PNG</span>
                <span class="format-tag">JPEG</span>
                <span class="format-tag">BMP</span>
              </div>
              <div class="detection-capability">
                <div class="capability-item">
                  <el-icon><CircleCheck /></el-icon>
                  <span>截图真实性验证</span>
                </div>
                <div class="capability-item">
                  <el-icon><CircleCheck /></el-icon>
                  <span>PS痕迹检测</span>
                </div>
                <div class="capability-item">
                  <el-icon><CircleCheck /></el-icon>
                  <span>文字信息提取</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="audio-section" class="audio-section">
      <div class="section-header">
        <h2 class="section-title">语音克隆检测</h2>
        <div class="section-divider"></div>
      </div>
      <div class="detection-container">
        <div class="detection-preview">
          <div class="preview-card">
            <div class="preview-header">
              <span class="preview-title">检测能力</span>
              <span class="preview-badge">AI驱动</span>
            </div>
            <div class="preview-content">
              <div class="capability-list">
                <div class="capability-item">
                  <el-icon><Mute /></el-icon>
                  <span>AI合成语音识别率 &gt;95%</span>
                </div>
                <div class="capability-item">
                  <el-icon><Headset /></el-icon>
                  <span>声纹特征提取</span>
                </div>
                <div class="capability-item">
                  <el-icon><Timer /></el-icon>
                  <span>毫秒级响应速度</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="detection-info">
          <div class="detection-icon">
            <el-icon :size="48"><Microphone /></el-icon>
          </div>
          <h3>AI语音深度伪造检测</h3>
          <p>采用先进的音频分析技术，识别合成语音、语音克隆等新型欺诈手段，守护通话安全。</p>
          <div class="detection-features">
            <div class="detection-feature-item">
              <el-icon><Check /></el-icon>
              <span>语音合成检测</span>
            </div>
            <div class="detection-feature-item">
              <el-icon><Check /></el-icon>
              <span>声纹识别验证</span>
            </div>
            <div class="detection-feature-item">
              <el-icon><Check /></el-icon>
              <span>音频深度伪造分析</span>
            </div>
            <div class="detection-feature-item">
              <el-icon><Check /></el-icon>
              <span>实时通话预警</span>
            </div>
          </div>
          <el-button type="primary" @click="router.push('/detect/audio')">
            立即检测
          </el-button>
        </div>
      </div>
    </section>

    <section class="stats-section">
      <div class="stats-container">
        <div v-for="(stat, index) in stats" :key="index" class="stat-item">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const features = [
  {
    icon: 'ChatDotRound',
    title: '智能劝阻对话',
    desc: 'RAG 多轮对话，高准确率识别诈骗话术并实时劝阻'
  },
  {
    icon: 'Microphone',
    title: '语音克隆检测',
    desc: 'AI 音频分析，识别合成语音等新型欺诈手段'
  },
  {
    icon: 'Picture',
    title: '图片诈骗分析',
    desc: '多模态图像识别，快速判定可疑截图与凭证'
  },
  {
    icon: 'DataAnalysis',
    title: '交易风险判定',
    desc: '毫秒级交易欺诈系数评估，全链路防护'
  }
]

const stats = [
  { value: '99.2%', label: '劝阻准确率' },
  { value: '<50ms', label: '响应延迟' },
  { value: '10+', label: '欺诈类型覆盖' },
  { value: '24/7', label: '全天候守护' }
]
</script>

<style scoped>
.home {
  width: 100%;
  max-width: 1400px;
  background: transparent;
}

.hero {
  position: relative;
  min-height: 500px;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  display: flex;
  align-items: center;
  margin-top: 24px;
  margin-bottom: 60px;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  background: url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800') center/cover;
  opacity: 0.15;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, #1a1a1a 40%, transparent 100%);
}

.hero-content {
  position: relative;
  z-index: 1;
  padding: 0 60px;
  max-width: 700px;
}

.hero-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--jd-primary);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 20px;
}

.hero-title {
  font-size: 48px;
  font-weight: 300;
  color: #fff;
  line-height: 1.2;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
}

.hero-title .subtitle {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 8px;
}

.hero-desc {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.7;
  margin: 24px 0 32px;
}

.section-header {
  margin-bottom: 40px;
}

.section-title {
  font-size: 24px;
  font-weight: 300;
  color: var(--jd-text);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
}

.section-divider {
  width: 40px;
  height: 3px;
  background: var(--jd-primary);
}

.features-section {
  padding: 0 40px;
  margin-bottom: 80px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}

.feature-card,
.transaction-section,
.content-section,
.image-section,
.audio-section,
.stats-section,
.detection-preview {
  background: rgba(10, 10, 15, 0.5) !important;
  backdrop-filter: blur(12px) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-radius: 16px !important;
}

.feature-card {
  background: #fff;
  padding: 32px 24px;
  border: 1px solid var(--jd-border);
  transition: all 0.3s;
}

.feature-card:hover {
  border-color: #c41e3a !important;
  transform: translateY(-4px);
  background: rgba(20, 20, 30, 0.6) !important;
}

.feature-icon {
  color: var(--jd-primary);
  margin-bottom: 20px;
}

.feature-title,
.detection-info h3,
.preview-title,
.step-title,
.type-item,
.capability-item {
  color: #fff !important;
}


.feature-desc,
.detection-info > p,
.step-desc,
.preview-content {
  color: rgba(255, 255, 255, 0.7) !important;
}


.stats-section {
  background: #1a1a1a;
  padding: 60px 40px;
}

.stats-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 40px;
  font-weight: 300;
  color: #fff !important;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.transaction-section,
.content-section,
.image-section,
.audio-section {
  scroll-margin-top: 80px;
  padding: 60px 40px;
  background: #fafafa;
  border-bottom: 1px solid var(--jd-border);
}

.detection-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.detection-info {
  text-align: left;
}

.detection-icon {
  color: var(--jd-primary);
  margin-bottom: 24px;
}

.detection-info h3 {
  font-size: 28px;
  font-weight: 600;
  color: var(--jd-text);
  margin-bottom: 16px;
}

.detection-info > p {
  font-size: 15px;
  color: var(--jd-text-light);
  line-height: 1.6;
  margin-bottom: 28px;
}

.detection-features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.detection-feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--jd-text);
}

.detection-feature-item .el-icon {
  color: var(--jd-primary);
  font-size: 16px;
}

.detection-info .el-button {
  background: var(--jd-primary);
  border: none;
  padding: 12px 32px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 4px;
}

.detection-info .el-button:hover {
  background: var(--jd-primary-light);
}

.detection-preview {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--jd-border);
}

.preview-card {
  width: 100%;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--jd-border);
}

.preview-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--jd-text);
}

.preview-badge {
  font-size: 11px;
  padding: 2px 8px;
  background: #e6f7e6;
  color: #52c41a;
  border-radius: 12px;
}

.preview-badge.warning {
  background: #fff7e6;
  color: #fa8c16;
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px dashed #f0f0f0;
}

.step-item:last-of-type {
  border-bottom: none;
}

.step-number {
  width: 28px;
  height: 28px;
  background: var(--jd-primary);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.step-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.step-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--jd-text);
}

.step-desc {
  font-size: 12px;
  color: #999;
}

.type-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px dashed #f0f0f0;
  font-size: 14px;
  color: var(--jd-text);
}

.type-item .el-icon {
  color: var(--jd-primary);
  font-size: 18px;
}

.format-item {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px dashed #f0f0f0;
}

.format-tag {
  padding: 4px 12px;
  background: #f5f5f5;
  border-radius: 20px;
  font-size: 12px;
  color: #666;
}

.detection-capability {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 0;
}

.capability-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--jd-text);
}

.capability-item .el-icon {
  color: var(--jd-primary);
  font-size: 16px;
}

.capability-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 0;
}

@media (max-width: 1024px) {
  .features-grid,
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-content {
    padding: 0 24px;
  }

  .hero-title {
    font-size: 32px;
  }

  .features-section,
  .transaction-section,
  .content-section,
  .image-section,
  .audio-section {
    padding: 0 24px 40px 24px;
  }

  .features-grid,
  .stats-container {
    grid-template-columns: 1fr;
  }
  
  .detection-container {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .transaction-section,
  .content-section,
  .image-section,
  .audio-section {
    padding: 40px 24px;
  }
  
  .detection-features {
    grid-template-columns: 1fr;
  }
}
</style>