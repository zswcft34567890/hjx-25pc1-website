# 班级网站
25级计算机应用1班

[![GitHub Pages](https://img.shields.io/github/deployments/mantoujun12/hjx-25pc1-website/github-pages)](https://mantoujun12.github.io/hjx-25pc1-website)
[![License](https://img.shields.io/github/license/mantoujun12/hjx-25pc1-website)](https://github.com/mantoujun12/hjx-25pc1-website/blob/main/LICENSE)
[![Stars](https://img.shields.io/github/stars/mantoujun12/hjx-25pc1-website?style=social)](https://github.com/mantoujun12/hjx-25pc1-website)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/docs/Web/HTML)
[![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=flat&logo=sass&logoColor=white)](https://sass-lang.com/)
[![Eleventy](https://img.shields.io/badge/Eleventy-000000?style=flat&logo=eleventy&logoColor=white)](https://www.11ty.dev)

这是一个班级网站，你可以在这里找到一些有趣的内容。

## 项目简介

本仓库是 **25 级计算机应用 1 班** 的官方班级网站源代码，用于展示班级风采、分享学习资料、记录班级日常，并作为同学们学习 Web 开发的练手项目。

- **作者**：mantoujun12（一张白纸）
- **许可证**：MIT
- **在线访问**：<https://mantoujun12.github.io/hjx-25pc1-website>
- **源码仓库**：<https://github.com/mantoujun12/hjx-25pc1-website>

## 技术栈

本项目是一个纯静态站点，使用以下技术构建：

- **[Eleventy (11ty)](https://www.11ty.dev/)** v3 — 静态站点生成器（SSG）
- **Nunjucks (`.njk`)** — 模板引擎，用于布局、组件复用和页面渲染
- **Markdown (`.md`)** — 主要内容格式，便于编写和阅读
- **Sass / SCSS** — CSS 预处理器，编译为压缩后的 CSS
- **PostCSS + Autoprefixer** — 自动添加浏览器前缀，兼容主流浏览器
- **[@11ty/eleventy-img](https://www.11ty.dev/docs/plugins/image/)** — 响应式图片处理，自动生成 `webp` 与 `jpeg` 多尺寸
- **[@11ty/eleventy-plugin-syntaxhighlight](https://www.11ty.dev/docs/plugins/syntaxhighlight/)** — Markdown 代码块语法高亮
- **原生 JavaScript（ES Modules）** — 少量交互逻辑；脚本以原生 ES Modules 形式组织在 `src/js/` 下，无需前端框架或打包器；入口 `main.js` 通过 `<script type="module">` 加载
- **GitHub Actions** — 自动化 CI/CD，推送 `main` 分支即触发构建与部署
- **GitHub Pages** — 静态站点托管平台

## 项目结构

```
hjx-25pc1-website/
├── .github/
│   ├── ISSUE_TEMPLATE/         # Issue 模板（bug 报告、功能请求等）
│   └── workflows/
│       └── static.yml          # GitHub Actions 部署配置
├── docs/                       # 帮助文档（多语言 README 等）
├── src/                        # 源码目录（Eleventy 输入）
│   ├── _includes/              # 布局与组件模板（Nunjucks）
│   │   ├── button.njk
│   │   ├── card.njk
│   │   ├── footer.njk
│   │   ├── head-assets.njk
│   │   ├── header.njk
│   │   ├── main.njk            # 全局基础布局
│   │   ├── nav.njk
│   │   └── styles.njk
│   ├── assets/                 # 静态资源（图片、图标等）
│   │   └── icon/
│   │       └── school-solid-full.svg
│   ├── js/                     # 前端脚本（ES Modules）
│   │   ├── _dom.js             # DOM 元素引用集中处
│   │   ├── focus-trap.js       # 焦点陷阱工具
│   │   ├── history-stack.js    # History API 单槽位管理
│   │   ├── popup.js            # 弹窗模块
│   │   ├── drawer.js           # 抽屉模块
│   │   ├── main.js             # 编排入口（HTML 以 type="module" 加载）
│   │   └── index.js            # 其他客户端脚本
│   ├── style/                  # Sass 源码（按模块拆分）
│   │   ├── _mixins.scss
│   │   ├── _variables.scss
│   │   ├── base.scss           # 全局基础样式入口
│   │   ├── buttons.scss
│   │   ├── cards.scss
│   │   ├── content.scss
│   │   ├── footer.scss
│   │   ├── header.scss
│   │   └── nav-popup.scss
│   ├── index.md                # 首页内容
│   ├── zone.md                 # 其他页面
│   └── src.json                # src/ 目录的默认数据 / 布局配置
├── .eleventy.js                # Eleventy 配置文件
├── .gitignore
├── CONTRIBUTING.md             # 贡献指南
├── CONTRIBUTORS.md             # 贡献者名单
├── LICENSE                     # MIT 许可证
├── README.md                   # 项目说明（英文）
├── package.json
└── package-lock.json
```

构建产物输出到 `_site/` 目录（已被 `.gitignore` 忽略，不会进入版本控制）。

## 开发环境要求

在开始之前，请确保本机已安装：

| 工具 | 版本要求 | 说明 |
| --- | --- | --- |
| **Node.js** | 24.x（LTS，建议使用最新 LTS 版本） | 运行环境与包管理 |
| **npm** | 随 Node.js 一同安装 | 依赖管理与脚本执行 |
| **Git** | 最新稳定版 | 版本控制与代码提交 |

> 💡 推荐使用 [nvm](https://github.com/nvm-sh/nvm)（Windows 下推荐 [nvm-windows](https://github.com/coreybutler/nvm-windows)）来管理 Node.js 版本。

## 本地开发

按照以下步骤即可在本地启动开发服务器：

1. **克隆仓库**

   ```bash
   git clone https://github.com/mantoujun12/hjx-25pc1-website.git
   cd hjx-25pc1-website
   ```

2. **安装依赖**

   ```bash
   npm install
   ```

3. **启动开发服务器**（默认地址：<http://localhost:8080>，支持热重载）

   ```bash
   npm run serve
   ```

4. **仅构建一次**（不启动服务器，产物输出到 `_site/`）

   ```bash
   npm run build
   ```

5. **监听文件变化并重新构建**（不启动本地服务器）

   ```bash
   npm run watch
   ```

## 部署说明

本项目使用 **GitHub Actions** 自动部署到 **GitHub Pages**：

- 触发条件：向 `main` 分支推送，并且改动位于 `src/**`、`.eleventy.js`、`package.json` 或 `package-lock.json`
- 构建环境：Ubuntu 最新版 + Node.js 24
- 部署流程：`npm ci` → `npm run build` → 上传 `_site/` 工件 → 部署到 `github-pages` 环境
- 并发策略：同一时刻仅允许一个部署任务进行，队列中的中间部署会被跳过
- 在线地址：<https://mantoujun12.github.io/hjx-25pc1-website>

如需手动触发部署，可在 GitHub 仓库的 **Actions** 页面选择 `Deploy static content to Pages` 工作流并点击 **Run workflow**。

## 贡献指南

欢迎同学们一起完善这个网站！提交之前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。

简要流程：

1. Fork 本仓库
2. 创建特性分支（`git checkout -b feature/your-feature`）
3. 提交更改（`git commit -m "Add some feature"`）
4. 推送到远程分支（`git push origin feature/your-feature`）
5. 发起 Pull Request

## 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

> 部分内容由AI生成（项目介绍、代码等）