(function () {
  const STORE = 'property_erp_iot_devices';
  const LOG_STORE = 'property_erp_iot_log';
  const RATE = 3700;

  const SEED = [
    { id: 'iot-kh-a1204', property: 'Kololo Heights', unit: 'A-1204', tenant: 'Nakato Holdings', power: true, water: true, meterPower: 'UMEME-44021', meterWater: 'NWSC-11802', online: true, arrearsUsd: 850 },
    { id: 'iot-kh-a0801', property: 'Kololo Heights', unit: 'A-0801', tenant: 'Sarah Namutebi', power: true, water: true, meterPower: 'UMEME-44088', meterWater: 'NWSC-11844', online: true, arrearsUsd: 0 },
    { id: 'iot-kh-b0208', property: 'Kololo Heights', unit: 'B-0208', tenant: '— Vacant —', power: false, water: false, meterPower: 'UMEME-44102', meterWater: 'NWSC-11890', online: true, arrearsUsd: 0 },
    { id: 'iot-nt-c05', property: 'Ntinda Business Park', unit: 'C-05', tenant: 'Agaba Retail Ltd', power: true, water: true, meterPower: 'UMEME-55201', meterWater: 'NWSC-22011', online: true, arrearsUsd: 2400 },
    { id: 'iot-nt-c18', property: 'Ntinda Business Park', unit: 'C-18', tenant: '— Vacant —', power: true, water: true, meterPower: 'UMEME-55244', meterWater: 'NWSC-22055', online: false, arrearsUsd: 0 },
    { id: 'iot-nk-n0304', property: 'Nakasero Residences', unit: 'N-0304', tenant: 'Joan Kizza', power: true, water: false, meterPower: 'UMEME-33010', meterWater: 'NWSC-33010', online: true, arrearsUsd: 1360 },
    { id: 'iot-bg-e03', property: 'Bugolobi Flats', unit: 'E-03', tenant: 'Musoke Traders', power: false, water: true, meterPower: 'UMEME-66012', meterWater: 'NWSC-66012', online: true, arrearsUsd: 1700 },
    { id: 'iot-er-m102', property: 'Entebbe Road Mall', unit: 'M-102', tenant: '— Vacant —', power: true, water: true, meterPower: 'UMEME-77001', meterWater: 'NWSC-77001', online: true, arrearsUsd: 0 },
  ];

  function toast(msg, type) {
    if (window.PropertyERP?.toast) window.PropertyERP.toast(msg, type);
    else if (typeof window.toast === 'function') window.toast(msg, type);
  }

  function ugx(usd) {
    const n = Math.round(Number(usd || 0) * RATE);
    try {
      return new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX', maximumFractionDigits: 0 }).format(n);
    } catch {
      return `UGX ${n.toLocaleString()}`;
    }
  }

  function loadDevices() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORE) || 'null');
      if (Array.isArray(raw) && raw.length) return raw;
    } catch {
      /* ignore */
    }
    localStorage.setItem(STORE, JSON.stringify(SEED));
    return SEED.map((d) => ({ ...d }));
  }

  function saveDevices(list) {
    localStorage.setItem(STORE, JSON.stringify(list));
  }

  function loadLog() {
    try {
      return JSON.parse(localStorage.getItem(LOG_STORE) || '[]');
    } catch {
      return [];
    }
  }

  function pushLog(entry) {
    const log = loadLog();
    log.unshift({ ...entry, at: new Date().toISOString(), id: `EVT-${Date.now().toString(36).toUpperCase()}` });
    localStorage.setItem(LOG_STORE, JSON.stringify(log.slice(0, 80)));
  }

  function hi(name, cls) {
    return `<i class="hgi-stroke hgi-${name}${cls ? ` ${cls}` : ''}" aria-hidden="true"></i>`;
  }

  let devices = loadDevices();
  let pending = null;
  let filter = 'all';

  function counts() {
    const online = devices.filter((d) => d.online).length;
    const powerOff = devices.filter((d) => !d.power).length;
    const waterOff = devices.filter((d) => !d.water).length;
    return { total: devices.length, online, powerOff, waterOff };
  }

  function renderKpis() {
    const root = document.getElementById('iot-kpis');
    if (!root) return;
    const c = counts();
    root.innerHTML = `
      <div class="db-card p-5">
        <p class="text-sm text-slate-500">Connected meters</p>
        <p class="mt-1 text-2xl font-bold text-slate-900">${c.total}</p>
        <p class="mt-1 text-xs text-slate-400">${c.online} online · ${c.total - c.online} offline</p>
      </div>
      <div class="db-card p-5">
        <p class="text-sm text-slate-500">Power cut off</p>
        <p class="mt-1 text-2xl font-bold text-amber-600">${c.powerOff}</p>
        <p class="mt-1 text-xs text-slate-400">UMEME smart breakers</p>
      </div>
      <div class="db-card p-5">
        <p class="text-sm text-slate-500">Water cut off</p>
        <p class="mt-1 text-2xl font-bold text-sky-600">${c.waterOff}</p>
        <p class="mt-1 text-xs text-slate-400">NWSC valve controllers</p>
      </div>
      <div class="db-card p-5">
        <p class="text-sm text-slate-500">Live control</p>
        <p class="mt-1 text-2xl font-bold text-brand-600">${Math.round((c.online / Math.max(c.total, 1)) * 100)}%</p>
        <p class="mt-1 text-xs text-slate-400">Devices reachable now</p>
      </div>`;
  }

  function utilityBadge(on, kind) {
    if (on) {
      return `<span class="iot-badge iot-badge-on">${hi(kind === 'power' ? 'flash' : 'droplet', 'text-[12px]')} ON</span>`;
    }
    return `<span class="iot-badge iot-badge-off">${hi(kind === 'power' ? 'flash-off' : 'cancel-01', 'text-[12px]')} CUT</span>`;
  }

  function filtered() {
    const q = (document.getElementById('iot-search')?.value || '').toLowerCase().trim();
    return devices.filter((d) => {
      if (filter === 'power-off' && d.power) return false;
      if (filter === 'water-off' && d.water) return false;
      if (filter === 'offline' && d.online) return false;
      if (filter === 'arrears' && !(d.arrearsUsd > 0)) return false;
      if (!q) return true;
      return `${d.property} ${d.unit} ${d.tenant} ${d.meterPower} ${d.meterWater}`.toLowerCase().includes(q);
    });
  }

  function renderCards() {
    const root = document.getElementById('iot-grid');
    if (!root) return;
    const list = filtered();
    if (!list.length) {
      root.innerHTML = `<div class="db-card col-span-full p-10 text-center text-sm text-slate-500">No devices match this filter.</div>`;
      return;
    }
    root.innerHTML = list.map((d) => `
      <article class="iot-card db-card ${d.online ? '' : 'iot-card-offline'}" data-id="${d.id}">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">${d.property}</p>
            <h3 class="mt-0.5 text-lg font-bold text-slate-900">Unit ${d.unit}</h3>
            <p class="mt-1 text-sm text-slate-500">${d.tenant}</p>
          </div>
          <span class="iot-online ${d.online ? 'is-on' : 'is-off'}">${d.online ? 'Online' : 'Offline'}</span>
        </div>

        ${d.arrearsUsd > 0 ? `<p class="iot-arrears">Arrears ${ugx(d.arrearsUsd)} — cut-off allowed for collections</p>` : ''}

        <div class="iot-meters">
          <p>${hi('flash', 'text-[13px]')} ${d.meterPower}</p>
          <p>${hi('droplet', 'text-[13px]')} ${d.meterWater}</p>
        </div>

        <div class="iot-controls">
          <div class="iot-control">
            <div>
              <p class="iot-control-label">Power</p>
              ${utilityBadge(d.power, 'power')}
            </div>
            <button type="button" class="iot-switch ${d.power ? 'is-on' : ''}" data-iot-toggle="power" data-id="${d.id}" ${d.online ? '' : 'disabled'} aria-label="Toggle power for ${d.unit}">
              <span></span>
            </button>
          </div>
          <div class="iot-control">
            <div>
              <p class="iot-control-label">Water</p>
              ${utilityBadge(d.water, 'water')}
            </div>
            <button type="button" class="iot-switch ${d.water ? 'is-on' : ''}" data-iot-toggle="water" data-id="${d.id}" ${d.online ? '' : 'disabled'} aria-label="Toggle water for ${d.unit}">
              <span></span>
            </button>
          </div>
        </div>

        <div class="iot-quick">
          <button type="button" class="iot-chip danger" data-iot-cut-both="${d.id}" ${d.online && (d.power || d.water) ? '' : 'disabled'}>Cut both</button>
          <button type="button" class="iot-chip" data-iot-restore-both="${d.id}" ${d.online && (!d.power || !d.water) ? '' : 'disabled'}>Restore both</button>
        </div>
      </article>`).join('');
  }

  function renderLog() {
    const root = document.getElementById('iot-log');
    if (!root) return;
    const log = loadLog().slice(0, 12);
    if (!log.length) {
      root.innerHTML = `<tr><td colspan="5" class="px-5 py-8 text-center text-sm text-slate-400">No cut-off or restore events yet.</td></tr>`;
      return;
    }
    root.innerHTML = log.map((e) => {
      const when = new Date(e.at);
      const stamp = when.toLocaleString('en-UG', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
      const action = e.on ? 'Restored' : 'Cut off';
      const badge = e.on
        ? 'bg-brand-50 text-brand-700'
        : 'bg-rose-50 text-rose-600';
      return `<tr class="hover:bg-slate-50/70">
        <td class="px-5 py-3 font-medium text-slate-800">${e.id}</td>
        <td class="px-5 py-3">${e.property} · ${e.unit}</td>
        <td class="px-5 py-3 capitalize">${e.utility}</td>
        <td class="px-5 py-3"><span class="rounded-full ${badge} px-2.5 py-1 text-xs font-medium">${action}</span> <span class="text-xs text-slate-400">${e.reason || ''}</span></td>
        <td class="px-5 py-3 text-slate-500">${stamp}</td>
      </tr>`;
    }).join('');
  }

  function refresh() {
    renderKpis();
    renderCards();
    renderLog();
  }

  function applyToggle(id, utility, on, reason) {
    const device = devices.find((d) => d.id === id);
    if (!device) return;
    if (!device.online) {
      toast('Device offline — reconnect the gateway first.', 'error');
      return;
    }
    if (utility === 'both') {
      device.power = on;
      device.water = on;
      pushLog({ property: device.property, unit: device.unit, utility: 'power + water', on, reason });
    } else {
      device[utility] = on;
      pushLog({ property: device.property, unit: device.unit, utility, on, reason });
    }
    saveDevices(devices);
    refresh();
    const label = utility === 'both' ? 'Power & water' : utility === 'power' ? 'Power' : 'Water';
    toast(`${label} ${on ? 'restored' : 'cut off'} for ${device.property} · ${device.unit}.`);

    if (!on && reason === 'Rent arrears' && window.PropertyERPWhatsApp?.WA_NUMBER) {
      const msg = encodeURIComponent(
        `Property ERP IoT notice\n${device.property} · Unit ${device.unit}\n${label} has been cut off due to rent arrears (${ugx(device.arrearsUsd)}).\nPay to restore supply.`,
      );
      // Soft handoff — do not auto-open every time; update WhatsApp handoff if panel exists
      const handoff = document.getElementById('wa-handoff');
      if (handoff) handoff.href = `https://wa.me/${window.PropertyERPWhatsApp.WA_NUMBER}?text=${msg}`;
    }
  }

  function openConfirm(opts) {
    pending = opts;
    const modal = document.getElementById('iot-confirm');
    const title = document.getElementById('iot-confirm-title');
    const body = document.getElementById('iot-confirm-body');
    const reason = document.getElementById('iot-reason');
    if (!modal || !title || !body) return;
    const device = devices.find((d) => d.id === opts.id);
    const utilLabel = opts.utility === 'both' ? 'power and water' : opts.utility;
    title.textContent = opts.on ? `Restore ${utilLabel}?` : `Cut off ${utilLabel}?`;
    body.textContent = opts.on
      ? `This will restore ${utilLabel} for ${device?.property} · ${device?.unit} (${device?.tenant}).`
      : `This will remotely cut ${utilLabel} for ${device?.property} · ${device?.unit} (${device?.tenant}). The tenant will lose supply until you restore it.`;
    if (reason) {
      reason.value = opts.on ? 'Manual restore' : (device?.arrearsUsd > 0 ? 'Rent arrears' : 'Manual cut-off');
      reason.disabled = !!opts.on;
    }
    modal.classList.add('open');
    document.body.classList.add('modal-open');
  }

  function closeConfirm() {
    pending = null;
    document.getElementById('iot-confirm')?.classList.remove('open');
    document.body.classList.remove('modal-open');
  }

  function bind() {
    document.getElementById('iot-search')?.addEventListener('input', () => renderCards());

    document.querySelectorAll('[data-iot-filter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        filter = btn.dataset.iotFilter || 'all';
        document.querySelectorAll('[data-iot-filter]').forEach((b) => b.classList.toggle('is-active', b === btn));
        renderCards();
      });
    });

    document.getElementById('iot-grid')?.addEventListener('click', (e) => {
      const toggle = e.target.closest('[data-iot-toggle]');
      if (toggle) {
        const id = toggle.dataset.id;
        const utility = toggle.dataset.iotToggle;
        const device = devices.find((d) => d.id === id);
        if (!device) return;
        const next = !device[utility];
        openConfirm({ id, utility, on: next });
        return;
      }
      const cut = e.target.closest('[data-iot-cut-both]');
      if (cut) {
        openConfirm({ id: cut.dataset.iotCutBoth, utility: 'both', on: false });
        return;
      }
      const restore = e.target.closest('[data-iot-restore-both]');
      if (restore) {
        openConfirm({ id: restore.dataset.iotRestoreBoth, utility: 'both', on: true });
      }
    });

    document.getElementById('iot-confirm-cancel')?.addEventListener('click', closeConfirm);
    document.getElementById('iot-confirm')?.querySelector('[data-close-iot]')?.addEventListener('click', closeConfirm);
    document.getElementById('iot-confirm-go')?.addEventListener('click', () => {
      if (!pending) return;
      const reason = document.getElementById('iot-reason')?.value || (pending.on ? 'Manual restore' : 'Manual cut-off');
      applyToggle(pending.id, pending.utility, pending.on, reason);
      closeConfirm();
    });

    document.getElementById('iot-reset')?.addEventListener('click', () => {
      devices = SEED.map((d) => ({ ...d }));
      saveDevices(devices);
      localStorage.removeItem(LOG_STORE);
      refresh();
      toast('IoT demo devices reset.');
    });
  }

  function init() {
    if (!document.getElementById('iot-grid')) return;
    bind();
    refresh();
  }

  window.PropertyERPIoT = { init, loadDevices, applyToggle };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
