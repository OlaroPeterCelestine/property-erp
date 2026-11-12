(function () {
  function slugify(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().slice(0, 10);
  }

  const ROLES = [
    { id: 'owner', name: 'Director / Owner', desc: 'Full portfolio, finance approve, RBAC admin', color: 'bg-slate-900 text-white', permissions: ['Approve month close', 'Manage users', 'Override IoT cuts', 'All property scopes'] },
    { id: 'admin', name: 'System Administrator', desc: 'Users, settings, audit, all modules', color: 'bg-violet-600 text-white', permissions: ['Invite users', 'Configure MFA', 'System settings', 'Audit logs'] },
    { id: 'pm', name: 'Property Manager', desc: 'Portfolio ops, leases, maintenance, IoT', color: 'bg-brand-600 text-white', permissions: ['Manage units & tenants', 'Create leases', 'IoT cut/restore', 'Maintenance tickets'] },
    { id: 'accountant', name: 'Accountant', desc: 'GL, VAT/WHT, bank recon, closing', color: 'bg-sky-600 text-white', permissions: ['Post journals', 'VAT/WHT returns', 'Bank reconciliation', 'Prepare close'] },
    { id: 'cashier', name: 'Cashier', desc: 'Collections, rent invoices, receipts', color: 'bg-amber-500 text-white', permissions: ['Record payments', 'Issue receipts', 'View arrears', 'Cash desk'] },
    { id: 'procurement', name: 'Procurement Officer', desc: 'Expenses, suppliers, quotations', color: 'bg-orange-500 text-white', permissions: ['Raise expenses', 'Supplier master', 'Quotations', 'PO follow-up'] },
    { id: 'approver', name: 'Finance Approver', desc: 'Approve spend, close periods, VAT', color: 'bg-indigo-600 text-white', permissions: ['Approve expenses', 'Approve close', 'VAT sign-off', 'Policy exceptions'] },
    { id: 'auditor', name: 'Auditor', desc: 'Read-only across financial modules', color: 'bg-slate-500 text-white', permissions: ['Read-only ledger', 'Export reports', 'Review RBAC', 'No write access'] },
  ];

  const PAGES = [
    { section: 'Overview', id: 'dashboard', href: 'index.html', label: 'Dashboard', icon: 'dashboard-square-01', access: { owner: 'full', admin: 'full', pm: 'full', accountant: 'full', cashier: 'view', procurement: 'view', approver: 'view', auditor: 'view' }, summary: 'Portfolio KPIs, cash and occupancy overview.' },
    { section: 'Portfolio', id: 'properties', href: 'properties.html', label: 'Properties', icon: 'building-03', access: { owner: 'full', admin: 'full', pm: 'full', accountant: 'view', cashier: 'view', procurement: 'view', approver: 'view', auditor: 'view' }, summary: 'Building list with analytics and photo covers.' },
    { section: 'Portfolio', id: 'units', href: 'units.html', label: 'Units', icon: 'home-01', access: { owner: 'full', admin: 'full', pm: 'full', accountant: 'view', cashier: 'view', procurement: 'none', approver: 'view', auditor: 'view' }, summary: 'Unit occupancy, rent and tenant links.' },
    { section: 'Portfolio', id: 'tenants', href: 'tenants.html', label: 'Tenants', icon: 'user-group', access: { owner: 'full', admin: 'full', pm: 'full', accountant: 'view', cashier: 'view', procurement: 'none', approver: 'view', auditor: 'view' }, summary: 'Tenant directory, deposits and balances.' },
    { section: 'Portfolio', id: 'leases', href: 'leases.html', label: 'Leases', icon: 'file-02', access: { owner: 'full', admin: 'full', pm: 'full', accountant: 'view', cashier: 'view', procurement: 'none', approver: 'view', auditor: 'view' }, summary: 'Active agreements, renewals and tax treatment.' },
    { section: 'Rent & Cash', id: 'rent', href: 'rent.html', label: 'Rent Invoices', icon: 'invoice-01', access: { owner: 'full', admin: 'full', pm: 'write', accountant: 'full', cashier: 'write', procurement: 'none', approver: 'view', auditor: 'view' }, summary: 'Issue and track rent invoices with VAT/WHT.' },
    { section: 'Rent & Cash', id: 'payments', href: 'payments.html', label: 'Collections', icon: 'money-receive-01', access: { owner: 'full', admin: 'full', pm: 'view', accountant: 'full', cashier: 'full', procurement: 'none', approver: 'view', auditor: 'view' }, summary: 'MoMo, bank and cash receipts.' },
    { section: 'Rent & Cash', id: 'arrears', href: 'arrears.html', label: 'Arrears', icon: 'alert-02', access: { owner: 'full', admin: 'full', pm: 'full', accountant: 'full', cashier: 'write', procurement: 'none', approver: 'view', auditor: 'view' }, summary: 'Overdue accounts and chase workflow.' },
    { section: 'Spend', id: 'expenses', href: 'expenses.html', label: 'Expenses', icon: 'invoice-03', access: { owner: 'full', admin: 'full', pm: 'write', accountant: 'full', cashier: 'none', procurement: 'full', approver: 'full', auditor: 'view' }, summary: 'Opex capture, approval and posting.' },
    { section: 'Spend', id: 'suppliers', href: 'suppliers.html', label: 'Suppliers', icon: 'user-multiple', access: { owner: 'full', admin: 'full', pm: 'view', accountant: 'view', cashier: 'none', procurement: 'full', approver: 'view', auditor: 'view' }, summary: 'Vendor master and compliance docs.' },
    { section: 'Spend', id: 'maintenance', href: 'maintenance.html', label: 'Maintenance', icon: 'wrench-01', access: { owner: 'full', admin: 'full', pm: 'full', accountant: 'view', cashier: 'none', procurement: 'write', approver: 'view', auditor: 'view' }, summary: 'Tickets, priority and work status.' },
    { section: 'Smart Home', id: 'iot', href: 'iot.html', label: 'IoT Controls', icon: 'wifi-01', access: { owner: 'full', admin: 'full', pm: 'full', accountant: 'none', cashier: 'none', procurement: 'none', approver: 'none', auditor: 'view' }, summary: 'Water/power meters, cut and usage.' },
    { section: 'Finance & Tax', id: 'accounting', href: 'accounting.html', label: 'General Ledger', icon: 'analytics-01', access: { owner: 'full', admin: 'full', pm: 'none', accountant: 'full', cashier: 'none', procurement: 'none', approver: 'view', auditor: 'view' }, summary: 'Journals, chart of accounts and trial balance.' },
    { section: 'Finance & Tax', id: 'bank', href: 'bank.html', label: 'Bank Recon', icon: 'bank', access: { owner: 'full', admin: 'full', pm: 'none', accountant: 'full', cashier: 'view', procurement: 'none', approver: 'view', auditor: 'view' }, summary: 'Match statements to collections and spend.' },
    { section: 'Finance & Tax', id: 'vat', href: 'vat.html', label: 'VAT', icon: 'percent', access: { owner: 'full', admin: 'full', pm: 'none', accountant: 'full', cashier: 'none', procurement: 'none', approver: 'full', auditor: 'view' }, summary: 'URA VAT position and returns.' },
    { section: 'Finance & Tax', id: 'wht', href: 'wht.html', label: 'WHT', icon: 'taxes', access: { owner: 'full', admin: 'full', pm: 'none', accountant: 'full', cashier: 'none', procurement: 'none', approver: 'full', auditor: 'view' }, summary: 'Withholding tax accruals and certificates.' },
    { section: 'Finance & Tax', id: 'closing', href: 'closing.html', label: 'Month Close', icon: 'calendar-check', access: { owner: 'full', admin: 'full', pm: 'view', accountant: 'full', cashier: 'none', procurement: 'none', approver: 'full', auditor: 'view' }, summary: 'Close checklist for rent, tax and GL.' },
    { section: 'Insights', id: 'reports', href: 'reports.html', label: 'Reports', icon: 'chart-bar-line', access: { owner: 'full', admin: 'full', pm: 'view', accountant: 'full', cashier: 'view', procurement: 'view', approver: 'view', auditor: 'view' }, summary: 'Operational and financial report pack.' },
    { section: 'Insights', id: 'documents', href: 'documents.html', label: 'Documents', icon: 'folder-02', access: { owner: 'full', admin: 'full', pm: 'write', accountant: 'view', cashier: 'view', procurement: 'view', approver: 'view', auditor: 'view' }, summary: 'Leases, KYC and shared vault files.' },
    { section: 'Admin', id: 'users', href: 'users.html', label: 'Users & Roles', icon: 'user-settings-01', access: { owner: 'full', admin: 'full', pm: 'none', accountant: 'none', cashier: 'none', procurement: 'none', approver: 'none', auditor: 'view' }, summary: 'RBAC directory, roles and page cards.' },
    { section: 'Admin', id: 'settings', href: 'settings.html', label: 'Settings', icon: 'settings-01', access: { owner: 'full', admin: 'full', pm: 'view', accountant: 'view', cashier: 'none', procurement: 'none', approver: 'none', auditor: 'view' }, summary: 'Org, currency, IoT gateway and preferences.' },
    { section: 'Auth', id: 'login', href: 'login.html', label: 'Login', icon: 'login-01', access: { owner: 'full', admin: 'full', pm: 'full', accountant: 'full', cashier: 'full', procurement: 'full', approver: 'full', auditor: 'full' }, summary: 'Authentication entry for all roles.' },
    { section: 'Detail routes', id: 'property', href: 'property.html?id=kololo-heights', label: 'Property 360', icon: 'building-03', access: { owner: 'full', admin: 'full', pm: 'full', accountant: 'view', cashier: 'view', procurement: 'view', approver: 'view', auditor: 'view' }, summary: 'Building analytics, units, arrears and NOI.' },
    { section: 'Detail routes', id: 'tenant', href: 'tenant.html?id=nakato-holdings', label: 'Tenant 360', icon: 'user', access: { owner: 'full', admin: 'full', pm: 'full', accountant: 'view', cashier: 'view', procurement: 'none', approver: 'view', auditor: 'view' }, summary: 'Tenant ledger, leases, IoT and communications.' },
    { section: 'Detail routes', id: 'unit', href: 'unit.html?id=kololo-heights__a-1204', label: 'Unit 360', icon: 'home-01', access: { owner: 'full', admin: 'full', pm: 'full', accountant: 'view', cashier: 'view', procurement: 'none', approver: 'view', auditor: 'view' }, summary: 'Unit specs, meters, lease and maintenance.' },
  ];

  const ROLE_NAME_TO_ID = {
    'Director / Owner': 'owner',
    'System Administrator': 'admin',
    'Property Manager': 'pm',
    Accountant: 'accountant',
    Cashier: 'cashier',
    'Procurement Officer': 'procurement',
    'Finance Approver': 'approver',
    Auditor: 'auditor',
  };

  const USERS = [
    { name: 'Alex Okello', email: 'alex@propertyerp.ug', role: 'Property Manager', scope: 'Kololo, Ntinda', mfa: 'On', status: 'Active', phone: '+256 700 111 201', title: 'Senior Property Manager', joined: '2023-04-12', lastLogin: daysAgo(1) },
    { name: 'Grace Atim', email: 'grace@propertyerp.ug', role: 'Cashier', scope: 'Kololo Heights', mfa: 'On', status: 'Active', phone: '+256 700 111 202', title: 'Collections Cashier', joined: '2024-01-08', lastLogin: daysAgo(0) },
    { name: 'Peter Ssebunya', email: 'peter@propertyerp.ug', role: 'Accountant', scope: 'All', mfa: 'On', status: 'Active', phone: '+256 700 111 203', title: 'Financial Accountant', joined: '2022-11-02', lastLogin: daysAgo(2) },
    { name: 'Audit Desk', email: 'audit@propertyerp.ug', role: 'Auditor', scope: 'All', mfa: 'On', status: 'Active', phone: '+256 700 111 204', title: 'Internal Audit', joined: '2023-08-19', lastLogin: daysAgo(5) },
    { name: 'Mary Nabirye', email: 'mary@propertyerp.ug', role: 'Procurement Officer', scope: 'Ntinda, Entebbe Mall', mfa: 'Off', status: 'Active', phone: '+256 700 111 205', title: 'Procurement Lead', joined: '2024-03-21', lastLogin: daysAgo(3) },
    { name: 'Jonah Kiggundu', email: 'jonah@propertyerp.ug', role: 'Finance Approver', scope: 'All', mfa: 'On', status: 'Active', phone: '+256 700 111 206', title: 'Finance Controller', joined: '2021-09-14', lastLogin: daysAgo(1) },
    { name: 'Irene Achieng', email: 'irene@propertyerp.ug', role: 'Accountant', scope: 'Bugolobi, Nakasero', mfa: 'Off', status: 'Active', phone: '+256 700 111 207', title: 'Tax Accountant', joined: '2023-06-30', lastLogin: daysAgo(4) },
    { name: 'Samuel Ocen', email: 'samuel@propertyerp.ug', role: 'Director / Owner', scope: 'All', mfa: 'On', status: 'Active', phone: '+256 700 111 208', title: 'Managing Director', joined: '2020-01-05', lastLogin: daysAgo(0) },
    { name: 'Joan Kizza', email: 'joan@propertyerp.ug', role: 'Property Manager', scope: 'Makerere, Naalya', mfa: 'On', status: 'Active', phone: '+256 700 111 209', title: 'Property Manager', joined: '2024-05-11', lastLogin: daysAgo(2) },
    { name: 'Denis Wanyama', email: 'denis@propertyerp.ug', role: 'System Administrator', scope: 'All', mfa: 'On', status: 'Active', phone: '+256 700 111 210', title: 'IT / Systems Admin', joined: '2022-02-18', lastLogin: daysAgo(0) },
    { name: 'Rita Nalwoga', email: 'rita@propertyerp.ug', role: 'Cashier', scope: 'Entebbe Road Mall', mfa: 'Off', status: 'Inactive', phone: '+256 700 111 211', title: 'Collections Cashier', joined: '2023-12-01', lastLogin: daysAgo(45) },
    { name: 'Paul Kato', email: 'paul@propertyerp.ug', role: 'Property Manager', scope: 'Old Jinja Warehouse', mfa: 'On', status: 'Active', phone: '+256 700 111 212', title: 'Site Manager', joined: '2024-07-09', lastLogin: daysAgo(6) },
  ].map((u, i) => {
    const id = slugify(u.email.split('@')[0]);
    const roleId = ROLE_NAME_TO_ID[u.role] || 'pm';
    return {
      ...u,
      id,
      code: `USR-${1200 + i}`,
      roleId,
      href: `user.html?id=${encodeURIComponent(id)}`,
      roleHref: `role.html?id=${encodeURIComponent(roleId)}`,
      avatar: `https://i.pravatar.cc/160?u=${encodeURIComponent(u.email)}`,
      activity: [
        { date: daysAgo(1), title: 'Signed in', detail: 'Kampala · Chrome' },
        { date: daysAgo(2), title: 'Opened module', detail: u.role.includes('Cashier') ? 'Collections' : u.role.includes('Accountant') ? 'General Ledger' : 'Properties' },
        { date: daysAgo(5), title: 'Permission check', detail: `Role ${u.role} evaluated` },
        { date: daysAgo(12), title: 'Profile updated', detail: 'MFA / contact details' },
      ],
      devices: [
        { name: 'MacBook Pro', type: 'Desktop', last: daysAgo(1), status: 'Trusted' },
        { name: 'iPhone 14', type: 'Mobile', last: daysAgo(u.mfa === 'On' ? 0 : 20), status: u.mfa === 'On' ? 'Trusted' : 'Review' },
      ],
    };
  });

  ROLES.forEach((r) => {
    r.users = USERS.filter((u) => u.roleId === r.id);
    r.userCount = r.users.length;
    r.href = `role.html?id=${encodeURIComponent(r.id)}`;
  });

  PAGES.forEach((p) => {
    p.detailHref = `page.html?id=${encodeURIComponent(p.id)}`;
  });

  function routeId(keys) {
    const params = new URLSearchParams(window.location.search);
    for (const key of keys || ['id']) {
      if (params.get(key)) return params.get(key);
    }
    const parts = window.location.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
    if (parts.length >= 2 && ['user', 'users', 'role', 'roles', 'page', 'pages', 'module'].includes(parts[0])) {
      return decodeURIComponent(parts.slice(1).join('/'));
    }
    return null;
  }

  function getRole(id) {
    const key = String(id || '').toLowerCase();
    return ROLES.find((r) => r.id === key || slugify(r.name) === slugify(id)) || null;
  }

  function getUser(id) {
    const key = slugify(id);
    return USERS.find((u) => u.id === key || slugify(u.email) === key || slugify(u.name) === key) || null;
  }

  function getPage(id) {
    const key = slugify(id);
    return PAGES.find((p) => p.id === key || slugify(p.label) === key) || null;
  }

  window.PropertyERPRbac = {
    roles: ROLES,
    pages: PAGES,
    users: USERS,
    roleNameToId: ROLE_NAME_TO_ID,
    getRole,
    getUser,
    getPage,
    routeId,
    slugify,
  };
})();
