<template>
  <div class="admin-layout">
    <header class="admin-header">
      <div class="header-left">
        <el-icon :size="24"><Setting /></el-icon>
        <div>
          <h1>金盾卫士 · 管理后台</h1>
          <span>内部使用，不对客户开放</span>
        </div>
      </div>
      <div class="header-right">
        <el-button text type="primary" @click="router.push('/')">返回用户端</el-button>
        <el-button text @click="handleLogout">退出</el-button>
      </div>
    </header>
    <main class="admin-main">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

async function handleLogout() {
  await ElMessageBox.confirm('确定退出管理后台？', '提示', { type: 'warning' })
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f1f5f9;
}

.admin-header {
  height: 56px;
  padding: 0 24px;
  background: #1e293b;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-left h1 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  line-height: 1.3;
}

.header-left span {
  font-size: 11px;
  color: #94a3b8;
}

.header-right {
  display: flex;
  gap: 8px;
}

.header-right .el-button {
  color: #e2e8f0;
}

.admin-main {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}
</style>
