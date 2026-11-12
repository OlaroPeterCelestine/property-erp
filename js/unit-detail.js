(function () {
  function money(usd, layout) {
    return `<div data-usd="${usd}" data-price-layout="${layout || 'table'}"></div>`;
  }

  function pill(status) {
    const map = {
      Occupied: 'bg-brand-50 text-brand-700',
      Vacant: 'bg-amber-50 text-amber-700',
      'Under maintenance': 'bg-rose-50 text-rose-700',
      Active: 'bg-brand-50 text-brand-700',
    };
    return `<span class="rounded-full ${map[status] || 'bg-slate-100 text-slate-600'} px-2.5 py-1 text-xs font-semibold">${status}</span>`;
  }

  function render(u) {
    const root = document.getElementById('unit-detail-root');
    if (!root) return;
    document.title = `Property ERP — Unit ${u.code}`;
    const tenantHref = u.tenantName ? window.PropertyERP.tenantHref(u.tenantName) : null;
    const property = window.PropertyERP.getProperty?.(u.propertyId);

    root.innerHTML = `
      <div class="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <a href="units.html" class="hover:text-slate-800">Units</a>
        <span class="text-slate-300">/</span>
        <a href="${u.propertyHref}" class="hover:text-slate-800">${u.propertyName}</a>
        <span class="text-slate-300">/</span>
        <span class="font-medium text-slate-800">${u.code}</span>
      </div>

      <section class="db-card overflow-hidden">
        <div class="relative h-44 sm:h-56">
          <img src="${u.image || property?.image || ''}" alt="${u.propertyName}" class="h-full w-full object-cover" />
          <div class="absolute inset-0" style="background:rgba(15,23,42,.5)"></div>
          <div class="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
            <div class="mb-2 flex flex-wrap items-center gap-2">${pill(u.status)}<span class="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white">${u.type}</span></div>
            <h1 class="text-2xl font-bold text-white sm:text-3xl">Unit ${u.code}</h1>
            <p class="mt-1 text-sm text-white/85">${u.propertyName} · Floor ${u.floor} · ${u.location || ''}</p>
          </div>
        </div>
        <div class="grid gap-4 border-t border-slate-100 p-4 sm:grid-cols-2 lg:grid-cols-4 sm:p-5">
          <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs font-medium uppercase tracking-wide text-slate-400">Monthly rent</p>${money(u.rent, 'table')}</div>
          <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs font-medium uppercase tracking-wide text-slate-400">Tenant</p><p class="mt-1 text-lg font-bold text-slate-900">${u.tenantName ? `<a class="hover:text-brand-700" href="${tenantHref}">${u.tenantName}</a>` : '— Vacant —'}</p></div>
          <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs font-medium uppercase tracking-wide text-slate-400">Building</p><p class="mt-1 text-lg font-bold text-slate-900"><a class="hover:text-brand-700" href="${u.propertyHref}">${u.propertyName}</a></p></div>
          <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs font-medium uppercase tracking-wide text-slate-400">Floor / type</p><p class="mt-1 text-lg font-bold text-slate-900">${u.floor} · ${u.type}</p></div>
        </div>
      </section>

      <div class="grid gap-4 lg:grid-cols-2">
        <section class="db-card p-5 space-y-3">
          <h2 class="text-base font-bold text-slate-900">Building context</h2>
          <p class="text-sm text-slate-500">This unit sits inside the parent property record with shared analytics and IoT meters.</p>
          <div class="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm">
            <p><span class="text-slate-400">Occupancy</span> · <strong>${property?.occupancy ?? '—'}%</strong></p>
            <p class="mt-1"><span class="text-slate-400">Collection rate</span> · <strong>${property?.collectionRate ?? '—'}%</strong></p>
            <p class="mt-1"><span class="text-slate-400">Manager</span> · <strong>${property?.manager ?? '—'}</strong></p>
          </div>
          <a href="${u.propertyHref}" class="inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Open building analytics →</a>
        </section>

        <section class="db-card p-5 space-y-3">
          <h2 class="text-base font-bold text-slate-900">Tenant &amp; ops</h2>
          ${u.tenantName ? `
            <p class="text-sm text-slate-600">Current occupant <a class="font-semibold text-brand-700 hover:underline" href="${tenantHref}">${u.tenantName}</a>.</p>
            <div class="flex flex-wrap gap-2">
              <a href="${tenantHref}" class="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium">Tenant profile</a>
              <a href="iot.html" class="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium">IoT meters</a>
              <a href="maintenance.html" class="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium">Maintenance</a>
            </div>` : `
            <p class="text-sm text-slate-600">Unit is vacant — ready for leasing or viewing booking.</p>
            <div class="flex flex-wrap gap-2">
              <button type="button" data-action="open-modal" data-modal="add-lease" class="rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white">Create lease</button>
              <a href="iot.html" class="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium">IoT meters</a>
            </div>`}
        </section>
      </div>`;

    window.DatabrainMoney?.init?.();
  }

  function init() {
    const root = document.getElementById('unit-detail-root');
    if (!root || !window.PropertyERP?.getUnit) return;
    const id = window.PropertyERP.routeId(['id', 'unit']);
    const unit = window.PropertyERP.getUnit(id);
    if (!unit) {
      root.innerHTML = `<div class="db-card p-10 text-center"><h1 class="text-xl font-bold">Unit not found</h1><a href="units.html" class="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Back to units</a></div>`;
      return;
    }
    render(unit);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
