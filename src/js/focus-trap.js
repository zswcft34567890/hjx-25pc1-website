// ============================================================
// focus-trap.js — 焦点陷阱工具集
// ------------------------------------------------------------
// 职责：
//   1. 查询容器内可见可聚焦元素（用于弹窗/抽屉内的 Tab 循环）
//   2. 处理 Tab / Shift+Tab 焦点首尾循环
//   3. 记忆与归还焦点（菜单打开前/关闭后）
//
// 与具体菜单无关，纯工具函数。被 popup.js 复用，
// 未来若抽屉需要焦点管理也可直接引用。
//
// 兼容性：使用 var 而非 const/let，延续 main.js 的代码风格。
// ============================================================

// ---- 状态：记忆打开菜单前的活动元素 ----
var lastFocused = null;

// 记录当前焦点（菜单打开前调用）
export function rememberFocus() {
    lastFocused = document.activeElement;
}

// 归还焦点到记忆的元素（菜单关闭后调用）
export function restoreFocus() {
    if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
    }
}

// 获取容器内所有可见可聚焦元素
// display:none 的元素无法接收焦点，通过 offsetParent 过滤
export function getVisibleFocusable(container) {
    var candidates = container.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    var visible = [];
    for (var i = 0; i < candidates.length; i++) {
        if (candidates[i].offsetParent !== null) {
            visible.push(candidates[i]);
        }
    }
    return visible;
}

// 将焦点移至容器内首个可见可聚焦元素
export function focusFirst(container) {
    var focusable = getVisibleFocusable(container);
    if (focusable.length) {
        focusable[0].focus();
    }
}

// 处理 Tab 键焦点循环：到末尾后跳回首部，到首部按 Shift+Tab 跳到末尾
export function trapFocus(e, container) {
    var focusable = getVisibleFocusable(container);
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
