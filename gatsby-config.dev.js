const mdPlugins = [require('remark-slug')]

const mdxPlugins = [
  `gatsby-remark-katex`,
  {
    resolve: `gatsby-remark-images`,
    options: {
      maxWidth: 1200,
      linkImagesToOriginal: false,
      withWebp: true
    }
  },
  {
    resolve: `gatsby-remark-prismjs`,
    options: {
      showLineNumbers: true,
      aliases: {
        sh: 'bash'
      }
    }
  }
]

module.exports = {
  pathPrefix: `/`,
  siteMetadata: {
    title: `christian`,
    siteLogo: 'sun',
    siteUrl: `https://justwink.cn/`,
    description: `chriskwok's Personal Blog`,
    author: `chris kwok`,
    authorURL: `https://justwink.cn/`,
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
      },
      {
        icon: 'telegram',
        name: 'Telegram',
        url: 'https://t.me/christiankwok'
      }
    ],
    byteDance: [
      ''
      // `"酒入豪肠，七分化作月光，剩下的三分啸成了剑气，绣口一吐就是半个盛唐。"`
      // `"浮舟沧海，立马昆仑。"`,
      // `"这世间众生皆孤寂，应怪众生未见过你。"`,
      // `"我与春风皆过客，你携秋水揽星河。"`,
      // `"你不知道那究竟有什么意义，开始了就不能重来。"`,
      // `"当蝴蝶们逐一金属般爆炸，焚烧，死去而所见之处仅仅遗留你的痕迹。"`
    ]
  },
  plugins: [
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
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-typescript`,
    `gatsby-transformer-remark`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blog`,
        path: 'content'
      }
    },
    {
      resolve: `gatsby-plugin-page-creator`,
      options: {
        path: `${__dirname}/src/pages`
      }
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: ['.mdx', '.md'],
        plugins: mdxPlugins,
        remarkPlugins: mdPlugins,
        gatsbyRemarkPlugins: mdxPlugins
      }
    },
    {
      resolve: 'gatsby-plugin-html-attributes',
      options: {
        lang: 'zh'
      }
    },
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-remove-trailing-slashes`,
    `gatsby-plugin-sitemap`
  ]
}
