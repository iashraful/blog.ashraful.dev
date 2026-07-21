<script setup lang="ts">
const props = defineProps<{ title: string; url: string }>()

const copied = ref(false)

let copyTimer: ReturnType<typeof setTimeout> | null = null

function shareX() {
  window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(props.title)}&url=${encodeURIComponent(props.url)}`,
    '_blank',
    'width=600,height=400',
  )
}

function shareLinkedin() {
  window.open(
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(props.url)}`,
    '_blank',
    'width=600,height=400',
  )
}

function shareFacebook() {
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(props.url)}`,
    '_blank',
    'width=600,height=400',
  )
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(props.url)
    copied.value = true
    if (copyTimer) clearTimeout(copyTimer)
    copyTimer = setTimeout(() => {
      copied.value = false
      copyTimer = null
    }, 2000)
  }
  catch {
    // Clipboard API not available — silently fail
  }
}

onUnmounted(() => {
  if (copyTimer) clearTimeout(copyTimer)
})
</script>

<template>
  <div class="hidden md:flex flex-col items-center gap-4 sticky top-1/2 -translate-y-1/2">
    <span class="text-xs font-semibold uppercase tracking-[0.16em] text-ink/50 dark:text-paper/50 [writing-mode:vertical-lr] mb-2">
      Share
    </span>
    <button
      aria-label="Share on X"
      class="p-2 rounded-lg text-ink/60 dark:text-paper/60 hover:text-accent dark:hover:text-indigo-300 hover:bg-accent/5 dark:hover:bg-white/5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:focus-visible:outline-indigo-300"
      @click="shareX"
    >
      <AppIcon name="x" :size="18" />
    </button>
    <button
      aria-label="Share on LinkedIn"
      class="p-2 rounded-lg text-ink/60 dark:text-paper/60 hover:text-accent dark:hover:text-indigo-300 hover:bg-accent/5 dark:hover:bg-white/5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:focus-visible:outline-indigo-300"
      @click="shareLinkedin"
    >
      <AppIcon name="linkedin" :size="18" />
    </button>
    <button
      aria-label="Share on Facebook"
      class="p-2 rounded-lg text-ink/60 dark:text-paper/60 hover:text-accent dark:hover:text-indigo-300 hover:bg-accent/5 dark:hover:bg-white/5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:focus-visible:outline-indigo-300"
      @click="shareFacebook"
    >
      <AppIcon name="facebook" :size="18" />
    </button>
    <button
      :aria-label="copied ? 'Link copied' : 'Copy link'"
      class="p-2 rounded-lg text-ink/60 dark:text-paper/60 hover:text-accent dark:hover:text-indigo-300 hover:bg-accent/5 dark:hover:bg-white/5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:focus-visible:outline-indigo-300"
      @click="copyLink"
    >
      <AppIcon :name="copied ? 'check' : 'link'" :size="18" />
    </button>
  </div>
</template>
