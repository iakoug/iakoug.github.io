---
date: 2019-03-12
title: Interesting js
template: post
slug: /interesting-js
category: R&D
cover: media/arseny-togulev-mnx3NlXwKdg-unsplash-middle.jpg
tags:
  - Js
---

### JS 执行上下文（作用域）以及变量提升

先看题目：以下代码输出分别是什么

##### 平安的一道笔试题

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

题目简单先试着预想一下执行结果

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

- 每一个函数都有自己的执行上下文 EC（执行环境 execution context）
  - 全局脚本是一个全局上下文
- EC 预解析的时候会有变量提升
  - 只有关键字声明的变量才会有变量提升
  - 函数优先级高于普通变量

下面开始分析一下执行结果
首先 fn 会获得变量提升然后声明并且赋值全局变量 `var a = 10`

执行 fn：

- 首先 fn 内部进行变量提升
  - 内部函数 a 提升到当前 EC 顶部
  - ```js
    function fn() {
      function a() {
        console.log(a, ' inner function a')
        a = 1000
      }
      a()
    }
    ```
  - 主要的一点：fn 内部的变量 a 已经被重新声明 相当于 `var a = function () {}` 所以此处 fn 内部的 a 相当于局部变量不在和全局上下文的 a 关联，fn 内部改变不会影响到全局

fn 内部输出：

- a 本身是个函数，invoke a() 输出 `[Function] inner function a`，然后将 fn 内部的 a 重新赋值为 1000
- 执行 try 语句：
  - a 是 1000 所以 invoke a()会抛出异常 `a is not a function` 被 catch 语句捕获，当前 try 语句终端不在继续向下执行
    - _try 语句内部的 `a = 100` 只是简单的赋值操作，没有关键字声明所以没有变量提升_
- 执行 catch 语句
  - 重新赋值 `a = 1`，输出 `a catch`
- try catch 语句执行结束继续向下执行, 此时 a 已经被 catch 语句赋值为 1 输出 `1 inner function fn`

fn 执行结束继续执行全局上下文环境中的代码，上面说了 fn 内部的 a 相当于局部变量不在和全局上下文的 a 关联，fn 内部改变不会影响到全局, 所以全局上下文中 a 依旧是 10，输出 10
运行结束

### 深入理解“连等赋值”问题

```js
var a = { n: 1 }
var b = a
a.x = a = { n: 2 }
alert(a.x) // --> undefined
alert(b.x) // --> { n: 2 }
```

理解该问题需要知道以下两点：

- JS 引擎对赋值表达式的处理过程
- 赋值运算的右结合性

##### JS 引擎对赋值表达式的处理过程

如赋值表达式 `A = B`

1. 计算表达式左表达式 A，得到一个引用 refA
2. 计算表达式 B，得到一个引用 refB
3. 通过 `GetValue(refB)` 得到 valueB
4. 进行判断，当如下情况全部符合则抛出语法异常
   1. refA 是一个引用
   2. refA 是一个严格引用
   3. refA 是一个 `environment records`(**这里理解是 refA 是一个声明的变量或者是对象的某个属性**)
   4. refA 的引用名是’eval‘或’arguments‘
5. 将 valueB 赋给 refA 指向的名称绑定
6. 返回 valueB

_`GetValue(refB)` 是通过一系列判断得出 value 值，具体步骤参考[GetValue(refB)](http://es5.github.io/#x8.7.1)_

具体参考：

> [http://es5.github.io/#x11.13.1](http://es5.github.io/#x11.13.1)

##### 结合性

所谓结合性，是指表达式中同一个运算符出现多次时，是左边的优先计算还是右边的优先计算。
赋值表达式是右结合的。这意味着：`A1 = A2 = A3 = A4` 等价于 `A1 = (A2 = (A3 = A4))`

总的简单 s 来说就是：**_先从左到右解析各个引用，然后计算最右侧的表达式的值，最后把值从右到左赋给各个引用_**

##### 分析

```js
a.x = a = { n: 2 }
```

首先得到 a.x 和 a 的两个引用
得到右表达式是一个对象 `{ n: 2 }`
a.x 和 a 的两个引用并且判断属于 `environment records`（a.x 属于对象的某个属性，a 属于当前上下文的变量 a）
将 `{ n: 2 }` 赋值给 当前上下文变量 a 的 refA，a 已被重新赋值为 `{ n: 2 }`
将 `{ n: 2 }` 赋值给 当前上下文变量 a.x 的 ref（a.x）_ref（a.x）与 ref（b.x）是同一个_, refA 已经与 `{ n: 2 }` 重新绑定，所以此时 b 为 `{ n: 1, x: { n: 2 } }`

所以最终结果：a 为 `{ n：2 }`，b 为 `{ n: 1, x: { n: 2 } }`, 并且由于是同一个对象 `{ n: 2 }` 赋值给 b.x 以及 a 获得的引用相同，所以 `b.x === a`

所以 `a.x` 为 `undefined`, `b.x` 为 `{ n: 2 }`

Link:

> [由 ES 规范学 JavaScript(二)：深入理解“连等赋值”问题](https://segmentfault.com/a/1190000004224719)

### 立即执行的函数(Immediately-invoked function)的具名函数表达式(Named function expression, NFE)

```js
;(function A() {
  console.log(A) // [Function A]
  A = 1
  console.log(window.A) // undefined
  console.log(A) // [Function A]
})()
```

上面立即执行函数中直接将 1 赋值给一个未声明的变量，正常逻辑下我们知道会将他绑定的全局作为全局变量，但是上面的输出显然不是如此，原因在于匿名执行函数有了名字且和赋值的变量 A 同名

有了名字的函数（NFE）有两个特性：

- 作为函数名的标识符（在这里是 A ）只能从函数体内部访问，在函数外部访问不到 (IE9+)
- 绑定为函数名的标识符（在这里是 A）不能再绑定为其它值，即该标识符绑定是不可更改的（immutable），所以在 NFE 函数体内对 A 重新赋值是无效的

创建 NFE 的机制：

> The production FunctionExpression : function Identifier (
> FormalParameterListopt ) { FunctionBody }
> is evaluated as follows:

- Let funcEnv be the result of calling NewDeclarativeEnvironment passing the running execution context’s Lexical Environment as the argument
- Let envRec be funcEnv’s environment record.
- Call the CreateImmutableBinding concrete method of envRec passing the String value of Identifier as the argument.
- Let closure be the result of creating a new Function object as specified in 13.2 with parameters specified by FormalParameterListopt and body specified by FunctionBody. Pass in funcEnv as the Scope. Pass in true as the Strict flag if the FunctionExpression is contained in strict code or if its FunctionBody is strict code.
- Call the InitializeImmutableBinding concrete method of envRec passing the String value of Identifier and closure as the arguments.
- Return closure.

注意步骤 3 和 5，分别调用了 createImmutableBinding 和 InitializeImmutableBinding 内部方法，**创建的是不可更改的绑定**

要理解这两个特性，最重要的是搞清楚标识符 A 的绑定记录保存在哪里。让我们问自己几个问题：

1. 标识符 A 与 该 NFE 是什么关系？ 两层关系：首先，该 NFE 的 name 属性是 字符串 'A'；更重要的是，A 是该 NFE 的一个自由变量。在函数体内部，我们引用了 A，但 A 既不是该 NFE 的形参，又不是它的局部变量，那它不是自由变量是什么！解析自由变量，要从函数的 [[scope]] 内部属性所保存的词法环境 (Lexical Environment) 中查找变量的绑定记录。

2. 标识符 A 保存在全局执行环境（Global Execution Context）的词法环境(Lexical Environment)中吗？ 答案是否。如果你仔细看过 ES5 Section 13 这一节，会发现创建 NFE 比创建 匿名函数表达式 （Anonymous Function Expression, AFE） 和 函数声明 (Function Declaration) 的过程要复杂得多

那么为何创建 NFE 要搞得那么复杂呢？就是为了实现 NFE 的只能从函数内部访问 A，而不能从外部访问这一特性！咋实现的？ 创建 NFE 时，创建了一个专门的词法环境用于保存 A 的绑定记录(见上面步骤 1~3)！对于 NFE, 有如下关系：

```js
A.[[scope]]
  --->  Lexical Environment {'environment record': {A: function ...}, outer: --}
  ---> Lexical Environment of Global Context {'environment record': {...}, outer --}
  ---> null
```

可见，A 的绑定记录不在全局执行上下文的词法环境中，故不能从外部访问

但是有个疑问：如果内部输出的时候进行赋值呢？

```js
;(function A() {
  console.log((A = 100)) // 100
})()
```

却可以打印出 100，<a href="#JS引擎对赋值表达式的处理过程">JS 引擎对赋值表达式的处理过程</a>中我们知道赋值表达式最终结果是返回这个值，如果 NFE 内部没有成功赋值为何可以打印出 100 呢？

Link:

> [在 JavaScript 的立即执行的具名函数 A 内修改 A 的值时到底发生了什么](https://segmentfault.com/q/1010000002810093)
