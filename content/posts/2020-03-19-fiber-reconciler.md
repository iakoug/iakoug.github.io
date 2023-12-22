---
date: 2020-03-19
title: Fiber reconciler
template: post
slug: /fiber-reconciler
category: R&D
cover: media/arseny-togulev-mnx3NlXwKdg-unsplash-middle.jpg
tags:
  - React
  - Fiber
---


最近的 Group sharing 提到了 React16 中新引入的 Fiber reconciler 算法（区分之前的 Stack reconciler），深入浅出的梳理一番。

---

### 问题

大量的同步计算任务阻塞了浏览器的 UI 渲染。默认情况下，JS 运算、页面布局和页面绘制都是互斥的运行在浏览器的主线程当中。如果 JS 运算持续占用主线程，页面就没法得到及时的更新。当我们调用 setState 更新页面的时候，React 会遍历应用的所有节点，计算出差异，然后再更新 UI。整个过程是一气呵成，不能被打断的。如果页面元素很多，整个过程占用的时机就可能超过 16 毫秒，就容易出现掉帧的现象。

针对这一问题，React 团队从框架层面对 web 页面的运行机制做了优化，得到很好的效果。

![stack](https://i.loli.net/2020/03/29/3akQRFy8WsXhSZi.png)

### 方案

解决主线程长时间被 JS 运算占用这一问题的基本思路，是将运算切割为多个步骤，分批完成。也就是说在完成一部分任务之后，将控制权交回给浏览器，让浏览器有时间进行页面的渲染。等浏览器忙完之后，再继续之前未完成的任务。

旧版 React 通过递归的方式进行渲染，使用的是 JS 引擎自身的函数调用栈，它会一直执行到栈空为止。而 Fiber 实现了自己的组件调用栈，它以链表的形式遍历组件树，可以灵活的暂停、继续和丢弃执行的任务。实现方式是使用了浏览器的 requestIdleCallback 这一 API。官方的解释是这样的：

window.requestIdleCallback()会在浏览器空闲时期依次调用函数，这就可以让开发者在主事件循环中执行后台或低优先级的任务，而且不会对像动画和用户交互这些延迟触发但关键的事件产生影响。函数一般会按先进先调用的顺序执行，除非函数在浏览器调用它之前就到了它的超时时间。

![frame](https://i.loli.net/2020/03/29/KTVjUfLNOwuSGpX.png)

### 实现

原本的实现机制中 React 内部会将 JSX 转化为 AST node，而在这个过程中将引入一个生成 Fiber node 的阶段，建立一条由节点、类型、标记等信息的一个 Fiber node 组成的链表结构。

![fiber](https://i.loli.net/2020/03/29/aBOMNU8njZAbs7K.png)

```js
class Fiber {
  constructor(tag, vnode) {
    this.expirationTime = null
    this.updateQueue = null

    // 标记
    this.tag = tag
    // 类型
    this.type = null
    this.stateNode = null
    this.return = null
    this.child = null

    this.props = null
    this.oldProps = null

    // 副作用
    this.effectTag = null
    // 另一个节点
    this.alternate = null

    // 携带下一个props
    this.children = vnode
    this.oldChildren = null
  }
}
```

构建节点信息的同时要确保过程是可以打断的，链表的根节点信息需要进行初始化。

```js
class FiberRoot {
  constructor(dom, cb) {
    // 当前开始的节点
    this.current = null
    // 过期时间
    this.expirationTime = 0
    this.dom = dom || null
    this.done = cb || null
  }
}
```

构建的链表结构所对应的 CRUD 行为进行定义。

```js
function push(heap, node) {
  const i = heap.length
  heap.push(node)
  siftUp(heap, node, i)
}

function pop(heap) {
  const first = heap[0]
  if (!first) return null
  const last = heap.pop()
  if (last !== first) {
    heap[0] = last
    siftDown(heap, last, 0)
  }
  return first
}

function siftUp(heap, node, i) {
  while (i > 0) {
    const pi = (i - 1) >>> 1
    const parent = heap[pi]
    if (cmp(parent, node) <= 0) return
    heap[pi] = node
    heap[i] = parent
    i = pi
  }
}

function siftDown(heap, node, i) {
  for (;;) {
    const li = i * 2 + 1
    const left = heap[li]
    if (li >= heap.length) return
    const ri = li + 1
    const right = heap[ri]
    const ci = ri < heap.length && cmp(right, left) < 0 ? ri : li
    const child = heap[ci]
    if (cmp(child, node) > 0) return
    heap[ci] = node
    heap[i] = child
    i = ci
  }
}

function cmp(a, b) {
  return a.expirationTime - b.expirationTime
}

// 模拟使用首项
function peek(heap) {
  return heap[0] || null
}
```

此时需要一些全局变量记录工作状态。

```js
// 任务队列
const taskQueue = []
// 当前正在执行的任务回调
let currentCallback = null
// 当前任务
let currentTask = null
// 一帧间隔 自定义为5ms
let frameLength = 5
// 一帧间隔内过期时间
let frameDeadline = 0
// 正在工作状态
let isPerformingWork = false
```

定义操作类型。

```js
const [HOST, HOOKCOMPONENT, CLASSCOMPONENT, HOSTROOT] = [0, 1, 2, 3]
const [NormalPriority] = [97]
const [NOWORK, DELETE, UPDATE, PLACEMENT] = [0, 2, 3, 4]
```

在调用 React 的 render 周期函数时，开始进行 Fiber node 的生成调度工作。

```js
// 当前正在执行的工作
let WIP = null
// 待提交队列
let commitQueue = []
let preCommit = null

// 当前时间过期判断终止生成动作
function shouldYield() {
  return getTime() >= frameDeadline
}

function performWorkOnRoot(didout = true) {
  // 构建fiber树

  WIP = rootFiber[0]

  // shouldYield 当前时间过期判断终止生成动作
  while (WIP && (!shouldYield() || didout)) {
    // 更新当前状态
    WIP = performUnitOfWork(WIP)
  }

  if (!didout && WIP) {
    rootFiber[0] = WIP

    return performWorkOnRoot.bind(null)
  }

  if (preCommit) {
    // 下面定义提交动作
    // commitWork(preCommit, commitQueue)
  }

  commitQueue = []
  preCommit = null

  return null
}

function scheduleWork(fiber) {
  rootFiber[0] = fiber

  const startTime = getTime()
  let timeout = 5000
  const expirationTime = startTime + timeout

  const newTask = {
    expirationTime,
    startTime,
    callback: performWorkOnRoot
  }

  push(taskQueue, newTask)
  requestHostCallback(flushWork)

  return newTask
}
```

定义提交动作。

```js
function commitWork(fiber, patchQueue) {
  // 提交阶段
  patchQueue.forEach(item => {
    if (item) commit(item)
  })

  fiber.done && fiber.done()
}

function commit(patch) {
  const op = patch.effectTag
  const tag = patch.tag

  // 行为删除标志 2
  if (op === 2) {
    // 提交副作用 销毁的生命周期
    // 行为 hook 1
    while (tag === 1) return patch.return
    // 删除节点
  } else if (tag === 1) {
    // 行为 hook 1
    // 提交副作用
  } else if (op === 3) {
    // 行为 3 更新
    // 更新dom上的属性 事件等
  } else {
    // PLACEMENT
    const node = getParentDomNode(patch)
    node.appendChild(patch.stateNode)
  }

  patch.effectTag = NOWORK
}

function getParentDomNode(patch) {
  const parentTag = patch.return.tag
  if (parentTag === 0) {
    return patch.return.stateNode
  } else if (parentTag === 1) {
    return getParentDomNode(patch.return)
  } else if (parentTag === HOSTROOT) {
    return patch.return.stateNode.dom
  }
}
```

更新当前状态。

```js
function performUnitOfWork(fiber) {
  switch (fiber.tag) {
    case HOST:
      updateHOST(fiber)
      break
    case HOSTROOT:
      updateHOSTROOT(fiber)
      break
    case HOOKCOMPONENT:
      updateHooks(fiber)
      break
    case CLASSCOMPONENT:
      updateClass(fiber)
      break
  }

  // walk
  if (fiber.child) return fiber.child
  while (fiber) {
    // 已经遍历到根节点
    if (fiber.tag === HOSTROOT) {
      preCommit = fiber
    }

    if (fiber.sibling) {
      return fiber.sibling
    }
    fiber = fiber.return
  }
}

function updateHOSTROOT(fiber) {
  processUpdateQueue(fiber)
  reconcileChildren(fiber)
}

function updateHOST(fiber) {
  if (fiber.type) {
    fiber.stateNode = createElement(fiber)
  }

  const hostChildren = fiber.props.children || null

  fiber.children = hostChildren
  reconcileChildren(fiber)
}

function updateHooks(fiber) {
  // 当前WIP给到hooks

  currentHooksFiber = fiber
  const Component = fiber.type(fiber.props)

  fiber.stateNode = fiber.type
  fiber.children = Component
  reconcileChildren(fiber)
}

function updateClass(fiber) {}

// link + diff
function reconcileChildren(fiber) {
  if (!fiber.children) return
  let oldChildren = fiber.oldChildren
  let newChildren = (fiber.oldChildren = hashy(fiber.children))
  let store = {}

  // diff
  for (const k in oldChildren) {
    let oldChildVnode = oldChildren[k]
    let newChildVnode = newChildren[k]

    // TODO 可判断key
    if (oldChildVnode.type === newChildVnode.type) {
      store[k] = newChildVnode
    } else {
      const emptyFiber = new Fiber(null, null)
      emptyFiber.return = fiber
      emptyFiber.effectTag = DELETE
      commitQueue.push(emptyFiber)
    }
  }

  let prevFiber = null

  // diff
  for (const k in newChildren) {
    let oldChildVnode = store[k]
    let newChildVnode = newChildren[k]

    // TODO 通过判断创建或复用alternate Fiber
    // 这里应该是根据情况重新创建
    const newFiber = new Fiber(null, null)

    if (typeof newChildVnode.type === 'function') {
      newFiber.tag = HOOKCOMPONENT
    } else {
      newFiber.tag = HOST
    }
    newFiber.type = newChildVnode.type
    newFiber.key = newChildVnode.key
    newFiber.props = newChildVnode.props
    newFiber.return = fiber

    if (oldChildVnode) {
      newFiber.effectTag = UPDATE
      newFiber.oldProps = oldChildVnode.props || {}
      commitQueue.push(newFiber)
    } else if (newChildVnode) {
      newFiber.effectTag = PLACEMENT
      commitQueue.push(newFiber)
    }

    // 链接链表
    if (prevFiber) {
      prevFiber.sibling = newFiber
    } else {
      fiber.child = newFiber
    }
    prevFiber = newFiber
  }

  if (prevFiber) prevFiber.sibling = null
}
```

定义 React 中根据 Fiber node 创建和更新元素的方法。

```js
function createElement(fiber) {
  const type = fiber.type
  let dom
  if (type === 'text') {
    dom = document.createTextNode('')
    dom.nodeValue = fiber.props.textValue
  } else {
    dom = document.createElement(fiber.type)
    updateElement(dom, {}, fiber.props)
  }
  return dom
}

function updateElement(dom, oldProps, newProps) {
  for (let name in { ...oldProps, ...newProps }) {
    let oldValue = oldProps[name]
    let newValue = newProps[name]

    if (oldValue === newValue || name === 'children') {
    } else if (name === 'style') {
      // 样式
      for (const k in { ...oldValue, ...newValue }) {
        if (!(oldValue && newValue && oldValue[k] === newValue[k])) {
          dom[name][k] = (newValue && newValue[k]) || ''
        }
      }
    } else if (name.startWith('on')) {
      // 事件
      name = name.slice(2).toLowerCase()
      if (oldValue) dom.removeEventListener(name, oldValue)
      dom.addEventListener(name, newValue)
    } else if (newValue == null || newValue === false) {
      dom.removeAttribute(name)
    } else {
      dom.setAttribute(name, newValue)
    }
  }
}
```

最后可以重新定义 React 的 render 方法。

```js
function render(vnode, dom, callback) {
  // 生成根节点
  // 根节点标志 3
  const FiberRootNode = new FiberRoot(dom, callback)
  const node = new Fiber(3, null)
  FiberRootNode.current = node
  const current = node

  current.stateNode = FiberRootNode

  // 初始化调度工作
  scheduleWork(current)
}
```

使用。

```js
function App() {
  return (
    <div>
      {new Array(300).fill('').map((item, i) => (
        <div key={i}>item</div>
      ))}
    </div>
  )
}

document.body.addEventListener('click', () =>
  render(<App></App>, document.getElementById('app'))
)
```

此时 Fiber reconciler 的基本调度算法已经实现，此时如果页面存在大量阻塞渲染时不会再干扰到页面其他动画的卡顿。
