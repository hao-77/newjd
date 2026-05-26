<template>
  <div class="profile-page">
    <el-card shadow="never" class="page-card">
      <template #header>
        <span class="card-title">个人中心</span>
      </template>

      <div v-loading="loading" class="profile-body">
        <section class="avatar-section">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            accept="image/jpeg,image/png,image/gif,image/webp"
            :before-upload="beforeAvatarUpload"
            :http-request="handleAvatarUpload"
            :disabled="avatarUploading"
          >
            <div class="avatar-wrap">
              <el-avatar :size="96" :src="avatarDisplay">
                {{ form.userName?.charAt(0) || 'U' }}
              </el-avatar>
              <div class="avatar-mask">
                <el-icon :size="22"><Camera /></el-icon>
                <span>{{ avatarUploading ? '上传中...' : '更换头像' }}</span>
              </div>
            </div>
          </el-upload>
          <p class="avatar-tip">支持 JPG、PNG、GIF、WebP，大小不超过 2MB</p>
        </section>

        <el-divider />

        <el-form :model="form" label-width="100px">
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
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { ElMessage, type UploadRequestOptions } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { updateUser, uploadAndUpdateAvatar } from '@/api/user'

const auth = useAuthStore()
const loading = ref(false)
const saving = ref(false)
const avatarUploading = ref(false)

const form = reactive({
  userName: '',
  email: '',
  phone: '',
  signature: '',
  gender: 2,
})

const avatarDisplay = computed(
  () => auth.user?.avatar || auth.user?.avatarUrl || '',
)

function beforeAvatarUpload(file: File) {
  const isImage = /^image\/(jpeg|png|gif|webp)$/i.test(file.type)
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.warning('只能上传 JPG、PNG、GIF、WebP 格式的图片')
    return false
  }
  if (!isLt2M) {
    ElMessage.warning('图片大小不能超过 2MB')
    return false
  }
  return true
}

async function handleAvatarUpload(options: UploadRequestOptions) {
  const file = options.file as File
  if (auth.devSkipLogin) {
    ElMessage.warning('开发跳过登录模式下无法上传头像，请使用真实账号登录')
    return
  }

  avatarUploading.value = true
  try {
    const avatarUrl = await uploadAndUpdateAvatar(file)
    auth.updateLocalAvatar(avatarUrl)
    ElMessage.success('头像更新成功')
    options.onSuccess?.(avatarUrl)
  } catch {
    ElMessage.error('头像上传失败，请稍后重试')
  } finally {
    avatarUploading.value = false
  }
}

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
  max-width: 640px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--jd-primary-dark);
}

.profile-body {
  padding: 8px 0;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0 8px;
}

.avatar-uploader :deep(.el-upload) {
  border: none;
  border-radius: 50%;
  cursor: pointer;
  overflow: hidden;
}

.avatar-wrap {
  position: relative;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.2s;
}

.avatar-wrap:hover .avatar-mask {
  opacity: 1;
}

.avatar-tip {
  margin-top: 12px;
  font-size: 12px;
  color: #94a3b8;
}
</style>
