---
title: JS常用的设计模式
tags:
  - 设计模式
  - 算法
date: 2019-02-24 22:52:00
categories: 算法
---
持续更新
JS常用的设计模式以及应用场景

<!-- more -->

# 何谓设计模式

&#160; &#160; &#160; &#160;没必要被高大上的名词所吓倒，日常coding中或许一个不了解各种设计模式的程序员可能自己其实已经用到了很多

&#160; &#160; &#160; &#160;抛开官方的定义在我看来简单来说就是一个简单的思想被统一为规范，按照这个规范可以写出更优雅可控亦或性能更佳的代码，像是框架的单位

&#160; &#160; &#160; &#160;软件设计模式有很多，常规的有23种，本文针对其中常用的几种进行简要介绍

# 从最简单的单体/单例模式开始

### 定义：

&#160; &#160; &#160; &#160;单体：一个用来划分命名空间并将一批相关的属性和方法组织在一起的对象

&#160; &#160; &#160; &#160;单例：顾名仅可以可以被实例化一次：在它的核心结构中只包含一个被称为单例的特殊类。通过单例模式可以保证系统中，应用该模式的一个类只有一个实例。即一个类只有一个对象实例
*在java中单例的定义：一个类有且仅有一个实例，并且自行实例化向整个系统提供*

### 优点:
- 单例模式会阻止其他对象实例化其自己的单例对象的副本，从而确保所有对象都访问唯一实例
- 因为类控制了实例化过程，所以类可以灵活更改实例化过程
- 单体可以控制局部变量污染

### 应用场景：
- 可以用单例来划分命名空间: 一些对象我们往往只需要一个，如某些数据的缓存
- 借助单例模式，可以把代码组织的更为一致

#### 最基本的单体模式
直接导出一个方法属性集合的对象
```js
// commonjs 导出
module.exports = {
  getInstace() {
    return this 
  }
}
```
#### 用闭包来实现单例
```js
const Ins1 = (function() {
  let instance = null
  // 利用闭包特性保证实例私有化
  return function(opt) {
    if (instance === null) {
      instance = this
    }

    for(let k in opt) {
      instance[k] = opt[k]
    }

    return instance
  }
})()
```
&#160; &#160; &#160; &#160;测试：
```js
const i1 = new Ins1({ name: 'i1' })

const i2 = new Ins1({ name: 'i2' })

console.log(i1 === i2) // true

console.log(i1.name) // i2
```
&#160; &#160; &#160; &#160;补充：在node中一个文件就是一个独立模块，若在某个js文件中导出一个类： `class T {} export default new T` 之后在其他任何外部文件多次引入其实都是保证了 T 类只被实例化了一次而不会被多次初始化。这是因为node遵循了commonjs的规范，所有文件模块在被引用时都会先去模块系统的缓存中查看这个文件是否存在，如果存在就返回缓存否则才会重新创建一个模块，而这个缓存其实也就限制了模块内脚本的多次初始化

# 策略模式

### 定义：
&#160; &#160; &#160; &#160;就是解耦，何为策略解耦： 指的是定义一些列的算法，把他们一个个封装起来，目的就是将算法的使用与算法的实现分离开来。说白了就是以前要很多判断的写法，现在把判断里面的内容抽离开来，变成一个个小的个体。如大量的if else或者switch case判断当需求更改时需要添加和更改判断，这违背了设计模式的对修改关闭，对扩展开放的原则

### 优点：
- 减少`command c & command v`, 提高复用性
- 遵循开闭原则，算法独立易于切换、理解、拓展

### 应用场景：
&#160; &#160; &#160; &#160;针对代码多种行为设置大量的条件判断时将每一个行为划分为多个独立的对象。每一个对象被称为一个策略。设置多个这种策略对象，可以改进我们的代码质量，也更好的进行单元测试

#### 最简单的执行
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
  return function(plus, base){
    return strategies[plus](base);
  }
}
const strategy = closure()

console.log(strategy('plus10', 1)) // 11
console.log(strategy('plus100', 1)) // 101
```
#### 对比分析
&#160; &#160; &#160; &#160;eg.: 代码情景为超市促销，vip为5折，老客户3折，普通顾客没折，计算最后需要支付的金额

意大利逻辑:

```js
function context (name, type, price) {
  if (type === 'vip') {
    return price * 0.5
  } else if (type === 'vip') {
    return price * 0.8
  } else {
    return price
  }
}
```
&#160; &#160; &#160; &#160;如果type类型非常多，内部逻辑分别也不只是简单的return一个val，那对后续的维护和测试就是灾难，下面拆分逻辑为独立单元:
``` js
class Vip {
  constructor () {
    this.discount = 0.5
  }
  getPrice (price) {
    return this.discount * price
  }
}

class Old {
  constructor () {
    this.discount = 0.8
  }
  getPrice (price) {
    return this.discount * price
  }
}

class Others {
  constructor () {
  }
  getPrice (price) {
    return price
  }
}

class Context {
  constructor () {
    this.name = ''
    this.strategy = null
    this.price = 0
  }
  setPrice (name, strategy, price) {
    this.name = name
    this.strategy = strategy
    this.price = price
  }
  getPrice () {
    console.log(this.name, this.strategy.getPrice(this.price), '元')
    return this.strategy.getPrice(this.price)
  }
}
```
&#160; &#160; &#160; &#160;测试：
```js
const seller = new Context
const vip = new Vip
const old = new Old
const other = new Others
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
&#160; &#160; &#160; &#160;显然逻辑多而复杂时可以极大提高代码可读性以及减少维护成本

# 代理模式

### 定义：
&#160; &#160; &#160; &#160;为其他对象提供一种代理以控制对这个对象的访问。在某些情况下，一个对象不适合或者不能直接引用另一个对象，而代理对象可以在客户端和目标对象之间起到中介的作用
&#160; &#160; &#160; &#160;著名的代理模式例子为引用计数（reference counting）指针对象
&#160; &#160; &#160; &#160;另外代理模式还可分为：
- 虚拟代理：把一些开销很大的对象，延迟到真正需要它的时候才去创建，当对象在创建前或创建中时，由虚拟代理来扮演对象的替身；对象创建后，代理就会将请求直接委托给对象
- 保护代理：用于控制不同权限的对象对目标对象的访问
- 缓存代理: 缓存代理可以作为一些开销大的运算结果提供暂时的存储，下次运算时，如果传递进来的参数跟之前一致，则可以直接返回前面存储的运算结果

### 优点：
&#160; &#160; &#160; &#160;独立职责归属，便于维护测试

### 应用场景：
&#160; &#160; &#160; &#160;比如图片的懒加载，数据缓存等

#### 虚拟代理实现图片懒加载
```js
const imgSet = (() => {
  let node = new Image
  document.body.append(node)

  return function(src) {
    node.src = src
  }
})()

const proxyImg = (() => {
  let _img = new Image

  _img.onload = function() {
    setTimeout(imgSet, 2000, this.src)
  }

  return function(src) {
    imgSet('https://yphoto.eryufm.cn/upload/assets/jump.gif')
    _img.src = src
  }
})()
// call
proxyImg(`https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1551174639&di=90b4757f68c9480f78c132c930c1df10&src=http://desk.fd.zol-img.com.cn/t_s960x600c5/g5/M00/02/02/ChMkJ1bKxkmIObywAArTTfACinwAALHjACDZuIACtNl408.jpg`)
```

#### 保护代理
&#160; &#160; &#160; &#160;对象a需要给对象c发送信息，为了保证a对c是不可见，可用对象b代理转发
```js
// filter some no use or unneed requestions or data
// A  ---> B(proxy) ----> C
const a = {
  name: 'a',
  send (target, info) {
    target.receive(info)
  }
}
const c = {
  name: 'c',
  receive (target, info) {
    console.log('c receive ', info, ' from ', target.name)
  }
}
const b = {
  name: 'b',
  receive (info) {
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
&#160; &#160; &#160; &#160;上面表示一个最简单的保护代理

#### 缓存代理
&#160; &#160; &#160; &#160;顾名思义就是缓存相关的代理

&#160; &#160; &#160; &#160;有一个二级别联动的标签列表，第二级的各有自己所属的多个标签根据第一级的参数来发送指定请求来获取，如果想要达到点击第一级列表迅速展示出相关的第二级标签，我们可以在系统空闲时预先将所有标签全部获取并缓存
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
    all.push(sendApiGetTags({
      ...params,
      index
    }))
  }
  const list = await Promise.all(all)

  list.forEach((res, i) => allTagsCache[i] = res)

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



# 发布订阅模式

### 定义：
&#160; &#160; &#160; &#160;一种一对多的依赖关系，让多个订阅者对象同时监听某一个主题对象。这个主题对象在自身状态变化时，会通知所有订阅者对象，使它们能够自动更新自己的状态。
至于发布订阅模式和观察者模式是不是同一样东西不同的人各有看法

### 优点：
&#160; &#160; &#160; &#160;订阅者可以根据自己需求当某种Action被触发时完成自己的调度

### 应用场景：
&#160; &#160; &#160; &#160;AngularJs的广播、vue的eventbus等

#### 根据主体构建发布订阅的基类
&#160; &#160; &#160; &#160;构造发布者基类
```js
class Publisher {
  constructor () {
    // 订阅发布者的队列 存储每个订阅者
    this.subscribers = []
  }
  deliver (data) {
    this.subscribers.forEach((fn) => {
      // 发布消息 调用订阅者的回调 告知订阅者
      fn.shot(data)
    })
    return this
  }
}
```
&#160; &#160; &#160; &#160;构造订阅者基类
```js
class Observer {
  constructor (call) {
    // 传入订阅回调
    this.shot = call
  }
  subscribe (publisher) {
    if (!publisher.subscribers.some((v) => {
      return v.shot === this.shot
    })) {
      console.log(chalk.red('订阅该消息'))
      // 判断当前订阅者是否订阅
      publisher.subscribers.push(this)
    }
    return this
  }
  unsubscribe (publisher) {
    publisher.subscribers = publisher.subscribers.filter((v) => {
      // 移除当前订阅者
      return !(v.shot === this.shot)
    })
    return this
  }
}
```
&#160; &#160; &#160; &#160;测试：
```js
const pub = new Publisher
const pub2 = new Publisher
const obs = new Observer(deliver => {
  console.log(deliver)
})

obs.subscribe(pub) // 订阅该消息
obs.subscribe(pub2) // 订阅该消息

pub.deliver('pub deliver first message') // pub deliver first message
pub2.deliver('pub2 deliver first message') // pub2 deliver first message

obs.unsubscribe(pub) //
pub.deliver('pub deliver second message') //
```

&#160; &#160; &#160; &#160;未完待续...

#
### 定义：
### 优点：
### 应用场景：

#
### 定义：
### 优点：
### 应用场景：

#
### 定义：
### 优点：
### 应用场景：

