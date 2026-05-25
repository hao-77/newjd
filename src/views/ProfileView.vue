<template>
  <div class="profile-page">
    <el-card shadow="never" class="page-card">
      <template #header>
        <span class="card-title">个人中心</span>
      </template>

      <el-form :model="form" label-width="100px" v-loading="loading">
        <el-form-item label="用户名">
          <el-input v-model="form.userName" placeholder="昵称" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" placeholder="邮箱" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone" placeholder="手机号" />
        </el-form-item>
        <el-form-item label="个性签名">
          <el-input v-model="form.signature" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.gender">
            <el-radio :value="0">男</el-radio>
            <el-radio :value="1">女</el-radio>
            <el-radio :value="2">保密</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="saving" @click="saveProfile">保存修改</el-button>
          <el-button @click="loadProfile">刷新</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { updateUser } from '@/api/user'

const auth = useAuthStore()
const loading = ref(false)
const saving = ref(false)

const form = reactive({
  userName: '',
  email: '',
  phone: '',
  signature: '',
  gender: 2,
})

async function loadProfile() {
  loading.value = true
  try {
    await auth.fetchUserInfo()
    Object.assign(form, {
      userName: auth.user?.userName || '',
      email: auth.user?.email || '',
      phone: auth.user?.phone || '',
      signature: auth.user?.signature || '',
      gender: auth.user?.gender ?? 2,
    })
  } finally {
    loading.value = false
  }
}

async function saveProfile() {
  saving.value = true
  try {
    await updateUser({ ...form })
    ElMessage.success('保存成功')
    await loadProfile()
  } finally {
    saving.value = false
  }
}

onMounted(loadProfile)
</script>

<style scoped>
.page-card {
  border-radius: 12px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--jd-primary-dark);
}
</style>
