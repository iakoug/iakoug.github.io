---
date: 2020-02-14
title: Demo of Notion – The all-in-one workspace for your notes, tasks, wikis, and databases
template: post
thumbnail: '../thumbnails/algorithm.png'
slug: demo-of-notion
categories:
  - Algorithm
tags:
  - notion
  - rich editor
---

从零开发一个类 Notion 的富文本编辑项目该怎么做？一个实现 Notion 富文本基本编辑功能的 demo 记录。

---

### Notion

将 Notion 用来协同办公有一年的时间了，不算重度使用也算基本了解 Notion 的富文本编辑的功能。
和传统富文本编辑框不同的是 Notion 设置了 `块` 的定义，不同类型的组件以块的形式来读写存放，这里主要实现最核心的 `文本块` 的基本功能。

从未接触类似相关的功能开发，起初调研了市场上数十个编辑器以及拖拽图形化处理相关的库（流行的如 editorJs、react-dnd 等），发现与 Notion 的功能契合度均不理想，最终决定不参考任何实现，从零开始完成最基本的 demo。

### 数据结构

抛开复杂的功能，页面所有的块以及功能都是由数据来驱动，所以数据结构的设计至关重要，数据结构关系到页面的渲染逻辑以及对应的图形化操作映射到数据结构的 CRUD 上。<br />
数据结构的最初设计主要包含以下几点：

- 和 Notion 一致，除去展示内容的功能块之外数据结构要包含 `行` 和 `列` 这两种用于固定页面结构的块
- 每个子节点包含自身 key、类型、内容、所属父亲的 key 以及自身拥有的子节点列表
- 构造的树形结构要严格确保每个级别的 key 唯一且通过所属父亲的 key 构造如链表的稳定关系，在进行 CRUD 从操作时候确保结构的稳定性

#### 定义

具体结构样例如：

```js
const pageData = [
  {
    type: 'row',
    key: '1',
    children: [
      {
        type: 'column',
        key: '2',
        parent: '1',
        children: [
          {
            type: 'list',
            key: '3',
            content: '<list> key3',
            parent: '2',
            children: [
              {
                type: 'list',
                key: '4',
                content: '<list> 4',
                parent: '3',
                children: []
              }
            ]
          }
        ]
      },
      {
        type: 'column',
        key: '13',
        parent: '1',
        children: [
          {
            type: 'list',
            key: '13-1',
            parent: '13',
            content: '<list> 13',
            children: [
              {
                type: 'txt',
                key: '13-1-1',
                parent: '13-1',
                content: '<txt> Heading here is. 13-1'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    type: 'row',
    key: '15',
    children: [
      {
        type: 'column',
        parent: '15',
        key: '155',
        children: [
          {
            type: 'txt',
            key: '15-1',
            parent: '155',
            content: '<txt> Here is normal txt. 15-1'
          }
        ]
      }
    ]
  }
]
```

#### 渲染

由于行和列这两种特殊的结构节点，所以分三步分别将行、列、内容节点递归渲染出来。

- 为文本直接子节点绑定光标以及监听输入的事件以及属性
- 为定义结构支持拖拽的节点绑定支持拖拽的相关事件以及属性
- 将节点的 key 渲染为节点的类名，方便对节点进行读写操作

渲染行：

```js
renderPageJSX = () => {
  const { pageData } = this.state

  return pageData.map(
    (row, i) =>
      row.children &&
      row.children.length > 0 && (
        <div className="page-row" key={i.toString()}>
          {this.renderRowColumnJSX(row, i)}
        </div>
      ),
  )
}

render() {
    return (
      <div className="demo-layout">
          <div>{this.renderPageJSX()}</div>
      </div>
    )
  }
```

渲染列：

```js
renderRowColumnJSX = (row, rowIndex) =>
  row.children.map((column, j) => {
    const cn = `node-${column.key} column`

    return (
      column.children &&
      column.children.length > 0 && (
        <div className={cn} key={j.toString()}>
          {this.renderNode(column, rowIndex, j)}
        </div>
      )
    )
  })
```

渲染内容节点：

```js
renderNode = (column, rowIndex, columnIndex) =>
  column.children.map((item, j) => {
    const cn = `node-${item.key}`
    const className = `${cn} drag-box`

    return (
      <div
        key={j.toString()}
        draggable="true"
        className={className}
        onDrag={this.handleDrag(item)}
        onDrop={this.handleDrop(item, cn, j, rowIndex)}
        onDragLeave={this.handleDragLeave(cn)}
        onDragOver={this.handleDragover(item, cn)}
      >
        {item.hasOwnProperty('content') && ( // 避免退格删除节点内容导致无法render编辑框
          <div
            className="content"
            id={`id-${item.key}`}
            // Remove Warning: A component is `contentEditable` and contains `children` managed by React.
            // It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated.
            // This is probably not intentional.
            suppressContentEditableWarning="true"
            contentEditable="true"
            onInput={this.handleContentInput(item)}
            onFocus={this.handleContentFocus(item, j)}
            onBlur={this.handleContentBlur(item, j)}
            onKeyUp={this.handleContentKeyUp(item, j, column.children.length)}
            onKeyDown={this.handleContentKeyDown(
              item,
              rowIndex,
              j,
              columnIndex
            )}
          >
            {item.content || ''}
          </div>
        )}
        {item.children && item.children.length > 0 && (
          <div className="sub-node">
            {this.renderNode(item, rowIndex, columnIndex)}
          </div>
        )}
      </div>
    )
  })
```

### Lodash

```js
import { debounce, isEqual, cloneDeep } from 'lodash'
```

### 拖拽

在想要支持拖拽的元素上设置属性 `draggable='true'`，主要由 `onDrag`、`onDrop`、`onDragLeave`、`onDragOver` 四个事件来完成基本拖拽功能。

_需要注意的是如果想要支持拖拽 必须要设置 handleDragover & handleDrop 事件。_

定义一个全局对象存储档当前拖拽的节点对象。

```js
let from = {} // Storage drag info
```

拖拽以及后续光标以及键盘操作为避免自身的默认行为干扰，定义 `prevent` 函数。

```js
const prevent = e => {
  e.persist()
  e.preventDefault()
  e.stopPropagation()

  e.cancelBubble = true
}
```

拖拽的同时将拖拽节点记录下来，`isEditorBlock` 用于确定释放元素是编辑器节点，避免当前页面上其他不相关可拖拽元素干扰。

```js
handleDrag = d => e => {
  prevent(e)

  from = {
    ...d,
    // Fix remove the influence of other draggable elements.
    isEditorBlock: true
  }
}
```

此处存在一个问题，当拖拽元素的释放的元素位置是自身子元素时会导致干扰，所以此处需要判断目标元素是否是拖拽元素的子元素。

```js
findSubKey = (data, parentKey, subKey) => {
  let bool = false

  // 拖拽自身
  if (parentKey === subKey) {
    return true
  }

  const loop = (d, sK) => {
    d.some(v => {
      if (v.key === sK) {
        bool = true

        return true
      }

      if (v.children) {
        loop(v.children, sK)
      }

      return false
    })
  }

  const findParent = d => {
    d.forEach(item => {
      if (item.children) {
        if (item.key === parentKey) {
          loop(item.children, subKey)
        } else {
          findParent(item.children)
        }
      }
    })
  }

  findParent(data)

  return bool
}
```

当拖拽元素到达目标元素（支持释放）时设置目标元素高亮样式。

```js
// If wanna be drag must be set handleDragover & handleDrop
handleDragover = (d, cn) => e => {
  prevent(e)

  if (!from.isEditorBlock) {
    // Fix remove the influence of other draggable elements.
    return
  }

  if (!this.findSubKey(this.pageData, from.key, d.key)) {
    document.querySelector(`.${cn}`).style.background = 'rgba(0,0,0,.3)'
  }
}
```

拖拽元素离开支持释放的元素的时候清除目标元素的样式。

```js
handleDragLeave = cn => e => {
  prevent(e)

  document.querySelector(`.${cn}`).style.background = 'transparent'
}
```

释放操作略显复杂些，将同一份数据结构分别存储在类的 `this` 以及 `state` 上，通过对象存在引用的特性，动态的修改 `this.pageData` 之后，将 `this.pageData` 使用 `setState` 方法映射到 `state` 上从而触发页面更新。

总的来说就是需要一个将节点从原位置移除的方法以及将节点插入到指定位置的方法。

移除：

```js
deleteNode = (data, key) => {
  data.forEach((item, index) => {
    if (item.key === key) {
      data.splice(index, 1)
    } else if (item.children) {
      this.deleteNode(item.children, key)
    }
  })
}
```

插入：

```js
insertNode = (data, key, insertData, position) => {
  data.forEach(item => {
    if (item.key === key) {
      insertData.parent = item.key // Specific parent

      if (!item.children) {
        item.children = [insertData]
      } else {
        // 所在drop区域元素的下一个元素释放
        item.children.splice(position, 0, insertData)
      }
    } else if (item.children) {
      this.insertNode(item.children, key, insertData, position)
    }
  })
}
```

由于行列节点是用于规范页面结构，所以当行列节点内层的子节点为空时需要及时删除所在行列，避免页面结构的错乱。

```js
deleteNullRow = () => {
  this.pageData = this.pageData
    .filter(
      row =>
        row.children &&
        row.children.length &&
        row.children.some(column => column.children && column.children.length)
    )
    .map(row => ({
      ...row,
      children: row.children.filter(
        column => column.children && column.children.length
      )
    }))
}
```

节点的删除以及插入操作完成后，将变更后的 `this.pageData` 映射到 `state` 上。

```js
jsonRending = fn => {
  this.deleteNullRow()

  this.setState(
    {
      pageData: this.pageData
    },
    fn
  )
  // }
}
```

此外由于行列这种特殊块的存在导致需要对释放节点的元素进行判断，根据 Notion 的规则“父亲是列并且自身无子元素同时列所在的行只有一列并且列的子元素只有一个此时判断为新增一行”，所以需要知道拖拽所在目标元素的节点父节点类型，后续大量操作都需要类似方法，定义 `findNode` 方法用于判断指定 key 所在的节点内容以及类型等信息。

```js
findNode = key => {
  let node = {}

  let f = false

  let position

  const loop = ele => {
    if (ele.children && ele.children.length) {
      for (let q = 0; q < ele.children.length; q++) {
        const item = ele.children[q]

        if (item.key === key) {
          node = item
          position = q
          f = true

          break
        } else {
          loop(item)
        }
      }
    }
  }

  for (let k = 0; k < this.pageData.length; k++) {
    const row = this.pageData[k]

    if (row.key === key) {
      node = row
      position = k
      f = true

      break
    }

    if (!f) {
      for (let j = 0; j < row.children.length; j++) {
        const column = row.children[j]

        if (column.key === key) {
          node = column
          position = j
          f = true

          break
        }

        if (!f) {
          for (let i = 0; i < column.children.length; i++) {
            const ele = column.children[i]

            if (ele.key === key) {
              node = ele
              position = i
              f = true

              break
            } else {
              loop(ele)
            }
          }
        }
      }
    }
  }

  return { node, position }
}
```

有以上工具函数的支持，释放元素的操作如：

```js
handleDrop = (d, cn, position, rowIndex) => e => {
  prevent(e)

  if (!from.isEditorBlock) {
    // Fix remove the influence of other draggable elements.
    return
  }

  document.querySelector(`.${cn}`).style.background = 'transparent'

  // 判断drop元素是否为拖拽元素的子元素或者元素本身
  if (this.findSubKey(this.pageData, from.key, d.key)) {
    return
  }

  // 行元素单独处理
  const dropParentNode = this.findNode(d.parent).node
  const rowNode = this.findNode(dropParentNode.parent).node

  // 父亲是列并且自身无子元素同时列所在的行只有一列 列的子元素只有一个 此时判断为新增一行
  if (
    dropParentNode.type === 'column' &&
    // !(d.children && d.children.length) && // 子元素拖拽自身至父亲行元素时不满足
    rowNode.children &&
    rowNode.children.length === 1 &&
    rowNode.children[0].children &&
    rowNode.children[0].children.length === 1
  ) {
    const fromParentNode = this.findNode(from.parent).node

    const deleteFromNodeKey =
      fromParentNode.type === 'column' ? fromParentNode.key : from.key

    this.deleteNode(this.pageData, deleteFromNodeKey)

    // 由于单独处理行，所以需要先删除原可能为空的行节点，避免造成释放位置的影响
    // deleteNode 只会将命中的子节点删除，所以源节点若已经没有子元素为空时候释放位置会造成干扰
    // 此处先行删除空的行再 splice 插入新行
    this.deleteNullRow()

    const gId = Date.now()

    const columnKey = `${gId}-sub`

    from.parent = columnKey

    this.pageData.splice(rowIndex, 0, {
      type: 'row',
      key: gId,
      children: [
        {
          type: 'column',
          parent: gId,
          key: columnKey,
          children: [from]
        }
      ]
    })
  } else {
    const k = d.type === 'txt' ? d.parent : d.key

    this.deleteNode(this.pageData, from.key)
    this.insertNode(this.pageData, k, from, position)
  }

  this.jsonRending()
}
```

### 输入

需要实现文本节点的输入行为以及光标聚焦时的键盘行为。

用户输入时，需要将文本框的内容及时同步到 `this.pageData` 上。

```js
debounceContentInput = item => e => {
  prevent(e)

  const loop = ele =>
    ele.children.some(data => {
      if (data.key === item.key) {
        data.content = document.querySelector(`#id-${item.key}`).innerText

        return true
      } else if (data.children) {
        loop(data)
      }

      return false
    })

  this.pageData.forEach(row =>
    row.children.forEach(column =>
      column.children.some(ele => {
        if (ele.key === item.key) {
          ele.content = document.querySelector(`#id-${item.key}`).innerText

          return true
        } else if (ele.children) {
          loop(ele)
        }

        return false
      })
    )
  )
}
```

同时为避免页面更新的 render 行为过于频繁使用防抖函数进行包装。

```js
// debounce user's typing
handleContentInput = item => debounce(this.debounceContentInput(item), 300)
```

光标行为，聚焦在指定节点的段尾或者段首。

```js
moveCursor = (id, trail = true) => {
  setTimeout(() => {
    const dom = document.querySelector(`#id-${id}`)

    try {
      dom.focus()

      if (trail) {
        const range = window.getSelection()

        range.selectAllChildren(dom)
        range.collapseToEnd()
      }
    } catch (e) {}
  }, 10)
}
```

#### 退格

Notion 中退格操作：光标元素非当前兄弟元素的最后一个元素（既当前元素没有下一个兄弟元素）则当前元素退格至父元素所在级别
否则将当前元素和上一个兄弟元素的内容拼接，该节点的子元素变为父元素所在级别，涉及的修改指定 key 的节点内容以及子元素，同时根据不同情况（如行列节点处理、修改内容、修改子节点插入指定位置等）进行自定义处理。

```js
// 修改指定key的content
modifyJsonAccording2SpecificKey = (
  key,
  {
    modifyContent,
    modifyChildren,
    content,
    children,
    isColumn,
    insertChildrenBefore,
    position
  }
) => {
  const loop = ele =>
    ele.children &&
    ele.children.length &&
    ele.children.map(item => {
      if (item.key === key) {
        // 修改指定key文本
        if (modifyContent) {
          item.content += content
        }

        // 修改指定key的子元素
        if (modifyChildren) {
          if (isColumn) {
            // 如果是列元素 列本身不包含内容 处理列元素的子元素添加节点
            item.children[0].children = [
              ...(item.children[0].children || []),
              ...this.modifyParent(children, item.children[0].key)
            ]
          } else if (typeof position === 'number') {
            item.children.splice(
              position + 1,
              0,
              ...this.modifyParent(children, item.key)
            )
          } else {
            item.children = insertChildrenBefore
              ? [
                  ...this.modifyParent(children, item.key),
                  ...(item.children || [])
                ]
              : [
                  ...(item.children || []),
                  ...this.modifyParent(children, item.key)
                ]
          }
        }
      } else if (item.children && item.children.length) {
        loop(item)
      }

      return item
    })

  this.pageData.forEach(row => {
    loop(row)
  })
}
```

批量修改节点的父亲。

```js
modifyParent = (arr, key) => arr.map(item => ({ ...item, parent: key }))
```

定义全局变量 `focusDivContent` 用于确定光标是否在句首， 定义全局变量 `globalItem` 存储聚焦所在文本块的节点对象，定义全局对象 `focusPosition` 存储光标所在节点在同级元素所在索引。

```js
let focusDivContent = '' // 当前聚焦的编辑框文本
let globalItem = {} // Global item
```

文本框聚焦时更新 `globalItem`、`focusPosition`。

```js
handleContentFocus = (item, position) => e => {
  prevent(e)

  globalItem = item

  focusPosition = position
}
```

键盘按下时更新 `focusDivContent`。

```js
handleContentKeyDown = (item_, rowIndex_, itemIndex_) => e => {
  const item = globalItem

  // 退格操作
  if (e.keyCode === 8) {
    e.persist() // preventDefault 会禁止删除

    const cursorDOM = document.querySelector(`#id-${item.key}`)

    focusDivContent = cursorDOM.innerText // 全局变量存储聚焦文本
  }
}
```

根据指定节点 找最深子节点的 key。

```js
// 寻找指定key最后的子元素 用于光标聚焦
findLastKeyAccording2SpecificKey = item => {
  let key = item.key

  const loop = ele => {
    const last = ele.children[ele.children.length - 1]

    key = last.key

    if (last.children && last.children.length) {
      loop(last)
    }
  }

  if (item.children && item.children.length) {
    loop(item)
  }

  return key
}
```

需要寻找上一个兄弟元素的最后一个子元素的位置，用于确定光标退格变更的位置。

```js
findPreviousSiblingLastSubKey = param => {
  const currentKey = param.key
  let prevKey = param.parent

  const loop = item =>
    item.children.forEach((it, j) => {
      if (it.key === currentKey) {
        if (j) {
          // prevKey = item.children[j - 1].key
          prevKey = this.findLastKeyAccording2SpecificKey(item.children[j - 1])
        }
      }

      if (it.children && it.children.length) {
        loop(it)
      }
    })

  this.pageData.forEach((row, i1) => {
    row.children.forEach((column, i2) => {
      column.children.forEach((item, i3) => {
        if (item.key === currentKey) {
          if (i3) {
            prevKey = this.findLastKeyAccording2SpecificKey(
              this.pageData[i1].children[i2].children[i3 - 1]
            )
            // prevKey = this.pageData[i1].children[i2].children[i3 - 1].key
          }

          if (!i3 && i1) {
            prevKey = this.findLastKeyAccording2SpecificKey(
              this.pageData[i1 - 1]
            )
          }
        }

        if (item.children && item.children.length) {
          loop(item)
        }
      })
    })
  })

  return prevKey
}
```

综上退格行为如下：

```js
handleContentKeyUp = (item, itemIndex, allItemsCount) => e => {
  // 退格操作
  if (e.keyCode === 8) {
    const cursorDOM = document.querySelector(`#id-${item.key}`)
    const currentContent = cursorDOM.innerText

    // 未删除 光标在首部
    if (focusDivContent === currentContent) {
      // 此时考虑当前节点是否有上级 有的话退格至上级 否则删除该节点 移动光标至临近的上一个元素
      const originParentNode = this.findNode(item.parent).node

      if (originParentNode.type !== 'column') {
        // 元素非当前兄弟元素的最后一个元素（既当前元素没有下一个兄弟元素）则当前元素退格至父元素所在级别
        // 否则将当前元素和上一个兄弟元素的内容拼接 该节点的子元素变为父元素所在级别
        const changeParentNode = this.findNode(originParentNode.parent).node

        if (itemIndex < allItemsCount - 1) {
          const previousKey = this.findPreviousSiblingLastSubKey(item)

          this.moveCursor(previousKey) // 移动光标至临近的上一个元素

          this.modifyJsonAccording2SpecificKey(previousKey, {
            modifyContent: true,
            content: currentContent
          })

          if (item.children && item.children.length) {
            this.modifyJsonAccording2SpecificKey(item.parent, {
              modifyChildren: true,
              position: itemIndex,
              children: item.children
            })
          }
        } else {
          // 当前退格元素不存在兄弟元素 当前元素是所在兄弟元素列表的最后一个元素
          // itemIndex === allItemsCount - 1
          // 此时需要确定变为父亲所在级别的插入位置，索引即为父元素所在索引的下一个
          const gId = Date.now()
          const { position } = this.findNode(item.parent)

          this.modifyJsonAccording2SpecificKey(changeParentNode.key, {
            modifyChildren: true,
            position,
            children: [
              {
                ...item,
                // 需要更新key 避免和源节点重复 便于删除
                key: gId
              }
            ]
          })

          this.moveCursor(gId, false)
        }
      } else {
        // 父亲是列元素
        // 直接退格至上一级兄弟元素上 内容拼接至段尾
        const previousKey = this.findPreviousSiblingLastSubKey(item)

        this.moveCursor(previousKey) // 移动光标至临近的上一个元素

        this.modifyJsonAccording2SpecificKey(previousKey, {
          modifyContent: true,
          content: currentContent
        })

        // 如果存在子元素 则子元素变为父亲所在层级
        if (item.children && item.children.length) {
          this.modifyJsonAccording2SpecificKey(item.parent, {
            modifyChildren: true,
            position: itemIndex,
            children: item.children
          })
        }
      }

      this.deleteNode(this.pageData, item.key) // 删除该节点

      this.jsonRending() // render
    }
  }
}
```

#### 回车 & shiftKey+enter

回车用于截断文本，将当前节点文本分割，分离的文本根据不同的场景作为下一个兄弟节点或者子节点的内容。

截断文本需要判断光标当前所在位置，大多方法均有 bug，曲线救国如下：

```js
function escape2Html(str) {
  const arrEntities = { lt: '<', gt: '>', nbsp: ' ', amp: '&', quot: '"' }

  return str.replace(/&(lt|gt|nbsp|amp|quot);/gi, (all, t) => arrEntities[t])
}

// 该函数仅用于回车分割文本，在退格操作使用时存在光标位置自动跳首部而无法删除的bug
getCursorSplitTxt = dom => {
  // 曲线救国 使用插入var（随意替代）节点作为标记来确定光标位置
  const varTag = '<var></var>'
  const range = window.getSelection().getRangeAt(0)
  const span = document.createElement('var')
  span.innerHTML = ''
  range.insertNode(span)

  // 带有标记var标签的文本
  const tempAllContentString = dom.innerHTML

  // dom删除用于标记的标签
  dom.innerHTML = tempAllContentString.replace(varTag, '')

  // 光标所在之前的文本和之后的文本
  const [beforeTxt, afterTxt] = tempAllContentString.split(varTag)

  return {
    before: escape2Html(beforeTxt),
    after: escape2Html(afterTxt)
  }
}
```

同时当用 `shift` 和 `enter` 键一起按下的时候需要进行额外的判断：则将回车截断的内容创建新节点，若所在元素存在子元素，原子元素变更为新节点的子元素，新节点作为当前元素的下一个兄弟元素插入。

具体行为逻辑以及注释如下：

```js
handleContentKeyDown = (item_, rowIndex_, itemIndex_) => e => {
  const item = globalItem

  if (e.keyCode === 13) {
    prevent(e) // 此处仅禁止回车的默认行为 问题根源...

    // 获取光标分割的文本
    const {
      before: originContentString,
      after: enterContentString
    } = this.getCursorSplitTxt(document.querySelector(`#id-${item_.key}`))

    let domId = ''

    const loop = ele => {
      ele.children.forEach((data, dataIndex) => {
        if (data.key === item.key) {
          const id = Date.now()

          domId = id

          // 光标截断的文本
          data.content = originContentString // 截取后的

          const obj = {
            type: 'txt',
            key: id,
            parent: ele.key,
            content: enterContentString
          }

          // 添加为子元素
          if (data.children && data.children.length) {
            // shift enter 组合键
            if (e.shiftKey) {
              // 新节点
              const tempNode = {
                ...cloneDeep(data),
                content: enterContentString,
                key: id,
                children: this.modifyParent(data.children, id)
              }

              // 原节点
              data.content = originContentString

              // 原节点子元素转移至新节点 自身清空
              data.children = []

              this.modifyJsonAccording2SpecificKey(data.parent, {
                modifyChildren: true,
                children: [tempNode],
                // 元素插入位置
                position: dataIndex
              })

              return
            }

            obj.parent = data.key

            data.children.splice(0, 0, obj)

            return
          }

          // 添加为同级元素
          ele.children.splice(focusPosition + 1, 0, obj)
        } else if (data.children) {
          loop(data)
        }
      })
    }

    this.pageData.forEach((row, rowIndex) =>
      row.children.forEach(column =>
        column.children.forEach((ele, elePosition) => {
          if (
            ele.key === item.key &&
            // this.pageData[rowIndex].children.length > 1 &&
            !(ele.children && ele.children.length)
          ) {
            // 列单元素 回车添加同级元素
            domId = Date.now()

            const parentNode = this.findNode(ele.parent).node

            // 光标截断的文本
            ele.content = originContentString

            this.modifyJsonAccording2SpecificKey(parentNode.key, {
              modifyChildren: true,
              position: elePosition,
              children: [
                {
                  type: 'txt',
                  key: domId,
                  parent: ele.parent,
                  content: enterContentString
                }
              ]
            })
          } else if (
            ele.key === item.key &&
            !(ele.children && ele.children.length) &&
            this.pageData[rowIndex].children.length <= 1 &&
            this.pageData[rowIndex].children[0].children &&
            this.pageData[rowIndex].children[0].children.length <= 1
          ) {
            // got it enter column key
            /**
             * 当前行有子元素则创建子元素并且非所在行非单列
             * 否则新起一行
             */

            const keyId = Date.now()

            // 光标截断的文本
            ele.content = originContentString

            domId = `sub-sub-${keyId}`

            this.pageData.splice(rowIndex + 1, 0, {
              type: 'row',
              key: keyId,
              children: [
                {
                  type: 'column',
                  parent: keyId,
                  key: `sub-${keyId}`,
                  children: [
                    {
                      type: 'txt',
                      key: domId,
                      parent: `sub-${keyId}`,
                      content: enterContentString
                    }
                  ]
                }
              ]
            })
          } else if (
            ele.key === item.key &&
            ele.children &&
            ele.children.length
          ) {
            // 当前行有子元素则创建子元素
            const keyId = Date.now()

            // shift enter 组合键
            if (e.shiftKey) {
              // 新节点
              const tempNode = {
                ...cloneDeep(ele),
                content: enterContentString,
                key: keyId,
                children: this.modifyParent(ele.children, keyId)
              }

              // 原节点
              ele.content = originContentString

              // 原节点子元素转移至新节点 自身清空
              ele.children = []

              this.modifyJsonAccording2SpecificKey(ele.parent, {
                modifyChildren: true,
                children: [tempNode],
                // 元素插入位置
                position: elePosition
              })

              // 更新光标位置
              domId = keyId

              return
            }

            // 非组合键
            // 光标截断的文本
            ele.content = originContentString

            domId = `sub-${keyId}`

            ele.children.unshift({
              type: 'txt',
              key: domId,
              parent: ele.key,
              content: enterContentString
            })
          } else if (ele.children) {
            loop(ele)
          }
        })
      )
    )

    this.jsonRending(() => {
      // render 后延迟触发
      // 光标不需要移动至末尾
      this.moveCursor(domId, false)
    })
  }
}
```

### Tab 行为

将子元素转为上一个临近元素的子元素的 trigger 需要满足：

1. 当前元素所在列表中非首个元素
2. 当前元素父亲是列元素时，父亲的同级上一个兄弟元素所在行仅可以由一个子元素列 列中仅一个子元素

定义寻找上一个节点的工具函数。

```js
findPreviousSiblingKey = key => {
  let siblingKey

  const loop = ele =>
    ele.children &&
    ele.children.length &&
    ele.children.forEach((item, i) => {
      if (item.key === key) {
        if (i) {
          siblingKey = ele.children[i - 1].key
        } else {
          // 由于存在行列的特殊块原因
          // 此时说明当前块只存在一个元素 没有上一个兄弟元素
        }
      } else {
        loop(item)
      }
    })

  this.pageData.forEach((row, i1) => {
    if (row.key === key) {
      if (i1) {
        siblingKey = this.pageData[i1 - 1].key
      }
    } else {
      row.children.forEach((column, i2) => {
        if (column.key === key) {
          if (i2) {
            siblingKey = row.children[i2 - 1].key
          }
        } else {
          loop(column)
        }
      })
    }
  })

  return siblingKey
}
```

Tab 行为逻辑以及注释如下：

```js
handleContentKeyDown = (item_, rowIndex_, itemIndex_) => e => {
  const item = globalItem

  // Tab操作转子元素
  if (e.keyCode === 9) {
    prevent(e)

    const parentNode = this.findNode(item.parent).node

    // 非 列下首个元素
    if (parentNode.type !== 'column' && !itemIndex_) {
      return
    }

    let previousKey = this.findPreviousSiblingKey(item.key)

    // 由于存在行列的特殊块原因
    // 当前块可以只存在一个元素 没有上一个兄弟元素
    if (!previousKey) {
      // 上一行是多列 禁止tab行为
      console.log('// 上一行是多列 禁止tab行为')
      if (this.pageData[rowIndex_ - 1].children.length > 1) {
        return
      }
    }

    if (!previousKey) {
      // 选择上一行
      if (rowIndex_) {
        const prevRowFirstColumn = this.pageData[rowIndex_ - 1].children[0]

        previousKey =
          prevRowFirstColumn.children[prevRowFirstColumn.children.length - 1]
            .key
      }
    }

    if (!previousKey) {
      return
    }

    // 删除该节点
    this.deleteNode(this.pageData, item.key)

    // 将当前元素设置为临近的上一级元素的子元素
    this.modifyJsonAccording2SpecificKey(previousKey, {
      modifyChildren: true,
      // 列元素取行，深层子元素判断是否已经存在子节点
      // isColumn,
      children: [item]
    })

    this.jsonRending(() => {
      this.moveCursor(item.key, false)
    })
  }
}
```

至此文本块的基本行为大致实现，最后再实现页面初始化的文本框，用于创建节点以及与已经创建的节点进行光标关联。

```jsx
<div
  id="id-editor-box"
  className="id-editor-box"
  contentEditable="true"
  onKeyDown={this.handleEditorKeyDown}
></div>
```

事件行为：

```js
insertNewRow = editorDom => {
  const id = Date.now()

  const content = editorDom.innerText

  this.pageData.push({
    type: 'row',
    key: id,
    children: [
      {
        type: 'column',
        parent: id,
        key: `sub-${id}`,
        children: [
          {
            type: content.includes('list') ? 'list' : 'txt',
            key: `sub-content-${id}`,
            parent: `sub-${id}`,
            content
          }
        ]
      }
    ]
  })

  editorDom.innerText = ''

  this.setState({
    pageData: this.pageData
  })
}

handleEditorKeyDown = e => {
  // 退格
  if (e.keyCode === 8) {
    this.moveCursor(
      this.findLastKeyAccording2SpecificKey(
        this.findNode(this.pageData[this.pageData.length - 1].key).node
      )
    )
  }

  // 回车
  if (e.keyCode === 13) {
    prevent(e)

    this.insertNewRow(editorDom)
  }
}
```

### End

文本块作为 Notion 的核心块，基本功能如上。

关于拖拽行为虽然做了排序处理但是并不完善，缺乏更精细化的行为，如拖拽到指定元素的指定位置（上、下）以及拖拽到右侧进行创建新列，由于不属于释放元素的监听区域具体实现的技术方案还没确定，预想是通过光标位置像素计算，后续更新。

情人节快乐。
