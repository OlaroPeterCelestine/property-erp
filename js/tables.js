(function () {
  const PAGE_SIZES = [5, 10, 25, 50];

  function slug(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');
  }

  function statusClass(status) {
    const map = {
      active: 'bg-brand-50 text-brand-600',
      occupied: 'bg-brand-50 text-brand-600',
      paid: 'bg-brand-50 text-brand-600',
      approved: 'bg-brand-50 text-brand-600',
      completed: 'bg-brand-50 text-brand-600',
      matched: 'bg-brand-50 text-brand-600',
      posted: 'bg-brand-50 text-brand-600',
      vacant: 'bg-amber-50 text-amber-600',
      submitted: 'bg-amber-50 text-amber-600',
      partial: 'bg-amber-50 text-amber-600',
      'partially paid': 'bg-amber-50 text-amber-600',
      'under maintenance': 'bg-amber-50 text-amber-600',
      'in progress': 'bg-sky-50 text-sky-600',
      issued: 'bg-sky-50 text-sky-600',
      pending: 'bg-sky-50 text-sky-600',
      'pending move-in': 'bg-sky-50 text-sky-600',
      overdue: 'bg-rose-50 text-rose-600',
      critical: 'bg-rose-50 text-rose-600',
      high: 'bg-rose-50 text-rose-600',
      unmatched: 'bg-rose-50 text-rose-600',
      inactive: 'bg-slate-100 text-slate-600',
      draft: 'bg-slate-100 text-slate-600',
      low: 'bg-slate-100 text-slate-600',
      medium: 'bg-sky-50 text-sky-600',
      expired: 'bg-rose-50 text-rose-600',
      terminated: 'bg-slate-100 text-slate-600',
    };
    return map[slug(status)] || 'bg-slate-100 text-slate-600';
  }

  function pill(status) {
    return `<span class="rounded-full ${statusClass(status)} px-2.5 py-1 text-xs font-medium">${status}</span>`;
  }

  function moneyCell(usd) {
    return `<div data-usd="${usd}" data-price-layout="table"></div>`;
  }

  function getSection(tbody) {
    return tbody.closest('section') || tbody.closest('.rounded-2xl') || tbody.parentElement;
  }

  function ensureToolbar(section) {
    let toolbar = section.querySelector('[data-table-toolbar]');
    if (toolbar) return toolbar;

    const existing = section.querySelector('.border-b.border-slate-100.p-4, .flex.flex-wrap.gap-2.border-b');
    if (existing) {
      existing.setAttribute('data-table-toolbar', '');
      existing.classList.add('items-center');
      return existing;
    }

    toolbar = document.createElement('div');
    toolbar.setAttribute('data-table-toolbar', '');
    toolbar.className = 'flex flex-wrap items-center gap-2 border-b border-slate-100 p-4';
    const scroller = section.querySelector('.overflow-x-auto');
    if (scroller) section.insertBefore(toolbar, scroller);
    else section.prepend(toolbar);
    return toolbar;
  }

  function ensureSearch(toolbar) {
    let input = toolbar.querySelector('[data-table-search]');
    if (input) return input;
    input = document.createElement('input');
    input.type = 'search';
    input.setAttribute('data-table-search', '');
    input.placeholder = 'Search...';
    input.className = 'min-w-[180px] flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-brand-300 focus:bg-white';
    toolbar.prepend(input);
    return input;
  }

  function collectValues(rows, key) {
    const set = new Set();
    rows.forEach((row) => {
      const val = row.dataset[key];
      if (val) set.add(val);
    });
    return [...set].sort((a, b) => a.localeCompare(b));
  }

  function ensureFilterSelect(toolbar, key, label, values) {
    let select = toolbar.querySelector(`[data-table-filter="${key}"]`);
    if (!select) {
      // Upgrade legacy bare selects / data-status-filter
      const legacy = [...toolbar.querySelectorAll('select')].find((el) => {
        if (el.matches('[data-table-filter], [data-page-size]')) return false;
        const text = el.textContent.toLowerCase();
        if (key === 'status' && (el.hasAttribute('data-status-filter') || text.includes('status'))) return true;
        if (key === 'property' && text.includes('propert')) return true;
        if (key === 'type' && text.includes('type')) return true;
        if (key === 'category' && text.includes('categor')) return true;
        return false;
      });
      if (legacy) {
        select = legacy;
        select.setAttribute('data-table-filter', key);
        select.removeAttribute('data-status-filter');
      }
    }

    if (!select) {
      select = document.createElement('select');
      select.setAttribute('data-table-filter', key);
      select.className = 'rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-300';
      toolbar.appendChild(select);
    }

    const current = select.value;
    const opts = [`<option value="all">All ${label}</option>`]
      .concat(values.map((v) => `<option value="${v.replace(/"/g, '&quot;')}">${v}</option>`));
    select.innerHTML = opts.join('');
    if (current && [...select.options].some((o) => o.value === current)) select.value = current;
    else select.value = 'all';
    return select;
  }

  function ensurePageSize(toolbar) {
    let select = toolbar.querySelector('[data-page-size]');
    if (!select) {
      select = document.createElement('select');
      select.setAttribute('data-page-size', '');
      select.className = 'ml-auto rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-300';
      select.innerHTML = PAGE_SIZES.map((n) => `<option value="${n}">${n} / page</option>`).join('');
      select.value = '10';
      toolbar.appendChild(select);
    }
    return select;
  }

  function ensureClear(toolbar) {
    let btn = toolbar.querySelector('[data-clear-filters]');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('data-clear-filters', '');
      btn.className = 'rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50';
      btn.textContent = 'Clear';
      toolbar.appendChild(btn);
    }
    return btn;
  }

  function ensurePager(section) {
    let pager = section.querySelector('[data-table-pager]');
    if (pager) return pager;
    pager = document.createElement('div');
    pager.setAttribute('data-table-pager', '');
    pager.className = 'flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-sm text-slate-500';
    pager.innerHTML = `
      <p data-page-summary>Showing 0 results</p>
      <div class="flex items-center gap-1">
        <button type="button" data-page-prev class="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">Prev</button>
        <div data-page-numbers class="flex items-center gap-1"></div>
        <button type="button" data-page-next class="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">Next</button>
      </div>`;
    section.appendChild(pager);
    return pager;
  }

  function inferRowMeta(row, headers) {
    const cells = [...row.children];
    const statusSpan = row.querySelector('span.rounded-full');
    if (statusSpan && !row.dataset.status) {
      row.dataset.status = statusSpan.textContent.trim();
    }

    headers.forEach((header, idx) => {
      const cell = cells[idx];
      if (!cell) return;
      const text = cell.textContent.trim();
      if (!text) return;
      if (header.includes('status') && !row.dataset.status) row.dataset.status = text;
      if ((header.includes('propert') || header === 'location') && !row.dataset.property) {
        if (!header.includes('type')) row.dataset.property = text.split('·')[0].trim();
      }
      if (header === 'type' && !row.dataset.type) row.dataset.type = text;
      if (header.includes('categor') && !row.dataset.category) row.dataset.category = text;
      if (header.includes('priority') && !row.dataset.priority) row.dataset.priority = text;
      if (header.includes('method') && !row.dataset.method) row.dataset.method = text;
      if (header.includes('role') && !row.dataset.role) row.dataset.role = text;
      if ((header.includes('access') || header === 'vat status') && !row.dataset.access) row.dataset.access = text;
    });

    // Days overdue bucket for arrears
    if (!row.dataset.aging) {
      const daysCell = cells.find((c) => /^\d+$/.test(c.textContent.trim()) && (c.className.includes('rose') || c.className.includes('amber') || headers.some((h) => h.includes('day'))));
      if (daysCell) {
        const days = Number(daysCell.textContent.trim());
        if (!Number.isNaN(days)) {
          row.dataset.aging = days <= 7 ? '1-7 days' : days <= 30 ? '8-30 days' : days <= 60 ? '31-60 days' : '60+ days';
        }
      }
    }
  }

  function rowMatches(row, state) {
    if (state.q) {
      const hay = row.textContent.toLowerCase();
      if (!hay.includes(state.q)) return false;
    }
    for (const [key, value] of Object.entries(state.filters)) {
      if (!value || value === 'all') continue;
      const actual = row.dataset[key];
      if (!actual || slug(actual) !== slug(value)) return false;
    }
    return true;
  }

  function renderPager(pager, page, pageCount, matched, pageSize) {
    const summary = pager.querySelector('[data-page-summary]');
    const numbers = pager.querySelector('[data-page-numbers]');
    const prev = pager.querySelector('[data-page-prev]');
    const next = pager.querySelector('[data-page-next]');

    if (!matched) {
      summary.textContent = 'No matching results';
      numbers.innerHTML = '';
      prev.disabled = true;
      next.disabled = true;
      return;
    }

    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, matched);
    summary.textContent = `Showing ${start}–${end} of ${matched}`;

    const buttons = [];
    const windowSize = 5;
    let from = Math.max(1, page - Math.floor(windowSize / 2));
    let to = Math.min(pageCount, from + windowSize - 1);
    from = Math.max(1, to - windowSize + 1);

    for (let i = from; i <= to; i += 1) {
      buttons.push(`<button type="button" data-page="${i}" class="min-w-[2rem] rounded-lg border px-2.5 py-1.5 font-medium ${i === page ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}">${i}</button>`);
    }
    numbers.innerHTML = buttons.join('');
    prev.disabled = page <= 1;
    next.disabled = page >= pageCount;
  }

  function enhanceTable(tbody) {
    if (tbody.dataset.tableReady === '1') return;
    tbody.dataset.tableReady = '1';

    const section = getSection(tbody);
    const table = tbody.closest('table');
    const headers = [...(table?.querySelectorAll('thead th') || [])].map((th) => slug(th.textContent));
    const rows = [...tbody.querySelectorAll(':scope > tr')];
    rows.forEach((row) => inferRowMeta(row, headers));

    const toolbar = ensureToolbar(section);
    const search = ensureSearch(toolbar);
    const pageSizeSelect = ensurePageSize(toolbar);
    const clearBtn = ensureClear(toolbar);
    const pager = ensurePager(section);

    const filterKeys = [];
    const statusValues = collectValues(rows, 'status');
    const propertyValues = collectValues(rows, 'property');
    const typeValues = collectValues(rows, 'type');
    const categoryValues = collectValues(rows, 'category');
    const priorityValues = collectValues(rows, 'priority');
    const methodValues = collectValues(rows, 'method');
    const agingValues = collectValues(rows, 'aging');
    const roleValues = collectValues(rows, 'role');

    if (statusValues.length > 1) {
      ensureFilterSelect(toolbar, 'status', 'statuses', statusValues);
      filterKeys.push('status');
    }
    // Skip huge one-name-per-row property lists (e.g. Properties page itself)
    if (propertyValues.length > 1 && propertyValues.length <= 12) {
      ensureFilterSelect(toolbar, 'property', 'properties', propertyValues);
      filterKeys.push('property');
    }
    if (typeValues.length > 1 && typeValues.length <= 12) {
      ensureFilterSelect(toolbar, 'type', 'types', typeValues);
      filterKeys.push('type');
    }
    if (categoryValues.length > 1) {
      ensureFilterSelect(toolbar, 'category', 'categories', categoryValues);
      filterKeys.push('category');
    }
    if (priorityValues.length > 1) {
      ensureFilterSelect(toolbar, 'priority', 'priorities', priorityValues);
      filterKeys.push('priority');
    }
    if (methodValues.length > 1) {
      ensureFilterSelect(toolbar, 'method', 'methods', methodValues);
      filterKeys.push('method');
    }
    if (agingValues.length > 1) {
      ensureFilterSelect(toolbar, 'aging', 'aging buckets', agingValues);
      filterKeys.push('aging');
    }
    if (roleValues.length > 1) {
      ensureFilterSelect(toolbar, 'role', 'roles', roleValues);
      filterKeys.push('role');
    }

    // Move page size + clear to the end for consistent layout
    toolbar.appendChild(pageSizeSelect);
    toolbar.appendChild(clearBtn);

    const state = {
      q: '',
      filters: {},
      page: 1,
      pageSize: Number(pageSizeSelect.value) || 10,
    };

    function readFilters() {
      state.filters = {};
      toolbar.querySelectorAll('[data-table-filter]').forEach((select) => {
        state.filters[select.getAttribute('data-table-filter')] = select.value;
      });
    }

    function apply() {
      readFilters();
      state.q = search.value.trim().toLowerCase();
      state.pageSize = Number(pageSizeSelect.value) || 10;

      const matched = rows.filter((row) => rowMatches(row, state));
      const pageCount = Math.max(1, Math.ceil(matched.length / state.pageSize));
      if (state.page > pageCount) state.page = pageCount;

      rows.forEach((row) => {
        row.classList.add('hidden');
        row.dataset.matched = '0';
      });

      matched.forEach((row, index) => {
        row.dataset.matched = '1';
        const start = (state.page - 1) * state.pageSize;
        const end = start + state.pageSize;
        if (index >= start && index < end) row.classList.remove('hidden');
      });

      renderPager(pager, state.page, pageCount, matched.length, state.pageSize);
      section.dataset.filteredCount = String(matched.length);
    }

    search.addEventListener('input', () => { state.page = 1; apply(); });
    toolbar.querySelectorAll('[data-table-filter], [data-page-size]').forEach((el) => {
      el.addEventListener('change', () => { state.page = 1; apply(); });
    });
    clearBtn.addEventListener('click', () => {
      search.value = '';
      toolbar.querySelectorAll('[data-table-filter]').forEach((select) => { select.value = 'all'; });
      state.page = 1;
      apply();
    });
    pager.querySelector('[data-page-prev]').addEventListener('click', () => {
      if (state.page > 1) { state.page -= 1; apply(); }
    });
    pager.querySelector('[data-page-next]').addEventListener('click', () => {
      state.page += 1;
      apply();
    });
    pager.querySelector('[data-page-numbers]').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-page]');
      if (!btn) return;
      state.page = Number(btn.dataset.page);
      apply();
    });

    apply();
    tbody._tableApi = { apply, state, rows };
  }

  function init() {
    document.querySelectorAll('[data-filterable]').forEach(enhanceTable);
  }

  function refresh() {
    document.querySelectorAll('[data-filterable]').forEach((tbody) => {
      if (tbody._tableApi) tbody._tableApi.apply();
      else enhanceTable(tbody);
    });
  }

  window.PropertyERPTables = {
    init,
    refresh,
    enhanceTable,
    pill,
    moneyCell,
    statusClass,
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
