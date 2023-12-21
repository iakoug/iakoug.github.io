---
date: 2021-03-11
title: Rxjs 初探
template: post
thumbnail: "../thumbnails/post.png"
slug: /rxjs-preliminary
category: Library
tags:
  - rxjs
---

本文不会研究 rxjs 的具体使用，只是在总体上对 rxjs 进行一些初步探索

---

## RxJS: Reactive Extensions For JavaScript

JS 的响应式拓展的一个库（其他语言 python、java 等都有各自的实现），核心思想是函数式编程和流式编程，区分于面向对象编程，可以称之为 Reactive Programming

## Why rxjs

1. 应用上存在大量的异步操作，而异步意味着复杂的状态难以控制和管理（即使 Promise 和 Async/Await 可以解决很多异步问题，但是在非常复杂的场景下依然显得吃力）

2. API 统一
   web 标准的 api 接口使用起来都不相同，而可以借助 rxjs 统一所有 api 的调用  来书写更优雅以及美观的代码

#### Cases

- Race condition<br/>
  异步的读写同一个字段，实际结果取决于两个操作实际完成的顺序
- 内存泄漏<br/>
  常出现在 SPA 应用，订阅的事件没有及时清除，存储在内存的数据由于引用得不到销毁
- 复杂的状态<br/>
  彼此关联的异步操作较多难以控制
- 异步错误捕获<br/>

#### JS APIs

- DOM Events
- XMLHttpRequest
- fetch
- WebSockets
- Server Send Events
- Service Worker
- Node Stream
- Timer

## Composition of rxjs

关于 rxjs 整体分别涉及一下概念

- Observable
- Observer
- Operator
- Subject
- Scheduler

#### Observable

Observable 是 rxjs 中最核心的一个思想（之前有使用过一个叫做 Kendo 的 UI 框架也是使用类似的思想），具体的设计像是发布订阅和迭代器的结合体

- 发布订阅设计模式（Observer）<br />
  DOM 的事件监听就是发布订阅的模式，当用户触发浏览器事件后会调用订阅时传入的 callback
- 迭代器模式（Iterator）<br />
  ES6 Iterator

Observable 的思想类似于这两种模式的结合，推送数据后借助 map、filter 等方法对数据进行二次处理，同时这个过程是渐进式的

创建一个 Observable 对象

```ts
const observable = Rx.Observable.create(({ next }) => {
  next("A"); // RxJS 4.x 以前的版本用 onNext
  next("B");
});

// 订阅
observable.subscribe((value) => {
  console.log(value);
});
// A
// B
```

#### Observer

Observable 可以被订阅，而订阅 Observable 的对象被称为 Observer，Observer 主要有以下三个方法

- next<br />
  Observable 每次推送都会触发
- complete<br />
  Observable 推送完毕触发
- error<br />
  Observable 发生错误

```ts
const observable = Rx.Observable.create(({ next, complete, error }) => {
  next("A"); // RxJS 4.x 以前的版本用 onNext
  next("B");
  complete();
  error({});
  next("C");
});

const observer = {
  next: (v) => console.log(v),
  complete: () => console.log("Complete"),
  error: (e) => console.log("Error"),
};

observable.subscribe(observer);
// A
// B
// Complete
// Error
```

Observable 内部可以主动调用 complete 方法后续 next 不会触发，以及主动抛出 error

#### Operators

- map
- mapTo
- filter
- take
- first
- takeUntil
- concatAll
- switch
- concat
- skip
- takeLast/last
- startWith
- merge
- mergeAll
- combineLatest
- withLatestFrom
- scan
- buffer
- delay
- delayWhen
- debounce
- throttle
- distinct
- distinctUntilChanged
- catch
- retry
- retryWhen
- repeat
- concatMap
- switchMap
- mergeMap
- switchMap mergeMap concatMap
- window
- window
- windowToggle
- groupBy
- ...

#### Subject

Subject 同时是 Observable 又是 Observer
Subject 会对內部的 observers 的订阅列表进行广播(multiCast)

其实 Subject 就是 Observer Pattern 的实现同时继承自 Observable

## 版本差异

当前 rxjs 的版本已经在 7.x 的 beta 版本

和 6.x 的版本相比除了多了一些 Operators 之外，调用的方式发生了 chain to pipe 的变化
5.x:

```ts
const source = Rx.Observable.from(["a", "b", "c", "d", 2]).zip(
  Rx.Observable.interval(500),
  (x, y) => x
);

const example = source.map((x) => x.toUpperCase()).retry(1);

example.subscribe({
  next: console.log,
  error: console.log,
  complete: () => console.log("complete"),
});
// a
// b
// c
// d
// a
// b
// c
// d
// TypeError: x.toUpperCase is not a function
```

6.x:

```ts
import { map, retry } from "rxjs/operators";
import { interval, zip } from "rxjs";

const source = Rx.Observable.from(["a", "b", "c", "d", 2]).pipe(
  zip(interval(500), (x, y) => x)
);

const example = source.pipe(map((x) => x.toUpperCase()).pipe(retry(1)));

example.subscribe({
  next: console.log,
  error: console.log,
  complete: () => console.log("complete"),
});
```

独立了每个文件的引用依赖方便 Tree shaking 所以 6.x 相对于 5.x 体积得到了极大的减小

## 问题

在 rxjs 中都是流式操作，如何区分一个操作本身到底是同步还是异步
