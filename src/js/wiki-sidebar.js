/**
 * Wiki 侧边栏折叠控制
 * - PC 端：默认展开，可点击收起
 * - 移动端：默认收起（抽屉），点击按钮从左侧滑出
 * - 状态保存到 localStorage
 * - 移动端展开时给 <body> 加 .wiki-sidebar-open，复用 header 的统一遮罩
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'wiki-sidebar-collapsed';
    const MOBILE_BREAKPOINT = 769;
    const OPEN_CLASS = 'wiki-sidebar-open';

    function isMobile() {
        return window.innerWidth < MOBILE_BREAKPOINT;
    }

    function syncOverlay(layout) {
        if (isMobile()) {
            const open = !layout.classList.contains('wiki-sidebar-collapsed');
            document.body.classList.toggle(OPEN_CLASS, open);
        } else {
            document.body.classList.remove(OPEN_CLASS);
        }
    }

    function init() {
        const layout = document.querySelector('.wiki-layout');
        if (!layout) return;

        const sidebar = layout.querySelector('.wiki-sidebar');
        const toggle = document.querySelector('.wiki-sidebar-toggle');
        if (!sidebar || !toggle) return;

        // 初始化状态：
        // - 移动端：默认折叠（抽屉藏在屏幕外）
        // - PC 端：读取用户偏好
        if (isMobile()) {
            layout.classList.add('wiki-sidebar-collapsed');
        } else {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved === 'true') {
                layout.classList.add('wiki-sidebar-collapsed');
            }
        }
        syncOverlay(layout);

        // 切换按钮
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const collapsed = layout.classList.toggle('wiki-sidebar-collapsed');
            localStorage.setItem(STORAGE_KEY, String(collapsed));
            syncOverlay(layout);
        });

        // 移动端：点击统一遮罩（.overlay）关闭
        const overlay = document.querySelector('.overlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (!isMobile()) return;
                if (layout.classList.contains('wiki-sidebar-collapsed')) return;
                if (!document.body.classList.contains(OPEN_CLASS)) return;
                e.stopPropagation();
                layout.classList.add('wiki-sidebar-collapsed');
                localStorage.setItem(STORAGE_KEY, 'true');
                syncOverlay(layout);
            });
        }

        // 监听窗口大小变化，跨设备时同步状态
        let lastMobile = isMobile();
        window.addEventListener('resize', () => {
            const nowMobile = isMobile();
            if (nowMobile !== lastMobile) {
                lastMobile = nowMobile;
                if (nowMobile) {
                    layout.classList.add('wiki-sidebar-collapsed');
                }
                syncOverlay(layout);
            }
        });

        // ESC 键收起（仅 PC）
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' &&
                !layout.classList.contains('wiki-sidebar-collapsed') &&
                !isMobile()) {
                layout.classList.add('wiki-sidebar-collapsed');
                localStorage.setItem(STORAGE_KEY, 'true');
                syncOverlay(layout);
            }
        });

        // 自动滚动到当前活跃项
        scrollToActive(sidebar);
    }

    function scrollToActive(sidebar) {
        const active = sidebar.querySelector('a.active');
        if (!active) return;
        // 等动画完成后滚动，避免抖动
        requestAnimationFrame(() => {
            active.scrollIntoView({ block: 'center', behavior: 'smooth' });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();