(function () {
  // Uganda demo WhatsApp business line — replace with your real number
  const WA_NUMBER = '256700123456';
  const BOT_NAME = 'Property ERP Assistant';
  const BOOK_KEY = 'property_erp_bookings';
  const REMIND_KEY = 'property_erp_rent_reminders';
  const RATE = 3700;

  const FALLBACK_LISTINGS = [
    { property: 'Kololo Heights', location: 'Kololo, Kampala', unit: 'B-0208', type: 'Studio', rentUgx: 1550000 },
    { property: 'Ntinda Business Park', location: 'Ntinda, Kampala', unit: 'D-02', type: 'Shop', rentUgx: 3300000 },
    { property: 'Ntinda Business Park', location: 'Ntinda, Kampala', unit: 'C-18', type: 'Office', rentUgx: 4800000 },
    { property: 'Bugolobi Flats', location: 'Bugolobi, Kampala', unit: 'E-03', type: '2 Bed', rentUgx: 2800000 },
    { property: 'Nakasero Residences', location: 'Nakasero, Kampala', unit: 'N-12', type: '1 Bed', rentUgx: 2200000 },
  ];

  const FALLBACK_ARREARS = [
    { tenant: 'Nakato Holdings', property: 'Kololo Heights', unit: 'A-1204', days: 18, amountUgx: 850 * RATE, phone: '256700111001' },
    { tenant: 'Musoke Traders', property: 'Kololo Heights', unit: 'A-0506', days: 42, amountUgx: 1700 * RATE, phone: '256700111002' },
    { tenant: 'Lillian Asiimwe', property: 'Kololo Heights', unit: 'B-0912', days: 11, amountUgx: 620 * RATE, phone: '256700111003' },
    { tenant: 'Agaba Retail Ltd', property: 'Ntinda Business Park', unit: 'C-05', days: 27, amountUgx: 2400 * RATE, phone: '256700111004' },
    { tenant: 'Joan Kizza', property: 'Nakasero Residences', unit: 'N-0304', days: 33, amountUgx: 1360 * RATE, phone: '256700111005' },
  ];

  const SLOTS = ['Tomorrow 10:00 AM', 'Tomorrow 2:00 PM', 'Saturday 11:00 AM', 'Monday 9:00 AM'];

  const TONES = [
    { id: 'friendly', label: 'Friendly reminder' },
    { id: 'firm', label: 'Firm overdue notice' },
    { id: 'final', label: 'Final notice' },
  ];

  const state = {
    flow: null, // booking | reminder
    step: null,
    booking: blankBooking(),
    reminder: blankReminder(),
  };

  function blankBooking() {
    return { property: '', location: '', unit: '', type: '', rentUgx: 0, slot: '', name: '', phone: '' };
  }

  function blankReminder() {
    return { tenant: '', property: '', unit: '', days: 0, amountUgx: 0, phone: '', tone: 'friendly', message: '' };
  }

  function ugx(n) {
    try {
      return new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX', maximumFractionDigits: 0 }).format(n);
    } catch {
      return `UGX ${Number(n || 0).toLocaleString()}`;
    }
  }

  function props() {
    return window.PropertyERP?.properties || [];
  }

  function listings() {
    const list = props();
    if (!list.length) return FALLBACK_LISTINGS.slice();
    const out = [];
    list.forEach((p) => {
      (p.units || []).forEach((u) => {
        if (String(u.status || '').toLowerCase() !== 'vacant') return;
        out.push({
          property: p.name,
          location: p.location,
          unit: u.id,
          type: u.type || 'Unit',
          rentUgx: Math.round(Number(u.rent || p.avgRent || 0) * RATE),
        });
      });
    });
    return out.length ? out : FALLBACK_LISTINGS.slice();
  }

  function arrears() {
    const list = props();
    if (!list.length) return FALLBACK_ARREARS.slice();
    const out = [];
    list.forEach((p) => {
      (p.arrearsList || []).forEach((a, i) => {
        out.push({
          tenant: a.tenant,
          property: p.name,
          unit: a.unit,
          days: a.days,
          amountUgx: Math.round(Number(a.amount || 0) * RATE),
          phone: `25670011${String(1000 + out.length + i).slice(-4)}`,
        });
      });
    });
    return out.length ? out : FALLBACK_ARREARS.slice();
  }

  function uniqueProperties() {
    const map = new Map();
    listings().forEach((l) => {
      if (!map.has(l.property)) map.set(l.property, l);
    });
    return [...map.values()];
  }

  function unitsFor(property) {
    return listings().filter((l) => l.property === property);
  }

  function hi(name, cls) {
    return `<i class="hgi-stroke hgi-${name}${cls ? ` ${cls}` : ''}" aria-hidden="true"></i>`;
  }

  function waLink(text, phone) {
    const to = (phone || WA_NUMBER).replace(/\D/g, '');
    return `https://wa.me/${to}?text=${encodeURIComponent(text)}`;
  }

  function saveLocal(key, row) {
    try {
      const prev = JSON.parse(localStorage.getItem(key) || '[]');
      prev.unshift(row);
      localStorage.setItem(key, JSON.stringify(prev.slice(0, 40)));
    } catch {
      /* ignore */
    }
  }

  function bookingMessage(b) {
    return [
      'Property ERP booking request',
      '',
      `Property: ${b.property}`,
      `Location: ${b.location}`,
      `Unit: ${b.unit} (${b.type})`,
      `Rent: ${ugx(b.rentUgx)} / month`,
      `Preferred slot: ${b.slot}`,
      `Name: ${b.name}`,
      `Phone: ${b.phone}`,
      '',
      'Please confirm this viewing / booking. UGX primary.',
    ].join('\n');
  }

  function draftRentReminder(r) {
    const due = ugx(r.amountUgx);
    if (r.tone === 'final') {
      return [
        `Dear ${r.tenant},`,
        '',
        `FINAL NOTICE: rent for ${r.property} · Unit ${r.unit} is ${r.days} days overdue.`,
        `Outstanding balance: ${due}.`,
        '',
        'Please settle within 48 hours via Mobile Money or bank transfer to avoid lease escalation.',
        'Reply to this WhatsApp with your payment confirmation / transaction ID.',
        '',
        '— Property ERP Collections (Uganda)',
      ].join('\n');
    }
    if (r.tone === 'firm') {
      return [
        `Hello ${r.tenant},`,
        '',
        `This is a rent overdue notice for ${r.property} · Unit ${r.unit}.`,
        `Amount due: ${due} (${r.days} days overdue).`,
        '',
        'Kindly clear the balance this week. You can pay via MTN/Airtel Money and reply with the reference.',
        '',
        '— Property ERP Rent Desk',
      ].join('\n');
    }
    return [
      `Hi ${r.tenant},`,
      '',
      `Friendly reminder that rent for ${r.property} · Unit ${r.unit} is outstanding.`,
      `Balance: ${due} · ${r.days} days overdue.`,
      '',
      'Please let us know if you need a payment plan. You can reply here on WhatsApp.',
      '',
      'Thank you — Property ERP',
    ].join('\n');
  }

  function setHandoff(text, phone) {
    const handoff = document.getElementById('wa-handoff');
    if (handoff) handoff.href = waLink(text, phone);
  }

  function setChips(items) {
    const quick = document.getElementById('wa-quick');
    if (!quick) return;
    quick.innerHTML = '';
    items.forEach((item) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'wa-chip';
      btn.textContent = item.label;
      btn.addEventListener('click', () => {
        if (item.action) item.action();
        else handleUser(item.label, item);
      });
      quick.appendChild(btn);
    });
  }

  function goHome(msg) {
    state.flow = null;
    state.step = null;
    state.booking = blankBooking();
    state.reminder = blankReminder();
    if (msg) pushBot(msg);
    homeChips();
    const input = document.getElementById('wa-input');
    if (input) input.placeholder = 'Book a viewing, send rent reminder…';
  }

  function homeChips() {
    setChips([
      { label: 'Book a viewing', action: () => startBooking() },
      { label: 'Rent reminder', action: () => startReminder() },
      { label: 'Available units', action: () => showVacancies() },
      { label: 'Check rent balance', action: () => showBalances() },
      { label: 'Report maintenance', reply: 'Describe the issue and unit. I can open WhatsApp so our team picks it up.', openWa: true },
      { label: 'Talk to an agent', reply: 'Connecting you to our Kampala property desk on WhatsApp…', openWa: true },
    ]);
  }

  function ensureUi() {
    if (document.getElementById('wa-bot-root')) return;
    const root = document.createElement('div');
    root.id = 'wa-bot-root';
    root.innerHTML = `
      <button type="button" id="wa-fab" class="wa-fab" aria-label="Open WhatsApp assistant">
        ${hi('whatsapp', 'text-[26px]')}
      </button>
      <div id="wa-panel" class="wa-panel" hidden>
        <div class="wa-panel-head">
          <div class="flex items-center gap-2.5">
            <span class="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white">${hi('whatsapp', 'text-[18px]')}</span>
            <div>
              <p class="text-sm font-semibold text-white">${BOT_NAME}</p>
              <p class="text-[11px] text-white/80">Bookings · Rent reminders · Uganda</p>
            </div>
          </div>
          <button type="button" id="wa-close" class="rounded-full p-1.5 text-white/90 hover:bg-white/10" aria-label="Close chat">${hi('cancel-01', 'text-[16px]')}</button>
        </div>
        <div id="wa-messages" class="wa-messages"></div>
        <div class="wa-quick" id="wa-quick"></div>
        <form id="wa-form" class="wa-form">
          <input id="wa-input" type="text" placeholder="Book a viewing, send rent reminder…" autocomplete="off" />
          <button type="submit" aria-label="Send">${hi('sent', 'text-[16px]')}</button>
        </form>
        <a id="wa-handoff" class="wa-handoff" href="${waLink('Hello Property ERP, I need help with rent or a booking.')}" target="_blank" rel="noopener">
          ${hi('whatsapp', 'text-[14px]')} Continue on WhatsApp
        </a>
      </div>`;
    document.body.appendChild(root);

    homeChips();
    document.getElementById('wa-fab').addEventListener('click', toggle);
    document.getElementById('wa-close').addEventListener('click', close);
    document.getElementById('wa-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('wa-input');
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      handleUser(text);
    });

    pushBot('Hi — I can book viewings, send rent reminders on WhatsApp, show vacant units, or check balances. Tap Rent reminder or Book a viewing.');
  }

  function toggle() {
    const panel = document.getElementById('wa-panel');
    const fab = document.getElementById('wa-fab');
    const open = panel.hasAttribute('hidden');
    if (open) {
      panel.removeAttribute('hidden');
      fab.classList.add('is-open');
    } else {
      close();
    }
  }

  function close() {
    document.getElementById('wa-panel')?.setAttribute('hidden', '');
    document.getElementById('wa-fab')?.classList.remove('is-open');
  }

  function push(role, text) {
    const box = document.getElementById('wa-messages');
    if (!box) return;
    const el = document.createElement('div');
    el.className = `wa-bubble wa-${role}`;
    el.textContent = text;
    box.appendChild(el);
    box.scrollTop = box.scrollHeight;
  }

  function pushBot(text) {
    push('bot', text);
  }

  function pushUser(text) {
    push('user', text);
  }

  /* ---------- Bookings ---------- */

  function startBooking(prefillProperty) {
    state.flow = 'booking';
    state.step = 'property';
    state.booking = blankBooking();
    pushUser('Book a viewing');
    if (prefillProperty) {
      pickProperty(prefillProperty);
      return;
    }
    pushBot('Great — let’s book a viewing. Which property are you interested in?');
    setChips([
      ...uniqueProperties().map((p) => ({
        label: p.property,
        action: () => {
          pushUser(p.property);
          pickProperty(p.property);
        },
      })),
      { label: 'Cancel', action: () => goHome('Cancelled. How else can I help?') },
    ]);
  }

  function pickProperty(name) {
    const match = uniqueProperties().find((p) => p.property.toLowerCase() === name.toLowerCase())
      || listings().find((p) => p.property.toLowerCase().includes(name.toLowerCase()));
    if (!match) {
      pushBot('I couldn’t match that property. Pick one below.');
      setChips(uniqueProperties().map((p) => ({
        label: p.property,
        action: () => {
          pushUser(p.property);
          pickProperty(p.property);
        },
      })));
      state.step = 'property';
      return;
    }
    state.booking.property = match.property;
    state.booking.location = match.location;
    state.step = 'unit';
    const units = unitsFor(match.property);
    pushBot(`${match.property} · ${match.location}. Which vacant unit should we book?`);
    setChips([
      ...units.map((u) => ({
        label: `${u.unit} · ${u.type} · ${ugx(u.rentUgx)}`,
        action: () => {
          pushUser(`${u.unit} · ${u.type}`);
          pickUnit(u);
        },
      })),
      { label: 'Back', action: () => startBooking() },
    ]);
  }

  function pickUnit(unit) {
    state.flow = 'booking';
    state.booking.unit = unit.unit;
    state.booking.type = unit.type;
    state.booking.rentUgx = unit.rentUgx;
    state.booking.property = unit.property;
    state.booking.location = unit.location;
    state.step = 'slot';
    pushBot(`Unit ${unit.unit} (${unit.type}) at ${ugx(unit.rentUgx)}/mo. Pick a preferred viewing time:`);
    setChips([
      ...SLOTS.map((slot) => ({
        label: slot,
        action: () => {
          pushUser(slot);
          pickSlot(slot);
        },
      })),
      { label: 'Back', action: () => pickProperty(state.booking.property) },
    ]);
  }

  function pickSlot(slot) {
    state.booking.slot = slot;
    state.step = 'contact';
    pushBot('Almost done. Reply with your full name and phone (e.g. Amina Nalwoga 0700123456).');
    setChips([
      {
        label: 'Use sample contact',
        action: () => {
          pushUser('Amina Nalwoga 0700123456');
          finishContact('Amina Nalwoga 0700123456');
        },
      },
      { label: 'Cancel', action: () => goHome('Booking cancelled.') },
    ]);
    const input = document.getElementById('wa-input');
    if (input) {
      input.placeholder = 'Name and phone…';
      input.focus();
    }
  }

  function parseContact(text) {
    const phoneMatch = text.match(/(?:\+?256|0)\d{9}\b/);
    const phone = phoneMatch ? phoneMatch[0] : '';
    const name = text.replace(phone, '').replace(/[,|]/g, ' ').replace(/\s+/g, ' ').trim();
    return { name: name || 'Guest', phone: phone || 'Not provided' };
  }

  function finishContact(text) {
    const { name, phone } = parseContact(text);
    state.booking.name = name;
    state.booking.phone = phone;
    state.step = 'done';
    const id = `BK-${Date.now().toString(36).toUpperCase()}`;
    saveLocal(BOOK_KEY, { ...state.booking, id, createdAt: new Date().toISOString() });
    pushBot([
      'Booking saved ✅',
      `${state.booking.property} · Unit ${state.booking.unit}`,
      `${state.booking.type} · ${ugx(state.booking.rentUgx)}/mo`,
      `When: ${state.booking.slot}`,
      `Who: ${state.booking.name} · ${state.booking.phone}`,
      '',
      'Opening WhatsApp so our team can confirm.',
    ].join('\n'));
    const msg = bookingMessage(state.booking);
    setHandoff(msg);
    setChips([
      { label: 'Confirm on WhatsApp', action: () => window.open(waLink(msg), '_blank', 'noopener') },
      { label: 'Book another', action: () => startBooking() },
      { label: 'Main menu', action: () => goHome('Back to the main menu.') },
    ]);
    setTimeout(() => window.open(waLink(msg), '_blank', 'noopener'), 700);
  }

  /* ---------- Rent reminders ---------- */

  function startReminder() {
    state.flow = 'reminder';
    state.step = 'rem-tenant';
    state.reminder = blankReminder();
    pushUser('Rent reminder');
    const list = arrears().slice(0, 8);
    const lines = list.map((a) => `• ${a.tenant} · ${a.unit} · ${ugx(a.amountUgx)} · ${a.days}d`).join('\n');
    pushBot(`Who should get a rent reminder?\n${lines}`);
    setChips([
      ...list.map((a) => ({
        label: `${a.tenant.split(' ')[0]} · ${a.unit}`,
        action: () => {
          pushUser(`${a.tenant} · ${a.unit}`);
          pickReminderTenant(a);
        },
      })),
      { label: 'Cancel', action: () => goHome('Cancelled.') },
    ]);
  }

  function pickReminderTenant(row) {
    state.flow = 'reminder';
    state.reminder = { ...blankReminder(), ...row };
    state.step = 'rem-tone';
    pushBot(
      `${row.tenant} owes ${ugx(row.amountUgx)} on ${row.property} · ${row.unit} (${row.days} days overdue).\nPick the reminder tone:`,
    );
    setChips([
      ...TONES.map((t) => ({
        label: t.label,
        action: () => {
          pushUser(t.label);
          pickTone(t.id);
        },
      })),
      { label: 'Back', action: () => startReminder() },
    ]);
  }

  function pickTone(toneId) {
    state.reminder.tone = toneId;
    state.reminder.message = draftRentReminder(state.reminder);
    state.step = 'rem-preview';
    pushBot(`Preview ready:\n\n${state.reminder.message}`);
    setHandoff(state.reminder.message, state.reminder.phone);
    setChips([
      {
        label: 'Send on WhatsApp',
        action: () => sendReminder(),
      },
      {
        label: 'Change tone',
        action: () => pickReminderTenant(state.reminder),
      },
      {
        label: 'Remind another',
        action: () => startReminder(),
      },
      { label: 'Main menu', action: () => goHome('Back to the main menu.') },
    ]);
  }

  function sendReminder() {
    const msg = state.reminder.message || draftRentReminder(state.reminder);
    const id = `RR-${Date.now().toString(36).toUpperCase()}`;
    saveLocal(REMIND_KEY, {
      ...state.reminder,
      id,
      message: msg,
      sentAt: new Date().toISOString(),
    });
    pushBot(`Reminder queued for ${state.reminder.tenant}. Opening WhatsApp…`);
    setHandoff(msg, state.reminder.phone);
    window.open(waLink(msg, state.reminder.phone), '_blank', 'noopener');
    setChips([
      { label: 'Send again', action: () => window.open(waLink(msg, state.reminder.phone), '_blank', 'noopener') },
      { label: 'Remind another', action: () => startReminder() },
      { label: 'Book a viewing', action: () => startBooking() },
      { label: 'Main menu', action: () => goHome('Back to the main menu.') },
    ]);
    state.step = 'rem-done';
  }

  function showBalances() {
    pushUser('Check rent balance');
    const list = arrears().slice(0, 6);
    const lines = list.map((a) => `• ${a.tenant} · ${a.property} ${a.unit} · ${ugx(a.amountUgx)} (${a.days}d)`).join('\n');
    pushBot(`Open balances (UGX):\n${lines}\n\nTap a tenant to draft a WhatsApp rent reminder.`);
    setChips([
      ...list.map((a) => ({
        label: `${a.tenant.split(' ')[0]} · ${ugx(a.amountUgx)}`,
        action: () => {
          pushUser(a.tenant);
          pickReminderTenant(a);
        },
      })),
      { label: 'Rent reminder', action: () => startReminder() },
      { label: 'Main menu', action: () => goHome() },
    ]);
  }

  function showVacancies() {
    pushUser('Available units');
    const list = listings().slice(0, 6);
    const lines = list.map((l) => `• ${l.property} · ${l.unit} (${l.type}) · ${ugx(l.rentUgx)}`).join('\n');
    pushBot(`Vacant units ready to book:\n${lines}`);
    setChips([
      ...list.map((u) => ({
        label: `${u.unit} · ${u.property}`,
        action: () => {
          pushUser(`${u.unit} · ${u.property}`);
          pickUnit(u);
        },
      })),
      { label: 'Book a viewing', action: () => startBooking() },
    ]);
  }

  function inferReply(text) {
    const q = text.toLowerCase();
    if (/\b(remind|reminder|arrear|overdue|collection)\b/.test(q) || (q.includes('rent') && q.includes('send'))) {
      return { kind: 'reminder' };
    }
    if (/\b(book|booking|viewing|tour|reserve|schedule)\b/.test(q)) {
      return { kind: 'book' };
    }
    if (q.includes('vacan') || q.includes('available') || q.includes('units for rent')) {
      return { kind: 'vacancy' };
    }
    if (q.includes('balance') || q.includes('invoice') || (q.includes('rent') && !q.includes('remind'))) {
      return { kind: 'balance' };
    }
    if (q.includes('maint') || q.includes('repair') || q.includes('leak') || q.includes('broken')) {
      return { reply: 'Describe the issue and unit. I can open WhatsApp so our team picks it up.', openWa: true };
    }
    if (q.includes('agent') || q.includes('human') || q.includes('call')) {
      return { reply: 'Connecting you to our Kampala property desk on WhatsApp…', openWa: true };
    }
    const tenantHit = arrears().find((a) => q.includes(a.tenant.toLowerCase().split(' ')[0]) || q.includes(String(a.unit).toLowerCase()));
    if (tenantHit) return { kind: 'reminder-tenant', row: tenantHit };
    const prop = uniqueProperties().find((p) => q.includes(p.property.toLowerCase().split(' ')[0]));
    if (prop) return { kind: 'book-property', property: prop.property };
    return {
      reply: 'I can send rent reminders, book viewings, show vacant units or check balances. Tap Rent reminder to start.',
    };
  }

  function handleUser(text, preset) {
    if (state.flow === 'booking' && state.step === 'contact') {
      pushUser(text);
      finishContact(text);
      return;
    }
    if (state.flow === 'booking' && state.step === 'property') {
      pushUser(text);
      pickProperty(text);
      return;
    }
    if (state.flow === 'booking' && state.step === 'unit') {
      pushUser(text);
      const units = unitsFor(state.booking.property);
      const hit = units.find((u) => text.toLowerCase().includes(u.unit.toLowerCase()) || text.toLowerCase().includes(u.type.toLowerCase()));
      if (hit) pickUnit(hit);
      else pushBot('Pick a vacant unit from the chips below.');
      return;
    }
    if (state.flow === 'booking' && state.step === 'slot') {
      pushUser(text);
      const hit = SLOTS.find((s) => text.toLowerCase().includes(s.toLowerCase().split(' ')[0]) || s.toLowerCase() === text.toLowerCase());
      pickSlot(hit || text);
      return;
    }
    if (state.flow === 'reminder' && state.step === 'rem-tenant') {
      pushUser(text);
      const hit = arrears().find((a) => text.toLowerCase().includes(a.tenant.toLowerCase()) || text.toLowerCase().includes(String(a.unit).toLowerCase()));
      if (hit) pickReminderTenant(hit);
      else pushBot('Pick a tenant from the chips below.');
      return;
    }
    if (state.flow === 'reminder' && state.step === 'rem-tone') {
      pushUser(text);
      const q = text.toLowerCase();
      const tone = q.includes('final') ? 'final' : q.includes('firm') || q.includes('overdue') ? 'firm' : 'friendly';
      pickTone(tone);
      return;
    }

    if (preset?.action) {
      preset.action();
      return;
    }

    pushUser(text);
    const item = preset || inferReply(text);

    if (item.kind === 'reminder') {
      setTimeout(() => startReminder(), 200);
      return;
    }
    if (item.kind === 'reminder-tenant') {
      setTimeout(() => pickReminderTenant(item.row), 200);
      return;
    }
    if (item.kind === 'book') {
      setTimeout(() => startBooking(), 200);
      return;
    }
    if (item.kind === 'vacancy') {
      setTimeout(() => showVacancies(), 200);
      return;
    }
    if (item.kind === 'balance') {
      setTimeout(() => showBalances(), 200);
      return;
    }
    if (item.kind === 'book-property') {
      setTimeout(() => startBooking(item.property), 200);
      return;
    }

    setTimeout(() => {
      pushBot(item.reply);
      const msg = `Property ERP enquiry:\n${text}\n\nPlease assist (UGX primary).`;
      setHandoff(msg);
      if (item.openWa) setTimeout(() => window.open(waLink(msg), '_blank', 'noopener'), 600);
      homeChips();
    }, 350);
  }

  function init() {
    ensureUi();
  }

  window.PropertyERPWhatsApp = { init, WA_NUMBER, startBooking, startReminder };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
