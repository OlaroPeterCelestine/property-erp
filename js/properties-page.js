(function () {
  function money(usd, layout) {
    return `<div data-usd="${usd}" data-price-layout="${layout || 'table'}"></div>`;
  }

  function cover(p) {
    return window.PropertyERPUploads?.getPropertyImage(p.id) || p.image || p.gallery?.[0] || '';
  }

  function statusPill(status) {
    const map = {
      Active: 'bg-brand-50 text-brand-700',
      'Under maintenance': 'bg-amber-50 text-amber-700',
      Inactive: 'bg-slate-100 text-slate-600',
    };
    return `<span class="rounded-full ${(map[status] || map.Inactive)} px-2.5 py-1 text-xs font-semibold">${status}</span>`;
  }

  function kpis(list) {
    const active = list.filter((p) => p.status === 'Active').length;
    const maint = list.filter((p) => p.status === 'Under maintenance').length;
    const inactive = list.filter((p) => p.status === 'Inactive').length;
    const units = list.reduce((s, p) => s + (p.unitCount || 0), 0);
    const collected = list.reduce((s, p) => s + (p.collected || 0), 0);
    const arrears = list.reduce((s, p) => s + (p.arrears || 0), 0);
    const net = list.reduce((s, p) => s + (p.net || 0), 0);
    const occ = list.length ? Math.round(list.reduce((s, p) => s + (p.occupancy || 0), 0) / list.length) : 0;
    return { active, maint, inactive, units, collected, arrears, net, occ, total: list.length };
  }

  function renderKpis(list) {
    const root = document.getElementById('properties-kpis');
    if (!root) return;
    const k = kpis(list);
    root.innerHTML = `
      <div class="db-card p-5"><p class="text-sm text-slate-500">Portfolio assets</p><p class="mt-1 text-2xl font-bold text-slate-900">${k.total}</p><p class="mt-1 text-xs text-slate-400">${k.active} active · ${k.maint} maintenance · ${k.inactive} inactive</p></div>
      <div class="db-card p-5"><p class="text-sm text-slate-500">Units tracked</p><p class="mt-1 text-2xl font-bold text-slate-900">${k.units}</p><p class="mt-1 text-xs text-slate-400">Avg occupancy ${k.occ}%</p></div>
      <div class="db-card p-5"><p class="text-sm text-slate-500">Collected MTD</p>${money(k.collected, 'stack')}</div>
      <div class="db-card p-5"><p class="text-sm text-slate-500">NOI / Arrears</p><div class="mt-1 flex items-end justify-between gap-2"><div>${money(k.net, 'stack')}</div><div class="text-right text-xs text-rose-500">${money(k.arrears, 'inline')}</div></div></div>`;
  }

  function card(p) {
    const href = window.PropertyERP.propertyHref(p);
    const img = cover(p);
    const score = p.score ?? Math.round((p.occupancy + p.collectionRate) / 2);
    return `
      <article class="property-card db-card overflow-hidden">
        <a href="${href}" class="property-card-media">
          <img src="${img}" alt="${p.name}" loading="lazy" />
          <div class="property-card-overlay">
            <div class="flex flex-wrap items-center gap-2">${statusPill(p.status)}<span class="rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">${p.code}</span></div>
            <div>
              <h3 class="text-lg font-bold text-white">${p.name}</h3>
              <p class="mt-0.5 text-sm text-white/85">${p.location} · ${p.type}</p>
            </div>
          </div>
        </a>
        <div class="space-y-3 p-4">
          <div class="grid grid-cols-3 gap-2 text-center">
            <div class="rounded-xl bg-slate-50 px-2 py-2"><p class="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Occ</p><p class="mt-0.5 text-sm font-bold text-slate-900">${p.occupancy}%</p></div>
            <div class="rounded-xl bg-slate-50 px-2 py-2"><p class="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Collect</p><p class="mt-0.5 text-sm font-bold text-slate-900">${p.collectionRate}%</p></div>
            <div class="rounded-xl bg-slate-50 px-2 py-2"><p class="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Score</p><p class="mt-0.5 text-sm font-bold text-brand-700">${score}</p></div>
          </div>
          <div class="flex items-center justify-between gap-3 text-sm">
            <div>
              <p class="text-xs text-slate-400">NOI MTD</p>
              ${money(p.net, 'table')}
            </div>
            <div class="text-right">
              <p class="text-xs text-slate-400">Units · Yield</p>
              <p class="font-semibold text-slate-800">${p.unitCount} · ${p.yieldPct || 0}%</p>
            </div>
          </div>
          <div class="property-card-bars">
            <div><span>Occupancy</span><div class="bar"><i style="width:${p.occupancy}%"></i></div></div>
            <div><span>Collections</span><div class="bar collect"><i style="width:${p.collectionRate}%"></i></div></div>
          </div>
          <div class="flex items-center justify-between gap-2 pt-1">
            <p class="text-xs text-slate-400">${p.manager}</p>
            <a href="${href}" class="text-sm font-semibold text-brand-700 hover:underline">Full analytics →</a>
          </div>
        </div>
      </article>`;
  }

  function filtered(list) {
    const q = (document.getElementById('properties-search')?.value || '').toLowerCase().trim();
    const type = document.getElementById('properties-type')?.value || 'all';
    const status = document.getElementById('properties-status')?.value || 'all';
    return list.filter((p) => {
      if (type !== 'all' && p.type !== type) return false;
      if (status !== 'all' && p.status !== status) return false;
      if (!q) return true;
      return `${p.name} ${p.location} ${p.code} ${p.manager}`.toLowerCase().includes(q);
    });
  }

  function renderGrid(list) {
    const root = document.getElementById('properties-grid');
    if (!root) return;
    const rows = filtered(list);
    renderKpis(list);
    if (!rows.length) {
      root.innerHTML = `<div class="db-card col-span-full p-10 text-center text-sm text-slate-500">No properties match your filters.</div>`;
      return;
    }
    root.innerHTML = rows.map(card).join('');
    window.DatabrainMoney?.init?.();
  }

  function init() {
    const list = window.PropertyERP?.properties;
    if (!Array.isArray(list) || !document.getElementById('properties-grid')) return;
    renderGrid(list);
    ['properties-search', 'properties-type', 'properties-status'].forEach((id) => {
      document.getElementById(id)?.addEventListener('input', () => renderGrid(list));
      document.getElementById(id)?.addEventListener('change', () => renderGrid(list));
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
