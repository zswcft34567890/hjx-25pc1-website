# Security Policy

> 📖 [Contributing Guide](CONTRIBUTING.md) · 💬 [Support](SUPPORT.md) · 📜 [Code of Conduct](CODE_OF_CONDUCT.md)
>
> 🌐 [简体中文](docs/SECURITY_zh-cn.md)

## Supported Versions

The following table lists which versions of the class website currently receive security updates:

| Version | Supported          |
| ------- | ------------------ |
| Latest  | ✅ Actively maintained |
| Older   | ❌ No longer maintained |

## Reporting a Vulnerability

We take security issues very seriously. If you discover a security vulnerability, please **DO NOT** report it through public Issues or Discussions. Instead, use one of the private channels below to contact us:

### 📧 Email

Send an email to: **3881679030@qq.com** or **2064074143@qq.com**

Please include the following in your email:

- A brief description of the vulnerability
- Steps to reproduce (including screenshots or screen recordings if possible)
- Impact scope (which pages / features are affected)
- Possible fix suggestions (if you have any)

### 🔒 GitHub Private Vulnerability Reporting

If you prefer the GitHub workflow, you can use [private vulnerability reporting](https://github.com/hjx-25pc1/hjx-25pc1.github.io/security/advisories/new):

1. Go to the repository's **Security** tab
2. Click **Report a vulnerability**
3. Fill in the vulnerability details

## Response Time

Response time depends on the severity of the vulnerability. For example, if you discover a particularly severe issue, it will be addressed immediately.

## Bug Bounty

As a class project, we **do not offer cash rewards**, but we will:

- Credit you in the fix announcement
- Add your contribution to `CONTRIBUTORS.md`

## Security Practices

This project follows these security practices:

- ✅ All external resources are served over HTTPS
- ✅ No inline scripts are used to handle user input
- ✅ Dependencies are updated automatically via Dependabot
- ✅ Critical changes must be reviewed through a Pull Request
- ✅ GitHub Actions automatically runs CodeQL security scanning
