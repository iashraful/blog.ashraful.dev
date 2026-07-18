<template>
  <header class="sticky top-0 z-50 border-b border-stone/80 bg-paper/90 backdrop-blur-md dark:bg-ink/90">
    <div class="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
      <NuxtLink to="/" class="group flex min-w-0 items-center gap-3 rounded-md" aria-label="Ashraful's Blog home">
        <span class="brand-mark shrink-0" aria-hidden="true"><span /></span>
        <span class="min-w-0">
          <span class="block truncate font-display text-xl leading-tight text-ink transition-colors group-hover:text-accent dark:text-paper dark:group-hover:text-indigo-300 sm:text-2xl">Ashraful’s Blog</span>
        </span>
      </NuxtLink>
      <form class="hidden flex-1 sm:block" aria-label="Search articles" @submit.prevent="search">
        <label class="sr-only" for="article-search">Search articles</label>
        <input
          id="article-search"
          v-model="searchQuery"
          type="search"
          placeholder="Search articles"
          class="w-full rounded-full border border-stone/80 bg-white/50 px-4 py-2 text-sm text-ink placeholder:text-ink/50 focus:border-accent focus:outline-none dark:border-stone/40 dark:bg-black/10 dark:text-paper dark:placeholder:text-paper/50"
        >
      </form>
      <nav class="flex shrink-0 items-center gap-1 rounded-full border border-stone/80 bg-white/50 p-1 dark:border-stone/40 dark:bg-black/10" aria-label="Primary navigation">
        <NuxtLink to="/" exact-active-class="bg-ink !text-paper dark:bg-paper dark:!text-ink" class="min-h-11 min-w-11 rounded-full px-3 py-2 text-xs font-semibold text-ink/65 transition-colors hover:text-accent dark:hover:text-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:focus-visible:outline-indigo-300 dark:text-paper/70 sm:px-4 sm:text-sm">
          Home
        </NuxtLink>
        <NuxtLink to="/about" active-class="bg-ink !text-paper dark:bg-paper dark:!text-ink" class="min-h-11 min-w-11 rounded-full px-3 py-2 text-xs font-semibold text-ink/65 transition-colors hover:text-accent dark:hover:text-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:focus-visible:outline-indigo-300 dark:text-paper/70 sm:px-4 sm:text-sm">
          About
        </NuxtLink>
        <ThemeToggle />
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const searchQuery = ref('')

function search() {
  const query = searchQuery.value.trim()
  if (!query) return

  navigateTo({ path: '/search', query: { q: query } })
}
</script>

<style scoped>
.brand-mark {
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid theme('colors.coral');
  border-radius: 9999px;
  background: theme('colors.ink');
  transform: rotate(-8deg);
}

.brand-mark span {
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 0.2rem;
  background: theme('colors.coral');
  transform: rotate(22deg);
}

:global(.dark) .brand-mark {
  background: theme('colors.paper');
}
</style>
