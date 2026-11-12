(function () {
  const PROPERTIES = [
    {
      id: 'kololo-heights',
      code: 'PRP-001',
      name: 'Kololo Heights',
      location: 'Kololo, Kampala',
      type: 'Residential',
      status: 'Active',
      buildings: 2,
      floors: 14,
      unitCount: 42,
      occupied: 39,
      vacant: 2,
      maintenance: 1,
      occupancy: 94,
      collectionRate: 92,
      expectedRent: 30800,
      collected: 28400,
      arrears: 4200,
      expenses: 4200,
      net: 24200,
      vat: 1680,
      wht: 210,
      avgRent: 850,
      manager: 'Alex Okello',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=640&fit=crop',
      months: {
        labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
        expected: [29500, 29800, 30200, 30500, 30800, 30800],
        collected: [27100, 28000, 27500, 29100, 28600, 28400],
        expenses: [3900, 4100, 4500, 4000, 4300, 4200],
        occupancy: [91, 92, 93, 94, 94, 94],
      },
      unitMix: [
        { type: 'Studio', count: 8, rent: 420 },
        { type: '1 Bed', count: 12, rent: 620 },
        { type: '2 Bed', count: 16, rent: 850 },
        { type: '3 Bed', count: 6, rent: 1200 },
      ],
      units: [
        { id: 'A-1204', floor: '12', type: '2 Bed', tenant: 'Nakato Holdings', rent: 850, status: 'Occupied' },
        { id: 'B-0208', floor: '2', type: 'Studio', tenant: '—', rent: 420, status: 'Vacant' },
        { id: 'A-0801', floor: '8', type: '1 Bed', tenant: 'Sarah Namutebi', rent: 620, status: 'Occupied' },
        { id: 'A-1402', floor: '14', type: '3 Bed', tenant: 'Okello Family Trust', rent: 1200, status: 'Occupied' },
        { id: 'B-0311', floor: '3', type: '2 Bed', tenant: '—', rent: 850, status: 'Under maintenance' },
      ],
      expensesList: [
        { id: 'EXP-4412', category: 'Repairs', supplier: 'Kampala Plumbing Co', amount: 680, status: 'Approved' },
        { id: 'EXP-4390', category: 'Security', supplier: 'SecureGuard UG', amount: 1400, status: 'Paid' },
        { id: 'EXP-4378', category: 'Cleaning', supplier: 'Sparkle Facilities', amount: 920, status: 'Paid' },
        { id: 'EXP-4361', category: 'Insurance', supplier: 'UAP Old Mutual', amount: 1200, status: 'Approved' },
      ],
      arrearsList: [
        { tenant: 'Nakato Holdings', unit: 'A-1204', days: 18, amount: 850 },
        { tenant: 'Musoke Traders', unit: 'A-0506', days: 42, amount: 1700 },
        { tenant: 'Lillian Asiimwe', unit: 'B-0912', days: 11, amount: 620 },
      ],
      maintenanceList: [
        { id: 'MNT-301', unit: 'A-1204', issue: 'Leaking kitchen sink', priority: 'High', status: 'In progress' },
        { id: 'MNT-288', unit: 'B-0311', issue: 'Bathroom waterproofing', priority: 'Medium', status: 'Scheduled' },
      ],
      leasesExpiring: [
        { tenant: 'Sarah Namutebi', unit: 'A-0801', expiry: '2027-01-15', rent: 620 },
        { tenant: 'Okello Family Trust', unit: 'A-1402', expiry: '2027-02-28', rent: 1200 },
      ],
    },
    {
      id: 'ntinda-business-park',
      code: 'PRP-002',
      name: 'Ntinda Business Park',
      location: 'Ntinda, Kampala',
      type: 'Commercial',
      status: 'Active',
      buildings: 3,
      floors: 4,
      unitCount: 28,
      occupied: 25,
      vacant: 3,
      maintenance: 0,
      occupancy: 88,
      collectionRate: 81,
      expectedRent: 27200,
      collected: 22100,
      arrears: 6100,
      expenses: 5100,
      net: 17000,
      vat: 3120,
      wht: 480,
      avgRent: 1200,
      manager: 'Peter Ssebunya',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=640&fit=crop',
      months: {
        labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
        expected: [25800, 26200, 26500, 26800, 27000, 27200],
        collected: [21400, 22800, 21900, 23500, 22600, 22100],
        expenses: [4800, 5000, 5300, 4900, 5150, 5100],
        occupancy: [86, 86, 87, 88, 88, 88],
      },
      unitMix: [
        { type: 'Shop', count: 10, rent: 950 },
        { type: 'Office', count: 14, rent: 1350 },
        { type: 'Warehouse bay', count: 4, rent: 1800 },
      ],
      units: [
        { id: 'C-05', floor: 'G', type: 'Shop', tenant: 'Agaba Retail Ltd', rent: 1200, status: 'Occupied' },
        { id: 'C-12', floor: '1', type: 'Office', tenant: 'Fintech UG', rent: 1450, status: 'Occupied' },
        { id: 'D-02', floor: 'G', type: 'Shop', tenant: '—', rent: 900, status: 'Vacant' },
        { id: 'E-01', floor: 'G', type: 'Warehouse bay', tenant: 'LogiMove Ltd', rent: 1800, status: 'Occupied' },
        { id: 'C-18', floor: '2', type: 'Office', tenant: '—', rent: 1300, status: 'Vacant' },
      ],
      expensesList: [
        { id: 'EXP-4418', category: 'Security', supplier: 'SecureGuard UG', amount: 2200, status: 'Submitted' },
        { id: 'EXP-4401', category: 'Utilities', supplier: 'UMEME / NWSC', amount: 980, status: 'Paid' },
        { id: 'EXP-4388', category: 'Repairs', supplier: 'CoolAir Services', amount: 720, status: 'Approved' },
        { id: 'EXP-4372', category: 'Cleaning', supplier: 'Sparkle Facilities', amount: 1200, status: 'Paid' },
      ],
      arrearsList: [
        { tenant: 'Agaba Retail Ltd', unit: 'C-05', days: 27, amount: 2400 },
        { tenant: 'ByteCraft Hub', unit: 'C-09', days: 55, amount: 2700 },
        { tenant: 'Kla Media House', unit: 'C-14', days: 14, amount: 1000 },
      ],
      maintenanceList: [
        { id: 'MNT-298', unit: 'C-05', issue: 'AC servicing', priority: 'Medium', status: 'Completed' },
      ],
      leasesExpiring: [
        { tenant: 'Fintech UG', unit: 'C-12', expiry: '2026-12-31', rent: 1450 },
        { tenant: 'LogiMove Ltd', unit: 'E-01', expiry: '2027-03-01', rent: 1800 },
      ],
    },
    {
      id: 'nakasero-residences',
      code: 'PRP-003',
      name: 'Nakasero Residences',
      location: 'Nakasero, Kampala',
      type: 'Residential',
      status: 'Active',
      buildings: 1,
      floors: 10,
      unitCount: 36,
      occupied: 29,
      vacant: 6,
      maintenance: 1,
      occupancy: 81,
      collectionRate: 76,
      expectedRent: 20500,
      collected: 15600,
      arrears: 5400,
      expenses: 3800,
      net: 11800,
      vat: 980,
      wht: 160,
      avgRent: 720,
      manager: 'Grace Atim',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3be61?w=1200&h=640&fit=crop',
      months: {
        labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
        expected: [19800, 20000, 20100, 20300, 20400, 20500],
        collected: [16200, 17100, 15800, 16900, 16100, 15600],
        expenses: [3500, 3600, 3900, 3700, 3850, 3800],
        occupancy: [78, 79, 80, 81, 81, 81],
      },
      unitMix: [
        { type: 'Studio', count: 10, rent: 480 },
        { type: '1 Bed', count: 14, rent: 680 },
        { type: '2 Bed', count: 12, rent: 920 },
      ],
      units: [
        { id: 'N-0304', floor: '3', type: '1 Bed', tenant: 'Joan Kizza', rent: 680, status: 'Occupied' },
        { id: 'N-0701', floor: '7', type: '2 Bed', tenant: '—', rent: 920, status: 'Vacant' },
        { id: 'N-0102', floor: '1', type: 'Studio', tenant: 'Brian Mugisha', rent: 480, status: 'Occupied' },
        { id: 'N-0905', floor: '9', type: '2 Bed', tenant: 'Achieng Consulting', rent: 920, status: 'Occupied' },
        { id: 'N-0508', floor: '5', type: '1 Bed', tenant: '—', rent: 680, status: 'Under maintenance' },
      ],
      expensesList: [
        { id: 'EXP-4405', category: 'Repairs', supplier: 'Kampala Plumbing Co', amount: 540, status: 'Approved' },
        { id: 'EXP-4399', category: 'Security', supplier: 'SecureGuard UG', amount: 1100, status: 'Paid' },
        { id: 'EXP-4382', category: 'Utilities', supplier: 'UMEME / NWSC', amount: 760, status: 'Paid' },
        { id: 'EXP-4369', category: 'Cleaning', supplier: 'Sparkle Facilities', amount: 880, status: 'Submitted' },
      ],
      arrearsList: [
        { tenant: 'Joan Kizza', unit: 'N-0304', days: 33, amount: 1360 },
        { tenant: 'Achieng Consulting', unit: 'N-0905', days: 21, amount: 920 },
        { tenant: 'Denis Wanyama', unit: 'N-0206', days: 48, amount: 1440 },
      ],
      maintenanceList: [
        { id: 'MNT-310', unit: 'N-0508', issue: 'Paint & minor fixtures', priority: 'Low', status: 'In progress' },
      ],
      leasesExpiring: [
        { tenant: 'Brian Mugisha', unit: 'N-0102', expiry: '2027-01-31', rent: 480 },
      ],
    },
    {
      id: 'entebbe-road-mall',
      code: 'PRP-004',
      name: 'Entebbe Road Mall',
      location: 'Entebbe Rd',
      type: 'Commercial',
      status: 'Under maintenance',
      buildings: 1,
      floors: 3,
      unitCount: 18,
      occupied: 15,
      vacant: 1,
      maintenance: 2,
      occupancy: 83,
      collectionRate: 88,
      expectedRent: 14200,
      collected: 12500,
      arrears: 1800,
      expenses: 4300,
      net: 8200,
      vat: 1680,
      wht: 320,
      avgRent: 980,
      manager: 'Alex Okello',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=640&fit=crop',
      months: {
        labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
        expected: [13800, 13900, 14000, 14100, 14200, 14200],
        collected: [12100, 12600, 11900, 13000, 12800, 12500],
        expenses: [3600, 3800, 4100, 3900, 4200, 4300],
        occupancy: [85, 85, 84, 83, 83, 83],
      },
      unitMix: [
        { type: 'Retail bay', count: 12, rent: 850 },
        { type: 'Food court', count: 4, rent: 1100 },
        { type: 'Anchor store', count: 2, rent: 2200 },
      ],
      units: [
        { id: 'M-G01', floor: 'G', type: 'Retail bay', tenant: 'Fashion Hub UG', rent: 850, status: 'Occupied' },
        { id: 'M-G08', floor: 'G', type: 'Anchor store', tenant: 'City Mart', rent: 2200, status: 'Occupied' },
        { id: 'M-102', floor: '1', type: 'Food court', tenant: '—', rent: 1100, status: 'Vacant' },
        { id: 'M-205', floor: '2', type: 'Retail bay', tenant: 'PhoneZone', rent: 900, status: 'Under maintenance' },
        { id: 'M-G04', floor: 'G', type: 'Retail bay', tenant: 'Book Corner', rent: 780, status: 'Occupied' },
      ],
      expensesList: [
        { id: 'EXP-4420', category: 'Repairs', supplier: 'BuildRight Contractors', amount: 2100, status: 'Submitted' },
        { id: 'EXP-4411', category: 'Security', supplier: 'SecureGuard UG', amount: 900, status: 'Paid' },
        { id: 'EXP-4395', category: 'Utilities', supplier: 'UMEME / NWSC', amount: 650, status: 'Paid' },
        { id: 'EXP-4380', category: 'Professional services', supplier: 'Audit Partners', amount: 650, status: 'Approved' },
      ],
      arrearsList: [
        { tenant: 'PhoneZone', unit: 'M-205', days: 19, amount: 900 },
        { tenant: 'Fashion Hub UG', unit: 'M-G01', days: 8, amount: 850 },
      ],
      maintenanceList: [
        { id: 'MNT-305', unit: 'M-205', issue: 'Roof leak near retail bay', priority: 'High', status: 'In progress' },
        { id: 'MNT-302', unit: 'Common', issue: 'Escalator service', priority: 'Critical', status: 'Scheduled' },
      ],
      leasesExpiring: [
        { tenant: 'Book Corner', unit: 'M-G04', expiry: '2026-12-15', rent: 780 },
      ],
    },
    {
      id: 'bugolobi-flats',
      code: 'PRP-005',
      name: 'Bugolobi Flats',
      location: 'Bugolobi',
      type: 'Residential',
      status: 'Active',
      buildings: 2,
      floors: 5,
      unitCount: 24,
      occupied: 17,
      vacant: 6,
      maintenance: 1,
      occupancy: 72,
      collectionRate: 69,
      expectedRent: 14200,
      collected: 9800,
      arrears: 4800,
      expenses: 2900,
      net: 6900,
      vat: 620,
      wht: 90,
      avgRent: 480,
      manager: 'Peter Ssebunya',
      image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=1200&h=640&fit=crop',
      months: {
        labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
        expected: [13600, 13800, 13900, 14000, 14100, 14200],
        collected: [10200, 11000, 9800, 10500, 10100, 9800],
        expenses: [2600, 2700, 3000, 2800, 2950, 2900],
        occupancy: [70, 71, 71, 72, 72, 72],
      },
      unitMix: [
        { type: 'Bedsitter', count: 8, rent: 280 },
        { type: '1 Bed', count: 10, rent: 450 },
        { type: '2 Bed', count: 6, rent: 650 },
      ],
      units: [
        { id: 'E-03', floor: '1', type: '1 Bed', tenant: '—', rent: 350, status: 'Under maintenance' },
        { id: 'E-11', floor: '3', type: '2 Bed', tenant: 'Rita Nalwoga', rent: 650, status: 'Occupied' },
        { id: 'F-02', floor: 'G', type: 'Bedsitter', tenant: '—', rent: 280, status: 'Vacant' },
        { id: 'F-08', floor: '2', type: '1 Bed', tenant: 'Paul Kato', rent: 450, status: 'Occupied' },
        { id: 'E-07', floor: '2', type: 'Bedsitter', tenant: '—', rent: 280, status: 'Vacant' },
      ],
      expensesList: [
        { id: 'EXP-4415', category: 'Repairs', supplier: 'Kampala Plumbing Co', amount: 420, status: 'Approved' },
        { id: 'EXP-4402', category: 'Security', supplier: 'SecureGuard UG', amount: 800, status: 'Paid' },
        { id: 'EXP-4389', category: 'Cleaning', supplier: 'Sparkle Facilities', amount: 560, status: 'Paid' },
        { id: 'EXP-4375', category: 'Utilities', supplier: 'UMEME / NWSC', amount: 480, status: 'Submitted' },
      ],
      arrearsList: [
        { tenant: 'Rita Nalwoga', unit: 'E-11', days: 36, amount: 1300 },
        { tenant: 'Paul Kato', unit: 'F-08', days: 22, amount: 900 },
        { tenant: 'Irene Tumusiime', unit: 'E-15', days: 61, amount: 1350 },
      ],
      maintenanceList: [
        { id: 'MNT-305', unit: 'E-03', issue: 'Electrical panel fault', priority: 'Critical', status: 'Quotation pending' },
      ],
      leasesExpiring: [
        { tenant: 'Paul Kato', unit: 'F-08', expiry: '2027-02-10', rent: 450 },
      ],
    },
    {
      id: 'old-jinja-warehouse',
      code: 'PRP-006',
      name: 'Old Jinja Warehouse',
      location: 'Industrial Area',
      type: 'Commercial',
      status: 'Inactive',
      buildings: 1,
      floors: 1,
      unitCount: 6,
      occupied: 0,
      vacant: 6,
      maintenance: 0,
      occupancy: 0,
      collectionRate: 0,
      expectedRent: 0,
      collected: 0,
      arrears: 0,
      expenses: 450,
      net: -450,
      vat: 0,
      wht: 0,
      avgRent: 2100,
      manager: 'Alex Okello',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=640&fit=crop',
      months: {
        labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
        expected: [0, 0, 0, 0, 0, 0],
        collected: [0, 0, 0, 0, 0, 0],
        expenses: [400, 420, 450, 430, 440, 450],
        occupancy: [0, 0, 0, 0, 0, 0],
      },
      unitMix: [
        { type: 'Bay', count: 6, rent: 2100 },
      ],
      units: [
        { id: 'W-01', floor: 'G', type: 'Bay', tenant: '—', rent: 2100, status: 'Vacant' },
        { id: 'W-02', floor: 'G', type: 'Bay', tenant: '—', rent: 2100, status: 'Vacant' },
        { id: 'W-03', floor: 'G', type: 'Bay', tenant: '—', rent: 2100, status: 'Vacant' },
        { id: 'W-04', floor: 'G', type: 'Bay', tenant: '—', rent: 2100, status: 'Vacant' },
        { id: 'W-05', floor: 'G', type: 'Bay', tenant: '—', rent: 2100, status: 'Vacant' },
      ],
      expensesList: [
        { id: 'EXP-4301', category: 'Security', supplier: 'SecureGuard UG', amount: 300, status: 'Paid' },
        { id: 'EXP-4290', category: 'Insurance', supplier: 'UAP Old Mutual', amount: 150, status: 'Approved' },
      ],
      arrearsList: [],
      maintenanceList: [],
      leasesExpiring: [],
    },
  ];

  function slugify(name) {
    return String(name || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  function getById(id) {
    if (!id) return null;
    const key = String(id).toLowerCase();
    return PROPERTIES.find((p) => p.id === key || p.code.toLowerCase() === key || slugify(p.name) === key) || null;
  }

  function hrefFor(propertyOrId) {
    const id = typeof propertyOrId === 'string' ? propertyOrId : propertyOrId?.id;
    return `property.html?id=${encodeURIComponent(id || '')}`;
  }


  const GALLERY_POOL = {
    residential: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3be61?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop',
    ],
    commercial: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop&sat=-20',
      'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=1200&h=800&fit=crop',
    ],
  };

  const EXTRA = [
    { id: 'muyenga-terraces', code: 'PRP-007', name: 'Muyenga Terraces', location: 'Muyenga, Kampala', type: 'Residential', status: 'Active', buildings: 1, floors: 4, unitCount: 16, occupied: 14, vacant: 2, maintenance: 0, occupancy: 88, collectionRate: 91, expectedRent: 9800, collected: 8900, arrears: 900, expenses: 2500, net: 6400, vat: 420, wht: 90, avgRent: 610, manager: 'Grace Achieng', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop' },
    { id: 'acacia-mall-annex', code: 'PRP-008', name: 'Acacia Mall Annex', location: 'Kisementi, Kampala', type: 'Commercial', status: 'Active', buildings: 1, floors: 3, unitCount: 12, occupied: 11, vacant: 1, maintenance: 0, occupancy: 92, collectionRate: 87, expectedRent: 14800, collected: 12900, arrears: 1900, expenses: 3800, net: 9100, vat: 980, wht: 160, avgRent: 1230, manager: 'Peter Ssebunya', image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&h=800&fit=crop' },
    { id: 'namugongo-court', code: 'PRP-009', name: 'Namugongo Court', location: 'Namugongo, Kampala', type: 'Residential', status: 'Active', buildings: 2, floors: 5, unitCount: 20, occupied: 17, vacant: 2, maintenance: 1, occupancy: 85, collectionRate: 84, expectedRent: 7200, collected: 6050, arrears: 1150, expenses: 1750, net: 4300, vat: 310, wht: 70, avgRent: 360, manager: 'Alex Okello', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop' },
    { id: 'port-bell-yards', code: 'PRP-010', name: 'Port Bell Yards', location: 'Luzira, Kampala', type: 'Commercial', status: 'Under maintenance', buildings: 2, floors: 1, unitCount: 8, occupied: 5, vacant: 1, maintenance: 2, occupancy: 63, collectionRate: 72, expectedRent: 6400, collected: 4600, arrears: 1800, expenses: 2500, net: 2100, vat: 420, wht: 80, avgRent: 800, manager: 'Denis Wanyama', image: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1200&h=800&fit=crop' },
    { id: 'makerere-suites', code: 'PRP-011', name: 'Makerere Suites', location: 'Wandegeya, Kampala', type: 'Residential', status: 'Active', buildings: 1, floors: 8, unitCount: 30, occupied: 27, vacant: 3, maintenance: 0, occupancy: 90, collectionRate: 89, expectedRent: 11200, collected: 9970, arrears: 1230, expenses: 2370, net: 7600, vat: 480, wht: 95, avgRent: 373, manager: 'Joan Kizza', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop' },
    { id: 'kira-road-offices', code: 'PRP-012', name: 'Kira Road Offices', location: 'Kira Rd, Kampala', type: 'Commercial', status: 'Active', buildings: 1, floors: 6, unitCount: 14, occupied: 13, vacant: 1, maintenance: 0, occupancy: 93, collectionRate: 90, expectedRent: 15600, collected: 14040, arrears: 1560, expenses: 3840, net: 10200, vat: 1120, wht: 210, avgRent: 1114, manager: 'Peter Ssebunya', image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&h=800&fit=crop' },
    { id: 'bbunga-villas', code: 'PRP-013', name: 'Bbunga Villas', location: 'Bbunga, Kampala', type: 'Residential', status: 'Inactive', buildings: 1, floors: 2, unitCount: 10, occupied: 0, vacant: 10, maintenance: 0, occupancy: 0, collectionRate: 0, expectedRent: 0, collected: 0, arrears: 0, expenses: 400, net: -400, vat: 0, wht: 0, avgRent: 900, manager: 'Alex Okello', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop' },
    { id: 'kawuku-studios', code: 'PRP-014', name: 'Kawuku Studios', location: 'Kawuku, Kampala', type: 'Residential', status: 'Active', buildings: 1, floors: 3, unitCount: 22, occupied: 18, vacant: 4, maintenance: 0, occupancy: 82, collectionRate: 86, expectedRent: 5400, collected: 4640, arrears: 760, expenses: 840, net: 3800, vat: 220, wht: 45, avgRent: 245, manager: 'Grace Achieng', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&h=800&fit=crop' },
    { id: 'industrial-shed-c', code: 'PRP-015', name: 'Industrial Shed C', location: 'Namanve, Mukono', type: 'Commercial', status: 'Active', buildings: 1, floors: 1, unitCount: 5, occupied: 4, vacant: 1, maintenance: 0, occupancy: 80, collectionRate: 88, expectedRent: 9800, collected: 8620, arrears: 1180, expenses: 2220, net: 6400, vat: 740, wht: 140, avgRent: 1960, manager: 'Denis Wanyama', image: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=1200&h=800&fit=crop' },
    { id: 'naalya-heights', code: 'PRP-016', name: 'Naalya Heights', location: 'Naalya, Kampala', type: 'Residential', status: 'Active', buildings: 2, floors: 10, unitCount: 26, occupied: 24, vacant: 1, maintenance: 1, occupancy: 92, collectionRate: 93, expectedRent: 12800, collected: 11900, arrears: 900, expenses: 3200, net: 8700, vat: 560, wht: 110, avgRent: 492, manager: 'Alex Okello', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&h=800&fit=crop' },
    { id: 'garden-city-retail', code: 'PRP-017', name: 'Garden City Retail', location: 'Yusuf Lule Rd, Kampala', type: 'Commercial', status: 'Active', buildings: 1, floors: 2, unitCount: 9, occupied: 8, vacant: 1, maintenance: 0, occupancy: 89, collectionRate: 91, expectedRent: 17200, collected: 15650, arrears: 1550, expenses: 4450, net: 11200, vat: 1380, wht: 260, avgRent: 1911, manager: 'Peter Ssebunya', image: 'https://images.unsplash.com/photo-1567449303078-57ad995bd17a?w=1200&h=800&fit=crop' },
    { id: 'lubowa-park-homes', code: 'PRP-018', name: 'Lubowa Park Homes', location: 'Lubowa, Kampala', type: 'Residential', status: 'Under maintenance', buildings: 1, floors: 3, unitCount: 18, occupied: 12, vacant: 3, maintenance: 3, occupancy: 67, collectionRate: 74, expectedRent: 8600, collected: 6360, arrears: 2240, expenses: 3460, net: 2900, vat: 340, wht: 70, avgRent: 478, manager: 'Joan Kizza', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&h=800&fit=crop' },
    { id: 'jinja-road-hub', code: 'PRP-019', name: 'Jinja Road Hub', location: 'Jinja Rd, Kampala', type: 'Commercial', status: 'Active', buildings: 1, floors: 4, unitCount: 11, occupied: 10, vacant: 1, maintenance: 0, occupancy: 91, collectionRate: 85, expectedRent: 12100, collected: 10285, arrears: 1815, expenses: 3085, net: 7200, vat: 860, wht: 155, avgRent: 1100, manager: 'Denis Wanyama', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop&q=80' },
    { id: 'nsambya-flats', code: 'PRP-020', name: 'Nsambya Flats', location: 'Nsambya, Kampala', type: 'Residential', status: 'Active', buildings: 2, floors: 6, unitCount: 28, occupied: 25, vacant: 3, maintenance: 0, occupancy: 89, collectionRate: 88, expectedRent: 8400, collected: 7390, arrears: 1010, expenses: 2290, net: 5100, vat: 360, wht: 75, avgRent: 300, manager: 'Grace Achieng', image: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1200&h=800&fit=crop' },
    { id: 'gaba-lakeside', code: 'PRP-021', name: 'Gaba Lakeside', location: 'Gaba, Kampala', type: 'Residential', status: 'Active', buildings: 1, floors: 3, unitCount: 14, occupied: 12, vacant: 2, maintenance: 0, occupancy: 86, collectionRate: 90, expectedRent: 7600, collected: 6840, arrears: 760, expenses: 2240, net: 4600, vat: 320, wht: 65, avgRent: 543, manager: 'Alex Okello', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop' },
    { id: 'mukono-depot', code: 'PRP-022', name: 'Mukono Depot', location: 'Mukono', type: 'Commercial', status: 'Inactive', buildings: 1, floors: 1, unitCount: 4, occupied: 0, vacant: 4, maintenance: 0, occupancy: 0, collectionRate: 0, expectedRent: 0, collected: 0, arrears: 0, expenses: 200, net: -200, vat: 0, wht: 0, avgRent: 1500, manager: 'Denis Wanyama', image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200&h=800&fit=crop' },
    { id: 'bukoto-towers', code: 'PRP-023', name: 'Bukoto Towers', location: 'Bukoto, Kampala', type: 'Residential', status: 'Active', buildings: 1, floors: 12, unitCount: 32, occupied: 30, vacant: 1, maintenance: 1, occupancy: 94, collectionRate: 95, expectedRent: 18600, collected: 17670, arrears: 930, expenses: 4270, net: 13400, vat: 820, wht: 150, avgRent: 581, manager: 'Alex Okello', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop&q=80' },
    { id: 'wandegeya-shops', code: 'PRP-024', name: 'Wandegeya Shops', location: 'Wandegeya, Kampala', type: 'Commercial', status: 'Active', buildings: 1, floors: 2, unitCount: 15, occupied: 13, vacant: 2, maintenance: 0, occupancy: 87, collectionRate: 83, expectedRent: 9800, collected: 8130, arrears: 1670, expenses: 2330, net: 5800, vat: 620, wht: 115, avgRent: 653, manager: 'Peter Ssebunya', image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba18a446?w=1200&h=800&fit=crop' },
  ];

  function monthSeries(base, variance) {
    const labels = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
    const expected = labels.map((_, i) => Math.round(base * (0.9 + i * 0.02)));
    const collected = expected.map((v, i) => Math.round(v * (0.78 + (i % 3) * 0.05 + (variance || 0))));
    const expenses = expected.map((v) => Math.round(v * (0.18 + (variance || 0) * 0.05)));
    const occupancy = labels.map((_, i) => Math.min(98, Math.round(70 + i * 3 + (variance || 0) * 40)));
    return { labels, expected, collected, expenses, occupancy };
  }

  function defaultLists(p) {
    return {
      unitMix: p.type === 'Commercial'
        ? [{ type: 'Shop', count: Math.max(2, Math.round(p.unitCount * 0.4)), rent: Math.round(p.avgRent * 0.9) }, { type: 'Office', count: Math.max(1, Math.round(p.unitCount * 0.45)), rent: Math.round(p.avgRent * 1.1) }, { type: 'Other', count: Math.max(1, p.unitCount - Math.round(p.unitCount * 0.85)), rent: p.avgRent }]
        : [{ type: 'Studio', count: Math.max(2, Math.round(p.unitCount * 0.2)), rent: Math.round(p.avgRent * 0.6) }, { type: '1 Bed', count: Math.max(2, Math.round(p.unitCount * 0.35)), rent: Math.round(p.avgRent * 0.85) }, { type: '2 Bed', count: Math.max(2, Math.round(p.unitCount * 0.3)), rent: p.avgRent }, { type: '3 Bed', count: Math.max(1, p.unitCount - Math.round(p.unitCount * 0.85)), rent: Math.round(p.avgRent * 1.35) }],
      units: [
        { id: 'U-01', floor: '1', type: p.type === 'Commercial' ? 'Shop' : '1 Bed', tenant: p.occupied ? 'Primary tenant' : '—', rent: p.avgRent, status: p.occupied ? 'Occupied' : 'Vacant' },
        { id: 'U-02', floor: '2', type: p.type === 'Commercial' ? 'Office' : '2 Bed', tenant: p.vacant ? '—' : 'Leaseholder', rent: Math.round(p.avgRent * 1.1), status: p.vacant ? 'Vacant' : 'Occupied' },
        { id: 'U-03', floor: 'G', type: p.type === 'Commercial' ? 'Bay' : 'Studio', tenant: p.maintenance ? '—' : 'Occupant', rent: Math.round(p.avgRent * 0.75), status: p.maintenance ? 'Under maintenance' : 'Occupied' },
      ],
      expensesList: [
        { id: 'EXP-' + p.code.slice(-3) + '1', category: 'Security', supplier: 'SecureGuard UG', amount: Math.round(p.expenses * 0.35), status: 'Paid' },
        { id: 'EXP-' + p.code.slice(-3) + '2', category: 'Utilities', supplier: 'UMEME / NWSC', amount: Math.round(p.expenses * 0.25), status: 'Paid' },
        { id: 'EXP-' + p.code.slice(-3) + '3', category: 'Repairs', supplier: 'BuildRight Contractors', amount: Math.round(p.expenses * 0.4), status: 'Approved' },
      ],
      arrearsList: p.arrears > 0 ? [{ tenant: 'Account holder', unit: 'U-01', days: 21, amount: Math.round(p.arrears * 0.55) }, { tenant: 'Second tenant', unit: 'U-02', days: 14, amount: Math.round(p.arrears * 0.45) }] : [],
      maintenanceList: p.maintenance > 0 ? [{ id: 'MNT-' + p.code.slice(-3), unit: 'U-03', issue: 'Scheduled works', priority: 'Medium', status: 'In progress' }] : [],
      leasesExpiring: p.occupied > 0 ? [{ tenant: 'Primary tenant', unit: 'U-01', expiry: '2027-03-31', rent: p.avgRent }] : [],
    };
  }

  EXTRA.forEach((row) => {
    if (PROPERTIES.some((p) => p.id === row.id)) return;
    const lists = defaultLists(row);
    PROPERTIES.push({
      ...row,
      months: monthSeries(row.expectedRent || row.avgRent * row.unitCount * 0.7, row.occupancy / 100),
      ...lists,
    });
  });

  function enrich(p, idx) {
    const pool = p.type === 'Commercial' ? GALLERY_POOL.commercial : GALLERY_POOL.residential;
    const cover = p.image || pool[idx % pool.length];
    const gallery = [cover, ...pool.filter((u) => u !== cover)].slice(0, 5);
    const noiMargin = p.collected ? Math.round((p.net / p.collected) * 100) : 0;
    const yieldPct = p.expectedRent ? Math.round((p.net / (p.expectedRent * 12)) * 1000) / 10 : 0;
    const utilPower = Math.round((p.unitCount || 1) * (12 + (idx % 7)) * 10) / 10;
    const utilWater = Math.round((p.unitCount || 1) * (0.35 + (idx % 5) * 0.08) * 100) / 100;
    const expenseBreakdown = [
      { label: 'Security', value: Math.round((p.expenses || 0) * 0.32) },
      { label: 'Utilities', value: Math.round((p.expenses || 0) * 0.28) },
      { label: 'Repairs', value: Math.round((p.expenses || 0) * 0.24) },
      { label: 'Other', value: Math.round((p.expenses || 0) * 0.16) },
    ];
    const insights = [
      p.collectionRate >= 90 ? 'Collections outperform portfolio average' : p.collectionRate < 80 ? 'Collections below target — chase arrears' : 'Collections within target band',
      p.occupancy >= 90 ? 'Strong occupancy supports NOI' : p.occupancy < 75 ? 'Vacancy drag on yield — prioritise leasing' : 'Occupancy stable month-on-month',
      p.arrears > p.collected * 0.15 ? 'Arrears concentration risk on this asset' : 'Arrears within policy threshold',
    ];
    Object.assign(p, {
      image: cover,
      gallery,
      yearBuilt: p.yearBuilt || 2008 + (idx % 14),
      areaSqm: p.areaSqm || (p.unitCount || 10) * (p.type === 'Commercial' ? 85 : 55),
      noiMargin,
      yieldPct,
      utilPower,
      utilWater,
      expenseBreakdown,
      insights,
      score: Math.round((p.occupancy * 0.35) + (p.collectionRate * 0.45) + (Math.max(0, noiMargin) * 0.2)),
    });
    return p;
  }

  PROPERTIES.forEach(enrich);


  window.PropertyERP = window.PropertyERP || {};
  window.PropertyERP.properties = PROPERTIES;
  window.PropertyERP.getProperty = getById;
  window.PropertyERP.propertyHref = hrefFor;
  window.PropertyERP.slugify = slugify;
})();
