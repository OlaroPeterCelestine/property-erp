(function () {
  const STORE = 'property_erp_iot_devices';
  const LOG_STORE = 'property_erp_iot_log';
  const SETTINGS_STORE = 'property_erp_iot_settings';
  const RATE = 3700;

  const DEFAULT_SETTINGS = {
    umemeApiKey: '',
    umemeEndpoint: 'https://api.umeme.co.ug/v1/meters',
    nwscApiKey: '',
    nwscEndpoint: 'https://api.nwsc.co.ug/v1/meters',
    gatewayId: 'GW-KLA-01',
    siteCode: 'KAMPALA-HQ',
    powerTariffUgx: 850,
    waterTariffUgx: 3200,
    pollSeconds: 30,
    autoCutArrears: false,
    notifyWhatsApp: true,
  };

  const SEED = [
    { id: 'iot-kh-a1204', property: 'Kololo Heights', unit: 'A-1204', tenant: 'Nakato Holdings', power: true, water: true, meterPower: 'UMEME-44021', meterWater: 'NWSC-11802', online: true, arrearsUsd: 850, kwhToday: 18.4, kwhMonth: 412.6, m3Today: 0.82, m3Month: 18.4, powerKw: 1.2, waterLpm: 4.5, connected: true },
    { id: 'iot-kh-a0801', property: 'Kololo Heights', unit: 'A-0801', tenant: 'Sarah Namutebi', power: true, water: true, meterPower: 'UMEME-44088', meterWater: 'NWSC-11844', online: true, arrearsUsd: 0, kwhToday: 11.2, kwhMonth: 286.1, m3Today: 0.54, m3Month: 12.1, powerKw: 0.7, waterLpm: 2.8, connected: true },
    { id: 'iot-kh-b0208', property: 'Kololo Heights', unit: 'B-0208', tenant: '— Vacant —', power: false, water: false, meterPower: 'UMEME-44102', meterWater: 'NWSC-11890', online: true, arrearsUsd: 0, kwhToday: 0, kwhMonth: 24.0, m3Today: 0, m3Month: 1.2, powerKw: 0, waterLpm: 0, connected: true },
    { id: 'iot-nt-c05', property: 'Ntinda Business Park', unit: 'C-05', tenant: 'Agaba Retail Ltd', power: true, water: true, meterPower: 'UMEME-55201', meterWater: 'NWSC-22011', online: true, arrearsUsd: 2400, kwhToday: 42.8, kwhMonth: 980.4, m3Today: 1.1, m3Month: 26.5, powerKw: 3.4, waterLpm: 3.1, connected: true },
    { id: 'iot-nt-c18', property: 'Ntinda Business Park', unit: 'C-18', tenant: '— Vacant —', power: true, water: true, meterPower: 'UMEME-55244', meterWater: 'NWSC-22055', online: false, arrearsUsd: 0, kwhToday: 0, kwhMonth: 0, m3Today: 0, m3Month: 0, powerKw: 0, waterLpm: 0, connected: false },
    { id: 'iot-nk-n0304', property: 'Nakasero Residences', unit: 'N-0304', tenant: 'Joan Kizza', power: true, water: false, meterPower: 'UMEME-33010', meterWater: 'NWSC-33010', online: true, arrearsUsd: 1360, kwhToday: 14.6, kwhMonth: 338.2, m3Today: 0, m3Month: 9.8, powerKw: 0.9, waterLpm: 0, connected: true },
    { id: 'iot-bg-e03', property: 'Bugolobi Flats', unit: 'E-03', tenant: 'Musoke Traders', power: false, water: true, meterPower: 'UMEME-66012', meterWater: 'NWSC-66012', online: true, arrearsUsd: 1700, kwhToday: 0, kwhMonth: 210.5, m3Today: 0.71, m3Month: 15.6, powerKw: 0, waterLpm: 3.6, connected: true },
    { id: 'iot-er-m102', property: 'Entebbe Road Mall', unit: 'M-102', tenant: '— Vacant —', power: true, water: true, meterPower: '', meterWater: '', online: false, arrearsUsd: 0, kwhToday: 0, kwhMonth: 0, m3Today: 0, m3Month: 0, powerKw: 0, waterLpm: 0, connected: false },
  ];

  function toast(msg, type) {
    if (window.PropertyERP?.toast) window.PropertyERP.toast(msg, type);
  }

  function ugx(n) {
    try {
      return new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX', maximumFractionDigits: 0 }).format(Math.round(n || 0));
    } catch {
      return `UGX ${Math.round(n || 0).toLocaleString()}`;
    }
  }

  function ugxFromUsd(usd) {
    return ugx(Number(usd || 0) * RATE);
  }

  function loadSettings() {
    try {
      return { ...DEFAULT_SETTINGS, ...(JSON.parse(localStorage.getItem(SETTINGS_STORE) || '{}') || {}) };
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  }

  function saveSettings(s) {
    localStorage.setItem(SETTINGS_STORE, JSON.stringify(s));
  }

  function hydrate(list) {
    return list.map((d, i) => {
      const seed = SEED.find((s) => s.id === d.id) || SEED[i % SEED.length];
      return {
        ...seed,
        ...d,
        kwhToday: d.kwhToday ?? seed.kwhToday ?? 0,
        kwhMonth: d.kwhMonth ?? seed.kwhMonth ?? 0,
        m3Today: d.m3Today ?? seed.m3Today ?? 0,
        m3Month: d.m3Month ?? seed.m3Month ?? 0,
        powerKw: d.powerKw ?? seed.powerKw ?? 0,
        waterLpm: d.waterLpm ?? seed.waterLpm ?? 0,
        connected: d.connected ?? !!(d.meterPower && d.meterWater),
      };
    });
  }

  function loadDevices() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORE) || 'null');
      if (Array.isArray(raw) && raw.length) {
        const list = hydrate(raw);
        saveDevices(list);
        return list;
      }
    } catch {
      /* ignore */
    }
    const seed = SEED.map((d) => ({ ...d }));
    localStorage.setItem(STORE, JSON.stringify(seed));
    return seed;
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

  let settings = loadSettings();
  let devices = loadDevices();
  let pending = null;
  let filter = 'all';
  let usageTimer = null;
  let editingId = null;

  function totals() {
    return devices.reduce((acc, d) => {
      acc.kwhToday += Number(d.kwhToday || 0);
      acc.kwhMonth += Number(d.kwhMonth || 0);
      acc.m3Today += Number(d.m3Today || 0);
      acc.m3Month += Number(d.m3Month || 0);
      acc.powerCost += Number(d.kwhMonth || 0) * Number(settings.powerTariffUgx || 0);
      acc.waterCost += Number(d.m3Month || 0) * Number(settings.waterTariffUgx || 0);
      return acc;
    }, { kwhToday: 0, kwhMonth: 0, m3Today: 0, m3Month: 0, powerCost: 0, waterCost: 0 });
  }

  function counts() {
    const online = devices.filter((d) => d.online).length;
    const connected = devices.filter((d) => d.connected).length;
    const powerOff = devices.filter((d) => !d.power).length;
    const waterOff = devices.filter((d) => !d.water).length;
    return { total: devices.length, online, connected, powerOff, waterOff };
  }

  function fmtKwh(n) {
    return `${Number(n || 0).toFixed(1)} kWh`;
  }

  function fmtM3(n) {
    return `${Number(n || 0).toFixed(2)} m³`;
  }

  function renderKpis() {
    const root = document.getElementById('iot-kpis');
    if (!root) return;
    const c = counts();
    const t = totals();
    root.innerHTML = `
      <div class="db-card p-5">
        <p class="text-sm text-slate-500">Power used today</p>
        <p class="mt-1 text-2xl font-bold text-amber-600">${fmtKwh(t.kwhToday)}</p>
        <p class="mt-1 text-xs text-slate-400">Month ${fmtKwh(t.kwhMonth)} · ${ugx(t.powerCost)}</p>
      </div>
      <div class="db-card p-5">
        <p class="text-sm text-slate-500">Water used today</p>
        <p class="mt-1 text-2xl font-bold text-sky-600">${fmtM3(t.m3Today)}</p>
        <p class="mt-1 text-xs text-slate-400">Month ${fmtM3(t.m3Month)} · ${ugx(t.waterCost)}</p>
      </div>
      <div class="db-card p-5">
        <p class="text-sm text-slate-500">Connected meters</p>
        <p class="mt-1 text-2xl font-bold text-slate-900">${c.connected}/${c.total}</p>
        <p class="mt-1 text-xs text-slate-400">${c.online} online · ${c.powerOff} power cut · ${c.waterOff} water cut</p>
      </div>
      <div class="db-card p-5">
        <p class="text-sm text-slate-500">Gateway</p>
        <p class="mt-1 text-2xl font-bold text-brand-600">${settings.gatewayId || '—'}</p>
        <p class="mt-1 text-xs text-slate-400">${settings.siteCode} · poll ${settings.pollSeconds}s</p>
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
      if (filter === 'unlinked' && d.connected) return false;
      if (!q) return true;
      return `${d.property} ${d.unit} ${d.tenant} ${d.meterPower} ${d.meterWater}`.toLowerCase().includes(q);
    });
  }

  function usageBlock(d) {
    const powerCost = Number(d.kwhMonth || 0) * Number(settings.powerTariffUgx || 0);
    const waterCost = Number(d.m3Month || 0) * Number(settings.waterTariffUgx || 0);
    const livePower = d.power && d.online ? `${Number(d.powerKw || 0).toFixed(1)} kW live` : '0 kW';
    const liveWater = d.water && d.online ? `${Number(d.waterLpm || 0).toFixed(1)} L/min` : '0 L/min';
    return `
      <div class="iot-usage">
        <div class="iot-usage-item">
          <p class="iot-usage-label">${hi('flash', 'text-[12px]')} Power</p>
          <p class="iot-usage-value">${fmtKwh(d.kwhToday)} <span>today</span></p>
          <p class="iot-usage-meta">${fmtKwh(d.kwhMonth)} mo · ${ugx(powerCost)} · ${livePower}</p>
          <div class="iot-usage-bar"><span style="width:${Math.min(100, (d.kwhToday / 50) * 100)}%"></span></div>
        </div>
        <div class="iot-usage-item">
          <p class="iot-usage-label">${hi('droplet', 'text-[12px]')} Water</p>
          <p class="iot-usage-value">${fmtM3(d.m3Today)} <span>today</span></p>
          <p class="iot-usage-meta">${fmtM3(d.m3Month)} mo · ${ugx(waterCost)} · ${liveWater}</p>
          <div class="iot-usage-bar water"><span style="width:${Math.min(100, (d.m3Today / 2) * 100)}%"></span></div>
        </div>
      </div>`;
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
          <div class="flex flex-col items-end gap-1">
            <span class="iot-online ${d.online ? 'is-on' : 'is-off'}">${d.online ? 'Online' : 'Offline'}</span>
            <span class="iot-link ${d.connected ? 'is-on' : 'is-off'}">${d.connected ? 'Linked' : 'Not linked'}</span>
          </div>
        </div>

        ${d.arrearsUsd > 0 ? `<p class="iot-arrears">Arrears ${ugxFromUsd(d.arrearsUsd)} — cut-off allowed for collections</p>` : ''}

        ${usageBlock(d)}

        <div class="iot-meters">
          <p>${hi('flash', 'text-[13px]')} ${d.meterPower || 'No UMEME meter linked'}</p>
          <p>${hi('droplet', 'text-[13px]')} ${d.meterWater || 'No NWSC meter linked'}</p>
        </div>

        <div class="iot-controls">
          <div class="iot-control">
            <div>
              <p class="iot-control-label">Power</p>
              ${utilityBadge(d.power, 'power')}
            </div>
            <button type="button" class="iot-switch ${d.power ? 'is-on' : ''}" data-iot-toggle="power" data-id="${d.id}" ${d.online && d.connected ? '' : 'disabled'} aria-label="Toggle power for ${d.unit}">
              <span></span>
            </button>
          </div>
          <div class="iot-control">
            <div>
              <p class="iot-control-label">Water</p>
              ${utilityBadge(d.water, 'water')}
            </div>
            <button type="button" class="iot-switch ${d.water ? 'is-on' : ''}" data-iot-toggle="water" data-id="${d.id}" ${d.online && d.connected ? '' : 'disabled'} aria-label="Toggle water for ${d.unit}">
              <span></span>
            </button>
          </div>
        </div>

        <div class="iot-quick">
          <button type="button" class="iot-chip" data-iot-connect="${d.id}">${d.connected ? 'Edit link' : 'Connect meters'}</button>
          <button type="button" class="iot-chip danger" data-iot-cut-both="${d.id}" ${d.online && d.connected && (d.power || d.water) ? '' : 'disabled'}>Cut both</button>
          <button type="button" class="iot-chip" data-iot-restore-both="${d.id}" ${d.online && d.connected && (!d.power || !d.water) ? '' : 'disabled'}>Restore</button>
        </div>
      </article>`).join('');
  }

  function renderLog() {
    const root = document.getElementById('iot-log');
    if (!root) return;
    const log = loadLog().slice(0, 12);
    if (!log.length) {
      root.innerHTML = `<tr><td colspan="5" class="px-5 py-8 text-center text-sm text-slate-400">No gateway commands in the current shift.</td></tr>`;
      return;
    }
    root.innerHTML = log.map((e) => {
      const when = new Date(e.at);
      const stamp = when.toLocaleString('en-UG', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
      const action = e.on ? 'Restored' : (e.kind === 'link' ? 'Linked' : 'Cut off');
      const badge = e.on || e.kind === 'link'
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

  function fillSettingsForm() {
    const map = {
      'iot-umeme-key': settings.umemeApiKey,
      'iot-umeme-url': settings.umemeEndpoint,
      'iot-nwsc-key': settings.nwscApiKey,
      'iot-nwsc-url': settings.nwscEndpoint,
      'iot-gateway': settings.gatewayId,
      'iot-site': settings.siteCode,
      'iot-power-tariff': settings.powerTariffUgx,
      'iot-water-tariff': settings.waterTariffUgx,
      'iot-poll': settings.pollSeconds,
    };
    Object.entries(map).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.value = val ?? '';
    });
    const autoCut = document.getElementById('iot-auto-cut');
    const notify = document.getElementById('iot-notify-wa');
    if (autoCut) autoCut.checked = !!settings.autoCutArrears;
    if (notify) notify.checked = !!settings.notifyWhatsApp;
  }

  function readSettingsForm() {
    settings = {
      umemeApiKey: document.getElementById('iot-umeme-key')?.value?.trim() || '',
      umemeEndpoint: document.getElementById('iot-umeme-url')?.value?.trim() || DEFAULT_SETTINGS.umemeEndpoint,
      nwscApiKey: document.getElementById('iot-nwsc-key')?.value?.trim() || '',
      nwscEndpoint: document.getElementById('iot-nwsc-url')?.value?.trim() || DEFAULT_SETTINGS.nwscEndpoint,
      gatewayId: document.getElementById('iot-gateway')?.value?.trim() || DEFAULT_SETTINGS.gatewayId,
      siteCode: document.getElementById('iot-site')?.value?.trim() || DEFAULT_SETTINGS.siteCode,
      powerTariffUgx: Number(document.getElementById('iot-power-tariff')?.value || DEFAULT_SETTINGS.powerTariffUgx),
      waterTariffUgx: Number(document.getElementById('iot-water-tariff')?.value || DEFAULT_SETTINGS.waterTariffUgx),
      pollSeconds: Math.max(10, Number(document.getElementById('iot-poll')?.value || DEFAULT_SETTINGS.pollSeconds)),
      autoCutArrears: !!document.getElementById('iot-auto-cut')?.checked,
      notifyWhatsApp: !!document.getElementById('iot-notify-wa')?.checked,
    };
    saveSettings(settings);
    restartUsageTicker();
    refresh();
    toast('IoT connection settings saved.');
  }

  function refresh() {
    renderKpis();
    renderCards();
    renderLog();
  }

  function tickUsage() {
    let changed = false;
    devices.forEach((d) => {
      if (!d.online || !d.connected) {
        d.powerKw = d.power ? d.powerKw : 0;
        d.waterLpm = d.water ? d.waterLpm : 0;
        return;
      }
      if (d.power) {
        const kw = 0.4 + Math.random() * 2.8;
        d.powerKw = Number(kw.toFixed(2));
        const add = kw / 120; // tick ~ every 30s → approx /hr scaled
        d.kwhToday = Number((d.kwhToday + add).toFixed(2));
        d.kwhMonth = Number((d.kwhMonth + add).toFixed(2));
        changed = true;
      } else {
        d.powerKw = 0;
      }
      if (d.water) {
        const lpm = 1.2 + Math.random() * 5;
        d.waterLpm = Number(lpm.toFixed(1));
        const addM3 = (lpm * 0.5) / 1000; // half-minute equivalent
        d.m3Today = Number((d.m3Today + addM3).toFixed(3));
        d.m3Month = Number((d.m3Month + addM3).toFixed(3));
        changed = true;
      } else {
        d.waterLpm = 0;
      }
    });
    if (changed) {
      saveDevices(devices);
      renderKpis();
      renderCards();
    }
  }

  function restartUsageTicker() {
    if (usageTimer) clearInterval(usageTimer);
    const ms = Math.max(10, Number(settings.pollSeconds || 30)) * 1000;
    usageTimer = setInterval(tickUsage, ms);
  }

  function applyToggle(id, utility, on, reason) {
    const device = devices.find((d) => d.id === id);
    if (!device) return;
    if (!device.connected) {
      toast('Link UMEME and NWSC meters before sending commands.', 'error');
      return;
    }
    if (!device.online) {
      toast('Meter gateway offline — check site connectivity before commanding.', 'error');
      return;
    }
    if (utility === 'both') {
      device.power = on;
      device.water = on;
      if (!on) { device.powerKw = 0; device.waterLpm = 0; }
      pushLog({ property: device.property, unit: device.unit, utility: 'power + water', on, reason });
    } else {
      device[utility] = on;
      if (utility === 'power' && !on) device.powerKw = 0;
      if (utility === 'water' && !on) device.waterLpm = 0;
      pushLog({ property: device.property, unit: device.unit, utility, on, reason });
    }
    saveDevices(devices);
    refresh();
    const label = utility === 'both' ? 'Power & water' : utility === 'power' ? 'Power' : 'Water';
    toast(`${label} command sent — ${on ? 'restored' : 'cut off'} at ${device.property} · ${device.unit}.`);

    if (!on && reason === 'Rent arrears' && settings.notifyWhatsApp && window.PropertyERPWhatsApp?.WA_NUMBER) {
      const msg = encodeURIComponent(
        `Property ERP utility notice\n${device.property} · Unit ${device.unit}\n${label} supply has been disconnected for rent arrears (${ugxFromUsd(device.arrearsUsd)}).\nSettle the balance to request restore.`,
      );
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
    title.textContent = opts.on ? `Restore ${utilLabel}` : `Disconnect ${utilLabel}`;
    body.textContent = opts.on
      ? `Confirm restore of ${utilLabel} for ${device?.property} · ${device?.unit} (${device?.tenant}). The command will be queued to gateway ${settings.gatewayId}.`
      : `Confirm remote disconnect of ${utilLabel} for ${device?.property} · ${device?.unit} (${device?.tenant}). Supply will stop until an authorised restore is sent.`;
    if (reason) {
      reason.value = opts.on ? 'Authorised restore' : (device?.arrearsUsd > 0 ? 'Rent arrears' : 'Operator disconnect');
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

  function openConnect(id) {
    editingId = id;
    const d = devices.find((x) => x.id === id);
    const modal = document.getElementById('iot-connect');
    if (!modal || !d) return;
    document.getElementById('iot-connect-title').textContent = `Connect meters · ${d.property} ${d.unit}`;
    document.getElementById('iot-connect-power').value = d.meterPower || '';
    document.getElementById('iot-connect-water').value = d.meterWater || '';
    document.getElementById('iot-connect-online').checked = !!d.online;
    modal.classList.add('open');
    document.body.classList.add('modal-open');
  }

  function closeConnect() {
    editingId = null;
    document.getElementById('iot-connect')?.classList.remove('open');
    document.body.classList.remove('modal-open');
  }

  function saveConnect() {
    const d = devices.find((x) => x.id === editingId);
    if (!d) return;
    const power = document.getElementById('iot-connect-power')?.value?.trim() || '';
    const water = document.getElementById('iot-connect-water')?.value?.trim() || '';
    d.meterPower = power;
    d.meterWater = water;
    d.connected = !!(power && water);
    d.online = !!document.getElementById('iot-connect-online')?.checked && d.connected;
    if (!d.connected) {
      d.online = false;
      d.powerKw = 0;
      d.waterLpm = 0;
    }
    pushLog({
      property: d.property,
      unit: d.unit,
      utility: 'meters',
      on: d.connected,
      kind: 'link',
      reason: d.connected ? `${power} / ${water}` : 'Unlinked',
    });
    saveDevices(devices);
    closeConnect();
    refresh();
    toast(d.connected ? `Meters linked for ${d.property} · ${d.unit}.` : 'Meters unlinked.');
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
      const connect = e.target.closest('[data-iot-connect]');
      if (connect) {
        openConnect(connect.dataset.iotConnect);
        return;
      }
      const toggle = e.target.closest('[data-iot-toggle]');
      if (toggle) {
        const id = toggle.dataset.id;
        const utility = toggle.dataset.iotToggle;
        const device = devices.find((d) => d.id === id);
        if (!device) return;
        openConfirm({ id, utility, on: !device[utility] });
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
      const reason = document.getElementById('iot-reason')?.value || (pending.on ? 'Authorised restore' : 'Operator disconnect');
      applyToggle(pending.id, pending.utility, pending.on, reason);
      closeConfirm();
    });

    document.getElementById('iot-connect-cancel')?.addEventListener('click', closeConnect);
    document.getElementById('iot-connect')?.querySelector('[data-close-connect]')?.addEventListener('click', closeConnect);
    document.getElementById('iot-connect-save')?.addEventListener('click', saveConnect);

    document.getElementById('iot-settings-save')?.addEventListener('click', readSettingsForm);

    document.getElementById('iot-sync')?.addEventListener('click', () => {
      const btn = document.getElementById('iot-sync');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Syncing…';
      }
      setTimeout(() => {
        devices.forEach((d) => {
          if (d.connected && !d.online && Math.random() > 0.4) d.online = true;
        });
        tickUsage();
        saveDevices(devices);
        refresh();
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Sync meters';
        }
        const t = totals();
        toast(`Sync complete — ${fmtKwh(t.kwhToday)} power · ${fmtM3(t.m3Today)} water today.`);
      }, 900);
    });

    document.getElementById('iot-open-settings')?.addEventListener('click', () => {
      document.getElementById('iot-settings-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function initPage() {
    if (!document.getElementById('iot-grid')) return;
    fillSettingsForm();
    bind();
    refresh();
    restartUsageTicker();
  }

  function initSettingsPage() {
    const root = document.getElementById('iot-settings-embed');
    if (!root) return;
    fillSettingsForm();
    document.getElementById('iot-settings-save')?.addEventListener('click', readSettingsForm);
  }

  window.PropertyERPIoT = { init: initPage, loadDevices, applyToggle, loadSettings };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initPage();
      initSettingsPage();
    });
  } else {
    initPage();
    initSettingsPage();
  }
})();
