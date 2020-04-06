---
date: 2019-10-08
title: Call function queue - 三种函数队列调用问题的归档
template: post
thumbnail: '../thumbnails/algorithm.png'
slug: call-function-queue
categories:
  - Algorithm
  - Popular
tags:
  - interceptor
  - reduce
  - compose
  - functional
  - vue-router
  - redux
---

## 实现 axios 的拦截器

如何实现 axios 的拦截器听起来很空泛，可以换个问法：有若干个函数，如何保证他们彼此依次按顺序调用？
这里借助 Promise 的链式调用的小技巧，分别把每一个函数包装为 Promise 链上的每一个回调。

```js
// 函数队列
const fns = []

// 借助 reduce
function generatePromiseChain(fns) {
  return fns.reduce((promises, fn) => {
    promises = promises.then(fn)

    return promises
  }, Promise.resolve())
}

// invoke execution
generatePromiseChain(fns).then(() => console.log('end'))
```

这样我们就得到了一条按顺序执行的 Promise 链。
进行简单测试：

```js
const fns = [
  () => console.log('1'),
  () => console.log('2'),
  () => console.log('3')
]

generatePromiseChain(fns).then(() => console.log('end'))

// output:
// 1
// 2
// 3
// end
```

上面已经实现一条按序调用的函数队列了，但是函数的执行是一次性完成的而无法由用户主动控制，那么如何控制这条 Promise 链，让每次的函数调用依赖用户的控制呢？换句话说就是每一个函数的调用需要一个开关，当开关打开的时候才发起调用。

## 实现 vue-router 的路由拦截

这里的实现方式的关键在于这个“开关”。
既然开关打开是才开启下一个函数的调用，那么就把开关设计为一个函数，把下一个函数的的调用包装在这个开关内部（类似装饰者模式）即可，那么每次调用开关这个函数就是开启下一个函数的调用。
下面封装一个 compose 函数。

```js
// 构造 compose 函数
function compose(fns) {
  // 初始化调用函数队列 从第一个开始自调用
  return void (function dispatch(order = 0) {
    // 队列存在当前项函数便发起调用 同时在当前项函数入参新增开关回调函数 开关内部包装下一个函数的调用
    return (
      fns[order] &&
      fns[order](function() {
        // 函数队列索引自加1进行下一个函数调用
        return dispatch(order + 1)
      })
    )
  })()
}
```

compose 已经基本完成封装，测试结果如下：

```js
const fns = [
  next => console.log('1') || next(),
  next => console.log('2') || next(),
  () => console.log('end'),
  () => console.log('3')
]

compose(fns)

// 由于函数队列的第三个参数没有开启下一个函数调用的开关，所以输出结果如下：

// output:
// 1
// 2
// end
```

上面已经说了函数队列调用的两种模式：

- 链式同步调用
- 开关式同步调用

下面再继续说说第三种洋葱模型式函数队列调用（第三次提到了 🤣，但既然是统一归档，那么精粹的同类型函数队列的调用岂能不放在一起）

## 实现 Koa2 洋葱模型

简单的来说洋葱模型式调用就是相当于给每一个函数调用增加了一个支持后续处理的容错机制，属于由外向内调用处理一部分业务逻辑（或出现问题时）再由内向外可以处理后续逻辑的机制。
具体的细节很简单不再赘述。

```js
// 构造 compose 函数（ctx 为 Koa 的上下文对象）
const compose = ctx => async middlewares =>
  // 接受函数队列借助 reduceRight 方法由由向左进行包装（这样才可以保证最外层函数是队列的第一个最先执行）
  await middlewares.reduceRight(
    (next, middleware) =>
      // 从右向左将队列的每个函数包装为下一个函数的 next 开关
      (next = ((ctx, middleware, oldNext) => async () =>
        await middleware(ctx, oldNext))(ctx, middleware, next)),
    async () => Promise.resolve()
  )()
```

以上便简单封装完毕了。
下面进行测试：

```js
const middlewares = [
  async (ctx, next) => {
    console.log(1)
    await next()
    console.log(2)
  },
  async (ctx, next) => {
    console.log(3)
    await next()
    console.log(4)
  },
  async (ctx, next) => {
    console.log(5)
    await next()
    console.log(6)
  }
]

compose(null)(middlewares)

// output:
// 1
// 3
// 5
// 6
// 4
// 2
```

## Last

以上便是本文归档的三种函数队列简单调用的模式：

- 链式调用
- 开关式调用
- 洋葱模型式调用

The End.🎆
