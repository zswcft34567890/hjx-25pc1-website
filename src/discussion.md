---
title: 讨论
eleventyNavigation:
       key: discussion
       title: 讨论
       order: 4
---

{% from "macros/button.njk" import button %}
{% from "macros/card.njk" import card, cardFull, cardStandalone %}

<div align="center">

# 讨论

你可以在这里讨论一些内容

{{ cardStandalone(
    "fa-brands fa-github", 
    "需要 Github 账户", 
    "因为一些限制，需要账户才能发评论", 
    bgColor="rgba(0, 0, 0, 0.1)") }}

</div>

<script src="https://giscus.app/client.js"
        data-repo="hjx-25pc1/hjx-25pc1.github.io"
        data-repo-id="R_kgDOTNNixA"
        data-category="Giscus"
        data-category-id="DIC_kwDOTNNixM4DAxSG"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="1"
        data-input-position="top"
        data-theme="preferred_color_scheme"
        data-lang="zh-CN"
        data-loading="lazy"
        crossorigin="anonymous"
        async>
</script>