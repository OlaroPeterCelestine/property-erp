(function () {
  function money(usd) {
    return `<div data-usd="${usd}" data-price-layout="table"></div>`;
  }

  function pill(status) {
    const map = {
      Active: 'bg-brand-50 text-brand-700',
      'Pending move-in': 'bg-sky-50 text-sky-700',
      Vacated: 'bg-slate-100 text-slate-600',
      Suspended: 'bg-amber-50 text-amber-700',
    };
    return `<span class="rounded-full ${map[status] || 'bg-slate-100 text-slate-600'} px-2.5 py-1 text-xs font-medium">${status}</span>`;
  }

  function init() {
    const body = document.getElementById('tenants-table-body');
    if (!body || !window.PropertyERP?.tenants) return;
    const rows = window.PropertyERP.tenants;
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('tenants-stat-active', String(rows.filter((t) => t.status === 'Active').length));
    set('tenants-stat-pending', String(rows.filter((t) => t.status === 'Pending move-in').length));
    set('tenants-stat-vacated', String(rows.filter((t) => t.status === 'Vacated').length));
    set('tenants-stat-arrears', String(rows.filter((t) => (t.balance || 0) > 0).length));

    body.innerHTML = rows.map((t) => {
      const unit = t.units?.[0];
      return `<tr class="hover:bg-slate-50/70" data-status="${t.status}">
        <td class="px-5 py-3 text-slate-500">${t.code}</td>
        <td class="px-5 py-3 font-medium"><a href="${t.href}" class="text-slate-900 hover:text-brand-700 hover:underline">${t.name}</a></td>
        <td class="px-5 py-3">${t.phone}</td>
        <td class="px-5 py-3">${unit ? `<a class="hover:text-brand-700 hover:underline" href="${unit.href}">${unit.unitCode}</a>` : '—'}</td>
        <td class="px-5 py-3">${money(t.deposit)}</td>
        <td class="px-5 py-3 ${t.balance > 0 ? 'text-rose-500' : 'text-brand-600'}">${money(t.balance || 0)}</td>
        <td class="px-5 py-3">${pill(t.status)}</td>
        <td class="px-5 py-3 text-right"><a href="${t.href}" class="text-sm font-semibold text-brand-700 hover:underline">Details →</a></td>
      </tr>`;
    }).join('') || `<tr><td colspan="8" class="px-5 py-8 text-center text-slate-400">No tenants found.</td></tr>`;
    window.DatabrainMoney?.init?.();
    window.PropertyERPTables?.refresh?.();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
