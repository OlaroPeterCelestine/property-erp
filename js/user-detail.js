(function () {
  function pill(status) {
    const map = {
      Active: 'bg-brand-50 text-brand-700',
      Inactive: 'bg-slate-100 text-slate-600',
      Trusted: 'bg-brand-50 text-brand-700',
      Review: 'bg-amber-50 text-amber-700',
      On: 'bg-brand-50 text-brand-700',
      Off: 'bg-rose-50 text-rose-700',
      full: 'bg-brand-50 text-brand-700',
      write: 'bg-sky-50 text-sky-700',
      view: 'bg-amber-50 text-amber-700',
      none: 'bg-slate-100 text-slate-400',
    };
    const label = { full: 'Full', write: 'Write', view: 'View', none: 'None' }[status] || status;
    return `<span class="rounded-full ${map[status] || 'bg-slate-100 text-slate-600'} px-2.5 py-1 text-xs font-semibold">${label}</span>`;
  }

  function hi(name, extraClass) {
    return `<i class="hgi-stroke hgi-${name}${extraClass ? ` ${extraClass}` : ''}" aria-hidden="true"></i>`;
  }

  function render(u) {
    const root = document.getElementById('user-detail-root');
    if (!root) return;
    document.title = `Property ERP — ${u.name}`;
    const role = window.PropertyERPRbac.getRole(u.roleId);
    const pages = window.PropertyERPRbac.pages || [];

    root.innerHTML = `
      <div class="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <a href="users.html" class="hover:text-slate-800">Users &amp; RBAC</a>
        <span class="text-slate-300">/</span>
        <span class="font-medium text-slate-800">${u.name}</span>
        <span class="ml-auto rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">User 360</span>
      </div>

      <section class="db-card p-5 sm:p-6">
        <div class="flex flex-wrap items-start gap-4">
          <img src="${u.avatar}" alt="" class="h-16 w-16 rounded-2xl object-cover ring-1 ring-slate-200" />
          <div class="min-w-0 flex-1">
            <div class="mb-2 flex flex-wrap items-center gap-2">
              <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">${u.code}</span>
              ${pill(u.status)}
              ${pill(u.mfa === 'On' ? 'On' : 'Off')} MFA
            </div>
            <h1 class="text-2xl font-bold tracking-tight text-slate-900">${u.name}</h1>
            <p class="mt-1 text-sm text-slate-500">${u.title} · ${u.email}</p>
            <p class="mt-1 text-sm text-slate-500">${u.phone} · Scope: ${u.scope}</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <a href="${u.roleHref}" class="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium">Role 360</a>
            <button type="button" data-action="open-modal" data-modal="add-user" class="rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white">Edit access</button>
          </div>
        </div>
      </section>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div class="db-card p-5"><p class="text-sm text-slate-500">Role</p><p class="mt-1 text-lg font-bold text-slate-900"><a class="hover:text-brand-700" href="${u.roleHref}">${u.role}</a></p></div>
        <div class="db-card p-5"><p class="text-sm text-slate-500">Joined</p><p class="mt-1 text-lg font-bold text-slate-900">${u.joined}</p></div>
        <div class="db-card p-5"><p class="text-sm text-slate-500">Last login</p><p class="mt-1 text-lg font-bold text-slate-900">${u.lastLogin}</p></div>
        <div class="db-card p-5"><p class="text-sm text-slate-500">Property scope</p><p class="mt-1 text-lg font-bold text-slate-900">${u.scope}</p></div>
      </div>

      <div class="grid gap-4 lg:grid-cols-3">
        <section class="db-card p-5 lg:col-span-2 space-y-3">
          <h2 class="text-base font-bold text-slate-900">Identity</h2>
          <div class="grid gap-3 sm:grid-cols-2 text-sm">
            <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs text-slate-400">Email</p><p class="mt-1 font-semibold break-all">${u.email}</p></div>
            <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs text-slate-400">Phone</p><p class="mt-1 font-semibold">${u.phone}</p></div>
            <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs text-slate-400">Job title</p><p class="mt-1 font-semibold">${u.title}</p></div>
            <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs text-slate-400">MFA</p><p class="mt-1">${pill(u.mfa === 'On' ? 'On' : 'Off')}</p></div>
          </div>
        </section>
        <section class="db-card p-5 space-y-3">
          <h2 class="text-base font-bold text-slate-900">Role capabilities</h2>
          <ul class="space-y-2 text-sm text-slate-600">
            ${(role?.permissions || []).map((p) => `<li class="flex gap-2"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"></span>${p}</li>`).join('') || '<li>No capabilities listed.</li>'}
          </ul>
          <a href="${u.roleHref}" class="inline-flex text-sm font-semibold text-brand-700 hover:underline">Open role detail →</a>
        </section>
      </div>

      <section class="db-card overflow-hidden">
        <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 class="text-base font-bold text-slate-900">Page access for this role</h2>
            <p class="text-xs text-slate-400">Inherited from ${u.role}</p>
          </div>
        </div>
        <div class="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
          ${pages.map((p) => {
            const level = p.access[u.roleId] || 'none';
            return `
            <a href="${p.detailHref}" class="rounded-xl border border-slate-100 bg-slate-50/80 p-3 hover:border-brand-200 hover:bg-white">
              <div class="flex items-center justify-between gap-2">
                <div class="flex min-w-0 items-center gap-2">
                  <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-500">${hi(p.icon, 'text-[14px]')}</span>
                  <span class="truncate text-sm font-semibold text-slate-800">${p.label}</span>
                </div>
                ${pill(level)}
              </div>
            </a>`;
          }).join('')}
        </div>
      </section>

      <div class="grid gap-4 xl:grid-cols-2">
        <section class="db-card overflow-hidden">
          <div class="border-b border-slate-100 px-5 py-4"><h2 class="text-base font-bold text-slate-900">Trusted devices</h2></div>
          <ul class="divide-y divide-slate-100">
            ${(u.devices || []).map((d) => `
              <li class="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                <div>
                  <p class="font-semibold text-slate-900">${d.name}</p>
                  <p class="text-xs text-slate-400">${d.type} · last seen ${d.last}</p>
                </div>
                ${pill(d.status)}
              </li>`).join('')}
          </ul>
        </section>
        <section class="db-card overflow-hidden">
          <div class="border-b border-slate-100 px-5 py-4"><h2 class="text-base font-bold text-slate-900">Activity</h2></div>
          <ol class="space-y-0 px-5 py-4">
            ${(u.activity || []).map((item, i, arr) => `
              <li class="relative flex gap-4 ${i < arr.length - 1 ? 'pb-5' : ''}">
                <div class="flex flex-col items-center">
                  <span class="mt-1 h-2.5 w-2.5 rounded-full bg-brand-500"></span>
                  ${i < arr.length - 1 ? '<span class="w-px flex-1 bg-slate-200"></span>' : ''}
                </div>
                <div>
                  <p class="text-xs text-slate-400">${item.date}</p>
                  <p class="text-sm font-semibold text-slate-900">${item.title}</p>
                  <p class="text-sm text-slate-500">${item.detail}</p>
                </div>
              </li>`).join('')}
          </ol>
        </section>
      </div>`;
  }

  function init() {
    const root = document.getElementById('user-detail-root');
    if (!root || !window.PropertyERPRbac) return;
    const id = window.PropertyERPRbac.routeId(['id', 'user']);
    const user = window.PropertyERPRbac.getUser(id);
    if (!user) {
      root.innerHTML = `<div class="db-card p-10 text-center"><h1 class="text-xl font-bold">User not found</h1><a href="users.html" class="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Back to users</a></div>`;
      return;
    }
    render(user);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
