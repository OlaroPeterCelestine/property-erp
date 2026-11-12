(function () {
  const MODALS = {
    'add-property': {
      title: 'Add Property',
      body: () => `${formFields([
        ['name', 'Property name', 'text', 'Kololo Heights'],
        ['code', 'Property code', 'text', 'PRP-007'],
        ['location', 'Location', 'text', 'Kampala, Uganda'],
        ['type', 'Type', 'select', ['Residential', 'Commercial']],
        ['status', 'Status', 'select', ['Active', 'Inactive', 'Under maintenance']],
      ])}<div class="mt-3">${window.PropertyERPUploads?.dropzoneHtml({
        name: 'cover',
        label: 'Cover photo',
        hint: 'JPG, PNG or WEBP · up to 8 MB',
        accept: window.PropertyERPUploads.IMAGE_ACCEPT,
        imagesOnly: true,
      }) || ''}</div>`,
      submit: 'Save Property',
      success: 'Property registered in portfolio.',
      requireUpload: false,
      onSubmit: (form) => {
        const prepared = window.PropertyERPUploads?.getPrepared(form);
        if (prepared?.kind === 'image') {
          const code = form.querySelector('[name="code"]')?.value?.trim() || `PRP-${Date.now()}`;
          const slug = (form.querySelector('[name="name"]')?.value || code)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
          window.PropertyERPUploads.setPropertyImage(slug, prepared.dataUrl);
          return `Property saved with cover photo (${prepared.name}).`;
        }
        return null;
      },
    },
    'add-unit': {
      title: 'Add Unit',
      body: formFields([
        ['property', 'Property', 'text', 'Kololo Heights'],
        ['unit', 'Unit number', 'text', 'A-1301'],
        ['type', 'Unit type', 'text', '2 Bed'],
        ['rent', 'Monthly rent (UGX)', 'number', '3145000'],
        ['status', 'Status', 'select', ['Vacant', 'Occupied', 'Under maintenance']],
      ]),
      submit: 'Save Unit',
      success: 'Unit added to property hierarchy.',
    },
    'add-tenant': {
      title: 'Add Tenant',
      body: formFields([
        ['name', 'Full name / business', 'text', 'Nakato Holdings Ltd'],
        ['phone', 'Phone', 'text', '+256 700 000 000'],
        ['email', 'Email', 'email', 'tenant@email.com'],
        ['tin', 'TIN (optional)', 'text', ''],
        ['status', 'Status', 'select', ['Active', 'Pending move-in', 'Vacated', 'Suspended']],
      ]),
      submit: 'Save Tenant',
      success: 'Tenant registered with unique ID.',
    },
    'add-lease': {
      title: 'Create Lease',
      body: formFields([
        ['tenant', 'Tenant', 'text', 'Nakato Holdings Ltd'],
        ['unit', 'Unit', 'text', 'A-1204'],
        ['rent', 'Monthly rent (UGX)', 'number', '3145000'],
        ['start', 'Start date', 'date', '2026-12-01'],
        ['end', 'Expiry date', 'date', '2027-11-30'],
        ['tax', 'Tax treatment', 'select', ['VAT 18%', 'Exempt', 'Zero-rated']],
      ]),
      submit: 'Create Lease',
      success: 'Lease created. Only active leases will generate rent invoices.',
    },
    'add-invoice': {
      title: 'Manual Rent Invoice',
      body: formFields([
        ['tenant', 'Tenant', 'text', 'Agaba Retail Ltd'],
        ['period', 'Billing period', 'text', 'Nov 2026'],
        ['amount', 'Amount (UGX)', 'number', '4440000'],
        ['due', 'Due date', 'date', '2026-11-05'],
      ]),
      submit: 'Issue Invoice',
      success: 'Invoice issued and posted to AR ledger.',
    },
    'record-payment': {
      title: 'Record Payment',
      body: formFields([
        ['tenant', 'Tenant', 'text', 'Sarah Namutebi'],
        ['amount', 'Amount (UGX)', 'number', '1813000'],
        ['method', 'Method', 'select', ['Bank transfer', 'Cash', 'MTN MoMo', 'Airtel Money', 'Card']],
        ['reference', 'Payment reference', 'text', 'MM261112001'],
        ['invoice', 'Allocate to invoice', 'text', 'INV-2026-1108'],
      ]),
      submit: 'Post Payment',
      success: 'Payment recorded. Duplicate references are blocked.',
    },
    'add-expense': {
      title: 'Record Expense',
      body: formFields([
        ['property', 'Property', 'text', 'Kololo Heights'],
        ['category', 'Category', 'select', ['Repairs and maintenance', 'Security', 'Cleaning', 'Insurance', 'Utilities', 'Professional services']],
        ['supplier', 'Supplier', 'text', 'Kampala Plumbing Co'],
        ['amount', 'Amount (UGX)', 'number', '2516000'],
        ['tax', 'Tax treatment', 'select', ['VAT 18%', 'WHT 6%', 'Exempt']],
      ]),
      submit: 'Submit for Approval',
      success: 'Expense submitted. It is not marked paid until payment is posted.',
    },
    'add-supplier': {
      title: 'Add Supplier',
      body: formFields([
        ['name', 'Supplier name', 'text', 'SecureGuard UG'],
        ['tin', 'TIN', 'text', '1000987654'],
        ['vat', 'VAT status', 'select', ['Registered', 'Not registered']],
        ['wht', 'WHT class', 'select', ['Services 6%', 'Goods 6%', 'N/A']],
        ['terms', 'Payment terms', 'text', 'Net 30'],
      ]),
      submit: 'Save Supplier',
      success: 'Supplier registered with tax classification.',
    },
    'add-maintenance': {
      title: 'New Maintenance Request',
      body: formFields([
        ['unit', 'Property / Unit', 'text', 'Bugolobi · E-03'],
        ['issue', 'Problem description', 'text', 'Electrical panel fault'],
        ['priority', 'Priority', 'select', ['Low', 'Medium', 'High', 'Critical']],
      ]),
      submit: 'Create Request',
      success: 'Maintenance ticket created.',
    },
    'add-journal': {
      title: 'Manual Journal Entry',
      body: formFields([
        ['desc', 'Description', 'text', 'Month-end accrual'],
        ['debit', 'Debit account / amount', 'text', '5100 Repairs / 500'],
        ['credit', 'Credit account / amount', 'text', '2100 Accruals / 500'],
      ]),
      submit: 'Post Journal',
      success: 'Balanced journal posted. Posted entries cannot be silently deleted.',
    },
    'upload-document': {
      title: 'Upload Document',
      body: () => `${window.PropertyERPUploads?.dropzoneHtml({
        name: 'document',
        label: 'File',
        hint: 'Images, PDF, Word, Excel or CSV · up to 12 MB',
        accept: window.PropertyERPUploads.DOC_ACCEPT,
        imagesOnly: false,
      }) || ''}${formFields([
        ['name', 'Document name', 'text', ''],
        ['category', 'Category', 'select', ['Lease', 'Tenant ID', 'Property photo', 'Supplier invoice', 'Tax return', 'WHT certificate', 'Receipt']],
        ['link', 'Linked entity', 'text', 'LSE-2024-088'],
      ])}`,
      submit: 'Upload',
      success: 'Document stored with version and access controls.',
      requireUpload: true,
      onSubmit: (form) => {
        const prepared = window.PropertyERPUploads?.requirePrepared(form, 'Choose a file to upload.');
        if (!prepared) return false;
        const name = form.querySelector('[name="name"]')?.value?.trim() || prepared.name;
        const category = form.querySelector('[name="category"]')?.value || 'Document';
        const link = form.querySelector('[name="link"]')?.value?.trim() || '—';
        window.PropertyERPUploads.addDocument({
          id: `DOC-${Date.now()}`,
          name,
          fileName: prepared.name,
          category,
          link,
          kind: prepared.kind,
          size: prepared.size,
          previewUrl: prepared.previewUrl,
          uploadedAt: new Date().toISOString().slice(0, 10),
          expires: '—',
          access: 'Restricted',
        });
        document.dispatchEvent(new CustomEvent('property-erp:documents-changed'));
        return `“${name}” uploaded successfully.`;
      },
    },
    'upload-property-image': {
      title: 'Update Cover Photo',
      body: () => `${window.PropertyERPUploads?.dropzoneHtml({
        name: 'cover',
        label: 'Property image',
        hint: 'Drag a photo here or click to browse · JPG/PNG/WEBP · max 8 MB',
        accept: window.PropertyERPUploads.IMAGE_ACCEPT,
        imagesOnly: true,
      }) || ''}<p class="mt-3 text-xs text-slate-400">The new cover replaces the hero image on this property’s analytics page.</p>`,
      submit: 'Save Photo',
      success: 'Cover photo updated.',
      requireUpload: true,
      onSubmit: (form) => {
        const prepared = window.PropertyERPUploads?.requirePrepared(form, 'Choose an image to upload.');
        if (!prepared) return false;
        const propertyId = document.body.dataset.propertyId;
        if (!propertyId) return { error: 'Open a property detail page first.' };
        try {
          window.PropertyERPUploads.setPropertyImage(propertyId, prepared.dataUrl);
        } catch {
          return { error: 'Could not save image. Try a smaller file.' };
        }
        document.dispatchEvent(new CustomEvent('property-erp:property-image-changed', {
          detail: { id: propertyId, dataUrl: prepared.dataUrl },
        }));
        return `Cover photo updated (${prepared.name}).`;
      },
    },
    'add-user': {
      title: 'Invite User',
      body: formFields([
        ['name', 'Full name', 'text', ''],
        ['email', 'Email', 'email', ''],
        ['role', 'Role', 'select', ['System Administrator', 'Director/Owner', 'Property Manager', 'Accountant', 'Cashier', 'Procurement Officer', 'Finance Approver', 'Auditor']],
        ['scope', 'Property scope', 'text', 'All'],
      ]),
      submit: 'Send Invite',
      success: 'User invited with role-based access.',
    },
    notifications: {
      title: 'Notifications',
      body: `<ul class="space-y-3 text-sm">
        <li class="rounded-xl bg-rose-50 px-3 py-3"><p class="font-medium text-rose-700">23 rent invoices overdue</p><p class="text-xs text-rose-600">Arrears module · just now</p></li>
        <li class="rounded-xl bg-amber-50 px-3 py-3"><p class="font-medium text-amber-700">8 leases expire within 60 days</p><p class="text-xs text-amber-700">Lease management</p></li>
        <li class="rounded-xl bg-violet-50 px-3 py-3"><p class="font-medium text-violet-700">VAT draft ready for Nov 2026</p><p class="text-xs text-violet-700">Tax compliance</p></li>
        <li class="rounded-xl bg-sky-50 px-3 py-3"><p class="font-medium text-sky-700">12 bank lines unmatched</p><p class="text-xs text-sky-700">Bank reconciliation</p></li>
      </ul>`,
      submit: null,
    },
    settings: {
      title: 'Quick Settings',
      body: formFields([
        ['display', 'Display name', 'text', 'Alex Okello'],
        ['currency', 'Currency display', 'select', ['UGX + USD', 'UGX only', 'USD only']],
        ['alerts', 'Email deal alerts', 'select', ['Enabled', 'Disabled']],
      ]),
      submit: 'Save',
      success: 'Settings saved.',
    },
  };

  function formFields(fields) {
    return `<div class="space-y-3">${fields.map(([name, label, type, value]) => {
      if (type === 'select') {
        const opts = value.map((o) => `<option>${o}</option>`).join('');
        return `<label class="block text-sm"><span class="mb-1 block font-medium text-slate-700">${label}</span><select name="${name}" class="field">${opts}</select></label>`;
      }
      const required = ['name', 'tenant', 'amount', 'email'].includes(name) ? 'required' : '';
      const val = type === 'number' || type === 'date' || type === 'text' || type === 'email' ? ` value="${value || ''}"` : '';
      const ph = typeof value === 'string' && type === 'text' ? ` placeholder="${value}"` : '';
      const useVal = type === 'date' || type === 'number' || (type === 'text' && name !== 'name' && name !== 'issue' && name !== 'desc') ? val : '';
      return `<label class="block text-sm"><span class="mb-1 block font-medium text-slate-700">${label}</span><input name="${name}" type="${type}" class="field" ${required}${type === 'date' || type === 'number' ? val : ph} /></label>`;
    }).join('')}</div>`;
  }

  function ensureShell() {
    if (document.getElementById('toast-root')) return;
    const toast = document.createElement('div');
    toast.id = 'toast-root';
    toast.className = 'toast-root';
    document.body.appendChild(toast);

    const modal = document.createElement('div');
    modal.id = 'modal-root';
    modal.className = 'modal-root';
    modal.innerHTML = `
      <div class="modal-backdrop" data-close-modal></div>
      <div class="modal-panel" role="dialog" aria-modal="true">
        <div class="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <h2 id="modal-title" class="text-lg font-bold text-slate-900"></h2>
          <button type="button" class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50" data-close-modal aria-label="Close">
            <i class="hgi-stroke hgi-cancel-01 text-[18px]" aria-hidden="true"></i>
          </button>
        </div>
        <form id="modal-form" class="px-5 py-4">
          <div id="modal-body"></div>
          <div id="modal-actions" class="mt-5 flex justify-end gap-2"></div>
        </form>
      </div>`;
    document.body.appendChild(modal);
  }

  function toast(message, type) {
    ensureShell();
    const el = document.createElement('div');
    el.className = `toast ${type === 'error' ? 'toast-error' : 'toast-ok'}`;
    el.innerHTML = `<i class="hgi-stroke ${type === 'error' ? 'hgi-cancel-circle' : 'hgi-checkmark-circle-01'} text-[16px]"></i><span>${message}</span>`;
    document.getElementById('toast-root').appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 220); }, 2800);
  }

  function closeModal() {
    document.getElementById('modal-root')?.classList.remove('open');
    document.body.classList.remove('modal-open');
  }

  function openModal(key) {
    ensureShell();
    const config = MODALS[key];
    if (!config) return toast(`Action “${key}” is not configured.`, 'error');
    document.getElementById('modal-title').textContent = config.title;
    const body = typeof config.body === 'function' ? config.body() : config.body;
    document.getElementById('modal-body').innerHTML = body;
    window.PropertyERPUploads?.bindAll(document.getElementById('modal-body'));
    const form = document.getElementById('modal-form');
    const actions = document.getElementById('modal-actions');
    if (config.submit) {
      actions.innerHTML = `<button type="button" class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600" data-close-modal>Cancel</button><button type="submit" class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">${config.submit}</button>`;
      form.onsubmit = (e) => {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }
        if (typeof config.onSubmit === 'function') {
          let result;
          try {
            result = config.onSubmit(form);
          } catch (err) {
            toast(err.message || 'Upload failed.', 'error');
            return;
          }
          if (result === false) return;
          if (result && typeof result === 'object' && result.error) {
            toast(result.error, 'error');
            return;
          }
          closeModal();
          toast(typeof result === 'string' && result ? result : (config.success || 'Saved.'));
          return;
        }
        if (config.requireUpload && !window.PropertyERPUploads?.getPrepared(form)) {
          window.PropertyERPUploads?.requirePrepared(form);
          return;
        }
        closeModal();
        toast(config.success || 'Saved.');
      };
    } else {
      actions.innerHTML = `<button type="button" class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" data-close-modal>Close</button>`;
      form.onsubmit = (e) => e.preventDefault();
    }
    document.getElementById('modal-root').classList.add('open');
    document.body.classList.add('modal-open');
  }

  function exportCsv(filename, rows) {
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    toast(`Exported ${filename}`);
  }

  function bindActions() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-close-modal]')) { closeModal(); return; }
      const el = e.target.closest('[data-action]');
      if (!el) return;
      const action = el.dataset.action;
      if (action === 'open-modal') openModal(el.dataset.modal);
      if (action === 'run-rent-cycle') toast('November rent cycle generated for 142 active leases.');
      if (action === 'send-reminders') toast('Overdue reminders queued via email/SMS.');
      if (action === 'import-csv') toast(`${(el.dataset.import || 'data').replace(/^./, (c) => c.toUpperCase())} CSV import started.`);
      if (action === 'auto-match') toast('Auto-matched 9 of 12 bank lines. 3 remain unmatched.');
      if (action === 'prepare-vat') toast('VAT draft return prepared for Nov 2026. Ready for accountant review.');
      if (action === 'prepare-wht') toast('WHT monthly summary prepared. Certificates pending: 6.');
      if (action === 'close-month') toast('Month close submitted for Finance Approver review.');
      if (action === 'save-settings') toast('Settings saved. Tax rate versions preserved.');
      if (action === 'export-dashboard') {
        exportCsv('property-erp-dashboard.csv', [
          ['Metric', 'UGX', 'USD'],
          ['Expected rent', '311540000', '84200'],
          ['Collected', '263995000', '71350'],
          ['Arrears', '105968000', '28640'],
          ['Expenses', '68154000', '18420'],
          ['VAT payable', '16724000', '4520'],
          ['WHT payable', '8066000', '2180'],
        ]);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
      if (e.key !== 'Enter') return;
      const input = e.target;
      if (!(input instanceof HTMLInputElement) || input.type !== 'search' || !input.closest('header')) return;
      const q = input.value.trim().toLowerCase();
      if (!q) return;
      const propertyHits = [
        ['kololo', 'property.html?id=kololo-heights'],
        ['ntinda', 'property.html?id=ntinda-business-park'],
        ['nakasero', 'property.html?id=nakasero-residences'],
        ['entebbe', 'property.html?id=entebbe-road-mall'],
        ['bugolobi', 'property.html?id=bugolobi-flats'],
        ['jinja', 'property.html?id=old-jinja-warehouse'],
        ['warehouse', 'property.html?id=old-jinja-warehouse'],
      ];
      for (const [key, href] of propertyHits) {
        if (q.includes(key)) { window.location.href = href; return; }
      }

      const map = [
        [['propert', 'portfolio', 'building'], 'properties.html'],
        [['unit', 'vacant', 'occup'], 'units.html'],
        [['tenant', 'occupant'], 'tenants.html'],
        [['lease'], 'leases.html'],
        [['rent', 'invoice'], 'rent.html'],
        [['payment', 'collect', 'momo', 'bank'], 'payments.html'],
        [['arrear', 'overdue'], 'arrears.html'],
        [['expense', 'spend'], 'expenses.html'],
        [['supplier', 'contractor'], 'suppliers.html'],
        [['maint'], 'maintenance.html'],
        [['ledger', 'journal', 'account'], 'accounting.html'],
        [['reconcil'], 'bank.html'],
        [['vat'], 'vat.html'],
        [['wht', 'withhold'], 'wht.html'],
        [['close', 'period'], 'closing.html'],
        [['report'], 'reports.html'],
        [['document', 'file'], 'documents.html'],
        [['user', 'role'], 'users.html'],
        [['setting'], 'settings.html'],
      ];
      for (const [keys, href] of map) {
        if (keys.some((k) => q.includes(k))) { window.location.href = href; return; }
      }
      toast(`No match for “${input.value.trim()}”. Try Properties, Tenants, Rent, VAT…`);
    });
  }

  function init() {
    ensureShell();
    bindActions();
    // Table search / filters / pagination live in js/tables.js
    if (window.PropertyERPTables) window.PropertyERPTables.refresh();
  }

  window.PropertyERP = window.PropertyERP || {};
  window.PropertyERP.toast = toast;
  window.PropertyERP.openModal = openModal;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
