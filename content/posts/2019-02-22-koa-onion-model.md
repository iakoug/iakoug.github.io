---
date: 2019-02-22
title: Onion model
description: 十行代码实现 Koa 洋葱模型
template: post
slug: /koa-onion-model
category: R&D
cover: media/arseny-togulev-mnx3NlXwKdg-unsplash-middle.jpg
tags:
  - Koa
---

koa2 上独特的中间件流程控制，是一个典型的洋葱模型

---

### 运行 koa2 demo

```js
const Koa = require('koa2')

const app = new Koa()

app.use(async (ctx, next) => {
  console.log(1, ' start')
  await next()
  console.log(1, ' end')
})

app.use(async (ctx, next) => {
  console.log(2, ' start')
  await next()
  console.log(2, ' end')
})
app.use(async (ctx, next) => {
  console.log(3, ' start')
  await next()
  console.log(3, ' end')
})

app.listen(3000)
```

输出结果：

```js
// 1 start
// 2 start
// 3 start
// 3 end
// 2 end
// 1 end
```

展现如上图洋葱式的输出结果

### 归纳

接下来我们开始封装，要想达成洋葱模型式的流程控制，主要看上面 demo 中 callback 的第二个参数 next 方法（ctx 暂时和本文内容无关），一步一步来按照以下顺序思考：

- 首先变为最简 case：只有两个中间件函数
- 那么如果想要第一个函数执行 next 方法时，我们若是把 next 方法本身就是作为第二个中间件函数进行调用就会得到 `1 start -> 2 start -> 2 end -> 1 end` 的结果
- 同理如果是三个中间件函数，我们只需要将第三个中间件当做第二个中间件的 next 方法，再把第二个中间件当做第一个中间件的 next 回调

.

.

.
和之前的一篇 [动态规划和递归：从虎羊草开始](https://blog.iakoug.cn/post/2019-02-21-DynamicProgrammingAndRecursion) 类似进行简单的归纳之后得出思路，最关键的流程控制问题既然有了思路下面开始封装代码

### 三步完成封装

第一步：首先构造一个基本的 App 构造类进行方法挂载依赖收集等, 拥有一个 use 方法对中间件函数进行依赖收集，建立一个存储栈 middleware 用来存放收集的依赖，代码如下：

```js
class App {
  constructor() {
    this.middleware = []
  }
  use(fn) {
    this.middleware.push(fn)
  }
}
```

第二步：接下来我们需要构建一个 compose 函数 对收集到的依赖进行处理，参数是收集的依赖栈，返回一个通过一层层中间件函数包装的新函数，数组有个 reduce 方法可以很轻易的帮我们做到这件事情，但是由于我们是需要按照收集的中间件的顺序执行每一个中间件函数，按照我们上面的归纳如果按 1 -> 2 -> 3 的流程顺序遍历显然就会将最早收集的依赖包装在最内层，不过我们还有 reduceRight😄， 代码如下：

```js
const compose = middlewares =>
  middlewares.reduceRight(
    (oldNext, fn) => createNext(fn, oldNext),
    async () => Promise.resolve()
  )
```

第三步：显然接下来最关键的就是对上面 compose 函数中的 createNext 方法进行封装，我们需要两个参数，上面已经说过，next 方法是对下一个中间件函数的处理，一个参数是中间件函数，而另一个显然就是那个 next 方法，包装调用后返回一个新的 next 函数传递到下一层包装，代码如下：

```js
const createNext = (middleware, oldNext) => async () =>
  await middleware(oldNext)
```

以上基本的封装已经完成，核心代码只有 middlewares 和 createNext 两个函数，只有 6 行，下面对上面整个流程进行聚合测试

### Test

```js
class App {
  constructor() {
    this.middleware = []
  }
  use(fn) {
    this.middleware.push(fn)
  }
}

const app = new App()

app.use(async function m1(next) {
  console.log('m1')
  await next()
  console.log('m1 end')
})

app.use(async function m2(next) {
  console.log('m2')
  await next()
  console.log('m2 end')
})

app.use(async function m3(next) {
  console.log('m3')
  await next()
  console.log('m3 end')
})

const createNext = (middleware, oldNext) => async () =>
  await middleware(oldNext)

const compose = middlewares =>
  middlewares.reduceRight(
    (oldNext, fn) => createNext(fn, oldNext),
    async () => Promise.resolve()
  )

compose(app.middleware)()

// output:
// m1
// m2
// m3
// m3 end
// m2 end
// m1 end
```

达到预期结果 ahhhhh💐

### summary

当然这里只是简单的封装一下，关于上下文传递错误捕获之类都没做，但是已经完成一个标准的洋葱模型的流程控制了，下次有机会封装完整的 koa2
