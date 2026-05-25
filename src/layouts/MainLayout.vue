<template>
  <div class="main-layout">
    <AppHeader />
    <div class="layout-body">
      <AppSidebar />
      <main class="main-content" :class="{ 'assistant-mode': isAssistantPage }">
        <router-view />
      </main>
    </div>
    <ChatAgentFab v-if="!isAssistantPage" />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ChatAgentFab from '@/components/chat/ChatAgentFab.vue'

const route = useRoute()
const isAssistantPage = computed(() => route.path === '/assistant')
</script>

<style scoped>
.main-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.layout-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: var(--jd-bg);
}

.main-content.assistant-mode {
  padding: 24px;
  overflow: hidden;
}
</style>
