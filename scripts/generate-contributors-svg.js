/**
 * 拉取当前仓库的贡献者列表，生成可点击跳转的 SVG 头像墙。
 * 头像直接嵌入为 base64，避免跨域或外链问题。
 *
 * 用法:
 *   GITHUB_TOKEN=xxx GITHUB_REPOSITORY=owner/repo node scripts/generate-contributors-svg.js
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
const FONT_SIZE = 12;            // 标签字体大小（px）
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
 * 下载头像并转成 base64 data URL（嵌入 SVG，避免外链失效 / 跨域问题）。
 */
async function fetchAvatarAsDataURL(avatarUrl) {
    const res = await fetch(avatarUrl, {
        headers: { 'User-Agent': 'contributors-svg-generator' },
    });
    if (!res.ok) {
        throw new Error(`下载头像失败: ${res.status} ${avatarUrl}`);
    }
    const arrayBuffer = await res.arrayBuffer();
    const contentType = res.headers.get('content-type') || 'image/png';
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    return `data:${contentType};base64,${base64}`;
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
    <image x="${cx - AVATAR_SIZE / 2}" y="${cy - AVATAR_SIZE / 2}" width="${AVATAR_SIZE}" height="${AVATAR_SIZE}" clip-path="circle(${AVATAR_SIZE / 2}px at ${cx}px ${cy}px)" href="${c.avatarDataURL}"/>
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

    // 顺序下载头像（避免并发过高被 GitHub 限流）
    console.log('▶ 下载并嵌入头像…');
    for (let i = 0; i < contributors.length; i++) {
        const c = contributors[i];
        try {
            // 优先使用 size=80 的头像，质量 + 大小平衡
            c.avatarDataURL = await fetchAvatarAsDataURL(`${c.avatar_url}&s=${AVATAR_SIZE}`);
        } catch (err) {
            console.warn(`  ! 跳过 ${c.login}: ${err.message}`);
            // 用 1x1 透明像素占位
            c.avatarDataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
        }
        process.stdout.write(`\r  进度: ${i + 1}/${contributors.length}`);
    }
    process.stdout.write('\n');

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
        avatar_url: c.avatar_url ? c.avatar_url.split('?')[0] + `?s=${AVATAR_SIZE}` : null,
        html_url: c.html_url || `https://github.com/${c.login}`,
    }));
    fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), 'utf8');
    console.log(`✓ 已生成: ${jsonPath} (${contributors.length} 人)`);
}

main().catch(err => {
    console.error('✗ 失败:', err.message);
    process.exit(1);
});
