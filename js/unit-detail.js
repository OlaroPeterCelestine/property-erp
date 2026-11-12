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
      Suspended: 'bg-amber-50 text-amber-700',
      High: 'bg-rose-50 text-rose-700',
      Medium: 'bg-sky-50 text-sky-700',
      Low: 'bg-slate-100 text-slate-600',
      'In progress': 'bg-sky-50 text-sky-700',
      Scheduled: 'bg-amber-50 text-amber-700',
      Completed: 'bg-brand-50 text-brand-700',
    };
    return `<span class="rounded-full ${map[status] || 'bg-slate-100 text-slate-600'} px-2.5 py-1 text-xs font-semibold">${status}</span>`;
  }

  function section(title, subtitle, body, actionHtml) {
    return `<section class="db-card overflow-hidden">
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 class="text-base font-bold text-slate-900">${title}</h2>
          ${subtitle ? `<p class="text-xs text-slate-400">${subtitle}</p>` : ''}
        </div>
        ${actionHtml || ''}
      </div>
      ${body}
    </section>`;
  }

  function render(u) {
    const root = document.getElementById('unit-detail-root');
    if (!root) return;
    document.title = `Property ERP — Unit ${u.code}`;
    const tenantHref = u.tenantName ? window.PropertyERP.tenantHref(u.tenantName) : null;
    const property = window.PropertyERP.getProperty?.(u.propertyId);
    const tenant = u.tenantName ? window.PropertyERP.getTenant?.(u.tenantName) : null;
    const iot = u.iot || {};
    const cover = u.image || property?.image || '';
    const gallery = (u.gallery || property?.gallery || [cover]).filter(Boolean).slice(0, 5);

    root.innerHTML = `
      <div class="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <a href="units.html" class="hover:text-slate-800">Units</a>
        <span class="text-slate-300">/</span>
        <a href="${u.propertyHref}" class="hover:text-slate-800">${u.propertyName}</a>
        <span class="text-slate-300">/</span>
        <span class="font-medium text-slate-800">${u.code}</span>
        <span class="ml-auto rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">360° unit</span>
      </div>

      <section class="db-card overflow-hidden">
        <div class="relative h-52 sm:h-72">
          <img id="unit-cover-image" src="${cover}" alt="Unit ${u.code}" class="h-full w-full object-cover" />
          <div class="absolute inset-0" style="background:rgba(15,23,42,.5)"></div>
          <div class="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
            <div class="mb-2 flex flex-wrap items-center gap-2">
              ${pill(u.status)}
              <span class="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white">${u.type}</span>
              <span class="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white">${u.propertyCode || ''}</span>
            </div>
            <h1 class="text-2xl font-bold text-white sm:text-3xl">Unit ${u.code}</h1>
            <p class="mt-1 text-sm text-white/85">${u.propertyName} · Floor ${u.floor} · ${u.location || ''}</p>
          </div>
        </div>
        ${gallery.length ? `<div class="property-gallery border-t border-slate-100 p-3 sm:p-4">
          ${gallery.map((src, i) => `
            <button type="button" class="property-gallery-thumb ${i === 0 ? 'is-active' : ''}" data-gallery-src="${src}">
              <img src="${src}" alt="Unit photo ${i + 1}" loading="lazy" />
            </button>`).join('')}
        </div>` : ''}
        <div class="grid gap-4 border-t border-slate-100 p-4 sm:grid-cols-2 lg:grid-cols-4 sm:p-5">
          <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs font-medium uppercase tracking-wide text-slate-400">Monthly rent</p>${money(u.rent, 'table')}</div>
          <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs font-medium uppercase tracking-wide text-slate-400">Tenant</p><p class="mt-1 text-lg font-bold text-slate-900">${u.tenantName ? `<a class="hover:text-brand-700" href="${tenantHref}">${u.tenantName}</a>` : '— Vacant —'}</p></div>
          <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs font-medium uppercase tracking-wide text-slate-400">Area</p><p class="mt-1 text-lg font-bold text-slate-900">${u.areaSqm || '—'} m²</p></div>
          <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs font-medium uppercase tracking-wide text-slate-400">Deposit held</p>${money(u.depositHeld || 0, 'table')}</div>
        </div>
      </section>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <div class="db-card p-5"><p class="text-sm text-slate-500">Beds / baths</p><p class="mt-1 text-2xl font-bold text-slate-900">${u.bedrooms == null ? '—' : u.bedrooms} / ${u.bathrooms ?? '—'}</p></div>
        <div class="db-card p-5"><p class="text-sm text-slate-500">Furnished</p><p class="mt-1 text-2xl font-bold text-slate-900">${u.furnished ? 'Yes' : 'No'}</p></div>
        <div class="db-card p-5"><p class="text-sm text-slate-500">Parking</p><p class="mt-1 text-2xl font-bold text-slate-900">${u.parking ? 'Yes' : 'No'}</p></div>
        <div class="db-card p-5"><p class="text-sm text-slate-500">Keys issued</p><p class="mt-1 text-2xl font-bold text-slate-900">${u.keysIssued ? 'Yes' : 'No'}</p></div>
        <div class="db-card p-5"><p class="text-sm text-slate-500">Power (live)</p><p class="mt-1 text-2xl font-bold ${iot.power ? 'text-brand-600' : 'text-rose-500'}">${iot.power ? 'ON' : 'CUT'}</p></div>
        <div class="db-card p-5"><p class="text-sm text-slate-500">Water (live)</p><p class="mt-1 text-2xl font-bold ${iot.water ? 'text-sky-600' : 'text-rose-500'}">${iot.water ? 'ON' : 'CUT'}</p></div>
      </div>

      <div class="grid gap-4 lg:grid-cols-3">
        <section class="db-card p-5 space-y-3 lg:col-span-2">
          <h2 class="text-base font-bold text-slate-900">Unit specification</h2>
          <div class="grid gap-3 sm:grid-cols-2 text-sm">
            <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs text-slate-400">Building</p><p class="mt-1 font-semibold"><a class="hover:text-brand-700" href="${u.propertyHref}">${u.propertyName}</a></p></div>
            <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs text-slate-400">Asset type</p><p class="mt-1 font-semibold">${u.propertyType || property?.type || '—'}</p></div>
            <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs text-slate-400">Floor</p><p class="mt-1 font-semibold">${u.floor}</p></div>
            <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs text-slate-400">Unit type</p><p class="mt-1 font-semibold">${u.type}</p></div>
            <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs text-slate-400">Manager</p><p class="mt-1 font-semibold">${u.propertyManager || property?.manager || '—'}</p></div>
            <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs text-slate-400">Balcony</p><p class="mt-1 font-semibold">${u.balcony ? 'Yes' : 'No'}</p></div>
            <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs text-slate-400">Last inspection</p><p class="mt-1 font-semibold">${u.lastInspection}</p></div>
            <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs text-slate-400">Next inspection</p><p class="mt-1 font-semibold">${u.nextInspection}</p></div>
          </div>
          <div>
            <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Amenities</p>
            <div class="flex flex-wrap gap-2">
              ${(u.amenities || []).map((a) => `<span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">${a}</span>`).join('')}
            </div>
          </div>
        </section>

        <section class="db-card p-5 space-y-3">
          <h2 class="text-base font-bold text-slate-900">Tenant snapshot</h2>
          ${u.tenantName && tenant ? `
            <p class="text-lg font-bold text-slate-900"><a class="hover:text-brand-700" href="${tenantHref}">${tenant.name}</a></p>
            <p class="text-sm text-slate-500">${tenant.phone}<br/>${tenant.email}</p>
            <div class="rounded-xl bg-slate-50 px-3 py-2 text-sm">
              <p>Balance · <strong class="${tenant.balance > 0 ? 'text-rose-600' : 'text-brand-700'}">${money(tenant.balance || 0, 'inline')}</strong></p>
              <p class="mt-1">Deposit · <strong>${money(tenant.deposit || 0, 'inline')}</strong></p>
              <p class="mt-1">Risk · <strong>${tenant.risk}</strong> · Score ${tenant.creditScore}</p>
            </div>
            <div class="flex flex-wrap gap-2">
              <a href="${tenantHref}" class="rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white">Tenant 360 →</a>
              <a href="arrears.html" class="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium">Arrears</a>
            </div>` : `
            <p class="text-sm text-slate-600">Unit is vacant — ready for leasing or viewing booking.</p>
            <button type="button" data-action="open-modal" data-modal="add-lease" class="rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white">Create lease</button>
            <a href="iot.html" class="inline-flex rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium">IoT meters</a>`}
          <ul class="space-y-2 text-sm text-slate-600">
            ${(u.notes || []).map((n) => `<li class="flex gap-2"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"></span>${n}</li>`).join('')}
          </ul>
        </section>
      </div>

      <div class="grid gap-4 xl:grid-cols-2">
        ${section('Lease terms', 'Current agreement on this unit', `
          ${u.lease ? `
          <div class="grid gap-3 p-5 sm:grid-cols-2 text-sm">
            <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs text-slate-400">Tenant</p><p class="mt-1 font-semibold"><a href="${tenantHref || '#'}" class="hover:text-brand-700">${u.lease.tenant}</a></p></div>
            <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs text-slate-400">Status</p><p class="mt-1">${pill(u.lease.status)}</p></div>
            <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs text-slate-400">Start</p><p class="mt-1 font-semibold">${u.lease.start}</p></div>
            <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs text-slate-400">End / expiry</p><p class="mt-1 font-semibold">${u.lease.end || u.lease.expiry}</p></div>
            <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs text-slate-400">Rent</p>${money(u.lease.rent, 'table')}</div>
            <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs text-slate-400">Tax treatment</p><p class="mt-1 font-semibold">${u.lease.tax}</p></div>
          </div>` : `<p class="p-5 text-sm text-slate-500">No active lease on this unit.</p>`}`, `<a href="leases.html" class="text-sm font-medium text-brand-700 hover:underline">Leases</a>`)}

        ${section('Arrears on unit', 'Outstanding rent tied to this space', `
          ${u.arrears ? `
          <div class="p-5">
            <div class="rounded-xl border border-rose-100 bg-rose-50/60 px-4 py-4">
              <p class="text-sm font-semibold text-rose-700">${u.arrears.tenant}</p>
              <p class="mt-1 text-sm text-rose-600">${u.arrears.days} days overdue</p>
              <div class="mt-3">${money(u.arrears.amount, 'stack')}</div>
              ${tenantHref ? `<a href="${tenantHref}" class="mt-3 inline-flex text-sm font-semibold text-rose-700 hover:underline">Open tenant ledger →</a>` : ''}
            </div>
          </div>` : `<p class="p-5 text-sm text-slate-500">No arrears recorded on this unit.</p>`}`, `<a href="arrears.html" class="text-sm font-medium text-brand-700 hover:underline">Arrears</a>`)}
      </div>

      <div class="grid gap-4 xl:grid-cols-2">
        ${section('IoT meters & usage', 'UMEME / NWSC connection and live cut controls', `
          <div class="grid gap-3 p-5 sm:grid-cols-2 text-sm">
            <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs text-slate-400">Connection</p><p class="mt-1 font-semibold">${iot.connected ? (iot.online ? 'Online' : 'Offline') : 'Not linked'}</p></div>
            <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs text-slate-400">Power meter</p><p class="mt-1 font-semibold">${iot.meterPower || '—'}</p></div>
            <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs text-slate-400">Water meter</p><p class="mt-1 font-semibold">${iot.meterWater || '—'}</p></div>
            <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs text-slate-400">Live draw</p><p class="mt-1 font-semibold">${iot.powerKw || 0} kW · ${iot.waterLpm || 0} L/min</p></div>
            <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs text-slate-400">Power today / MTD</p><p class="mt-1 font-semibold">${iot.kwhToday || 0} / ${iot.kwhMonth || 0} kWh</p></div>
            <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs text-slate-400">Water today / MTD</p><p class="mt-1 font-semibold">${iot.m3Today || 0} / ${iot.m3Month || 0} m³</p></div>
          </div>
          <div class="flex flex-wrap gap-2 border-t border-slate-100 px-5 py-4">
            <a href="iot.html" class="rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white">Open IoT console</a>
            <span class="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm">${iot.power ? 'Power ON' : 'Power CUT'}</span>
            <span class="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm">${iot.water ? 'Water ON' : 'Water CUT'}</span>
          </div>`, `<a href="iot.html" class="text-sm font-medium text-brand-700 hover:underline">IoT</a>`)}

        ${section('Maintenance', 'Tickets raised against this unit', `
          ${(u.maintenance || []).length ? `
          <ul class="divide-y divide-slate-100">
            ${(u.maintenance || []).map((m) => `
              <li class="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
                <div>
                  <p class="text-sm font-semibold text-slate-900">${m.id}</p>
                  <p class="mt-1 text-sm text-slate-500">${m.issue}</p>
                </div>
                <div class="flex flex-wrap gap-2">${pill(m.priority)}${pill(m.status)}</div>
              </li>`).join('')}
          </ul>` : `<p class="p-5 text-sm text-slate-500">No open maintenance tickets.</p>`}`, `<a href="maintenance.html" class="text-sm font-medium text-brand-700 hover:underline">Tickets</a>`)}
      </div>

      <div class="grid gap-4 xl:grid-cols-2">
        ${section('Documents', 'Plans, handover and access logs', `
          <ul class="divide-y divide-slate-100">
            ${(u.documents || []).map((d) => `
              <li class="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm">
                <div>
                  <p class="font-medium text-slate-900">${d.name}</p>
                  <p class="text-xs text-slate-400">${d.type} · ${d.size} · updated ${d.updated}</p>
                </div>
                <a href="documents.html" class="font-semibold text-brand-700 hover:underline">Open</a>
              </li>`).join('')}
          </ul>`, `<a href="documents.html" class="text-sm font-medium text-brand-700 hover:underline">Vault</a>`)}

        ${section('Building context', 'Parent asset performance', `
          <div class="grid gap-3 p-5 sm:grid-cols-2 text-sm">
            <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs text-slate-400">Occupancy</p><p class="mt-1 text-lg font-bold">${property?.occupancy ?? '—'}%</p></div>
            <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs text-slate-400">Collection</p><p class="mt-1 text-lg font-bold">${property?.collectionRate ?? '—'}%</p></div>
            <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs text-slate-400">Score</p><p class="mt-1 text-lg font-bold">${property?.score ?? '—'}</p></div>
            <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs text-slate-400">NOI margin</p><p class="mt-1 text-lg font-bold">${property?.noiMargin ?? '—'}%</p></div>
          </div>
          <div class="border-t border-slate-100 px-5 py-4">
            <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Nearby units</p>
            <div class="flex flex-wrap gap-2">
              ${(u.neighbors || []).map((n) => `<a href="${n.href}" class="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium hover:border-brand-300">${n.code} · ${n.status}</a>`).join('') || '<span class="text-sm text-slate-400">None listed</span>'}
            </div>
            <a href="${u.propertyHref}" class="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Building analytics →</a>
          </div>`)}
      </div>

      ${tenant ? section('Tenant payments & invoices (linked)', 'Pulled from the occupant’s ledger', `
        <div class="grid gap-4 p-5 lg:grid-cols-2">
          <div>
            <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Recent payments</p>
            <ul class="space-y-2 text-sm">
              ${(tenant.payments || []).slice(0, 4).map((p) => `
                <li class="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                  <span>${p.period} · ${p.method}</span>
                  <span class="font-semibold">${money(p.amount, 'inline')}</span>
                </li>`).join('')}
            </ul>
          </div>
          <div>
            <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Invoices</p>
            <ul class="space-y-2 text-sm">
              ${(tenant.invoices || []).map((inv) => `
                <li class="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                  <span>${inv.id} · ${inv.period}</span>
                  ${pill(inv.status)}
                </li>`).join('')}
            </ul>
          </div>
        </div>`, `<a href="${tenantHref}" class="text-sm font-medium text-brand-700 hover:underline">Full tenant ledger</a>`) : ''}
    `;

    window.DatabrainMoney?.init?.();
    root.querySelectorAll('[data-gallery-src]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const img = document.getElementById('unit-cover-image');
        if (img) img.src = btn.dataset.gallerySrc;
        root.querySelectorAll('[data-gallery-src]').forEach((b) => b.classList.toggle('is-active', b === btn));
      });
    });
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
