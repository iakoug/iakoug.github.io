---
date: 2021-01-19
title: Block editor (To be continue...)
template: post
thumbnail: "../thumbnails/post.png"
slug: block-editor
categories:
  - structure
tags:
  - structure
---

Block editor.

---

# 基本概念

区分于传统的富文本编辑器，定义块的概念，编辑区内每部分内容由**块**拼接而成

从作用上分为内容块和结构块

### 内容块

用来展示内容，作为页面内容的载体

- 普通文本
- 列表（有序、无序、待办、折叠）
- 标题（多级）
- 引用
- 分割线
- 代码块
- 页面
  ...

### 结构块

用来固定页面的结构，作为页面内容的骨架

- 行
- 列
- 页面

> 页面块时一个特殊的容器，本身是内容的一部分，同时也是作为结构承载级联的内容

### 关于行列页面的结构的简单规范

1. 页面块可以成为任意节点的子节点同时是当前编辑器页面的根节点出现
2. 行列结构块的定义出于美观和数据结构规范不允许嵌套（当然也是可以嵌套）
3. 行块仅能作为当前页面（参见第一条）的子节点出现，不允许成为其他类型块的子节点
4. 列块仅能作为行块的子节点出现，不允许成为其他类型块的子节点

### 基本块

```ts
type BaseType = "page" | "bullet-list" | "order-list" | "text"| "code" | "hr" | "quote"; // ...

interface BaseBlock {
  type: BaseType;
  parent_type: BaseType | 'column';
  id: string;
  parent_id: string;
  content: string;
  children?: BaseBlock[];
  ...
}
```

### 列

```ts
interface Column {
  type: "column";
  parent_type: 'row';
  id: string;
  parent_id: string;
  children: BaseBlock[];
  ...
}
```

### 行

```ts
interface Row {
  type: "row";
  parent_type: 'page';
  id: string;
  parent_id: string;
  children: Column[];
  ...
}
```

# 设计流程草图

![](../postImgs/block-editor-structs.png)

# 编辑区

### contentEditable

- dangerouslySetInnerHTML

### 快捷输入菜单匹配

- 兼容中文输入法

### 获取光标位置

```ts
const getSelectionCoords = () => {
  const doc = window.document;
  let sel,
    range,
    rects,
    rect,
    x = 0,
    y = 0;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.rangeCount) {
      range = sel.getRangeAt(0).cloneRange();
      if (range.getClientRects) {
        range.collapse(true);
        rects = range.getClientRects();
        if (rects.length > 0) {
          rect = rects[0];
        }
        x = rect?.left;
        y = rect?.top;
      }
      if ((x === 0 && y === 0) || rect === undefined) {
        const span = doc.createElement("span");
        if (span.getClientRects) {
          // Ensure span has dimensions and position by
          // adding a zero-width space character
          span.appendChild(doc.createTextNode("\u200b"));
          range.insertNode(span);
          rect = span.getBoundingClientRect();
          x = rect?.left;
          y = rect?.top;
          const spanParent = span.parentNode;
          spanParent.removeChild(span);

          // Glue any broken text nodes back together
          spanParent.normalize();
        }
      }
    }
  }
  return { xPos: x, yPos: y };
};

const setCursorPosByCoords = (ele, x, y) => {
  let range, node, offset;
  if (document.caretPositionFromPoint) {
    range = document.caretPositionFromPoint(x, y);
    if (range) {
      node = range.offsetNode;
      offset = range.offset;
      this.setCursorPos(node, offset);
      ele?.focus(); // 有些场景下，新建node节点的事件会无法触发，需要手动focus
    }
  }
};

// 定位光标 此外需要针对不同块的dom结构进行适配
const setCursorPos = (startNode, offset) => {
  const selection = document.getSelection();
  const range = document.createRange();
  range.setStart(
    startNode,
    !startNode.length || startNode.length > offset ? offset : startNode.length
  );
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
};
```

### render 输入的文本

# Transform

将扁平结构转为树形结构

```ts
// 伪代码
const transform = (type, ...) => {
  switch (type) {
    case 'init': return { children: transform('row', ...) }
    case 'row': return transform('column', ...)
    case 'column': return transform('node', ...)
    case 'node': return transform('node', ...)
  }
}
```

# Render

```tsx
// 伪代码
class App {
  renderNode = () => <></>;
  renderColumn = () => this.renderNode();
  renderRow = () => this.renderColumn();
  renderPage = () => this.renderRow();
  render = () => this.renderPage();
}
```

# Markdown

- 将多行字符串分割成

# Undo redo

# 拖拽释放

# IndexDB

# push

```

```
