<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 opacity-80"></div>
      <div class="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        <img
          v-if="user?.profile_image"
          :src="user.profile_image"
          :alt="user?.name"
          class="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-white dark:border-slate-700 shadow-lg"
        />
        <h1 class="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-3">
          {{ user?.name || 'Ashraful' }}
        </h1>
        <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {{ user?.summary || 'Software developer sharing thoughts on code, tools, and technology.' }}
        </p>
      </div>
    </section>

    <!-- Articles -->
    <section class="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6">Articles</h2>

      <!-- Error -->
      <ErrorBanner
        v-if="error"
        message="Couldn't load articles. Please try again."
        @retry="refresh()"
      />

      <!-- Loading -->
      <div v-else-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="i in 6"
          :key="i"
          class="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-pulse"
        >
          <div class="aspect-[16/9] bg-slate-100 dark:bg-slate-700"></div>
          <div class="p-5 space-y-3">
            <div class="h-4 bg-slate-100 dark:bg-slate-700 rounded w-3/4"></div>
            <div class="h-3 bg-slate-100 dark:bg-slate-700 rounded"></div>
            <div class="h-3 bg-slate-100 dark:bg-slate-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="articles && articles.length === 0" class="text-center py-16">
        <p class="text-slate-500 dark:text-slate-400 text-lg">No articles yet. Check back soon!</p>
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ArticleCard
          v-for="article in articles"
          :key="article.id"
          :article="article"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
const { getUser, getArticles } = useDevtoApi()

const { data: user, error: userError } = await useAsyncData('devto-user', () => getUser())

const { data: articles, error, pending, refresh } = await useAsyncData('devto-articles', () => getArticles())
</script>