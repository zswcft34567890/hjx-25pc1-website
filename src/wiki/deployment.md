---
title: 部署指南
description: 如何部署班级网站
layout: layouts/wiki
order: 3
---

# 部署指南

## 自动部署

`main` 分支的 `push` 会触发 GitHub Actions：

1. `npm ci` 安装依赖
2. `npm run build` 构建
3. 上传 `_site/` 工件
4. 部署到 GitHub Pages

## 手动部署

在 GitHub Actions 页面选择 `Deploy static content to Pages`，点击 `Run workflow`。

## 部署路径前缀

由于部署在根路径 `/`，所有资源引用必须用 `| url` 过滤器：

```njk
<link rel="stylesheet" href="{{ '/style/base.css' | url }}">
```