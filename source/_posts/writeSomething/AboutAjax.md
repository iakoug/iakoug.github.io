---
title: 关于ajax请求
tags:
  - ajax
date: 2019-07-04 14:50:22
categories: ajax

---
`Asynchronous Javascript And XML`
<!-- more -->
Ajax已经成为前后端数据通信不可或缺的技术之一，它的异步让前端数据获取向前迈了一大步，配合view-model静态更新视图带来更好的交互体验已经成为当前web发展的主流

# 最初的XHR

所有浏览器都支持的XHR对象 `XMLHttpRequest`
```js
const xhr = new XMLHttpRequest() //获取xhr对象
```

但是IE非要展示自己的存在感坚强的要发出自己的声音，甚至于不同版本的IE浏览器之间还有不同的声音🤣
```js
let xhr

if (window.XMLHttpRequest) { // Mozilla, Safari...
  xhr = new XMLHttpRequest()
}

if (window.ActiveXObject) { // IE
  try {
    xhr = new ActiveXObject('Msxml2.XMLHTTP')
  } catch (e) {
    try {
      xhr = new ActiveXObject('Microsoft.XMLHTTP')  // IE5、6
    } catch (e) {}
  }
}
```

有了上面这个xhr对象就可以发送真正的请求了
```js
// GET
xhr.open("GET","xxx.json",true)
xhr.send()

// POST
xhr.onreadystatechange = function onReadyStateChange() {
  const {readyState, status} = xhr

  if (readyState === 4 && status === 200) {
    console.log('success')
  } else {
    console.log('failed')
  }
}
xhr.open('POST', '/api', true)
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
xhr.send('username=admin&password=root')
```
# jQuery ajax
Ajax将XHR进行封装，让开发者可以更加便捷方便进行使用
```js
$.ajax({
   type: 'POST',
   url: url,
   data: data,
   dataType: dataType,
   success: function () {},
   error: function () {}
})

$.get(url,function(){})
$.post(url,body,function(){})
```

优点：
- 对原生XHR的封装
- 针对MVC的编程
- 完美的兼容性
- 支持jsonp

缺点：
- 不符合MVVM
- 异步模型不够现代，不支持链式，代码可读性差
- 整个Jquery太大，引入成本过高

# fetch
fetch是es6后出现的全新API，完全是基于Promise的异步处理机制，使用起来会比起ajax更加简单

使用fetch的代码会相比xhr具有条理性

```js
fetch(url).then(response => response.json())
  .then(data => console.log(data))
  .catch(e => console.log("Oops, error", e))
```
优点：
- 更加底层，提供的API丰富（request, response）
- 语法简单，脱离了XHR，基于ES新的Promise设计
- 看到以上，或许你会觉得fetch真的很美好，但是请了解，fetch本身是一个 low-level 的 API，它注定不会像你习惯的 $.ajax - 或是 axios 等库帮你封装各种各样的功能或实现

缺点：
- 兼容性比较凄惨，低级别浏览器均不支持，需要实现fetch的polyfill了思路其实很简单，就是判断浏览器是否支持原生的fetch，不支持的话，就仍然使用XMLHttpRequest的方式实现，同时结合Promise来进行封装常见的polyfill就有：es6-promise,babel-polyfill,fetch-ie8等
  > [https://caniuse.com/#search=fetch](https://caniuse.com/#search=fetch)

- 不支持jsonp，可以引入fetch-jsonp `npm install fetch-jsonp --save-dev`
`fetchJsonp(url, { timeout: 3000, jsonpCallback: 'callback' }).then(function(response) { console.log(response.json()) }).catch(function(e) { console.log(e) })`
- 没有拦截器，需要额外再封装一层或者fetch-interceptor
- 默认不带cookie，需要添加配置 `fetch(url,{credentials: 'include'})`
- 没有abort，不支持timeout超时处理,可以用Promise.race()实现，Promise.race(iterable) 方法返回一个Promise对象，只要 iterable 中任意一个Promise 被 resolve 或者 reject 后，外部的Promise 就会以相同的值被 resolve 或者 reject
- 无法获取progress状态: fetch中的Response.body 中实现了getReader()方法用于读取原始字节流, 该字节流可以循环读取参考javascript - Progress indicators for fetch? - Stack Overflow 2016 - the year of web streams

# Axios
尤大在vue中强推的ajax库

特点：
- 支持node，创建http请求
- 支持Promise API
- 客户端防止CSRF：每个请求带一个cookie拿到的key
- 拦截请求和响应
- 可取消请求

兼容性上虽然axios本质上也是对原生XHR的封装，但是它也依赖原生ES6 Promise的实现，和fetch一样需要polyfill的兼容

usage:
```js
axios({
  method: 'GET',
  url: url,
})
  .then(res => {console.log(res)})
  .catch(err => {console.log(err)})

// get请求
axios.get(url)
  .then(function (response) {
    console.log(response)
  })
  .catch(function (error) {
    console.log(error)
  })

// post请求
axios.post（`/user`, {
    name: 'admin',
    pw: '123456'
  })
  .then(function (response) {
    console.log(response)
  })
  .catch(function (error) {
    console.log(error)
  })
```

# Last
请求在本身上会有两种问题需要额外处理，处理方式就见仁见智
- 请求串行
- 请求并行
  
在使用方面：
首先可以肯定的是，如果你的代码依旧是基于Jquery，那毫无疑问，ajax就是你最好的选择
如果你使用的是任意MVVM框架，建议无脑使用axios，fetch在实际项目使用中，需要各种的封装和异常处理，并非开箱即用，而axios可以做到直接替换$.ajax
如果就是要使用fetch，那相信你也一定能封装成自己的一套最佳实践（突然为yqb的mzone_fetch感到头疼😭）