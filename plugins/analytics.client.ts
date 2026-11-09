declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const gaId = (config.public.googleAnalyticsId as string | undefined)?.trim()

  if (!gaId) return

  // Inject Google Analytics gtag.js script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`
  document.head.appendChild(script)

  // Initialize dataLayer and gtag function
  window.dataLayer = window.dataLayer || []
  function gtag(...args: any[]) {
    window.dataLayer.push(args)
  }
  window.gtag = gtag

  gtag('js', new Date())
  gtag('config', gaId, { send_page_view: false })

  // Listen for SPA route transitions
  const router = useRouter()
  router.afterEach((to) => {
    gtag('event', 'page_view', {
      page_path: to.fullPath,
    })
  })

  // Initial page view
  gtag('event', 'page_view', {
    page_path: router.currentRoute.value.fullPath,
  })
})
