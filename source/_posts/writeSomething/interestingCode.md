---
title: 有趣的JS题目整理
tags:
  - interview
date: 2019-03-012 19:33:00
categories: 你应该知道的
---

JS相关各类型题目记录
<!--more-->

# JS执行上下文（作用域）以及变量提升
先看题目：以下代码输出分别是什么

###### 平安的一道笔试题
```js
var a = 10

function fn() {
  a()

  try {
    a()
    console.log(a, ' try')
    a = 100
  } catch (e) {
    a = 1
    console.log(a, ' catch')
  }
  
  console.log(a, ' inner function fn')

  function a() {
    console.log(a, ' inner function a')
    a = 1000
  }
}

fn()
console.log(a, 'outer result')

```
先试着预想一下执行结果
.
.
.
.
.
.
输出
```js
// [Function] inner function a
// 1 catch
// 1 inner function fn
// 10 outer result
```
是否和预想的一致呢？

先来了解几个概念：
 - 每一个函数都有自己的执行上下文EC（执行环境 execution context）
   - 全局脚本是一个全局上下文
 - EC预解析的时候会有变量提升
   - 只有关键字声明的变量才会有变量提升
   - 函数优先级高于普通变量

下面开始分析一下执行结果
首先 fn 会获得变量提升然后声明并且赋值全局变量 `var a = 10` 

执行fn：
  - 首先 fn 内部进行变量提升
    - 内部函数a提升到当前EC顶部
    - ```js
      function fn() {
        function a() {
          console.log(a, ' inner function a')
          a = 1000
        }
        a()
      }
      ```
    - 主要的一点：fn 内部的变量 a 已经被重新声明 相当于 `var a = function () {}` 所以此处 fn 内部的 a 相当于局部变量不在和全局上下文的a关联，fn内部改变不会影响到全局

fn内部输出：
  - a本身是个函数，invoke a() 输出 `[Function] inner function a`，然后将fn内部的 a 重新赋值为1000
  - 执行try语句：
    - a是1000所以 invoke a()会抛出异常 `a is not a function` 被catch语句捕获，当前try语句终端不在继续向下执行
      - *try语句内部的 `a = 100` 只是简单的赋值操作，没有关键字声明所以没有变量提升*
  - 执行catch语句
    - 重新赋值 `a = 1`，输出 `a catch`
  - try catch语句执行结束继续向下执行, 此时a已经被catch语句赋值为1输出 `1 inner function fn`

fn执行结束继续执行全局上下文环境中的代码，上面说了fn内部的 a 相当于局部变量不在和全局上下文的a关联，fn内部改变不会影响到全局, 所以全局上下文中a依旧是10，输出 10
运行结束

.
.
. 
.
.
未完待续👏

