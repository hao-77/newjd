<template>
  <teleport to="body">
    <transition name="emergency-fade">
      <div v-if="visible" class="emergency-overlay" role="alertdialog" aria-modal="true">
        <div class="emergency-card">
          <div class="emergency-icon">
            <el-icon :size="48"><Bell /></el-icon>
          </div>
          <h2>紧急求助已启动</h2>
          <p class="emergency-desc">
            系统已记录您的求助信号。请立即联系以下热线，或向身边可信的人示意需要帮助。
          </p>

          <div class="hotline-grid">
            <el-button type="danger" size="large" @click="emit('call', '110')">
              <el-icon><Phone /></el-icon> 报警 110
            </el-button>
            <el-button type="warning" size="large" @click="emit('call', '120')">
              <el-icon><Phone /></el-icon> 急救 120
            </el-button>
            <el-button type="primary" size="large" @click="emit('call', '96110')">
              <el-icon><Phone /></el-icon> 反诈 96110
            </el-button>
          </div>

          <p class="emergency-hint">提示：连按三次空格可再次触发（输入框内无效）</p>

          <el-button class="close-btn" plain @click="emit('close')">我知道了，关闭</el-button>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
defineProps({ visible: Boolean })
const emit = defineEmits(['close', 'call'])
</script>

<style scoped>
.emergency-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(183, 28, 28, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  animation: pulse-bg 1.5s ease-in-out infinite;
}

@keyframes pulse-bg {
  0%,
  100% {
    background: rgba(183, 28, 28, 0.92);
  }
  50% {
    background: rgba(211, 47, 47, 0.96);
  }
}

.emergency-card {
  background: #fff;
  border-radius: 20px;
  padding: 36px 32px;
  max-width: 440px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.emergency-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background: #ffebee;
  color: #c62828;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: shake 0.5s ease-in-out infinite;
}

@keyframes shake {
  0%,
  100% {
    transform: rotate(0);
  }
  25% {
    transform: rotate(-8deg);
  }
  75% {
    transform: rotate(8deg);
  }
}

.emergency-card h2 {
  font-size: 22px;
  color: #c62828;
  margin-bottom: 12px;
}

.emergency-desc {
  font-size: 14px;
  color: #546e7a;
  line-height: 1.7;
  margin-bottom: 24px;
}

.hotline-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.hotline-grid .el-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
}

.emergency-hint {
  font-size: 12px;
  color: #94a3b8;
  margin-bottom: 16px;
}

.close-btn {
  width: 100%;
}

.emergency-fade-enter-active,
.emergency-fade-leave-active {
  transition: opacity 0.25s;
}

.emergency-fade-enter-from,
.emergency-fade-leave-to {
  opacity: 0;
}
</style>
