(function () {
  function money(usd) {
    return `<div data-usd="${usd}" data-price-layout="table"></div>`;
  }

  function pill(status) {
    const map = {
      Active: 'bg-brand-50 text-brand-700',
      Expired: 'bg-rose-50 text-rose-700',
      Terminated: 'bg-slate-100 text-slate-600',
    };
    return `<span class="rounded-full ${map[status] || 'bg-slate-100 text-slate-600'} px-2.5 py-1 text-xs font-medium">${status}</span>`;
  }

  function init() {
    const body = document.getElementById('leases-table-body');
    if (!body || !window.PropertyERP?.leases) return;
    const rows = window.PropertyERP.leases;
    const active = rows.filter((l) => l.status === 'Active').length;

    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('leases-stat-active', String(active));
    set('leases-stat-expiring', String(Math.min(8, Math.max(1, Math.round(rows.length * 0.08)))));
    set('leases-stat-renewals', String(Math.min(5, Math.max(1, Math.round(rows.length * 0.05)))));
    set('leases-stat-terminated', String(Math.max(0, rows.length - active)));

    body.innerHTML = rows.map((l, i) => {
      const ref = `LSE-2025-${String(200 + i).padStart(3, '0')}`;
      const unitHref = window.PropertyERP.unitHref?.(l.unitId) || `unit.html?id=${encodeURIComponent(l.unitId)}`;
      const tenantHref = window.PropertyERP.tenantHref?.(l.tenantName) || `tenant.html?id=${encodeURIComponent(l.tenantId)}`;
      return `<tr class="hover:bg-slate-50/70" data-status="${l.status}" data-property="${l.propertyName}">
        <td class="px-5 py-3 font-medium">${ref}</td>
        <td class="px-5 py-3"><a href="${tenantHref}" class="hover:text-brand-700 hover:underline">${l.tenantName}</a></td>
        <td class="px-5 py-3"><a href="${unitHref}" class="hover:text-brand-700 hover:underline">${l.unitCode}</a></td>
        <td class="px-5 py-3">${money(l.rent)}</td>
        <td class="px-5 py-3">${l.start}</td>
        <td class="px-5 py-3">${l.end}</td>
        <td class="px-5 py-3">${pill(l.status)}</td>
        <td class="px-5 py-3 text-right"><a href="${tenantHref}" class="text-sm font-semibold text-brand-700 hover:underline">Details →</a></td>
      </tr>`;
    }).join('') || `<tr><td colspan="8" class="px-5 py-8 text-center text-slate-400">No leases yet.</td></tr>`;

    window.DatabrainMoney?.init?.();
    window.PropertyERPTables?.refresh?.();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
