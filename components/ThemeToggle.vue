<template>
  <button
    type="button"
    @click="toggle"
    class="size-11 rounded-full border border-stone bg-paper/70 p-2 text-ink transition-colors hover:border-accent hover:bg-white hover:text-accent dark:border-stone/40 dark:bg-ink/70 dark:text-paper dark:hover:border-indigo-300 dark:hover:bg-ink dark:hover:text-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent dark:focus-visible:outline-indigo-300"
    :aria-label="colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    :title="colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <AppIcon v-if="colorMode.value === 'dark'" name="sun" :size="18" />
    <AppIcon v-else name="moon" :size="18" />
  </button>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

function toggle() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
