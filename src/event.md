---
title: 事件
eleventyNavigation:
  key: event
  title: 🔔 事件
  order: 5
---

{% from "macros/button.njk" import button %}
{% from "macros/card.njk" import card, cardFull, cardStandalone %}

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