---
date: 2021-04-01
title: RUM
description: 什么是以用户为中心的性能指标
template: post
slug: /web-performance
category: R&D
cover: media/arseny-togulev-mnx3NlXwKdg-unsplash-middle.jpg
tags:
  - Performance
---

# 什么是以用户为中心的性能指标

你可能已无数次听人提及性能的重要性，以及网页应用的运行速度十分关键。

但是，当我们尝试回答「我的应用有多快？」这个问题时，就会意识到，「快」是一个很模糊的概念。 我们所谓的「快」究竟是指什么？其情境为何？ 为谁提供高的运行速度？

## 我们说的性能体验到底是什么？

讨论性能时务求精确，以免产生误解或散布谬见，从而导致出于善意的开发者朝着错误的方向优化，最终影响而非改善用户体验。

性能监控误区一：**_我已经测试我的应用性能情况，加载时间为 xxx 秒_**。

网页的加载时间会因为用户的客户端环境的不同而有很大的变化，具体取决于用户的设备功能以及网络状况。 以单纯的数字表示加载时间忽略了遭遇过长加载时间的用户。

实际上，WebApp 的加载时间是每个用户所有加载时间的汇总，而全面表示加载时间的唯一方法是使用以下直方图所示的分布方法：

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/c0c968d2-f1f9-489b-a9f5-491ce1ad58ac/697a0311-4b9d-424d-8a2d-bd1bdd9f1ac0/Untitled.png)

X 轴上的数字显示加载时间，而 Y 轴上条的高度显示体验到特定时间段中加载时间的用户相对数量。 正如此图表所示，虽然最大的用户群体验到的加载时间不到 1 或 2 秒，但仍有很多用户体验到相当长的加载时间。

之所以说「我网站的加载时间为 xxx 秒」是不是事实的另一个原因是，加载并非单一的时刻，是一段复杂的过程，是任何单一指标都无法全面衡量的体验。 在加载过程中，有多个时刻都会影响到用户对速度的感知，如果只关注其中某个时刻，就可能会遗漏其余时间内用户感受到的不良体验。

例如，假定某 WebApp 针对快速初始渲染进行优化，以便立刻将内容传递给用户。 然后，如果该 WebApp 加载一个需要花费数秒来解析和执行的大型 JavaScript 脚本，那么只有在 JavaScript 运行之后，页面上的内容才可供交互。

如果用户可以看到页面上的链接但无法点击，或者可以看到文本框但无法在其中输入内容，他们可能就不会关心页面渲染的速度有多快。

因此，我们不应该只使用一个指标来衡量加载，而应该衡量整个体验过程中可能影响用户对加载的*感知*的每个时刻。

性能监控误区二：认为**_性能只是加载时间的问题_**。

但事实是，随时都有可能发生性能不佳的情况，不只限于加载期间。 应用无法迅速响应点按或点击操作，以及无法平滑滚动或产生动画效果的问题与加载缓慢一样，都会导致糟糕的用户体验。 用户关心的是总体体验，我们开发者也应如此。

所有这些性能误解有一个共同的主题，即开发者都将注意力集中在对于用户体验帮助不大甚至全无帮助的事情上。 同样地，[加载](https://developer.mozilla.org/en-US/docs/Web/Events/load) 时间或 [DOMContentLoaded](https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded) 时间等传统性能指标极不可靠，因为加载发生的时间可能与用户认为的应用加载时间不上。

因此，为确保不进入性能监控的误区，我们必须回答下列问题（也是用户和产品都共同关心的问题）：

1. 哪些指标能够最准确地衡量人所感受到的性能？
2. 如何针对实际用户来衡量这些指标？
3. 如何解读衡量结果以确定应用是否「速度快」？
4. 了解应用的实际用户性能之后，如何避免性能下降并在未来提高性能？

> 了解到性能监控的本质是一个非常非常重要的事情

## 有哪些以用户为中心的性能指标？

当用户访问网页时，通常会寻找视觉反馈，以确信一切符合他们的预期。

|                |                                            |
| -------------- | ------------------------------------------ |
| 是否发生？     | 导航是否成功启动？服务器是否有响应？       |
| 是否有用？     | 是否已渲染可以与用户互动的足够内容？       |
| 是否可用？     | 用户可以与页面交互，还是页面仍在忙于加载？ |
| 是否令人愉快？ | 交互是否顺畅而自然，没有滞后和卡顿？       |

为了解页面何时为用户提供这样的反馈，我们定义了多个新指标：

### 首次绘制 FP 与首次内容绘制 FCP

[Paint Timing](https://github.com/WICG/paint-timing) API 定义两个指标：_首次绘制_ (FP) 和 _首次内容绘制_ (FCP)。 这些指标用于标记 URL 跳转之后浏览器在屏幕上渲染像素的时间点。 这对于用户来说十分重要，因为它回答了「*是否发生？\_\_」*的问题

这两个指标之间的主要差别在于：

- FP 标记浏览器渲染 **_任何_** 在视觉上不同于导航前屏幕内容之内容的时间点。
- FCP 标记的是浏览器渲染来自 DOM 第一位内容的时间点，该内容可能是文本、图像、SVG 甚至 <canvas> 元素。

### 首次有效绘制 FMP 和 Hero 元素渲染打点

首次有效绘制 (FMP) 指标能够回答「_是否有用？_」问题。 虽然「有用」这一概念很难以通用于所有网页的方式规范化（因此社区尚不存在任何标准的规范），但是 WebApp 开发者自己很清楚其页面的哪些部分对用户最为有用。

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/c0c968d2-f1f9-489b-a9f5-491ce1ad58ac/aa062376-a8f4-4b0b-a5ca-1c8eae921da3/Untitled.png)

网页的这些「最重要部分」通常称为 **_Hero 元素_**。 例如，在 YouTube WebApp 的观看页面上，主视频就是 Hero 元素。 在 Twitter 上，Hero 元素可能是通知标志和第一篇推文。 在天气应用上，Hero 元素是指定地点的天气预测。 在新闻网站上，Hero 元素可能是重大新闻和置顶大图。

在网页上，几乎总有一部分内容比其他部分更重要。 如果页面最重要的部分能迅速加载，用户就会认为当前的 WebApp 展示的内容是有用的，可能不会注意到其余部分是否加载。

### 耗时较长的任务 Long Task

浏览器通过将任务添加到主线程上的队列等待逐个执行来响应用户输入。 浏览器执行 WebApp 的 JavaScript 时也会这样做，因此从这个角度看，浏览器为单线程。

在某些情况下，运行这些任务可能要花费较长时间，如果确实如此，主线程就会遭到阻止，而队列中的所有其他任务都必须等待。

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/c0c968d2-f1f9-489b-a9f5-491ce1ad58ac/f73c8e05-ab17-4ad7-b93c-653761a8f51e/Untitled.png)

对于用户而言，任务耗时较长表现为滞后或卡顿，而这也是目前网页不良体验的主要根源。

[Long Tasks API](https://w3c.github.io/longtasks/) 可以将任何耗时超过 50 毫秒的任务标记为可能存在问题，并向应用开发者显示这些任务。 选择 50 毫秒的时间是为了让应用满足在 100 毫秒内响应用户输入的 [RAIL 指导原则](https://developers.google.com/web/fundamentals/performance/rail)。

### 可交互时间 TTI

可交互时间 (TTI) 指标用于标记应用已进行视觉渲染并能可靠响应用户输入的时间点。 应用可能会因为多种原因而无法响应用户输入：

- 页面组件运行所需的 JavaScript 尚未加载。
- 耗时较长的任务阻塞主线程

TTI 指标可识别页面初始 JavaScript 已加载且主线程处于空闲状态（没有耗时较长的任务）的时间点。

### 将指标对应到用户体验

回顾前面确定的对用户体验最重要的问题，下表概述刚刚列出的各个指标如何对应到我们希望优化的体验：

|                |                                                |
| -------------- | ---------------------------------------------- |
| 体验           | 指标                                           |
| 是否发生？     | 首次绘制 (FP)/首次内容绘制 (FCP)               |
| 是否有用？     | 首次有效绘制 (FMP)/主角元素计时                |
| 是否可用？     | 可交互时间 (TTI)                               |
| 是否令人愉快？ | 耗时较长的任务（在技术上不存在耗时较长的任务） |

下列加载时间线屏幕截图有助于更直观地了解加载指标对应的加载体验：

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/c0c968d2-f1f9-489b-a9f5-491ce1ad58ac/ae7b5927-8e24-427e-b281-f3e50a95b829/Untitled.png)

## 在实际用户的设备上如何计算这些指标？

以前我们针对加载和 DOMContentLoaded 等指标进行优化的一个主要原因是，这些指标在浏览器中显示为事件，而且容易针对实际用户进行衡量。

相比而言，许多其他指标在过去很难加以衡量。 例如，以下代码是开发者经常用来检测耗时较长任务的黑科技：

(function detectLongFrame() {

```
var lastFrameTime = Date.now();

requestAnimationFrame(function() {

  var currentFrameTime = Date.now();

  if (currentFrameTime - lastFrameTime > 50) {

    // Report long frame here...

  }

  detectLongFrame(currentFrameTime);

});

```

}());

此代码以无限循环的 requestAnimationFrame 开头，并记录每次迭代所花费的时间。 如果当前时间距离前次时间超过 50 毫秒，则会认为原因在于存在耗时较长的任务。 虽然大部分情况下此代码都行得通，但其也有不少缺点：

- 此代码会给每个帧增加开销。
- 此代码会阻止空闲块。
- 此代码会严重消耗电池续航时间。

性能测量代码最重要的规则是不应降低性能。

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) 和 [Web Page Test](https://www.webpagetest.org/) 等服务已经提供部分新指标一段时间（这些工具通常非常适合用于在功能发布前测试其性能），但这些工具并未在用户设备上运行，因此未反映出用户的实际性能体验。

得益于 W3C 规范新增的几个浏览器 API，我们可以在实际设备上衡量这些指标，而无需使用大量可能降低性能的黑科技或变通方法。

这些新增的 API 是 [PerformanceObserver](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver)、[PerformanceEntry](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEntry) 和 [DOMHighResTimeStamp](https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp)。 为显示实际运行这些新 API 的一些代码，以下代码示例创建新的 PerformanceObserver 实例，并通过订阅接收有关绘制输入（例如， FP 和 FCP）以及发生任何耗时较长任务的通知：

const observer = new PerformanceObserver((list) => {

```
for (const entry of list.getEntries()) {

  // `entry` is a PerformanceEntry instance.

  console.log(entry.entryType);

  console.log(entry.startTime); // DOMHighResTimeStamp

  console.log(entry.duration); // DOMHighResTimeStamp

}

```

});

// Start observing the entry types you care about.

observer.observe({entryTypes: ['resource', 'paint']});

PerformanceObserver 为我们提供的新功能是，能够在性能事件发生时订阅这些事件，并以异步方式响应事件。 此 API 取代旧的 [PerformanceTiming](https://www.w3.org/TR/navigation-timing/#sec-navigation-timing-interface) 界面，后者通常需要执行轮询才能查看数据可用的时间。

### 跟踪 FP/FCP

获得特定性能事件的数据之后，可将其发送给数据分析平台。 例如 Google Analytics，我们可跟踪首次绘制时间，如下所示：

<head>

```
<!-- Add the async Google Analytics snippet first. -->

<script>

window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;

ga('create', 'UA-XXXXX-Y', 'auto');

ga('send', 'pageview');

</script>

<script async src='https://www.google-analytics.com/analytics.js'></script>

<!-- Register the PerformanceObserver to track paint timing. -->

<script>

const observer = new PerformanceObserver((list) => {

  for (const entry of list.getEntries()) {

    // `name` will be either 'first-paint' or 'first-contentful-paint'.

    const metricName = [entry.name](http://entry.name);

    const time = Math.round(entry.startTime + entry.duration);

    ga('send', 'event', {

      eventCategory:'Performance Metrics',

      eventAction: metricName,

      eventValue: time,

      nonInteraction: true,

    });

  }

});

observer.observe({entryTypes: ['paint']});

</script>

<!-- Include any stylesheets after creating the PerformanceObserver. -->

<link rel="stylesheet" href="...">

```

</head>

> 中注册，以使其在 FP/FCP 发生前运行。

> 浏览器内核实现 Performance Observer 规范 Level 2 后就不必再执行这项注册，因为该级别引入 [buffered](https://w3c.github.io/performance-timeline/#dom-performanceobserverinit- buffered) 标记，可用于访问在创建 PerformanceObserver 之前排队的 性能条目。

### 使用 Hero 元素跟踪 FMP

确定页面上的主角元素之后，可以跟踪为用户呈现这些元素的时间点。

目前尚无标准化的 FMP 定义，因此也没有性能条目类型。 部分原因在于很难以通用的方式确定「有效」对于所有页面意味着什么。

但是，一般来说，在单个页面或单个应用中，最好是将 FMP 视为主角元素呈现在屏幕上的时刻。

有一篇精彩的文章（[用户计时与自定义指标](https://speedcurve.com/blog/user-timing-and-custom-metrics/)）详细说明使用浏览器性能 API 来确定代码中各类媒体呈现时间的技术。

### 另辟蹊径的跟踪 FMP

这里还有有一种方式， 借助 mutationObserver 的方式进行检测 DOM 元素增量最大的时间点，好处是完全不需要关心当前的页面是常规的服务端直出页面还是 SPA 异步渲染出来的页面，只会聚焦在 DOM 的变化。

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/c0c968d2-f1f9-489b-a9f5-491ce1ad58ac/5e649a02-77b5-49e4-aaf7-229b62fa8674/Untitled.png)

此方案基于一个猜想，「主要内容 = 元素增量最大的点」具体方案参见 [阿里云前端监控团队的方案](http://jm.taobao.org/2018/06/29/%E5%A4%A7%E5%89%8D%E7%AB%AF%E6%97%B6%E4%BB%A3%E5%89%8D%E7%AB%AF%E7%9B%91%E6%8E%A7%E7%9A%84%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5/)

### 跟踪 TTI

从长远来看，Chrome 团队希望将 TTI 指标标准化，并通过 PerformanceObserver 在浏览器中公开。 同时，Chrome 团队已开发出一个 polyfill，它可用于检测目前的 TTI，并适用于所有支持 [Long Tasks API](https://w3c.github.io/longtasks/) 的浏览器。

该 polyfill 暴露一个 getFirstConsistentlyInteractive() 方法，后者返回使用 TTI 值进行解析的 promise。 假如我们使用 Google Analytics 来跟踪 TTI，如下所示：

import ttiPolyfill from './path/to/tti-polyfill.js';

ttiPolyfill.getFirstConsistentlyInteractive().then((tti) => {

```
ga('send', 'event', {

  eventCategory:'Performance Metrics',

  eventAction:'TTI',

  eventValue: tti,

  nonInteraction: true,

});

```

});

getFirstConsistentlyInteractive() 方法接受可选的 startTime 配置选项，可以指定下限值（这就知道 WebApp 在此之前无法进行交互）。 默认情况下，该 polyfill 使用 DOMContentLoaded 作为开始时间，但通常情况下，使用 Hero 元素呈现的时刻会更准确。

请参阅 [TTI polyfill 文档](https://github.com/GoogleChrome/tti-polyfill)，以获取完整的安装和使用说明。

> **注：**与 FMP 相同，很难规范化适用于所有网页的 TTI 指标定义。 Chrome 团队在 polyfill 中实施的版本适用于大部分应用，但可能不适用于特定的 WebApp。 因此最好在使用前，先进行测试。 如需有关 TTI 定义及实施细节的详情，请阅读 TTI 指标定义文档。

### 跟踪耗时较长的任务

前面提到，耗时较长的任务通常会带来某种负面的用户体验（例如， 事件处理程序运行缓慢，或者掉帧）。 我们最好了解发生这种情况的频率，以设法尽量减少这种情况。

要在 JavaScript 中检测耗时较长的任务，请创建新的 PerformanceObserver，并观察类型为 longtask 的条目。 耗时较长的任务条目的一个有点是包含[提供方属性](https://w3c.github.io/longtasks/#sec-TaskAttributionTiming)，有助于我们更轻松地追查导致出现耗时较长任务的代码：

const observer = new PerformanceObserver((list) => {

```
for (const entry of list.getEntries()) {

  ga('send', 'event', {

    eventCategory:'Performance Metrics',

    eventAction: 'longtask',

    eventValue:Math.round(entry.startTime + entry.duration),

    eventLabel:JSON.stringify(entry.attribution),

  });

}

```

});

observer.observe({entryTypes: ['longtask']});

提供方属性会指出导致耗时较长任务的帧上下文，这有助于确定问题是否由第三方 iframe 脚本所致。 未来版本的 W3C 规范计划添加更多详细信息并公开脚本网址、行号和列号，这有助于确定速度缓慢问题是否是我们的自己的代码导致的。

### 跟踪输入延迟

阻塞主线程的耗时较长任务可能会导致事件侦听器无法及时执行。 [RAIL 性能模型](https://developers.google.com/web/fundamentals/performance/rail) 指出，为提供流畅的界面体验，界面应在用户执行输入后的 100 毫秒内作出响应，若非如此，需要探查原因。

若要在代码中检测输入延迟，可将事件时间戳与当前时间作比较，如果两者相差超过 100 毫秒，应该进行数据上报。

const subscribeBtn = document.querySelector('#subscribe');

subscribeBtn.addEventListener('click', (event) => {

```
// Event listener logic goes here...

const lag = performance.now() - event.timeStamp;

if (lag > 100) {

  ga('send', 'event', {

    eventCategory:'Performance Metric'

    eventAction: 'input-latency',

    eventLabel: '#subscribe:click',

    eventValue:Math.round(lag),

    nonInteraction: true,

  });

}

```

});

由于事件延迟通常是由耗时较长的任务所致，因此可以将事件延迟检测逻辑与耗时较长任务检测逻辑相结合：如果某个耗时较长的任务在 event.timeStamp 所示的时间阻塞主线程，也可以报告该耗时较长任务的提供方值。 这样就可以在性能体验恶化与导致该体验恶化的代码之间建立明确的联系。

虽然这种方法并不完美（不会处理之后在传播阶段耗时较长的事件侦听器，也不适用于不在主线程中运行的滚动或合成动画），但至少可以让我们能更好地了解运行时间较长的 JavaScript 代码对用户体验产生影响的频率。

## 如何上报数据以及解读数据？

开始收集针对实际用户的性能指标后，就需要将该数据付诸实践。 实际用户性能数据十分有用，主要原因在于以下几个方面：

- 验证 WebApp 性能符合预期。
- 识别不良性能对转化（根据具体的 WebApp 而定）造成负面影响的地方。
- 寻找改善用户体验和取悦用户的机会。

我们有必要将应用在移动设备和桌面设备上的性能进行比较。 下图显示桌面设备（蓝色）和移动设备（橙色）上的 TTI 分布情况。 正如此示例所示，移动设备上的 TTI 值明显大于桌面设备：

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/c0c968d2-f1f9-489b-a9f5-491ce1ad58ac/6c171f0e-9ddc-486d-bfc0-3f3c18ebcddd/Untitled.png)

### 桌面设备

|        |           |
| ------ | --------- |
| 百分位 | TTI（秒） |
| 50%    | 2.3       |
| 75%    | 4.7       |
| 90%    | 8.3       |

### 移动设备

|        |           |
| ------ | --------- |
| 百分位 | TTI（秒） |
| 50%    | 3.9       |
| 75%    | 8         |
| 90%    | 12.6      |

按移动设备与桌面设备划分结果，并以分布图的方式分析数据，可让迅速了解实际用户的体验。 例如，通过上表，我很容易便可发现，对于此应用，**10% 的移动用户需等待 12 秒以上才能进行交互！**

### 性能对业务的影响

在分析工具中跟踪性能让我们可以利用该数据来分析性能对业务的影响。

如果在分析工具中跟踪目标达成情况或电子商务转化情况，则可通过创建报告来探查两者与应用性能指标之间的关联。 例如：

- 体验到更快交互速度的用户是否会购买更多商品？
- 如果用户在结账流程中遇到较多耗时较长的任务，其离开率是否较高？

如果发现存在关联，即可轻松建立性能至关重要且应该优先考虑的商业案例。

### 加载退出率

用户经常会因为页面加载时间过长而选择离开。 这意味着我们的所有性能指标都存在[幸存者偏差](https://en.wikipedia.org/wiki/Survivorship_bias)，即数据不包括未等待页面加载完成的用户的加载指标（这很可能意味着数量过低）。

虽然我们无法获得如果这类用户逗留所产生的指标，但可以跟踪发生这种情况的频率以及每位用户停留的时长。

使用监听上报 SDK （如 Google Analytics）完成此任务比较棘手，因为 SDK 通常是以异步方式加载，而且可能在用户决定离开前尚不可用。 其实我们无需等待 SDK 加载完成再将数据发送到 Google Analytics。 我们可以直接通过 [Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1/) 发送数据。

以下代码为 [visibilitychange](https://developer.mozilla.org/en-US/docs/Web/Events/visibilitychange) 事件添加侦听器（该事件在页面卸载或进入后台时触发），并在该事件触发时发送 performance.now() 值。

<script>

window.__trackAbandons = () => {

```
// Remove the listener so it only runs once.

document.removeEventListener('visibilitychange', window.__trackAbandons);

const ANALYTICS_URL = 'https://www.google-analytics.com/collect';

const GA_COOKIE = document.cookie.replace(

  /(?:(?:^|.*;)\s*_ga\s*=\s*(?:\w+.\d.)([^;]*).*$)|^.*$/, '$1');

const TRACKING_ID = 'UA-XXXXX-Y';

const CLIENT_ID =  GA_COOKIE || (Math.random() * Math.pow(2, 52));

// Send the data to Google Analytics via the Measurement Protocol.

navigator.sendBeacon && navigator.sendBeacon(ANALYTICS_URL, [

  'v=1', 't=event', 'ec=Load', 'ea=abandon', 'ni=1',

  'dl=' + encodeURIComponent(location.href),

  'dt=' + encodeURIComponent(document.title),

  'tid=' + TRACKING_ID,

  'cid=' + CLIENT_ID,

  'ev=' + Math.round(performance.now()),

].join('&'));

```

};

document.addEventListener('visibilitychange', window.__trackAbandons);

</script>

要使用此代码，请将其复制到文档的 <head> 中，并将 UA-XXXXX-Y 占位符替换为我们的[跟踪 ID](https://support.google.com/analytics/answer/1008080)。

此外，我们还应确保在页面可进行交互时移除此侦听器，否则在上报 TTI 时还需报告放弃加载。

document.removeEventListener('visibilitychange', window.\_\_trackAbandons);

## 如何优化性能以及避免性能下降？

定义以用户为中心的指标的好处在于，我们在优化这些指标时，用户体验必然也会同时得到改善。改善性能最简单的一种方法是，直接减少发送到客户端的 JavaScript 代码，但如果无法缩减代码长度，则务必要思考如何提供 JavaScript。

### 优化 FP/FCP

从文档的 <head> 中移除任何阻塞渲染的脚本或样式表，可以减少首次绘制和首次内容绘制前的等待时间。

花时间确定向用户指出「正在发生」所需的最小样式集，并将其内联到 <head> 中（或者使用 [HTTP/2 服务器推送](https://developers.google.com/web/fundamentals/performance/http2/#server_push))），即可实现极短的首次绘制时间。[应用 shell 模式](https://developers.google.com/web/updates/2015/11/app-shell) 可以很好地说明如何针对 [渐进式网页应用](https://developers.google.com/web/progressive-web-apps/) 实现这一点。

### 优化 FMP/TTI

确定页面上最关键的界面元素（Hero 元素）之后，我们应确保初始脚本加载仅包含渲染这些元素并使其可交互所需的代码。

初始 JavaScript 中所包含的任何与主角元素无关的代码都会延长可交互时间。 我们没有理由强迫用户设备下载并解析当前不需要的 JavaScript 代码。

一般来说，我们应该尽可能缩短 FMP 与 TTI 之间的时间。 如果无法最大限度缩短此时间，界面绝对有必要明确指出页面尚不可交互。因为对于用户来说，其中一种最令人失望的体验就是点按元素后毫无反应。

### 避免出现耗时较长的任务

拆分代码并按照优先顺序排列要加载的代码，不仅可以缩短页面可交互时间，还可以减少耗时较长的任务，然后即有希望减少输入延迟及慢速帧。

除了将代码拆分 JavaScript 为多个单独的文件之外，我们还可将大型同步代码块拆分为较小的块，以便以异步方式执行，或者 [推迟到下一空闲点](https://developers.google.com/web/updates/2015/08/using-requestidlecallback)。 以异步方式在较小的块中执行此逻辑，可在主线程中留出空间，供浏览器响应用户输入。

最后，我们应确保测试第三方代码，并对任何低速运行的代码追责。 产生大量耗时较长任务的第三方广告或跟踪脚本对业务的伤害大于帮助。

### 避免性能下降

在这里我们重点强调的是针对实际用户的性能测量，虽然 RUM 数据确实是十分重要的性能数据，但线下实验检测数据对于在发布新功能前确保应用性能良好（而且不会下降）而言仍然十分关键。

线下实验测试非常适合用于检测性能是否下降，因为这些测试是在受控环境中运行，出现随机变化的可能性远低于 RUM 测试。

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) 和 [Web Page Test](https://www.webpagetest.org/) 等工具可以集成到持续集成服务器中，而且我们可以编写相应的测试，以在关键指标退化或下降到低于特定阈值时将构件判定为失败。

对于已发布的代码，我们可以添加自定义报警机制，以通知我们性能恶化事件的发生率是否意外突增。 例如，如果第三方发布其某个服务的新版本，而用户突然开始看到大量新增的耗时较长任务，就代表出现这种情况。

为成功避免性能下降，我们必须在线下实验和线上实际运行环境中针对发行的每个新功能进行性能测试。

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/c0c968d2-f1f9-489b-a9f5-491ce1ad58ac/05f0d1f6-79d4-49b8-9675-bfddae9fe1dc/Untitled.png)

## 我们还能做些什么？

我们希望完全将可交互时间和主角元素指标标准化，让开发者不必自己测量这些指标或依赖于 polyfill。 我们还希望帮助开发者更轻松地找到导致掉帧和输入延迟的特定耗时较长任务，以及产生这些任务的代码。

凭借 PerformanceObserver 等新 API，以及浏览器对耗时较长任务的原生支持，开发者终于能够针对实际用户相对准确的测量性能而不会影响用户体验。

能够代表实际用户体验的指标就是最重要的指标，希望我们和社区一起尽可能地为业务开发提供便利，帮助产品取悦用户并创建出色的 WebApp。

---
