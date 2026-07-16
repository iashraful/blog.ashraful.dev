<script setup lang="ts">
type IconName =
  | 'calendar'
  | 'clock'
  | 'location'
  | 'external'
  | 'github'
  | 'devto'
  | 'twitter'
  | 'globe'
  | 'arrow-left'
  | 'arrow-up-right'
  | 'sun'
  | 'moon'

withDefaults(defineProps<{ name: IconName; size?: number }>(), { size: 18 })
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <template v-if="name === 'calendar'">
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </template>
    <template v-else-if="name === 'clock'">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </template>
    <template v-else-if="name === 'location'">
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </template>
    <template v-else-if="name === 'external'">
      <path d="M14 5h5v5M19 5l-8 8" />
      <path d="M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </template>
    <template v-else-if="name === 'arrow-up-right'">
      <path d="M5 19 19 5M14 5h5v5" />
    </template>
    <template v-else-if="name === 'github'">
      <path d="M9 19c-4 1.5-4-2-5.5-2.5M15 19v-3.5c0-1 .1-1.5-.5-2 2.5-.3 5-1.2 5-5.5a4.3 4.3 0 0 0-1.2-3C18.5 4 18.6 3 18.4 2.2c0 0-1-.3-3.4 1.2a11.8 11.8 0 0 0-6 0C6.6 1.9 5.6 2.2 5.6 2.2 5.4 3 5.5 4 5.7 5a4.3 4.3 0 0 0-1.2 3c0 4.3 2.5 5.2 5 5.5-.6.5-.6 1.2-.5 2V19" />
    </template>
    <template v-else-if="name === 'devto'">
      <path d="M4 5h3.5c2 0 3 1.2 3 3v8c0 1.8-1 3-3 3H4V5Zm0 3v8M14 8v8c0 1.7 1 3 3 3s3-1.3 3-3V8c0-1.7-1-3-3-3s-3 1.3-3 3Zm0 4h6" />
    </template>
    <template v-else-if="name === 'twitter'">
      <path d="M20 7.5c-.7.3-1.4.5-2.2.6A3.8 3.8 0 0 0 19.5 6c-.7.4-1.6.7-2.5.9A3.7 3.7 0 0 0 10.6 10c0 .3 0 .6.1.8a10.7 10.7 0 0 1-7.8-4 3.7 3.7 0 0 0 1.2 5 3.7 3.7 0 0 1-1.7-.5c0 1.8 1.3 3.4 3.1 3.7-.3.1-.7.1-1 .1-.2 0-.5 0-.7-.1.5 1.6 2 2.7 3.8 2.7A7.5 7.5 0 0 1 3 19.3 10.6 10.6 0 0 0 8.8 21c7 0 10.9-5.8 10.9-10.9v-.5c.7-.5 1.3-1.2 1.8-2.1Z" />
    </template>
    <template v-else-if="name === 'globe'">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </template>
    <template v-else-if="name === 'arrow-left'">
      <path d="m15 18-6-6 6-6M9 12h11" />
    </template>
    <template v-else-if="name === 'sun'">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </template>
    <template v-else-if="name === 'moon'">
      <path d="M20.5 15.2A8.5 8.5 0 0 1 8.8 3.5 8.5 8.5 0 1 0 20.5 15.2Z" />
    </template>
  </svg>
</template>
