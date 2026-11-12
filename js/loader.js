(function () {
  const MIN_MS = 480;
  const FADE_MS = 420;
  const started = performance.now();
  let done = false;

  function ensureOverlay() {
    if (document.getElementById('app-boot')) return;
    const el = document.createElement('div');
    el.id = 'app-boot';
    el.className = 'app-boot';
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-busy', 'true');
    el.innerHTML = `
      <div class="app-boot-card">
        <div class="app-boot-mark" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M4 20V9.5L12 4l8 5.5V20H4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
            <path d="M9 20v-6h6v6" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          </svg>
        </div>
        <p class="app-boot-brand">Property ERP</p>
        <p class="app-boot-sub">Preparing your workspace</p>
        <div class="app-boot-track" aria-hidden="true"><span class="app-boot-bar"></span></div>
      </div>`;
    (document.body || document.documentElement).appendChild(el);
  }

  function finish() {
    if (done) return;
    done = true;
    const wait = Math.max(0, MIN_MS - (performance.now() - started));
    setTimeout(() => {
      document.documentElement.classList.add('boot-ready');
      document.documentElement.classList.remove('boot-loading');
      document.body?.classList.add('app-ready');
      const boot = document.getElementById('app-boot');
      if (boot) {
        boot.classList.add('is-leaving');
        boot.setAttribute('aria-busy', 'false');
        setTimeout(() => boot.remove(), FADE_MS);
      }
    }, wait);
  }

  function armNavigationLoader() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      if (!a) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank') return;
      const href = a.getAttribute('href') || '';
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('https://wa.me')) return;
      let url;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      // Same-app HTML navigation → soft exit
      e.preventDefault();
      document.documentElement.classList.add('boot-leaving');
      ensureOverlay();
      const boot = document.getElementById('app-boot');
      boot?.classList.remove('is-leaving');
      const sub = boot?.querySelector('.app-boot-sub');
      if (sub) sub.textContent = 'Loading…';
      requestAnimationFrame(() => {
        setTimeout(() => {
          window.location.href = url.href;
        }, 180);
      });
    });

    // Prefetch internal pages on hover for snappier loads
    let prefetchTimer;
    document.addEventListener('pointerover', (e) => {
      const a = e.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (!href.endsWith('.html') && !/^[a-z0-9-]+$/i.test(href.replace(/^\//, ''))) return;
      clearTimeout(prefetchTimer);
      prefetchTimer = setTimeout(() => {
        try {
          const url = new URL(href, window.location.href);
          if (url.origin !== window.location.origin) return;
          if (document.querySelector(`link[rel="prefetch"][href="${url.pathname}"]`)) return;
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = url.pathname + url.search;
          document.head.appendChild(link);
        } catch {
          /* ignore */
        }
      }, 80);
    });
  }

  function boot() {
    document.documentElement.classList.add('boot-loading');
    if (document.body) ensureOverlay();
    else document.addEventListener('DOMContentLoaded', ensureOverlay, { once: true });

    armNavigationLoader();

    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', finish, { once: true });

    // Safety net if a CDN asset hangs
    setTimeout(finish, 4500);
  }

  window.PropertyERPLoader = { finish, ensureOverlay };

  boot();
})();
