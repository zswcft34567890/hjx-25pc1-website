<div align="center">

![Counts](https://count.getloli.com/@hjx-25pc1.github.io?name=hjx-25pc1.github.io&theme=miku&padding=7&offset=0&align=top&scale=1&pixelated=1&darkmode=auto)

# Class Website

Class 1, Computer Application, Grade 2025

[![GitHub Pages](https://img.shields.io/github/deployments/hjx-25pc1/hjx-25pc1.github.io/github-pages?style=for-the-badge)](https://hjx-25pc1.github.io)
[![License](https://img.shields.io/github/license/hjx-25pc1/hjx-25pc1.github.io?style=for-the-badge)](https://github.com/hjx-25pc1/hjx-25pc1.github.io/blob/main/LICENSE)
[![Stars](https://img.shields.io/github/stars/hjx-25pc1/hjx-25pc1.github.io?style=for-the-badge)](https://github.com/hjx-25pc1/hjx-25pc1.github.io)
[![Eleventy](https://img.shields.io/badge/Eleventy-000000?style=for-the-badge&logo=eleventy&logoColor=white)](https://www.11ty.dev)
[![Nunjunks](https://img.shields.io/badge/nunjunks-green?logo=nunjucks&style=for-the-badge)](https://mozilla.github.io/nunjucks/)
[![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)](https://sass-lang.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-black?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

[简体中文](docs/README_zh-cn.md)

This is a Class Website. You can Find some intersting contents.

</div>

## 🔭 Overview

This repository hosts the source code of the official class website for **Class 1, Computer Application, Grade 2025**. It is used to showcase the class, share learning materials, document everyday class life, and serve as a hands-on project for classmates learning web development.

- **Author**: hjx-25pc1
- **License**: MIT
- **Live Site**: <https://hjx-25pc1.github.io>
- **Repository**: <https://github.com/hjx-25pc1/hjx-25pc1.github.io>

## 🔨 Tech Stack

This project is a fully static site built with the following technologies:

- **[Eleventy (11ty)](https://www.11ty.dev/)** v3 — Static Site Generator (SSG)
- **Nunjucks (`.njk`)** — Templating engine for layouts, reusable components, and page rendering
- **Markdown (`.md`)** — Primary content format for easy writing and reading
- **Sass / SCSS** — CSS preprocessor, compiled into compressed CSS
- **PostCSS + Autoprefixer** — Automatically adds vendor prefixes for broad browser compatibility
- **[@11ty/eleventy-img](https://www.11ty.dev/docs/plugins/image/)** — Responsive image processing, auto-generates `webp` and `jpeg` at multiple sizes
- **[@11ty/eleventy-plugin-syntaxhighlight](https://www.11ty.dev/docs/plugins/syntaxhighlight/)** — Syntax highlighting for Markdown code blocks
- **Vanilla JavaScript (ES Modules)** — A small amount of client-side interaction; scripts are organized as native ES modules under `src/js/` with no front-end framework or bundler dependency. The entry `main.js` is loaded via `<script type="module">`
- **GitHub Actions** — Automated CI/CD; pushing to the `main` branch triggers a build and deployment
- **GitHub Pages** — Static site hosting platform

## 🖥️ Development Requirements

Before you start, make sure the following tools are installed locally:

| Tool | Version | Description |
| --- | --- | --- |
| **Node.js** | 24.x (LTS; the latest LTS is recommended) | Runtime and package management |
| **npm** | Installed with Node.js | Dependency management and script execution |
| **Git** | Latest stable | Version control and commits |

> 💡 Recommend using [nvm](https://github.com/nvm-sh/nvm) (or [nvm-windows](https://github.com/coreybutler/nvm-windows) on Windows) to manage Node.js versions.

## 💻 Local Development

Follow these steps to run the dev server locally:

1. **Clone the repository**

   ```bash
   git clone https://github.com/hjx-25pc1/hjx-25pc1.github.io.git
   cd hjx-25pc1.github.io
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the dev server** (default URL: <http://localhost:8080>, with hot reload)

   ```bash
   npm run serve
   ```

4. **Build once** (without starting a server; output is written to `_site/`)

   ```bash
   npm run build
   ```

5. **Watch files and rebuild on change** (without a local server)

   ```bash
   npm run watch
   ```

## 🚀 Deployment

This project is automatically deployed to **GitHub Pages** via **GitHub Actions**:

- **Trigger**: Pushes to the `main` branch that modify `src/**`, `.eleventy.js`, `package.json`, or `package-lock.json`
- **Build environment**: Latest Ubuntu + Node.js 24
- **Pipeline**: `npm ci` → `npm run build` → upload `_site/` artifact → deploy to the `github-pages` environment
- **Concurrency**: Only one deployment runs at a time; queued runs in between are skipped
- **Live URL**: <https://hjx-25pc1.github.io>

To trigger a deployment manually, go to the repository's **Actions** tab, select the `Deploy static content to Pages` workflow, and click **Run workflow**.

## 👥 Contributors

![Coutributors](https://contrib.rocks/image?repo=hjx-25pc1/hjx-25pc1.github.io)

## 👋 Contributing

Welcome to Contributions this Project! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting.

A short version of the workflow:

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add some feature"`)
4. Push to your branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## ⭐ Star History

<a href="https://www.star-history.com/?repos=hjx-25pc1%2Fhjx-25pc1.github.io&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=hjx-25pc1/hjx-25pc1.github.io&type=date&theme=dark&legend=top-left&sealed_token=3bEqp9fDKFtN1WO9QJc2KSMQLGzP2OA77ARV10R3BXHfQ34Rj_mKyDoZkqWDou3caxqEoAc3KwFTR9-65Dl8rnPx-q4oUMm7nxKGvvhRnenPM_MzU8nFCpPOFiq7ssfqEOvLaBrSoAwS1GnkLcb4EI10ZY25dj8R-ZZSP7BzzX1fk0lcHnNAeN7iZVaW" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=hjx-25pc1/hjx-25pc1.github.io&type=date&legend=top-left&sealed_token=3bEqp9fDKFtN1WO9QJc2KSMQLGzP2OA77ARV10R3BXHfQ34Rj_mKyDoZkqWDou3caxqEoAc3KwFTR9-65Dl8rnPx-q4oUMm7nxKGvvhRnenPM_MzU8nFCpPOFiq7ssfqEOvLaBrSoAwS1GnkLcb4EI10ZY25dj8R-ZZSP7BzzX1fk0lcHnNAeN7iZVaW" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=hjx-25pc1/hjx-25pc1.github.io&type=date&legend=top-left&sealed_token=3bEqp9fDKFtN1WO9QJc2KSMQLGzP2OA77ARV10R3BXHfQ34Rj_mKyDoZkqWDou3caxqEoAc3KwFTR9-65Dl8rnPx-q4oUMm7nxKGvvhRnenPM_MzU8nFCpPOFiq7ssfqEOvLaBrSoAwS1GnkLcb4EI10ZY25dj8R-ZZSP7BzzX1fk0lcHnNAeN7iZVaW" />
 </picture>
</a>

## 📑 License

This project is open source under the [MIT License](LICENSE).

> Some Content Generated by AI.(Project Infomation,Code...)