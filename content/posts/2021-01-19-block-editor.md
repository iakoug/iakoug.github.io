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

# Intro

区分于传统的富文本编辑器，定义块的概念，编辑区内每部分内容由**块**拼接而成

从作用上分为内容块和结构块

# Blocks
![](../postImgs/Block editor page.png)

### Content block

用来展示内容，作为页面内容的载体

- 普通文本
- 列表（有序、无序、待办、折叠）
- 标题（多级）
- 引用
- 分割线
- 代码块
- 页面
  ...

### Structural block

用来固定页面的结构，作为页面内容的骨架

- 行
- 列
- 页面

> 页面块时一个特殊的容器，本身是内容的一部分，同时也是作为结构承载级联的内容

### Basic norm

1. 页面块可以成为任意节点的子节点同时是当前编辑器页面的根节点出现
2. 行列结构块的定义出于美观和数据结构规范不允许嵌套（当然也是可以嵌套）
3. 行块仅能作为当前页面（参见第一条）的子节点出现，不允许成为其他类型块的子节点
4. 列块仅能作为行块的子节点出现，不允许成为其他类型块的子节点

### Basic block

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

### Column

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

### Row

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

# Operations

# Transactions

# Work flow

![](../postImgs/Block editor work flow.png)

# 编辑区

### contentEditable

- dangerouslySetInnerHTML

### 获取光标位置

```ts
const sel = window.getSelection();
range = sel.getRangeAt(0).cloneRange();
range.collapse(true);
const { x, y } = range.getClientRects();

const setCursorPosByCoords = (ele, x, y) => {
  let range, node, offset;
  if (document.caretPositionFromPoint) {
    range = document.caretPositionFromPoint(x, y);
    if (range) {
      node = range.offsetNode;
      offset = range.offset;
      this.setCursorPos(node, offset);
    }
  }
};

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

![](../postImgs/Block editor undoRedo.png)

# 拖拽释放

# IndexDB

![](../postImgs/Block editor IndexDB.png)

# push
