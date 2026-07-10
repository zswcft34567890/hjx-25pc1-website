// ============================================================
// popup.js — 站点导航弹窗
// ------------------------------------------------------------
// 职责：
//   1. 站点导航弹窗（.nav-popup）的打开/关闭与 ARIA 状态同步
//   2. 弹窗内的焦点陷阱（Tab/Shift+Tab 循环，关闭后归还焦点）
//   3. 与抽屉互斥：弹窗打开时若抽屉正打开则静默关闭
//
// 关键行为：
//   - ARIA 状态：aria-expanded 同步切换
//   - 焦点管理：打开时记住原焦点 → 移入弹窗首个可聚焦元素；
//     关闭时归还焦点到原元素
//   - 互斥时复用 history 槽位（manageHistory=false）
//
// 依赖：
//   - _dom.js: header / popupBtn / popup / closeBtn 引用
//   - focus-trap.js: rememberFocus / restoreFocus / focusFirst / trapFocus
//   - history-stack.js: acquireSlot / releaseSlot / markReleased / getSlotOwner
//   - onDrawerClose（由 main.js 注入）：弹窗打开时关闭抽屉的回调
// ============================================================

import { dom } from './_dom.js';
import { rememberFocus, restoreFocus, focusFirst, trapFocus } from './focus-trap.js';
import { acquireSlot, releaseSlot, markReleased, getSlotOwner } from './history-stack.js';

// ---- 模块状态 ----
let popupOpen = false;

// ---- 公共 API ----
function openPopup() {
    // 互斥：若抽屉正打开，静默关闭它（不触碰 history，复用槽位）
    if (getSlotOwner() === 'drawer') {
        onDrawerClose(false); // 由 main.js 注入
    }
    header.classList.add('nav-popup-open');
    popupBtn.setAttribute('aria-expanded', 'true');
    popupOpen = true;
    acquireSlot('popup');

    // 焦点管理：记录原焦点 → 移入弹窗
    rememberFocus();
    focusFirst(popup);
}

function closePopup(manageHistory = true) {
    if (!popupOpen) return; // 已关闭，跳过
    header.classList.remove('nav-popup-open');
    popupBtn.setAttribute('aria-expanded', 'false');
    popupOpen = false;

    if (manageHistory) {
        releaseSlot();
    } else {
        markReleased();
    }

    restoreFocus();
}

// ---- 依赖注入（由 main.js 调用时传入） ----
var header = dom.header;
var popupBtn = dom.popupBtn;
var popup = dom.popup;
var closeBtn = dom.closeBtn;
var onDrawerClose = function () { }; // 默认 no-op

// 初始化入口
export function initPopup(deps) {
    if (deps && typeof deps.onDrawerClose === 'function') {
        onDrawerClose = deps.onDrawerClose;
    }

    // 导航按钮点击：切换弹窗
    popupBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation(); // 阻止冒泡到 document 的外部点击关闭逻辑
        if (popupOpen) {
            closePopup(true);
        } else {
            openPopup();
        }
    });

    // 弹窗内关闭按钮（移动端可见，桌面端 display:none）
    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            closePopup(true);
        });
    }
}

// 暴露给 main.js 供遮罩点击 / ESC / 外部点击 / popstate 调用
export function getPopupOpen() {
    return popupOpen;
}

export { closePopup };
