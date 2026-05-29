<template>
  <div class="detect-page">
    <el-card shadow="never" class="page-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">语音克隆检测</span>
          <el-tag type="info">/ai/audio</el-tag>
        </div>
      </template>

      <p class="desc">上传音频文件，系统将分析 AI 合成率，识别语音克隆等新型欺诈手段。</p>

      <el-upload drag :auto-upload="false" :show-file-list="false" accept="audio/*" @change="onFileChange">
        <el-icon :size="48"><Microphone /></el-icon>
        <div>拖拽或点击上传音频文件</div>
      </el-upload>

      <div v-if="fileName" class="file-name">
        <el-icon><Document /></el-icon> {{ fileName }}
      </div>

      <el-button type="primary" :loading="loading" :disabled="!file" style="margin-top: 16px" @click="detect">
        检测 AI 率
      </el-button>

      <el-alert v-if="result" class="result-box" title="检测结果" type="warning" :closable="false" show-icon>
        <pre>{{ result }}</pre>
      </el-alert>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { detectAudio } from '@/api/ai'

const file = ref(null)
const fileName = ref('')
const loading = ref(false)
const result = ref('')

function onFileChange(uploadFile) {
  const raw = uploadFile.raw
  if (!raw) return
  file.value = raw
  fileName.value = raw.name
}

async function detect() {
  if (!file.value) return
  loading.value = true
  result.value = ''
  try {
    const res = await detectAudio(file.value)
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
.file-name {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--jd-primary);
}
.result-box {
  margin-top: 24px;
}
.result-box pre {
  white-space: pre-wrap;
  font-size: 13px;
}
</style>
