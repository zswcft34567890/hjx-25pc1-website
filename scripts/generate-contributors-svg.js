/**
 * 拉取当前仓库的贡献者列表，生成可点击跳转的 SVG 头像墙。
 * 头像使用 GitHub 外链 URL（不嵌入 base64），文件保持极小（~1.5 KB）。
 *
 * 用法:
 *   GITHUB_TOKEN=xxx GITHUB_REPOSITORY=owner/repo node scripts/generate-contributors-svg.js
 *   或
 *   GITHUB_REPOSITORY=owner/repo ALLOW_FALLBACK=1 node scripts/generate-contributors-svg.js
 *   或（在仓库内）
 *   npm run generate:contributors
 *
 * 依赖: 无（只使用 Node.js 内置 fetch / fs / path）
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ========== 配置 ==========
const AVATAR_SIZE = 80;          // 头像直径（px）
const PADDING = 8;               // 头像之间的间距（px）
const COLUMNS = 8;               // 每行头像数
const MARGIN = 20;               // 外边距（px）
const BG_COLOR = 'transparent';  // SVG 背景（透明）
const BORDER_RADIUS = AVATAR_SIZE / 2; // 圆形头像
const MAX_CONTRIBUTORS = 100;    // 最多展示人数
const OUTPUT_PATH = path.join(
    'src',
    'assets',
    'img',
    'contributors.svg'
);
// ========================

function envOrThrow(name) {
    const v = process.env[name];
    if (!v) {
        throw new Error(`缺少环境变量: ${name}`);
    }
    return v;
}

/**
 * 用 GitHub API 拉取贡献者列表（含匿名）。
 */
async function fetchContributors(repo, token) {
    const url = `https://api.github.com/repos/${repo}/contributors?per_page=100&anon=true`;
    const res = await fetch(url, {
        headers: {
            'Accept': 'application/vnd.github+json',
            'User-Agent': 'contributors-svg-generator',
            'X-GitHub-Api-Version': '2022-11-28',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`GitHub API 调用失败: ${res.status} ${res.statusText}\n${text}`);
    }

    const data = await res.json();
    // 过滤掉没有 login 的匿名用户
    return data.filter(c => c && c.login);
}

/**
 * 把 GitHub 头像 URL 规范化为带 size 参数的地址。
 * 使用外链而非 base64 嵌入：让 SVG 文件保持极小（几 KB），
 * 同时头像始终是 GitHub 上最新的，无需重新生成 SVG。
 */
function normalizeAvatarUrl(avatarUrl) {
    if (!avatarUrl) return null;
    // 去掉已有 query，统一追加 ?s=80
    const base = avatarUrl.split('?')[0];
    return `${base}?s=${AVATAR_SIZE}`;
}

/**
 * 构造 SVG 字符串。
 * 每个头像是一个 <a><circle/><image/></a>，整张可作为 <img> 引入。
 */
function buildSVG(contributors) {
    const cellSize = AVATAR_SIZE + PADDING;
    const rows = Math.ceil(contributors.length / COLUMNS);
    const width = MARGIN * 2 + COLUMNS * cellSize - PADDING;
    const height = MARGIN * 2 + rows * cellSize - PADDING;

    const items = contributors.map((c, i) => {
        const col = i % COLUMNS;
        const row = Math.floor(i / COLUMNS);
        const cx = MARGIN + col * cellSize + AVATAR_SIZE / 2;
        const cy = MARGIN + row * cellSize + AVATAR_SIZE / 2;
        const href = c.html_url || `https://github.com/${c.login}`;

        // 头像作为 <image> 嵌入，外层套 <a>，这样 SVG 作为 <img> 引入时，
        // 浏览器会把整张 SVG 渲染，但内部的 <a> 仍保留超链接语义。
        return `  <a href="${href}" target="_blank" rel="noopener noreferrer">
    <title>${escapeXml(c.login)}${c.contributions ? ` · ${c.contributions} contributions` : ''}</title>
    <circle cx="${cx}" cy="${cy}" r="${BORDER_RADIUS}" fill="#fff" stroke="rgba(0,0,0,0.08)" stroke-width="1"/>
    <image x="${cx - AVATAR_SIZE / 2}" y="${cy - AVATAR_SIZE / 2}" width="${AVATAR_SIZE}" height="${AVATAR_SIZE}" clip-path="circle(${AVATAR_SIZE / 2}px at ${cx}px ${cy}px)" href="${c.avatarExternalUrl}"/>
  </a>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Contributors">
<style>
  a:hover image { opacity: 0.8; }
  a:hover circle { stroke: #0969da; stroke-width: 2; }
  text { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
</style>
<rect width="100%" height="100%" fill="${BG_COLOR}"/>
${items}
</svg>
`;
}

function escapeXml(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/**
 * 用固定数据兜底：当网络/限流等问题导致 API 失败时使用，方便本地调试。
 * 头像用 1x1 透明像素占位。
 */
function getFallbackContributors(repo) {
    const placeholders = [
        { login: 'mantoujun12', contributions: 100, html_url: 'https://github.com/mantoujun12' },
        { login: 'mantoujun6', contributions: 50, html_url: 'https://github.com/mantoujun6' },
        { login: 'zswcft34567890', contributions: 5, html_url: 'https://github.com/zswcft34567890' },
    ];
    return placeholders.map(c => ({
        ...c,
        avatar_url: `https://github.com/${c.login}.png`,
    }));
}

async function main() {
    const repo = envOrThrow('GITHUB_REPOSITORY');
    const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';

    console.log(`▶ 拉取 ${repo} 的贡献者列表…`);
    let contributors;
    try {
        contributors = await fetchContributors(repo, token);
    } catch (err) {
        console.warn(`  ! 拉取失败: ${err.message}`);
        if (process.env.ALLOW_FALLBACK === '1') {
            console.warn('  → 使用本地占位数据继续生成（仅用于本地调试 SVG 结构）');
            contributors = getFallbackContributors(repo);
        } else {
            throw err;
        }
    }
    console.log(`  共 ${contributors.length} 位贡献者`);

    if (contributors.length === 0) {
        console.warn('⚠ 没有找到任何贡献者，仍生成空 SVG 占位');
    }

    // 按贡献数降序
    contributors.sort((a, b) => (b.contributions || 0) - (a.contributions || 0));
    if (contributors.length > MAX_CONTRIBUTORS) {
        contributors = contributors.slice(0, MAX_CONTRIBUTORS);
    }

    // 头像使用 GitHub 外链 URL（不嵌入 base64，文件保持极小）
    for (let i = 0; i < contributors.length; i++) {
        contributors[i].avatarExternalUrl = normalizeAvatarUrl(contributors[i].avatar_url);
    }

    const svg = buildSVG(contributors);

    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, svg, 'utf8');
    console.log(`✓ 已生成: ${OUTPUT_PATH} (${(svg.length / 1024).toFixed(1)} KB, ${contributors.length} 人)`);

    // 同时生成一份 JSON，供页面用普通 <a><img> 渲染（确保点击跳转稳定生效）
    const jsonPath = OUTPUT_PATH.replace(/\.svg$/, '.json');
    const jsonData = contributors.map(c => ({
        login: c.login,
        name: c.name || c.login,
        contributions: c.contributions || 0,
        avatar_url: c.avatarExternalUrl,
        html_url: c.html_url || `https://github.com/${c.login}`,
    }));
    fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), 'utf8');
    console.log(`✓ 已生成: ${jsonPath} (${contributors.length} 人)`);
}

main().catch(err => {
    console.error('✗ 失败:', err.message);
    process.exit(1);
});
