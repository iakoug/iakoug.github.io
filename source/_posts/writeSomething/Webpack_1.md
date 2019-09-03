---
title: webpack define plugin
tags:
  - webpack
date: 2019-05-10 17:17:00
categories: webpack
index_img: http://pic.netbian.com/uploads/allimg/180315/110404-1521083044b19d.jpg
---
关于 webpack define plugin 的一些思考（胡思乱想）

记录帖
<!-- more -->

这两天给当下接的项目配代理，用的 `http-proxy-middleware` 简单配置了一下本地就work了，没想到打包测试环境出了问题，才注意到原来项目中的api竟然不是跟随当前站点域名，且不统一有不同环境的不同域名。

# 将原本的api对象根据环境映射一下

```js
exports.apis = {
  [envA]: {
    [alias]: '/'
  },
  [envB]: {
    [alias]: '/'
  }
}
```

为了不影响项目中原本大量的引入使用方式，再单独导出一个聚合的apis
```js
export default Object.keys(apis).reduce((all, c) => {
  for (const k in apis[c]) {
    if (all.hasOwnProperty(k)) {
      throw new Error(`${k} has been injected, please check if your API key is duplicated.`);
    }

    all[k] = apis[c][k];
  }

  return all;
}, {});
```

# 根据环境按照http-proxy-middleware参数格式对api进行format

```js
module.exports = Object.keys(APISMap).reduce((proxyTable, proxyDomain) => {
  const domainApiMap = APISMap[proxyDomain]

  proxyTable.push({
    context: Object.keys(domainApiMap).reduce((apis, apiKey) => [...apis, domainApiMap[apiKey]], []),
    config: {
      // target: '//prod.com',
      target: env ? apiConfig[env][proxyDomain] : '//mock.com/api',
      changeOrigin: true,  
    },
  })

  return proxyTable;
}, [])

```

# 在server里使用http-proxy-middleware简单配置下上面导出的配置项参数
```js
// proxy api requests
  if (isProxy && proxyTable) {
    proxyTable.forEach(({context, config}) => app.use(proxyMiddleware(context, config)))
  }
```

以为大功告成了？

不，不同环境的打包之后出了问题

配置读取的代理域名根据一个配置文件读取，而这个配置文件始终导出的环境都是`dev` （_之前的配置项_），并不想每次发版还要手动改环境，那也太傻

于是决定代理的时候指定全路径可以不可以呢（读取当前真正环境域名映射）

http-proxy-middleware竟然撂挑子了，本地代理都做不到了（更别说发布）

对了，webpack不是可以定义全局环境变量吗？直接定义一个开发环境的不就好了吗？产线环境根本不走开发环境的webpack.config。

# new webpack.definePlugin({})

很nc，插件传入的数值必须使用双重引号包裹，eg.：`process.env.NODE_ENV: '"dev"'`

apis文件内已经可以正常使用了，根据当前环境，既然http-proxy-middleware只可以代理匹配api路径那就在开发环境保持，产线环境拼接原路径
```js
const apis = require('./apis');

const isDev = process.env.NODE_ENV === 'dev';

export default Object.keys(apis).reduce((all, c) => {
  for (const k in apis[c]) {
    if (all.hasOwnProperty(k)) {
      throw new Error(`${k} has been injected, please check if your API key is duplicated.`);
    }
    all[k] = isDev ? apis[c][k] : `${window[c]}${apis[c][k]}`;
  }
  return all;
}, {});
```

已经没问题了，可是接下来我想在启动server的时候判断当前是不是我定的那个dev环境，我却无法使用我在webpack里面使用definePlugin定义的`process.env.NODE_ENV`

why?!

思维一度陷入误区，命名我在“浏览器环境”都能使用？？？不是刚在api文件中判断当前环境拼接domain吗？

emmmm

definePlugin!
definePlugin!
definePlugin!

definePlugin只是定义一个映射的机制，将你定义的key在webpack编译AST的时候做了一个替换而已，他并不是node的process模块

这个时候肯定会试一下，既然定义的只是key，那么且当做常量，那么我在apis文件打印一下process看看是什么？

竟然是包含一系列信息的对象

？？？

浏览器环境为什么可以使用node模块？

所以上面“浏览器环境”我加了引号

猜测: 可能webpack只是模拟实现process模块在项目中，例如 `browser-process` 包。

可是为什么我在编译webpack配置文件的时候无法使用定义的全局变量呢？一开始我以为没有走配置的compiler这个过程？
虽然是昨晚的问题但是现在我也不确定何等原因...

难搞哦😭
