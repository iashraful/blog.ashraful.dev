export interface DevtoUser {
  id: number
  name: string
  username: string
  summary: string | null
  profile_image: string
  location: string | null
  website_url: string | null
  joined_at: string
  twitter_username: string | null
  github_username: string | null
}

export interface DevtoArticleSummary {
  id: number
  title: string
  description: string
  cover_image: string | null
  social_image: string | null
  published_at: string
  reading_time_minutes: number
  tag_list: string | string[]
  path: string
  url: string
}

export interface DevtoArticle extends DevtoArticleSummary {
  body_html: string
  body_markdown: string
  slug: string
  tags: string | string[]
}
