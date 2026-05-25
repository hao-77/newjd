<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <el-icon :size="48" color="#1565c0"><Lock /></el-icon>
        <h1>金盾卫士</h1>
        <p>登录您的账户</p>
      </div>

      <el-tabs v-model="loginType" class="login-tabs">
        <el-tab-pane label="密码登录" name="password">
          <el-form ref="formRef" :model="form" :rules="rules" @submit.prevent="handleLogin">
            <el-form-item prop="email">
              <el-input v-model="form.email" placeholder="邮箱" prefix-icon="Message" size="large" />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="form.password"
                type="password"
                placeholder="密码"
                prefix-icon="Lock"
                size="large"
                show-password
              />
              <div class="forgot-link">
                <router-link to="/forgot-password">忘记密码？</router-link>
              </div>
            </el-form-item>
            <el-button type="primary" size="large" class="submit-btn" :loading="loading" native-type="submit">
              登录
            </el-button>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="验证码登录" name="code">
          <el-form ref="codeFormRef" :model="codeForm" :rules="codeRules" @submit.prevent="handleCodeLogin">
            <el-form-item prop="email">
              <el-input v-model="codeForm.email" placeholder="邮箱" prefix-icon="Message" size="large" />
            </el-form-item>
            <el-form-item prop="code">
              <div class="code-row">
                <el-input v-model="codeForm.code" placeholder="验证码" prefix-icon="Key" size="large" />
                <el-button :disabled="countdown > 0" @click="sendCode('login')">
                  {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
                </el-button>
              </div>
            </el-form-item>
            <el-button type="primary" size="large" class="submit-btn" :loading="loading" native-type="submit">
              登录
            </el-button>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <div class="auth-footer">
        还没有账号？<router-link to="/register">立即注册</router-link>
      </div>

      <div v-if="auth.isDev" class="dev-skip">
        <el-divider>开发调试</el-divider>
        <el-button type="warning" plain size="large" class="dev-skip-btn" @click="handleDevSkip">
          跳过登录（仅开发环境）
        </el-button>
        <p class="dev-skip-tip">使用本地模拟账号进入系统，接口仍可能需真实 token</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { getCode } from '@/api/user'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const loginType = ref('password')
const loading = ref(false)
const countdown = ref(0)
const formRef = ref<FormInstance>()
const codeFormRef = ref<FormInstance>()

const form = reactive({ email: '', password: '' })
const codeForm = reactive({ email: '', code: '' })

const rules: FormRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' },
  ],
}

const codeRules: FormRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
}

async function sendCode(type: string) {
  const email = loginType.value === 'password' ? form.email : codeForm.email
  if (!email) {
    ElMessage.warning('请先输入邮箱')
    return
  }
  try {
    await getCode(email, type)
    ElMessage.success('验证码已发送')
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) clearInterval(timer)
    }, 1000)
  } catch {
    /* handled by interceptor */
  }
}

async function handleLogin() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  loading.value = true
  try {
    await auth.doLogin(form.email, form.password)
    ElMessage.success('登录成功')
    router.push((route.query.redirect as string) || '/')
  } finally {
    loading.value = false
  }
}

async function handleCodeLogin() {
  const valid = await codeFormRef.value?.validate().catch(() => false)
  if (!valid) return
  loading.value = true
  try {
    await auth.doLoginByCode(codeForm.email, codeForm.code)
    ElMessage.success('登录成功')
    router.push((route.query.redirect as string) || '/')
  } finally {
    loading.value = false
  }
}

function handleDevSkip() {
  auth.skipLoginForDev()
  ElMessage.warning('已进入开发跳过登录模式')
  router.push((route.query.redirect as string) || '/')
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e3f2fd 0%, #1565c0 100%);
  padding: 24px;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.auth-header h1 {
  font-size: 28px;
  color: var(--jd-primary-dark);
  margin: 12px 0 4px;
}

.auth-header p {
  color: #888;
  font-size: 14px;
}

.login-tabs {
  margin-bottom: 16px;
}

.submit-btn {
  width: 100%;
  margin-top: 8px;
}

.code-row {
  display: flex;
  gap: 8px;
  width: 100%;
}

.code-row .el-input {
  flex: 1;
}

.forgot-link {
  width: 100%;
  text-align: right;
  margin-top: 6px;
}

.forgot-link a {
  font-size: 13px;
  color: var(--jd-primary);
}

.auth-footer {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #666;
}

.auth-footer a {
  color: var(--jd-primary);
  font-weight: 500;
}

.dev-skip {
  margin-top: 8px;
}

.dev-skip-btn {
  width: 100%;
}

.dev-skip-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #94a3b8;
  text-align: center;
  line-height: 1.5;
}
</style>
