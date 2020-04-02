module.exports = {
  pathPrefix: `/`,
  siteMetadata: {
    title: `chris kwok`,
    siteUrl: `https://justwink.cn/`,
    description: `chriskwok's Personal Blog`,
    author: `chris kwok`,
    authorURL: `https://justwink.cn/`,
    siteLogo: 'sun',
    byteDance: [
      ``,
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
      `"如果人生能够重来，我大概还是这样。"`,
      `"在世间，本就是各人下雪，各人有各人的隐晦与皎洁。"`,
      `"我在贩卖日落，你像神明一样慷慨地将光洒向我。"`,
      `"胸中有丘壑，眼里存山河。"`,
      `"活在这珍贵的人间，太阳强烈，水波温柔。"`,
      `"玻璃晴朗，橘子辉煌。"`,
      `"树深时见鹿，溪午不闻钟。"`,
      `"二斤桃花酿做酒，万杯不及你温柔。"`,
      `"只缘感君一回顾，使我思君朝与暮。"`,
      `"你没有如期归来，而这正是离别的意义。"`,
      `"浮舟沧海，立马昆仑。"`,
      `"这世间众生皆孤寂，应怪众生未见过你。"`,
      `"我与春风皆过客，你携秋水揽星河。"`,
      `"你不知道那究竟有什么意义，开始了就不能重来。"`,
      `"当蝴蝶们逐一金属般爆炸，焚烧，死去而所见之处仅仅遗留你的痕迹。"`
    ],
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
