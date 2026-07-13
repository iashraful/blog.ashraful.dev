<template>
  <footer class="border-t border-slate-200 dark:border-slate-800 mt-16">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p class="text-sm text-slate-500 dark:text-slate-400">
        &copy; {{ new Date().getFullYear() }} Ashraful
      </p>
      <div class="flex items-center gap-4">
        <a
          href="https://dev.to/ashraful"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm text-slate-500 dark:text-slate-400 hover:text-accent transition-colors"
        >
          Powered by dev.to
        </a>
      </div>
    </div>
  </footer>
</template>