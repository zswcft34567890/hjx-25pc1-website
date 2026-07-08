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

<!-- TODO: 待编写 —— 班级简介、班主任、班级口号、班级文化等 -->

<div align="center">

我们是**25级计算机应用1班**，一个由 **37** 名同学组成的小集体

{{ button("fa-solid fa-arrow-right", "了解更多", "/about.html") }}
</div>

## 班级动态

<!-- TODO: 待编写 —— 最新公告、活动通知、获奖喜讯等 -->

<div class="card-full-list">
    {{ cardFull(
        "动态卡片",
        "只是测试一下，按钮没做导航",
        "/",
        "跳转"
    ) }}
</div>

## 专区入口

<!-- TODO: 待编写 —— 可跳转到 zone.html 中各分区的卡片（学习资源 / 课表 / 相册 / 通讯录 等） -->

<div class="cardzone-three-columns">
{{ card("学习资源", "会存放一些常用的学习资源", "/zone.html#study", "进入") }}
{{ card("班级荣誉", "班级里获得的荣誉", "/honors.html", "进入") }}
{{ card("留言板", "[未开放]可以在这里留下你的内容", "/", "进入") }}
</div>
<div align="center">
{{ button("fa-solid fa-arrow-right", "更多分区", "/zone.html") }}
</div>

## 贡献者

<div align="center">
    <img src="https://contrib.rocks/image?repo=hjx-25pc1/hjx-25pc1.github.io" alt="Coutributors">
</div>

## 友情链接

<!-- TODO: 待编写 —— 学校官网、院系、相关社团 / 项目等外链 -->

<div align="center">
{{ button("fa-solid fa-smile", "mantoujun12的个人网站", "https://mantoujun12.github.io") }}
</div>