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
    },
  },
  app: {
    head: {
      title: "Ashraful's Blog",
      meta: [
        { name: 'description', content: 'Personal blog powered by dev.to' },
      ],
    },
  },
})
