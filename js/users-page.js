(function () {
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

  function init() {
    const rbac = window.PropertyERPRbac;
    if (!rbac) return;
    const { roles: ROLES, pages: PAGES, users: USERS } = rbac;

    const rolesRoot = document.getElementById('rbac-roles');
    if (rolesRoot) {
      rolesRoot.innerHTML = ROLES.map((r) => `
        <a href="${r.href}" class="db-card block overflow-hidden transition hover:ring-2 hover:ring-brand-200">
          <div class="flex items-start gap-3 p-4">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${r.color} text-sm font-bold">${r.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}</div>
            <div class="min-w-0">
              <h3 class="text-sm font-bold text-slate-900">${r.name}</h3>
              <p class="mt-1 text-xs leading-relaxed text-slate-500">${r.desc}</p>
              <p class="mt-2 text-xs font-semibold text-brand-700">${r.userCount} user${r.userCount === 1 ? '' : 's'} · Open role 360 →</p>
            </div>
          </div>
        </a>`).join('');
    }

    const pagesRoot = document.getElementById('rbac-page-cards');
    if (pagesRoot) {
      const sections = [...new Set(PAGES.map((p) => p.section))];
      pagesRoot.innerHTML = sections.map((section) => {
        const pages = PAGES.filter((p) => p.section === section);
        return `
          <div class="space-y-3">
            <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-400">${section}</h3>
            <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              ${pages.map((p) => `
                <article class="db-card flex flex-col p-4">
                  <div class="flex items-start justify-between gap-3">
                    <div class="flex min-w-0 items-center gap-3">
                      <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">${hi(p.icon, 'text-[18px]')}</div>
                      <div class="min-w-0">
                        <h4 class="truncate text-sm font-bold text-slate-900">${p.label}</h4>
                        <a href="${p.detailHref}" class="text-xs font-medium text-brand-700 hover:underline">Permission detail</a>
                      </div>
                    </div>
                    <div class="shrink-0 text-right text-[10px] text-slate-400">
                      <div>${countAccess(p, 'full')} full</div>
                      <div>${countAccess(p, 'view') + countAccess(p, 'write')} limited</div>
                    </div>
                  </div>
                  <div class="mt-4 grid grid-cols-2 gap-1.5">
                    ${ROLES.map((r) => `
                      <a href="${r.href}" class="flex items-center justify-between gap-1 rounded-lg bg-slate-50 px-2 py-1.5 hover:bg-slate-100">
                        <span class="truncate text-[10px] font-medium text-slate-600" title="${r.name}">${r.name.split(' / ')[0].split(' ')[0]}</span>
                        ${accessPill(p.access[r.id])}
                      </a>`).join('')}
                  </div>
                  <div class="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                    <a href="${p.detailHref}" class="rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] font-semibold text-white">Page 360</a>
                    <a href="${p.href}" class="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-600">Open module</a>
                  </div>
                </article>`).join('')}
            </div>
          </div>`;
      }).join('');
    }

    const usersBody = document.getElementById('users-table-body');
    if (usersBody) {
      usersBody.innerHTML = USERS.map((u) => `
        <tr class="hover:bg-slate-50/70" data-status="${u.status}" data-role="${u.role}">
          <td class="px-5 py-3 font-medium"><a href="${u.href}" class="hover:text-brand-700 hover:underline">${u.name}</a></td>
          <td class="px-5 py-3">${u.email}</td>
          <td class="px-5 py-3"><a href="${u.roleHref}" class="hover:text-brand-700 hover:underline">${u.role}</a></td>
          <td class="px-5 py-3">${u.scope}</td>
          <td class="px-5 py-3">${u.mfa}</td>
          <td class="px-5 py-3">${statusPill(u.status)}</td>
          <td class="px-5 py-3 text-right"><a href="${u.href}" class="text-sm font-semibold text-brand-700 hover:underline">Details →</a></td>
        </tr>`).join('');
      window.PropertyERPTables?.refresh?.();
    }

    const matrixHead = document.getElementById('rbac-matrix-head');
    if (matrixHead) {
      matrixHead.innerHTML = `<tr>
        <th class="sticky left-0 bg-slate-50 px-4 py-3 text-left font-medium">Page</th>
        ${ROLES.map((r) => `<th class="px-3 py-3 font-medium whitespace-nowrap"><a href="${r.href}" class="hover:text-brand-700">${r.name.split(' / ')[0]}</a></th>`).join('')}
      </tr>`;
    }

    const matrixBody = document.getElementById('rbac-matrix-body');
    if (matrixBody) {
      matrixBody.innerHTML = PAGES.map((p) => `
        <tr class="hover:bg-slate-50/70">
          <td class="sticky left-0 bg-white px-4 py-3 font-medium text-slate-800">
            <a href="${p.detailHref}" class="hover:text-brand-700 hover:underline">${p.label}</a>
            <div class="text-[10px] font-normal text-slate-400">${p.section}</div>
          </td>
          ${ROLES.map((r) => `<td class="px-3 py-3 text-center"><a href="${r.href}">${accessPill(p.access[r.id])}</a></td>`).join('')}
        </tr>`).join('');
    }

    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('rbac-stat-users', String(USERS.length));
    set('rbac-stat-active', String(USERS.filter((u) => u.status === 'Active').length));
    set('rbac-stat-roles', String(ROLES.length));
    set('rbac-stat-pages', String(PAGES.length));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
