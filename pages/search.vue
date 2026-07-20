<template>
  <div class="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
    <div class="mb-8 border-b border-stone pb-5">
      <p class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink dark:text-paper">Search</p>
      <h1 class="text-4xl sm:text-5xl">Articles</h1>
      <p v-if="query" class="mt-3 text-sm text-ink/75 dark:text-paper/75">
        {{ filteredArticles.length }} {{ filteredArticles.length === 1 ? 'result' : 'results' }} for "{{ query }}"
      </p>
    </div>

    <form class="mb-10" aria-label="Search articles" @submit.prevent="search">
      <label class="sr-only" for="search-page-input">Search articles</label>
      <input
        id="search-page-input"
        v-model="searchQuery"
        type="search"
        placeholder="Search articles"
        class="w-full rounded-lg border border-stone bg-paper px-4 py-3 text-ink placeholder:text-ink/50 focus:border-accent focus:outline-none dark:bg-ink dark:text-paper dark:placeholder:text-paper/50"
      >
    </form>

    <ErrorBanner v-if="error" message="Couldn't load articles. Please try again." @retry="refresh()" />

    <div v-else-if="pending" class="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="i in 6" :key="i" class="aspect-[4/5] animate-pulse border border-stone bg-stone/50 dark:bg-white/10" />
    </div>

    <div v-else-if="articles && articles.length === 0" class="py-16 text-center">
      <p class="text-lg text-ink/75 dark:text-paper/75">No articles yet. Check back soon.</p>
    </div>

    <div v-else-if="query && filteredArticles.length === 0" class="py-16 text-center">
      <p class="text-lg text-ink/75 dark:text-paper/75">No articles match "{{ query }}".</p>
    </div>

    <div v-else class="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
      <ArticleCard
        v-for="article in filteredArticles"
        :key="article.id"
        :article="article"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { filterArticles } from '~/utils/articleSearch'

const route = useRoute()
const router = useRouter()
const { getArticles } = useDevtoApi()

const { data: articles, error, pending, refresh } = await useAsyncData('devto-articles-search', () => getArticles())
const query = computed(() => String(route.query.q || '').trim())
const searchQuery = ref(query.value)
const filteredArticles = computed(() => filterArticles(articles.value || [], query.value))

watch(query, (value) => {
  searchQuery.value = value
})

function search() {
  const q = searchQuery.value.trim()
  router.push({ path: '/search', query: q ? { q } : {} })
}

const siteUrl = useRuntimeConfig().public.siteUrl

useHead({
  title: "Search Articles — Ashraful's Blog",
  meta: [
    { name: 'description', content: 'Search all articles on Ashraful\'s Blog.' },
    { property: 'og:title', content: "Search Articles — Ashraful's Blog" },
    { property: 'og:description', content: 'Search all articles on Ashraful\'s Blog.' },
    { property: 'og:url', content: `${siteUrl}/search` },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: "Search Articles — Ashraful's Blog" },
    { name: 'twitter:description', content: 'Search all articles on Ashraful\'s Blog.' },
  ],
  link: [{ rel: 'canonical', href: `${siteUrl}/search` }],
})
</script>
