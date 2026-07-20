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
  nitro: {
    prerender: {
      routes: ['/', '/sitemap.xml', '/search', '/about'],
    },
    hooks: {
      'prerender:routes': async (routes) => {
        try {
          const res = await fetch(
            `https://dev.to/api/articles?username=ashraful&per_page=200`,
          )
          if (!res.ok) return
          const articles = await res.json()
          for (const a of articles) {
            routes.add(`/article/${a.slug}`)
          }
        }
        catch {
          console.warn('Could not fetch articles for pre-rendering')
        }
      },
    },
  },
})
