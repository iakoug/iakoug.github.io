---
date: 2019-12-24
title: Group sharing - 工作和生活常用工具分享
template: post
thumbnail: '../thumbnails/apple.png'
slug: yqb-tools-sharing
categories:
  - Tools
tags:
  - env
---

> Powered by [徐明嵩](https://github.com/vipic)；EmailTo [mailto://xumingsong294@pingan.com.cn](mailto://xumingsong294@pingan.com.cn)

---

# Postman

Postman 官网说明它是一个可以多人合作的 api 开发工具。但在我们眼里，它是一个不依赖具体使用场景，可以方便的修改参数验证接口是否可用的一个工具。

> The Collaboration Platform for API Development

![1.png](https://i.loli.net/2019/12/25/klfo9cTjG6giAKh.png)

### **主页面**

主页面包含接口列表，请求部分和响应部分三个模块。几乎所有内容都可以在主页面这个框框内操作完成。

**接口列表**是当前应用的接口收集，可以按照各自的分类标准统一管理。

**请求部分**包括发送请求的方法，请求路径，请求头，请求体等，也可以设定环境变量，可以通过右上角的 tab 切换来使用不同环境预设的不同参数。

**响应部分**包包含服务器返回的响应头，响应体等部分。

在我们的工作流程里，重点关注的是响应部分的内容是否符合逾期，但是涉及我们调整的模块主要集中在请求部分。

### **请求部分**

1. method: 可以设置常见的 GET，POST 等
2. 请求路径: 请求地址，支持变量。
3. 环境配置: 针对不同环境可以写入不同的配置信息，也可以在不同环境变量外保存一份全局变量。变量信息使用是双大括号包裹，类似 angular1，{{param}}

   https://sm.ms/image/xGskedZmofpDtyq

   - 初始值，字面意思。
   - 当前值，新增的话当前值会自动补充为初始值，使用中均是使用当前值。PersistAll 使用当前值覆盖初始值，ResetAll 使用初始值覆盖当前值。

4. 变量使用及请求内容编写: 变量可以使用在请求地址、params、header、body 中。所有请求参数均是 key/value 形式，body 中一般选择 raw 和 json 方便编写。

   ![3.png](https://i.loli.net/2019/12/25/SvcQgF8JdTD3zVm.png)

   1. 请求方法
   2. 请求地址
   3. 环境信息
   4. 请求体

### 想要调试可以在菜单中打开控制台

View -> Show Postman Console

# Charles

Charles 是一个描述很长的工具，可以查看你的机器和服务器间通信的信息，并且可以在应用发送前以及应用接收前修改请求，实现开发和调试。

> Charles is an HTTP proxy / HTTP monitor / Reverse Proxy that enables a developer to view all of the HTTP and SSL / HTTPS traffic between their machine and the Internet.

### **主页面**

![4.png](https://i.loli.net/2019/12/25/BPS9rMJiAZ7VcpQ.png)

主页面类似 postman 布局，左侧接口列表，右侧上方是请求信息，右侧下方是响应信息。这个应用在应用主页面外还要依赖菜单的一些功能。

如果要查看本机 HTTPS 请求，需要本机安装证书。移动设备和模拟器调试也要安装证书。安装证书方法在菜单里 Help -> SSL Proxying -> Install ...

如果左侧 Structure 里没有任何接口捕获尝试先启动 charls，再启动想要调试的程序。电脑端还是没有内容的话，关闭自己的代理工具，菜单 Proxy -> macOS Proxy 看看是否开启。

### **功能介绍**

1. 抓包，查看日志以及调试。

   1. http 请求直接查看。[测试地址](http://p1.yqbimg.net/youqian/jieqian/domainList.json)
   2. https 请求需要安装证书后右键单击要查看的接口，选择 Enable SSL Proxying [测试地址](https://m.yqb.com/banker/#/index)
   3. 在查看的基础上可以修改请求和响应。

      1. 单次修改: 每次接口发送和接收的过程中进入断点，完成修改。Breakpoints，接口右键单击鼠标勾选，菜单 Proxy -> Disable Breakpoints (⌘Command+K)，菜单 Proxy -> Breakpoings Settings (⇧Shift+⌘Command+K)
      2. 持久化修改: 菜单 Tools -> Rewrite (⌥Option+⌘Command+R) 设置规则。针对域名(一般复制接口整体地址进去就行)添加规则。规则介绍下 add header 和修改 body

         ![5.png](https://i.loli.net/2019/12/25/6kAWRUtdXOCwTGS.png)

2. 模拟不同网速网络情况。菜单 Proxy -> Throttle Settings (⇧Shift+⌘Command+T) 常用在基于此配置做了优化前后的对比。
3. 移动端调试。手机使用电脑代理网络请求。之后操作同电脑

### 其他

1. 聚焦，只关注关注的请求。
2. 重复，将此请求重新发起一遍，方便断点或者变更配置后再次验证。
3. 映射，菜单 Tools -> Map Rmote/Map Local(⌥Option+⌘Command+M/L)将当前资源映射为本地或者远程其他资源。可以在真实设备真实环境不发布项目但使用新的文件。

### **破解方式**

目前我是基于 4.2 版本来破解。提示升级后升级到此版本。破解状态还在。

**// Charles Proxy License**

**// Charles 4.2 目前是最新版，可用。**

**Registered Name: [https://zhile.io](https://zhile.io/)**

**License Key: 48891cf209c6d32bf4**

### 了解更多

学习网络协议的时候可以使用 Wireshark，charles 只暴露了网络协议的一部分，Wireshark 可以查看更多协议。

# TextExpander

将特定短输入映射为长输入，可以实现常用信息的快速输入。

有 Suggestions（建议）这个功能，当输入内容是你常用的输入时提示你设置为一个片段。

启用替换功能的条件，一般采用设置的别名输入完成就触发。

![6.png](https://i.loli.net/2019/12/25/GNJqlMcISnKQjaA.png)

ios 设备也有文本替换，命中输入规则后会提示替换为设定的文字。例如 msd=马上到！，ios 这个文本替换不足的是没有变量填充与标签，类似缺少一个 describe 的字段来解释当前。

![7.png](https://i.loli.net/2019/12/25/ZIemtoPiylNrJhK.png)

## 主要**功能:**

1. 使用缩写替换为具体内容
2. 插入变量，例如年月日时分秒，还可以做时间的加减，特定按键，移动光标，获取剪贴板，甚至另外一条片段
3. 执行代码，支持 shell，appleScript，javaScript

### 常见片段

1. 路径类，常见配置文件位置
2. 常用信息类，个人信息或者公司信息
3. 特定场景缩写，例如 px2rem 方法和登记工时
4. 常用操作及命令，例如 git 比对文件变更、删除文件夹命令

   也可以使用 alias 替换 例如 gst 和 ll(Oh-My-Zsh 的配置: subl ~/.oh-my-zsh/plugins/git/git.plugin.zsh)

5. 特殊需求，中文标点
6. 模板，周报模板
7. 下载好 TE 自带的例子，例如写文件注释文件创建时间等

aText，不支持 js

### [解决中文无法唤起 TE 的方法](https://sspai.com/post/35502)

# Paste

保留剪贴板的历史，包括富文本，文件等

默认会提示你当成一个类似 TE 的东西来用，就是这个 usefullinks

通过安装 helper 可以实现选中即输入，否则是填充进剪贴板，还要额外按一次粘贴

⌘Command+⇧Shift+V 比粘贴操作做了个 ⇧Shift 按钮就可以查看粘贴版

![8.png](https://i.loli.net/2019/12/25/MvG4IZljUz5rktT.png)

### **常见使用场景**

一次复制多个条目，然后在 paste 里切换再次粘贴出来，不用切换多个 app 复制。

支持回溯的历史记录。

安装 helper 支持直接复制

# 1password

跨平台的密码管理工具，只记住一个主密码就行了。其余的密码交给他来生成和记录。防止撞库，防止记错，还有检查密码是否泄露的功能，检查重复密码。

- 保存登录账号和密码
- 保存私人信息，类似银行卡信息
- 保存软件激活码

Mac 端没有付费前只有查看功能。

## **生成密码**

IOS 端演示手机创建密码。

可以使用 dropbox 同步。

## **使用密码**

电脑端，启动 mini，或者通过插件。

⌘Command+\ 启动，之后可以直接到密码所在位置，或者自己搜索。

⌥Option 可以查看密码内容。

iPhone，系统设置配置使用 1pass 后刷脸。

### **常见使用场景**

保存各个网站的账号和密码，个人不常用的银行卡信用卡信息，不常用的软件许可信息。

[了解更多](https://sspai.com/post/35195)

_[更多密码管理工具介绍](https://www.waerfa.com/9-mac-password-manager-for-macos-cross-criticism)_

# Alfred

快速启动工具。常用工具集合。

![9.png](https://i.loli.net/2019/12/25/v4De9WZuNQoLshE.png)

## **常用功能**

1. 启动器
2. 计算器
3. 词典 (di + 搜索单词)
4. largeType(⌘Command+L)
5. 片段，感觉是可以替换 TE 的功能，但我没有使用，支持从剪贴板获取多个，比 TE 多
6. 直接启动 iterm2 [applescript](https://github.com/stuartcryan/custom-iterm-applescripts-for-alfred/blob/master/custom_iterm_script_iterm_3.1.1.applescript)

### **workflow 是个有想象空间的功能**

- template 里的演示功能，一次在不同网站搜索电影

# Surge

网络代理工具，可以 FQ 也可以针对特定域名做特定处理。FQ 之外还可以用来屏蔽广告

没有找到比这个软件体验更好的 app，但是这个价格还很高。

可以设置规则特定域名走代理，非规则内的直连，特定规则内的屏蔽。

# PPDuck

图片压缩工具，免费版一次可以压缩 10 张，有选择替换原文件功能，没有 tinypng 的大小限制。

# Keyboard Maestro

可以实现模块化拼接完成自己想要的东西，自己研究下，后续我再补充。类似 ios 上的**捷径(IOS 上比较有意思的 app，一个捷径，一个 IFTTT)**。

目前可以定制输入法切换。

# Karabiner-Elements

研究也不多，后续可以补充。可以实现改键，也可以实现某个按键单独点击是一个意思，和其他按键组合是另外一个意思。还可以实现按一个按键切换到特定输入法，例如做 cmd 是中文，右 cmd 是英文，做 shift 是俄语等。

# Go2Shell

可以在 finder 里快速打开 iterm

# Itsycal

状态栏显示日历，不用打开日历程序，点击状态栏就可以查看日历，方便评估开发周期等等。

# 微信小助手

安装方式见 [github 地址](https://github.com/lmk123/oh-my-wechat)

主要功能，当前电脑退出没有切换电脑登录不需要手机认证，防止撤回。其他功能见 github 介绍

# chrome 插件

## cVim

chrome 插件，可以用键盘控制浏览器，手不用离开键盘。

帮助文档: [chrome-extension://ihlenndgcmojhcghmfjfneahoeklbjjh/pages/options.html](chrome-extension://ihlenndgcmojhcghmfjfneahoeklbjjh/pages/options.html)

## ADBlock Plus

屏蔽广告

配置信息: [chrome-extension://cfhdojbkjhnklbpkdaibdccddilifddb/options.html](chrome-extension://cfhdojbkjhnklbpkdaibdccddilifddb/options.html)

## **Stylus**

定制网站样式，通过伪类改变网站内容

结合 surge，adBlockPlus 和 stylus，把网站非关键信息全部干掉了。

## Suspicious Site Reporter

使得 chrome 显示 https 和 www
