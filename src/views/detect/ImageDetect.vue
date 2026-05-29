<template>
  <div class="detect-page">
    <el-card shadow="never" class="page-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">图片诈骗分析</span>
          <el-tag type="info">/ai/image</el-tag>
        </div>
      </template>

      <el-upload drag :auto-upload="false" :show-file-list="false" accept="image/*" @change="onFileChange">
        <el-icon :size="48"><UploadFilled /></el-icon>
        <div>拖拽或点击上传可疑图片</div>
      </el-upload>

      <div v-if="preview" class="preview">
        <img :src="preview" alt="preview" />
      </div>

      <el-button type="primary" :loading="loading" :disabled="!file" style="margin-top: 16px" @click="detect">
        分析图片
      </el-button>

      <el-alert v-if="result" class="result-box" title="分析结果" type="warning" :closable="false" show-icon>
        <pre>{{ result }}</pre>
      </el-alert>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { detectImage } from '@/api/ai'

const file = ref(null)
const preview = ref('')
const loading = ref(false)
const result = ref('')

function onFileChange(uploadFile) {
  const raw = uploadFile.raw
  if (!raw) return
  file.value = raw
  preview.value = URL.createObjectURL(raw)
}

async function detect() {
  if (!file.value) return
  loading.value = true
  result.value = ''
  try {
    const res = await detectImage(file.value)
    result.value = JSON.stringify(res.data, null, 2)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.detect-page {
  padding: 40px;
  min-height: calc(100vh - 64px);
}

.page-card {
  border-radius: 16px;
  background: rgba(10, 10, 15, 0.5) !important;
  backdrop-filter: blur(12px) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}
.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
}
.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

.desc {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 20px;
  font-size: 14px;
}
.preview {
  margin-top: 16px;
  max-width: 400px;
}
.preview img {
  width: 100%;
  border-radius: 8px;
  border: 1px solid #eee;
}
.result-box {
  margin-top: 24px;
}
.result-box pre {
  white-space: pre-wrap;
  font-size: 13px;
}
</style>
