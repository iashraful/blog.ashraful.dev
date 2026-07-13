<template>
  <div class="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 text-center">
    <p class="text-red-700 dark:text-red-400 font-medium mb-3">{{ message }}</p>
    <button
      @click="$emit('retry')"
      class="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors text-sm font-medium"
    >
      Try again
    </button>
  </div>
</template>

<script setup>
defineProps<{
  message: string
}>()

defineEmits<{
  retry: []
}>()
</script>