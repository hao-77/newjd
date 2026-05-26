<template>
  <aside class="app-sidebar" :class="{ collapsed }">
    <el-menu
      :default-active="activeMenu"
      :collapse="collapsed"
      background-color="#0d47a1"
      text-color="rgba(255,255,255,0.85)"
      active-text-color="#fff"
      router
    >
      <el-menu-item index="/">
        <el-icon><HomeFilled /></el-icon>
        <span>首页</span>
      </el-menu-item>
      <el-menu-item index="/assistant" class="assistant-menu-item">
        <el-icon><ChatDotRound /></el-icon>
        <span>金盾卫士助手</span>
      </el-menu-item>
      <el-sub-menu index="detect">
        <template #title>
          <el-icon><Search /></el-icon>
          <span>风险检测</span>
        </template>
        <el-menu-item index="/detect/transaction">交易欺诈检测</el-menu-item>
        <el-menu-item index="/detect/content">文本/链接检测</el-menu-item>
        <el-menu-item index="/detect/image">图片诈骗分析</el-menu-item>
        <el-menu-item index="/detect/audio">语音克隆检测</el-menu-item>
      </el-sub-menu>
      <el-menu-item index="/complaint" v-if="auth.isLoggedIn">
        <el-icon><Warning /></el-icon>
        <span>投诉反馈</span>
      </el-menu-item>
      <el-menu-item index="/profile" v-if="auth.isLoggedIn">
        <el-icon><User /></el-icon>
        <span>个人中心</span>
      </el-menu-item>
      <el-menu-item index="/admin/users" v-if="auth.isLoggedIn" class="admin-menu-item">
        <el-icon><Setting /></el-icon>
        <span>管理端</span>
      </el-menu-item>
    </el-menu>
    <div class="collapse-btn" @click="collapsed = !collapsed">
      <el-icon><component :is="collapsed ? 'Expand' : 'Fold'" /></el-icon>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const auth = useAuthStore()
const collapsed = ref(false)
const activeMenu = computed(() => route.path)
</script>

<style scoped>
.app-sidebar {
  width: 220px;
  background: var(--jd-sidebar);
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
  flex-shrink: 0;
}

.app-sidebar.collapsed {
  width: 64px;
}

.app-sidebar .el-menu {
  border-right: none;
  flex: 1;
}

.collapse-btn {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  transition: background 0.2s;
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

:deep(.assistant-menu-item) {
  background: rgba(255, 255, 255, 0.08) !important;
  font-weight: 600;
}

:deep(.assistant-menu-item.is-active) {
  background: rgba(66, 165, 245, 0.35) !important;
}

:deep(.admin-menu-item.is-active) {
  background: rgba(255, 193, 7, 0.25) !important;
}
</style>
