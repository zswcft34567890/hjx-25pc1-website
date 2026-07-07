// ============================================================
// main.js — 移动端导航交互脚本
// ------------------------------------------------------------
// 职责：
//   1. 站点导航弹窗（.nav-popup）的打开/关闭与 ARIA 状态同步
//   2. 汉堡抽屉（#nav-toggle）的 History API 返回键拦截
//   3. 弹窗与抽屉的互斥调度（同时只能打开一个）
//   4. 弹窗内的焦点陷阱（Tab/Shift+Tab 循环，关闭后归还焦点）
//   5. 返回优先级：弹窗 > 抽屉 > 页面后退
//
// 封装为 IIFE 是为了不污染全局命名空间，避免变量泄漏到 window。
// ============================================================

(function () {
    'use strict';

    // ---- DOM 元素引用 ----
    var header = document.querySelector('header');
    var popupBtn = document.querySelector('.nav-popup-btn');      // 触发弹窗的导航按钮
    var popup = document.querySelector('.nav-popup');             // 弹窗容器（含 nav.njk 渲染的列表）
    var overlay = document.querySelector('.overlay');             // 全局统一遮罩层（抽屉与弹窗共用）
    var closeBtn = document.querySelector('.nav-popup-close');    // 弹窗内关闭按钮（仅移动端显示）
    var drawerCloseBtn = document.querySelector('.nav-drawer-close'); // 抽屉内关闭按钮（仅移动端显示）
    var navToggle = document.getElementById('nav-toggle');        // 抽屉的 checkbox 开关

    // 关键元素缺失时直接退出，避免后续报错（优雅降级）
    if (!header || !popupBtn || !popup) return;

    // ---- History API 能力检测 ----
    // 旧浏览器不支持 pushState/popstate 时，跳过返回键拦截，保留遮罩点击/ESC 关闭
    var supportsHistory = !!(window.history && typeof window.history.pushState === 'function');

    // ---- 状态追踪 ----
    var popupOpen = false;     // 弹窗是否打开
    var drawerOpen = false;    // 抽屉是否打开
    var historySlot = false;   // 是否已向 history 栈推入一条「菜单状态」记录（弹窗与抽屉共用一个槽位，因互斥）
    var lastFocused = null;    // 打开菜单前的焦点元素，关闭后归还

    // ============================================================
    // 弹窗（.nav-popup）的打开与关闭
    // ============================================================

    // 打开弹窗
    function openPopup() {
        // 互斥：若抽屉正打开，静默关闭它（不触碰 history，复用槽位）
        if (drawerOpen) {
            closeDrawer(false); // 弹窗互斥关闭抽屉时，history 槽位保留给弹窗
        }

        header.classList.add('nav-popup-open');
        popupBtn.setAttribute('aria-expanded', 'true'); // 同步 ARIA 状态供屏幕阅读器播报
        popupOpen = true;

        // 首次打开菜单时推入 history 记录，用于拦截系统返回键
        if (!historySlot && supportsHistory) {
            history.pushState({ navMenu: true }, '');
            historySlot = true;
        }

        // 焦点管理：记录当前焦点 → 移入弹窗内首个可见可聚焦元素
        lastFocused = document.activeElement;
        focusFirstInPopup();
    }

    // 关闭弹窗
    // 参数 skipHistory：为 true 表示由 popstate 触发（history 已自动回退，无需再 back）
    function closePopup(skipHistory) {
        header.classList.remove('nav-popup-open');
        popupBtn.setAttribute('aria-expanded', 'false');
        popupOpen = false;

        // 若此前推入了 history 记录且本次非 popstate 触发，则主动 back 清理栈
        if (historySlot && !skipHistory) {
            historySlot = false;
            history.back(); // 异步触发 popstate，但 popupOpen 已为 false，回调不会再处理
        } else if (skipHistory) {
            historySlot = false;
        }

        // 归还焦点到触发按钮，便于键盘用户继续操作
        restoreFocus();
    }

    // ============================================================
    // 抽屉（#nav-toggle）的打开与关闭
    // 抽屉由 CSS checkbox hack 驱动，这里监听 change 事件做 history 同步
    // ============================================================

    if (navToggle) {
        navToggle.addEventListener('change', function () {
            if (navToggle.checked) {
                // 用户打开抽屉
                // 互斥：若弹窗正打开，静默关闭（复用 history 槽位，不 back）
                if (popupOpen) {
                    header.classList.remove('nav-popup-open');
                    popupBtn.setAttribute('aria-expanded', 'false');
                    popupOpen = false;
                }
                header.classList.add('nav-drawer-open');
                drawerOpen = true;
                if (!historySlot && supportsHistory) {
                    history.pushState({ navMenu: true }, '');
                    historySlot = true;
                }
            } else {
                // 用户关闭抽屉
                header.classList.remove('nav-drawer-open');
                drawerOpen = false;
                if (historySlot) {
                    historySlot = false;
                    history.back(); // 清理 history 栈
                }
            }
        });
    }

    // 关闭抽屉（供程序化触发：关闭按钮、遮罩、ESC、popstate）
    // 注意：navToggle.checked = false 不会触发 change 事件，必须手动同步类/状态/history
    // 参数 manageHistory：true（默认）= 主动 back() 清理 history 栈；false = 不触碰（用于 popstate 回调内）
    function closeDrawer(manageHistory) {
        if (manageHistory === undefined) manageHistory = true;
        if (!drawerOpen && !navToggle.checked) return; // 已关闭，跳过
        header.classList.remove('nav-drawer-open');
        drawerOpen = false;
        navToggle.checked = false; // 同步 checkbox 状态（无副作用：change 不会重入）
        if (manageHistory && historySlot) {
            historySlot = false;
            history.back(); // 清理 history 栈
        }
    }

    // ============================================================
    // 焦点陷阱：弹窗打开时 Tab/Shift+Tab 在弹窗内循环
    // ============================================================

    // 将焦点移至弹窗内首个可见可聚焦元素（关闭按钮或首个链接）
    function focusFirstInPopup() {
        var focusable = getVisibleFocusable(popup);
        if (focusable.length) {
            focusable[0].focus();
        }
    }

    // 获取容器内所有可见可聚焦元素（display:none 的元素无法接收焦点）
    function getVisibleFocusable(container) {
        var candidates = container.querySelectorAll(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        var visible = [];
        for (var i = 0; i < candidates.length; i++) {
            // offsetParent 为 null 表示元素不可见（display:none 或祖先隐藏）
            if (candidates[i].offsetParent !== null) {
                visible.push(candidates[i]);
            }
        }
        return visible;
    }

    // 处理 Tab 键焦点循环：到末尾后跳回首部，到首部按 Shift+Tab 跳到末尾
    function trapFocus(e) {
        var focusable = getVisibleFocusable(popup);
        if (!focusable.length) return;

        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        if (e.shiftKey) {
            // Shift+Tab：在首个元素上按则跳到末尾
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            // Tab：在末尾元素上按则跳回首部
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }

    // 归还焦点到打开菜单前的元素
    function restoreFocus() {
        if (lastFocused && typeof lastFocused.focus === 'function') {
            lastFocused.focus();
        }
    }

    // ============================================================
    // 事件绑定
    // ============================================================

    // 导航按钮点击：切换弹窗
    popupBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation(); // 阻止冒泡到 document，避免触发外部点击关闭逻辑
        if (popupOpen) {
            closePopup();
        } else {
            openPopup();
        }
    });

    // 关闭按钮点击（移动端可见，桌面端 display:none 不响应）
    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            closePopup();
        });
    }

    // 抽屉关闭按钮点击：调用 closeDrawer() 统一处理
    if (drawerCloseBtn && navToggle) {
        drawerCloseBtn.addEventListener('click', function () {
            closeDrawer();
        });
    }

    // 统一遮罩层点击关闭：按优先级关闭弹窗 > 抽屉
    if (overlay) {
        overlay.addEventListener('click', function () {
            if (popupOpen) {
                closePopup();
            } else if (drawerOpen) {
                closeDrawer();
            }
        });
    }

    // 点击 header 外部区域关闭弹窗（桌面端下拉面板的主要关闭方式）
    document.addEventListener('click', function (e) {
        if (popupOpen && !header.contains(e.target)) {
            closePopup();
        }
    });

    // 键盘事件：ESC 关闭 + Tab 焦点陷阱
    document.addEventListener('keydown', function (e) {
        // ESC：优先关弹窗，其次关抽屉
        if (e.key === 'Escape') {
            if (popupOpen) {
                closePopup();
            } else if (drawerOpen) {
                closeDrawer();
            }
        }
        // Tab：弹窗打开时启用焦点陷阱
        if (popupOpen && e.key === 'Tab') {
            trapFocus(e);
        }
    });

    // ============================================================
    // History API 返回键拦截
    // 监听 popstate：系统返回键/手势触发时，按优先级关闭菜单而非退出页面
    // ============================================================

    if (supportsHistory) {
        window.addEventListener('popstate', function () {
            // 优先级：弹窗 > 抽屉
            if (popupOpen) {
                // popstate 触发说明 history 已回退，传 skipHistory=true 避免重复 back
                closePopup(true);
            } else if (drawerOpen) {
                // popstate 已自动回退 history，传 manageHistory=false 避免重复 back
                closeDrawer(false);
            }
            // 两者均关闭时 popstate 不做处理，执行浏览器默认后退行为
        });
    }
})();
