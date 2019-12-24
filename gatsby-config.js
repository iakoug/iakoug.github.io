module.exports = {
  pathPrefix: `/`,
  siteMetadata: {
    title: `chris kwok`,
    siteUrl: `https://justwink.github.io/`,
    description: `chriskwok's Personal Blog`,
    author: `chris kwok`,
    authorURL: `https://justwink.github.io/`,
    socials: [
      {
        icon: 'mail-send',
        name: 'Email',
        url: 'mailto:baozaodexianyu@163.com'
      },
      {
        icon: 'github',
        name: 'GitHub',
        url: 'https://github.com/justwink'
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
        postPath: 'posts',
        mdxExtensions: ['.mdx', '.md'],
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
