const currentDateUTC = new Date().toUTCString()

module.exports = {
	title: 'Ashraful\'s Blog',
	dest: './public',
	themeConfig: {
		domain: 'https://ashraful.dev',
		author: 'Ashraful Islam',
		repo: 'https://github.com/iashraful/ashraful.dev',
		repoLabel: 'Repo',
		editLinks: true,
		editLinkText: 'Found a correction? Send me a PR!',
		nav: [
			{ text: 'Home', link: '/' }, 
			{ text: 'Posts', link: '/posts/' },
			{ text: 'Archive', link: '/archive/' },
			{ text: 'Docs', link: '/docs/' }
		],
		logo: '/logo.png',
		docsDir: 'src',
		pageSize: 10,
		startPage: 0
	},
	plugins: [
		[
			'@vuepress/pwa',
			{
				serviceWorker: true,
      			updatePopup: true
			}
		],
		[
			'@vuepress/google-analytics',
			{
				ga: 'UA-150101528-1'
			}
		],
		[
			'social-share',
			{
			  networks: ['twitter', 'facebook', 'reddit', 'whatsapp'],
			  twitterUser: '__ashraful',
			},
		],
		'vuepress-plugin-reading-time',
		'vuepress-plugin-janitor',
		'disqus',
		[
			'seo', 
			{
				siteTitle: (_, $site) => $site.title,
				title: $page => $page.title,
				description: $page => $page.frontmatter.excerpt,
				author: (_, $site) => $site.themeConfig.author,
				tags: $page => $page.frontmatter.tags,
				twitterCard: _ => 'summary_large_image',
				type: $page => ['articles', 'posts', 'blog'].some(folder => $page.regularPath.startsWith('/' + folder)) ? 'article' : 'website',
				url: (_, $site, path) => ($site.themeConfig.domain || '') + path,
				image: ($page, $site) => $page.frontmatter.image && (($site.themeConfig.domain || '') + $page.frontmatter.image),
				publishedAt: $page => $page.frontmatter.date && new Date($page.frontmatter.date),
				modifiedAt: $page => $page.lastUpdated && new Date($page.lastUpdated),
			}
		],
		[
			'vuepress-plugin-zooming',
			{
			  selector: 'img',
			  delay: 1000,
			  options: {
				bgColor: 'black',
				zIndex: 10000,
			  },
			},
		],
		'reading-progress',
		'@vuepress/back-to-top',
		'vuepress-plugin-smooth-scroll',
		[
			'sitemap', {
				hostname: 'https://ashraful.dev'
			}
		]
	],
	head: [
		['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/logo.png' }],
		['link', { rel: 'icon', sizes: '32x32', href: '/logo.png' }],
		['link', { rel: 'icon', sizes: '16x16', href: '/logo.png' }],
		['link', { rel: 'manifest', href: '/site.webmanifest' }],
		['link', { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' }],
		['meta', { name: 'msapplication-TileColor', content: '#da532c' }],
		['meta', { name: 'theme-color', content: '#ffffff' }]
	]
};
