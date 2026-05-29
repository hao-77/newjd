<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <h1>注册账号</h1>
        <p class="subtitle">加入金盾卫士，守护每一笔交易</p>
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" @submit.prevent="handleRegister">
        <el-form-item prop="email">
          <el-input v-model="form.email" placeholder="邮箱" prefix-icon="Message" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码（6-16位）"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item prop="code">
          <div class="code-row">
            <el-input v-model="form.code" placeholder="验证码" prefix-icon="Key" />
            <el-button :disabled="countdown > 0" @click="sendCode">
              {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
            </el-button>
          </div>
        </el-form-item>
        <el-button type="primary" class="submit-btn" :loading="loading" native-type="submit">
          注册
        </el-button>
      </el-form>

      <div class="auth-footer">
        已有账号？<router-link to="/login">去登录</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { getCode } from '@/api/user'

const router = useRouter()
const auth = useAuthStore()

const loading = ref(false)
const countdown = ref(0)
const formRef = ref()
const form = reactive({ email: '', password: '', code: '' })

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 16, message: '密码长度6-16位', trigger: 'blur' },
  ],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
}

async function sendCode() {
  if (!form.email) {
    ElMessage.warning('请先输入邮箱')
    return
  }
  try {
    await getCode(form.email, 'register')
    ElMessage.success('验证码已发送')
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) clearInterval(timer)
    }, 1000)
  } catch {
    /* handled */
  }
}

async function handleRegister() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  loading.value = true
  try {
    await auth.doRegister(form.email, form.password, form.code)
    ElMessage.success('注册成功，请登录')
    router.push('/login')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  padding: 24px;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: rgba(10, 10, 15, 0.7);
  backdrop-filter: blur(12px);
  padding: 48px 40px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
}

.auth-header {
  text-align: center;
  margin-bottom: 36px;
}

.auth-header h1,
.auth-header .subtitle {
  color: #fff;
}

.auth-header .subtitle {
  color: rgba(255, 255, 255, 0.6);
}

.auth-footer {
  color: rgba(255, 255, 255, 0.6);
}

.auth-footer a {
  color: #c41e3a;
}

.submit-btn {
  width: 100%;
  margin-top: 8px;
  background: var(--jd-primary);
  border: none;
  border-radius: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.submit-btn:hover {
  background: var(--jd-primary-light);
}

.code-row {
  display: flex;
  gap: 12px;
  width: 100%;
}

.code-row .el-input {
  flex: 1;
}

.auth-footer {
  text-align: center;
  margin-top: 32px;
  font-size: 14px;
  color: var(--jd-text-light);
}

.auth-footer a {
  color: var(--jd-primary);
  font-weight: 500;
}
</style>
