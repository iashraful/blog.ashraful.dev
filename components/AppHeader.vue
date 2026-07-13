<template>
  <header class="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
      <NuxtLink to="/" class="text-xl font-bold text-slate-900 dark:text-white hover:text-accent transition-colors">
        Ashraful's Blog
      </NuxtLink>
      <nav class="flex items-center gap-2 sm:gap-4">
        <NuxtLink to="/" class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-accent transition-colors">
          Home
        </NuxtLink>
        <NuxtLink to="/about" class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-accent transition-colors">
          About
        </NuxtLink>
        <ThemeToggle />
      </nav>
    </div>
  </header>
</template>