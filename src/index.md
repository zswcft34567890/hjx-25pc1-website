---
title: 25级计算机应用1班|首页
layout: layouts/home
eleventyNavigation:
    key: home
    title: 🏠 首页
    order: 1
---

{% from "macros/button.njk" import button %}
{% from "macros/card.njk" import card, cardFull, cardStandalone %}

## 关于我们

<div align="center">

我们是**25级计算机应用1班**，一个由 **37** 名同学组成的小集体

{{ button("fa-solid fa-arrow-right", "了解更多", "/about.html") }}
</div>

## 专区入口

<div class="cardzone-three-columns">
{%- for entry in collections.zone %}
{%- if loop.index <= 3 %}
{{ card(entry.data.title, entry.data.description or "", entry.url | url, entry.data.cta or "进入") }}
{%- endif %}
{%- endfor %}
</div>

<div align="center">
{{ button("fa-solid fa-book-open", "进入班级 Wiki", "/wiki.html") }}

{{ button("fa-solid fa-arrow-right", "更多分区", "/zone.html") }}
</div>

## 贡献者

<div align="center">
{% include "components/contributors.njk" %}
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