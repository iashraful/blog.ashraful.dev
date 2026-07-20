<template>
  <div class="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
    <NuxtLink
      to="/"
      class="mb-8 inline-flex min-h-11 items-center gap-2 py-2 text-sm font-semibold text-ink/80 transition-colors hover:text-accent dark:text-paper/80 dark:hover:text-indigo-300"
    >
      <AppIcon name="arrow-left" :size="16" />
      Back to articles
    </NuxtLink>

    <div class="mb-8 border-b border-stone pb-5">
      <p class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink dark:text-paper">Tag archive</p>
      <h1 class="text-4xl sm:text-5xl">#{{ tag }}</h1>
    </div>

    <ErrorBanner v-if="error" message="Couldn't load articles. Please try again." @retry="refresh()" />

    <div v-else-if="pending" class="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="i in 6" :key="i" class="aspect-[4/5] animate-pulse border border-stone bg-stone/50 dark:bg-white/10" />
    </div>

    <div v-else-if="articles.length === 0" class="py-16 text-center">
      <p class="text-lg text-ink/75 dark:text-paper/75">No articles use #{{ tag }} yet.</p>
    </div>

    <template v-else>
      <div class="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
        <ArticleCard
          v-for="article in articles"
          :key="article.id"
          :article="article"
        />
      </div>

      <div v-if="hasMore" class="mt-10 text-center">
        <button
          type="button"
          class="min-h-11 rounded-full border border-stone px-5 py-2 text-sm font-semibold transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-60 dark:hover:text-indigo-300"
          :disabled="isLoadingMore"
          @click="loadMore"
        >
          {{ isLoadingMore ? 'Loading more articles' : 'Load more' }}
        </button>
        <ErrorBanner
          v-if="loadMoreError"
          class="mt-4 text-left"
          message="Couldn't load more articles. Please try again."
          @retry="loadMore"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { DevtoArticleSummary } from '~/shared/types/devto'
import { appendArticlePage, hasNextPage } from '~/composables/useArticlePagination'

const route = useRoute()
const { getArticlesByTag } = useDevtoApi()
const tag = computed(() => decodeURIComponent(String(route.params.tag || '')).trim())
const page = ref(1)
const articles = ref<DevtoArticleSummary[]>([])
const hasMore = ref(true)
const isLoadingMore = ref(false)
const loadMoreError = ref(false)

const { data: firstPage, error, pending, refresh } = await useAsyncData(
  () => `devto-tag-${tag.value}`,
  () => getArticlesByTag(tag.value, 1),
)

watch(firstPage, (value) => {
  articles.value = value || []
  page.value = 1
  hasMore.value = hasNextPage(value || [])
}, { immediate: true })

async function loadMore() {
  isLoadingMore.value = true
  loadMoreError.value = false

  try {
    const nextPage = page.value + 1
    const nextArticles = await getArticlesByTag(tag.value, nextPage)
    articles.value = appendArticlePage(articles.value, nextArticles)
    page.value = nextPage
    hasMore.value = hasNextPage(nextArticles)
  }
  catch {
    loadMoreError.value = true
  }
  finally {
    isLoadingMore.value = false
  }
}

const siteUrl = useRuntimeConfig().public.siteUrl

useHead({
  title: () => `${tag.value} Articles — Ashraful's Blog`,
  meta: () => [
    { name: 'description', content: `Articles tagged with #${tag.value} on Ashraful's Blog.` },
    { property: 'og:title', content: `${tag.value} Articles — Ashraful's Blog` },
    { property: 'og:description', content: `Articles tagged with #${tag.value}.` },
    { property: 'og:url', content: `${siteUrl}/tags/${encodeURIComponent(tag.value)}` },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: `${tag.value} Articles — Ashraful's Blog` },
    { name: 'twitter:description', content: `Articles tagged with #${tag.value}.` },
  ],
  link: () => [{ rel: 'canonical', href: `${siteUrl}/tags/${encodeURIComponent(tag.value)}` }],
})
</script>
