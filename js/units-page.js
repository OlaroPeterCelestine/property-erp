(function () {
  function money(usd) {
    return `<div data-usd="${usd}" data-price-layout="table"></div>`;
  }

  function pill(status) {
    const map = {
      Occupied: 'bg-brand-50 text-brand-700',
      Vacant: 'bg-amber-50 text-amber-700',
      'Under maintenance': 'bg-rose-50 text-rose-700',
    };
    return `<span class="rounded-full ${map[status] || 'bg-slate-100 text-slate-600'} px-2.5 py-1 text-xs font-medium">${status}</span>`;
  }

  function init() {
    const body = document.getElementById('units-table-body');
    if (!body || !window.PropertyERP?.units) return;
    const rows = window.PropertyERP.units;
    const occupied = rows.filter((u) => u.status === 'Occupied').length;
    const vacant = rows.filter((u) => u.status === 'Vacant').length;
    const maint = rows.filter((u) => u.status === 'Under maintenance').length;
    const rate = rows.length ? ((occupied / rows.length) * 100).toFixed(1) + '%' : '—';
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('units-stat-occupied', String(occupied));
    set('units-stat-vacant', String(vacant));
    set('units-stat-maint', String(maint));
    set('units-stat-rate', rate);

    body.innerHTML = rows.map((u) => {
      const tenantHref = u.tenantName ? window.PropertyERP.tenantHref(u.tenantName) : null;
      return `<tr class="hover:bg-slate-50/70" data-status="${u.status}" data-property="${u.propertyName}" data-type="${u.type}">
        <td class="px-5 py-3 font-medium"><a href="${u.href}" class="hover:text-brand-700 hover:underline">${u.code}</a></td>
        <td class="px-5 py-3"><a href="${u.propertyHref}" class="hover:text-brand-700 hover:underline">${u.propertyName}</a></td>
        <td class="px-5 py-3">${u.floor}</td>
        <td class="px-5 py-3">${u.type}</td>
        <td class="px-5 py-3">${u.tenantName ? `<a href="${tenantHref}" class="hover:text-brand-700 hover:underline">${u.tenantName}</a>` : '—'}</td>
        <td class="px-5 py-3">${money(u.rent)}</td>
        <td class="px-5 py-3">${pill(u.status)}</td>
        <td class="px-5 py-3 text-right"><a href="${u.href}" class="text-sm font-semibold text-brand-700 hover:underline">Details →</a></td>
      </tr>`;
    }).join('') || `<tr><td colspan="8" class="px-5 py-8 text-center text-slate-400">No units found.</td></tr>`;
    window.DatabrainMoney?.init?.();
    window.PropertyERPTables?.refresh?.();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
