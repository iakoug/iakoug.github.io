---
date: 2019-03-07
title: Event loop
description: JS 特色之一是单线程，那所谓的基于事件的异步机制是什么
template: post
slug: /event-loop
cover: media/arseny-togulev-mnx3NlXwKdg-unsplash-middle.jpg
category: R&D
tags:
  - Js
---

"JS 特色之一是单线程，那所谓的基于事件的异步机制是什么？"

---

### JS 是单线程

All we know, JS 是一种动态类型、弱类型、基于原型的脚本语言，浏览器上有着 JS 专属的引擎作为其解释器，V8
另外，JS 是单线程语言，为何如此设计呢？其实原因很简单，JS 是被用来设计在浏览器中使用，支持操作页面 dom 元素，假设同时有多个进程同时对同一 dom 元素进行 crud，浏览器如何执行呢？所以这就是原因

另外 JS 虽然是单线程运行，但是在主线程运行之外还是有其他的侦听线程作为辅助的如事件触发线程、Http 请求线程等，所以 JS 所谓的单线程并不孤单。浏览器内核实现允许多个线程异步执行，这些线程在内核制控下相互配合以保持同步

那单线程却能执行异步任务为何？主要是因为 JS 中存在事件循环(Event Loop)和任务队列(Task Queue)也叫事件队列

### JS 事件循环

类似进入一个 while(true)的事件循环，直到没有事件观察者退出，每个异步事件都生成一个事件观察者，如果有事件发生就调用该回调函数

一个浏览器环境只能有一个事件循环，而一个事件循环主要包含 macrotask 和 microtask 两个事件队列（macrotask 和 microtask 是异步任务的两种分类），每个任务都有一个任务源（Task source）。同一个任务队列中的任务必须按先进先出的顺序执行

在挂起任务时，JS 引擎会将所有任务按照类别分到 macrotask 和 microtask 这两个队列中

每一次事件循环，只处理一个 macrotask，待该 macrotask 完成后，所有的 microtask 会在同一次循环中处理。处理这些 microtask 时，还可以将更多的 microtask 入队，它们会一一执行，直到整个 microtask 队列处理完后开始执行下一个 macrotask 开启新一轮事件循环

##### 宏任务（Macrotask）

- 整体代码(script)
- setTimeout
- setInterval
- setImmediate（node）
- I/O
- UI rendering
- requestAnimationFrame（浏览器）

##### 微任务（Microtask）

- process.nextTick（node）
- Promise.then catch finally
- Object.observe（已废弃）
- MutationObserver（浏览器）

_括号内表示支持的环境_

##### 案例分析

```js
// 全局scripts macrotask
console.log("macrotask scripts start");

// macrotask
setTimeout(() => {
  Promise.resolve().then(() => console.log("macrotask 1 inner: microtask"));

  console.log("macrotask 1");
}, 0);

// microtask
Promise.resolve().then(() => console.log("microtask 1"));

// microtask
Promise.resolve().then(() => console.log("microtask 2"));

console.log("macrotask scripts end");

// output:

// VM322:1  macrotask scripts start
// VM322:16 macrotask scripts end
// VM322:11 microtask 1
// VM322:14 microtask 2
// VM322:7  macrotask 1
// VM322:5  macrotask 1 inner: microtask
```

首先进入 **全局 scripts macrotask**

- 执行当前 macrotask 中所有同步代码
  - // VM322:1 macrotask scripts start
  - // VM322:16 macrotask scripts end
- 执行完毕后按先进先出的顺序执行 microtask 队列
  - // VM322:11 microtask 1
  - // VM322:14 microtask 2
- 当前 macrotask 执行完毕查找当前 macrotask 队列，若已经清空则结束事件循环，否则开启下一轮循环
- 新一轮循环执行当前 macrotask 中所有同步代码
  - // VM322:7 macrotask 1
- 执行完毕后按先进先出的顺序执行 microtask 队列
  - // VM322:5 macrotask 1 inner: microtask
- 当前 macrotask 执行完毕查找当前 macrotask 队列，若已经清空则结束事件循环，否则开启下一轮循环
  - 执行完毕结束循环

##### 误解

面试过很多人发现他们在回答相关问题时总会有各种误解：“Promise 是微任务，解析执行代码时遇到 promise 会将其推入微任务队列等”

- 一些人说 Promise 是微任务，其实 Promsie 只是普通的构造函数的初始化，.then 等钩子才是微任务，触发.then 的时候才会将.then 的回调推入任务队列
- 键盘事件由 webcore 的 DOM Binding 模块来处理，当事件触发时将监听事件的回调函数推入任务队列
- setTimeout 由 webcore 的 timer 模块来进行延时处理，当时间到达的时候，才会将回调函数推入任务队
- ajax 则会由 webcore 的 network 模块来处理，在网络请求完成返回之后，才会将回调函数推入任务队

### Node 的事件循环

node 是 js 的一个 runtime，所以事件循环同样是 Node.js 处理非阻塞 I/O 操作的机制。由于大多数内核都是多线程的，node.js 会尽可能将操作装载到系统内核。因此它们可以处理在后台执行的多个操作。当其中一个操作完成时，内核会告诉 Node.js，以便 node.js 可以将相应的回调添加到轮询队列中以最终执行

当 Node.js 启动后，它会初始化事件轮询；处理已提供的输入脚本（或丢入 REPL），它可能会调用一些异步的 API 函数调用，安排任务处理事件，或者调用 process.nextTick，然后开始处理事件循环

与浏览器端的事件循环相比有很大不同，node 的事件循环主要分为六个阶段（Phase），每个阶段都会有一个类似于队列的结构, 存储着该阶段需要处理的回调函数：

- timer：用一个 for 循环处理所有 setTimeout 和 setInterval 的回调
  - 检查 timer 队列是否有到期的 timer 回调，如果有，将到期的 timer 回调按照 timerId 升序执行
  - 检查是否有 process.nextTick 任务，如果有，全部执行
  - 检查是否有 microtask，如果有，全部执行
  - 退出该阶段
- Pending I/O Callback Phase：执行你的 fs.read, socket 等 IO 操作的回调函数, 同时也包括各种 error 的回调
  - 检查是否有 pending 的 I/O 回调。如果有，执行回调。如果没有，退出该阶段
  - 检查是否有 process.nextTick 任务，如果有，全部执行
  - 检查是否有 microtask，如果有，全部执行
  - 退出该阶段
- idle, prepare：仅系统内部使用
- Poll Phase：检索新的 I/O 事件;执行与 I/O 相关的回调（几乎所有情况下，除了关闭的回调函数，它们由计时器和 setImmediate 排定的之外），其余情况 node 将在此处阻塞，循环中最重要的一个 Phase, 作用是等待异步请求和数据，最重要是因为它支撑了整个消息循环机制，Poll Phase 首先会执行 watch_queue 队列中的 IO 请求, 一旦 watch_queue 队列空, 则整个消息循环就会进入 sleep , 从而等待被内核事件唤醒
  首先检查是否存在尚未完成的回调，如果存在，那么分两种情况。
  - 第一种情况：
    - 如果有可用回调（可用回调包含到期的定时器还有一些 IO 事件等），执行所有可用回调
    - 检查是否有 process.nextTick 回调，如果有，全部执行
    - 检查是否有 microtaks，如果有，全部执行
    - 退出该阶段
  - 第二种情况：
    - 如果没有可用回调
    - 检查是否有 immediate 回调，如果有，退出 poll 阶段。如果没有，阻塞在此阶段，等待新的事件通知
    - 如果不存在尚未完成的回调，退出 poll 阶段
- Check Phase：这个阶段只处理 setImmediate 的回调函数（因为 Poll Phase 阶段可能设置一些回调, 希望在 Poll Phase 后运行. 所以在 Poll Phase 后面增加了这个 Check Phase.）
  - 如果有 immediate 回调，则执行所有 immediate 回调
  - 检查是否有 process.nextTick 回调，如果有，全部执行
  - 检查是否有 microtaks，如果有，全部执行
  - 退出 check 阶段
- Close Callbacks Phase：专门处理一些 close 类型的回调. 比如 socket.on('close', ...). 用于资源清理
  - 如果有 immediate 回调，则执行所有 immediate 回调
  - 检查是否有 process.nextTick 回调，如果有，全部执行
  - 检查是否有 microtaks，如果有，全部执行
  - 退出 closing 阶段
    一轮循环结束后检查是否有活跃的 handles（定时器、IO 等事件句柄）如果有就继续下一轮循环，如果没有则结束事件循环，退出程序

事件循环过程如下图示意*每个框内代表一个阶段*：

```js
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

每个阶段都有一个 FIFO 队列来执行回调。虽然每个阶段都是特殊的，但通常情况下，当事件循环进入给定的阶段时，它将执行特定于该阶段的任何操作，然后在该阶段的队列中执行回调，直到队列用尽或最大回调数已执行。当该队列已用尽或达到回调限制，事件循环将移动到下一阶段

由于这些操作中的任何一个都可能计划 更多的 操作，并且在 轮询 阶段处理的新事件由内核排队，因此在处理轮询事件时，轮询事件可以排队。因此，长时间运行回调可以允许轮询阶段运行大量长于计时器的阈值

在每次运行的事件循环之间，Node.js 检查它是否在等待任何异步 I/O 或计时器，如果没有的话，则关闭干净

补充：

1. setImmediate 对比 setTimeout
   setImmediate 和 setTimeout 很类似，但何时调用行为完全不同

- setImmediate 设计为在当前 轮询 阶段完成后执行脚本
- setTimeout 计划在毫秒的最小阈值经过后运行的脚本
  执行计时器的顺序将根据调用它们的上下文而异。如果二者都从主模块内调用，则计时将受进程性能的约束（这可能会受到计算机上运行的其它应用程序的影响）

2. process.nextTick
   process.nextTick 在技术上不是事件循环的一部分。相反，无论事件循环的当前阶段如何，都将在当前操作完成后处理 nextTickQueue。这里的一个操作被视作为一个从 C++ 底层处理开始过渡，并且处理需要执行的 JavaScript 代码
   任何时候在给定的阶段中调用 process.nextTick，所有传递到 process.nextTick 的回调将在事件循环继续之前得到解决。这可能会造成一些糟糕的情况, 因为它允许您通过进行递归 process.nextTick 来“饿死”您的 I/O 调用，阻止事件循环到达 轮询 阶段

Links:

- [The Node.js Event Loop, Timers, and process.nextTick()](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)
- [深入分析 Node.js 事件循环](https://blog.csdn.net/i10630226/article/details/81369841)
