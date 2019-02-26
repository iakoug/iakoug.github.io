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

没必要被高大上的名词所吓倒，日常coding中或许一个不了解各种设计模式的程序员可能自己其实已经用到了很多

抛开官方的定义在我看来简单来说就是一个简单的思想被统一为规范，按照这个规范可以写出更优雅可控亦或性能更佳的代码，像是框架的单位

软件设计模式有很多，常规的有23种，本文针对其中常用的几种进行简要介绍

# 从最简单的单体/单例模式开始

### 定义：

单体：一个用来划分命名空间并将一批相关的属性和方法组织在一起的对象

单例：顾名仅可以可以被实例化一次：在它的核心结构中只包含一个被称为单例的特殊类。通过单例模式可以保证系统中，应用该模式的一个类只有一个实例。即一个类只有一个对象实例
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
测试：
```js
const i1 = new Ins1({ name: 'i1' })

const i2 = new Ins1({ name: 'i2' })

console.log(i1 === i2) // true

console.log(i1.name) // i2
```
补充：在node中一个文件就是一个独立模块，若在某个js文件中导出一个类： `class T {} export default new T` 之后在其他任何外部文件多次引入其实都是保证了 T 类只被实例化了一次而不会被多次初始化。这是因为node遵循了commonjs的规范，所有文件模块在被引用时都会先去模块系统的缓存中查看这个文件是否存在，如果存在就返回缓存否则才会重新创建一个模块，而这个缓存其实也就限制了模块内脚本的多次初始化

# 策略模式

### 定义：
就是解耦，何为策略解耦： 指的是定义一些列的算法，把他们一个个封装起来，目的就是将算法的使用与算法的实现分离开来。说白了就是以前要很多判断的写法，现在把判断里面的内容抽离开来，变成一个个小的个体。如大量的if else或者switch case判断当需求更改时需要添加和更改判断，这违背了设计模式的对修改关闭，对扩展开放的原则

### 优点：
- 减少`command c & command v`, 提高复用性
- 遵循开闭原则，算法独立易于切换、理解、拓展

### 应用场景：
针对代码多种行为设置大量的条件判断时将每一个行为划分为多个独立的对象。每一个对象被称为一个策略。设置多个这种策略对象，可以改进我们的代码质量，也更好的进行单元测试

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
eg.: 代码情景为超市促销，vip为5折，老客户3折，普通顾客没折，计算最后需要支付的金额

// 意大利逻辑

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
// 拆分逻辑为独立单元
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
测试：
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
显然逻辑多而复杂时可以极大提高代码可读性以及减少维护成本

### 定义：
### 优点：
### 应用场景：

