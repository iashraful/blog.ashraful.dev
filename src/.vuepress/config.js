const currentDateUTC = new Date().toUTCString()

module.exports = {
	title: 'Ashraful\'s Blog',
	dest: './public',
	themeConfig: {
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
      			updatePopup: false
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
			  networks: ['twitter', 'facebook', 'reddit', 'telegram', 'whatsapp', 'skype'],
			  twitterUser: '__ashraful',
			},
		],
		'vuepress-plugin-reading-time',
		'vuepress-plugin-janitor',
		'disqus',
		'seo',
		'reading-progress'
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
