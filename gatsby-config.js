module.exports = {
  pathPrefix: `/`,
  siteMetadata: {
    title: `chris kwok`,
    siteUrl: `http://47.100.219.10:7000/`,
    description: `chriskwok's Personal Blog`,
    author: `chris kwok`,
    authorURL: `http://47.100.219.10:7000/`,
    socials: [
      {
        icon: 'github',
        name: 'GitHub',
        url: 'https://github.com/rollawaypoint'
      },
      {
        icon: 'netease-cloud-music',
        name: 'NetEase',
        url: 'https://music.163.com/#/user/home?id=65978744'
      },
      {
        icon: 'wechat',
        name: 'Wechat',
        url: '/wechat.jpeg'
      }
    ]
  },
  plugins: [
    {
      resolve: `gatsby-theme-cat`,
      options: {
        postPath: 'content',
        mdxExtensions: ['.mdx', '.md'],
        ga: 'UA-137858782-1',
        htmlLang: 'zh'
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'chris kwok',
        short_name: 'christian',
        start_url: `/`,
        background_color: `#fff`,
        theme_color: `#fff`,
        display: `standalone`,
        icon: 'static/favicon.png'
      }
    }
  ]
}
