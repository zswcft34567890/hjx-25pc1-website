---
title: 代码规范
description: 班级网站的代码风格约定
layout: layouts/wiki
order: 2
---

# 代码规范

## 样式

- SCSS 文件放在 `src/style/`，下划线开头为 partial
- 变量集中放 `_variables.scss`，混入放 `_mixins.scss`
- 压缩后输出，启用 Autoprefixer

## 脚本

- 原生 ES Modules，无打包器
- 用 `var` 而非 `let/const`（兼容性）
- 拆分粒度：纯工具 → `initXxx(deps)` 函数

## Markdown

- 中文与英文之间加一个空格
- 使用 GFM 语法