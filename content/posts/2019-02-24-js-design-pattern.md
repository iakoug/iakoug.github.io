---
date: 2019-02-24
title: JS design pattern
description: JS 常用的设计模式
template: post
slug: /js-design-pattern
cover: media/arseny-togulev-mnx3NlXwKdg-unsplash-middle.jpg
category: R&D
tags:
  - Design pattern
---

持续更新
JS 常用的设计模式以及应用场景

_以下内容为个人简单理解，部分 demo 由网上案例简单改写 😝_

---

### 何谓设计模式

没必要被高大上的名词所吓倒，日常 coding 中或许一个不了解各种设计模式的程序员可能自己其实已经用到了很多

抛开官方的定义在我看来简单来说就是一个简单的思想被统一为规范，按照这个规范可以写出更优雅可控亦或性能更佳的代码，像是框架的单位

定义：在软件工程中，设计模式（design pattern）是对软件设计中普遍存在（反复出现）的各种问题，所提出的解决方案

补充：并非所有的软件模式都是设计模式，设计模式特指软件“设计”层次上的问题。还有其他非设计模式的模式，如架构模式。同时，算法不能算是一种设计模式，因为算法主要是用来解决计算上的问题，而非设计上的问题

软件设计模式有很多，常规的有 23 种，本文针对其中常用的几种进行简要介绍

### 设计原则

在列举具体的设计模式之前，我们要先知道设计模式本身的规范是什么，这就是设计原则，主要以下三种：

- 单一职责原则（SRP）：一个对象或方法只做一件事情。如果一个方法承担了过多的职责，那么在需求的变迁过程中，需要改写这个方法的可能性就越大。应该把对象或方法划分成较小的粒度

- 最少知识原则（LKP）：一个软件实体应当 尽可能少地与其他实体发生相互作用，应当尽量减少对象之间的交互。如果两个对象之间不必彼此直接通信，那么这两个对象就不要发生直接的 相互联系，可以转交给第三方进行处理

- 开放-封闭原则（OCP）：软件实体（类、模块、函数）等应该是可以 扩展的，但是不可修改，当需要改变一个程序的功能或者给这个程序增加新功能的时候，可以使用增加代码的方式，尽量避免改动程序的源代码，防止影响原系统的稳定

### 从最简单的单体/单例模式开始

##### 定义：

单体：一个用来划分命名空间并将一批相关的属性和方法组织在一起的对象

单例：顾名仅可以可以被实例化一次：在它的核心结构中只包含一个被称为单例的特殊类。通过单例模式可以保证系统中，应用该模式的一个类只有一个实例。即一个类只有一个对象实例
_在 java 中单例的定义：一个类有且仅有一个实例，并且自行实例化向整个系统提供_

##### 优点:

- 单例模式会阻止其他对象实例化其自己的单例对象的副本，从而确保所有对象都访问唯一实例
- 因为类控制了实例化过程，所以类可以灵活更改实例化过程
- 单体可以控制局部变量污染

##### 应用场景：

- 可以用单例来划分命名空间: 一些对象我们往往只需要一个，如某些数据的缓存
- 借助单例模式，可以把代码组织的更为一致

##### 最基本的单体模式

直接导出一个方法属性集合的对象

```js
// commonjs 导出
module.exports = {
  getSingleton() {
    return this
  }
}
```

##### 用闭包来实现单例

```js
const Ins1 = (function() {
  let instance = null
  // 利用闭包特性保证实例私有化
  return function(opt) {
    if (instance === null) {
      instance = this
    }

    for (let k in opt) {
      instance[k] = opt[k]
    }

    return instance
  }
})()
```

测试：

```js
const i1 = new Ins1({ name: 'i1' })

const i2 = new Ins1({ name: 'i2' })

console.log(i1 === i2) // true

console.log(i1.name) // i2
```

补充：在 node 中一个文件就是一个独立模块，若在某个 js 文件中导出一个类： `class T {} export default new T` 之后在其他任何外部文件多次引入其实都是保证了 T 类只被实例化了一次而不会被多次初始化。这是因为 node 遵循了 commonjs 的规范，所有文件模块在被引用时都会先去模块系统的缓存中查看这个文件是否存在，如果存在就返回缓存否则才会重新创建一个模块，而这个缓存其实也就限制了模块内脚本的多次初始化

### 策略模式

##### 定义：

就是解耦，何为策略解耦： 指的是定义一些列的算法，把他们一个个封装起来，目的就是将算法的使用与算法的实现分离开来。说白了就是以前要很多判断的写法，现在把判断里面的内容抽离开来，变成一个个小的个体。如大量的 if else 或者 switch case 判断当需求更改时需要添加和更改判断，这违背了设计模式的对修改关闭，对扩展开放的原则

##### 优点：

- 减少`command c & command v`, 提高复用性
- 遵循开闭原则，算法独立易于切换、理解、拓展

##### 应用场景：

针对代码多种行为设置大量的条件判断时将每一个行为划分为多个独立的对象。每一个对象被称为一个策略。设置多个这种策略对象，可以改进我们的代码质量，也更好的进行单元测试

##### 最简单的执行

```js
function closure() {
  // 定义
  const strategies = {
    plus10: function(arg) {
      return arg + 10
    },
    plus100: function(arg) {
      return arg + 100
    }
  }
  // 执行
  return function(plus, base) {
    return strategies[plus](base)
  }
}
const strategy = closure()

console.log(strategy('plus10', 1)) // 11
console.log(strategy('plus100', 1)) // 101
```

##### 对比分析

eg.: 代码情景为超市促销，vip 为 5 折，老客户 3 折，普通顾客没折，计算最后需要支付的金额

意大利逻辑:

```js
function context(name, type, price) {
  if (type === 'vip') {
    return price * 0.5
  } else if (type === 'vip') {
    return price * 0.8
  } else {
    return price
  }
}
```

如果 type 类型非常多，内部逻辑分别也不只是简单的 return 一个 val，那对后续的维护和测试就是灾难，下面拆分逻辑为独立单元:

```js
class Vip {
  constructor() {
    this.discount = 0.5
  }
  getPrice(price) {
    return this.discount * price
  }
}

class Old {
  constructor() {
    this.discount = 0.8
  }
  getPrice(price) {
    return this.discount * price
  }
}

class Others {
  constructor() {}
  getPrice(price) {
    return price
  }
}

class Context {
  constructor() {
    this.name = ''
    this.strategy = null
    this.price = 0
  }
  setPrice(name, strategy, price) {
    this.name = name
    this.strategy = strategy
    this.price = price
  }
  getPrice() {
    console.log(this.name, this.strategy.getPrice(this.price), '元')
    return this.strategy.getPrice(this.price)
  }
}
```

测试：

```js
const seller = new Context()
const vip = new Vip()
const old = new Old()
const other = new Others()
seller.setPrice('zs', vip, 1000)
seller.getPrice()
seller.setPrice('ls', old, 1000)
seller.getPrice()
seller.setPrice('ww', other, 1000)
seller.getPrice()
// output:
// zs 500 元
// ls 800 元
// ww 1000 元
```

显然逻辑多而复杂时可以极大提高代码可读性以及减少维护成本

补充：上述不断重复的代码片段看起来非常丑陋，其实可以通过继承来实现更简洁的写法：

```js
// 定义父类
class Handler {
  constructor(discount) {
    // 不传为原价
    this.discount = discount || 1
  }

  getPrice(price) {
    return this.discount === 1 ? price : this.discount * price
  }
}

// 声明子类
class Sub extends Handler {}

// 可以自定义更多不同级别顾客不同需求
// class Test extend Handler {
//   getGifts() {
//     if (this.discount < 1) {
//       // 赠送赠品
//     }
//   }
// }
// const master = new Test(0.1)
// master.getGifts()

// Context类同上方便统一接口输出
class Context {}
```

测试：

```js
const seller = new Context()
const vip = new Sub(0.5)
const old = new Sub(0.8)
const other = new Sub()

seller.setPrice('zs', vip, 1000)
seller.getPrice()
seller.setPrice('ls', old, 1000)
seller.getPrice()
seller.setPrice('ww', other, 1000)
seller.getPrice()

// output:
// zs 500 元
// ls 800 元
// ww 1000 元
```

测试结果一致

### 代理模式

##### 定义：

为其他对象提供一种代理以控制对这个对象的访问。在某些情况下，一个对象不适合或者不能直接引用另一个对象，而代理对象可以在客户端和目标对象之间起到中介的作用
著名的代理模式例子为引用计数（reference counting）指针对象
另外代理模式还可分为：

- 虚拟代理：把一些开销很大的对象，延迟到真正需要它的时候才去创建，当对象在创建前或创建中时，由虚拟代理来扮演对象的替身；对象创建后，代理就会将请求直接委托给对象
- 保护代理：用于控制不同权限的对象对目标对象的访问
- 缓存代理: 缓存代理可以作为一些开销大的运算结果提供暂时的存储，下次运算时，如果传递进来的参数跟之前一致，则可以直接返回前面存储的运算结果

##### 优点：

独立职责归属，便于维护测试

##### 应用场景：

比如图片的懒加载，数据缓存等

##### 虚拟代理实现图片懒加载

```js
const imgSet = (() => {
  let node = new Image()
  document.body.append(node)

  return function(src) {
    node.src = src
  }
})()

const proxyImg = (() => {
  let _img = new Image()

  _img.onload = function() {
    setTimeout(imgSet, 2000, this.src)
  }

  return function(src) {
    imgSet('https://yphoto.eryufm.cn/upload/assets/jump.gif')
    _img.src = src
  }
})()
// call
proxyImg(
  `https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1551174639&di=90b4757f68c9480f78c132c930c1df10&src=http://desk.fd.zol-img.com.cn/t_s960x600c5/g5/M00/02/02/ChMkJ1bKxkmIObywAArTTfACinwAALHjACDZuIACtNl408.jpg`
)
```

##### 保护代理

对象 a 需要给对象 c 发送信息，为了保证 a 对 c 是不可见，可用对象 b 代理转发

```js
// filter some no use or unneed requestions or data
// A  ---> B(proxy) ----> C
const a = {
  name: 'a',
  send(target, info) {
    target.receive(info)
  }
}
const c = {
  name: 'c',
  receive(target, info) {
    console.log('c receive ', info, ' from ', target.name)
  }
}
const b = {
  name: 'b',
  receive(info) {
    if (info) {
      c.receive(this, info)
    }
  }
}
a.send(b, 'good morning')
a.send(b, '')
a.send(b, 'send again')

// output:
// c receive good morning from b
// c receive send again from b
```

上面表示一个最简单的保护代理

##### 缓存代理

顾名思义就是缓存相关的代理

有一个二级别联动的标签列表，第二级的各有自己所属的多个标签根据第一级的参数来发送指定请求来获取，如果想要达到点击第一级列表迅速展示出相关的第二级标签，我们可以在系统空闲时预先将所有标签全部获取并缓存

```js
// 存储所有标签
let tags

const sendApiGetTags = index => {
  // ajax.get('/api', { index })
}
let proxyCache = (async () => {
  const allTagsCache = {}
  const number = 5
  const all = []
  const params = {}

  for (let index = 0; index < number; index++) {
    all.push(
      sendApiGetTags({
        ...params,
        index
      })
    )
  }
  const list = await Promise.all(all)

  list.forEach((res, i) => (allTagsCache[i] = res))

  return allTagsCache
})()

let setTags = async index => {
  // 缓存中有直接拿
  if (proxyCache[index]) {
    tags = proxyCache[index]
  } else {
    // 缓存中没有则重发请求
    tags = await sendApiGetTags(index)
  }
}
```

### 发布订阅模式

##### 定义：

一种一对多的依赖关系，让多个订阅者对象同时监听某一个主题对象。这个主题对象在自身状态变化时，会通知所有订阅者对象，使它们能够自动更新自己的状态。
至于发布订阅模式和观察者模式是不是同一样东西不同的人各有看法

##### 优点：

订阅者可以根据自己需求当某种 Action 被触发时完成自己的调度

##### 应用场景：

AngularJs 的广播、vue 的 eventbus 等

##### 根据主体构建发布订阅的基类

构造发布者基类

```js
class Publisher {
  constructor() {
    // 订阅发布者的队列 存储每个订阅者
    this.subscribers = []
  }
  deliver(data) {
    // 发布消息 调用订阅者的回调 告知订阅者
    this.subscribers.forEach(fn => fn.shot(data))

    return this
  }
}
```

构造订阅者基类

```js
class Observer {
  constructor(call) {
    // 传入订阅回调
    this.shot = call
  }
  subscribe(publisher) {
    if (!publisher.subscribers.some(v => v.shot === this.shot)) {
      console.log('订阅该消息')
      // 判断当前订阅者是否订阅
      publisher.subscribers.push(this)
    }
    return this
  }
  unsubscribe(publisher) {
    // 移除当前订阅者
    console.log('取消订阅')

    publisher.subscribers = publisher.subscribers.filter(
      v => v.shot !== this.shot
    )

    return this
  }
}
```

测试：

```js
const pub = new Publisher()
const pub2 = new Publisher()
const obs = new Observer(deliver => console.log(deliver))

obs.subscribe(pub) // 订阅该消息
obs.subscribe(pub2) // 订阅该消息

pub.deliver('pub deliver first message') // pub deliver first message
pub2.deliver('pub2 deliver first message') // pub2 deliver first message

obs.unsubscribe(pub) // 取消订阅
pub.deliver('pub deliver second message') //
```

### 装饰者模式

##### 定义：

装饰模式指的是在不必改变原类文件和使用继承的情况下，动态地扩展一个对象的功能

##### 优点：

- 装饰对象和真实对象有相同的接口。这样客户端对象就能以和真实对象相同的方式和装饰对象交互
- 装饰对象可以在转发这些请求以前或以后增加一些附加功能。这样就确保了在运行时，不用修改给定对象的结构就可以在外部增加附加的功能。在面向对象的设计中，通常是通过继承来实现对给定类的功能扩展

##### 应用场景：

- 需要扩展一个类的功能，或给一个类添加附加职责
- 需要动态的给一个对象添加功能，这些功能可以再动态的撤销
- 不必改动原本的逻辑造成不可知问题

##### 给所有的函数调用添加调用前和调用后的钩子

普通函数：

```js
function fn(msg) {
  console.log(msg, ' right now')
}

fn('let go') // lets go right now
```

我们知道 JS 中所有的函数都是基于父类 `Function` 生成的，所以会继承父类原型的方法，下面我们将函数的钩子挂在父类的原型上即可：

```js
// 执行前
Function.prototype.before = function(call) {
  const fn = this

  // 返回体本身也是函数所以支持继续调用钩子
  return function() {
    // 调用钩子，同时参数传递到钩子内
    call.apply(this, arguments)
    // 调用自身
    return fn.apply(this, arguments)
  }
}
// 执行后
// 和 before 同理
Function.prototype.after = function(call) {
  const fn = this

  return function() {
    const res = fn.apply(this, arguments)

    call.apply(this, arguments)

    // 返回自身的返回值
    return res
  }
}
```

测试：

```js
// 重新包装 fn
function fn(msg) {
  console.log(msg, ' right now')
}

const decoratorFn = fn
  .before(function(msg) {
    console.log('when we go,', msg)
  })
  .after(function(msg) {
    console.log('had to go', msg)
  })

decoratorFn('lets go')

// out put:
// when we go, right now
// lets go, right now
// had to go, right now
```

### 职责链（责任链）模式

##### 定义：

它是一种链式结构，每个节点都有可能两种操作，要么处理该请求停止该请求操作，要么把请求转发到下一个节点，让下一个节点来处理请求

##### 优点：

职责链上的处理者负责处理请求，客户只需要将请求发送到职责链上即可，无须关心请求的处理细节和请求的传递，所以职责链将请求的发送者和请求的处理者解耦了

##### 应用场景：

JS 中的事件冒泡（事件委托）就是经典案例

##### 实例分析

部门采购物品不同金额需要走不同职位的流程审批，采购部经理可自主决定 1w 以内的采购，总经理可以决定 10w 以内的采购，董事长决定 100w 以内的采购
下面分别抽象处理者构造基类

责任链调度中心：

```js
class Handler {
  constructor() {
    this.next = null
  }
  setNext(_handler) {
    this.next = _handler
  }
  handleRequest(money) {}
}
```

采购部经理：

```js
class CGBHandler extends Handler {
  handleRequest(money) {
    // 1w
    if (money < 10000) {
      console.log('1w以内，同意')
    } else {
      console.log('金额太大，只能处理1w以内的采购')
      if (this.next) {
        this.next.handleRequest(money)
      }
    }
  }
}
```

总经理：

```js
class ZJLHandler extends Handler {
  handleRequest(money) {
    // 10w
    if (money < 100000) {
      console.log('10w以内，同意')
    } else {
      console.log('金额太大，只能处理10w以内的采购')
      if (this.next) {
        this.next.handleRequest(money)
      }
    }
  }
}
```

董事长：

```js
class DSZHandler extends Handler {
  handleRequest(money) {
    // 100w
    if (money >= 100000) {
      console.log('10万以上的我来处理')
      //处理其他逻辑
    }
  }
}
```

封装客户端接口：

```js
const dispatch = (function client() {
  const cgb = new CGBHandler()
  const zjl = new ZJLHandler()
  const dsz = new DSZHandler()

  cgb.setNext(zjl)
  zjl.setNext(dsz)

  return cgb.handleRequest.bind(cgb)
})()
```

测试：

```js
dispath(800000)
// output:
// 金额太大，只能处理1w以内的采购
// 金额太大，只能处理10w以内的采购
// 10万以上的我来处理

dispath(7000)
// output:
// 1w以内，同意
```

补充：

- 纯的责任链：要求请求在这些对象链中必须被处理，而且一个节点处理对象，要么只处理请求，要么把请求转发给下个节点对象处理

- 不纯的责任链：要求在责任链里不一定会有处理结构，而且一个节点对象，即可以处理部分请求，并把请求再转发下个节点处理

.

.

.

未完待续...👏
