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

  function buildIndexes() {
    const properties = window.PropertyERP?.properties || [];
    const tenantsById = new Map();
    const unitsById = new Map();
    const leases = [];

    properties.forEach((p) => {
      (p.units || []).forEach((u) => {
        const unitKey = `${p.id}__${slugify(u.id)}`;
        const unit = {
          id: unitKey,
          code: u.id,
          propertyId: p.id,
          propertyName: p.name,
          propertyHref: `property.html?id=${encodeURIComponent(p.id)}`,
          floor: u.floor,
          type: u.type,
          rent: moneyUsd(u.rent),
          status: u.status,
          tenantName: u.tenant && u.tenant !== '—' ? u.tenant : null,
          href: `unit.html?id=${encodeURIComponent(unitKey)}`,
          pathHref: `/unit/${encodeURIComponent(unitKey)}`,
          image: p.image,
          location: p.location,
        };
        unitsById.set(unitKey, unit);
        unitsById.set(slugify(u.id), unit);
        unitsById.set(`${slugify(p.name)}-${slugify(u.id)}`, unit);

        if (unit.tenantName) {
          const tid = slugify(unit.tenantName);
          const existing = tenantsById.get(tid) || {
            id: tid,
            code: `TNT-${(1000 + tenantsById.size + 1)}`,
            name: unit.tenantName,
            phone: `+256 700 ${String(100 + tenantsById.size).padStart(3, '0')} ${String(200 + tenantsById.size).padStart(3, '0')}`,
            email: `${tid.replace(/-/g, '.')}@tenant.ug`,
            status: unit.status === 'Occupied' ? 'Active' : 'Active',
            deposit: Math.round(unit.rent * 1.5),
            balance: 0,
            units: [],
            properties: [],
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
            href: unit.href,
          });
          if (!existing.properties.includes(p.name)) existing.properties.push(p.name);
          tenantsById.set(tid, existing);

          leases.push({
            id: `lease-${tid}-${slugify(u.id)}`,
            tenantId: tid,
            tenantName: unit.tenantName,
            unitId: unit.id,
            unitCode: unit.code,
            propertyId: p.id,
            propertyName: p.name,
            rent: unit.rent,
            start: '2025-12-01',
            end: '2026-11-30',
            status: 'Active',
            href: `tenant.html?id=${encodeURIComponent(tid)}`,
          });
        }
      });

      (p.arrearsList || []).forEach((a) => {
        const tid = slugify(a.tenant);
        const t = tenantsById.get(tid);
        if (t) t.balance = moneyUsd(a.amount);
      });
    });

    // Seed a few named tenants from list pages if missing
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
      tenantsById.set(tid, {
        id: tid,
        code: `TNT-${1100 + i}`,
        name: e.name,
        phone: `+256 700 ${120 + i}0 ${300 + i}`,
        email: `${tid.replace(/-/g, '.')}@tenant.ug`,
        status: e.status,
        deposit: Math.round(e.rent * 1.5),
        balance: e.balance,
        units: [{
          unitId: prop ? `${prop.id}__${slugify(e.unit)}` : slugify(e.unit),
          unitCode: e.unit,
          propertyId: prop?.id,
          propertyName: e.property,
          rent: e.rent,
          status: 'Occupied',
          href: prop ? `unit.html?id=${encodeURIComponent(`${prop.id}__${slugify(e.unit)}`)}` : 'units.html',
        }],
        properties: [e.property],
        href: `tenant.html?id=${encodeURIComponent(tid)}`,
        pathHref: `/tenant/${encodeURIComponent(tid)}`,
      });
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
    // /tenant/foo or /tenants/foo or tenant.html already handled by query
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
