# Contributing Guide

First of all, thank you for your interest in contributing to this project! Whether you're reporting bugs, suggesting features, improving the code, or polishing the docs and translations, every contribution helps make this class website a little better. (•̀ᴗ•́)و

This guide will walk you through how to get involved. Please give it a full read before submitting any contribution.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Submitting an Issue](#submitting-an-issue)
    - [Bug Reports](#bug-reports)
    - [Feature Requests](#feature-requests)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Local Development Setup](#local-development-setup)
- [Project Structure](#project-structure)
- [Coding Conventions](#coding-conventions)
- [Commit Conventions](#commit-conventions)
- [Deployment Notes](#deployment-notes)
- [License](#license)

---

## Code of Conduct

All participants are expected to follow these basic guidelines:

- Be friendly and inclusive; respect every contributor and classmate.
- Critique ideas, not people; keep discussions rational.
- No discrimination, harassment, or aggressive language in any form.
- Follow the maintainers' and the community's consensus; avoid endless debate.

Issues / PRs that violate the Code of Conduct may be closed, and the associated accounts may be restricted from participating.

---

## How Can I Contribute?

You don't have to write code! You can:

- Report bugs or suggest features (via Issues)
- Improve copy, documentation, and translations
- Polish page layout, styling, and interactions
- Add class materials, photos, or activity records
- Review other people's PRs and give feedback
- Help answer questions from others in the community

---

## Submitting an Issue

Before opening an Issue, please **search existing Issues** to avoid duplicates.

This repo provides two Issue templates:

| Template              | Purpose                                                    |
| --------------------- | ---------------------------------------------------------- |
| `bug-feedback`        | Report broken functionality, display glitches, dead links |
| `feature-request`     | Suggest new features or content sections                  |

Please fill out the matching template. Incomplete submissions may be asked for additional information.

### Bug Reports

Please include as much of the following as possible:

- A brief description of the problem
- Reproduction steps (how to trigger the bug)
- Expected behavior vs. actual behavior
- Browser and operating system versions
- Screenshots or screen recordings (if available)
- Any console errors (screenshots welcome)

### Feature Requests

Please try to cover:

- The problem or scenario you want to solve
- The expected outcome
- Possible alternatives or reference pages
- Whether you're willing to implement it yourself

---

## Submitting a Pull Request

### Basic Workflow

1. **Fork** this repository to your own account.
2. Create a new feature branch off of `main`:
   ```bash
   git checkout main
   git pull upstream main
   git checkout -b feat/your-feature-name
   ```
   Suggested branch naming:
   - `feat/xxx` — new feature
   - `fix/xxx` — bug fix
   - `docs/xxx` — documentation change
   - `style/xxx` — style tweaks
   - `refactor/xxx` — refactoring
   - `chore/xxx` — build / toolchain changes
3. Make your changes locally, and **make sure the build passes**:
   ```bash
   npm run build
   ```
4. Self-check before committing:
   - Pages render correctly across screen widths
   - All external resources use HTTPS
   - No leftover debug code or `console.log`
5. Push to your fork:
   ```bash
   git push origin feat/your-feature-name
   ```
6. Open a Pull Request on GitHub, **targeting the `main` branch**.
7. Wait for CI checks and maintainer review.

### PR Notes

- Keep each PR focused on a single concern; avoid huge PRs.
- If your PR fixes an Issue, link it with `Fixes #123` or `Closes #123` in the description.
- For UI / style changes, please attach **before / after** screenshots.
- Maintainers may ask for revisions; please stay patient and open-minded.

---

## Local Development Setup

### Requirements

- Node.js (the current LTS version is recommended)
- npm (installed together with Node.js)
- Git

### Clone and Install

```bash
git clone https://github.com/hjx-25pc1/hjx-25pc1.github.io.git
cd hjx-25pc1.github.io
npm install
```

### Common Commands

| Command            | Description                                                |
| ------------------ | ---------------------------------------------------------- |
| `npm run serve`    | Start the local dev server with hot reload                |
| `npm run build`    | Build the production bundle into `_site/`                  |
| `npm run watch`    | Watch files and rebuild without starting a server          |

Once the dev server is running, the terminal will print the local URL (usually `http://localhost:8080`). Open it in your browser to preview.

### Deployment Path Prefix

The site is deployed at the GitHub Pages root path (`/`), so please use Eleventy's `| url` filter when referencing assets in templates:

```njk
<link rel="stylesheet" href="{{ '/style/style.css' | url }}">
<a href="{{ '/about/' | url }}">About</a>
```

Avoid hard-coding the root path `/`; otherwise styles and links will break during local preview.

---

## Project Structure

> *(See `README.md` and the source tree for the canonical layout. In short: `src/` holds templates, content, and assets; `_site/` is the build output.)*

---

## Coding Conventions

To keep the codebase consistent, please follow these conventions:

### Styles

- Styles are split into multiple `.scss` files by responsibility, all maintained under `src/style/`.
- Shared variables live in `_variables.scss`, shared mixins in `_mixins.scss`. Add new modules as their own `.scss` files.
- The build entry (`.eleventy.js`) automatically picks up every non-underscore-prefixed `.scss` file under `src/style/` and compiles each to a minified CSS file.
- Avoid inline styles in templates unless absolutely necessary.

### Scripts

- Front-end scripts are organized as **native ES Modules** under `src/js/`, split by domain (e.g. `_dom`, `focus-trap`, `history-stack`, `popup`, `drawer`, `main`). No bundler is required.
- The entry `main.js` imports other modules via `import`. HTML templates **must** load it with `<script type="module" src="{{ '/js/main.js' | url }}">`, otherwise module imports will fail.
- When adding new scripts, follow the same granularity: pure utilities live in their own files; business modules are exposed as `initXxx(deps)` and orchestrated from `main.js` with dependencies injected at the entry point.
- Prefer `var` over `const` / `let` (for compatibility) unless you genuinely need block scope.
- Do not use inline scripts (e.g. `onclick="..."`) — they open the door to XSS.

### HTML

- Files must be valid HTML5, starting with `<!DOCTYPE html>`.
- Declare `lang="zh-CN"` on the `<html>` tag.
- Include `<meta charset="UTF-8">` and the viewport meta tag:
  ```html
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ```
- Use **4 spaces** for indentation, not tabs.

### Spacing Between Chinese and English

Add a single space between Chinese and English content, e.g.:

```markdown
本项目使用 Eleventy 构建，并部署在 GitHub Pages。
```

(This rule applies to any Chinese / English mix in the repo.)

### Security

- Never commit sensitive information (API keys, passwords, tokens, etc.) to the repo.
- Don't handle user input with inline scripts — protect against XSS.
- Always use HTTPS for external resources.

---

## Commit Conventions

- Commit messages may be written in **English or Chinese**, and should briefly describe the change.
- The Conventional Commits style is suggested but not required:

  ```
  feat: add new photo gallery section
  fix: correct broken navigation link on mobile
  docs: update contributing guide
  style: improve header layout on small screens
  refactor: extract card component into partial
  chore: bump eleventy to v3
  ```

- Keep each Commit focused on a single thing — easier to review and revert.

---

## Deployment Notes

- Only pushes to the `main` branch trigger deployment.
- GitHub Actions builds the project and publishes the `_site/` directory to GitHub Pages.
- In-flight deployments are not cancelled; queued intermediate deployments are skipped.
- **Do not** edit anything inside `_site/` directly — it will be overwritten on every build.
- Discuss CI changes with the maintainers in an Issue first.

After a successful deployment, the site is available at [https://hjx-25pc1.github.io](https://hjx-25pc1.github.io).

---

## Becoming a Contributor

Once your PR is merged, feel free to add yourself to `CONTRIBUTORS.md`:

```markdown
## Contributors

- **your-github-username** — short note on what you contributed
```

You can also ask the maintainers to add you in the PR.

---

## Contact

- Open an Issue: [GitHub Issues](https://github.com/hjx-25pc1/hjx-25pc1.github.io/issues)
- Maintainers: [mantoujun12](https://github.com/mantoujun12) / [mantoujun6](https://github.com/mantoujun6).

---

## License

This project is licensed under the [MIT License](./LICENSE). By submitting a contribution, you agree to license your code and documentation under the same terms.