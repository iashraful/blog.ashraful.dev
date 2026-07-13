<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-8">
    <!-- Back link -->
    <NuxtLink
      to="/"
      class="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-accent transition-colors mb-8"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
      Back to articles
    </NuxtLink>

    <!-- Error -->
    <ErrorBanner
      v-if="error"
      message="Couldn't load this article."
      @retry="refresh()"
    />

    <!-- Loading -->
    <div v-else-if="pending" class="space-y-4 animate-pulse">
      <div class="h-10 bg-slate-100 dark:bg-slate-700 rounded w-3/4"></div>
      <div class="h-4 bg-slate-100 dark:bg-slate-700 rounded w-1/2"></div>
      <div class="aspect-[16/9] bg-slate-100 dark:bg-slate-700 rounded-xl"></div>
      <div class="space-y-3">
        <div class="h-4 bg-slate-100 dark:bg-slate-700 rounded" v-for="i in 5" :key="i"></div>
      </div>
    </div>

    <!-- Article -->
    <article v-else-if="article">
      <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
        {{ article.title }}
      </h1>

      <!-- Meta -->
      <div class="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <span>{{ formatDate(article.published_at) }}</span>
        <span>&middot;</span>
        <span>{{ article.reading_time_minutes }} min read</span>
        <span v-if="tags.length > 0" class="flex flex-wrap gap-1.5">
          <span
            v-for="tag in tags"
            :key="tag"
            class="px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-accent"
          >
            #{{ tag }}
          </span>
        </span>
      </div>

      <!-- Cover image -->
      <img
        v-if="article.cover_image"
        :src="article.cover_image"
        :alt="article.title"
        class="w-full rounded-xl mb-8"
      />

      <!-- Content -->
      <div
        class="prose-devto"
        v-html="article.body_html"
      ></div>

      <!-- Footer link -->
      <div class="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
        <a
          :href="article.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors text-sm font-medium"
        >
          View on dev.to
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M7 17l9.2-9.2M17 17V7H7" />
          </svg>
        </a>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { getArticleById, normalizeTags } = useDevtoApi()

const { data: article, error, pending, refresh } = await useAsyncData(
  `article-${route.params.id}`,
  () => getArticleById(route.params.id as string)
)

const tags = computed(() => {
  if (!article.value) return []
  return normalizeTags((article.value as any).tag_list)
})

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

useHead({
  title: () => article.value?.title ? `${article.value.title} — Ashraful's Blog` : "Ashraful's Blog",
})
</script>