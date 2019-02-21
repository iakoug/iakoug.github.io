---
title: vscode插件分享
tags:
  - 笔记
  - 学习
  - 记录
  - vscode
date: 2018-11-09 10:26:22
categories: 开发的捷径
---
# VSCODE的插件系列
> 使用vscode进行开发怎么能少的了插件呢  

[![](https://badge.juejin.im/entry/5be530546fb9a049f153b37f/likes.svg?style=flat-square)](https://juejin.im/post/5be53004f265da615b70f7a0)

丰富的插件让vscode更加好用 顺便推荐图床[（图床地址）](https://sm.ms/)

# 美化插件
* background 给编辑器窗口加个背景！唯一的缺点是vscode会显示已损坏，当然啦，并不影响使用
![](https://i.loli.net/2018/11/09/5be524d44f7b0.png)
可以参考以下配置
```javascript
  "background.useDefault": false,
  "background.style": {
    "content": "''",
    "pointer-events": "none",
    "position": "absolute",
    "z-index": "99999",
    "width": "100%",
    "height": "100%",
    "background-position": "100% 90%",
    "background-size": "auto 60%",
    "background-repeat": "no-repeat",
    "opacity": 0.1
  },
  "background.customImages": [
    "背景图片地址1",
    "背景图片地址2",
    "背景图片地址3"
  ],
```

* carbon-now-sh 一个非常好看的代码截图工具 整合之后 选中然后快捷键就能截图啦 ![](https://i.loli.net/2018/11/09/5be5271f9c4e3.png)

# 开发辅助
## Debugger
* Debugger for Chrome 看名字就知道了
* open in browser 懒得开浏览器用的
* Quokka.js 实时计算，查看结果
![](https://quokkajs.com/assets/img/vsc1.gif)

## 路径补全以及包大小
* File Peek
* Import Cost 计算引入需要占用多大的地方
* Path Intellisense

## npm
* npm
* NPM-Scripts 方便运行脚本

## 格式化
* ESLint
* Prettier 格式化
* Vetur vue格式化以及相关配置
* Vue 2 Snippets

eslint 和 prettier配合使用，vue自动保存格式化的配置
```
  "vetur.format.defaultFormatter.html": "none", // 默认html的方法
  "eslint.autoFixOnSave": true, // 自动保存
  "eslint.validate": [
    {
      "language": "vue",
      "autoFix": true
    },
    {
      "language": "html",
      "autoFix": true
    },
    {
      "language": "javascript",
      "autoFix": true
    }
  ],
  "prettier.singleQuote": true, // ' or ""
  "prettier.semi": false, // 分号
  "prettier.eslintIntegration": true, // 走eslint
```

## 其他
* GitLens 比自带的git好用多了的git 还能显示xx行是谁什么时候提交的
* Settings Sync 同步设置到git上
**强烈推荐** 具体安装步骤可以参考[其他人的博客](https://blog.csdn.net/u012207345/article/details/78246623)
这里就写一下mac下的快捷键  
```
downloadSettings	    ⇧⌥D
extension.updateSettings    ⇧⌥U
```

最后送上我当前配置的gist，有需要的可以安装上setting sync后将创建的gist改成这个来自动获取插件哦
[gist 地址](https://gist.github.com/mizuka-wu/5c74462ce1620fd62af7beb88501d163)