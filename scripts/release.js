/**
 * 构建并打包 _site 为 zip 发行版
 * 用法：npm run release [-- 1.2.3]
 *       不传版本号时，从 package.json 读取
 *       不传版本号时自动加 -<日期>-<commit-hash> 后缀
 *
 * 输出：dist/hjx-25pc1.github.io-<version>.zip
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT, 'dist');
const SITE_DIR = path.join(ROOT, '_site');
const PKG = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));

function shortHash() {
    try {
        return execSync('git rev-parse --short HEAD', { cwd: ROOT }).toString().trim();
    } catch {
        return 'nogit';
    }
}

function getVersion() {
    // 命令行参数优先
    const cliVer = process.argv[2];
    if (cliVer) return cliVer.replace(/^v/, '');

    const base = PKG.version || '0.0.0';
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `${base}-${date}-${shortHash()}`;
}

function build() {
    console.log('> 正在构建 _site ...');
    execSync('npm run build', { cwd: ROOT, stdio: 'inherit' });
}

function zip(version) {
    if (!fs.existsSync(SITE_DIR)) {
        throw new Error('未找到 _site 目录，请先 npm run build');
    }

    fs.mkdirSync(DIST_DIR, { recursive: true });
    const zipName = `hjx-25pc1.github.io-${version}.zip`;
    const zipPath = path.join(DIST_DIR, zipName);

    // PowerShell 的 Compress-Archive 在 Windows 10+ 自带，跨平台也方便
    const cmd =
        process.platform === 'win32'
            ? `powershell -NoProfile -Command "Compress-Archive -Path '${SITE_DIR}\\*' -DestinationPath '${zipPath}' -Force"`
            : `cd "${SITE_DIR}" && zip -r "${zipPath}" .`;

    console.log(`> 正在打包 ${zipName} ...`);
    execSync(cmd, { stdio: 'inherit' });
    console.log(`> 已生成 ${zipPath}`);
}

function main() {
    const version = getVersion();
    build();
    zip(version);
}

main();