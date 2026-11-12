(function () {
  // Uganda demo WhatsApp business line — replace with your real number
  const WA_NUMBER = '256700123456';
  const BOT_NAME = 'Property ERP Assistant';
  const BOOK_KEY = 'property_erp_bookings';

  const FALLBACK_LISTINGS = [
    { property: 'Kololo Heights', location: 'Kololo, Kampala', unit: 'B-0208', type: 'Studio', rentUgx: 1550000 },
    { property: 'Ntinda Business Park', location: 'Ntinda, Kampala', unit: 'D-02', type: 'Shop', rentUgx: 3300000 },
    { property: 'Ntinda Business Park', location: 'Ntinda, Kampala', unit: 'C-18', type: 'Office', rentUgx: 4800000 },
    { property: 'Bugolobi Flats', location: 'Bugolobi, Kampala', unit: 'E-03', type: '2 Bed', rentUgx: 2800000 },
    { property: 'Nakasero Residences', location: 'Nakasero, Kampala', unit: 'N-12', type: '1 Bed', rentUgx: 2200000 },
  ];

  const SLOTS = ['Tomorrow 10:00 AM', 'Tomorrow 2:00 PM', 'Saturday 11:00 AM', 'Monday 9:00 AM'];

  const state = {
    step: null, // property | unit | slot | contact | done
    booking: {
      property: '',
      location: '',
      unit: '',
      type: '',
      rentUgx: 0,
      slot: '',
      name: '',
      phone: '',
    },
  };

  function ugx(n) {
    try {
      return new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX', maximumFractionDigits: 0 }).format(n);
    } catch {
      return `UGX ${Number(n || 0).toLocaleString()}`;
    }
  }

  function listings() {
    const props = window.PropertyERP?.properties || window.PROPERTIES || null;
    if (!Array.isArray(props) || !props.length) return FALLBACK_LISTINGS.slice();

    const out = [];
    props.forEach((p) => {
      (p.units || []).forEach((u) => {
        if (String(u.status || '').toLowerCase() !== 'vacant') return;
        const rentUsd = Number(u.rent || p.avgRent || 0);
        out.push({
          property: p.name,
          location: p.location,
          unit: u.id,
          type: u.type || 'Unit',
          rentUgx: Math.round(rentUsd * 3700),
        });
      });
    });
    return out.length ? out : FALLBACK_LISTINGS.slice();
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

  function waLink(text) {
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
  }

  function saveBooking(booking) {
    try {
      const prev = JSON.parse(localStorage.getItem(BOOK_KEY) || '[]');
      prev.unshift({ ...booking, id: `BK-${Date.now().toString(36).toUpperCase()}`, createdAt: new Date().toISOString() });
      localStorage.setItem(BOOK_KEY, JSON.stringify(prev.slice(0, 40)));
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

  function setHandoff(text) {
    const handoff = document.getElementById('wa-handoff');
    if (handoff) handoff.href = waLink(text);
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

  function homeChips() {
    setChips([
      { id: 'book', label: 'Book a viewing', action: () => startBooking() },
      { id: 'vacancy', label: 'Available units', action: () => showVacancies() },
      { id: 'rent', label: 'Check rent balance', reply: 'Share the tenant name or unit (e.g. Kololo · A-1204) and I’ll help with the UGX balance.' },
      { id: 'maintenance', label: 'Report maintenance', reply: 'Describe the issue and unit. I can open WhatsApp so our team picks it up.', openWa: true },
      { id: 'agent', label: 'Talk to an agent', reply: 'Connecting you to our Kampala property desk on WhatsApp…', openWa: true },
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
              <p class="text-[11px] text-white/80">Bookings · Rent · Uganda</p>
            </div>
          </div>
          <button type="button" id="wa-close" class="rounded-full p-1.5 text-white/90 hover:bg-white/10" aria-label="Close chat">${hi('cancel-01', 'text-[16px]')}</button>
        </div>
        <div id="wa-messages" class="wa-messages"></div>
        <div class="wa-quick" id="wa-quick"></div>
        <form id="wa-form" class="wa-form">
          <input id="wa-input" type="text" placeholder="Book a viewing, ask about units…" autocomplete="off" />
          <button type="submit" aria-label="Send">${hi('sent', 'text-[16px]')}</button>
        </form>
        <a id="wa-handoff" class="wa-handoff" href="${waLink('Hello Property ERP, I want to book a property viewing.')}" target="_blank" rel="noopener">
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

    pushBot('Hi — I can help you book a viewing, check vacant units, rent balances or maintenance. Tap Book a viewing to start.');
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

  function resetBooking() {
    state.step = null;
    state.booking = { property: '', location: '', unit: '', type: '', rentUgx: 0, slot: '', name: '', phone: '' };
  }

  function startBooking(prefillProperty) {
    resetBooking();
    state.step = 'property';
    pushUser('Book a viewing');
    if (prefillProperty) {
      pickProperty(prefillProperty);
      return;
    }
    const props = uniqueProperties();
    pushBot('Great — let’s book a viewing. Which property are you interested in?');
    setChips([
      ...props.map((p) => ({
        label: p.property,
        action: () => {
          pushUser(p.property);
          pickProperty(p.property);
        },
      })),
      { label: 'Cancel booking', action: () => cancelBooking() },
    ]);
  }

  function cancelBooking() {
    pushUser('Cancel booking');
    resetBooking();
    pushBot('Booking cancelled. You can start again anytime.');
    homeChips();
  }

  function pickProperty(name) {
    const match = uniqueProperties().find((p) => p.property.toLowerCase() === name.toLowerCase())
      || listings().find((p) => p.property.toLowerCase().includes(name.toLowerCase()));
    if (!match) {
      pushBot('I couldn’t match that property. Pick one of the options below.');
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
      { label: 'Cancel booking', action: () => cancelBooking() },
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
    saveBooking(state.booking);
    const summary = [
      'Booking saved locally ✅',
      '',
      `${state.booking.property} · Unit ${state.booking.unit}`,
      `${state.booking.type} · ${ugx(state.booking.rentUgx)}/mo`,
      `When: ${state.booking.slot}`,
      `Who: ${state.booking.name} · ${state.booking.phone}`,
      '',
      'I’ll open WhatsApp so our team can confirm.',
    ].join('\n');
    pushBot(summary);
    const msg = bookingMessage(state.booking);
    setHandoff(msg);
    setChips([
      {
        label: 'Confirm on WhatsApp',
        action: () => window.open(waLink(msg), '_blank', 'noopener'),
      },
      {
        label: 'Book another',
        action: () => startBooking(),
      },
      {
        label: 'Main menu',
        action: () => {
          resetBooking();
          pushBot('Back to the main menu. How can I help?');
          homeChips();
          const input = document.getElementById('wa-input');
          if (input) input.placeholder = 'Book a viewing, ask about units…';
        },
      },
    ]);
    setTimeout(() => window.open(waLink(msg), '_blank', 'noopener'), 700);
  }

  function showVacancies() {
    pushUser('Available units');
    const list = listings().slice(0, 6);
    const lines = list.map((l) => `• ${l.property} · ${l.unit} (${l.type}) · ${ugx(l.rentUgx)}`).join('\n');
    pushBot(`Vacant units ready to book:\n${lines}\n\nTap a unit to start a booking.`);
    setChips([
      ...list.map((u) => ({
        label: `${u.unit} · ${u.property}`,
        action: () => {
          pushUser(`${u.unit} · ${u.property}`);
          resetBooking();
          pickUnit(u);
        },
      })),
      { label: 'Book a viewing', action: () => startBooking() },
    ]);
  }

  function inferReply(text) {
    const q = text.toLowerCase();
    if (/\b(book|booking|viewing|tour|reserve|schedule)\b/.test(q)) {
      return { kind: 'book' };
    }
    if (q.includes('vacan') || q.includes('available') || q.includes('units for rent')) {
      return { kind: 'vacancy' };
    }
    if (q.includes('rent') || q.includes('invoice') || q.includes('balance')) {
      return { id: 'rent', reply: 'Share the tenant name or unit (e.g. Kololo · A-1204) and I’ll help with the UGX balance.' };
    }
    if (q.includes('maint') || q.includes('repair') || q.includes('leak') || q.includes('broken')) {
      return { id: 'maintenance', reply: 'Describe the issue and unit. I can open WhatsApp so our team picks it up.', openWa: true };
    }
    if (q.includes('agent') || q.includes('human') || q.includes('call')) {
      return { id: 'agent', reply: 'Connecting you to our Kampala property desk on WhatsApp…', openWa: true };
    }
    const prop = uniqueProperties().find((p) => q.includes(p.property.toLowerCase().split(' ')[0]));
    if (prop) return { kind: 'book-property', property: prop.property };
    return {
      reply: 'I can book viewings, show vacant units, check rent balances or open maintenance tickets. Tap Book a viewing to start.',
    };
  }

  function handleUser(text, preset) {
    if (state.step === 'contact') {
      pushUser(text);
      finishContact(text);
      return;
    }

    if (state.step === 'property') {
      pushUser(text);
      pickProperty(text);
      return;
    }

    if (state.step === 'unit') {
      pushUser(text);
      const units = unitsFor(state.booking.property);
      const hit = units.find((u) => text.toLowerCase().includes(u.unit.toLowerCase()) || text.toLowerCase().includes(u.type.toLowerCase()));
      if (hit) pickUnit(hit);
      else pushBot('Pick a vacant unit from the chips below.');
      return;
    }

    if (state.step === 'slot') {
      pushUser(text);
      const hit = SLOTS.find((s) => text.toLowerCase().includes(s.toLowerCase().split(' ')[0]) || s.toLowerCase() === text.toLowerCase());
      if (hit) pickSlot(hit);
      else pickSlot(text);
      return;
    }

    if (preset?.action) {
      preset.action();
      return;
    }

    if (preset?.id === 'book' || preset?.kind === 'book') {
      startBooking();
      return;
    }

    pushUser(text);
    const item = preset || inferReply(text);

    if (item.kind === 'book') {
      setTimeout(() => startBooking(), 200);
      return;
    }
    if (item.kind === 'vacancy') {
      setTimeout(() => showVacancies(), 200);
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

  window.PropertyERPWhatsApp = { init, WA_NUMBER, startBooking };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
