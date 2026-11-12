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
      Cleared: 'bg-brand-50 text-brand-700',
      Paid: 'bg-brand-50 text-brand-700',
      Partial: 'bg-amber-50 text-amber-700',
      Overdue: 'bg-rose-50 text-rose-700',
      Issued: 'bg-sky-50 text-sky-700',
      Verified: 'bg-brand-50 text-brand-700',
      High: 'bg-rose-50 text-rose-700',
      Medium: 'bg-amber-50 text-amber-700',
      Low: 'bg-brand-50 text-brand-700',
      Delivered: 'bg-brand-50 text-brand-700',
      Opened: 'bg-sky-50 text-sky-700',
      Read: 'bg-brand-50 text-brand-700',
      Completed: 'bg-brand-50 text-brand-700',
      'In progress': 'bg-sky-50 text-sky-700',
      Scheduled: 'bg-amber-50 text-amber-700',
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

  function render(t) {
    const root = document.getElementById('tenant-detail-root');
    if (!root) return;
    document.title = `Property ERP — ${t.name}`;
    const wa = `https://wa.me/${String(t.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${t.name}, regarding your tenancy with Property ERP.`)}`;
    const riskColor = t.risk === 'High' ? 'text-rose-600' : t.risk === 'Medium' ? 'text-amber-600' : 'text-brand-600';

    root.innerHTML = `
      <div class="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <a href="tenants.html" class="hover:text-slate-800">Tenants</a>
        <span class="text-slate-300">/</span>
        <span class="font-medium text-slate-800">${t.name}</span>
        <span class="ml-auto rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">360° profile</span>
      </div>

      <section class="db-card p-5 sm:p-6">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="min-w-0 flex-1">
            <div class="mb-2 flex flex-wrap items-center gap-2">
              <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">${t.code}</span>
              ${pill(t.status)}
              ${pill(t.kyc || 'Verified')}
              <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">${t.type}</span>
              ${pill(t.risk)} risk
            </div>
            <h1 class="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">${t.name}</h1>
            <p class="mt-1 text-sm text-slate-500">${t.phone} · ${t.email}</p>
            <p class="mt-1 text-sm text-slate-500">${(t.properties || []).map((name, i) => {
              const id = t.propertyIds?.[i];
              return id ? `<a class="hover:text-brand-700 hover:underline" href="property.html?id=${encodeURIComponent(id)}">${name}</a>` : name;
            }).join(' · ') || 'No linked property'}</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <a href="${wa}" target="_blank" rel="noopener" class="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium">WhatsApp</a>
            <button type="button" data-action="open-modal" data-modal="record-payment" class="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium">Record payment</button>
            <a href="arrears.html" class="rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white">Arrears desk</a>
          </div>
        </div>
        <div class="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs uppercase tracking-wide text-slate-400">Move-in</p><p class="mt-1 font-semibold text-slate-900">${t.moveIn || '—'}</p></div>
          <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs uppercase tracking-wide text-slate-400">Preferred channel</p><p class="mt-1 font-semibold text-slate-900">${t.preferredChannel}</p></div>
          <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs uppercase tracking-wide text-slate-400">Payment method</p><p class="mt-1 font-semibold text-slate-900">${t.paymentMethod}</p></div>
          <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs uppercase tracking-wide text-slate-400">Billing cycle</p><p class="mt-1 font-semibold text-slate-900">${t.billingCycle}</p></div>
        </div>
      </section>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <div class="db-card p-5"><p class="text-sm text-slate-500">Monthly rent</p>${money(t.monthlyRent || 0, 'stack')}</div>
        <div class="db-card p-5"><p class="text-sm text-slate-500">Deposit held</p>${money(t.deposit || 0, 'stack')}</div>
        <div class="db-card p-5"><p class="text-sm text-slate-500">Outstanding</p>${money(t.balance || 0, 'stack')}</div>
        <div class="db-card p-5"><p class="text-sm text-slate-500">Collection rate</p><p class="mt-1 text-2xl font-bold ${riskColor}">${t.collectionRate}%</p></div>
        <div class="db-card p-5"><p class="text-sm text-slate-500">Credit score</p><p class="mt-1 text-2xl font-bold text-slate-900">${t.creditScore}</p></div>
        <div class="db-card p-5"><p class="text-sm text-slate-500">Lifetime value</p>${money(t.lifetimeValue || 0, 'stack')}</div>
      </div>

      <div class="grid gap-4 lg:grid-cols-3">
        <section class="db-card p-5 lg:col-span-2 space-y-3">
          <h2 class="text-base font-bold text-slate-900">Identity &amp; contacts</h2>
          <div class="grid gap-3 sm:grid-cols-2 text-sm">
            <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs text-slate-400">Primary phone</p><p class="mt-1 font-semibold">${t.phone}</p></div>
            <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs text-slate-400">Alternate phone</p><p class="mt-1 font-semibold">${t.altPhone || '—'}</p></div>
            <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs text-slate-400">Email</p><p class="mt-1 font-semibold break-all">${t.email}</p></div>
            <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs text-slate-400">National ID / Reg</p><p class="mt-1 font-semibold">${t.nationalId || '—'}</p></div>
            <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs text-slate-400">TIN</p><p class="mt-1 font-semibold">${t.tin || '—'}</p></div>
            <div class="rounded-xl bg-slate-50 px-4 py-3"><p class="text-xs text-slate-400">Bank</p><p class="mt-1 font-semibold">${t.bankName || '—'}</p></div>
          </div>
        </section>
        <section class="db-card p-5 space-y-3">
          <h2 class="text-base font-bold text-slate-900">Guarantor / next of kin</h2>
          ${(t.guarantors || []).map((g) => `
            <div class="rounded-xl border border-slate-100 px-4 py-3 text-sm">
              <p class="font-semibold text-slate-900">${g.name}</p>
              <p class="text-slate-500">${g.relation} · ${g.phone}</p>
              <p class="mt-2">${pill(g.status)}</p>
            </div>`).join('') || '<p class="text-sm text-slate-500">No guarantor on file.</p>'}
          <ul class="space-y-2 text-sm text-slate-600">
            ${(t.notes || []).map((n) => `<li class="flex gap-2"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"></span>${n}</li>`).join('')}
          </ul>
        </section>
      </div>

      ${section('Units & buildings', 'Every leased space linked to this tenant', `
        <div class="overflow-x-auto">
          <table class="w-full min-w-[720px] text-left text-sm">
            <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th class="px-5 py-3 font-medium">Unit</th>
                <th class="px-5 py-3 font-medium">Building</th>
                <th class="px-5 py-3 font-medium">Floor / type</th>
                <th class="px-5 py-3 font-medium">Rent</th>
                <th class="px-5 py-3 font-medium">Power / water</th>
                <th class="px-5 py-3 font-medium">Status</th>
                <th class="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${(t.units || []).map((u) => `
                <tr class="hover:bg-slate-50/70">
                  <td class="px-5 py-3 font-medium"><a class="text-brand-700 hover:underline" href="${u.href}">${u.unitCode}</a></td>
                  <td class="px-5 py-3"><a class="hover:text-brand-700 hover:underline" href="property.html?id=${encodeURIComponent(u.propertyId || '')}">${u.propertyName}</a></td>
                  <td class="px-5 py-3">${u.floor || '—'} · ${u.type || '—'}</td>
                  <td class="px-5 py-3">${money(u.rent, 'table')}</td>
                  <td class="px-5 py-3 text-xs">
                    <span class="${u.iot?.power ? 'text-brand-700' : 'text-rose-600'}">${u.iot?.power ? 'Power on' : 'Power cut'}</span>
                    ·
                    <span class="${u.iot?.water ? 'text-sky-700' : 'text-rose-600'}">${u.iot?.water ? 'Water on' : 'Water cut'}</span>
                  </td>
                  <td class="px-5 py-3">${pill(u.status)}</td>
                  <td class="px-5 py-3 text-right"><a href="${u.href}" class="font-semibold text-brand-700 hover:underline">Unit 360 →</a></td>
                </tr>`).join('') || `<tr><td colspan="7" class="px-5 py-8 text-center text-slate-400">No units linked.</td></tr>`}
            </tbody>
          </table>
        </div>`)}

      <div class="grid gap-4 xl:grid-cols-2">
        ${section('Active leases', 'Terms, tax treatment and renewals', `
          <div class="overflow-x-auto">
            <table class="w-full min-w-[560px] text-left text-sm">
              <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                <tr><th class="px-5 py-3 font-medium">Unit</th><th class="px-5 py-3 font-medium">Building</th><th class="px-5 py-3 font-medium">Start</th><th class="px-5 py-3 font-medium">End</th><th class="px-5 py-3 font-medium">Rent</th><th class="px-5 py-3 font-medium">Tax</th><th class="px-5 py-3 font-medium">Status</th></tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${(t.leases || []).map((l) => `
                  <tr class="hover:bg-slate-50/70">
                    <td class="px-5 py-3 font-medium"><a href="${l.unitHref}" class="hover:text-brand-700 hover:underline">${l.unitCode}</a></td>
                    <td class="px-5 py-3">${l.propertyName}</td>
                    <td class="px-5 py-3">${l.start}</td>
                    <td class="px-5 py-3">${l.end || l.expiry}</td>
                    <td class="px-5 py-3">${money(l.rent, 'table')}</td>
                    <td class="px-5 py-3">${l.tax || '—'}</td>
                    <td class="px-5 py-3">${pill(l.status)}</td>
                  </tr>`).join('') || `<tr><td colspan="7" class="px-5 py-8 text-center text-slate-400">No leases.</td></tr>`}
              </tbody>
            </table>
          </div>`, `<a href="leases.html" class="text-sm font-medium text-brand-700 hover:underline">All leases</a>`)}

        ${section('Arrears breakdown', 'Days overdue and chase status', `
          ${(t.arrearsItems || []).length ? `
          <div class="overflow-x-auto">
            <table class="w-full min-w-[480px] text-left text-sm">
              <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                <tr><th class="px-5 py-3 font-medium">Unit</th><th class="px-5 py-3 font-medium">Building</th><th class="px-5 py-3 font-medium">Days</th><th class="px-5 py-3 font-medium">Amount</th></tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${(t.arrearsItems || []).map((a) => `
                  <tr class="hover:bg-slate-50/70">
                    <td class="px-5 py-3 font-medium"><a href="${a.href}" class="hover:text-brand-700 hover:underline">${a.unit}</a></td>
                    <td class="px-5 py-3">${a.propertyName || '—'}</td>
                    <td class="px-5 py-3"><span class="font-medium ${a.days > 30 ? 'text-rose-600' : 'text-amber-600'}">${a.days}d</span></td>
                    <td class="px-5 py-3">${money(a.amount, 'table')}</td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>` : `<p class="p-5 text-sm text-slate-500">No open arrears — account is current.</p>`}`, `<a href="arrears.html" class="text-sm font-medium text-brand-700 hover:underline">Arrears board</a>`)}
      </div>

      <div class="grid gap-4 xl:grid-cols-2">
        ${section('Invoices', 'Issued, paid and overdue rent invoices', `
          <div class="overflow-x-auto">
            <table class="w-full min-w-[560px] text-left text-sm">
              <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                <tr><th class="px-5 py-3 font-medium">Invoice</th><th class="px-5 py-3 font-medium">Period</th><th class="px-5 py-3 font-medium">Amount</th><th class="px-5 py-3 font-medium">VAT</th><th class="px-5 py-3 font-medium">WHT</th><th class="px-5 py-3 font-medium">Due</th><th class="px-5 py-3 font-medium">Status</th></tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${(t.invoices || []).map((inv) => `
                  <tr class="hover:bg-slate-50/70">
                    <td class="px-5 py-3 font-medium">${inv.id}</td>
                    <td class="px-5 py-3">${inv.period}</td>
                    <td class="px-5 py-3">${money(inv.amount, 'table')}</td>
                    <td class="px-5 py-3">${money(inv.vat, 'table')}</td>
                    <td class="px-5 py-3">${money(inv.wht, 'table')}</td>
                    <td class="px-5 py-3">${inv.due}</td>
                    <td class="px-5 py-3">${pill(inv.status)}</td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>`, `<a href="rent.html" class="text-sm font-medium text-brand-700 hover:underline">Rent desk</a>`)}

        ${section('Payment history', 'Cleared and partial receipts', `
          <div class="overflow-x-auto">
            <table class="w-full min-w-[560px] text-left text-sm">
              <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                <tr><th class="px-5 py-3 font-medium">Ref</th><th class="px-5 py-3 font-medium">Period</th><th class="px-5 py-3 font-medium">Amount</th><th class="px-5 py-3 font-medium">Method</th><th class="px-5 py-3 font-medium">Date</th><th class="px-5 py-3 font-medium">Status</th></tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${(t.payments || []).map((p) => `
                  <tr class="hover:bg-slate-50/70">
                    <td class="px-5 py-3 font-medium">${p.id}<div class="text-xs font-normal text-slate-400">${p.ref}</div></td>
                    <td class="px-5 py-3">${p.period}</td>
                    <td class="px-5 py-3">${money(p.amount, 'table')}</td>
                    <td class="px-5 py-3">${p.method}</td>
                    <td class="px-5 py-3">${p.date}</td>
                    <td class="px-5 py-3">${pill(p.status)}</td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>`, `<a href="payments.html" class="text-sm font-medium text-brand-700 hover:underline">Payments</a>`)}
      </div>

      <div class="grid gap-4 xl:grid-cols-2">
        ${section('Maintenance tickets', 'Issues raised on this tenant’s units', `
          ${(t.maintenance || []).length ? `
          <ul class="divide-y divide-slate-100">
            ${(t.maintenance || []).map((m) => `
              <li class="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
                <div>
                  <p class="text-sm font-semibold text-slate-900">${m.id} · <a class="hover:text-brand-700 hover:underline" href="${m.unitHref}">${m.unit}</a></p>
                  <p class="mt-1 text-sm text-slate-500">${m.issue}</p>
                  <p class="mt-1 text-xs text-slate-400">${m.propertyName || ''}</p>
                </div>
                <div class="flex flex-wrap gap-2">${pill(m.priority)}${pill(m.status)}</div>
              </li>`).join('')}
          </ul>` : `<p class="p-5 text-sm text-slate-500">No open maintenance for this tenant.</p>`}`, `<a href="maintenance.html" class="text-sm font-medium text-brand-700 hover:underline">Tickets</a>`)}

        ${section('IoT utility meters', 'Live cut status and usage on linked units', `
          <div class="overflow-x-auto">
            <table class="w-full min-w-[640px] text-left text-sm">
              <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                <tr><th class="px-5 py-3 font-medium">Unit</th><th class="px-5 py-3 font-medium">Meters</th><th class="px-5 py-3 font-medium">Power</th><th class="px-5 py-3 font-medium">Water</th><th class="px-5 py-3 font-medium">kWh MTD</th><th class="px-5 py-3 font-medium">m³ MTD</th></tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${(t.units || []).map((u) => `
                  <tr class="hover:bg-slate-50/70">
                    <td class="px-5 py-3 font-medium"><a href="${u.href}" class="hover:text-brand-700 hover:underline">${u.unitCode}</a></td>
                    <td class="px-5 py-3 text-xs text-slate-500">${u.iot?.meterPower || '—'}<br/>${u.iot?.meterWater || '—'}</td>
                    <td class="px-5 py-3">${u.iot?.power ? pill('Active') : pill('Suspended')}</td>
                    <td class="px-5 py-3">${u.iot?.water ? pill('Active') : pill('Suspended')}</td>
                    <td class="px-5 py-3">${u.iot?.kwhMonth ?? 0}</td>
                    <td class="px-5 py-3">${u.iot?.m3Month ?? 0}</td>
                  </tr>`).join('') || `<tr><td colspan="6" class="px-5 py-8 text-center text-slate-400">No meters.</td></tr>`}
              </tbody>
            </table>
          </div>`, `<a href="iot.html" class="text-sm font-medium text-brand-700 hover:underline">IoT console</a>`)}
      </div>

      <div class="grid gap-4 xl:grid-cols-2">
        ${section('Documents & KYC', 'Agreements, IDs and receipts on file', `
          <ul class="divide-y divide-slate-100">
            ${(t.documents || []).map((d) => `
              <li class="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm">
                <div>
                  <p class="font-medium text-slate-900">${d.name}</p>
                  <p class="text-xs text-slate-400">${d.type} · ${d.size} · updated ${d.updated}</p>
                </div>
                <a href="documents.html" class="font-semibold text-brand-700 hover:underline">Open</a>
              </li>`).join('')}
          </ul>`, `<a href="documents.html" class="text-sm font-medium text-brand-700 hover:underline">Vault</a>`)}

        ${section('Communications log', 'WhatsApp, SMS, email and calls', `
          <ul class="divide-y divide-slate-100">
            ${(t.comms || []).map((c) => `
              <li class="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm">
                <div>
                  <p class="font-medium text-slate-900">${c.subject}</p>
                  <p class="text-xs text-slate-400">${c.channel} · ${c.direction} · ${c.date}</p>
                </div>
                ${pill(c.status)}
              </li>`).join('')}
          </ul>`)}
      </div>

      ${section('Activity timeline', 'Lease, payments, inspections and reminders', `
        <ol class="space-y-0 px-5 py-4">
          ${(t.timeline || []).map((item, i) => `
            <li class="relative flex gap-4 pb-5 ${i === (t.timeline.length - 1) ? '' : ''}">
              <div class="flex flex-col items-center">
                <span class="mt-1 h-2.5 w-2.5 rounded-full bg-brand-500"></span>
                ${i < t.timeline.length - 1 ? '<span class="w-px flex-1 bg-slate-200"></span>' : ''}
              </div>
              <div class="pb-1">
                <p class="text-xs text-slate-400">${item.date}</p>
                <p class="text-sm font-semibold text-slate-900">${item.title}</p>
                <p class="text-sm text-slate-500">${item.detail}</p>
              </div>
            </li>`).join('')}
        </ol>`)}
    `;

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
