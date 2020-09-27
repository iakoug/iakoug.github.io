---
date: 2020-09-27
title: Technology sharing：从Axios源码解析到项目路由Crisp实践
template: post
thumbnail: '../thumbnails/writing.png'
slug: axios-crisp
categories:
  - Thinking
tags:
  - axios
  - compose
  - programming
  - middleware
---

从Axios源码解析到项目路由Crisp实践

——Technology sharing of finance Group

_PPT原稿_

---

## Axios

#### 请求
```js
import axios from 'axios'
// Send a POST request
axios({
 method: 'post', url: '/user/12345',
 data: { firstName: 'Fre d', lastName: 'Flintstone'}
});
```
#### 请求配置
```js
const instance = axios.create({
 baseURL: 'https://some-domain.com/api/',
 timeout: 1000,
 headers: {'X-Custom-Header': 'foobar'}
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
![axios-implementation.png](https://i.loli.net/2020/09/27/dqF8rCfQgOhcAL2.png)

## Constructor

```js
function Axios(instanceConfig) {
 this.defaults = instanceConfig;
 this.interceptors = {
 request: new InterceptorManager(),
 response: new InterceptorManager()
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
 this.handlers.push({ fulfilled: fulfilled, rejected: rejected
 });
 return this.handlers.length - 1;
};
InterceptorManager.prototype.eject = function eject(id) {
 this.handlers[id] = null;
};
InterceptorManager.prototype.forEach = function forEach(fn) {
 utils.forEach(this.handlers, h => fn(h))
};
```

## Request
```js
Axios.prototype.request = function request(config) {
 // ...
 var chain = [dispatchRequest, undefined];
 var promise = Promise.resolve(config);
 this.interceptors.request.forEach(function unshiftRequestInterceptors(inte
rceptor) {
 chain.unshift(interceptor.fulfilled, interceptor.rejected);
 });
 this.interceptors.response.forEach(function pushResponseInterceptors(int
erceptor) {
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
 return instance; }
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
都是在学习者已经具有的知识经验和认知结构、已获得的动作技能、习
得的态度等基础上进行的。

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
```js
export const compose = (...middlewares) => (...args) =>
 (function dispatch(order = 0) {
 return !middlewares[order]
 ? TypeError('Useless router middleware, plz check it out.')
 : middlewares[order](...args, () => dispatch(order + 1))
 })()
```

- 链式（Axios interceptor 的Promises链，注意async）
- 参数传递

## Extra

- 洋葱模型
- 中间件
- FaaS

- Object Oriented Programming
- Procedure Oriented（步骤拆解)
- Functional Programming（函数的递归构造过程）
- Aspect Oriented Programming（日志记录，性能统
计，安全控制，事务处理，异常处理）

## The End.