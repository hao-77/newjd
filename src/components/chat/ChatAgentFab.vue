<template>
  <router-link v-if="showFab" to="/assistant" class="chat-fab">
    <el-icon :size="28"><ChatDotRound /></el-icon>
    <span class="fab-label">助手</span>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const showFab = computed(() => route.path !== '/assistant')
</script>

<style scoped>
.chat-fab {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 2000;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1976d2, #0d47a1);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 24px rgba(13, 71, 161, 0.4);
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
}

.chat-fab:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 32px rgba(13, 71, 161, 0.5);
  color: #fff;
}

.fab-label {
  font-size: 10px;
  margin-top: 2px;
}
</style>
