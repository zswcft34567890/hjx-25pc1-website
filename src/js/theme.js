const STORAGE_KEY = 'hjx-theme';

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

export function initTheme() {
    const btn = document.querySelector('.theme-btn');
    const menu = document.querySelector('.theme-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const open = menu.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(open));
    });

    menu.querySelectorAll('[data-theme-value]').forEach(function (el) {
        el.addEventListener('click', function () {
            applyTheme(el.dataset.themeValue);
            menu.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
        });
    });

    document.addEventListener('click', function (e) {
        if (!menu.contains(e.target) && !btn.contains(e.target)) {
            menu.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menu.classList.contains('open')) {
            menu.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
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
