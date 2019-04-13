---
title: 使用ts封装一个fetch请求库---拦截器篇
tags:
  - fetch
  - interceptor
date: 2019-04-13 11:34:00
categories: 封装
---

封装自己的fetch请求库---拦截器篇
<!-- more -->
关于ajax有非常多的封装库，最近两天自己简单封装了一下，好好体验其中三昧，内容不算太少，分为三篇说完。
本篇博客的介绍内容是封装基于原生fetch的一个拦截器（interceptor）。
*请求库封装的源码在[https://github.com/rollawaypoint/obtain-fetch](https://github.com/rollawaypoint/obtain-fetch)*

# 初始化请求基类
首先构造一个包含请求方法的基类，这样做方便随时向外暴露自己新增的接口
```ts
class Obtain {
  constructor() {
  }
  curl(url: string, options: any = {}): Promise<any> {
    return fetch(url, options)
  }
}

const obtain = new Obtain()
export default obtain.curl
```
*这里使用原生的fetch，关于兼容性封装xmr对象或者针对多端请求后面可以自行封装*
基类Obtain拥有一个curl方法用来向外暴露发送异步请求

# 构造拦截器请求队列
*参考axios*
- 拦截器分为请求拦截器和响应拦截器
- 在请求拦截器和响应拦截器之间我们将真正的请求发出
- 请求拦截器的队列中对请求数据进行处理依次向下一个请求拦截器中传递直到触发真正请求
- 真正的请求触发后需要将返回值作为当前的上下文传到接下来的响应拦截器的队列中
- 依次执行响应拦截器队列中的回调对请求返回值进行处理
- 以一条promise链将所有的中间处理过程连接起来

# 构造拦截器类
Interceptor类拥有一个存储不同拦截器的队列 `handler`
构造 use 方法将用户定义的拦截器push进拦截器队列
构造 reducer 方法对拦截器队列中的拦截器函数进行批量处理

```ts
class Interceptor {
	public handler: Array<Array<any>>

	constructor() {
		this.handler = []
	}

	public use(success: Function, failed: Function): void {
		this.handler.push([success, failed])
	}

	public reducer(fn: Function): void {
		this.handler.forEach(handlerList => fn(handlerList))
	}
}

export default Interceptor
```

# 构造Fetch类
接受上面定义的拦截器进行初始化
自身拥有 curl 方法对外暴露进行请求的派发，内部使用调用fetch
```ts
interface TypeInterceptor {
  request: Interceptor,
  response: Interceptor
}
class Fetch {
  public interceptor: TypeInterceptor

  constructor() {
    this.interceptor = {
      request: new Interceptor(),
      response: new Interceptor()
    }
  }
  fetch(url, options) {
    return () => fetch(url, options)
  }

  curl(url: string, options: any = {}): Promise<any> {
  }
}

export default Fetch
```

# 构造curl方法
构造curl方法对拦截器队列进行初始化进行链式调用
```js
function curl(url: string, options: any = {}): Promise<any> {
  options.method = options.method || 'GET'

  // 初始化promise
  let promise = Promise.resolve(options)

  // 构造promise调用链
  // 请求派发放在中间
  const chain: Array<Array<Function|any>> = [[this.fetch(url, options), undefined]]

  // 将收集到的请求拦截器依次放在promise调用链中请求派发之前
  this.interceptor.request.reducer(handlerList => chain.unshift(handlerList))
  // 将收集到的响应拦截器依次放在promise调用链中请求派发之后
  this.interceptor.response.reducer(handlerList => chain.push(handlerList))

  // excute chain inteceptor
  while (chain.length) {
    promise = promise.then(...chain.shift())
  }

  return promise
}
```
至此拦截器相关封装已经极为简单的完成了

# 对外暴露curl以及封装use方法便于使用
```ts
const obtain = new Fetch()

// 使用简单的拦截器进行接口response的处理
obtain.interceptor.response.use(
  res => res.json(),
  err => ({ err, msg: 'oops, something wrong...'})
)

// bind工具 对导出的curl上下文进行绑定
const bind = (fn, context) => function() {
  return fn.apply(context, Array.from(arguments))
}

const curl: any = bind(Fetch.prototype.curl, obtain)

// 封装use方法 将fetch实例传递给外部传入的回调
curl.use = function(plugin: Function) {
  if (typeof plugin !== 'function') {
    return console.error('Error: plugin must be a function!')
  }

  plugin(obtain)
}

export default curl
```

# 使用
```js
// 拦截器
obtain.use(function(http) {
  http.interceptor.request.use(option => {
    console.log('in to interceptor ****************', option)
    return option
  }, null)
  http.interceptor.response.use(option => {
    console.log('after interceptor ****************')
    return option
  }, null)
})

// 并发
obtain.use(function(http) {
  http.concurrency = 10
})

obtain('http://localhost:4000/banner').then(async res => {
  console.log(res, 'result')
})
```
至此fetch封装拦截器完成
