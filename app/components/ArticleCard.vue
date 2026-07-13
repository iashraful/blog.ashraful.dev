<template>
  <NuxtLink
    :to="`/article/${article.id}`"
    class="group block rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-accent transition-all duration-200"
  >
    <div
      v-if="article.cover_image"
      class="aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-700"
    >
      <img
        :src="article.cover_image"
        :alt="article.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
    </div>
    <div
      v-else
      class="aspect-[16/9] bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center"
    >
      <span class="text-white text-4xl font-bold opacity-50">{{ article.title.charAt(0) }}</span>
    </div>

    <div class="p-5">
      <div class="flex flex-wrap gap-1.5 mb-3">
        <span
          v-for="tag in tags"
          :key="tag"
          class="px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-accent"
        >
          #{{ tag }}
        </span>
      </div>

      <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-accent transition-colors line-clamp-2">
        {{ article.title }}
      </h3>

      <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
        {{ article.description }}
      </p>

      <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
        <span>{{ formatDate(article.published_at) }}</span>
        <span>&middot;</span>
        <span>{{ article.reading_time_minutes }} min read</span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
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