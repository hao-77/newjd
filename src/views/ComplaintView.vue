<template>
  <div class="complaint-page">
    <el-card shadow="never" class="page-card">
      <template #header>
        <span class="card-title">投诉反馈</span>
      </template>

      <el-form @submit.prevent="submit">
        <el-form-item label="投诉内容">
          <el-input
            v-model="text"
            type="textarea"
            :rows="5"
            placeholder="请描述您遇到的问题或可疑情况..."
          />
        </el-form-item>
        <el-button type="primary" :loading="loading" native-type="submit">提交投诉</el-button>
      </el-form>
    </el-card>

    <el-card shadow="never" class="page-card" style="margin-top: 24px" v-loading="listLoading">
      <template #header>
        <span class="card-title">历史记录</span>
      </template>
      <el-empty v-if="!complaints.length" description="暂无投诉记录" />
      <div v-else class="complaint-list">
        <div v-for="(item, i) in complaints" :key="i" class="complaint-item">
          {{ formatItem(item) }}
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { submitComplaint, getComplaints } from '@/api/ai'

const text = ref('')
const loading = ref(false)
const listLoading = ref(false)
const complaints = ref([])

function formatItem(item) {
  if (typeof item === 'string') return item
  if (item && typeof item === 'object' && 'text' in item) {
    return String(item.text)
  }
  return JSON.stringify(item)
}

async function submit() {
  if (!text.value.trim()) {
    ElMessage.warning('请输入投诉内容')
    return
  }
  loading.value = true
  try {
    await submitComplaint(text.value.trim())
    ElMessage.success('提交成功')
    text.value = ''
    await loadList()
  } finally {
    loading.value = false
  }
}

async function loadList() {
  listLoading.value = true
  try {
    const res = await getComplaints()
    complaints.value = Array.isArray(res.data) ? res.data : res.data ? [res.data] : []
  } finally {
    listLoading.value = false
  }
}

onMounted(loadList)
</script>

<style scoped>
.page-card {
  border-radius: 12px;
  min-width:890px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--jd-primary-dark);
}

.complaint-item {
  padding: 12px 16px;
  background: #f5f9ff;
  border-radius: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  line-height: 1.6;
}
</style>
