---
date: 2020-03-11
title: 一次客户端请求携带 Cookie 的 🐛 - Cookie set Same-Site
template: post
thumbnail: '../thumbnails/cookie.png'
slug: cookie-same-site
categories:
  - Tools
tags:
  - cookie
  - browser
  - client
---

早上刚到公司发现昨晚还能运行的项目（前后端代码未变更）隔夜后无法登录了，“惊！一夜之间平安大厦遭贼，竟然对开发 GG 的电脑做了这个！”。

---

### Conjecture

开始觉得是哪儿开的代理影响了？关闭所有 Vpn、Chrome 相关插件，发现还是不行，试了 Safari 同样不行，以为不是相关外部因素影响的时候 FireFox 上竟然正常（早上暂时使用 FireFox 开发，丢弃持续使用几年的 Chrome 果然会少半条命）。<br />
同时产线所在域名发起的请求同样可以正常登录。<br />

到底哪儿出了问题？<br />

肯定就是登录态没有正确携带，那么登录态是如何存储的呢？登录态以 auth token 的形式由服务端返回到客户端默认自动注入到客户端发起请求所在的域的 Cookie 内。<br />

此时登录相关的获取验证码以及下发短信等接口都是正常，唯独最终登录的接口显示着状态码 200 却在 Response 那儿 Failed to load resource...<br />

使用 Postman 发起登录竟然成功了。<br />
Debugger 进登录接口所在位置可以正确获得响应报文。<br />
请求位置设置`withCredentials: true`，同时服务端响应头设置`Access-Control-Allow-Credentials: true`。<br />

到底哪儿出现问题？<br />

检查后端是否对登录接口的请求域名有进行限制，本地更换端口联调还是无果，日志一片绿色无丝毫报错。<br />

### Dawn

突然发现登录接口 network -> xhr -> cookies -> domain 上存在一个 <span style="
    color: #fff;
    width: 16px;
    height: 16px;
    background: #3a3a3a;
    border-radius: 50%;
    display: inline-block;
    text-align: center;
    line-height: 16px;
    font-weight: bold;">i</span> 符号警告为 **Set-Cookie's domain attribute was invalid with regards to the current host URL**。<br />

![domainWarning](https://i.loli.net/2020/03/12/PZm1qsGgx78jez2.png)<br />

这种警告情况下浏览器应该会有提示，才开始注意控制台输出了几行标黄警告信息（一般情况下的浏览器自身警告我都是下意识忽略 XD），大概意思是指当前网络请求不会携带任何 Cookie，如果需要强行携带，需要把 `Secure` 设为 true（上图）同时将 `Same-Site` 属性设置为 none，默认 `Same-Site=Lax`。<br />

![Same-Site](https://i.loli.net/2020/03/23/TV7xoPChQc4jtk3.png)

貌似找到了问题真相...<br />

### Same-Site

而 Cookie 的 `SameSite` 属性用来限制第三方 Cookie，从而减少安全风险。<br />
支持三个属性的设置：<br />

- Strict：完全禁止第三方 Cookie，跨站点时，任何情况下都不会发送 Cookie。换言之，只有当前网页的 URL 与请求目标一致，才会带上 Cookie。

- Lax：一般情况不发送第三方 Cookie，除却导航到目标网址的 Get 请求。

|   Type    |                Case                 |   Normal    |     Lax     |
| :-------: | :---------------------------------: | :---------: | :---------: |
|   链接    |        `<a href="..."></a>`         | 发送 Cookie | 发送 Cookie |
| GET 表单  | `<form method="GET" action="...">`  | 发送 Cookie | 发送 Cookie |
| POST 表单 | `<form method="POST" action="...">` | 发送 Cookie |   不发送    |
|  iframe   |    `<iframe src="..."></iframe>`    | 发送 Cookie |   不发送    |
|   AJAX    |           `$.get("...")`            | 发送 Cookie |   不发送    |
|   Image   |          `<img src="...">`          | 发送 Cookie |   不发送    |

- None：Chrome 计划将 Lax 变为默认设置。这时，网站可以选择显式关闭 `SameSite` 属性，将其设为 None。不过，前提是必须同时设置 Secure 属性（Cookie 只能通过 HTTPS 协议发送），否则无效。

### Fix

最后在服务端设置：<br />

```js
ctx.cookies.set('auth', '******************', {
  domain: 'localhost',
  path: '/',
  secure: true,
  sameSite: 'none'
})
```

再次拉起登录成功注入 Cookie 登录态。<br />

### Last

产线域名不存在跨域所以直接登录没有问题。Chrome 当前的版本是 v80.0.3987.132，还是同源策略相关的限制（Chrome 偷偷加入 Hot patch？所以 FireFox 没事）导致这个问题（Safari the same）。那么以插件形式运行在 Chrome 插件进程上的 Postman 为何不受到影响呢？
