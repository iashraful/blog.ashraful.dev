import { setHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = config.public.siteUrl

  let articles: any[] = []
  try {
    articles = await $fetch(
      `https://dev.to/api/articles?username=${config.public.devToUsername}&per_page=200`,
    )
  }
  catch {
    // return a minimal sitemap if the API is unavailable
  }

  const urlEntries = [
    `<url><loc>${siteUrl}</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
    `<url><loc>${siteUrl}/about</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>`,
    ...articles.map((a: any) =>
      `<url><loc>${siteUrl}/article/${a.slug}</loc><lastmod>${new Date(a.published_at).toISOString()}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`
    ),
  ]

  setHeader(event, 'Content-Type', 'application/xml')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join('\n')}
</urlset>`
})
