<template>
  <footer class="mt-16 border-t border-stone/80 dark:border-stone/40">
    <div class="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p class="text-sm text-ink/75 dark:text-paper/75">
        &copy; {{ new Date().getFullYear() }} Ashraful Islam
      </p>
      <div class="flex items-center">
        <a
          href="https://dev.to/ashraful"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex min-h-11 items-center gap-2 rounded-md py-2 text-sm font-semibold text-ink/80 transition-colors hover:text-accent dark:hover:text-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent dark:focus-visible:outline-indigo-300 dark:text-paper/80"
        >
          <AppIcon name="devto" :size="18" />
          <span>Find me on DEV</span>
          <AppIcon name="arrow-up-right" :size="16" />
        </a>
      </div>
    </div>
  </footer>
</template>
