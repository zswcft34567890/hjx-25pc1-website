/**
 * 把 src/wiki/*.md 和 src/wiki.md 同步到 GitHub Wiki 仓库
 * 用法：node scripts/sync-wiki.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'src', 'wiki');
const SRC_INDEX = path.join(ROOT, 'src', 'wiki.md');
const WIKI_DIR = path.join(ROOT, '.wiki-tmp');
const WIKI_REPO = 'https://github.com/hjx-25pc1/hjx-25pc1.github.io.wiki.git';

function stripFrontmatter(content) {
    // 去掉 YAML frontmatter，兼容 \r\n / \n
    const match = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
    return match ? content.slice(match[0].length).replace(/^\s+/, '') : content;
}

function buildHomeMarkdown() {
    // 把 src/wiki/*.md 的标题拼成 Home.md 的列表
    const files = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.md'));
    const entries = files.map(file => {
        const raw = fs.readFileSync(path.join(SRC_DIR, file), 'utf8');
        const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
        let title = file.replace(/\.md$/, '');
        let description = '';
        if (fmMatch) {
            const fm = fmMatch[1];
            const titleMatch = fm.match(/^title:\s*(.+)$/m);
            const descMatch = fm.match(/^description:\s*(.+)$/m);
            if (titleMatch) title = titleMatch[1].trim();
            if (descMatch) description = descMatch[1].trim();
        }
        return { title, description };
    });

    const list = entries
        .map(e => `- **${e.title}**${e.description ? ` — ${e.description}` : ''}`)
        .join('\n');

    return `# 知识库

这里是 25 计算机应用 1 班的集体知识沉淀，由同学们共同维护。

## 所有条目

${list}

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

    // 2. 复制 wiki/*.md
    const files = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.md'));
    for (const file of files) {
        const content = fs.readFileSync(path.join(SRC_DIR, file), 'utf8');
        fs.writeFileSync(path.join(WIKI_DIR, file), stripFrontmatter(content));
    }
    console.log(`已同步 ${files.length} 个条目`);

    // 3. 生成 Home.md
    if (fs.existsSync(SRC_INDEX)) {
        fs.writeFileSync(path.join(WIKI_DIR, 'Home.md'), buildHomeMarkdown());
        console.log('已生成 Home.md');
    }

    // 4. 提交并推送
    execSync(`git -C "${WIKI_DIR}" add .`, { stdio: 'inherit' });
    const status = execSync(`git -C "${WIKI_DIR}" status --porcelain`).toString();
    if (status.trim()) {
        execSync(`git -C "${WIKI_DIR}" commit -m "docs: 同步知识库"`, { stdio: 'inherit' });
        execSync(`git -C "${WIKI_DIR}" push`, { stdio: 'inherit' });
        console.log('已推送到 Wiki');
    } else {
        console.log('无变更，跳过推送');
    }
}

sync();