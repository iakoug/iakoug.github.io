---
title: 使用ts封装一个fetch请求库---请求的并发控制
tags:
  - fetch
  - concurrency
date: 2019-06-13 14:20:00
categories: 封装
index_img: http://pic.netbian.com/uploads/allimg/180315/110404-1521083044b19d.jpg
---
fetch系列第三篇`记录帖`，封装一个请求并发控制的库

<!-- more -->
和各类型拦截器封装的本质一样，通过不直接更改原宿主的形式对原宿主进行包装重写覆盖（或者称之为装饰者模式）

_代码由 `wx.request` 作为示例_

# 从使用开始
先从使用场景入手，希望引入一个函数可以接受原request方法以及控制的并发数从而返回一个内部可以控制指定并发数的新请求函数

```js
const wrapper = require('request-concurrency')

const new_fetch = wrapper(fetch, 2)
```

所以主要就是处理以下三件事：

1. 接受原请求方法以及并发数参数
2. 构建请求派发队列
3. 对原请求进行包装参数处理

# 接受原请求方法以及并发数参数

接受原请求方法以及并发数参数并返回一个promsie
```js
// 向外暴露的接口方法
function setConcurrencyRequest(request, concurrency = 10) {
  if (typeof request !== 'function') {
    throw Error('request must be function')
  }

  // 请求队列
  const queue = []

  // 对外暴露的调用方法
  return apiArgs => {
    return new Promise((resolve, reject) => {
    })
  }
}
```
接下来需要构建请求派发队列，主要分为两部分：执行队列和等待队列

# 构建请求派发队列

用闭包对两个队列分别做存储，用户每次触发客户端请求都会先将请求推入等待队列中，而在执行阶段则主要做两件事情，一是不断将执行队列中的请求派发出去（初始是空），二是不断检查执行队列的长度（并发数），当执行队列的长度在并发数以内则将等待队列中的请求按顺序推入（先入先出）执行队列。

这里的最重要的地方是执行队列中请求完成的时候返回客户端结果同时将该请求从执行队列中移除。

也主要有三件事情：
1. 接受客户端传入的请求推入等待队列 `push`
2. 派发当前执行队列中的请求 `excute`
3. 移除执行队列中结束的请求，将等待队列中相应数量的请求按照先进先出的顺序移除并推入执行队列 `changeQueue`

```js
function getRequestQueue(call, concurrency) {
  concurrency = concurrency || 5

  // 挂起
  const waitingList = []
  // 执行
  const executionList = []

  return function() {
    const model = {
      concurrency,
      push(currentRequest, call) {
        waitingList.push({
          currentRequest,
          call
        })

        this.excute()
      },
      excute() {
        while (this.concurrency > executionList.length && waitingList.length) {
          // 将挂起队列中请求推进执行队列
          const apiModel = waitingList.shift()
          executionList.push(apiModel)
          call(
            apiModel.currentRequest,
            setCall((...args) => {
              this.changeQueue(apiModel)
              if (apiModel.call) {
                apiModel.call.constructor === Function && apiModel.call(...args)
              }

              // 发起请求
              this.excute()
            })
          )
        }
      },
      changeQueue(apiModel) {
        // 从执行队列移除
        const index = executionList.indexOf(apiModel)

        if (index !== -1) {
          executionList.splice(index, 1)
        }
      }
    }

    return model
  }
}
```




# 以下为完整代码

源码放在：
> [https://github.com/rollawaypoint/request-concurrency/blob/master/lib/index.js](https://github.com/rollawaypoint/request-concurrency/blob/master/lib/index.js)

```js
const defaultConcurrency = 5

function setConcurrencyCount(concurrency = defaultConcurrency) {
  return concurrency && concurrency.constructor === Number
    ? concurrency
    : defaultConcurrency
}

// 回调结束置空
const setCall = fn => (...args) => {
  if (!fn) {
    throw new Error('repeating call has been denied.')
  }

  const call = fn
  fn = null

  return call(...args)
}

function getRequestQueue(call, concurrency) {
  concurrency = setConcurrencyCount(concurrency)

  // 挂起
  const waitingList = []
  // 执行
  const executionList = []

  return function() {
    const model = {
      concurrency,
      push(currentRequest, call) {
        waitingList.push({
          currentRequest,
          call
        })

        this.excute()
      },

      excute() {
        while (this.concurrency > executionList.length && waitingList.length) {
          // 将挂起队列中请求推进执行队列
          const apiModel = waitingList.shift()

          executionList.push(apiModel)

          call(
            apiModel.currentRequest,
            setCall((...args) => {
              this.changeQueue(apiModel)

              if (apiModel.call) {
                apiModel.call.constructor === Function && apiModel.call(...args)
              }

              // 发起请求
              this.excute()
            })
          )
        }
      },

      changeQueue(apiModel) {
        // 从执行队列移除
        const index = executionList.indexOf(apiModel)

        if (index !== -1) {
          executionList.splice(index, 1)
        }
      }
    }

    return model
  }
}

function setConcurrencyRequest(request, concurrency = defaultConcurrency) {
  if (typeof request !== 'function') {
    throw Error('request must be function')
  }

  const queue = getRequestQueue(
    (currentRequest, call) => currentRequest(call),
    concurrency
  )()

  return apiArgs => {
    return new Promise((resolve, reject) => {
      queue.push(call => {
        const complete = apiArgs.complete
  
        apiArgs.complete = (...args) => {
          // 请求完成
          call()
          if (complete) {
            complete.constructor === Function && complete.apply(apiArgs, args)
          }
        }
  
        resolve(request(apiArgs))
      })
    })
  }
}

module.exports = setConcurrencyRequest
```