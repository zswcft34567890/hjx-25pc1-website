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

这个是**25级计算机应用1班**的班级网站，你可以在此处了解班级内容。

{{ cardStandalone(
    "fa-solid fa-arrows-rotate",
    "流动更新",
    "内容会实时更新，因此每天看到的内容可能都会不一样",
    bgColor="rgba(171, 234, 114, 0.1)"
) }}

## 关于我们

<div align="center">

我们是**25级计算机应用1班**，一个由 **37** 名同学组成的小集体

{{ button("fa-solid fa-arrow-right", "了解更多", "/about.html") }}
</div>

## 卡片动态

<div class="card-full-list">
    {{ cardFull(
        "班级量化分",
        "6月份班级拿了第一",
        "/event-scoreclass6.html",
        "查看详细信息",
        bgColor="rgba(200, 200, 255, 0.1)"
    ) }}
</div>

## 专区入口

<div class="cardzone-three-columns">
{{ card("学习资源", "一些常用的学习资源", "/zone.html#study", " 跳转") }}
{{ card("班级荣誉", "班级里获得的荣誉", "/honors.html", "进入") }}
{{ card("讨论区", "[需要 Github 账户]可以在这里讨论一些事情", "/discussion.html", "前往 Github") }}
</div>

<div align="center">
{{ button("fa-solid fa-book-open", "进入班级知识库", "/wiki/") }}

{{ button("fa-solid fa-arrow-right", "更多分区", "/zone.html") }}
</div>

## 贡献者

<div align="center">
    <img src="https://contrib.rocks/image?repo=hjx-25pc1/hjx-25pc1.github.io" alt="Coutributors">
</div>

## 友情链接

<div align="center">
{{ button("fa-solid fa-smile", "mantoujun12的个人网站", "https://mantoujun12.github.io") }}
</div>