<template>
  <div class="bg-paper text-ink dark:bg-ink dark:text-paper">
    <section class="border-b border-stone/80 bg-paper dark:bg-ink">
      <div class="mx-auto grid max-w-6xl items-end gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.35fr_0.65fr] lg:gap-20">
        <div>
          <h1 class="max-w-3xl text-5xl leading-[0.98] sm:text-7xl">
            Thoughts from the interface between people and software.
          </h1>
          <p class="mt-8 max-w-xl text-base leading-7 text-ink/80 dark:text-paper/80 sm:text-lg">
            {{ user?.summary || 'Software developer sharing thoughtful notes on code, tools, and technology.' }}
          </p>
          <a href="#articles" class="mt-10 inline-flex min-h-11 items-center gap-3 py-2 text-sm font-semibold text-accent transition-colors hover:text-accent-hover dark:text-indigo-300 dark:hover:text-indigo-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent dark:focus-visible:outline-indigo-300">
            Latest writing
            <AppIcon name="arrow-up-right" :size="17" />
          </a>
        </div>

        <div class="flex items-center gap-5 border-l border-coral pl-6 lg:mb-2">
          <img
            v-if="user?.profile_image"
            :src="user.profile_image"
            :alt="user?.name || 'Ashraful'"
            class="h-20 w-20 rounded-full border border-stone object-cover grayscale"
          />
          <div>
            <p class="text-sm font-semibold">{{ user?.name || 'Ashraful' }}</p>
            <p class="mt-1 text-sm text-ink/75 dark:text-paper/75">Independent developer and lifelong learner.</p>
          </div>
        </div>
      </div>
    </section>

    <section id="articles" class="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
      <div class="mb-8 flex items-end justify-between gap-4 border-b border-stone pb-5">
        <div>
          <p class="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink dark:text-paper">
            <span class="size-2 rounded-full bg-coral" aria-hidden="true"></span>
            The archive
          </p>
          <h2 class="text-4xl sm:text-5xl">Latest writing</h2>
        </div>
        <span v-if="articles" class="pb-1 text-sm text-ink/75 dark:text-paper/75">{{ articleCount }} {{ articleCount === 1 ? 'article' : 'articles' }}</span>
      </div>

      <!-- Error -->
      <ErrorBanner
        v-if="error"
        message="Couldn't load articles. Please try again."
        @retry="refresh()"
      />

      <!-- Loading -->
      <div v-else-if="pending" class="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="i in 6"
          :key="i"
          class="overflow-hidden border border-stone animate-pulse"
        >
          <div class="aspect-[16/9] bg-stone/50 dark:bg-white/10"></div>
          <div class="space-y-3 p-5">
            <div class="h-4 w-3/4 rounded bg-stone/50 dark:bg-white/10"></div>
            <div class="h-3 rounded bg-stone/50 dark:bg-white/10"></div>
            <div class="h-3 w-1/2 rounded bg-stone/50 dark:bg-white/10"></div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="articles && articles.length === 0" class="py-16 text-center">
        <p class="text-lg text-ink/75 dark:text-paper/75">No articles yet. Check back soon.</p>
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
        <ArticleCard
          v-for="article in articles"
          :key="article.id"
          :article="article"
        />
      </div>

      <div v-if="articles.length > 0 && hasMore" class="mt-10 text-center">
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
    </section>
  </div>
</template>

<script setup lang="ts">
import type { DevtoArticleSummary } from '~/shared/types/devto'
import { appendArticlePage, hasNextPage } from '~/composables/useArticlePagination'

const { getUser, getArticles } = useDevtoApi()

const { data: user } = await useAsyncData('devto-user', () => getUser())

const { data: firstPage, error, pending, refresh } = await useAsyncData('devto-articles', () => getArticles(1))

const articles = ref<DevtoArticleSummary[]>([])
const page = ref(1)
const hasMore = ref(true)
const isLoadingMore = ref(false)
const loadMoreError = ref(false)

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
    const nextArticles = await getArticles(nextPage)
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

const articleCount = computed(() => articles.value.length)

const siteUrl = useRuntimeConfig().public.siteUrl

useHead({
  title: "Ashraful's Blog",
  meta: [
    { name: 'description', content: user.value?.summary || 'Software developer sharing thoughtful notes on code, tools, and technology.' },
    { property: 'og:title', content: "Ashraful's Blog" },
    { property: 'og:description', content: user.value?.summary || 'Thoughts from the interface between people and software.' },
    { property: 'og:image', content: user.value?.profile_image || '' },
    { property: 'og:url', content: siteUrl },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: "Ashraful's Blog" },
    { name: 'twitter:description', content: user.value?.summary || 'Thoughts from the interface between people and software.' },
  ],
  link: [{ rel: 'canonical', href: siteUrl }],
})
</script>
