(function () {
  function slugify(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  function moneyUsd(n) {
    return Number(n || 0);
  }

  function hash(str) {
    let h = 0;
    const s = String(str || '');
    for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h;
  }

  function pick(arr, seed) {
    return arr[hash(seed) % arr.length];
  }

  function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().slice(0, 10);
  }

  function monthsFromNow(n) {
    const d = new Date();
    d.setMonth(d.getMonth() + n);
    return d.toISOString().slice(0, 10);
  }

  function buildIoT(unitCode, propertyName, tenantName, balance) {
    const seed = hash(`${propertyName}-${unitCode}`);
    const connected = seed % 5 !== 0;
    const powerOn = connected && (balance || 0) < 3000 ? seed % 7 !== 0 : false;
    const waterOn = connected && (balance || 0) < 2500 ? seed % 6 !== 0 : false;
    return {
      connected,
      online: connected && seed % 9 !== 0,
      power: powerOn,
      water: waterOn,
      meterPower: connected ? `UMEME-${44000 + (seed % 9000)}` : '',
      meterWater: connected ? `NWSC-${11000 + (seed % 8000)}` : '',
      kwhToday: connected ? Math.round((8 + (seed % 40)) * 10) / 10 : 0,
      kwhMonth: connected ? Math.round((180 + (seed % 700)) * 10) / 10 : 0,
      m3Today: connected ? Math.round((0.3 + (seed % 12) / 10) * 100) / 100 : 0,
      m3Month: connected ? Math.round((6 + (seed % 30)) * 10) / 10 : 0,
      powerKw: powerOn ? Math.round((0.4 + (seed % 30) / 10) * 10) / 10 : 0,
      waterLpm: waterOn ? Math.round((1.2 + (seed % 40) / 10) * 10) / 10 : 0,
      arrearsUsd: balance || 0,
      property: propertyName,
      unit: unitCode,
      tenant: tenantName || '— Vacant —',
    };
  }

  function buildPayments(tenant, monthlyRent) {
    const rent = monthlyRent || tenant.deposit / 1.5 || 500;
    const months = ['Jun 2025', 'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025'];
    return months.map((label, i) => {
      const paid = i < 5 || !(tenant.balance > 0);
      const method = pick(['MTN MoMo', 'Airtel Money', 'Bank transfer', 'Cash office'], `${tenant.id}-${i}`);
      const amount = Math.round(rent * (paid ? 1 : 0.4));
      return {
        id: `PAY-${1000 + hash(tenant.id + i) % 8000}`,
        period: label,
        amount,
        method,
        status: paid ? 'Cleared' : 'Partial',
        date: daysAgo(30 * (5 - i) + (hash(tenant.id) % 8)),
        ref: `TXN-${hash(`${tenant.id}-pay-${i}`) % 900000}`,
      };
    }).reverse();
  }

  function buildInvoices(tenant, monthlyRent) {
    const rent = monthlyRent || 500;
    return [0, 1, 2].map((i) => {
      const overdue = i === 0 && tenant.balance > 0;
      return {
        id: `INV-2025-${String(400 + hash(tenant.id) % 500 + i).padStart(3, '0')}`,
        period: ['Nov 2025', 'Oct 2025', 'Sep 2025'][i],
        amount: Math.round(rent),
        vat: Math.round(rent * 0.18),
        wht: Math.round(rent * 0.06),
        due: daysAgo(i === 0 ? -5 : 25 + i * 30),
        status: overdue ? 'Overdue' : i === 0 ? 'Issued' : 'Paid',
        daysOverdue: overdue ? Math.max(7, Math.round((tenant.balance / rent) * 10)) : 0,
      };
    });
  }

  function buildDocuments(name, kind) {
    const base = [
      { name: `${kind === 'tenant' ? 'Tenancy agreement' : 'Unit handover'} — ${name}.pdf`, type: 'PDF', size: '284 KB', updated: daysAgo(40) },
      { name: `National ID / Company cert — ${name}.pdf`, type: 'PDF', size: '512 KB', updated: daysAgo(120) },
      { name: `Deposit receipt — ${name}.pdf`, type: 'PDF', size: '96 KB', updated: daysAgo(95) },
      { name: `Inspection checklist — ${name}.pdf`, type: 'PDF', size: '178 KB', updated: daysAgo(18) },
      { name: `Utility account letters.zip`, type: 'ZIP', size: '1.2 MB', updated: daysAgo(60) },
    ];
    if (kind === 'unit') {
      base.push({ name: `Floor plan — ${name}.pdf`, type: 'PDF', size: '640 KB', updated: daysAgo(200) });
      base.push({ name: `Keys & access log.xlsx`, type: 'XLSX', size: '44 KB', updated: daysAgo(12) });
    }
    return base;
  }

  function buildComms(tenant) {
    return [
      { channel: 'WhatsApp', subject: 'Rent reminder — current period', date: daysAgo(2), status: 'Delivered', direction: 'Outbound' },
      { channel: 'SMS', subject: 'Payment received confirmation', date: daysAgo(9), status: 'Delivered', direction: 'Outbound' },
      { channel: 'Email', subject: 'Lease renewal notice', date: daysAgo(21), status: 'Opened', direction: 'Outbound' },
      { channel: 'Call', subject: 'Arrears follow-up', date: daysAgo(4), status: tenant.balance > 0 ? 'Completed' : 'Skipped', direction: 'Outbound' },
      { channel: 'WhatsApp', subject: 'Maintenance update', date: daysAgo(14), status: 'Read', direction: 'Outbound' },
    ];
  }

  function buildTimeline(tenant, unitCode) {
    const items = [
      { date: daysAgo(2), title: 'WhatsApp rent reminder sent', detail: 'Automated via Property ERP bot' },
      { date: daysAgo(9), title: 'Payment posted to ledger', detail: unitCode ? `Unit ${unitCode}` : 'Linked unit' },
      { date: daysAgo(18), title: 'Unit inspection completed', detail: 'No critical defects recorded' },
      { date: daysAgo(45), title: 'Invoice issued', detail: 'Current billing cycle' },
      { date: daysAgo(120), title: 'Lease activated', detail: 'Deposit received and keys issued' },
      { date: daysAgo(130), title: 'KYC documents verified', detail: 'ID / company papers approved' },
    ];
    if (tenant.balance > 0) {
      items.unshift({ date: daysAgo(1), title: 'Arrears flagged', detail: `Open balance on account` });
    }
    return items;
  }

  function buildIndexes() {
    const properties = window.PropertyERP?.properties || [];
    const tenantsById = new Map();
    const unitsById = new Map();
    const leases = [];

    properties.forEach((p) => {
      (p.units || []).forEach((u) => {
        const unitKey = `${p.id}__${slugify(u.id)}`;
        const maint = (p.maintenanceList || []).filter((m) => slugify(m.unit) === slugify(u.id));
        const arrearsHit = (p.arrearsList || []).find((a) => slugify(a.unit) === slugify(u.id));
        const leaseHit = (p.leasesExpiring || []).find((l) => slugify(l.unit) === slugify(u.id));
        const tenantName = u.tenant && u.tenant !== '—' ? u.tenant : null;
        const iot = buildIoT(u.id, p.name, tenantName, arrearsHit?.amount || 0);

        const unit = {
          id: unitKey,
          code: u.id,
          propertyId: p.id,
          propertyName: p.name,
          propertyCode: p.code,
          propertyHref: `property.html?id=${encodeURIComponent(p.id)}`,
          propertyType: p.type,
          propertyManager: p.manager,
          floor: u.floor,
          type: u.type,
          rent: moneyUsd(u.rent),
          status: u.status,
          tenantName,
          href: `unit.html?id=${encodeURIComponent(unitKey)}`,
          pathHref: `/unit/${encodeURIComponent(unitKey)}`,
          image: p.image,
          gallery: p.gallery || [p.image],
          location: p.location,
          areaSqm: Math.round((p.areaSqm || 55) / Math.max(1, (p.unitCount || 10) / 3)),
          bedrooms: /studio/i.test(u.type) ? 0 : /3\s*bed/i.test(u.type) ? 3 : /2\s*bed/i.test(u.type) ? 2 : /1\s*bed/i.test(u.type) ? 1 : null,
          bathrooms: /studio/i.test(u.type) ? 1 : /3\s*bed/i.test(u.type) ? 2 : 1,
          furnished: hash(unitKey) % 2 === 0,
          parking: hash(unitKey) % 3 !== 0,
          balcony: /bed/i.test(u.type) && hash(unitKey) % 2 === 0,
          keysIssued: u.status === 'Occupied',
          lastInspection: daysAgo(12 + (hash(unitKey) % 40)),
          nextInspection: monthsFromNow(1),
          depositHeld: tenantName ? Math.round(u.rent * 1.5) : 0,
          arrears: arrearsHit || null,
          maintenance: maint,
          lease: leaseHit
            ? { tenant: leaseHit.tenant, expiry: leaseHit.expiry, rent: leaseHit.rent, start: '2025-01-01', end: leaseHit.expiry, status: 'Active', tax: p.type === 'Commercial' ? 'VAT 18%' : 'Exempt' }
            : tenantName
              ? { tenant: tenantName, expiry: monthsFromNow(10 + (hash(unitKey) % 8)), rent: u.rent, start: '2025-01-01', end: monthsFromNow(11), status: 'Active', tax: p.type === 'Commercial' ? 'VAT 18%' : 'Exempt' }
              : null,
          iot,
          documents: buildDocuments(u.id, 'unit'),
          notes: [
            u.status === 'Vacant' ? 'Unit available for viewing — WhatsApp booking enabled.' : 'Occupancy stable; utilities billed via smart meters.',
            maint.length ? `${maint.length} open maintenance ticket(s).` : 'No open maintenance tickets.',
            arrearsHit ? `Arrears ${arrearsHit.days} days · chase in progress.` : 'Rent account current or not occupied.',
          ],
          amenities: [
            ...(p.type === 'Residential' ? ['Water heater', 'Built-in wardrobes', 'Security access'] : ['AC ready', 'Fibre conduit', 'Loading access']),
            hash(unitKey) % 2 === 0 ? 'Backup power socket' : 'Metered utilities',
            hash(unitKey) % 3 === 0 ? 'CCTV corridor' : 'Fire extinguisher point',
          ],
          neighbors: (p.units || [])
            .filter((x) => x.id !== u.id)
            .slice(0, 3)
            .map((x) => ({
              code: x.id,
              status: x.status,
              href: `unit.html?id=${encodeURIComponent(`${p.id}__${slugify(x.id)}`)}`,
            })),
        };
        unitsById.set(unitKey, unit);
        unitsById.set(slugify(u.id), unit);
        unitsById.set(`${slugify(p.name)}-${slugify(u.id)}`, unit);

        if (tenantName) {
          const tid = slugify(tenantName);
          const existing = tenantsById.get(tid) || {
            id: tid,
            code: `TNT-${(1000 + tenantsById.size + 1)}`,
            name: tenantName,
            phone: `+256 700 ${String(100 + tenantsById.size).padStart(3, '0')} ${String(200 + tenantsById.size).padStart(3, '0')}`,
            email: `${tid.replace(/-/g, '.')}@tenant.ug`,
            altPhone: `+256 772 ${String(300 + tenantsById.size).padStart(3, '0')} ${String(400 + tenantsById.size).padStart(3, '0')}`,
            nationalId: `CM${String(87000000 + hash(tid) % 999999)}`,
            tin: `10${String(1000000 + hash(tid + 'tin') % 8999999)}`,
            type: /ltd|holdings|trust|ug|mart|zone|services|traders|hub|consulting/i.test(tenantName) ? 'Company' : 'Individual',
            status: 'Active',
            kyc: 'Verified',
            moveIn: daysAgo(90 + (hash(tid) % 200)),
            emergencyName: pick(['Grace Achieng', 'Denis Wanyama', 'Joan Kizza', 'Paul Kato'], tid),
            emergencyPhone: `+256 701 ${String(500 + (hash(tid) % 400)).padStart(3, '0')} 010`,
            preferredChannel: pick(['WhatsApp', 'SMS', 'Email', 'Call'], tid),
            billingCycle: 'Monthly',
            paymentMethod: pick(['MTN MoMo', 'Airtel Money', 'Bank transfer'], tid),
            bankName: pick(['Stanbic', 'Centenary', 'Absa', 'Equity'], tid),
            deposit: 0,
            balance: 0,
            creditScore: 60 + (hash(tid) % 40),
            units: [],
            properties: [],
            propertyIds: [],
            arrearsItems: [],
            maintenance: [],
            leases: [],
            href: `tenant.html?id=${encodeURIComponent(tid)}`,
            pathHref: `/tenant/${encodeURIComponent(tid)}`,
          };
          existing.units.push({
            unitId: unit.id,
            unitCode: unit.code,
            propertyId: p.id,
            propertyName: p.name,
            rent: unit.rent,
            status: unit.status,
            floor: unit.floor,
            type: unit.type,
            href: unit.href,
            iot: unit.iot,
          });
          if (!existing.properties.includes(p.name)) existing.properties.push(p.name);
          if (!existing.propertyIds.includes(p.id)) existing.propertyIds.push(p.id);
          existing.deposit += Math.round(unit.rent * 1.5);
          if (arrearsHit) {
            existing.balance += moneyUsd(arrearsHit.amount);
            existing.arrearsItems.push({ ...arrearsHit, propertyId: p.id, propertyName: p.name, href: unit.href });
          }
          maint.forEach((m) => existing.maintenance.push({ ...m, propertyId: p.id, propertyName: p.name, unitHref: unit.href }));
          if (unit.lease) existing.leases.push({ ...unit.lease, unitCode: unit.code, unitHref: unit.href, propertyName: p.name, propertyId: p.id });
          tenantsById.set(tid, existing);

          leases.push({
            id: `lease-${tid}-${slugify(u.id)}`,
            tenantId: tid,
            tenantName,
            unitId: unit.id,
            unitCode: unit.code,
            propertyId: p.id,
            propertyName: p.name,
            rent: unit.rent,
            start: unit.lease?.start || '2025-01-01',
            end: unit.lease?.end || monthsFromNow(11),
            status: 'Active',
            tax: unit.lease?.tax || 'Exempt',
            href: `tenant.html?id=${encodeURIComponent(tid)}`,
          });
        }
      });

      (p.arrearsList || []).forEach((a) => {
        const tid = slugify(a.tenant);
        const t = tenantsById.get(tid);
        if (!t) return;
        if (!t.arrearsItems.some((x) => x.unit === a.unit && x.propertyName === p.name)) {
          t.balance = Math.max(t.balance || 0, moneyUsd(a.amount));
          t.arrearsItems.push({
            ...a,
            propertyId: p.id,
            propertyName: p.name,
            href: `unit.html?id=${encodeURIComponent(`${p.id}__${slugify(a.unit)}`)}`,
          });
        }
      });
    });

    const extras = [
      { name: 'Nakato Holdings', property: 'Kololo Heights', unit: 'A-1204', rent: 850, balance: 850, status: 'Active' },
      { name: 'Agaba Retail Ltd', property: 'Ntinda Business Park', unit: 'C-05', rent: 1200, balance: 2400, status: 'Active' },
      { name: 'Sarah Namutebi', property: 'Kololo Heights', unit: 'A-0801', rent: 620, balance: 0, status: 'Active' },
    ];
    extras.forEach((e, i) => {
      const tid = slugify(e.name);
      if (tenantsById.has(tid)) {
        const t = tenantsById.get(tid);
        t.balance = Math.max(t.balance || 0, e.balance);
        return;
      }
      const prop = properties.find((p) => p.name === e.property);
      const unitHref = prop ? `unit.html?id=${encodeURIComponent(`${prop.id}__${slugify(e.unit)}`)}` : 'units.html';
      tenantsById.set(tid, {
        id: tid,
        code: `TNT-${1100 + i}`,
        name: e.name,
        phone: `+256 700 ${120 + i}0 ${300 + i}`,
        email: `${tid.replace(/-/g, '.')}@tenant.ug`,
        altPhone: `+256 772 ${140 + i}0 ${320 + i}`,
        nationalId: `CM${String(88000000 + i)}`,
        tin: `10${String(2000000 + i)}`,
        type: /ltd|holdings/i.test(e.name) ? 'Company' : 'Individual',
        status: e.status,
        kyc: 'Verified',
        moveIn: daysAgo(100 + i * 10),
        emergencyName: 'Portfolio Desk',
        emergencyPhone: '+256 700 000 001',
        preferredChannel: 'WhatsApp',
        billingCycle: 'Monthly',
        paymentMethod: 'MTN MoMo',
        bankName: 'Stanbic',
        deposit: Math.round(e.rent * 1.5),
        balance: e.balance,
        creditScore: 72,
        units: [{
          unitId: prop ? `${prop.id}__${slugify(e.unit)}` : slugify(e.unit),
          unitCode: e.unit,
          propertyId: prop?.id,
          propertyName: e.property,
          rent: e.rent,
          status: 'Occupied',
          floor: '—',
          type: '—',
          href: unitHref,
          iot: buildIoT(e.unit, e.property, e.name, e.balance),
        }],
        properties: [e.property],
        propertyIds: prop ? [prop.id] : [],
        arrearsItems: e.balance > 0 ? [{ tenant: e.name, unit: e.unit, days: 18, amount: e.balance, propertyName: e.property, propertyId: prop?.id, href: unitHref }] : [],
        maintenance: [],
        leases: [{ tenant: e.name, unitCode: e.unit, unitHref, propertyName: e.property, propertyId: prop?.id, rent: e.rent, start: '2025-01-01', end: monthsFromNow(11), status: 'Active', tax: 'Exempt', expiry: monthsFromNow(11) }],
        href: `tenant.html?id=${encodeURIComponent(tid)}`,
        pathHref: `/tenant/${encodeURIComponent(tid)}`,
      });
    });

    // Finalize tenant 360 packs
    [...tenantsById.values()].forEach((t) => {
      const monthly = (t.units || []).reduce((s, u) => s + (u.rent || 0), 0) || Math.round((t.deposit || 0) / 1.5);
      t.monthlyRent = monthly;
      t.payments = buildPayments(t, monthly);
      t.invoices = buildInvoices(t, monthly);
      t.documents = buildDocuments(t.name, 'tenant');
      t.comms = buildComms(t);
      t.timeline = buildTimeline(t, t.units?.[0]?.unitCode);
      t.guarantors = t.type === 'Individual'
        ? [{ name: t.emergencyName, phone: t.emergencyPhone, relation: 'Next of kin', status: 'On file' }]
        : [{ name: 'Company director', phone: t.altPhone || t.phone, relation: 'Director', status: 'On file' }];
      t.risk = t.balance > monthly * 1.5 ? 'High' : t.balance > 0 ? 'Medium' : 'Low';
      t.lifetimeValue = Math.round(monthly * 14 + (t.deposit || 0));
      t.collectionRate = t.balance > 0 ? Math.max(55, 100 - Math.round((t.balance / Math.max(monthly, 1)) * 12)) : 98;
      t.notes = [
        `${t.type} tenant · KYC ${t.kyc}`,
        t.balance > 0 ? `Open arrears require follow-up via ${t.preferredChannel}.` : 'Account in good standing.',
        `Preferred payment: ${t.paymentMethod} · billing ${t.billingCycle.toLowerCase()}.`,
      ];
    });

    return {
      tenants: [...tenantsById.values()],
      units: [...new Map([...unitsById.values()].map((u) => [u.id, u])).values()],
      leases,
      getTenant: (id) => tenantsById.get(slugify(id)) || tenantsById.get(String(id || '').toLowerCase()) || null,
      getUnit: (id) => {
        const key = String(id || '');
        return unitsById.get(key) || unitsById.get(slugify(key)) || unitsById.get(key.toLowerCase()) || null;
      },
    };
  }

  function routeId(fallbackQueryKeys) {
    const params = new URLSearchParams(window.location.search);
    for (const key of fallbackQueryKeys || ['id']) {
      if (params.get(key)) return params.get(key);
    }
    const parts = window.location.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
    if (parts.length >= 2 && ['tenant', 'tenants', 'unit', 'units', 'property', 'properties'].includes(parts[0])) {
      return decodeURIComponent(parts.slice(1).join('/'));
    }
    return null;
  }

  function init() {
    const index = buildIndexes();
    window.PropertyERP = window.PropertyERP || {};
    window.PropertyERP.tenants = index.tenants;
    window.PropertyERP.units = index.units;
    window.PropertyERP.leases = index.leases;
    window.PropertyERP.getTenant = index.getTenant;
    window.PropertyERP.getUnit = index.getUnit;
    window.PropertyERP.routeId = routeId;
    window.PropertyERP.tenantHref = (t) => (typeof t === 'string' ? `tenant.html?id=${encodeURIComponent(slugify(t))}` : t.href);
    window.PropertyERP.unitHref = (u) => (typeof u === 'string' ? `unit.html?id=${encodeURIComponent(u)}` : u.href);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
