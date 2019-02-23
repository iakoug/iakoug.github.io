---
title: 十行代码实现Koa2洋葱模型
tags:
  - 封装
  - koa
  - 洋葱模型
date: 2019-02-22 19:00:00
categories: 封装
---

#### 十行代码实现Koa2洋葱模型

<!--more-->

#### 洋葱图模型
![avatar](/onion.png)

koa2上独特的中间件流程控制，是一个典型的洋葱模型

# 运行 koa2 demo
```js
const Koa = require('koa2')

const app = new Koa()

app.use(async (ctx, next)=>{
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
```bash
1 start
2 start
3 start
3 end
2 end
1 end
```

展现如上图洋葱式的输出结果

# 归纳

接下来我们开始封装，要想达成洋葱模型式的流程控制，主要看上面demo中 callback 的第二个参数 next 方法（ctx暂时和本文内容无关），一步一步来按照以下顺序思考：
- 首先变为最简case：只有两个中间件函数
- 那么如果想要第一个函数执行next方法时，我们若是把next方法本身就是作为第二个中间件函数进行调用就会得到 `1 start -> 2 start -> 2 end -> 1 end` 的结果
- 同理如果是三个中间件函数，我们只需要将第三个中间件当做第二个中间件的 next 方法，再把第二个中间件当做第一个中间件的 next 回调

.

.

.

.

.

.
和之前的一篇 [动态规划和递归：从虎羊草开始](http://localhost:4000/2019/02/21/do%20something/%E5%8A%A8%E6%80%81%E8%A7%84%E5%88%92%E5%92%8C%E9%80%92%E5%BD%92%EF%BC%9A%E4%BB%8E%E8%99%8E%E7%BE%8A%E8%8D%89%E5%BC%80%E5%A7%8B/#%E4%BB%8E%E6%9C%80%E5%9F%BA%E6%9C%AC%E7%9A%84%E6%83%85%E5%86%B5%E5%85%A5%E6%89%8B) 类似进行简单的归纳之后得出思路，最关键的流程控制问题既然有了思路下面开始封装代码

# 三步完成封装

第一步：首先构造一个基本的App构造类进行方法挂载依赖收集等, 拥有一个 use 方法对中间件函数进行依赖收集，建立一个存储栈 middleware 用来存放收集的依赖，代码如下：
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

第二步：接下来我们需要构建一个 compose 函数 对收集到的依赖进行处理，参数是收集的依赖栈，返回一个通过一层层中间件函数包装的新函数，数组有个 reduce 方法可以很轻易的帮我们做到这件事情，但是由于我们是需要按照收集的中间件的顺序执行每一个中间件函数，按照我们上面的归纳如果按1 -> 2 -> 3的流程顺序遍历显然就会将最早收集的依赖包装在最内层，不过我们还有 reduceRight😄， 代码如下：
```js
const compose = middlewares =>
  middlewares.reduceRight((oldNext, fn) =>
    createNext(fn, oldNext), async () => Promise.resolve())
```

第三步：显然接下来最关键的就是对上面 compose 函数中的 createNext 方法进行封装，我们需要两个参数，上面已经说过，next方法是对下一个中间件函数的处理，一个参数是中间件函数，而另一个显然就是那个next方法，包装调用后返回一个新的next函数传递到下一层包装，代码如下：
```js
const createNext = (middleware, oldNext) =>
  async () =>
    await middleware(oldNext)
```

以上基本的封装已经完成，核心代码只有 middlewares 和 createNext 两个函数，只有6行，下面对上面整个流程进行聚合测试

# 测试
```js
class App {
  constructor() {
    this.middleware = []
  }
  use(fn) {
    this.middleware.push(fn)
  }
}

const app = new App

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


const createNext = (middleware, oldNext) =>
  async () =>
    await middleware(oldNext)

const compose = middlewares =>
  middlewares.reduceRight((oldNext, fn) =>
    createNext(fn, oldNext), async () => Promise.resolve())

compose(app.middleware)()

// output:
// m1
// m2
// m3
// m3 end
// m2 end
// m1 end
```

达到预期结果ahhhhh💐

# summary

当然这里只是简单的封装一下，关于上下文传递错误捕获之类都没做，但是已经完成一个标准的洋葱模型的流程控制了，下次有机会讲解完整的封装 koa2