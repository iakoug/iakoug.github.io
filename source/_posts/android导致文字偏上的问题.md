---
title: android导致文字偏上的问题
tags:
  - 可以公开的情报
  - 开发
  - 前端
  - android
  - line-height
  - font-size
date: 2018-12-04 18:17:35
categories:
---
# 问题
![](https://upload-images.jianshu.io/upload_images/1401034-3d1a4becc0dbd1bc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/670/format/webp)
移动端android有时候总是不居中，经过搜索，大概就是因为webview不支持奇数字号 例如
```
.class {
   line-height: 13px;
   font-size: 13px;
}
```
或者(rem可能生成的字号为奇数)
```
.class {
   line-height: 5rem;
   font-size: 5rem;
}
```

# 解决方案
## scale
```
    font-size: 26px; // *2
    transform: scale(.5);
```

## table布局(flex 同理)
```
    display: table-cell;
    text-align: center;
    vertical-align: middle;
```

## line-height
```
    line-height: normal;
```