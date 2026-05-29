<template>
  <aside class="app-sidebar" :class="{ collapsed }">
    <div class="sidebar-header">
      <button class="collapse-btn" @click="toggleCollapse">
        <el-icon><component :is="collapsed ? 'Expand' : 'Fold'" /></el-icon>
      </button>
    </div>
    <el-menu
      :default-active="activeMenu"
      :collapse="collapsed"
      background-color="#f5f5f5"
      text-color="#555"
      active-text-color="#c41e3a"
      router
    >
      <div class="sidebar-section">
        <div class="section-title" v-if="!collapsed">CONTENTS</div>
        <el-menu-item index="/">
          <el-icon><HomeFilled /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/assistant">
          <el-icon><ChatDotRound /></el-icon>
          <span>金盾卫士助手</span>
        </el-menu-item>
      </div>

      <div class="sidebar-section">
        <div class="section-title" v-if="!collapsed">风险检测</div>
        <el-menu-item @click="scrollToSection('transaction-section')">
          <el-icon><DataAnalysis /></el-icon>
          <span>交易欺诈检测</span>
        </el-menu-item>
        <el-menu-item @click="scrollToSection('content-section')">
          <el-icon><Document /></el-icon>
          <span>文本/链接检测</span>
        </el-menu-item>
        <el-menu-item @click="scrollToSection('image-section')">
          <el-icon><Picture /></el-icon>
          <span>图片诈骗分析</span>
        </el-menu-item>
        <el-menu-item @click="scrollToSection('audio-section')">
          <el-icon><Microphone /></el-icon>
          <span>语音克隆检测</span>
        </el-menu-item>
      </div>

      <div class="sidebar-section" v-if="auth.isLoggedIn">
        <div class="section-title" v-if="!collapsed">用户服务</div>
        <el-menu-item index="/complaint">
          <el-icon><Warning /></el-icon>
          <span>投诉反馈</span>
        </el-menu-item>
        <el-menu-item index="/profile">
          <el-icon><User /></el-icon>
          <span>个人中心</span>
        </el-menu-item>
      </div>
    </el-menu>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const collapsed = ref(false)
const activeMenu = computed(() => route.path)

const toggleCollapse = () => {
  collapsed.value = !collapsed.value
}

const scrollToSection = (sectionId) => {
  const scrollToElement = () => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (route.path !== '/') {
    router.push('/').then(() => {
      setTimeout(scrollToElement, 200)
    })
  } else {
    scrollToElement()
  }
}
</script>

<style scoped>
.app-sidebar {
  width: 240px;
  background: rgba(10, 10, 15, 0.6);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  flex-shrink: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.app-sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border-bottom: 1px solid var(--jd-border);
  min-height: 72px;
}

.collapse-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: #666;
  transition: all 0.2s;
  font-size: 18px;
}

.collapse-btn:hover {
  background: #e0e0e0;
  color: var(--jd-primary);
}

.app-sidebar .el-menu {
  border-right: none;
  flex: 1;
  background: transparent;
}

.sidebar-section {
  padding: 16px 0;
  border-bottom: 1px solid var(--jd-border);
}

.sidebar-section:last-of-type {
  border-bottom: none;
}

.section-title {
  padding: 8px 20px;
  font-size: 10px;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
}

:deep(.el-menu-item) {
  height: 36px;
  line-height: 36px;
  font-size: 13px;
  margin: 2px 8px;
  border-radius: 4px;
  cursor: pointer;
}

:deep(.el-menu-item:hover) {
  background: #e8e8e8 !important;
}

:deep(.el-menu-item.is-active) {
  background: rgba(196, 30, 58, 0.1) !important;
  color: var(--jd-primary);
}

:deep(.el-menu--collapse .el-menu-item span) {
  display: none;
}

:deep(.el-menu--collapse .el-menu-item .el-icon) {
  margin-right: 0;
}
</style>