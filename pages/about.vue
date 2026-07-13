<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-12">
    <!-- Error -->
    <ErrorBanner
      v-if="error"
      message="Couldn't load profile info."
      @retry="refresh()"
    />

    <!-- Loading -->
    <div v-else-if="pending" class="animate-pulse space-y-4">
      <div class="w-28 h-28 rounded-full bg-slate-100 dark:bg-slate-700 mx-auto"></div>
      <div class="h-8 bg-slate-100 dark:bg-slate-700 rounded w-1/3 mx-auto"></div>
      <div class="h-4 bg-slate-100 dark:bg-slate-700 rounded"></div>
      <div class="h-4 bg-slate-100 dark:bg-slate-700 rounded w-3/4"></div>
    </div>

    <!-- Content -->
    <div v-else-if="user" class="text-center">
      <img
        :src="user.profile_image"
        :alt="user.name"
        class="w-28 h-28 rounded-full mx-auto mb-6 border-4 border-white dark:border-slate-700 shadow-lg"
      />
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-3">{{ user.name }}</h1>
      <p class="text-lg text-slate-600 dark:text-slate-400 mb-6">
        @{{ user.username }}
      </p>
      <p
        v-if="user.summary"
        class="text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto mb-8"
      >
        {{ user.summary }}
      </p>

      <div v-if="user.location" class="text-sm text-slate-500 dark:text-slate-400 mb-4">
        {{ user.location }}
      </div>

      <!-- Links -->
      <div class="flex flex-wrap justify-center gap-3 mt-8">
        <a
          href="https://dev.to/ashraful"
          target="_blank"
          rel="noopener noreferrer"
          class="px-5 py-2.5 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors text-sm font-medium"
        >
          Read on dev.to
        </a>
        <a
          v-if="user.github_username"
          :href="`https://github.com/${user.github_username}`"
          target="_blank"
          rel="noopener noreferrer"
          class="px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:border-accent hover:text-accent transition-colors text-sm font-medium"
        >
          GitHub
        </a>
        <a
          v-if="user.twitter_username"
          :href="`https://twitter.com/${user.twitter_username}`"
          target="_blank"
          rel="noopener noreferrer"
          class="px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:border-accent hover:text-accent transition-colors text-sm font-medium"
        >
          Twitter
        </a>
        <a
          v-if="user.website_url"
          :href="user.website_url"
          target="_blank"
          rel="noopener noreferrer"
          class="px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:border-accent hover:text-accent transition-colors text-sm font-medium"
        >
          Website
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
const { getUser } = useDevtoApi()

const { data: user, error, pending, refresh } = await useAsyncData('devto-user-about', () => getUser())

useHead({
  title: "About — Ashraful's Blog",
})
</script>