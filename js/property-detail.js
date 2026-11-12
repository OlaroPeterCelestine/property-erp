(function () {
  function hi(name, extraClass) {
    return `<i class="hgi-stroke hgi-${name}${extraClass ? ` ${extraClass}` : ''}" aria-hidden="true"></i>`;
  }

  function money(usd, layout, usdClass, ugxClass) {
    const layoutAttr = layout ? ` data-price-layout="${layout}"` : '';
    const usdAttr = usdClass ? ` data-usd-class="${usdClass}"` : '';
    const ugxAttr = ugxClass ? ` data-ugx-class="${ugxClass}"` : '';
    return `<div data-usd="${usd}"${layoutAttr}${usdAttr}${ugxAttr}></div>`;
  }

  function statusPill(status) {
    const map = {
      Active: 'bg-brand-50 text-brand-600',
      Occupied: 'bg-brand-50 text-brand-600',
      Paid: 'bg-brand-50 text-brand-600',
      Approved: 'bg-brand-50 text-brand-600',
      Completed: 'bg-brand-50 text-brand-600',
      Vacant: 'bg-amber-50 text-amber-600',
      Submitted: 'bg-amber-50 text-amber-600',
      Scheduled: 'bg-amber-50 text-amber-600',
      'Under maintenance': 'bg-amber-50 text-amber-600',
      'In progress': 'bg-sky-50 text-sky-600',
      'Quotation pending': 'bg-amber-50 text-amber-600',
      Inactive: 'bg-slate-100 text-slate-600',
      High: 'bg-rose-50 text-rose-600',
      Critical: 'bg-rose-50 text-rose-600',
      Medium: 'bg-sky-50 text-sky-600',
      Low: 'bg-slate-100 text-slate-600',
    };
    const cls = map[status] || 'bg-slate-100 text-slate-600';
    return `<span class="rounded-full ${cls} px-2.5 py-1 text-xs font-medium">${status}</span>`;
  }

  function chartDefaults() {
    if (typeof Chart === 'undefined') return;
    Chart.defaults.font.family = 'Inter, ui-sans-serif, system-ui, sans-serif';
    Chart.defaults.color = '#94a3b8';
  }

  function renderCharts(p) {
    if (typeof Chart === 'undefined') return;
    chartDefaults();

    const rentCanvas = document.getElementById('propertyRentChart');
    if (rentCanvas) {
      new Chart(rentCanvas, {
        type: 'line',
        data: {
          labels: p.months.labels,
          datasets: [
            {
              label: 'Expected',
              data: p.months.expected,
              borderColor: '#94a3b8',
              borderDash: [5, 5],
              tension: 0.35,
              pointRadius: 3,
              borderWidth: 2,
              fill: false,
            },
            {
              label: 'Collected',
              data: p.months.collected,
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              tension: 0.35,
              pointRadius: 3,
              borderWidth: 2,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', align: 'end', labels: { boxWidth: 10, usePointStyle: true, pointStyle: 'circle' } },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const ugx = Math.round(Number(ctx.raw) * 3700);
                  const ugxLabel = ugx >= 1_000_000 ? `UGX ${(ugx / 1_000_000).toFixed(1)}M` : `UGX ${ugx.toLocaleString()}`;
                  return `${ctx.dataset.label}: ${ugxLabel} ($${Number(ctx.raw).toLocaleString()})`;
                },
              },
            },
          },
          scales: {
            x: { grid: { display: false }, border: { display: false } },
            y: {
              beginAtZero: true,
              grid: { color: '#f1f5f9' },
              border: { display: false },
              ticks: {
                callback: (v) => {
                  const ugx = Math.round(v * 3700);
                  return ugx >= 1_000_000 ? `${(ugx / 1_000_000).toFixed(0)}M` : `${Math.round(ugx / 1000)}k`;
                },
              },
            },
          },
        },
      });
    }

    const pnlCanvas = document.getElementById('propertyPnlChart');
    if (pnlCanvas) {
      new Chart(pnlCanvas, {
        type: 'bar',
        data: {
          labels: p.months.labels,
          datasets: [
            {
              label: 'Income',
              data: p.months.collected,
              backgroundColor: '#14b8a6',
              borderRadius: 6,
              barPercentage: 0.6,
              categoryPercentage: 0.7,
            },
            {
              label: 'Expenses',
              data: p.months.expenses,
              backgroundColor: '#fbbf24',
              borderRadius: 6,
              barPercentage: 0.6,
              categoryPercentage: 0.7,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', align: 'end', labels: { boxWidth: 10, usePointStyle: true, pointStyle: 'rectRounded' } },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const ugx = Math.round(Number(ctx.raw) * 3700);
                  const ugxLabel = ugx >= 1_000_000 ? `UGX ${(ugx / 1_000_000).toFixed(1)}M` : `UGX ${ugx.toLocaleString()}`;
                  return `${ctx.dataset.label}: ${ugxLabel} ($${Number(ctx.raw).toLocaleString()})`;
                },
              },
            },
          },
          scales: {
            x: { grid: { display: false }, border: { display: false } },
            y: {
              beginAtZero: true,
              grid: { color: '#f1f5f9' },
              border: { display: false },
              ticks: {
                callback: (v) => {
                  const ugx = Math.round(v * 3700);
                  return ugx >= 1_000_000 ? `${(ugx / 1_000_000).toFixed(0)}M` : `${Math.round(ugx / 1000)}k`;
                },
              },
            },
          },
        },
      });
    }

    const occCanvas = document.getElementById('propertyOccupancyChart');
    if (occCanvas) {
      new Chart(occCanvas, {
        type: 'doughnut',
        data: {
          labels: ['Occupied', 'Vacant', 'Maintenance'],
          datasets: [{
            data: [p.occupied, p.vacant, p.maintenance],
            backgroundColor: ['#10b981', '#fbbf24', '#f43f5e'],
            borderWidth: 0,
            hoverOffset: 4,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '68%',
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 10, usePointStyle: true, pointStyle: 'circle', padding: 16 } },
          },
        },
      });
    }

    const mixCanvas = document.getElementById('propertyMixChart');
    if (mixCanvas && p.unitMix?.length) {
      new Chart(mixCanvas, {
        type: 'bar',
        data: {
          labels: p.unitMix.map((u) => u.type),
          datasets: [{
            label: 'Units',
            data: p.unitMix.map((u) => u.count),
            backgroundColor: '#34d399',
            borderRadius: 8,
            barPercentage: 0.55,
          }],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { beginAtZero: true, grid: { color: '#f1f5f9' }, border: { display: false }, ticks: { stepSize: 1 } },
            y: { grid: { display: false }, border: { display: false } },
          },
        },
      });
    }

    const expenseCanvas = document.getElementById('propertyExpenseChart');
    if (expenseCanvas && p.expenseBreakdown?.length) {
      new Chart(expenseCanvas, {
        type: 'doughnut',
        data: {
          labels: p.expenseBreakdown.map((x) => x.label),
          datasets: [{
            data: p.expenseBreakdown.map((x) => x.value),
            backgroundColor: ['#0f766e', '#14b8a6', '#f59e0b', '#94a3b8'],
            borderWidth: 0,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '68%',
          plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, usePointStyle: true, pointStyle: 'circle' } } },
        },
      });
    }

    const occTrend = document.getElementById('propertyOccTrendChart');
    if (occTrend && p.months?.occupancy) {
      new Chart(occTrend, {
        type: 'line',
        data: {
          labels: p.months.labels,
          datasets: [{
            label: 'Occupancy %',
            data: p.months.occupancy,
            borderColor: '#0d9488',
            backgroundColor: 'rgba(13, 148, 136, 0.12)',
            tension: 0.35,
            fill: true,
            pointRadius: 3,
            borderWidth: 2,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, border: { display: false } },
            y: {
              min: 0,
              max: 100,
              grid: { color: '#f1f5f9' },
              border: { display: false },
              ticks: { callback: (v) => `${v}%` },
            },
          },
        },
      });
    }
  }

  function renderNotFound(root) {
    root.innerHTML = `
      <div class="rounded-2xl bg-white p-10 text-center shadow-card ring-1 ring-slate-100">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">${hi('building-03', 'text-[22px]')}</div>
        <h1 class="mt-4 text-xl font-bold text-slate-900">Property not found</h1>
        <p class="mt-2 text-sm text-slate-500">That property ID is not in the portfolio. Pick another asset from Properties.</p>
        <a href="properties.html" class="mt-6 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">Back to properties</a>
      </div>`;
  }

  function resolveImage(p) {
    return window.PropertyERPUploads?.getPropertyImage(p.id) || p.image || p.gallery?.[0];
  }

  function render(p) {
    const root = document.getElementById('property-detail-root');
    if (!root) return;

    document.body.dataset.propertyId = p.id;
    document.title = `Property ERP — ${p.name}`;

    const cover = resolveImage(p);
    const gallery = [cover, ...(p.gallery || []).filter((u) => u !== cover)].slice(0, 5);
    const netClass = p.net >= 0 ? 'text-brand-600' : 'text-rose-500';
    const collectionColor = p.collectionRate >= 85 ? 'bg-brand-400' : p.collectionRate >= 70 ? 'bg-amber-400' : 'bg-rose-500';
    const insights = p.insights || [];

    root.innerHTML = `
      <div class="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <a href="properties.html" class="hover:text-slate-800">Properties</a>
        <span class="text-slate-300">/</span>
        <span class="font-medium text-slate-800">${p.name}</span>
      </div>

      <section class="db-card overflow-hidden">
        <div class="relative h-52 sm:h-72">
          <img id="property-cover-image" src="${cover}" alt="${p.name}" class="h-full w-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/25 to-transparent"></div>
          <div class="property-cover-actions">
            <button type="button" data-action="open-modal" data-modal="upload-property-image" class="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-slate-950/45 px-3 py-1.5 text-xs font-medium text-white backdrop-blur hover:bg-slate-950/60">
              ${hi('image-upload-01', 'text-[14px]')} Change photo
            </button>
          </div>
          <div class="absolute bottom-0 left-0 right-0 flex flex-wrap items-end justify-between gap-3 p-5 sm:p-6">
            <div>
              <div class="mb-2 flex flex-wrap items-center gap-2">
                <span class="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">${p.code}</span>
                ${statusPill(p.status)}
                <span class="rounded-full bg-brand-500/90 px-2.5 py-1 text-xs font-semibold text-white">Score ${p.score ?? '—'}</span>
              </div>
              <h1 class="text-2xl font-bold tracking-tight text-white sm:text-3xl">${p.name}</h1>
              <p class="mt-1 flex items-center gap-1.5 text-sm text-white/80">${hi('location-01', 'text-[14px]')} ${p.location} · ${p.type} · Built ${p.yearBuilt || '—'} · ${(p.areaSqm || 0).toLocaleString()} m²</p>
            </div>
            <div class="flex flex-wrap gap-2">
              <a href="iot.html" class="rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-sm font-medium text-white backdrop-blur hover:bg-white/20">IoT meters</a>
              <button type="button" data-action="open-modal" data-modal="add-unit" class="rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-sm font-medium text-white backdrop-blur hover:bg-white/20">Add Unit</button>
              <button type="button" data-action="open-modal" data-modal="add-expense" class="rounded-xl bg-white px-3.5 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100">Record Expense</button>
            </div>
          </div>
        </div>
        <div class="property-gallery border-t border-slate-100 p-3 sm:p-4">
          ${gallery.map((src, i) => `
            <button type="button" class="property-gallery-thumb ${i === 0 ? 'is-active' : ''}" data-gallery-src="${src}">
              <img src="${src}" alt="${p.name} photo ${i + 1}" loading="lazy" />
            </button>`).join('')}
        </div>
        <div class="grid gap-4 border-t border-slate-100 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
          <div class="rounded-xl bg-slate-50 px-4 py-3">
            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Buildings / Floors</p>
            <p class="mt-1 text-lg font-bold text-slate-900">${p.buildings} / ${p.floors}</p>
          </div>
          <div class="rounded-xl bg-slate-50 px-4 py-3">
            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Units</p>
            <p class="mt-1 text-lg font-bold text-slate-900">${p.unitCount}</p>
            <p class="text-xs text-slate-400">${p.occupied} occupied · ${p.vacant} vacant · ${p.maintenance} maintenance</p>
          </div>
          <div class="rounded-xl bg-slate-50 px-4 py-3">
            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Avg rent / unit</p>
            ${money(p.avgRent, 'table')}
          </div>
          <div class="rounded-xl bg-slate-50 px-4 py-3">
            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Property manager</p>
            <p class="mt-1 text-lg font-bold text-slate-900">${p.manager}</p>
          </div>
        </div>
      </section>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div class="db-card p-5">
          <p class="text-sm text-slate-500">Occupancy</p>
          <p class="mt-1 text-2xl font-bold text-slate-900">${p.occupancy}%</p>
          <div class="mt-3 h-2 rounded-full bg-slate-100"><div class="h-2 rounded-full bg-brand-400" style="width:${p.occupancy}%"></div></div>
        </div>
        <div class="db-card p-5">
          <p class="text-sm text-slate-500">Expected Rent (MTD)</p>
          ${money(p.expectedRent, 'stack', 'mt-1 text-2xl font-bold text-slate-900', 'text-xs text-slate-400')}
        </div>
        <div class="db-card p-5">
          <p class="text-sm text-slate-500">Collected (MTD)</p>
          ${money(p.collected, 'stack', 'mt-1 text-2xl font-bold text-brand-600', 'text-xs text-slate-400')}
          <p class="mt-2 text-xs text-slate-400">${p.collectionRate}% collection rate</p>
          <div class="mt-2 h-1.5 rounded-full bg-slate-100"><div class="h-1.5 rounded-full ${collectionColor}" style="width:${p.collectionRate}%"></div></div>
        </div>
        <div class="db-card p-5">
          <p class="text-sm text-slate-500">Outstanding Arrears</p>
          ${money(p.arrears, 'stack', 'mt-1 text-2xl font-bold text-rose-500', 'text-xs text-slate-400')}
          <p class="mt-1 text-xs text-slate-400">${(p.arrearsList || []).length} overdue account${(p.arrearsList || []).length === 1 ? '' : 's'}</p>
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div class="db-card p-5">
          <p class="text-sm text-slate-500">Expenses (MTD)</p>
          ${money(p.expenses, 'stack', 'mt-1 text-2xl font-bold text-slate-900', 'text-xs text-slate-400')}
        </div>
        <div class="db-card p-5">
          <p class="text-sm text-slate-500">Net Operating Income</p>
          ${money(p.net, 'stack', `mt-1 text-2xl font-bold ${netClass}`, 'text-xs text-slate-400')}
          <p class="mt-1 text-xs text-slate-400">NOI margin ${p.noiMargin ?? 0}% · Yield ${p.yieldPct ?? 0}%</p>
        </div>
        <div class="db-card p-5">
          <p class="text-sm text-slate-500">Power use (est. MTD)</p>
          <p class="mt-1 text-2xl font-bold text-amber-600">${Number(p.utilPower || 0).toFixed(1)} kWh</p>
          <p class="mt-1 text-xs text-slate-400">Linked smart meters · IoT</p>
        </div>
        <div class="db-card p-5">
          <p class="text-sm text-slate-500">Water use (est. MTD)</p>
          <p class="mt-1 text-2xl font-bold text-sky-600">${Number(p.utilWater || 0).toFixed(2)} m³</p>
          <p class="mt-1 text-xs text-slate-400">NWSC meters · IoT</p>
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div class="db-card p-5">
          <p class="text-sm text-slate-500">VAT Position</p>
          ${money(p.vat, 'stack', 'mt-1 text-2xl font-bold text-violet-600', 'text-xs text-slate-400')}
        </div>
        <div class="db-card p-5">
          <p class="text-sm text-slate-500">WHT Accrued</p>
          ${money(p.wht, 'stack', 'mt-1 text-2xl font-bold text-sky-600', 'text-xs text-slate-400')}
        </div>
        <div class="db-card p-5 sm:col-span-2">
          <p class="text-sm font-semibold text-slate-800">Analyst notes</p>
          <ul class="mt-2 space-y-1.5">${insights.map((t) => `<li class="flex gap-2 text-sm text-slate-600"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"></span>${t}</li>`).join('')}</ul>
        </div>
      </div>

      <div class="grid gap-4 xl:grid-cols-3">
        <section class="db-card p-5 xl:col-span-2">
          <div class="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 class="text-base font-bold text-slate-900">Rent Collection Trend</h2>
              <p class="mt-0.5 text-sm text-slate-500">Expected vs collected — last 6 months</p>
            </div>
            <a href="rent.html" class="text-sm font-medium text-brand-600 hover:underline">Invoices</a>
          </div>
          <div class="h-64"><canvas id="propertyRentChart"></canvas></div>
        </section>
        <section class="db-card p-5">
          <h2 class="text-base font-bold text-slate-900">Unit Status</h2>
          <p class="mt-0.5 text-sm text-slate-500">Occupancy mix</p>
          <div class="mt-2 h-56"><canvas id="propertyOccupancyChart"></canvas></div>
        </section>
      </div>

      <div class="grid gap-4 xl:grid-cols-3">
        <section class="db-card p-5 xl:col-span-2">
          <div class="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 class="text-base font-bold text-slate-900">Income vs Expenses</h2>
              <p class="mt-0.5 text-sm text-slate-500">Monthly P&amp;L contribution</p>
            </div>
            <a href="reports.html" class="text-sm font-medium text-brand-600 hover:underline">Reports</a>
          </div>
          <div class="h-64"><canvas id="propertyPnlChart"></canvas></div>
        </section>
        <section class="db-card p-5">
          <h2 class="text-base font-bold text-slate-900">Expense mix</h2>
          <p class="mt-0.5 text-sm text-slate-500">MTD spend by category</p>
          <div class="mt-2 h-44"><canvas id="propertyExpenseChart"></canvas></div>
          <div class="mt-3 space-y-2">
            ${(p.expenseBreakdown || []).map((u) => `
              <div class="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
                <span class="font-medium text-slate-700">${u.label}</span>
                ${money(u.value, 'inline')}
              </div>`).join('')}
          </div>
        </section>
      </div>

      <div class="grid gap-4 xl:grid-cols-3">
        <section class="db-card p-5">
          <h2 class="text-base font-bold text-slate-900">Unit Mix</h2>
          <p class="mt-0.5 text-sm text-slate-500">By typology</p>
          <div class="mt-2 h-56"><canvas id="propertyMixChart"></canvas></div>
          <div class="mt-3 space-y-2">
            ${(p.unitMix || []).map((u) => `
              <div class="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
                <span class="font-medium text-slate-700">${u.type} · ${u.count}</span>
                ${money(u.rent, 'inline')}
              </div>`).join('')}
          </div>
        </section>
        <section class="db-card p-5 xl:col-span-2">
          <div class="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 class="text-base font-bold text-slate-900">Occupancy trend</h2>
              <p class="mt-0.5 text-sm text-slate-500">% occupied over the last 6 months</p>
            </div>
          </div>
          <div class="h-64"><canvas id="propertyOccTrendChart"></canvas></div>
        </section>
      </div>

      <div class="grid gap-4 xl:grid-cols-2">
        <section class="db-card overflow-hidden">
          <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 class="text-base font-bold text-slate-900">Units snapshot</h2>
            <a href="units.html" class="text-sm font-medium text-brand-600 hover:underline">All units</a>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full min-w-[560px] text-left text-sm">
              <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                <tr><th class="px-5 py-3 font-medium">Unit</th><th class="px-5 py-3 font-medium">Type</th><th class="px-5 py-3 font-medium">Tenant</th><th class="px-5 py-3 font-medium">Rent</th><th class="px-5 py-3 font-medium">Status</th></tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${(p.units || []).map((u) => `
                  <tr class="hover:bg-slate-50/70">
                    <td class="px-5 py-3 font-medium">${u.id}<div class="text-xs font-normal text-slate-400">Floor ${u.floor}</div></td>
                    <td class="px-5 py-3">${u.type}</td>
                    <td class="px-5 py-3">${u.tenant}</td>
                    <td class="px-5 py-3">${money(u.rent, 'table')}</td>
                    <td class="px-5 py-3">${statusPill(u.status)}</td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </section>

        <section class="db-card overflow-hidden">
          <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 class="text-base font-bold text-slate-900">Arrears</h2>
            <a href="arrears.html" class="text-sm font-medium text-brand-600 hover:underline">Open arrears</a>
          </div>
          ${(p.arrearsList || []).length ? `
          <div class="overflow-x-auto">
            <table class="w-full min-w-[480px] text-left text-sm">
              <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                <tr><th class="px-5 py-3 font-medium">Tenant</th><th class="px-5 py-3 font-medium">Unit</th><th class="px-5 py-3 font-medium">Days</th><th class="px-5 py-3 font-medium">Amount</th></tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${(p.arrearsList || []).map((a) => `
                  <tr class="hover:bg-slate-50/70">
                    <td class="px-5 py-3 font-medium">${a.tenant}</td>
                    <td class="px-5 py-3">${a.unit}</td>
                    <td class="px-5 py-3"><span class="font-medium ${a.days > 30 ? 'text-rose-600' : 'text-amber-600'}">${a.days}d</span></td>
                    <td class="px-5 py-3">${money(a.amount, 'table')}</td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>` : `<p class="p-5 text-sm text-slate-500">No arrears on this property.</p>`}
        </section>
      </div>

      <div class="grid gap-4 xl:grid-cols-2">
        <section class="db-card overflow-hidden">
          <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 class="text-base font-bold text-slate-900">Expenses</h2>
            <a href="expenses.html" class="text-sm font-medium text-brand-600 hover:underline">All expenses</a>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full min-w-[560px] text-left text-sm">
              <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                <tr><th class="px-5 py-3 font-medium">Ref</th><th class="px-5 py-3 font-medium">Category</th><th class="px-5 py-3 font-medium">Supplier</th><th class="px-5 py-3 font-medium">Amount</th><th class="px-5 py-3 font-medium">Status</th></tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${(p.expensesList || []).map((e) => `
                  <tr class="hover:bg-slate-50/70">
                    <td class="px-5 py-3 font-medium">${e.id}</td>
                    <td class="px-5 py-3">${e.category}</td>
                    <td class="px-5 py-3">${e.supplier}</td>
                    <td class="px-5 py-3">${money(e.amount, 'table')}</td>
                    <td class="px-5 py-3">${statusPill(e.status)}</td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </section>

        <section class="db-card overflow-hidden">
          <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 class="text-base font-bold text-slate-900">Maintenance &amp; leases</h2>
            <a href="maintenance.html" class="text-sm font-medium text-brand-600 hover:underline">Tickets</a>
          </div>
          <div class="space-y-4 p-5">
            <div>
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Open tickets</p>
              ${(p.maintenanceList || []).length ? `<ul class="space-y-2">${(p.maintenanceList || []).map((m) => `
                <li class="rounded-xl border border-slate-100 px-3 py-3">
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <p class="text-sm font-semibold text-slate-800">${m.id} · ${m.unit}</p>
                    ${statusPill(m.priority)}
                  </div>
                  <p class="mt-1 text-sm text-slate-500">${m.issue}</p>
                  <p class="mt-2">${statusPill(m.status)}</p>
                </li>`).join('')}</ul>` : `<p class="text-sm text-slate-500">No open maintenance tickets.</p>`}
            </div>
            <div>
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Leases expiring soon</p>
              ${(p.leasesExpiring || []).length ? `<ul class="space-y-2">${(p.leasesExpiring || []).map((l) => `
                <li class="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-3 text-sm">
                  <div>
                    <p class="font-medium text-slate-800">${l.tenant}</p>
                    <p class="text-xs text-slate-400">${l.unit} · expires ${l.expiry}</p>
                  </div>
                  ${money(l.rent, 'inline')}
                </li>`).join('')}</ul>` : `<p class="text-sm text-slate-500">No upcoming expiries in the next 90 days.</p>`}
            </div>
          </div>
        </section>
      </div>
    `;

    if (window.DatabrainMoney?.init) window.DatabrainMoney.init();
    renderCharts(p);

    root.querySelectorAll('[data-gallery-src]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const img = document.getElementById('property-cover-image');
        if (img) img.src = btn.dataset.gallerySrc;
        root.querySelectorAll('[data-gallery-src]').forEach((b) => b.classList.toggle('is-active', b === btn));
      });
    });
  }

  function init() {
    const root = document.getElementById('property-detail-root');
    if (!root || !window.PropertyERP?.getProperty) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id') || params.get('property') || 'kololo-heights';
    const property = window.PropertyERP.getProperty(id);

    if (!property) {
      renderNotFound(root);
      return;
    }
    render(property);

    document.addEventListener('property-erp:property-image-changed', (e) => {
      if (e.detail?.id !== property.id) return;
      const img = document.getElementById('property-cover-image');
      if (img && e.detail.dataUrl) img.src = e.detail.dataUrl;
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
