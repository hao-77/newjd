<template>
  <div class="detect-page">
    <el-card shadow="never" class="page-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">文本/链接风险检测</span>
          <el-tag type="info">/ai/detect2</el-tag>
        </div>
      </template>

      <el-form :model="form" label-width="120px" @submit.prevent="detect">
        <el-form-item label="检测内容">
          <el-input v-model="form.content" type="textarea" :rows="4" placeholder="输入可疑文本或 URL" />
        </el-form-item>
        <el-form-item label="内容类型">
          <el-select v-model="form.content_type" style="width: 200px">
            <el-option label="文本 text" value="text" />
            <el-option label="图片 image" value="image" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否为 URL">
          <el-switch v-model="form.is_url" />
        </el-form-item>
        <el-button type="primary" :loading="loading" native-type="submit">开始检测</el-button>
      </el-form>

      <el-alert v-if="result" class="result-box" title="检测结果" type="warning" :closable="false" show-icon>
        <pre>{{ result }}</pre>
      </el-alert>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { detectContent } from '@/api/ai'

const loading = ref(false)
const result = ref('')

const form = reactive({
  content: '',
  content_type: 'text',
  is_url: false,
})

async function detect() {
  if (!form.content.trim()) return
  loading.value = true
  result.value = ''
  try {
    const res = await detectContent(form)
    result.value = JSON.stringify(res.data, null, 2)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page-card {
  border-radius: 12px;
  min-width:890px;
}.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
}
.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--jd-primary-dark);
}
.result-box {
  margin-top: 24px;
}
.result-box pre {
  white-space: pre-wrap;
  font-size: 13px;
  margin-top: 8px;
}
</style>
