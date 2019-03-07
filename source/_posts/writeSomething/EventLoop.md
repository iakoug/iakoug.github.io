---
title: JS/Node的事件循环
tags:
  - 事件循环
  - 任务队列
date: 2019-03-07 11:21:00
categories: 你应该知道的
---

JS特色之一是单线程，那所谓的基于事件的异步机制是什么？
<!--more-->
# JS是单线程
All we know, JS是一种动态类型、弱类型、基于原型的脚本语言，浏览器上有着JS专属的引擎作为其解释器，V8
另外，JS是单线程语言，为何如此设计呢？其实原因很简单，JS是被用来设计在浏览器中使用，支持操作页面dom元素，假设同时有多个进程同时对同一dom元素进行crud，浏览器如何执行呢？所以这就是原因

另外JS虽然是单线程运行，但是在主线程运行之外还是有其他的侦听线程作为辅助的如事件触发线程、Http请求线程等，所以JS所谓的单线程并不孤单。浏览器内核实现允许多个线程异步执行，这些线程在内核制控下相互配合以保持同步

那单线程却能执行异步任务为何？主要是因为JS中存在事件循环(Event Loop)和任务队列(Task Queue)也叫事件队列

# 事件循环&事件队列
JS 会创建一个类似于 while (true) 的循环，每执行一次循环体的过程称之为 Tick。每次 Tick 的过程就是查看是否有待处理事件，如果有则取出相关事件及回调函数放入执行栈中由主线程执行。待处理的事件会存储在任务队列中（事件队列），也就是每次 Tick 会查看任务队列中是否有需要执行的任务

一个浏览器环境只能有一个事件循环，而一个事件循环主要包含 macrotask 和 microtask 两个事件队列（macrotask 和 microtask 是异步任务的两种分类），每个任务都有一个任务源（Task source）。同一个任务队列中的任务必须按先进先出的顺序执行。任务队列是一个先进先出的队列

在挂起任务时，JS 引擎会将所有任务按照类别分到macrotask 和 microtask这两个队列中

每一次事件循环，只处理一个 macrotask，待该 macrotask 完成后，所有的 microtask 会在同一次循环中处理。处理这些 microtask 时，还可以将更多的 microtask 入队，它们会一一执行，直到整个 microtask 队列处理完后开始执行下一个 macrotask 开启新一轮事件循环

### 宏任务（Macrotask）
- 整体代码(script)
- setTimeout
- setInterval
- setImmediate（node）
- I/O
- UI rendering
- requestAnimationFrame（浏览器）

### 微任务（Microtask）
- process.nextTick（node）
- Promise.then catch finally
- Object.observe（已废弃）
- MutationObserver（浏览器）

*括号内表示支持的环境，未标记则都支持*

# 误解
面试过很多人发现他们在回答相关问题时总会有各种误解：“Promise是微任务，解析执行代码时遇到promise会将其推入微任务队列等”

- 很多人说Promise是微任务，其实只需要把Promsie当做普通的构造函数的初始化，.then才是微任务，触发.then的时候才会将.then的回调推入任务队列
- 键盘事件由webcore的 DOM Binding 模块来处理，当事件触发时将监听事件的回调函数推入任务队列
- setTimeout由webcore的 timer 模块来进行延时处理，当时间到达的时候，才会将回调函数推入任务队
- ajax 则会由webcore的 network 模块来处理，在网络请求完成返回之后，才会将回调函数推入任务队

未完待续...👏