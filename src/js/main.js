(function () {
    'use strict';

    var popupBtn = document.querySelector('.nav-popup-btn');
    var header = document.querySelector('header');
    var overlay = document.querySelector('.nav-popup-overlay');

    if (!popupBtn || !header || !overlay) return;

    function openPopup() {
        header.classList.add('nav-popup-open');
    }

    function closePopup() {
        header.classList.remove('nav-popup-open');
    }

    function togglePopup(e) {
        e.preventDefault();
        e.stopPropagation();
        if (header.classList.contains('nav-popup-open')) {
            closePopup();
        } else {
            openPopup();
        }
    }

    popupBtn.addEventListener('click', togglePopup);
    overlay.addEventListener('click', closePopup);

    document.addEventListener('click', function (e) {
        if (header.classList.contains('nav-popup-open') && !header.contains(e.target)) {
            closePopup();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && header.classList.contains('nav-popup-open')) {
            closePopup();
        }
    });
})();
