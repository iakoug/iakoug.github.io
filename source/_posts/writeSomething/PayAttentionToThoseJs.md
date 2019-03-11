---
title: 你应该注意的那些JS（相关）
tags:
  - 知识点
date: 2019-03-11 12:35:00
categories: 你应该知道的
---
记录那些没有注意的JS或者遇到的issues
持续更新👏
<!-- more -->
*没有分类顺序可能杂乱😝*

### 小数部分进行数学运算可能会生成过多的小数位
很多人应该都遇到过类似的问题：`0.1 + 0.2 === 0.3` 返回值是 false，顿为惊叹
在浏览器输入后发现 `0.1 + 0.2` 返回值是 `0.30000000000000004`(小数17位，<a href="#hahhhhhh">关于这个</a>)
查了一下找到了个解释：
> Computer in dealing with digital mathematical operations (such as the decimal), its first converted to binary again, the decimal Numbers to binary may occur in the process of precision loss, can be used by toFixed and round method comprehensive to solve this problem.

计算机是只认识二进制的，数学运算中进制转换的过程可能会发现精度损失的情况

*可以使用 `toFixed` 或者 `round` 方法兼容处理*

### JS（Java）浮点数的数字长度
ECMAScript Number（Java： float | double） 是使用 IEEE754 格式来表示整数和浮点数，浮点数的最高精度为 17 位小数

*`Number.EPSILON`(1 与大于 1 的最小浮点数之间的差, 换句话说其实就是JS支持的最小精度) 值为2^-52，约等于2.2e-16，浮点数运算的过程中，如果误差小于这个数值，可以认为误差是不存在的，所以说第17位上的小数，其实没有意义*

### JS箭轴函数
如下代码：
```js
function make () {
  return () => console.log(this)
}
const testFunc = make.call({ name:'foo' });

testFunc() // { name: "foo" } 
testFunc.call({ name:'bar' }); // { name: "foo" }
```
可以看到箭头函数在定义之后，this 就不会发生改变了，无论用什么样的方式调用它，this 都不会改变

原因：箭头函数不会自动绑定局部变量，如this，arguments，super(ES6)，new.target(ES6)等

所以箭头函数没有它自己的this值，箭头函数内的this值继承自外围作用域。在箭头函数中调用 this 时，仅仅是简单的沿着作用域链向上寻找，找到最近的一个 this 拿来使用

箭轴函数有如下等特性：
- 箭头函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象
- 箭头函数不可以当作构造函数，也就是说，不可以使用new命令，否则会抛出一个错误
- 箭头函数不可以使用arguments对象，该对象在函数体内不存在。如果要用，可以用Rest参数代替
- 不可以使用yield命令，因此箭头函数不能用作Generator函数

### 关于创建vue中的vnode(virture dom)
公司之前有个文件上传组件，由于每次都会创建一个实例dom导致一些不可预知的样式错误，于是同事改用vnode来处理这部分

拿来主义：
![virturedom](/virturedom.png)

**Vue2.x版本中VNode属性：**
- tag:当前节点标签名
- data：当前节点数据对象
- children：子节点数组
- text：当前节点文本
- elm：当前虚拟节点对应的真实dom节点
- ns：节点的namespace( 名称空间)
- content：编译作用域
- functionalContext：函数化组件的作用域，即全局上下文
- key：节点标识，有利于patch优化
- componentOptions：创建组件实例时的options
- child：当前节点对应的组件实例
- parent：组件的占位节点
- raw：原始html
- isStatic：是否是静态节点
- isRootInsert：是否作为跟节点插入，若被包裹的节点，该属性值为false
- isComment：是否为注释节点
- isCloned：是否为克隆节点
- isOnce：是否只改变(渲染)一次，或是否有v-once指令
其中这里面又有几种VNode类型
- TextVNode：文本节点
- ElementVNode：普通元素节点
- ComponentVNode：组件节点
- EmptyVNode：空节点，或者说是没有内容的注释节点
- CloneVNode：克隆节点，可以是以上任意类型节

什么时候用虚拟dom才比较好呢？其实我们使用的单文件组件就已经够好了。但是当某些代码冗余的时候如果写单文件组件的话会有好多重复的内容

接下来介绍其核心函数createElement(h)：
createElement接收3个参数：
- 第一个参数可以是HTML标签名，组件或者函数都可以；此参数是必须的
- 第二个为数据对象（可选）
- 第三个为子节点（可选）

**附上简单demo：**
```js
const Instance = new Vue({
  data: Object.assign({}, _props, {

  }),
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

    return h('div', {
      class: 'tuhu_upload_layout'
    }, [vnode])
  }
})
```

### 使用instanceof判断构造函数的问题
测试代码：
```js
function A() {}

var a = new A
console.log(a instanceof A) // true
console.log(a instanceof Object) // true

var obj = {}
A.prototype = obj
// a.__proto__ = obj // console.log(a instanceof A) // true
var a2 = new A
console.log(a2 instanceof A) // true
console.log(a instanceof A) // false

console.log(a instanceof Object) // true
```
所以综上所述 instanceof 并不能从字面意思来判断谁是否是谁的实例对象
鱼泡泡的面试题：instanceof 判断构造函数可能会出现不准确的情况吗？如 `const arr = []; arr instanceof Array === false`。大都说不出其中几何, 其实同样只需要更改 `arr.__proto__ = Object // Number etc.`

instanceof本意：
> MDN: The instanceof operator tests whether the prototype property of a constructor appears anywhere in the prototype chain of an object.
[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof](url)

**就是说 instanceof 是用来判断 A.prototype 是否存在于参数 a 的原型链上**

所以当A的prototype被指向任意一个其他对象的时候 A.prototype是不在a的原型链上的

a所在的原型链: a ==> a.__proto__ ==> Object.prototype ==> null

a2所在的原型链: a2 ==> obj ==> Object.prototype ==> null

所以此时如果赋值a.__proto__ = obj，a instanceof A 同样会返回true

*JS是一门基于原型的语言，而原型是动态的并非一定不变所以会有上述情况*


.
.
.
.
.
.
未完待续...👏
