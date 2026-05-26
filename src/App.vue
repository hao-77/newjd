<template>
  <router-view />
  <EmergencyAlertOverlay
    :visible="emergencyVisible"
    @close="closeAlert"
    @call="callHotline"
  />
</template>

<script setup lang="ts">
import EmergencyAlertOverlay from '@/components/emergency/EmergencyAlertOverlay.vue'
import { useEmergencyAlert } from '@/composables/useEmergencyAlert'

const { visible: emergencyVisible, closeAlert, callHotline } = useEmergencyAlert()
</script>
