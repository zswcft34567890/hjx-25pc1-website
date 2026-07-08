/**
 * Wiki 侧边栏折叠控制
 * - PC 端：默认展开，可点击收起
 * - 移动端：默认收起（抽屉），点击按钮从左侧滑出
 * - 状态保存到 localStorage
 */

(function () {
    const STORAGE_KEY = 'wiki-sidebar-collapsed';
    const MOBILE_BREAKPOINT = 769;

    function isMobile() {
        return window.innerWidth < MOBILE_BREAKPOINT;
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

        // 切换按钮
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const collapsed = layout.classList.toggle('wiki-sidebar-collapsed');
            // 移动端的折叠状态持久化，PC 端也保存
            localStorage.setItem(STORAGE_KEY, String(collapsed));
        });

        // 移动端：点击抽屉外部（遮罩区域）关闭
        document.addEventListener('click', (e) => {
            if (!isMobile()) return;
            if (layout.classList.contains('wiki-sidebar-collapsed')) return;
            // 点击的不是抽屉内部，也不是按钮 → 关闭
            if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
                layout.classList.add('wiki-sidebar-collapsed');
                localStorage.setItem(STORAGE_KEY, 'true');
            }
        });

        // 监听窗口大小变化，跨设备时同步状态
        let lastMobile = isMobile();
        window.addEventListener('resize', () => {
            const nowMobile = isMobile();
            if (nowMobile !== lastMobile) {
                lastMobile = nowMobile;
                // 切到移动端：强制折叠
                if (nowMobile) {
                    layout.classList.add('wiki-sidebar-collapsed');
                }
            }
        });

        // ESC 键收起（仅 PC）
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' &&
                !layout.classList.contains('wiki-sidebar-collapsed') &&
                !isMobile()) {
                layout.classList.add('wiki-sidebar-collapsed');
                localStorage.setItem(STORAGE_KEY, 'true');
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();