---
title: 轻量版koa2框架的简易实现
tags:
  - koa
date: 
categories: 封装
index_img: /img/index.jpg
---

前端开发人员的服务端之旅大都从 express、koa 这类 node 框架开始
<!-- more -->

之前简单写过koa的中间件处理模型
> [十行代码实现 koa2 洋葱模型](/2019/02/22/writeSomething/koa2OnionModel/)

koa 作为目前流行的 node 框架之一，甚至很多企业级框架都是基于 koa 来封装（如eggjs），koa源码其实极为精简

### koa的机制
---
核心主要两点：
- 构造 ctx 上下文对象
- 中间件模型

此外还包括启动 http Server、异步流程控制、全局错误捕获等
### 从 Hello World 开始
---
首先启动一个 http Server，nodejs 提供的 http 模块可以做这件事情
```js
const http = require('http')

http
  .createServer(({
    httpVersion,
    headers,
    method,
    url,
    trailers,
    complete
  }, res) => {
    console.log(httpVersion, headers, method, url, trailers, complete)

    res.writeHead(200, {'Content-Type':'text/html'})
    res.write('Hello World')
  })
  .listen(3000, () => console.log('server is running at: localhost:3000'))
```
使用 `node` 运行这段脚本后，即可打开浏览器3000端口，会看到页面输出的 Hello World

方法 `createServer` 回调接受两个参数，分别是请求和响应的上下文对象，需要注意的是可以见到第一个参数 `httpVersion`、`headers` 等被我以解构的形式打印出来，但是第二个参数是不可以使用解构来获取 `write` 等方法的，这些方法是继承自 `ServerResponse` 这个构造函数的原型而非自身，可以通过打印 `res.constructor.prototype` 查看


...打游戏去了 未完待续