(() => {
    'use strict';
    const root = document.documentElement;
    // ENDERECO_IGREJA é configurado no atributo do início deste arquivo.
    const updateAddress = () => {
        const ENDERECO_IGREJA = root.getAttribute('data-ENDERECO_IGREJA') || 'Igreja Metodista Wesleyana Valdariosa, Queimados, RJ';
        const mapsURL = root.getAttribute('data-MAPS_URL') || 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(ENDERECO_IGREJA);
        document.querySelectorAll('[data-maps]').forEach(link => { link.href = mapsURL; });
        document.querySelectorAll('[data-address]').forEach(label => { label.textContent = ENDERECO_IGREJA; });
    };
    updateAddress();
    new MutationObserver(updateAddress).observe(root, { attributes: true, attributeFilter: ['data-endereco_igreja', 'data-maps_url'] });

    const navbar = document.querySelector('.site-navbar');
    const menu = document.getElementById('menuPrincipal');
    const desktop = window.matchMedia('(min-width: 992px)');
    const updateNavbarHeight = () => {
        // Medir apenas a barra fechada no mobile para posicionar as âncoras.
        const styles = getComputedStyle(navbar);
        const brand = navbar.querySelector('.navbar-brand');
        const toggler = navbar.querySelector('.navbar-toggler');
        const barHeight = Math.max(brand.getBoundingClientRect().height, desktop.matches ? 0 : toggler.getBoundingClientRect().height);
        const height = desktop.matches ? navbar.getBoundingClientRect().height : barHeight + parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom) + parseFloat(styles.borderBottomWidth);
        root.style.setProperty('--navbar-height', Math.ceil(height) + 'px');
    };
    updateNavbarHeight();
    if ('ResizeObserver' in window) new ResizeObserver(updateNavbarHeight).observe(navbar);
    window.addEventListener('resize', updateNavbarHeight);
    if (document.fonts) document.fonts.ready.then(updateNavbarHeight);

    menu.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', event => {
            if (desktop.matches || !menu.classList.contains('show') || !window.bootstrap) return;
            event.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            menu.addEventListener('hidden.bs.collapse', () => {
                updateNavbarHeight();
                // location.hash também funciona quando o HTML é aberto diretamente.
                location.hash = link.getAttribute('href');
                target.scrollIntoView();
                target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
            }, { once: true });
            bootstrap.Collapse.getOrCreateInstance(menu).hide();
        });
    });

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (window.AOS && !reducedMotion.matches) {
        try {
            AOS.init({ duration: 600, offset: 60, once: true, easing: 'ease-out', disable: () => reducedMotion.matches });
            root.classList.add('aos-ready');
        } catch (_) {
            root.classList.remove('aos-ready');
        }
    }
})();
