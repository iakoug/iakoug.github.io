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

# 深入理解“连等赋值”问题
```js
var a = { n: 1 }
var b = a
a.x = a = { n: 2 }
alert(a.x) // --> undefined
alert(b.x) // --> { n: 2 }
```

理解该问题需要知道以下两点：
- JS引擎对赋值表达式的处理过程
- 赋值运算的右结合性

#### JS引擎对赋值表达式的处理过程
如赋值表达式 `A = B`
1. 计算表达式左表达式A，得到一个引用refA
2. 计算表达式B，得到一个引用refB
3. 通过 `GetValue(refB)` 得到valueB
4. 进行判断，当如下情况全部符合则抛出语法异常
   1. refA是一个引用
   2. refA是一个严格引用
   3. refA是一个 `environment records`(**这里理解是refA是一个声明的变量或者是对象的某个属性**)
   4. refA的引用名是’eval‘或’arguments‘
5. 将valueB赋给refA指向的名称绑定
6. 返回valueB

*`GetValue(refB)` 是通过一系列判断得出value值，具体步骤参考[GetValue(refB)](http://es5.github.io/#x8.7.1)*

具体参考：
> [http://es5.github.io/#x11.13.1](http://es5.github.io/#x11.13.1)

#### 结合性
所谓结合性，是指表达式中同一个运算符出现多次时，是左边的优先计算还是右边的优先计算。
赋值表达式是右结合的。这意味着：`A1 = A2 = A3 = A4` 等价于 `A1 = (A2 = (A3 = A4))`


总的简单s来说就是：***先从左到右解析各个引用，然后计算最右侧的表达式的值，最后把值从右到左赋给各个引用***

#### 分析
```js
a.x = a = { n: 2 }
```
首先得到 a.x 和 a 的两个引用
得到右表达式是一个对象 `{ n: 2 }`
a.x 和 a 的两个引用并且判断属于 `environment records`（a.x 属于对象的某个属性，a属于当前上下文的变量a）
将 `{ n: 2 }` 赋值给 当前上下文变量 a 的 refA，a已被重新赋值为 `{ n: 2 }`
将 `{ n: 2 }` 赋值给 当前上下文变量 a.x 的 ref（a.x）*ref（a.x）与ref（b.x）是同一个*, refA已经与 `{ n: 2 }` 重新绑定，所以此时 b 为 `{ n: 1, x: { n: 2 } }`

所以最终结果：a为 `{ n：2 }`，b为 `{ n: 1, x: { n: 2 } }`, 并且由于是同一个对象 `{ n: 2 }` 赋值给b.x以及a获得的引用相同，所以 `b.x === a`

所以 `a.x` 为 `undefined`, `b.x` 为 `{ n: 2 }`

Link:
> [由ES规范学JavaScript(二)：深入理解“连等赋值”问题](https://segmentfault.com/a/1190000004224719)
