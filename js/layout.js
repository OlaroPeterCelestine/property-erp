(function () {
  const NAV = [
    { section: 'Overview', items: [
      { id: 'dashboard', href: 'index.html', label: 'Dashboard', icon: 'dashboard-square-01' },
    ]},
    { section: 'Portfolio', items: [
      { id: 'properties', href: 'properties.html', label: 'Properties', icon: 'building-03' },
      { id: 'units', href: 'units.html', label: 'Units', icon: 'home-01' },
      { id: 'tenants', href: 'tenants.html', label: 'Tenants', icon: 'user-group' },
      { id: 'leases', href: 'leases.html', label: 'Leases', icon: 'file-02' },
    ]},
    { section: 'Rent & Cash', items: [
      { id: 'rent', href: 'rent.html', label: 'Rent Invoices', icon: 'invoice-01' },
      { id: 'payments', href: 'payments.html', label: 'Collections', icon: 'money-receive-01' },
      { id: 'arrears', href: 'arrears.html', label: 'Arrears', icon: 'alert-02' },
    ]},
    { section: 'Spend', items: [
      { id: 'expenses', href: 'expenses.html', label: 'Expenses', icon: 'invoice-03' },
      { id: 'suppliers', href: 'suppliers.html', label: 'Suppliers', icon: 'user-multiple' },
      { id: 'maintenance', href: 'maintenance.html', label: 'Maintenance', icon: 'wrench-01' },
    ]},
    { section: 'Smart Home', items: [
      { id: 'iot', href: 'iot.html', label: 'IoT Controls', icon: 'wifi-01' },
    ]},
    { section: 'Finance & Tax', items: [
      { id: 'accounting', href: 'accounting.html', label: 'General Ledger', icon: 'analytics-01' },
      { id: 'bank', href: 'bank.html', label: 'Bank Recon', icon: 'bank' },
      { id: 'vat', href: 'vat.html', label: 'VAT', icon: 'percent' },
      { id: 'wht', href: 'wht.html', label: 'WHT', icon: 'taxes' },
      { id: 'closing', href: 'closing.html', label: 'Month Close', icon: 'calendar-check' },
    ]},
    { section: 'Insights', items: [
      { id: 'reports', href: 'reports.html', label: 'Reports', icon: 'chart-bar-line' },
      { id: 'documents', href: 'documents.html', label: 'Documents', icon: 'folder-02' },
    ]},
    { section: 'Admin', items: [
      { id: 'users', href: 'users.html', label: 'Users & Roles', icon: 'user-settings-01' },
      { id: 'settings', href: 'settings.html', label: 'Settings', icon: 'settings-01' },
    ]},
  ];

  function hi(name, extraClass) {
    return `<i class="hgi-stroke hgi-${name}${extraClass ? ` ${extraClass}` : ''}" aria-hidden="true"></i>`;
  }

  function navLink(item, active) {
    const cls = active
      ? 'nav-item flex items-center gap-3 rounded-2xl bg-brand-400 px-3.5 py-2.5 text-white shadow-sm shadow-brand-400/30'
      : 'nav-item flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-800';
    return `<a href="${item.href}" class="${cls}" title="${item.label}">${hi(item.icon, 'text-[18px]')}<span class="nav-label whitespace-nowrap">${item.label}</span></a>`;
  }

  function getActive() {
    return document.body.dataset.page || 'dashboard';
  }

  function renderSidebar() {
    const active = getActive();
    const collapsed = localStorage.getItem('property-erp-sidebar') === 'collapsed';

    const navHtml = NAV.map((group) => `
      <div class="support-label pb-1 ${group.section === 'Overview' ? 'pt-0' : 'pt-4'} px-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">${group.section}</div>
      ${group.items.map((item) => navLink(item, item.id === active)).join('')}
    `).join('');

    return `
      <aside id="sidebar" class="sticky top-0 flex h-screen shrink-0 flex-col px-3 py-5 ${collapsed ? 'collapsed' : ''}">
        <div class="brand-wrap mb-6 flex items-center gap-2.5 px-1">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white">
            ${hi('building-03', 'text-[18px]')}
          </div>
          <div class="brand-text min-w-0 flex-1">
            <p class="truncate text-lg font-bold tracking-tight text-slate-900">Property ERP</p>
            <p class="truncate text-[10px] font-medium text-slate-400">Uganda · URA ready</p>
          </div>
          <button type="button" id="sidebar-toggle" class="sidebar-toggle ml-auto hidden h-8 w-8 shrink-0 items-center justify-center rounded-full lg:inline-flex" title="Toggle sidebar" aria-label="${collapsed ? 'Expand sidebar' : 'Collapse sidebar'}">
            ${hi(collapsed ? 'arrow-right-01' : 'arrow-left-01', 'text-[14px]')}
            <span class="collapse-label sr-only">${collapsed ? 'Expand' : 'Collapse'}</span>
          </button>
        </div>

        <nav class="sidebar-nav flex-1 space-y-0.5 overflow-y-auto text-[13px] font-medium">${navHtml}</nav>

        <div class="sidebar-account mt-3 space-y-1 rounded-2xl border border-slate-200 bg-white p-2">
          <a href="users.html" class="nav-item flex items-center gap-2 rounded-xl px-2.5 py-2.5 text-[12px] font-semibold text-slate-700 hover:bg-slate-50" title="Users & Roles">
            ${hi('user-settings-01', 'text-[16px] text-slate-500')}<span class="nav-label">Users &amp; Roles</span>
          </a>
          <button type="button" data-sidebar-logout class="nav-item flex w-full items-center gap-2 rounded-xl px-2.5 py-2.5 text-[12px] font-semibold text-rose-600 hover:bg-rose-50" title="Sign out">
            ${hi('logout-01', 'text-[16px]')}<span class="nav-label">Sign out</span>
          </button>
        </div>
      </aside>
      <div id="sidebar-overlay" class="sidebar-overlay"></div>
    `;
  }

  function renderHeader() {
    const session = window.PropertyERPAuth?.read?.();
    const role = session?.role || document.body.dataset.role || 'Property Manager';
    const displayName = session?.name || 'Alex Okello';
    return `
      <header class="sticky top-0 z-20 flex items-center gap-3 px-4 py-4 sm:px-6">
        <button type="button" id="mobile-menu" class="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-soft lg:hidden" aria-label="Open menu">
          ${hi('menu-01', 'text-[18px]')}
        </button>

        <div class="relative max-w-xl flex-1">
          ${hi('search-01', 'pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[16px] text-slate-400')}
          <input type="search" placeholder="Type to search..." class="w-full rounded-full border border-slate-200/80 bg-white py-2.5 pl-11 pr-14 text-sm text-slate-700 shadow-soft outline-none placeholder:text-slate-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-100 sm:py-3 sm:pr-28" />
          <button type="button" class="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center gap-1.5 rounded-full bg-slate-900 px-2.5 py-1.5 text-[11px] font-semibold text-white sm:px-3">
            ${hi('mic-01', 'text-[12px]')}<span class="hidden sm:inline">AI Assist</span>
          </button>
        </div>

        <div class="ml-auto flex items-center gap-2">
          <div class="hidden items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50 px-3 py-2 text-xs font-medium text-brand-700 lg:inline-flex">
            ${hi('location-01', 'text-[14px]')}
            Kampala · UGX (USD)
          </div>
          <a href="users.html" class="inline-flex h-11 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-soft hover:bg-slate-50" title="Users & Roles">
            ${hi('user-settings-01', 'text-[15px]')}<span class="hidden sm:inline">Users</span>
          </a>
          <button type="button" data-action="open-modal" data-modal="notifications" class="relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-soft hover:bg-slate-50" aria-label="Notifications">
            ${hi('notification-03', 'text-[18px]')}
            <span class="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>
          <button type="button" id="logout-btn" class="inline-flex h-11 items-center gap-1.5 rounded-full border border-rose-200 bg-white px-3 text-xs font-semibold text-rose-600 shadow-soft hover:bg-rose-50" title="Sign out">
            ${hi('logout-01', 'text-[15px]')}<span class="hidden sm:inline">Sign out</span>
          </button>
          <div class="relative" id="user-menu-wrap">
            <button type="button" id="user-menu-btn" class="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 text-left shadow-soft hover:bg-slate-50" title="${role}" aria-haspopup="menu" aria-expanded="false">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face" alt="" class="h-8 w-8 rounded-full object-cover" />
              <span class="hidden sm:block">
                <span class="block text-xs font-semibold text-slate-800">${displayName}</span>
                <span class="block text-[10px] text-slate-400">${role}</span>
              </span>
              ${hi('arrow-down-01', 'hidden text-[12px] text-slate-400 sm:inline')}
            </button>
            <div id="user-menu" class="absolute right-0 top-full z-40 mt-2 hidden w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1 shadow-lg" role="menu">
              <a href="users.html" class="flex items-center gap-2 px-3.5 py-2.5 text-sm text-slate-700 hover:bg-slate-50" role="menuitem">${hi('user-settings-01', 'text-[15px] text-slate-400')} Users &amp; Roles</a>
              <a href="settings.html" class="flex items-center gap-2 px-3.5 py-2.5 text-sm text-slate-700 hover:bg-slate-50" role="menuitem">${hi('settings-01', 'text-[15px] text-slate-400')} Settings</a>
              <button type="button" data-action="open-modal" data-modal="settings" class="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50" role="menuitem">${hi('user-circle', 'text-[15px] text-slate-400')} Profile</button>
              <div class="my-1 border-t border-slate-100"></div>
              <button type="button" data-menu-logout class="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50" role="menuitem">${hi('logout-01', 'text-[15px]')} Sign out</button>
            </div>
          </div>
        </div>
      </header>
    `;
  }

  function updateCollapseUI(collapsed) {
    const toggle = document.getElementById('sidebar-toggle');
    if (!toggle) return;
    const icon = toggle.querySelector('i.hgi-stroke');
    if (icon) icon.className = `hgi-stroke hgi-${collapsed ? 'arrow-right-01' : 'arrow-left-01'} text-[14px]`;
    const text = toggle.querySelector('.collapse-label');
    if (text) text.textContent = collapsed ? 'Expand' : 'Collapse';
    toggle.title = 'Toggle sidebar';
    toggle.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
  }

  function bindEvents() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const toggle = document.getElementById('sidebar-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (toggle && sidebar) {
      updateCollapseUI(sidebar.classList.contains('collapsed'));
      toggle.addEventListener('click', () => {
        if (window.innerWidth < 1024) {
          sidebar.classList.remove('mobile-open');
          overlay?.classList.remove('active');
          return;
        }
        const collapsed = sidebar.classList.toggle('collapsed');
        localStorage.setItem('property-erp-sidebar', collapsed ? 'collapsed' : 'expanded');
        updateCollapseUI(collapsed);
      });
    }

    mobileMenu?.addEventListener('click', () => {
      sidebar?.classList.add('mobile-open');
      overlay?.classList.add('active');
    });

    overlay?.addEventListener('click', () => {
      sidebar?.classList.remove('mobile-open');
      overlay.classList.remove('active');
    });

    sidebar?.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 1024) {
          sidebar.classList.remove('mobile-open');
          overlay?.classList.remove('active');
        }
      });
    });

    const doLogout = () => window.PropertyERPAuth?.logout?.();
    document.getElementById('logout-btn')?.addEventListener('click', doLogout);
    document.querySelectorAll('[data-sidebar-logout], [data-menu-logout]').forEach((btn) => {
      btn.addEventListener('click', doLogout);
    });

    const menuBtn = document.getElementById('user-menu-btn');
    const menu = document.getElementById('user-menu');
    menuBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = menu?.classList.toggle('hidden') === false;
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', (e) => {
      const wrap = document.getElementById('user-menu-wrap');
      if (!wrap || wrap.contains(e.target)) return;
      menu?.classList.add('hidden');
      menuBtn?.setAttribute('aria-expanded', 'false');
    });
  }

  function init() {
    if (window.PropertyERPAuth && !window.PropertyERPAuth.requireAuth()) return;
    const shell = document.getElementById('app-shell');
    const headerRoot = document.getElementById('header-root');
    if (!shell || !headerRoot) return;
    shell.insertAdjacentHTML('afterbegin', renderSidebar());
    headerRoot.innerHTML = renderHeader();
    bindEvents();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
