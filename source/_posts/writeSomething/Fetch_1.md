---
title: 使用ts封装一个fetch请求库---拦截器篇
tags:
  - fetch
  - interceptor
date: 2019-04-03 13:27:00
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


未完待续...