---
date: 2018-12-09
title: Applet router - 小程序的路由封装
template: post
thumbnail: '../thumbnails/post.png'
slug: applet-router
categories:
  - Encapsulating
  - Popular
tags:
  - applet
  - mpvue
  - router
  - interceptor
---

基于 `mpvue` 小程序的路由封装

---

### Usage

组件内使用方法：

```js
// 不携带路由参数
this.$router.push('/home/page/index')
// 携带路由参数
this.$router.push({
  path: '/home/page/index',
  query: {
    //
  },
  reLaunch: true, // 调用wx.reLaunch
  isTab: true // 调用wx.switchTag
})

// 读取当前页面路由参数

const { query } = this.$route
```

组件外部使用只需要引入 router.js 内部导出的 push 方法即可

### 封装起步

分为两点切入：

1. 了解微信提供#的 api
2. 自己的需求

总结为以下几点：

- 对微信小程序的 `switchTab、reLaunch、navigateTo、redirectTo` 二次封装，对外暴露 push 方法，同时将路由实例挂载在 vue 上，组件内部通过 `this.$router.push` 调用，组件外部可使用对外暴露的 push 方法进行页面跳转。页面内数据通过路由参数传递通过 `this.$route.query` 读取。

- 路由默认跳转为 `wx.navigateTo` 静态跳转，调用其他跳转方式需传递相应参数

* 封装的跳转优先级：

```
    wx.switchTab >> wx.reLaunch >> wx.navigateTo
```

- 路由拥有拦截器，分为全局拦截和针对指定页面根据 `path` 拦截。

_注意： 路由不支持指定 `wx.redireactTo` 跳转，此方法用于路由内部处理小程序堆栈溢出（当前小程序静态页面堆栈仅支持十层）_

下面我会由不同的需求以问答方式一步步完成整个路由的简单封装同时讲述各个部分可能遇到的问题

### 如何完成基本跳转功能

_需求：页面内使用 `this.$router.push` 方法跳转页面_

首先就是新建 `index.js` 自定义一个最基本的 `push` 方法用来跳转页面

```js
// location 为路由传参
function push(location) {
  const params = { url: location.path }

  if (location.isTab) {
    wx.switchTab(params)
  } else if (location.reLaunch) {
    wx.reLaunch(params)
  } else if (location.redirect) {
    wx.redirectTo(params)
  } else {
    wx.navigateTo(params)
  }
}
```

然后为了让我们可以在页面中使用这个方法需要将 `push` 方法挂载在页面的实例上, 同时使用插件式调用在 `index.js` 文件中导出 `install` 方法

```js
// 导出
export default {
  install(Vue) {
    const _router = {
      mode: 'history',
      push
    }
    // 定义描述符getter（也可直接赋值value）
    const $router = {
      get() {
        return _router
      }
    }
    // 挂载 (各凭喜好也可以直接赋值在prototype上）
    Object.defineProperty(Vue.prototype, '$router', $router)
  }
}
```

接下来在项目入口文件注入上面 `index.js` 文件并执行 `Vue.use`

```js
import Vue from 'vue'
import router from './index.js'

Vue.use(router)
```

即可在任意页面使用 `this.$router.push` 方法并传入相应跳转方式和路径

这里存在一个问题： 项目跳转为了更美观主要使用 `wx.navigateTo`， 而微信小程序最大页面堆栈只支持 10 层，所以说项目中如果页面跳转极多或者存在相互关联的页面互相跳转便容易导致堆栈溢出页面不跳转的情况，这个问题在完成路由基本功能后单独解释

##### 页面之间如何读写参数

_需求： 页面内跳转通过路由参数 `query` 字段传参， 通过 `this.$route.query` 读取参数_

所以我们需要一个能够简单解析 `push` 方法参数的功能型函数 `parseUrl`，里面包括将所传的 `query` 字段以地址栏参数形式拼接在 `path` 后面的一个 `stringifyQuery` 函数

```js
function parseUrl(location) {
  const { path, query } = location
  const queryStr = stringifyQuery(query)

  return `${path}${queryStr}`
}

function stringifyQuery(obj) {
  const res = obj
    ? Object.keys(obj)
        .filter(Boolean)
        .map(key => {
          let val = obj[key]

          if ([Array, Object].includes(val.constructor)) {
            val = JSON.stringify(obj[key])
          }
          return `${key}=${val}`
        })

        .join('&')
    : null

  return res ? `?${res}` : ''
}
```

把 `parseUrl` 方法添加到上面的 `push` 方法，同时参数内部是支持小程序路由跳转过程的`success`, `fail`, `complete` 钩子的

```js
// location 为路由传参
function push(location) {
  // others 为用户可能传递的 `success`, `fail`, `complete`
  const { path, query, ...others } = location

  const url = parseUrl({ path, query })

  const params = { url, ...others }

  if (location.isTab) {
    wx.switchTab(params)
  } else if (location.reLaunch) {
    wx.reLaunch(params)
  } else if (location.redirect) {
    wx.redirectTo(params)
  } else {
    wx.navigateTo(params)
  }
}
```

以上路由传参并解析部分已经完成，接下来读取参数的控制需要定义一个 `$route` 对象与前面的 `$router` 一致挂载页面实例上

这一层读 mpvue 的实例创建一个 `parseRoute` 函数简单处理一下数据即可

此处遇到一个问题： 之前只是使用 JSON.parse 简单处理一下数据，当数据为长整型字符串（长度超过 17 位）会丢失精度转 0
以下同时简单处理一下

```js
function parseRoute($mp) {
  // $mp 为mpvue实例root上挂载的对象
  const _mp = $mp || {}
  const path = _mp.page && _mp.page.route
  const parseQuery = {}
  const tempQuery = _mp.query

  for (let k in tempQuery) {
    let cur = tempQuery[k]

    try {
      // 解决长整型丢失精度
      const transfer = JSON.parse(tempQuery[k])

      if (!(typeof transfer === 'number')) {
        cur = transfer
      }
    } catch (e) {}

    parseQuery[k] = cur
  }

  return {
    parseQuery
  }
}
```

最终挂载在页面实例上，由于路由参数每次跳转都要更新所以挂载在小程序 `onShow` 钩子上

```js
const _route = {}

Vue.mixin({
  onShow() {
    const { $mp } = this.$root

    _route = parseRoute($mp)
  }
})

const $route = {
  get() {
    return _route
  }
}

Object.defineProperty(Vue.prototype, '$route', $route)
```

以上便完成路由参数的读写

####### 解决上面提出的小程序堆栈限制问题

小程序的基本功能已经实现了，下面就是堆栈的限制，解决办法也很简单，只需要跳转前监听当前堆栈的长度，栈满时改用重定向方法 `wx.redirectTo` 即可（其他时间项目中仅使用 `navigateTo` 即可）

首先需要一个全局变量记录堆栈长度(微信提供一个 getCurrentPages 的方法)， 同时更改 `push` 方法

```js
// 当前页面堆栈长度
let pageStackLen = 0
// 堆栈限制
const maxStackLen = 10

function push(location, success, ...ohters) {
  pageStackLen = getCurrentPages().length + 1

  const url = parseUrl(location)

  // 包装跳转成功的回调
  const _success = function() {
    pageStackLen = getCurrentPages().length + 1

    success && success()
  }

  const params = { url, success: _success, ...ohters }

  if (location.isTab) {
    wx.switchTab(params)

    pageStackLen = 1
  } else if (location.reLaunch) {
    wx.reLaunch(params)

    pageStackLen = 1
  } else {
    if (pageStackLen >= maxStackLen) {
      wx.redirectTo(params)
      return
    }
    wx.navigateTo(params)
  }
}
```

以上基本解决小程序堆栈限制问题

### 完善路由跳转功能

现在对路由的跳转做一些基本辅助功能的支持 `go`、 `back`, `replace` 等方法

```js
function replace(location, ...others) {
  const url = parseUrl(location)

  wx.redirectTo({
    url,
    ...others
  })
}

function go(delta) {
  wx.navigateBack({
    delta
  })
}

function back() {
  wx.navigateBack()
}
```

将这些挂到 `$router` 对象

```js
const _router = {
  mode: 'history',
  push,
  replace,
  go,
  back
}

const $router = {
  get() {
    return _router
  }
}
```

此外还有我们不需要页面之间传参时时 push 方法直接传字符串路径，路由公用路径省略，push 调用传基本路径自动补齐, 单独导出 `push` 方法方便组件外部调用等优化

最后我们还差路由拦截器功能的实现

### 路由拦截器

需求： 对象形式配置自己路由规则

- `[triggerAll]`： 所有路由跳转均会触发
- `[triggerMatch]`： 匹配指定路由，其中可配置多个规则，以函数数组形式传入，数组中所有函数都会在被匹配时触发

参数介绍：

- `config`: 携带当前路由跳转信息（路由参数）
- `to`: 控制跳转（调用 `to()` ）

使用方式：

```js
export default {
  triggerAll(config, to) {
    console.log(config, 'enter interceptor')
    to()
  },
  triggerMatch: {
    '/home/pages/categoryList': [
      (config, to) => {
        if (/*flag*/) {
          console.log(1)
          to()
        }
      }
    ]
  }
}
```

本质上还是将之前封装的路由暴露出来的 push 方法再次封装一层，其中加入自己的逻辑达到目的

新建 `interceptor.js`

首先引入之前的路由方便在实例上调用，定义 `triggerMatch` 的对象存储存入的函数 `key` 为当前路由的路径，`value` 为 中间件函数组成的数组

关键： 将 `push` 方法当做单独的一个中间件并放在所有中间件的最后执行

```js
// 引入
import router from './index.js'
// 挂载
Vue.use(router)
// 存匹配指定路由的业务函数
let matchMiddlewares = {}
```

接下来要构建一个处理推入规则的业务函数（中间件）的 `compose` 函数

这个函数的作用主要分为两个：

- 依次派发推入拦截器的业务函数
- 控制下一次派发的开始

```js
const compose = middlewares => (...args) => {
  function dispatch(i) {
    return !middlewares[i]
      ? Promise.resolve('no arguments')
      : Promise.resolve(
          middlewares[i](...args, function() {
            // 派发下个调用
            // 此处即是拦截器中第二个实参 to 方法的函数体
            // 调动 to() 即开启下一次派发
            return dispatch(++i)
          })
        )
  }
  // 开启调用
  return dispatch(0)
}
```

创建一个函数 `getMatchMiddlewares` 用来根据指定键值读取 `matchMiddlewares` 中中间件函数数组

```js
function getMatchMiddlewares(path) {
  return matchMiddlewares.hasOwnProperty(path) ? matchMiddlewares[path] : []
}
```

路由同样使用 `Vue.use` 方法注册，这里导出 `install` 方法, 在里面统一所有中间件函数

```js
// 包装 push
let $push

function pushMiddware(...args) {
  $push(...args)
}

export default {
  install(Vue, { triggerAll, triggerMatch }) {
    // 存储原 push 函数
    $push = Vue.prototype.$router.push
    // 接收传入的匹配函数
    matchMiddlewares = Object.assign({}, triggerMatch)

    // 重新赋值
    Vue.prototype.$router.push = (...args) => {
      // 合并
      compose([...getMatchMiddlewares(path), triggerAll, pushMiddware])(...args)
    }
  }
}
```

之后在入口文件中引入即可

```js
import Vue from 'vue'
import interceptor from './interceptor.js'

Vue.use(interceptor)
```

至此便完成了路由的所有功能的基本封装

详细代码可以查看 [小程序路由](http://git..com/fe/applet/iverson/tree/master/src/global/lib/router)

此篇文章已经发布在 [http://doc..com](http://doc..com/pages/viewpage.action?pageId=7176857)
