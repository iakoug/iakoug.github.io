---
date: 2020-09-27
title: 知识迁移 - Technology sharing
description: 从Axios源码解析到项目路由Lib实践
template: post
slug: /axios-crisp
category: R&D
cover: media/arseny-togulev-mnx3NlXwKdg-unsplash-middle.jpg
tags:
  - Axios
  - Compose
---

---

## Axios

#### 请求

```js
import axios from "axios";
// Send a POST request
axios({
  method: "post",
  url: "/user/12345",
  data: { firstName: "Fre d", lastName: "Flintstone" },
});
```

#### 请求配置

```js
const instance = axios.create({
  baseURL: "https://some-domain.com/api/",
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" },
});
```

#### 拦截器

```js
// Add a request interceptor
axios.interceptors.request.use(
 config => config,
 error => Promise.reject(error)
});
// Add a response interceptor
axios.interceptors.response.use(
 response => response,
 error => Promise.reject(error)
);
```

## Features

1. Make XMLHttpRequests from the browser
2. Make http requests from node.js
3. Supports the Promise API
4. Intercept request and response
5. Transform request and response data
6. Cancel requests
7. Automatic transforms for JSON data
8. Client side support for protecting against XSRF

## Implementation

![axios-implementation.png](https://i.loli.net/2020/10/11/YeZXyThmkIWjdA8.png)

## Constructor

```js
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager(),
  };
}
```

## Interceptor

- Axios
- instanceConfig
- InterceptorManager

```js
function InterceptorManager() {
  this.handlers = [];
}
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({ fulfilled: fulfilled, rejected: rejected });
  return this.handlers.length - 1;
};
InterceptorManager.prototype.eject = function eject(id) {
  this.handlers[id] = null;
};
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, (h) => fn(h));
};
```

## Request

```js
Axios.prototype.request = function request(config) {
  // ...
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);
  this.interceptors.request.forEach(function unshiftRequestInterceptors(
    interceptor,
  ) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });
  this.interceptors.response.forEach(function pushResponseInterceptors(
    interceptor,
  ) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });
  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }
  return promise;
};
```

## Configure & Export

```js
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);
  utils.extend(instance, Axios.prototype, context);
  utils.extend(instance, context);
  return instance;
}
var axios = createInstance(defaults);
axios.Axios = Axios;
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};
module.exports.default = axios;
```

## Relations

#### 知识迁移

> 一种学习对另一种学习的影响，是在学习这个连续过程中， 任何学习
> 都是在学习者已经具有的知识经验和认知结构、已获得的动作技能、习
> 得的态度等基础上进行的。

- Axios interceptor
- Vue-router
- Koa2/EggJs 中间件洋葱模型
- Redux compose
- Crisp

## Crisp

```js
import Router from '@yqb/crisp'

Router.use(instance => {
 instance.bark = () => console.log('Make some noise')
})
const crisp = new Router({
 persistentParamsList: ['mcId', 'customerFxId', 'cardName'],
 beforeEnter(config: any, next: Function) { // 前置
 // Your business
 next()
 },
 afterEach() { // Your business }, // 后置
})
crisp.bark() // Make some noise
crisp.push({path: '#/question'})
```

## Compose

- 链式（Axios interceptor 的 Promises 链，注意 async）
- 参数传递

#### crisp compose

```js
export const compose =
  (...middlewares) =>
  (...args) =>
    (function dispatch(order = 0) {
      return !middlewares[order]
        ? TypeError("Useless router middleware, plz check it out.")
        : middlewares[order](...args, () => dispatch(order + 1));
    })();
```

#### banker compose

```js
import BubbleToast from "../components/bubbleToast";
import { showBubbleTip, globalVar } from "./showBubbleTip";
import { Props as Config } from "../components/bubbleToast";

import bubble7bans from "@img/bubble-7bans.png";

const modalHandler = (next: () => void) => {
  globalVar.closeBubbleTimer = setTimeout(BubbleToast.close, 3000);
  globalVar.toastTimer = setTimeout(next, 4000);
};

const showBubbleTipHandler = (config: Config) => (next: () => void) =>
  showBubbleTip(config) && modalHandler(next);

const queue = [
  showBubbleTipHandler({
    txt: "尊敬的行长，客户借款后您的奖励 T+1 日就可以提现了",
  }),
  showBubbleTipHandler({
    txt: "尊敬的行长，您的银行需要更多的用户，快去邀请吧！",
  }),
  showBubbleTipHandler({
    title: "行长，您有 1 条新推送",
    img: bubble7bans,
    linkTxt: "贷款的7不准是啥 >",
    href: `https://`,
  }),
];

const compose = (queue: Function[]) => () =>
  (function _(i = 0) {
    return queue[i] && queue[i](() => _(i + 1));
  })();

export const bubbleQueue = compose(queue);
```

#### wolai compose

```js
// 富文本操作行为同步处理
// 下一步操作依赖上一步返回结果
export const compose =
  (...fns) =>
  (option) =>
    (function commit(idx = 0, preArg) {
      if (fns[idx]) {
        return fns[idx](
          preArg || option,
          // Next
          (arg) => commit(idx + 1, arg),
        );
      }
    })();
```

#### koa compose

```js
"use strict";

/**
 * Expose compositor.
 */

module.exports = compose;

/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 *
 * @param {Array} middleware
 * @return {Function}
 * @api public
 */

function compose(middleware) {
  if (!Array.isArray(middleware))
    throw new TypeError("Middleware stack must be an array!");
  for (const fn of middleware) {
    if (typeof fn !== "function")
      throw new TypeError("Middleware must be composed of functions!");
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function (context, next) {
    // last called middleware #
    let index = -1;
    return dispatch(0);
    function dispatch(i) {
      if (i <= index)
        return Promise.reject(new Error("next() called multiple times"));
      index = i;
      let fn = middleware[i];
      if (i === middleware.length) fn = next;
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}
```

#### redux compose

```js
/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

export default function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(
    (a, b) =>
      (...args) =>
        a(b(...args)),
  );
}
```

#### vue router

```js
// vue-router source code demo
var queue = [].concat(
  // in-component leave guards
  extractLeaveGuards(deactivated),
  // global before hooks
  this.router.beforeHooks,
  // in-component update hooks
  extractUpdateHooks(updated),
  // in-config enter guards
  activated.map(function (m) {
    return m.beforeEnter;
  }),
  // async components
  resolveAsyncComponents(activated),
);

/*  */

function runQueue(queue, fn, cb) {
  var step = function (index) {
    if (index >= queue.length) {
      cb();
    } else {
      if (queue[index]) {
        fn(queue[index], function () {
          step(index + 1);
        });
      } else {
        step(index + 1);
      }
    }
  };
  step(0);
}
```

#### koa onion model implementation

```js
// a, b, c, d
// a(b(c(d(c(b(a(...args)))))))

// 构造 compose 函数（ctx 为 Koa 的上下文对象）
const compose = (ctx) => async (middlewares) =>
  // 接受函数队列借助 reduceRight 方法由由向左进行包装（这样才可以保证最外层函数是队列的第一个最先执行）
  await middlewares.reduceRight(
    (next, middleware) =>
      // 从右向左将队列的每个函数包装为下一个函数的 next 开关
      (next = (
        (ctx, middleware, oldNext) => async () =>
          await middleware(ctx, oldNext)
      )(ctx, middleware, next)),
    async () => Promise.resolve(),
  )();

const middlewares = [
  async (ctx, next) => {
    console.log(1);
    await next();
    console.log(2);
  },
  async (ctx, next) => {
    console.log(3);
    await next();
    console.log(4);
  },
  async (ctx, next) => {
    console.log(5);
    await next();
    console.log(6);
  },
];

compose(null)(middlewares);

// output:
// 1
// 3
// 5
// 6
// 4
// 2
```

## Extra

- 洋葱模型
- 中间件
- FaaS

- Object Oriented Programming
- Procedure Oriented（步骤拆解）
- Functional Programming（函数的递归构造过程）
- Aspect Oriented Programming（日志记录，性能统
  计，安全控制，事务处理，异常处理）
