const STORAGE_KEY = 'hjx-theme';
const OPEN_CLASS = 'theme-menu-open';
const TABLET_BP = 768;

function applyTheme(mode) {
    if (mode === 'auto') {
        delete document.documentElement.dataset.theme;
    } else {
        document.documentElement.dataset.theme = mode;
    }
    try {
        localStorage.setItem(STORAGE_KEY, mode);
    } catch (e) {}
}

function isDesktop() {
    return window.innerWidth > TABLET_BP;
}

function setMenuOpen(menu, btn, open) {
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    if (isDesktop()) {
        document.body.classList.toggle(OPEN_CLASS, open);
    }
}

export function initTheme() {
    const btn = document.querySelector('.theme-btn');
    const menu = document.querySelector('.theme-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const willOpen = !menu.classList.contains('open');
        setMenuOpen(menu, btn, willOpen);
    });

    menu.querySelectorAll('[data-theme-value]').forEach(function (el) {
        el.addEventListener('click', function () {
            applyTheme(el.dataset.themeValue);
            setMenuOpen(menu, btn, false);
        });
    });

    // 桌面端：点击遮罩关闭菜单
    const overlay = document.querySelector('.overlay');
    if (overlay) {
        overlay.addEventListener('click', function (e) {
            // 只处理主题菜单场景（避免误关 nav-drawer/nav-popup）
            if (document.body.classList.contains(OPEN_CLASS)) {
                e.stopPropagation();
                setMenuOpen(menu, btn, false);
            }
        });
    }

    document.addEventListener('click', function (e) {
        if (!menu.contains(e.target) && !btn.contains(e.target)) {
            setMenuOpen(menu, btn, false);
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menu.classList.contains('open')) {
            setMenuOpen(menu, btn, false);
            btn.focus();
        }
    });

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', function () {
        let saved = null;
        try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
        if (!saved || saved === 'auto') {
            delete document.documentElement.dataset.theme;
        }
    });
}
