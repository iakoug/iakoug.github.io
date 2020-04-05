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
    siteLogo: 'edit-2',
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
      `"闭门即是深山，心静随处净土。"`,
      `"世途渺于鸟道，人情浮比鱼蛮。"`,
      `"心有猛虎，细嗅蔷薇。"`,
      `"勇于敢所为，则杀其身。勇于不敢所为，则活其身。"`,
      `"我见青山多妩媚，料青山见我应如是。"`,
      `"人从天上，载得春来。剑去山下，暑不敢至。"`,
      `"心湛静，笑白云多事，等闲为雨出山来。"`,
      `"几人得真鹿，不知终日梦为鱼。"`,
      `"是日已过，命亦随减，如少水鱼，斯有何乐。"`,
      `"夜静水寒鱼不食，为何空欢喜。满船空载月明归，如何不欢喜。"`,
      `"今夕何夕，见此良人。"`,
      `"智者乐水，东山来也。"`,
      `"将所有的晦暗留给过往，从遇见你开始，凛冬散尽，星河长明。"`,
      `"很多事犹如天气，慢慢热或渐渐冷，等到惊悟，又过了一季。"`,
      `"活在这珍贵的人间，太阳强烈，水波温柔。"`,
      `"玻璃晴朗，橘子辉煌。"`,
      `"你没有如期归来，而这正是离别的意义。"`,
      `"浮舟沧海，立马昆仑。"`,
      `"当蝴蝶们逐一金属般爆炸，焚烧，死去而所见之处仅仅遗留你的痕迹。"`
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
        path: 'posts'
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
    // {
    //   resolve: `gatsby-plugin-sass`,
    //   options: {
    //     includePaths: [
    //       require('path').resolve(__dirname, 'node_modules')
    //     ]
    //   }
    // },
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-remove-trailing-slashes`,
    `gatsby-plugin-sitemap`,
    // 'gatsby-plugin-no-sourcemaps',
    'gatsby-plugin-offline'
  ]
}
