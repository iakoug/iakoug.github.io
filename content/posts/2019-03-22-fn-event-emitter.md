---
date: 2019-03-22
title: Functional event emitter - 用函数式编程简单封装一个 `event emitter`
template: post
slug: /fn-event-emitter
category: Encapsulating
cover: media/arseny-togulev-mnx3NlXwKdg-unsplash-middle.jpg
tags:
  - functional
  - event emitter
---

函数式编程：函数式编程（英语：functional programming），又称泛函编程，是一种编程范式，它将电脑运算视为数学上的函数计算，并且避免使用程序状态以及易变对象
_起源于范畴论_

### 从函数柯里化说起

_从低阶函数变为高阶函数的过程_
从调用上来看，就是将 `f(a, b, c)` 变为支持 `f(a)(b)(c)`、`f(a, b)(c)`、`f(a)(b, c)`的形式
如最基本的 `(a, b) => a + b` 可以柯里化为：

```js
const f = a => b => a + b

// output:
f(4)(6) // 10
```

这表明函数柯里化是一种“预加载”函数的能力，通过传递一到两个参数调用函数，就能得到一个记住了这些参数的新函数。从某种意义上来讲，这是一种对参数的缓存，是一种非常高效的编写函数的方法

具体的细节不赘述主要内容是封装这个 event emitter，_很多时候 js 相关的类函数式操作（reduce、compose）被当做了函数式编程_, 有机会单独深入了解函数式编程 Functor、Monad、Applicative 后来仔细说说

### 传统封装 event emitter

首先定义一个拥有着基本的订阅和发布的 event 类

```js
class Event {
  addEventListener() {
    // to do
  }
  dispatch() {
    // to do
  }
}
```

这个类要有一个存储订阅者的地方，同时发布的时候要将消息推送给所有订阅该消息的订阅者

```js
class Event {
  constructor(eventMap = new Map()) {
    // 使用map存储订阅者
    this.eventMap = eventMap
  }
  addEventListener(event, handler) {
    // to do
  }
  dispatch(event) {
    // 发布
    // 该消息的订阅队列不存在
    if (!this.eventMap.has(event)) return

    // 推送消息
    this.eventMap.get(event).forEach(fn => fn())
  }
}
```

下面添加 event 的订阅方法，支持传入订阅消息名和对应的回调

```js
class Event {
  constructor(eventMap = new Map()) {
    // 使用map存储订阅者
    this.eventMap = eventMap
  }
  addEventListener(event, handler) {
    this.eventMap.has(event)
      ? // 判断当前订阅的消息队列中是否已经存在
        this.eventMap.set(event, this.eventMap.get(event).concat([handler]))
      : this.eventMap.set(event, [handler])
  }
  dispatch(event) {
    // 发布
    // 该消息的订阅队列不存在
    if (!this.eventMap.has(event)) return

    // 推送消息
    this.eventMap.get(event).forEach(fn => fn())
  }
}
```

以上基本的 event emitter 调度中心已经封装完成了正常使用应该是没有问题的
测试：

```js
const e = new Event()

e.addEventListener('e1', e => {
  console.log('handle e1 first')
})

e.addEventListener('e1', e => {
  console.log('handle e1 second', e)
})

e.dispatch('e1')

// output:
// handle e1 first
// handle e1 second
```

那么如何使用函数式编程的思想将上面的 event emitter 封装起来呢？

### Functional event emitter

##### Functional addEventListener

如传统封装方法的一致，addEventListener 内部需要分别使用消息类型 event，消息回调 handler 以及存储中心 eventMap，用柯里化的思想分别将这三个传入新封装的函数，新函数即为：

```js
const addEventListener = event
  => handler
    => eventMap
      => eventMap.has(event)
        // 判断逻辑不变
        ? new Map(eventMap).set(event, eventMap.get(event).concat([handler]))
        : new Map(eventMap).set(event, [handler])
```

##### Functional dispatch

同样，观察上面封装的 dispatch 方法，我们需要消息类型 event 和存储中心 eventMap 两个数据，下面也分为两个参数分别传入，改写的 dispatch 方法如下：

```js
const dispatch = event
  => eventMap
    => eventMap.has(event) && eventMap.get(event).forEach(fn => fn())
```

event emitter 类两个核心的函数已经改写完毕了，可是我们观察上面的 addEventListener 方法，可以看到上面的封装分三步将所需要的参数分别传入，调用即为：`addEventListener('e2')(() => log('hey'))`, 此时的返回值是一个需要接受存储中心 `eventMap` 为参数的一个新函数，这里需要注意
我们要对所有的 addEventListener 进行整合最终传入同一个 map 对象作为唯一存储对象，下面我们要写一个 compose 函数

##### Functional compose

这个 compose 需要接受函数的集合（函数即为`addEventListener('e2')(() => log('hey'))`的返回值的函数）作为参数，使用数组最强大的 reduce 方法对传入的函数进行批处理调用即可，如果大家熟悉 redux 里面的 compose 函数，其实都是一样的，都是处理一组函数集合的集中调用（类似的还有之前的一篇博客 [十行代码实现 Koa2 洋葱模型](https://blog.iakoug.cn/post/2019-02-22-KoaOnionModel) 中的 compose 函数）， 代码如下：

```js
const compose = (...fns)
  => fns.reduceRight((f, g)
    => (...args)
      => f(g(...args)))
```

至此，所有的封装基本已经完成了，使用函数式的封装，保护函数状态的单一性，下面进行测试：

```js
const addEventListeners = compose(
  addEventListener('e2')(() => log('hey')),
  addEventListener('e2')(() => log('hi'))
)

const m = addEventListeners(new Map())
dispatch('e2')(m)

// output:
// hey
// hi
```

End
