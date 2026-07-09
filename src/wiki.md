---
title: 知识库
description: 25 计应 1 班的集体知识沉淀
layout: layouts/main
permalink: /wiki/
eleventyNavigation:
  key: wiki
  title: 知识库
  order: 4
---

这里是 25 计算机应用 1 班的集体知识沉淀，由同学们共同维护。

## 所有条目

<ul class="wiki-list">
    {%- for entry in collections.wiki %}
    <li>
        <a href="{{ entry.url | url }}">{{ entry.data.title }}</a>
        {%- if entry.data.description %}
        <span class="wiki-list-desc">— {{ entry.data.description }}</span>
        {%- endif %}
    </li>
    {%- endfor %}
</ul>

## 如何贡献

在 <code>src/wiki/</code> 目录下新建 <code>.md</code> 文件，按以下模板填写：

```
---
title: 你的标题
description: 简短描述
layout: layouts/wiki
order: 4
eleventyNavigation:
  key: 唯一标识
  title: 导航显示文字
  parent: wiki
  order: 5
---

正文内容...
```