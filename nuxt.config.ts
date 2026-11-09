// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode'],
  experimental: {
    appManifest: false,
  },
  tailwindcss: {
    cssPath: '@/assets/css/main.css',
  },
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },
  runtimeConfig: {
    devToApiKey: process.env.DEV_TO_API_KEY || '',
    public: {
      devToUsername: 'ashraful',
      siteUrl: 'https://blog.ashraful.dev',
      googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID || '',
    },
  },
  pageTransition: {
    name: 'editorial-page',
  },
  app: {
    head: {
      title: "Ashraful's Blog",
      meta: [
        { name: 'description', content: 'Software developer sharing thoughtful notes on code, tools, and technology.' },
        { property: 'og:site_name', content: "Ashraful's Blog" },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'alternate icon', href: '/favicon.ico' },
      ],
    },
  },
})
