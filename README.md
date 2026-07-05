# Class Website
Class 1, Computer Application, Grade 2025

[![GitHub Pages](https://img.shields.io/github/deployments/mantoujun12/hjx-25pc1-website/github-pages)](https://mantoujun12.github.io/hjx-25pc1-website)
[![License](https://img.shields.io/github/license/mantoujun12/hjx-25pc1-website)](https://github.com/mantoujun12/hjx-25pc1-website/blob/main/LICENSE)
[![Stars](https://img.shields.io/github/stars/mantoujun12/hjx-25pc1-website?style=social)](https://github.com/mantoujun12/hjx-25pc1-website)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/docs/Web/HTML)
[![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=flat&logo=sass&logoColor=white)](https://sass-lang.com/)
[![Eleventy](https://img.shields.io/badge/Eleventy-000000?style=flat&logo=eleventy&logoColor=white)](https://www.11ty.dev)

[简体中文](docs/README_zh-cn.md)

This is a Class Website. You can Find some intersting contents.

## Overview

This repository hosts the source code of the official class website for **Class 1, Computer Application, Grade 2025**. It is used to showcase the class, share learning materials, document everyday class life, and serve as a hands-on project for classmates learning web development.

- **Author**: mantoujun12
- **License**: MIT
- **Live Site**: <https://mantoujun12.github.io/hjx-25pc1-website>
- **Repository**: <https://github.com/mantoujun12/hjx-25pc1-website>

## Tech Stack

This project is a fully static site built with the following technologies:

- **[Eleventy (11ty)](https://www.11ty.dev/)** v2 — Static Site Generator (SSG)
- **Nunjucks (`.njk`)** — Templating engine for layouts, reusable components, and page rendering
- **Markdown (`.md`)** — Primary content format for easy writing and reading
- **Sass / SCSS** — CSS preprocessor, compiled into compressed CSS
- **PostCSS + Autoprefixer** — Automatically adds vendor prefixes for broad browser compatibility
- **[@11ty/eleventy-img](https://www.11ty.dev/docs/plugins/image/)** — Responsive image processing, auto-generates `webp` and `jpeg` at multiple sizes
- **[@11ty/eleventy-plugin-syntaxhighlight](https://www.11ty.dev/docs/plugins/syntaxhighlight/)** — Syntax highlighting for Markdown code blocks
- **Vanilla JavaScript** — A small amount of client-side interaction, no front-end framework dependency
- **GitHub Actions** — Automated CI/CD; pushing to the `main` branch triggers a build and deployment
- **GitHub Pages** — Static site hosting platform

## Project Structure

```
hjx-25pc1-website/
├── .github/
│   ├── ISSUE_TEMPLATE/         # Issue templates (bug report, feature request, etc.)
│   └── workflows/
│       └── static.yml          # GitHub Actions deployment configuration
├── docs/                       # Documentation (multi-language READMEs, etc.)
├── src/                        # Source directory (Eleventy input)
│   ├── _includes/              # Layouts and component templates (Nunjucks)
│   │   ├── card.njk
│   │   ├── footer.njk
│   │   ├── header.njk
│   │   └── main.njk            # Global base layout
│   ├── assets/                 # Static assets (images, icons, etc.)
│   │   └── icon/
│   ├── js/                     # Client-side scripts
│   │   ├── index.js
│   │   └── main.js
│   ├── style/
│   │   └── style.scss          # Global stylesheet entry (Sass)
│   ├── index.md                # Home page content
│   ├── zone.md                 # Additional pages
│   └── src.json                # Default data / layout config for src/
├── .eleventy.js                # Eleventy configuration file
├── .gitignore
├── CONTRIBUTING.md             # Contribution guide
├── CONTRIBUTORS.md             # List of contributors
├── LICENSE                     # MIT license
├── README.md                   # Project readme (this file)
├── package.json
└── package-lock.json
```

The build output is written to the `_site/` directory (already ignored by `.gitignore` and not committed to version control).

## Development Requirements

Before you start, make sure the following tools are installed locally:

| Tool | Version | Description |
| --- | --- | --- |
| **Node.js** | 24.x (LTS; the latest LTS is recommended) | Runtime and package management |
| **npm** | Installed with Node.js | Dependency management and script execution |
| **Git** | Latest stable | Version control and commits |

> 💡 We recommend using [nvm](https://github.com/nvm-sh/nvm) (or [nvm-windows](https://github.com/coreybutler/nvm-windows) on Windows) to manage Node.js versions.

## Local Development

Follow these steps to run the dev server locally:

1. **Clone the repository**

   ```bash
   git clone https://github.com/mantoujun12/hjx-25pc1-website.git
   cd hjx-25pc1-website
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

## Deployment

This project is automatically deployed to **GitHub Pages** via **GitHub Actions**:

- **Trigger**: Pushes to the `main` branch that modify `src/**`, `.eleventy.js`, `package.json`, or `package-lock.json`
- **Build environment**: Latest Ubuntu + Node.js 24
- **Pipeline**: `npm ci` → `npm run build` → upload `_site/` artifact → deploy to the `github-pages` environment
- **Concurrency**: Only one deployment runs at a time; queued runs in between are skipped
- **Live URL**: <https://mantoujun12.github.io/hjx-25pc1-website>

To trigger a deployment manually, go to the repository's **Actions** tab, select the `Deploy static content to Pages` workflow, and click **Run workflow**.

## Contributing

Contributions from classmates are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting.

A short version of the workflow:

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add some feature"`)
4. Push to your branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

This project is open source under the [MIT License](LICENSE).

> Some Content Generated by AI.(Project Infomation,Code...)