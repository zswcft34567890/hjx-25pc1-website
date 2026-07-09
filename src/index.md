---
title: 25级计算机应用1班|首页
eleventyNavigation:
       key: home
       title: 首页
       order: 1
---

{% from "macros/button.njk" import button %}
{% from "macros/card.njk" import card, cardFull, cardStandalone %}

# 首页

这个是**25级计算机应用1班**的班级网站，使用 **Github** 托管代码，使用 **Github Pages** 部署静态页面。

你可以浏览相关页面，来了解班级内容。当然，网站目前处于半完成状态，因此有些内容可能会随时变化，所以欢迎每次都回来看看。

这个网站目前只有 2 个人在维护，因此如果你有能力的话，欢迎前往 **Github** 点个 <span style="color:orange;font-weight:bold">Star</span> !

<div align="center">
{{ button("fa-brands fa-github", "前往项目", "https://github.com/hjx-25pc1/hjx-25pc1.github.io") }}

</div>

## 关于我们

<div align="center">

我们是**25级计算机应用1班**，一个由 **37** 名同学组成的小集体

{{ button("fa-solid fa-arrow-right", "了解更多", "/about.html") }}
</div>

## 卡片动态

<div class="card-full-list">
    {%- for entry in collections.event %}
    {{ cardFull(
        entry.data.title,
        entry.data.description or "",
        entry.url | url,
        "查看详细信息"
    ) }}
    {%- endfor %}
</div>

## 专区入口

<div class="cardzone-three-columns">
{{ card("学习资源", "一些常用的学习资源", "/zone.html#study", " 跳转") }}
{{ card("事件", "班级里的一些事件", "/event.html", "进入") }}
{{ card("讨论区", "[需要 Github 账户]可以在这里讨论一些事情", "/discussion.html", "前往") }}
</div>

<div align="center">
{{ button("fa-solid fa-book-open", "进入班级 Wiki", "/wiki.html") }}

{{ button("fa-solid fa-arrow-right", "更多分区", "/zone.html") }}
</div>

## 贡献者

<div align="center">
    <img src="https://contrib.rocks/image?repo=hjx-25pc1/hjx-25pc1.github.io" alt="Coutributors">

由 [contrib.rocks](https://contrib.rocks) 提供支持

</div>

## 友情链接

<div align="center">
{{ button("fa-solid fa-smile", "mantoujun12的个人网站", "https://mantoujun12.github.io") }}
</div>

## 卡片信息

{{ cardStandalone(
    "fa-solid fa-arrows-rotate",
    "流动更新",
    "内容会实时更新，因此每天看到的内容可能都会不一样",
    bgColor="rgba(171, 234, 114, 0.1)"
) }}