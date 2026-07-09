/**
 * 把 src/wiki/**.md 同步到 GitHub Wiki 仓库
    用法：node scripts / sync - wiki.js
**/

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'src', 'wiki');
const SRC_INDEX = path.join(ROOT, 'src', 'wiki.md');
const WIKI_DIR = path.join(ROOT, '.wiki-tmp');
const WIKI_REPO = 'https://github.com/hjx-25pc1/hjx-25pc1.github.io.wiki.git';

// 递归收集 SRC_DIR 下所有 .md 文件，返回 [{ absPath, relPath }]
function collectMarkdownFiles(dir, base = dir) {
    const out = [];
    if (!fs.existsSync(dir)) return out;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const abs = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            out.push(...collectMarkdownFiles(abs, base));
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
            out.push({ absPath: abs, relPath: path.relative(base, abs) });
        }
    }
    return out;
}

// 去掉 YAML frontmatter，兼容 \r\n / \n
function stripFrontmatter(content) {
    const match = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
    return match ? content.slice(match[0].length).replace(/^\s+/, '') : content;
}

// 从 YAML 文本里抽取 title / description
function parseFrontmatter(fm) {
    const result = { title: '', description: '' };
    const titleMatch = fm.match(/^title:\s*(.+)$/m);
    const descMatch = fm.match(/^description:\s*(.+)$/m);
    if (titleMatch) result.title = titleMatch[1].trim();
    if (descMatch) result.description = descMatch[1].trim();
    return result;
}

// 读取 .md 文件，返回 { title, description }，出错时返回空对象
function readEntry(absPath) {
    try {
        const raw = fs.readFileSync(absPath, 'utf8');
        const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
        if (!fmMatch) return { title: path.basename(absPath, '.md'), description: '' };
        return parseFrontmatter(fmMatch[1]);
    } catch (e) {
        return { title: path.basename(absPath, '.md'), description: '' };
    }
}

// 按顶级子目录分组条目；顶层文件归入 "(root)"
function groupByCategory(entries) {
    const groups = new Map();
    for (const e of entries) {
        const parts = e.relPath.split(path.sep);
        const category = parts.length > 1 ? parts[0] : '(root)';
        if (!groups.has(category)) groups.set(category, []);
        groups.get(category).push(e);
    }
    return groups;
}

// 生成 Home.md：按分组罗列所有条目
function buildHomeMarkdown(entries) {
    const groups = groupByCategory(entries);

    // 稳定排序：根目录优先，其它按字母序
    const sortedKeys = [...groups.keys()].sort((a, b) => {
        if (a === '(root)') return -1;
        if (b === '(root)') return 1;
        return a.localeCompare(b);
    });

    const sections = sortedKeys.map(cat => {
        const items = groups.get(cat)
            .map(e => {
                const { title, description } = readEntry(e.absPath);
                return `- **${title}**${description ? ` — ${description}` : ''}`;
            })
            .join('\n');
        const heading = cat === '(root)' ? '## 通用' : `## ${cat}`;
        return `${heading}\n\n${items}`;
    }).join('\n\n');

    return `# Wiki

这里是 25 计算机应用 1 班的集体 Wiki，由同学们共同维护。

## 所有条目

${sections}

## 如何贡献

在 \`src/wiki/\` 目录下新建 \`.md\` 文件，参考仓库内的模板填写。
`;
}

function sync() {
    // 1. 准备 wiki 目录
    if (fs.existsSync(WIKI_DIR)) {
        execSync(`git -C "${WIKI_DIR}" pull`, { stdio: 'inherit' });
    } else {
        execSync(`git clone "${WIKI_REPO}" "${WIKI_DIR}"`, { stdio: 'inherit' });
    }

    // 2. 递归收集所有 .md，复制到 WIKI_DIR（保留目录结构）
    const entries = collectMarkdownFiles(SRC_DIR);
    for (const e of entries) {
        const dest = path.join(WIKI_DIR, e.relPath);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        const content = fs.readFileSync(e.absPath, 'utf8');
        fs.writeFileSync(dest, stripFrontmatter(content));
    }
    console.log(`已同步 ${entries.length} 个条目（含子目录）`);

    // 3. 生成 Home.md
    if (fs.existsSync(SRC_INDEX)) {
        fs.writeFileSync(path.join(WIKI_DIR, 'Home.md'), buildHomeMarkdown(entries));
        console.log('已生成 Home.md');
    }

    // 4. 提交并推送
    execSync(`git -C "${WIKI_DIR}" add .`, { stdio: 'inherit' });
    const status = execSync(`git -C "${WIKI_DIR}" status --porcelain`).toString();
    if (status.trim()) {
        execSync(`git -C "${WIKI_DIR}" commit -m "docs: 同步 Wiki"`, { stdio: 'inherit' });
        execSync(`git -C "${WIKI_DIR}" push`, { stdio: 'inherit' });
        console.log('已推送到 Wiki');
    } else {
        console.log('无变更，跳过推送');
    }
}

sync();