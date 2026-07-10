// ============================================================
// contributors.js — 贡献者头像墙
// ------------------------------------------------------------
// 职责：
//   1. 查找页面上的 #contributors-grid 容器
//   2. 从 data-src 指定的 JSON（由 GitHub Action 生成）拉取贡献者数据
//   3. 把每个贡献者渲染为 <a><img></a>，点击跳转到对应 GitHub 主页
//   4. 失败时显示降级提示，不抛错
// 数据格式（contributors.json）：
//   [{ login, name, contributions, avatar_url, html_url }, ...]
// ============================================================

const GRID_ID = 'contributors-grid';
const LOADING_CLASS = 'contributors-loading';

// 渲染单个贡献者头像
// 参数 c : { login, name, contributions, avatar_url, html_url }
function renderContributor(c) {
    const a = document.createElement('a');
    a.href = c.html_url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'contributor-item';
    a.title = `${c.name || c.login} · ${c.contributions || 0} contributions`;

    const img = document.createElement('img');
    img.src = c.avatar_url;
    img.alt = c.name || c.login;
    img.loading = 'lazy';
    img.width = 80;
    img.height = 80;

    a.appendChild(img);
    return a;
}

// 渲染整个列表
// 参数 contributors : 贡献者数组
// 参数 grid : 容器元素
function renderList(contributors, grid) {
    grid.textContent = '';
    if (!Array.isArray(contributors) || contributors.length === 0) {
        grid.textContent = '暂无贡献者数据';
        return;
    }
    const frag = document.createDocumentFragment();
    for (let i = 0; i < contributors.length; i++) {
        frag.appendChild(renderContributor(contributors[i]));
    }
    grid.appendChild(frag);
}

// 显示错误/降级提示
// 参数 grid : 容器元素
// 参数 msg : 提示文本
function showError(grid, msg) {
    grid.textContent = msg;
}

// 拉取并渲染
// 参数 grid : 容器元素
function loadContributors(grid) {
    const src = grid.dataset.src;
    if (!src) {
        showError(grid, '未配置贡献者数据源');
        return;
    }

    fetch(src, { headers: { 'Accept': 'application/json' } })
        .then(function (res) {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then(function (data) { renderList(data, grid); })
        .catch(function (err) {
            // 静默降级：保留占位文案，不抛错
            // ignore: 网络失败 / 文件未生成 时常见
            showError(grid, '贡献者数据暂不可用');
        });
}

(function () {
    'use strict';

    // 关键元素缺失时直接退出（优雅降级）
    const grid = document.getElementById(GRID_ID);
    if (!grid) return;

    // JSON 数据可能尚未生成（首次部署 / Action 未跑过）
    // 此时直接显示提示，避免 fetch 404 后出现闪烁
    if (grid.dataset.src) {
        loadContributors(grid);
    } else {
        showError(grid, '未配置贡献者数据源');
    }
})();
