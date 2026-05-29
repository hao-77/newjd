<template>
  <header class="app-header">
    <div class="header-left">
      <img src="/src/assets/logo.png" alt="金盾卫士" class="logo-icon">
      <div class="brand">
        <h1>金盾卫士</h1>
        <span>全链路金融防护平台</span>
      </div>
    </div>
    <div class="header-right">
      <el-tag v-if="auth.devSkipLogin" type="warning" size="small" class="dev-tag">开发跳过登录</el-tag>
      <template v-if="auth.isLoggedIn">
        <el-dropdown trigger="click">
          <div class="user-info">
            <el-avatar :size="36" :src="auth.user?.avatar || auth.user?.avatarUrl">
              {{ auth.user?.userName?.charAt(0) || 'U' }}
            </el-avatar>
            <span class="username">{{ auth.user?.userName || '用户' }}</span>
            <el-icon><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="router.push('/profile')">
                <el-icon><User /></el-icon>个人中心
              </el-dropdown-item>
              <el-dropdown-item divided @click="handleLogout">
                <el-icon><SwitchButton /></el-icon>退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
      <template v-else>
        <el-button type="primary" plain round @click="router.push('/login')">登录</el-button>
        <el-button round @click="router.push('/register')">注册</el-button>
      </template>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

async function handleLogout() {
  await ElMessageBox.confirm('确定要退出登录吗？', '提示', { type: 'warning' })
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.app-header {
  height: 64px;
  background: rgba(10, 10, 15, 0.6);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: var(--jd-shadow);
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  height: 36px;
  width: auto;
  display: block;
}

.brand h1 {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
}

.brand span {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #fff;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background 0.2s;
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.1);
}

.username {
  font-size: 14px;
}

.dev-tag {
  margin-right: 4px;
}
</style>
