(function () {
  function accessPill(level) {
    const map = {
      full: { label: 'Full', cls: 'bg-brand-50 text-brand-700' },
      write: { label: 'Write', cls: 'bg-sky-50 text-sky-700' },
      view: { label: 'View', cls: 'bg-amber-50 text-amber-700' },
      none: { label: 'None', cls: 'bg-slate-100 text-slate-400' },
    };
    const m = map[level] || map.none;
    return `<span class="rounded-full ${m.cls} px-2.5 py-1 text-xs font-semibold">${m.label}</span>`;
  }

  function hi(name, extraClass) {
    return `<i class="hgi-stroke hgi-${name}${extraClass ? ` ${extraClass}` : ''}" aria-hidden="true"></i>`;
  }

  function render(page) {
    const root = document.getElementById('page-detail-root');
    if (!root) return;
    document.title = `Property ERP — ${page.label} access`;
    const roles = window.PropertyERPRbac.roles || [];
    const users = window.PropertyERPRbac.users || [];

    const byLevel = { full: [], write: [], view: [], none: [] };
    roles.forEach((r) => {
      const level = page.access[r.id] || 'none';
      byLevel[level].push(r);
    });

    const allowedUsers = users.filter((u) => (page.access[u.roleId] || 'none') !== 'none');

    root.innerHTML = `
      <div class="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <a href="users.html" class="hover:text-slate-800">Users &amp; RBAC</a>
        <span class="text-slate-300">/</span>
        <span class="font-medium text-slate-800">${page.label}</span>
        <span class="ml-auto rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">Page 360</span>
      </div>

      <section class="db-card p-5 sm:p-6">
        <div class="flex flex-wrap items-start gap-4">
          <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">${hi(page.icon, 'text-[22px]')}</div>
          <div class="min-w-0 flex-1">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">${page.section}</p>
            <h1 class="mt-1 text-2xl font-bold tracking-tight text-slate-900">${page.label}</h1>
            <p class="mt-1 text-sm text-slate-500">${page.summary || ''}</p>
            <p class="mt-2 text-xs text-slate-400">Route · <code class="rounded bg-slate-100 px-1.5 py-0.5">${page.href}</code></p>
          </div>
          <div class="flex flex-wrap gap-2">
            <a href="${page.href}" class="rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white">Open module</a>
            <a href="users.html" class="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium">All pages</a>
          </div>
        </div>
      </section>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div class="db-card p-5"><p class="text-sm text-slate-500">Full</p><p class="mt-1 text-2xl font-bold text-brand-600">${byLevel.full.length}</p></div>
        <div class="db-card p-5"><p class="text-sm text-slate-500">Write</p><p class="mt-1 text-2xl font-bold text-sky-600">${byLevel.write.length}</p></div>
        <div class="db-card p-5"><p class="text-sm text-slate-500">View</p><p class="mt-1 text-2xl font-bold text-amber-600">${byLevel.view.length}</p></div>
        <div class="db-card p-5"><p class="text-sm text-slate-500">None</p><p class="mt-1 text-2xl font-bold text-slate-400">${byLevel.none.length}</p></div>
      </div>

      <section class="space-y-3">
        <h2 class="text-base font-bold text-slate-900">Access by role</h2>
        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          ${roles.map((r) => `
            <a href="${r.href}" class="db-card p-4 transition hover:ring-2 hover:ring-brand-200">
              <div class="flex items-center justify-between gap-2">
                <div class="flex h-9 w-9 items-center justify-center rounded-xl ${r.color} text-xs font-bold">${r.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}</div>
                ${accessPill(page.access[r.id])}
              </div>
              <h3 class="mt-3 text-sm font-bold text-slate-900">${r.name}</h3>
              <p class="mt-1 text-xs text-slate-500">${r.desc}</p>
              <p class="mt-2 text-xs font-semibold text-brand-700">Role 360 →</p>
            </a>`).join('')}
        </div>
      </section>

      <section class="db-card overflow-hidden">
        <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 class="text-base font-bold text-slate-900">Users who can open this page</h2>
            <p class="text-xs text-slate-400">${allowedUsers.length} of ${users.length} directory users</p>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full min-w-[640px] text-left text-sm">
            <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
              <tr><th class="px-5 py-3 font-medium">User</th><th class="px-5 py-3 font-medium">Role</th><th class="px-5 py-3 font-medium">Scope</th><th class="px-5 py-3 font-medium">Access</th><th class="px-5 py-3 font-medium"></th></tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${allowedUsers.map((u) => `
                <tr class="hover:bg-slate-50/70">
                  <td class="px-5 py-3 font-medium"><a href="${u.href}" class="hover:text-brand-700 hover:underline">${u.name}</a></td>
                  <td class="px-5 py-3"><a href="${u.roleHref}" class="hover:underline">${u.role}</a></td>
                  <td class="px-5 py-3">${u.scope}</td>
                  <td class="px-5 py-3">${accessPill(page.access[u.roleId])}</td>
                  <td class="px-5 py-3 text-right"><a href="${u.href}" class="font-semibold text-brand-700 hover:underline">User 360 →</a></td>
                </tr>`).join('') || `<tr><td colspan="5" class="px-5 py-8 text-center text-slate-400">No users can access this page.</td></tr>`}
            </tbody>
          </table>
        </div>
      </section>`;
  }

  function init() {
    const root = document.getElementById('page-detail-root');
    if (!root || !window.PropertyERPRbac) return;
    const id = window.PropertyERPRbac.routeId(['id', 'page', 'module']);
    const page = window.PropertyERPRbac.getPage(id);
    if (!page) {
      root.innerHTML = `<div class="db-card p-10 text-center"><h1 class="text-xl font-bold">Page not found</h1><a href="users.html" class="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Back to RBAC</a></div>`;
      return;
    }
    render(page);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
