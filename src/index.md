---
title: 首页
eleventyNavigation:
       key: home
       title: 首页
---

{% from "macros/button.njk" import button %}
{% from "macros/card.njk" import card, cardFull, cardStandalone %}

# 首页

这个是**25级计算机应用1班**的班级网站，你可以在此处了解班级内容。

{{ cardStandalone(
    "fa-solid fa-circle-info",
    "网站施工中",
    "目前还没完成，如果你有能力的话欢迎贡献代码（新内容、优化等）"
) }}

## 关于我们

<!-- TODO: 待编写 —— 班级简介、班主任、班级口号、班级文化等 -->

我们是**25级计算机应用1班**，一个由 **37** 名同学组成的小集体……（此处待补充班级简介）

{{ button("fa-solid fa-arrow-right", "了解更多", "#about") }}

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
    {{ card("学习资源", "课件、笔记、复习资料汇总", "/zone.html#study", "进入") }}
    {{ card("班级相册", "活动照片、毕业留念", "/zone.html#album", "进入") }}
    {{ card("通讯录", "班级同学与任课老师联系方式", "/zone.html#contacts", "进入") }}
</div>

{{ button("fa-solid fa-arrow-right", "更多分区", "/hjx-25pc1-website/zone.html") }}

## 友情链接

<!-- TODO: 待编写 —— 学校官网、院系、相关社团 / 项目等外链 -->

{{ button("fa-solid fa-smile", "返回mantoujun12的个人网站", "https://mantoujun12.github.io") }}