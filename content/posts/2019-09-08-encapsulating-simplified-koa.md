---
date: 2019-09-08
title: Encapsulating simplified Koa - 前端攻城狮的服务端之旅大都从 express、koa 这类 node 框架开始
template: post
thumbnail: '../thumbnails/js.png'
slug: encapsulating-simplified-koa
categories:
  - Encapsulating
tags:
  - koa
---

之前简单写过 koa 的中间件处理模型

> [十行代码实现 koa2 洋葱模型](https://justwink.cn/post/2019-02-22-KoaOnionModel)

koa 作为目前流行的 node 框架之一，甚至很多企业级框架都是基于 koa 来封装（如 eggjs），koa 源码其实极为精简

### koa 的机制

核心主要两点：

- 构造 ctx、request、response 上下文对象
- 中间件模型

此外还包括启动 http Server、异步流程控制、全局错误捕获等

### 从 Hello World 开始

首先启动一个 http Server，nodejs 提供的 http 模块可以做这件事情

```js
const http = require('http')

http
  .createServer(
    ({ httpVersion, headers, method, url, trailers, complete }, res) => {
      console.log(httpVersion, headers, method, url, trailers, complete)

      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.write('Hello World')
    }
  )
  .listen(3000, () => console.log('server is running at: localhost:3000'))
```

使用 `node` 运行这段脚本后，即可打开浏览器 3000 端口，会看到页面输出的 Hello World

方法 `createServer` 回调接受两个参数，分别是请求和响应的上下文对象，需要注意的是可以见到第一个参数 `httpVersion`、`headers` 等被我以解构的形式打印出来，但是第二个参数是不可以使用解构来获取 `write` 等方法的，这些方法是继承自 `ServerResponse` 这个构造函数的原型而非自身，可以通过打印 `res.constructor.prototype` 查看

此外 koa 的实例有一个 use 方法，入参接受了 node 原生方法的 request 和 response 对象。定义一个数组用来存放这些传入的方法，然后在 `createServer` 的时候传入调用，`createServer` 只直接接受一个回调作为入参，所以要额外处理一下 use 方法传入的多个方法。其实这些方法就是下文定义的中间件

```js
const middleware = []

function use(fn) {
  middleware.push(fn)
}

// 批处理这些传入的方法
function createServerCallback(...httpServerArgs) {
  return middleware.forEach(fn => fn(...httpServerArgs))
}
```

放在一个 App 对象中如 koa 那样对外暴露

```js
const http = require('http')

class App {
  constructor() {
    this.middleware = []
  }

  use(fn) {
    this.middleware.push(fn)
  }

  createServerCallback(...ctx) {
    middleware.forEach(fn => fn(...ctx))
  }

  listen(...args) {
    http.createServer(this.createServerCallback).listen(...args)
  }
}

const app = new App()

app.use(({ httpVersion, headers, method, url, trailers, complete }, res) => {
  console.log(httpVersion, headers, method, url, trailers, complete)

  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.write('Hello World')
})

// listen
app.listen(3000, () => console.log('server is running at: localhost:3000'))
```

### 封装上下文对象

和 Express 只有 Request 和 Response 两个对象不同，Koa 增加了一个 Context(本文的 ctx) 的对象，作为这次请求的上下文对象（在 Koa 1 中为中间件的 this，在 Koa 2 中作为中间件的第一个参数传入）。我们可以将一次请求相关的上下文都挂载到这个对象上。类似 traceId 这种需要贯穿整个请求（在后续任何一个地方进行其他调用都需要用到）的属性就可以挂载上去。相较于 request 和 response 而言更加符合语义。

同时 Context 上也挂载了 Request 和 Response 两个对象。和 Express 类似，这两个对象都提供了大量的便捷方法辅助开发，例如

- get request.query
- set response.body
- set response.status

等等

#### request & response

上面说过 request & response 是对原生 node 回调上下文参数的包装
简单定义两个对象就可以

```js
// request
const url = require('url')

const request = {
  get query() {
    return url.parse(this.request.url, true).query
  }
}

// response
const response = {
  get body() {
    return this._body
  },

  set body(data) {
    this._body = data
  },

  get status() {
    return this.res.statusCode
  },

  set status(code) {
    this.res.status = code
  }
}
```

有一些特别的是 body 读写方法分别设置、读取一个名为 this.\_body 的属性。这里设置 body 的时候并没有直接调用 this.res.end(node response 对象方法) 来返回信息，这是考虑到 koa 当中我们可能会多次调用 response 的 body 方法覆盖性设置数据。真正的返回消息操作会在入口设置。

#### ctx

下面就定义一个 ctx 全局上下文对象对 get request.query、set response.body、set response.status 使用 Proxy 统一把 Request 和 Response 统一也挂载到 ctx 上做一个读写
_同样可以使用对象的原型方法 `__defineSetter__`、`__defineGetter__` 或者 `Object.defineProperty`_

```js
const ctx = {}

const ctxGetter = {
  request: ['query'],
  response: ['body', 'status']
}

const ctxSetter = {
  response: ['body', 'status']
}

const __defineProxyGetter__ = (prop, name) =>
  new Proxy(
    {
      get() {
        return this[prop][name]
      }
    },
    ctx
  )

const __defineProxySetter__ = (prop, name) =>
  new Proxy(
    {
      set(val) {
        this[prop][name] = val
      }
    },
    ctx
  )

// __defineProxy__()
Object.keys(ctxGetter).forEach(prop =>
  ctxGetter[prop].forEach(name => __defineProxyGetter__(prop, name))
)

// __defineProxy__()
Object.keys(ctxSetter).forEach(prop =>
  ctxGetter[prop].forEach(name => __defineProxySetter__(prop, name))
)
```

### 聚合 App 上下文

以上 koa 核心的上下文对象已经基本构建完毕了，直接把这些对象挂载到 App 类上初始化

```js
const http = require('http')

class App {
  constructor() {
    this.middleware = []
    this.ctx = ctx
    this.request = request
    this.response = response
  }

  use(fn) {
    this.middleware.push(fn)
  }

  createServerCallback(...ctx) {
    middleware.forEach(fn => fn(...ctx))
  }

  listen(...args) {
    http.createServer(this.createServerCallback).listen(...args)
  }
}
```

那么需要的是，现在自己创建的上下文对象中 response 和 request 还只是简单对象而已，下面我们需要把 node 回调的 response 和 request 对象分别映射上来，只要定义一个 createContext 方法在 httpCreateServer 的时候创建的时候处理即可

```js
function createContext(request, response) {
  const ctx = Object.create(this.ctx)

  ctx.request = Object.create(this.request)
  ctx.response = Object.create(this.response)
  ctx.req = request
  ctx.res = response

  return ctx
}
```

其中 createContext 的入参分别是 node 的 request 和 response 对象，分别赋值给 ctx.req 和 ctx.res

接下来创建一个 responseBody 方法来统一结束当前请求，使用 Http server 的 Response 对象的 end 方法
此方法向服务器发出信号，表示已发送所有响应标头和正文，该服务器应该考虑此消息完成
必须在每个响应上调用方法 response.end
如果指定了数据，则它实际上类似于调用 response.write（data，encoding），后跟 response.end（回调），如果指定了回调，则在响应流完成时将调用它
返回值为当前上下文 this

```js
function responseBody(ctx) {
  const body = ctx.body

  if (typeof body === 'string') {
    ctx.res.end(body)
  }

  if (typeof body === 'object') {
    ctx.res.end(JSON.stringify(body))
  }
}
```

ctx.body 为自定义向客户端返回的报文信息，如设置 `ctx.body = {code: 1000, resultMsg: 'success',data: {name: 'chriskwok'}}`

现在把所有完成的工作一起统一到 App 类上，需要注意的是目前中间件的位置依然是普通的数组，当前的 responseBody 在同步调用完所有的中间件函数后同步调用即可，后续最后处理 koa 中间机制的时候会将其封装成一条 Promise 链

```js
const http = require('http')

class App {
  constructor() {
    this.middleware = []
    this.ctx = ctx
    this.request = request
    this.response = response
  }

  use(fn) {
    this.middleware.push(fn)
  }

  createServerCallback() {
    return (...httpServerArgs) => {
      const ctx = this.createContext(...httpServerArgs)

      middleware.forEach(fn => fn(...httpServerArgs))

      this.responseBody(ctx)
    }
  }

  createContext(request, response) {
    const ctx = Object.create(this.ctx)

    ctx.request = Object.create(this.request)
    ctx.response = Object.create(this.response)
    ctx.req = request
    ctx.res = response

    return ctx
  }

  responseBody(ctx) {
    const body = ctx.body

    if (typeof body === 'string') {
      ctx.res.end(body)
    }

    if (typeof body === 'object') {
      ctx.res.end(JSON.stringify(body))
    }
  }

  listen(...args) {
    http.createServer(this.createServerCallback()).listen(...args)
  }
}
```

### koa 的中间件处理机制

Koa 的中间件和 Express 不同，Koa 选择了洋葱圈模型
所有的请求经过一个中间件的时候都会执行两次，对比 Express 形式的中间件，Koa 的模型可以非常方便的实现后置处理逻辑，对比 Koa 和 Express 的 Compress 中间件就可以明显的感受到 Koa 中间件模型的优势。

- [koa-compress](https://github.com/koajs/compress/blob/master/index.js) for Koa.
- [compression](https://github.com/expressjs/compression/blob/master/index.js) for Express.

且在 koa2 中采用了 async await 的机制，转而舍弃了 yield，要如何控制整条链路在贯穿整个请求过程中同步执行呢？这里采用 Promise 链来控制流程

具体实现方式不再赘述，具体查看 [十行代码实现 koa2 洋葱模型](/2019/02/22/writeSomething/koa2OnionModel/)

核心函数也很精简，主要目的无非是将多个函数以一个函数的调用包装另一个函数的方式串联起来，为了保证代码的同步执行在其中使用了 Promise 链式调用

现在将 koa2 的中间件处理机制一起加到 App 中

```js
const http = require('http')

const compose = ctx => async middlewares =>
  await middlewares.reduceRight(
    (next, middleware) =>
      (next = ((ctx, middleware, oldNext) => async () =>
        await middleware(ctx, oldNext))(ctx, middleware, next)),
    async () => Promise.resolve()
  )()

class App {
  constructor() {
    this.middleware = []
    this.ctx = ctx
    this.request = request
    this.response = response
  }

  use(fn) {
    this.middleware.push(fn)
  }

  createServerCallback() {
    return (...httpServerArgs) => {
      const ctx = this.createContext(...httpServerArgs)

      compose(this.middleware)(ctx).then(() => this.responseBody(ctx))
    }
  }

  createContext(request, response) {
    const ctx = Object.create(this.ctx)

    ctx.request = Object.create(this.request)
    ctx.response = Object.create(this.response)
    ctx.req = request
    ctx.res = response

    return ctx
  }

  responseBody(ctx) {
    const body = ctx.body

    if (typeof body === 'string') {
      ctx.res.end(body)
    }

    if (typeof body === 'object') {
      ctx.res.end(JSON.stringify(body))
    }
  }

  listen(...args) {
    http.createServer(this.createServerCallback()).listen(...args)
  }
}
```

### 错误捕获

保证异常情况下对客户端有正确的输出
通过同步方式编写异步代码带来的另外一个非常大的好处就是异常处理非常自然，使用 try catch 就可以将按照规范编写的代码中的所有错误都捕获到。在 eggjs 这样我们可以很便捷的编写一个自定义的错误处理中间件，只需要将这个中间件放在其他中间件之前，就可以捕获它们所有的同步或者异步代码中抛出的异常了。我们这里简单处理

```js
const EventEmit = require('events')

class App extends EventEmit {
  constructor() {
    super()
  }

  onerror(err, ctx) {
    this.emit('error', err)

    ctx.res.end(err.message || 'Oooooops Error.')
  }

  createContext(request, response) {
    const ctx = Object.create(this.ctx)

    ctx.request = Object.create(this.request)
    ctx.response = Object.create(this.response)
    ctx.req = request
    ctx.res = response

    return ctx
  }

  createServerCallback() {
    return (...httpServerArgs) => {
      const ctx = this.createContext(...httpServerArgs)

      compose(this.middleware)(ctx)
        .then(() => this.responseBody(ctx))
        .catch(err => this.onerror(err, ctx))
    }
  }
}
```

至此所有的封装基本完成，完整代码以及测试如下

```js
const http = require('http')
const url = require('url')
const EventEmit = require('events')

const request = {
  get query() {
    return url.parse(this.request.url, true).query
  }
}

// response
const response = {
  get body() {
    return this._body
  },

  set body(data) {
    this._body = data
  },

  get status() {
    return this.res.statusCode
  },

  set status(code) {
    this.res.status = code
  }
}

const ctx = {}

const ctxGetter = {
  request: ['query'],
  response: ['body', 'status']
}

const ctxSetter = {
  response: ['body', 'status']
}

const __defineProxyGetter__ = (prop, name) =>
  new Proxy(
    {
      get() {
        return this[prop][name]
      }
    },
    ctx
  )

const __defineProxySetter__ = (prop, name) =>
  new Proxy(
    {
      set(val) {
        this[prop][name] = val
      }
    },
    ctx
  )

// __defineProxy__()
Object.keys(ctxGetter).forEach(prop =>
  ctxGetter[prop].forEach(name => __defineProxyGetter__(prop, name))
)

// __defineProxy__()
Object.keys(ctxSetter).forEach(prop =>
  ctxGetter[prop].forEach(name => __defineProxySetter__(prop, name))
)

const compose = ctx => async middlewares =>
  await middlewares.reduceRight(
    (next, middleware) =>
      (next = ((ctx, middleware, oldNext) => async () =>
        await middleware(ctx, oldNext))(ctx, middleware, next)),
    async () => Promise.resolve()
  )()

class App extends EventEmit {
  constructor() {
    super()

    this.middleware = []
    this.ctx = ctx
    this.request = request
    this.response = response
  }

  use(fn) {
    this.middleware.push(fn)
  }

  onerror(err, ctx) {
    this.emit('error', err)

    ctx.res.end(err.message || 'Oooooops Error.')
  }

  createContext(request, response) {
    const ctx = Object.create(this.ctx)

    ctx.request = Object.create(this.request)
    ctx.response = Object.create(this.response)
    ctx.req = request
    ctx.res = response

    return ctx
  }

  httpCreateServer() {
    return (...httpServerArgs) => {
      const ctx = this.createContext(...httpServerArgs)

      return compose(ctx)(this.middleware)
        .then(() => this.responseBody(ctx))
        .catch(err => this.onerror(err, ctx))
    }
  }

  responseBody(ctx) {
    const body = ctx.body || 'Hello world'

    if (typeof body === 'string') {
      ctx.res.end(body)
    }

    if (typeof body === 'object') {
      ctx.res.end(JSON.stringify(body))
    }
  }

  listen(...args) {
    http.createServer(this.httpCreateServer()).listen(...args)
  }
}

// 测试
const app = new App()

app.use(async (ctx, next) => {
  console.log(1)
  await next()
  ctx.body = 'hello world'
  console.log(4)
})

app.use(async (ctx, next) => {
  console.log(2)

  // throw new Error('throw error')
  await next()
  console.log(3)
})

app.on('error', err => {
  console.log(err, 'had been catched')
})

app.listen(3000, () => console.log('server is running at: localhost:3000'))

// output:
// 1
// 2
// 3
// 4
```
