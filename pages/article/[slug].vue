<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
    <NuxtLink
      to="/"
      class="inline-flex min-h-11 items-center gap-2 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink/80 dark:text-paper/80 hover:text-accent dark:hover:text-indigo-300 transition-colors mb-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent dark:focus-visible:outline-indigo-300"
    >
      <AppIcon name="arrow-left" :size="16" />
      <span>Back to articles</span>
    </NuxtLink>

    <!-- Error -->
    <ErrorBanner
      v-if="error"
      message="Couldn't load this article."
      @retry="refresh()"
    />

    <!-- Loading -->
    <div v-else-if="pending" class="space-y-4 animate-pulse">
      <div class="h-10 bg-stone/50 dark:bg-white/10 rounded w-3/4"></div>
      <div class="h-4 bg-stone/50 dark:bg-white/10 rounded w-1/2"></div>
      <div class="aspect-[16/9] bg-stone/50 dark:bg-white/10 rounded-xl"></div>
      <div class="space-y-3">
        <div class="h-4 bg-stone/50 dark:bg-white/10 rounded" v-for="i in 5" :key="i"></div>
      </div>
    </div>

    <!-- Article -->
    <article v-else-if="article">
      <div class="max-w-3xl">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-accent dark:text-indigo-300 mb-4">ARTICLE / DEV COMMUNITY</p>
        <h1 class="font-display text-4xl sm:text-5xl lg:text-6xl leading-[0.98] font-semibold tracking-[-0.04em] text-ink dark:text-white mb-6">
          {{ article.title }}
        </h1>
      </div>

      <!-- Meta -->
      <div class="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-ink/75 dark:text-paper/75 mb-8">
        <span class="inline-flex items-center gap-2">
          <AppIcon name="calendar" :size="16" />
          {{ formatDate(article.published_at) }}
        </span>
        <span class="inline-flex items-center gap-2">
          <AppIcon name="clock" :size="16" />
          {{ article.reading_time_minutes }} min read
        </span>
        <span v-if="tags.length > 0" class="flex flex-wrap gap-1.5">
          <span
            v-for="tag in tags"
            :key="tag"
            class="px-2 py-0.5 text-xs font-medium rounded-full bg-accent/10 text-accent dark:text-indigo-300"
          >
            #{{ tag }}
          </span>
        </span>
      </div>

      <!-- Cover image -->
      <div v-if="article.cover_image" class="p-2 border border-stone rounded-2xl bg-paper dark:bg-ink shadow-editorial mb-10">
        <img
          :src="article.cover_image"
          :alt="article.title"
          class="w-full rounded-xl"
        />
      </div>

      <!-- Content -->
      <div
        class="prose-devto max-w-3xl mx-auto"
        v-html="article.body_html"
      ></div>

      <!-- Footer link -->
      <div class="max-w-3xl mx-auto mt-14 pt-8 border-t border-stone text-center">
        <a
          :href="article.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-5 py-3 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors text-sm font-semibold"
        >
          View on dev.to
          <AppIcon name="external" :size="16" />
        </a>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { getArticleBySlug, normalizeTags } = useDevtoApi()

const { data: article, error, pending, refresh } = await useAsyncData(
  `article-${route.params.slug}`,
  () => getArticleBySlug(route.params.slug as string)
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
