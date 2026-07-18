<template>
  <article class="group relative overflow-hidden border border-stone bg-paper shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-editorial dark:bg-ink">
    <NuxtLink :to="`/article/${encodeURIComponent(article.slug)}`" class="block">
      <div
        v-if="article.cover_image"
        class="relative aspect-[16/9] overflow-hidden bg-stone/40 dark:bg-white/10"
      >
        <img
          :src="article.cover_image"
          :alt="article.title"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        >
      </div>
      <div
        v-else
        class="relative flex aspect-[16/9] items-center justify-center overflow-hidden bg-gradient-to-br from-accent via-accent-hover to-coral"
      >
        <span class="font-display text-8xl text-paper/30">{{ article.title.charAt(0) }}</span>
      </div>
      <span class="absolute left-4 top-4 border border-paper/50 bg-ink/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-paper">{{ formatDate(article.published_at) }}</span>
    </NuxtLink>

    <div class="p-5 sm:p-6">
      <div class="mb-4 flex flex-wrap gap-2">
        <NuxtLink
          v-for="tag in tags"
          :key="tag"
          :to="`/tags/${encodeURIComponent(tag)}`"
          class="border border-stone px-2 py-1 text-[11px] font-medium text-ink/75 transition-colors hover:border-accent hover:text-accent dark:text-paper/75 dark:hover:text-indigo-300"
        >
          #{{ tag }}
        </NuxtLink>
      </div>

      <NuxtLink :to="`/article/${encodeURIComponent(article.slug)}`" class="block">
        <h3 class="mb-2 line-clamp-2 text-2xl leading-tight transition-colors group-hover:text-accent dark:group-hover:text-indigo-300">
          {{ article.title }}
        </h3>
      </NuxtLink>

      <p class="mb-5 line-clamp-2 text-sm leading-6 text-ink/80 dark:text-paper/80">
        {{ article.description || 'Article summary unavailable.' }}
      </p>

      <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink/75 dark:text-paper/75">
        <span class="inline-flex items-center gap-1.5"><AppIcon name="calendar" :size="14" />{{ formatDate(article.published_at) }}</span>
        <span class="inline-flex items-center gap-1.5"><AppIcon name="clock" :size="14" />{{ article.reading_time_minutes }} min read</span>
        <span class="inline-flex items-center gap-1.5">{{ article.positive_reactions_count }} reactions</span>
        <span class="inline-flex items-center gap-1.5">{{ article.comments_count }} comments</span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { DevtoArticleSummary } from '~/composables/useDevtoApi'

const props = defineProps<{
  article: DevtoArticleSummary
}>()

const { normalizeTags } = useDevtoApi()
const tags = computed(() => normalizeTags(props.article.tag_list))

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>
