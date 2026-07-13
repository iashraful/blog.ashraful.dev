<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="text-center">
      <h1 class="text-6xl font-extrabold text-accent mb-4">{{ error?.statusCode || 500 }}</h1>
      <p class="text-xl text-slate-700 dark:text-slate-300 mb-2">
        {{ error?.statusCode === 404 ? "This page doesn't exist." : 'Something went wrong.' }}
      </p>
      <p v-if="error?.message" class="text-sm text-slate-500 dark:text-slate-400 mb-8">
        {{ error.message }}
      </p>
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors text-sm font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Back home
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()
</script>