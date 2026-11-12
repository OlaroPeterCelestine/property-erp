(function () {
  function money(usd, layout) {
    return `<div data-usd="${usd}" data-price-layout="${layout || 'table'}"></div>`;
  }

  function pill(status) {
    const map = {
      Active: 'bg-brand-50 text-brand-700',
      'Pending move-in': 'bg-sky-50 text-sky-700',
      Vacated: 'bg-slate-100 text-slate-600',
      Suspended: 'bg-amber-50 text-amber-700',
      Occupied: 'bg-brand-50 text-brand-700',
    };
    return `<span class="rounded-full ${map[status] || 'bg-slate-100 text-slate-600'} px-2.5 py-1 text-xs font-semibold">${status}</span>`;
  }

  function render(t) {
    const root = document.getElementById('tenant-detail-root');
    if (!root) return;
    document.title = `Property ERP — ${t.name}`;

    root.innerHTML = `
      <div class="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <a href="tenants.html" class="hover:text-slate-800">Tenants</a>
        <span class="text-slate-300">/</span>
        <span class="font-medium text-slate-800">${t.name}</span>
      </div>

      <section class="db-card p-5 sm:p-6">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div class="mb-2 flex flex-wrap items-center gap-2">
              <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">${t.code}</span>
              ${pill(t.status)}
            </div>
            <h1 class="text-2xl font-bold tracking-tight text-slate-900">${t.name}</h1>
            <p class="mt-1 text-sm text-slate-500">${t.phone} · ${t.email}</p>
            <p class="mt-1 text-sm text-slate-500">${(t.properties || []).join(' · ') || 'No linked property'}</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button type="button" data-action="open-modal" data-modal="record-payment" class="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium">Record payment</button>
            <a href="arrears.html" class="rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white">Open arrears</a>
          </div>
        </div>
      </section>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div class="db-card p-5"><p class="text-sm text-slate-500">Deposit held</p>${money(t.deposit, 'stack')}</div>
        <div class="db-card p-5"><p class="text-sm text-slate-500">Outstanding balance</p>${money(t.balance || 0, 'stack')}</div>
        <div class="db-card p-5"><p class="text-sm text-slate-500">Linked units</p><p class="mt-1 text-2xl font-bold text-slate-900">${(t.units || []).length}</p></div>
        <div class="db-card p-5"><p class="text-sm text-slate-500">Properties</p><p class="mt-1 text-2xl font-bold text-slate-900">${(t.properties || []).length}</p></div>
      </div>

      <section class="db-card overflow-hidden">
        <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 class="text-base font-bold text-slate-900">Units &amp; building links</h2>
            <p class="text-xs text-slate-400">Open a unit or building for full detail</p>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full min-w-[640px] text-left text-sm">
            <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th class="px-5 py-3 font-medium">Unit</th>
                <th class="px-5 py-3 font-medium">Building</th>
                <th class="px-5 py-3 font-medium">Rent</th>
                <th class="px-5 py-3 font-medium">Status</th>
                <th class="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${(t.units || []).map((u) => `
                <tr class="hover:bg-slate-50/70">
                  <td class="px-5 py-3 font-medium"><a class="text-brand-700 hover:underline" href="${u.href}">${u.unitCode}</a></td>
                  <td class="px-5 py-3"><a class="hover:text-brand-700 hover:underline" href="property.html?id=${encodeURIComponent(u.propertyId || '')}">${u.propertyName}</a></td>
                  <td class="px-5 py-3">${money(u.rent, 'table')}</td>
                  <td class="px-5 py-3">${pill(u.status)}</td>
                  <td class="px-5 py-3 text-right"><a href="${u.href}" class="font-semibold text-brand-700 hover:underline">Unit detail →</a></td>
                </tr>`).join('') || `<tr><td colspan="5" class="px-5 py-8 text-center text-slate-400">No units linked.</td></tr>`}
            </tbody>
          </table>
        </div>
      </section>

      <section class="db-card p-5">
        <h2 class="text-base font-bold text-slate-900">Ledger snapshot</h2>
        <p class="mt-1 text-sm text-slate-500">Deposit, rent balance and collection status for this tenant.</p>
        <ul class="mt-4 space-y-2 text-sm text-slate-600">
          <li class="flex justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2"><span>Security deposit</span><span class="font-semibold">${money(t.deposit, 'inline')}</span></li>
          <li class="flex justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2"><span>Open rent balance</span><span class="font-semibold ${t.balance > 0 ? 'text-rose-600' : 'text-brand-700'}">${money(t.balance || 0, 'inline')}</span></li>
          <li class="flex justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2"><span>Preferred contact</span><span class="font-semibold">${t.phone}</span></li>
        </ul>
      </section>`;

    window.DatabrainMoney?.init?.();
  }

  function init() {
    const root = document.getElementById('tenant-detail-root');
    if (!root || !window.PropertyERP?.getTenant) return;
    const id = window.PropertyERP.routeId(['id', 'tenant']);
    const tenant = window.PropertyERP.getTenant(id);
    if (!tenant) {
      root.innerHTML = `<div class="db-card p-10 text-center"><h1 class="text-xl font-bold">Tenant not found</h1><a href="tenants.html" class="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Back to tenants</a></div>`;
      return;
    }
    render(tenant);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
