<template>
  <div class="admin-layout">
    <header class="admin-header">
      <div class="header-left">
        <el-icon :size="24"><Setting /></el-icon>
        <div>
          <h1>金盾卫士 · 管理后台</h1>
          <span>内部使用 · /admin/users</span>
        </div>
      </div>
      <div class="header-right">
        <el-button @click="router.push('/')">返回用户端</el-button>
        <el-button type="danger" plain @click="handleLogout">退出</el-button>
      </div>
    </header>

    <main class="admin-main">
      <div v-if="!isLoggedIn" class="auth-wall">
        <el-result icon="warning" title="需要登录" sub-title="管理后台需先登录管理员账号">
          <template #extra>
            <el-button type="primary" @click="router.push({ path: '/login', query: { redirect: '/admin/users' } })">
              去登录
            </el-button>
            <el-button v-if="isDev" type="warning" plain @click="devSkip">开发跳过登录</el-button>
          </template>
        </el-result>
      </div>
      <AdminUsersView v-else />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { isDev } from '@/config/dev'
import AdminUsersView from './AdminUsersView.vue'

const router = useRouter()
const auth = useAuthStore()
const isLoggedIn = computed(() => auth.isLoggedIn)

function devSkip() {
  auth.skipLoginForDev()
  ElMessage.warning('已进入开发模式')
}

async function handleLogout() {
  await ElMessageBox.confirm('确定退出？', '提示', { type: 'warning' })
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
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-left h1 {
  font-size: 16px;
  margin: 0;
}

.header-left span {
  font-size: 11px;
  color: #94a3b8;
}

.admin-main {
  flex: 1;
  padding: 24px;
}

.auth-wall {
  max-width: 480px;
  margin: 80px auto;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
}
</style>
