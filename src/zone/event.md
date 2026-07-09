---
title: 事件
description: 班级里的一些事件
cta: 进入
order: 2
permalink: /event/
eleventyNavigation:
  key: discussion
  title: 🔔 事件
  order: 1
  parent: zone
---

{% from "macros/card.njk" import cardFull %}

# 事件

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