(function () {
  const ROLES = [
    { id: 'owner', name: 'Director / Owner', desc: 'Full portfolio, finance approve, RBAC admin', color: 'bg-slate-900 text-white', users: 2 },
    { id: 'admin', name: 'System Administrator', desc: 'Users, settings, audit, all modules', color: 'bg-violet-600 text-white', users: 1 },
    { id: 'pm', name: 'Property Manager', desc: 'Portfolio ops, leases, maintenance, IoT', color: 'bg-brand-600 text-white', users: 4 },
    { id: 'accountant', name: 'Accountant', desc: 'GL, VAT/WHT, bank recon, closing', color: 'bg-sky-600 text-white', users: 3 },
    { id: 'cashier', name: 'Cashier', desc: 'Collections, rent invoices, receipts', color: 'bg-amber-500 text-white', users: 2 },
    { id: 'procurement', name: 'Procurement Officer', desc: 'Expenses, suppliers, quotations', color: 'bg-orange-500 text-white', users: 2 },
    { id: 'approver', name: 'Finance Approver', desc: 'Approve spend, close periods, VAT', color: 'bg-indigo-600 text-white', users: 2 },
    { id: 'auditor', name: 'Auditor', desc: 'Read-only across financial modules', color: 'bg-slate-500 text-white', users: 2 },
  ];

  // Access: full | write | view | none
  const PAGES = [
    { section: 'Overview', id: 'dashboard', href: 'index.html', label: 'Dashboard', icon: 'dashboard-square-01', access: { owner: 'full', admin: 'full', pm: 'full', accountant: 'full', cashier: 'view', procurement: 'view', approver: 'view', auditor: 'view' } },
    { section: 'Portfolio', id: 'properties', href: 'properties.html', label: 'Properties', icon: 'building-03', access: { owner: 'full', admin: 'full', pm: 'full', accountant: 'view', cashier: 'view', procurement: 'view', approver: 'view', auditor: 'view' } },
    { section: 'Portfolio', id: 'units', href: 'units.html', label: 'Units', icon: 'home-01', access: { owner: 'full', admin: 'full', pm: 'full', accountant: 'view', cashier: 'view', procurement: 'none', approver: 'view', auditor: 'view' } },
    { section: 'Portfolio', id: 'tenants', href: 'tenants.html', label: 'Tenants', icon: 'user-group', access: { owner: 'full', admin: 'full', pm: 'full', accountant: 'view', cashier: 'view', procurement: 'none', approver: 'view', auditor: 'view' } },
    { section: 'Portfolio', id: 'leases', href: 'leases.html', label: 'Leases', icon: 'file-02', access: { owner: 'full', admin: 'full', pm: 'full', accountant: 'view', cashier: 'view', procurement: 'none', approver: 'view', auditor: 'view' } },
    { section: 'Rent & Cash', id: 'rent', href: 'rent.html', label: 'Rent Invoices', icon: 'invoice-01', access: { owner: 'full', admin: 'full', pm: 'write', accountant: 'full', cashier: 'write', procurement: 'none', approver: 'view', auditor: 'view' } },
    { section: 'Rent & Cash', id: 'payments', href: 'payments.html', label: 'Collections', icon: 'money-receive-01', access: { owner: 'full', admin: 'full', pm: 'view', accountant: 'full', cashier: 'full', procurement: 'none', approver: 'view', auditor: 'view' } },
    { section: 'Rent & Cash', id: 'arrears', href: 'arrears.html', label: 'Arrears', icon: 'alert-02', access: { owner: 'full', admin: 'full', pm: 'full', accountant: 'full', cashier: 'write', procurement: 'none', approver: 'view', auditor: 'view' } },
    { section: 'Spend', id: 'expenses', href: 'expenses.html', label: 'Expenses', icon: 'invoice-03', access: { owner: 'full', admin: 'full', pm: 'write', accountant: 'full', cashier: 'none', procurement: 'full', approver: 'full', auditor: 'view' } },
    { section: 'Spend', id: 'suppliers', href: 'suppliers.html', label: 'Suppliers', icon: 'user-multiple', access: { owner: 'full', admin: 'full', pm: 'view', accountant: 'view', cashier: 'none', procurement: 'full', approver: 'view', auditor: 'view' } },
    { section: 'Spend', id: 'maintenance', href: 'maintenance.html', label: 'Maintenance', icon: 'wrench-01', access: { owner: 'full', admin: 'full', pm: 'full', accountant: 'view', cashier: 'none', procurement: 'write', approver: 'view', auditor: 'view' } },
    { section: 'Smart Home', id: 'iot', href: 'iot.html', label: 'IoT Controls', icon: 'wifi-01', access: { owner: 'full', admin: 'full', pm: 'full', accountant: 'none', cashier: 'none', procurement: 'none', approver: 'none', auditor: 'view' } },
    { section: 'Finance & Tax', id: 'accounting', href: 'accounting.html', label: 'General Ledger', icon: 'analytics-01', access: { owner: 'full', admin: 'full', pm: 'none', accountant: 'full', cashier: 'none', procurement: 'none', approver: 'view', auditor: 'view' } },
    { section: 'Finance & Tax', id: 'bank', href: 'bank.html', label: 'Bank Recon', icon: 'bank', access: { owner: 'full', admin: 'full', pm: 'none', accountant: 'full', cashier: 'view', procurement: 'none', approver: 'view', auditor: 'view' } },
    { section: 'Finance & Tax', id: 'vat', href: 'vat.html', label: 'VAT', icon: 'percent', access: { owner: 'full', admin: 'full', pm: 'none', accountant: 'full', cashier: 'none', procurement: 'none', approver: 'full', auditor: 'view' } },
    { section: 'Finance & Tax', id: 'wht', href: 'wht.html', label: 'WHT', icon: 'taxes', access: { owner: 'full', admin: 'full', pm: 'none', accountant: 'full', cashier: 'none', procurement: 'none', approver: 'full', auditor: 'view' } },
    { section: 'Finance & Tax', id: 'closing', href: 'closing.html', label: 'Month Close', icon: 'calendar-check', access: { owner: 'full', admin: 'full', pm: 'view', accountant: 'full', cashier: 'none', procurement: 'none', approver: 'full', auditor: 'view' } },
    { section: 'Insights', id: 'reports', href: 'reports.html', label: 'Reports', icon: 'chart-bar-line', access: { owner: 'full', admin: 'full', pm: 'view', accountant: 'full', cashier: 'view', procurement: 'view', approver: 'view', auditor: 'view' } },
    { section: 'Insights', id: 'documents', href: 'documents.html', label: 'Documents', icon: 'folder-02', access: { owner: 'full', admin: 'full', pm: 'write', accountant: 'view', cashier: 'view', procurement: 'view', approver: 'view', auditor: 'view' } },
    { section: 'Admin', id: 'users', href: 'users.html', label: 'Users & Roles', icon: 'user-settings-01', access: { owner: 'full', admin: 'full', pm: 'none', accountant: 'none', cashier: 'none', procurement: 'none', approver: 'none', auditor: 'view' } },
    { section: 'Admin', id: 'settings', href: 'settings.html', label: 'Settings', icon: 'settings-01', access: { owner: 'full', admin: 'full', pm: 'view', accountant: 'view', cashier: 'none', procurement: 'none', approver: 'none', auditor: 'view' } },
    { section: 'Auth', id: 'login', href: 'login.html', label: 'Login', icon: 'login-01', access: { owner: 'full', admin: 'full', pm: 'full', accountant: 'full', cashier: 'full', procurement: 'full', approver: 'full', auditor: 'full' } },
    { section: 'Detail routes', id: 'property', href: 'property.html?id=kololo-heights', label: 'Property 360', icon: 'building-03', access: { owner: 'full', admin: 'full', pm: 'full', accountant: 'view', cashier: 'view', procurement: 'view', approver: 'view', auditor: 'view' } },
    { section: 'Detail routes', id: 'tenant', href: 'tenant.html?id=nakato-holdings', label: 'Tenant 360', icon: 'user', access: { owner: 'full', admin: 'full', pm: 'full', accountant: 'view', cashier: 'view', procurement: 'none', approver: 'view', auditor: 'view' } },
    { section: 'Detail routes', id: 'unit', href: 'unit.html?id=kololo-heights__a-1204', label: 'Unit 360', icon: 'home-01', access: { owner: 'full', admin: 'full', pm: 'full', accountant: 'view', cashier: 'view', procurement: 'none', approver: 'view', auditor: 'view' } },
  ];

  const USERS = [
    { name: 'Alex Okello', email: 'alex@propertyerp.ug', role: 'Property Manager', scope: 'Kololo, Ntinda', mfa: 'On', status: 'Active' },
    { name: 'Grace Atim', email: 'grace@propertyerp.ug', role: 'Cashier', scope: 'Kololo Heights', mfa: 'On', status: 'Active' },
    { name: 'Peter Ssebunya', email: 'peter@propertyerp.ug', role: 'Accountant', scope: 'All', mfa: 'On', status: 'Active' },
    { name: 'Audit Desk', email: 'audit@propertyerp.ug', role: 'Auditor', scope: 'All', mfa: 'On', status: 'Active' },
    { name: 'Mary Nabirye', email: 'mary@propertyerp.ug', role: 'Procurement Officer', scope: 'Ntinda, Entebbe Mall', mfa: 'Off', status: 'Active' },
    { name: 'Jonah Kiggundu', email: 'jonah@propertyerp.ug', role: 'Finance Approver', scope: 'All', mfa: 'On', status: 'Active' },
    { name: 'Irene Achieng', email: 'irene@propertyerp.ug', role: 'Accountant', scope: 'Bugolobi, Nakasero', mfa: 'Off', status: 'Active' },
    { name: 'Samuel Ocen', email: 'samuel@propertyerp.ug', role: 'Director / Owner', scope: 'All', mfa: 'On', status: 'Active' },
    { name: 'Joan Kizza', email: 'joan@propertyerp.ug', role: 'Property Manager', scope: 'Makerere, Naalya', mfa: 'On', status: 'Active' },
    { name: 'Denis Wanyama', email: 'denis@propertyerp.ug', role: 'System Administrator', scope: 'All', mfa: 'On', status: 'Active' },
    { name: 'Rita Nalwoga', email: 'rita@propertyerp.ug', role: 'Cashier', scope: 'Entebbe Road Mall', mfa: 'Off', status: 'Inactive' },
    { name: 'Paul Kato', email: 'paul@propertyerp.ug', role: 'Property Manager', scope: 'Old Jinja Warehouse', mfa: 'On', status: 'Active' },
  ];

  function hi(name, extraClass) {
    return `<i class="hgi-stroke hgi-${name}${extraClass ? ` ${extraClass}` : ''}" aria-hidden="true"></i>`;
  }

  function accessPill(level) {
    const map = {
      full: { label: 'Full', cls: 'bg-brand-50 text-brand-700' },
      write: { label: 'Write', cls: 'bg-sky-50 text-sky-700' },
      view: { label: 'View', cls: 'bg-amber-50 text-amber-700' },
      none: { label: 'None', cls: 'bg-slate-100 text-slate-400' },
    };
    const m = map[level] || map.none;
    return `<span class="rounded-full ${m.cls} px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">${m.label}</span>`;
  }

  function statusPill(status) {
    return status === 'Active'
      ? '<span class="rounded-full bg-brand-50 text-brand-600 px-2.5 py-1 text-xs font-medium">Active</span>'
      : '<span class="rounded-full bg-slate-100 text-slate-600 px-2.5 py-1 text-xs font-medium">Inactive</span>';
  }

  function countAccess(page, level) {
    return Object.values(page.access).filter((v) => v === level).length;
  }

  function renderRoles(root) {
    root.innerHTML = ROLES.map((r) => `
      <article class="db-card overflow-hidden">
        <div class="flex items-start gap-3 p-4">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${r.color} text-sm font-bold">${r.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}</div>
          <div class="min-w-0">
            <h3 class="text-sm font-bold text-slate-900">${r.name}</h3>
            <p class="mt-1 text-xs leading-relaxed text-slate-500">${r.desc}</p>
            <p class="mt-2 text-xs font-semibold text-slate-700">${r.users} assigned user${r.users === 1 ? '' : 's'}</p>
          </div>
        </div>
      </article>`).join('');
  }

  function renderPageCards(root) {
    const sections = [...new Set(PAGES.map((p) => p.section))];
    root.innerHTML = sections.map((section) => {
      const pages = PAGES.filter((p) => p.section === section);
      return `
        <div class="space-y-3">
          <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-400">${section}</h3>
          <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            ${pages.map((p) => `
              <article class="db-card flex flex-col p-4">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">${hi(p.icon, 'text-[18px]')}</div>
                    <div class="min-w-0">
                      <h4 class="truncate text-sm font-bold text-slate-900">${p.label}</h4>
                      <a href="${p.href}" class="text-xs font-medium text-brand-700 hover:underline">${p.href.split('?')[0]}</a>
                    </div>
                  </div>
                  <div class="shrink-0 text-right text-[10px] text-slate-400">
                    <div>${countAccess(p, 'full')} full</div>
                    <div>${countAccess(p, 'view') + countAccess(p, 'write')} limited</div>
                  </div>
                </div>
                <div class="mt-4 grid grid-cols-2 gap-1.5">
                  ${ROLES.map((r) => `
                    <div class="flex items-center justify-between gap-1 rounded-lg bg-slate-50 px-2 py-1.5">
                      <span class="truncate text-[10px] font-medium text-slate-600" title="${r.name}">${r.name.split(' / ')[0].split(' ')[0]}</span>
                      ${accessPill(p.access[r.id])}
                    </div>`).join('')}
                </div>
                <div class="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                  <a href="${p.href}" class="rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] font-semibold text-white">Open page</a>
                  <button type="button" data-action="open-modal" data-modal="add-user" class="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-600">Assign role</button>
                </div>
              </article>`).join('')}
          </div>
        </div>`;
    }).join('');
  }

  function renderUsers(body) {
    body.innerHTML = USERS.map((u) => `
      <tr class="hover:bg-slate-50/70" data-status="${u.status}" data-role="${u.role}">
        <td class="px-5 py-3 font-medium">${u.name}</td>
        <td class="px-5 py-3">${u.email}</td>
        <td class="px-5 py-3">${u.role}</td>
        <td class="px-5 py-3">${u.scope}</td>
        <td class="px-5 py-3">${u.mfa}</td>
        <td class="px-5 py-3">${statusPill(u.status)}</td>
      </tr>`).join('');
  }

  function renderMatrix(body) {
    body.innerHTML = PAGES.map((p) => `
      <tr class="hover:bg-slate-50/70">
        <td class="sticky left-0 bg-white px-4 py-3 font-medium text-slate-800">
          <a href="${p.href}" class="hover:text-brand-700 hover:underline">${p.label}</a>
          <div class="text-[10px] font-normal text-slate-400">${p.section}</div>
        </td>
        ${ROLES.map((r) => `<td class="px-3 py-3 text-center">${accessPill(p.access[r.id])}</td>`).join('')}
      </tr>`).join('');
  }

  function init() {
    const rolesRoot = document.getElementById('rbac-roles');
    const pagesRoot = document.getElementById('rbac-page-cards');
    const usersBody = document.getElementById('users-table-body');
    const matrixBody = document.getElementById('rbac-matrix-body');
    const matrixHead = document.getElementById('rbac-matrix-head');

    if (rolesRoot) renderRoles(rolesRoot);
    if (pagesRoot) renderPageCards(pagesRoot);
    if (usersBody) {
      renderUsers(usersBody);
      window.PropertyERPTables?.refresh?.();
    }
    if (matrixHead) {
      matrixHead.innerHTML = `<tr>
        <th class="sticky left-0 bg-slate-50 px-4 py-3 text-left font-medium">Page</th>
        ${ROLES.map((r) => `<th class="px-3 py-3 font-medium whitespace-nowrap">${r.name.split(' / ')[0]}</th>`).join('')}
      </tr>`;
    }
    if (matrixBody) renderMatrix(matrixBody);

    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('rbac-stat-users', String(USERS.length));
    set('rbac-stat-active', String(USERS.filter((u) => u.status === 'Active').length));
    set('rbac-stat-roles', String(ROLES.length));
    set('rbac-stat-pages', String(PAGES.length));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
