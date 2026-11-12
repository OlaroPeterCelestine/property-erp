(function () {
  // Uganda demo WhatsApp business line — replace with your real number
  const WA_NUMBER = '256700123456';
  const BOT_NAME = 'Property ERP Assistant';

  const QUICK = [
    { id: 'rent', label: 'Check rent balance', reply: 'I can help with rent balances. Share the tenant name or unit (e.g. Kololo · A-1204).' },
    { id: 'vacancy', label: 'Available units', reply: 'Right now we have vacant units in Bugolobi Flats, Nakasero Residences and Ntinda Business Park. Want me to send details on WhatsApp?' },
    { id: 'maintenance', label: 'Report maintenance', reply: 'Got it — describe the issue and unit. I will open WhatsApp so our team can pick it up.' },
    { id: 'arrears', label: 'Arrears reminder', reply: 'I can draft an arrears reminder in UGX for a tenant. Tell me who, or continue on WhatsApp.' },
    { id: 'agent', label: 'Talk to an agent', reply: 'Connecting you to our Kampala property desk on WhatsApp…' },
  ];

  function hi(name, cls) {
    return `<i class="hgi-stroke hgi-${name}${cls ? ` ${cls}` : ''}" aria-hidden="true"></i>`;
  }

  function waLink(text) {
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
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
              <p class="text-[11px] text-white/80">Online · UGX first · Uganda</p>
            </div>
          </div>
          <button type="button" id="wa-close" class="rounded-full p-1.5 text-white/90 hover:bg-white/10" aria-label="Close chat">${hi('cancel-01', 'text-[16px]')}</button>
        </div>
        <div id="wa-messages" class="wa-messages"></div>
        <div class="wa-quick" id="wa-quick"></div>
        <form id="wa-form" class="wa-form">
          <input id="wa-input" type="text" placeholder="Ask about rent, units, arrears…" autocomplete="off" />
          <button type="submit" aria-label="Send">${hi('sent', 'text-[16px]')}</button>
        </form>
        <a id="wa-handoff" class="wa-handoff" href="${waLink('Hello Property ERP, I need help with my property account.')}" target="_blank" rel="noopener">
          ${hi('whatsapp', 'text-[14px]')} Continue on WhatsApp
        </a>
      </div>`;
    document.body.appendChild(root);

    const quick = document.getElementById('wa-quick');
    QUICK.forEach((q) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'wa-chip';
      btn.textContent = q.label;
      btn.addEventListener('click', () => handleUser(q.label, q));
      quick.appendChild(btn);
    });

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

    pushBot('Hi 👋 I’m your Property ERP WhatsApp assistant. Ask about rent, vacancies, arrears or maintenance — or continue straight on WhatsApp.');
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

  function inferReply(text) {
    const q = text.toLowerCase();
    if (q.includes('rent') || q.includes('invoice') || q.includes('balance')) {
      return QUICK.find((x) => x.id === 'rent');
    }
    if (q.includes('vacan') || q.includes('unit') || q.includes('available') || q.includes('kololo') || q.includes('ntinda')) {
      return QUICK.find((x) => x.id === 'vacancy');
    }
    if (q.includes('maint') || q.includes('repair') || q.includes('leak') || q.includes('broken')) {
      return QUICK.find((x) => x.id === 'maintenance');
    }
    if (q.includes('arrear') || q.includes('overdue') || q.includes('remind')) {
      return QUICK.find((x) => x.id === 'arrears');
    }
    if (q.includes('agent') || q.includes('human') || q.includes('call') || q.includes('whatsapp')) {
      return QUICK.find((x) => x.id === 'agent');
    }
    return {
      reply: 'I can help with rent balances, vacant units, arrears reminders and maintenance tickets in UGX. Pick a quick option below, or continue on WhatsApp for a live agent.',
      handoff: text,
    };
  }

  function handleUser(text, preset) {
    pushUser(text);
    const item = preset || inferReply(text);
    setTimeout(() => {
      pushBot(item.reply);
      const handoff = document.getElementById('wa-handoff');
      const msg = `Property ERP enquiry:\n${text}\n\nPlease assist (UGX primary).`;
      if (handoff) handoff.href = waLink(msg);
      if (item.id === 'agent' || item.id === 'maintenance') {
        setTimeout(() => window.open(waLink(msg), '_blank', 'noopener'), 600);
      }
    }, 350);
  }

  function init() {
    ensureUi();
  }

  window.PropertyERPWhatsApp = { init, WA_NUMBER };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
