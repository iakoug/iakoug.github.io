---
date: 2019-03-11
title: Pay attention to those js - 你应该注意的那些JS（相关）
template: post
thumbnail: '../thumbnails/js.png'
slug: pay-attention-to-these-js
categories:
  - Issues
tags:
  - js
---

记录基本的 JS 相关的使用或者遇到的 issues
持续更新 👏

---

### 小数部分进行数学运算可能会生成过多的小数位

很多人应该都遇到过类似的问题：`0.1 + 0.2 === 0.3` 返回值是 false，顿为惊叹
在浏览器输入后发现 `0.1 + 0.2` 返回值是 `0.30000000000000004`(小数 17 位，<a href="#JS（Java）浮点数的数字长度">关于这个</a>)
查了一下找到了个解释：

> Computer in dealing with digital mathematical operations (such as the decimal), its first converted to binary again, the decimal Numbers to binary may occur in the process of precision loss, can be used by toFixed and round method comprehensive to solve this problem.

计算机是只认识二进制的，数学运算中进制转换的过程可能会发现精度损失的情况

_可以使用 `toFixed` 或者 `round` 方法兼容处理_

### JS（Java）浮点数的数字长度

ECMAScript Number（Java： float | double） 是使用 IEEE754 格式来表示整数和浮点数，浮点数的最高精度为 17 位小数

_`Number.EPSILON`(1 与大于 1 的最小浮点数之间的差, 换句话说其实就是 JS 支持的最小精度) 值为 2^-52，约等于 2.2e-16，浮点数运算的过程中，如果误差小于这个数值，可以认为误差是不存在的，所以说第 17 位上的小数，其实没有意义_

### JS 箭轴函数

如下代码：

```js
function make() {
  return () => console.log(this)
}
const testFunc = make.call({ name: 'foo' })

testFunc() // { name: "foo" }
testFunc.call({ name: 'bar' }) // { name: "foo" }
```

可以看到箭头函数在定义之后，this 就不会发生改变了，无论用什么样的方式调用它，this 都不会改变

原因：箭头函数不会自动绑定局部变量，如 this，arguments，super(ES6)，new.target(ES6)等

所以箭头函数没有它自己的 this 值，箭头函数内的 this 值继承自外围作用域。在箭头函数中调用 this 时，仅仅是简单的沿着作用域链向上寻找，找到最近的一个 this 拿来使用

箭轴函数有如下等特性：

- 箭头函数体内的 this 对象，就是定义时所在的对象，而不是使用时所在的对象
- 箭头函数不可以当作构造函数，也就是说，不可以使用 new 命令，否则会抛出一个错误
- 箭头函数不可以使用 arguments 对象，该对象在函数体内不存在。如果要用，可以用 Rest 参数代替
- 不可以使用 yield 命令，因此箭头函数不能用作 Generator 函数

### 关于创建 vue 中的 vnode(virture dom)

公司之前有个文件上传组件，由于每次都会创建一个实例 dom 导致一些不可预知的样式错误，于是同事改用 vnode 来处理这部分

拿来主义：
![virturedom](/virturedom.png)

**Vue2.x 版本中 VNode 属性：**

- tag:当前节点标签名
- data：当前节点数据对象
- children：子节点数组
- text：当前节点文本
- elm：当前虚拟节点对应的真实 dom 节点
- ns：节点的 namespace( 名称空间)
- content：编译作用域
- functionalContext：函数化组件的作用域，即全局上下文
- key：节点标识，有利于 patch 优化
- componentOptions：创建组件实例时的 options
- child：当前节点对应的组件实例
- parent：组件的占位节点
- raw：原始 html
- isStatic：是否是静态节点
- isRootInsert：是否作为跟节点插入，若被包裹的节点，该属性值为 false
- isComment：是否为注释节点
- isCloned：是否为克隆节点
- isOnce：是否只改变(渲染)一次，或是否有 v-once 指令
  其中这里面又有几种 VNode 类型
- TextVNode：文本节点
- ElementVNode：普通元素节点
- ComponentVNode：组件节点
- EmptyVNode：空节点，或者说是没有内容的注释节点
- CloneVNode：克隆节点，可以是以上任意类型节

什么时候用虚拟 dom 才比较好呢？其实我们使用的单文件组件就已经够好了。但是当某些代码冗余的时候如果写单文件组件的话会有好多重复的内容

接下来介绍其核心函数 createElement(h)：
createElement 接收 3 个参数：

- 第一个参数可以是 HTML 标签名，组件或者函数都可以；此参数是必须的
- 第二个为数据对象（可选）
- 第三个为子节点（可选）

**附上简单 demo：**

```js
const Instance = new Vue({
  data: Object.assign({}, _props, {}),
  render(h) {
    const vnode = h('input', {
      attrs: {
        type: 'file',
        accept: 'image/*'
      },
      style: {
        display: 'none'
      },
      ref: 'tuhu_upload_input'
    })

    return h(
      'div',
      {
        class: 'tuhu_upload_layout'
      },
      [vnode]
    )
  }
})
```

### 使用 instanceof 判断构造函数的问题

测试代码：

```js
function A() {}

var a = new A()
console.log(a instanceof A) // true
console.log(a instanceof Object) // true

var obj = {}
A.prototype = obj
// a.__proto__ = obj // console.log(a instanceof A) // true
var a2 = new A()
console.log(a2 instanceof A) // true
console.log(a instanceof A) // false

console.log(a instanceof Object) // true
```

所以综上所述 instanceof 并不能从字面意思来判断谁是否是谁的实例对象
鱼泡泡的面试题：instanceof 判断构造函数可能会出现不准确的情况吗？如 `const arr = []; arr instanceof Array === false`。大都说不出其中几何, 其实同样只需要更改 `arr.__proto__ = Object // Number etc.`

instanceof 本意：

> MDN: The instanceof operator tests whether the prototype property of a constructor appears anywhere in the prototype chain of an object.
> [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof](url)

**就是说 instanceof 是用来判断 A.prototype 是否存在于参数 a 的原型链上**

所以当 A 的 prototype 被指向任意一个其他对象的时候 A.prototype 是不在 a 的原型链上的

a 所在的原型链: a ==> a.**proto** ==> Object.prototype ==> null

a2 所在的原型链: a2 ==> obj ==> Object.prototype ==> null

所以此时如果赋值 a.**proto** = obj，a instanceof A 同样会返回 true

_JS 是一门基于原型的语言，而原型是动态的并非一定不变所以会有上述情况_

### 将 function 声明的函数的函数式调用改为 new 关键字调用

es6 的 class 声明类的方式是必须通过 new 关键字进行调用的

而传统的利用 function 关键字声明的构造函数如何避免被函数式调用呢？或者说就算是函数式调用但是依然想要生成实例对象呢
很简单 判断 constructor 即可

```js
// eg:

function A() {
  if (this.constructor !== arguments.callee) {
    return new A()
  }
  this.name = 'chris'
  this.age = 23
  this.job = function() {
    console.log('A front-end engineer')
  }
  A.work = function() {
    console.log('working hard')
  }
}
A().job() // that's all
```

补充：
_`Array()` 和 `new Array()` 是完全一致的_

> The Array constructor is the %Array% intrinsic object and the initial value of the Array property of the global object. When called as a constructor it creates and initializes a new exotic Array object. When Array is called as a function rather than as a constructor, it also creates and initializes a new Array object. Thus the function call Array(…) is equivalent to the object creation expression new Array(…) with the same arguments.
> https://www.ecma-international.org/ecma-262/7.0/index.html#sec-array-constructor

关于 `Object()` 与 `new Object()` 之间的差异，ES 规范中说 Object()会进行类型转换

> The Object constructor is the %Object% intrinsic object and the initial value of the Object property of the global object. When called as a constructor it creates a new ordinary object. When Object is called as a function rather than as a constructor, it performs a type conversion.
> The Object constructor is designed to be subclassable. It may be used as the value of an extends clause of a class definition.
> https://www.ecma-international.org/ecma-262/7.0/index.html#sec-object-constructor

### The play() request was interrupted by a call to pause()

做桌面通知的一个需求，需要自定义桌面通知是否带有提示音，使用的是 h5 的 Notification API，在 api 的 silent 配置项不 work 的时候自定义 new Audio 在有新消息的时候触发，然后在延时器中关闭的时候出现以下错误：
_The play() request was interrupted by a call to pause()_

google 后发现 _Moreover since Chrome 50, a play() call on an a or element returns a Promise_

play 是一个异步函数， 返回一个 promise
**所以正确的方式应该先获取这个 promise， 在 then 回调中安全的将其 pause 掉**

```js
const playSound = () => {
  let timer = null
  const audio = new Audio(fileUrl)
  const playPromise = audio.play()
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        timer = setTimeout(() => {
          audio.pause()
          clearTimeout(timer)
        }, 2000)
      })
      .catch(err => {
        console.log(err)
      })
  }
}
```

> [https://developers.google.com/web/updates/2017/06/play-request-was-interrupted](https://developers.google.com/web/updates/2017/06/play-request-was-interrupted)

### 实现 Promise 的 resolve 和 reject 函数时内部为何要异步执行

参考别人的实现看到里面有关 resolve 和 reject 函数内部的代码异步执行 却没有解释原因

> [剖析 Promise 内部结构，一步一步实现一个完整的、能通过所有 Test case 的 Promise 类](https://github.com/xieranmaya/blog/issues/3)

```js
function resolve(value) {
  setTimeout(function() {
    if (self.status === 'pending') {
      self.status = 'resolved'
      self.data = value
      for (var i = 0; i < self.onResolvedCallback.length; i++) {
        self.onResolvedCallback[i](value)
      }
    }
  })
}
```

以下为个人简单理解：

举个例子：eventbus 的实现
在使用 eventbus 进行数据通信的时候，通常都是在一个地方 emit 事件名 在另外想要触发的地方 on 接收这个事件同时传入相应的回调，而这种使用方式很容易给小白造成一种误解：我使用 emit 派发，使用 on 来接收执行这个派发

显然不是的
自己封装一个简单的 eventbus 之后就会理解
emit 是静态的而 on 才是依赖收集的地方 这个顺序不能变----一定是先收集完依赖才可以派发

所以对于 promise 的 resolve 和 then 之间是不是就可以理解为必须 then 收集依赖后才可以触发 resolve 这样 resolve 的参数才可以被 then 接收到（reject 和 catch 同理）

所以回到上面提出的 resolve 和 reject 函数内部为何一定要异步执行的问题

首先涉及到一个初始化的机制

假如是同步执行 resolve 如果在 new Promise 时立即触发 此时是没有收集依赖函数的（then 收集到的对应的微任务队列 `onResolvedCallback` 尚未执行）
那么 resolve 中的数值无法被传递

而如果加入异步（setTimeout）变为一次宏任务推入下次事件循环

这样就确保了先收集了依赖再触发回调

> [JS/Node 事件循环](https://justwink.cn/post/2019-03-07-EventLoop)

### 你不知道的原生方法更多使用方式 JSON.parse、JSON.stringify、setTimeout

#### setTimeout 定时器

支持传递第三个以及之后参数作为第一个回调函数的参数

```js
const delay = (fn, wait, ...args) => setTimeout(fn, wait, ...args)

delay(
  function(...args) {
    console.log(args)
  },
  1000,
  1,
  2,
  3
)
```

##### JSON.parse

JSON.parse 还可额外接受第二个处理函数 对原本生成的返回值进行修改

##### JSON.stringify

JSON.stringify 可额外再接收两个参数

- 第二个参数： 如果该参数是一个函数，则在序列化过程中，被序列化的值的每个属性都会经过该函数的转换和处理；如果该参数是一个数组，则只有包含在这个数组中的属性名才会被序列化到最终的 JSON 字符串中；如果该参数为 null 或者未提供，则对象所有的属性都会被序列化
- 第三个参数：指定缩进用的空白字符串，用于美化输出（pretty-print）；如果参数是个数字，它代表有多少的空格；上限为 10。该值若小于 1，则意味着没有空格；如果该参数为字符串(字符串的前十个字母)，该字符串将被作为空格；如果该参数没有提供（或者为 null）将没有空格

### Array.prototype.push.apply(obj, arr)

_萌新日常问题_
**今天看到之前写的一段代码大概为：**

```js
let obj = {}
let arr = [1, 2, 3]

Array.prototype.push.apply(obj, arr)
```

**最终的 obj 为：**

```js
{
  0: 1,
  1: 2,
  2: 3
}
```

那如果向一个 map 中 push 呢？

```js
let map = new Map()
let arr = [1, 2, 3]

Array.prototype.push.apply(map, arr)
```

**最终的 map 为：**

```js
Map(0) {
  0: 1,
  1: 2,
  2: 3,
  length: 3,
  size: 0,
  [[Entries]]: Array(0),
  length: 0
}
```

依然是一放进对象方式放进了 map，而 map 的 entries 是空的，length 也为 0，我知道 map 是通过实例化传入 option 或者通过 set 方法才可以设置键值对，那么为什么会有这样的输出呢？
**Q.为什么会以数组下标和值组成键值对的方式放进这个对象呢**

---

落后要挨打，不懂就要查？emmm，没 google 到...
显然我对搜索引擎的应用远远不行
落后要挨打，不懂就要问，菜鸡互啄之后：

> 这个其实你可以看数组和对象的实现方式，map 和 obj 的实现是不一样的，而数组和 obj 的实现则是相似的
> obj 其实代表的应该是 record，而不是 dictionary，map 才是 dictionary，只要把 Object 当成 record 看，那它和数组就是一家人了
> 所以可以试着在代码中做一点区分,map 对索引是有一些优化的，而 Object 对下标索引也有优化，唔，这种区分是指从代码编写者的角度来说的，record 和 dictionary 是两种很常见的数据结构，在不同语言中有不同的实现，比如 python 中的实现就是 tuple 和 map，这个其实可以结合着 v8 中对象模型的实现来理解，这就说来话长了
> js 就是动态类型，从类型角度来说没什么意义，更多的实现的角度来考虑，比如说：在 v8 中如果你的对象索引是数字，在访问的时候那就很快，这个就是 tuple 的特性，但是在 js 中就是 obj，当然 object 也能作为 dictionary 来用，但是这样访问的速度就很慢了，同理，js 数组中也可以存放不同类型的值，但是如果放同样类型的值，那利用偏移值访存就会很快

所以 js 才专门出了一个 Map，也是希望规范这种使用，这种归纳是实现相关的

_意思就是本质上其实数组与对象其实是同一个东西（实现方式一致），都是键值对组成的集合，只不过 js 中的数组将键以索引下标的形式展现而已_

**什么是 record 类型**

> 记录(Record)类型类似于 C 语言中的结构数据类型，它把逻辑相关的、分离的、基本数据类型的变量组成一个整体存储起来，它必须包括至少一个标量型或 RECORD 数据类型的成员，称作 PL/SQL RECORD 的域(FIELD)，其作用是存放互不相同但逻辑相关的信息。在使用记录数据类型变量时，需要先在声明部分先定义记录的组成、记录的变量，然后在执行部分引用该记录变量本身或其中的成员

.

.

.

.

.

.

未完待续...👏
