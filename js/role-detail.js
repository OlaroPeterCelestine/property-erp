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

  function render(role) {
    const root = document.getElementById('role-detail-root');
    if (!root) return;
    document.title = `Property ERP — ${role.name}`;
    const pages = window.PropertyERPRbac.pages || [];
    const counts = { full: 0, write: 0, view: 0, none: 0 };
    pages.forEach((p) => { counts[p.access[role.id] || 'none'] += 1; });

    root.innerHTML = `
      <div class="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <a href="users.html" class="hover:text-slate-800">Users &amp; RBAC</a>
        <span class="text-slate-300">/</span>
        <span class="font-medium text-slate-800">${role.name}</span>
        <span class="ml-auto rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">Role 360</span>
      </div>

      <section class="db-card p-5 sm:p-6">
        <div class="flex flex-wrap items-start gap-4">
          <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${role.color} text-lg font-bold">${role.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}</div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl font-bold tracking-tight text-slate-900">${role.name}</h1>
            <p class="mt-1 text-sm text-slate-500">${role.desc}</p>
          </div>
          <a href="users.html" class="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium">All roles</a>
        </div>
      </section>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div class="db-card p-5"><p class="text-sm text-slate-500">Assigned users</p><p class="mt-1 text-2xl font-bold text-slate-900">${role.userCount}</p></div>
        <div class="db-card p-5"><p class="text-sm text-slate-500">Full access pages</p><p class="mt-1 text-2xl font-bold text-brand-600">${counts.full}</p></div>
        <div class="db-card p-5"><p class="text-sm text-slate-500">Write</p><p class="mt-1 text-2xl font-bold text-sky-600">${counts.write}</p></div>
        <div class="db-card p-5"><p class="text-sm text-slate-500">View only</p><p class="mt-1 text-2xl font-bold text-amber-600">${counts.view}</p></div>
        <div class="db-card p-5"><p class="text-sm text-slate-500">Blocked</p><p class="mt-1 text-2xl font-bold text-slate-400">${counts.none}</p></div>
      </div>

      <div class="grid gap-4 lg:grid-cols-3">
        <section class="db-card p-5 space-y-3">
          <h2 class="text-base font-bold text-slate-900">Capabilities</h2>
          <ul class="space-y-2 text-sm text-slate-600">
            ${(role.permissions || []).map((p) => `<li class="flex gap-2"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"></span>${p}</li>`).join('')}
          </ul>
        </section>
        <section class="db-card overflow-hidden lg:col-span-2">
          <div class="border-b border-slate-100 px-5 py-4">
            <h2 class="text-base font-bold text-slate-900">Users with this role</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full min-w-[560px] text-left text-sm">
              <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                <tr><th class="px-5 py-3 font-medium">User</th><th class="px-5 py-3 font-medium">Email</th><th class="px-5 py-3 font-medium">Scope</th><th class="px-5 py-3 font-medium">Status</th><th class="px-5 py-3 font-medium"></th></tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${(role.users || []).map((u) => `
                  <tr class="hover:bg-slate-50/70">
                    <td class="px-5 py-3 font-medium"><a href="${u.href}" class="hover:text-brand-700 hover:underline">${u.name}</a></td>
                    <td class="px-5 py-3">${u.email}</td>
                    <td class="px-5 py-3">${u.scope}</td>
                    <td class="px-5 py-3">${u.status === 'Active' ? accessPill('full').replace('Full', 'Active') : accessPill('none').replace('None', 'Inactive')}</td>
                    <td class="px-5 py-3 text-right"><a href="${u.href}" class="font-semibold text-brand-700 hover:underline">User 360 →</a></td>
                  </tr>`).join('') || `<tr><td colspan="5" class="px-5 py-8 text-center text-slate-400">No users assigned.</td></tr>`}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section class="space-y-3">
        <div>
          <h2 class="text-base font-bold text-slate-900">Page permissions</h2>
          <p class="text-sm text-slate-500">Every module this role can or cannot open</p>
        </div>
        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          ${pages.map((p) => `
            <a href="${p.detailHref}" class="db-card flex flex-col p-4 transition hover:ring-2 hover:ring-brand-200">
              <div class="flex items-start justify-between gap-3">
                <div class="flex min-w-0 items-center gap-3">
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">${hi(p.icon, 'text-[18px]')}</div>
                  <div class="min-w-0">
                    <h3 class="truncate text-sm font-bold text-slate-900">${p.label}</h3>
                    <p class="text-xs text-slate-400">${p.section}</p>
                  </div>
                </div>
                ${accessPill(p.access[role.id])}
              </div>
              <p class="mt-3 flex-1 text-xs text-slate-500">${p.summary || ''}</p>
              <span class="mt-3 text-xs font-semibold text-brand-700">Page detail →</span>
            </a>`).join('')}
        </div>
      </section>`;
  }

  function init() {
    const root = document.getElementById('role-detail-root');
    if (!root || !window.PropertyERPRbac) return;
    const id = window.PropertyERPRbac.routeId(['id', 'role']);
    const role = window.PropertyERPRbac.getRole(id);
    if (!role) {
      root.innerHTML = `<div class="db-card p-10 text-center"><h1 class="text-xl font-bold">Role not found</h1><a href="users.html" class="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Back to RBAC</a></div>`;
      return;
    }
    render(role);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
