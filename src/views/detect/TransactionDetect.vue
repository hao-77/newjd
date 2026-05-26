<template>
  <div class="detect-page">
    <el-card shadow="never" class="page-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">交易欺诈检测</span>
          <el-tag type="info">/ai/detect1</el-tag>
        </div>
      </template>

      <el-form :model="form" label-width="120px" @submit.prevent="detect">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="步骤 step">
              <el-input v-model="form.step" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型 type">
              <el-input v-model="form.type" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="金额 amount">
              <el-input v-model="form.amount" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收款方 nameDest">
              <el-input v-model="form.nameDest" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原账户余额">
              <el-input v-model="form.oldbalanceOrg" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原账户新余额">
              <el-input v-model="form.newbalanceOrig" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标账户余额">
              <el-input v-model="form.oldbalanceDest" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标账户新余额">
              <el-input v-model="form.newbalanceDest" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-button type="primary" :loading="loading" native-type="submit">开始检测</el-button>
      </el-form>

      <el-alert v-if="result" class="result-box" :title="resultTitle" type="warning" :closable="false" show-icon>
        <pre>{{ result }}</pre>
      </el-alert>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { detectTransaction } from '@/api/ai'

const loading = ref(false)
const result = ref('')

const form = reactive({
  step: '1',
  type: 'TRANSFER',
  amount: '10000',
  nameDest: '',
  oldbalanceOrg: '50000',
  newbalanceOrig: '40000',
  oldbalanceDest: '0',
  newbalanceDest: '10000',
})

const resultTitle = computed(() => '检测结果')

async function detect() {
  loading.value = true
  result.value = ''
  try {
    const res = await detectTransaction(form)
    result.value = JSON.stringify(res.data, null, 2)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page-card {
  border-radius: 12px;
}

.card-header {
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
