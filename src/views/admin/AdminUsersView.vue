<template>
  <div class="admin-page">
    <el-card shadow="never" class="page-card">
      <template #header>
        <div class="card-header">
          <div>
            <h2 class="card-title">用户管理</h2>
            <p class="card-sub">用户列表 · 对接 /admin 接口</p>
          </div>
          <div class="header-actions">
            <el-button type="primary" :icon="Plus" @click="openAdd">添加用户</el-button>
            <el-button :icon="Refresh" :loading="loading" @click="loadUsers">刷新</el-button>
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="users"
        stripe
        border
        @selection-change="onSelectionChange"
      >
        <el-table-column type="selection" width="48" />
        <el-table-column prop="userId" label="用户ID" min-width="160" show-overflow-tooltip />
        <el-table-column label="用户名" min-width="120">
          <template #default="{ row }">{{ row.userName || row.username || '—' }}</template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="160" show-overflow-tooltip />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column label="性别" width="80">
          <template #default="{ row }">{{ genderLabel(row.gender) }}</template>
        </el-table-column>
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status)" size="small">{{ statusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="removeOne(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="selectedIds.length" class="batch-bar">
        <span>已选 {{ selectedIds.length }} 项</span>
        <el-button type="danger" size="small" @click="removeBatch">批量删除</el-button>
      </div>
    </el-card>

    <!-- 编辑 -->
    <el-dialog v-model="editVisible" title="编辑用户" width="480px" destroy-on-close>
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="90px">
        <el-form-item label="用户ID">
          <el-input v-model="editForm.userId" disabled />
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="editForm.userName" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="editForm.phone" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="editForm.password" type="password" show-password placeholder="不修改可留空" />
        </el-form-item>
        <el-form-item label="个性签名">
          <el-input v-model="editForm.signature" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="editForm.gender">
            <el-radio :value="0">男</el-radio>
            <el-radio :value="1">女</el-radio>
            <el-radio :value="2">保密</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="editForm.status" style="width: 100%">
            <el-option label="正常" :value="1" />
            <el-option label="封禁" :value="2" />
            <el-option label="注销" :value="3" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="saveEdit">保存</el-button>
      </template>
    </el-dialog>

    <!-- 新增 -->
    <el-dialog v-model="addVisible" title="添加用户" width="440px" destroy-on-close>
      <el-form ref="addFormRef" :model="addForm" :rules="addRules" label-width="90px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="saveAdd">添加</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Plus, Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { getAdminUsers, adminUpdateUser, adminAddUser, adminDeleteUsers } from '@/api/admin'
import type { AdminUser } from '@/types/api'

const loading = ref(false)
const saving = ref(false)
const users = ref<AdminUser[]>([])
const selectedIds = ref<string[]>([])

const editVisible = ref(false)
const addVisible = ref(false)
const editFormRef = ref<FormInstance>()
const addFormRef = ref<FormInstance>()

const editForm = reactive({
  userId: '',
  userName: '',
  email: '',
  phone: '',
  password: '',
  signature: '',
  gender: 2,
  status: 1,
})

const addForm = reactive({
  username: '',
  email: '',
  password: '',
})

const editRules: FormRules = {
  userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }],
}

const addRules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '至少6位', trigger: 'blur' },
  ],
}

function genderLabel(g?: number) {
  if (g === 0) return '男'
  if (g === 1) return '女'
  return '保密'
}

function statusLabel(s?: number) {
  if (s === 1) return '正常'
  if (s === 2) return '封禁'
  if (s === 3) return '注销'
  return '未知'
}

function statusTagType(s?: number) {
  if (s === 1) return 'success'
  if (s === 2) return 'danger'
  if (s === 3) return 'info'
  return 'warning'
}

function normalizeUsers(data: unknown): AdminUser[] {
  if (Array.isArray(data)) return data as AdminUser[]
  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>
    if (Array.isArray(d.list)) return d.list as AdminUser[]
    if (Array.isArray(d.records)) return d.records as AdminUser[]
    return [data as AdminUser]
  }
  return []
}

async function loadUsers() {
  loading.value = true
  try {
    const res = await getAdminUsers()
    users.value = normalizeUsers(res.data)
  } finally {
    loading.value = false
  }
}

function onSelectionChange(rows: AdminUser[]) {
  selectedIds.value = rows.map((r) => r.userId).filter(Boolean)
}

function openEdit(row: AdminUser) {
  Object.assign(editForm, {
    userId: row.userId,
    userName: row.userName || row.username || '',
    email: row.email || '',
    phone: row.phone || '',
    password: '',
    signature: row.signature || '',
    gender: row.gender ?? 2,
    status: row.status ?? 1,
  })
  editVisible.value = true
}

async function saveEdit() {
  const valid = await editFormRef.value?.validate().catch(() => false)
  if (!valid) return
  saving.value = true
  try {
    const payload: Partial<AdminUser> = {
      userId: editForm.userId,
      userName: editForm.userName,
      email: editForm.email,
      phone: editForm.phone,
      signature: editForm.signature,
      gender: editForm.gender,
      status: editForm.status,
    }
    if (editForm.password) payload.password = editForm.password
    await adminUpdateUser(payload)
    ElMessage.success('用户信息已更新')
    editVisible.value = false
    await loadUsers()
  } finally {
    saving.value = false
  }
}

function openAdd() {
  addForm.username = ''
  addForm.email = ''
  addForm.password = ''
  addVisible.value = true
}

async function saveAdd() {
  const valid = await addFormRef.value?.validate().catch(() => false)
  if (!valid) return
  saving.value = true
  try {
    await adminAddUser({ ...addForm })
    ElMessage.success('用户添加成功')
    addVisible.value = false
    await loadUsers()
  } finally {
    saving.value = false
  }
}

async function removeOne(row: AdminUser) {
  await ElMessageBox.confirm(`确定删除用户 ${row.userName || row.userId}？`, '删除确认', {
    type: 'warning',
  })
  await adminDeleteUsers([row.userId])
  ElMessage.success('已删除')
  await loadUsers()
}

async function removeBatch() {
  await ElMessageBox.confirm(`确定删除选中的 ${selectedIds.value.length} 个用户？`, '批量删除', {
    type: 'warning',
  })
  await adminDeleteUsers(selectedIds.value)
  ElMessage.success('批量删除成功')
  selectedIds.value = []
  await loadUsers()
}

onMounted(loadUsers)
</script>

<style scoped>
.admin-page {
  max-width: 1200px;
}

.page-card {
  border-radius: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--jd-primary-dark);
  margin: 0 0 4px;
}

.card-sub {
  font-size: 12px;
  color: #94a3b8;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.batch-bar {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #64748b;
}
</style>
