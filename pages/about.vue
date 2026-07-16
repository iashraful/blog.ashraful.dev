<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
    <!-- Error -->
    <ErrorBanner
      v-if="error"
      message="Couldn't load profile info."
      @retry="refresh()"
    />

    <!-- Loading -->
    <div v-else-if="pending" class="animate-pulse space-y-4">
      <div class="w-28 h-28 rounded-full bg-stone/50 dark:bg-white/10 mx-auto"></div>
      <div class="h-8 bg-stone/50 dark:bg-white/10 rounded w-1/3 mx-auto"></div>
      <div class="h-4 bg-stone/50 dark:bg-white/10 rounded"></div>
      <div class="h-4 bg-stone/50 dark:bg-white/10 rounded w-3/4"></div>
    </div>

    <!-- Content -->
    <div v-else-if="user">
      <section class="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16 items-center mb-14">
        <div class="p-3 border border-stone rounded-2xl bg-paper dark:bg-ink shadow-editorial max-w-xs">
          <img
            :src="user.profile_image"
            :alt="user.name"
            class="w-full aspect-square object-cover rounded-xl"
          />
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-accent dark:text-indigo-300 mb-4">ABOUT / THE AUTHOR</p>
          <h1 class="font-display text-4xl sm:text-5xl leading-none font-semibold tracking-[-0.04em] text-ink dark:text-white mb-3">{{ user.name }}</h1>
           <p class="text-lg text-ink/75 dark:text-paper/75 mb-5">@{{ user.username }}</p>
          <p
            v-if="user.summary"
             class="text-ink/75 dark:text-paper/75 leading-relaxed max-w-xl mb-5"
          >
            {{ user.summary }}
          </p>
           <p v-if="user.location" class="inline-flex items-center gap-2 text-sm text-ink/75 dark:text-paper/75">
            <AppIcon name="location" :size="16" />
            {{ user.location }}
          </p>
        </div>
      </section>

      <!-- Links -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <a
          href="https://dev.to/ashraful"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center justify-between gap-4 p-5 border border-stone rounded-xl hover:border-accent hover:bg-accent/5 transition-colors"
        >
           <span class="flex items-center gap-3"><AppIcon name="devto" :size="22" /><span><span class="block text-xs uppercase tracking-wider text-ink/75 dark:text-paper/75">Community</span><span class="font-semibold text-ink dark:text-white">Read on DEV</span></span></span>
           <AppIcon name="external" :size="17" class="text-ink/75 dark:text-paper/75 group-hover:text-accent dark:group-hover:text-indigo-300" />
        </a>
        <a
          v-if="user.github_username"
          :href="`https://github.com/${user.github_username}`"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center justify-between gap-4 p-5 border border-stone rounded-xl hover:border-accent hover:bg-accent/5 transition-colors"
        >
           <span class="flex items-center gap-3"><AppIcon name="github" :size="22" /><span><span class="block text-xs uppercase tracking-wider text-ink/75 dark:text-paper/75">Code</span><span class="font-semibold text-ink dark:text-white">GitHub</span></span></span>
           <AppIcon name="external" :size="17" class="text-ink/75 dark:text-paper/75 group-hover:text-accent dark:group-hover:text-indigo-300" />
        </a>
        <a
          v-if="user.twitter_username"
          :href="`https://twitter.com/${user.twitter_username}`"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center justify-between gap-4 p-5 border border-stone rounded-xl hover:border-accent hover:bg-accent/5 transition-colors"
        >
           <span class="flex items-center gap-3"><AppIcon name="twitter" :size="22" /><span><span class="block text-xs uppercase tracking-wider text-ink/75 dark:text-paper/75">Updates</span><span class="font-semibold text-ink dark:text-white">Twitter</span></span></span>
           <AppIcon name="external" :size="17" class="text-ink/75 dark:text-paper/75 group-hover:text-accent dark:group-hover:text-indigo-300" />
        </a>
        <a
          v-if="user.website_url"
          :href="user.website_url"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center justify-between gap-4 p-5 border border-stone rounded-xl hover:border-accent hover:bg-accent/5 transition-colors"
        >
           <span class="flex items-center gap-3"><AppIcon name="globe" :size="22" /><span><span class="block text-xs uppercase tracking-wider text-ink/75 dark:text-paper/75">Elsewhere</span><span class="font-semibold text-ink dark:text-white">Website</span></span></span>
           <AppIcon name="external" :size="17" class="text-ink/75 dark:text-paper/75 group-hover:text-accent dark:group-hover:text-indigo-300" />
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
