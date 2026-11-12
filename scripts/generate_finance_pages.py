#!/usr/bin/env python3
from pathlib import Path
import importlib.util

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("gen", ROOT / "scripts/generate_pages.py")
gen = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gen)

money = gen.money
kpi = gen.kpi
badge = gen.badge
header = gen.header
table_wrap = gen.table_wrap
th = gen.th
search = gen.search
write = gen.write


def main():
    write(
        "accounting.html",
        "accounting",
        "General Ledger",
        "Accountant",
        header(
            "General Ledger",
            "Double-entry source of truth — balanced journals only",
            '<button type="button" data-action="open-modal" data-modal="add-journal" class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">New Journal Entry</button>',
        )
        + f'<div class="grid gap-4 sm:grid-cols-4">{kpi("Trial balance", value="Balanced", tone="text-emerald-600")}{kpi("AR control", usd=28640)}{kpi("AP control", usd=12680)}{kpi("Open period", value="Nov 2026")}</div>'
        + table_wrap(
            search(),
            th("Journal", "Date", "Source", "Description", "Debit", "Credit", "Status"),
            f"""
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">JE-90112</td><td class="px-5 py-3">10 Nov 2026</td><td class="px-5 py-3">Rent receipt</td><td class="px-5 py-3">RCP-8841 allocation</td><td class="px-5 py-3">{money(850)}</td><td class="px-5 py-3">{money(850)}</td><td class="px-5 py-3">{badge('Posted','green')}</td></tr>
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">JE-90118</td><td class="px-5 py-3">09 Nov 2026</td><td class="px-5 py-3">Expense</td><td class="px-5 py-3">EXP-4412 plumbing</td><td class="px-5 py-3">{money(680)}</td><td class="px-5 py-3">{money(680)}</td><td class="px-5 py-3">{badge('Posted','green')}</td></tr>
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">JE-90121</td><td class="px-5 py-3">08 Nov 2026</td><td class="px-5 py-3">Rent invoice</td><td class="px-5 py-3">November cycle batch</td><td class="px-5 py-3">{money(84200)}</td><td class="px-5 py-3">{money(84200)}</td><td class="px-5 py-3">{badge('Posted','green')}</td></tr>
""",
        ),
    )

    write(
        "bank.html",
        "bank",
        "Bank Recon",
        "Accountant",
        header(
            "Bank &amp; Mobile Money Reconciliation",
            "Match statements without treating unmatched as rent income",
            '<button type="button" data-action="import-csv" data-import="bank" class="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium">Import Statement</button><button type="button" data-action="auto-match" class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Auto-match</button>',
        )
        + f'<div class="grid gap-4 sm:grid-cols-4">{kpi("Stanbic UGX", usd=128400)}{kpi("MTN MoMo", usd=18600)}{kpi("Unmatched lines", value="12", tone="text-amber-600")}{kpi("Last recon", value="07 Nov")}</div>'
        + table_wrap(
            search(),
            th("Date", "Account", "Description", "Statement", "Book", "Match"),
            f"""
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3">10 Nov</td><td class="px-5 py-3">Stanbic</td><td class="px-5 py-3">FT260110882 Nakato</td><td class="px-5 py-3">{money(850)}</td><td class="px-5 py-3">{money(850)}</td><td class="px-5 py-3">{badge('Matched','green')}</td></tr>
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3">09 Nov</td><td class="px-5 py-3">MTN MoMo</td><td class="px-5 py-3">MM261109441 Namutebi</td><td class="px-5 py-3">{money(490)}</td><td class="px-5 py-3">{money(490)}</td><td class="px-5 py-3">{badge('Matched','green')}</td></tr>
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3">08 Nov</td><td class="px-5 py-3">Airtel Money</td><td class="px-5 py-3">AM261108992 Unknown</td><td class="px-5 py-3">{money(300)}</td><td class="px-5 py-3">—</td><td class="px-5 py-3">{badge('Unmatched','rose')}</td></tr>
""",
        ),
    )

    vat_steps = [
        "Retrieve taxable transactions",
        "Validate classifications",
        "Flag missing invoices",
        "Calculate output VAT",
        "Calculate input VAT",
        "Apply adjustments",
        "Generate draft return",
        "Accountant approval",
        "Record filing reference",
        "Record tax payment",
    ]
    vat_workflow = (
        '<section class="rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-100"><h2 class="mb-3 text-base font-bold">Monthly VAT workflow</h2>'
        '<ol class="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">'
        + "".join(
            f'<li class="rounded-xl bg-slate-50 px-3 py-2"><span class="font-semibold text-emerald-600">{i}.</span> {t}</li>'
            for i, t in enumerate(vat_steps, 1)
        )
        + "</ol></section>"
    )

    write(
        "vat.html",
        "vat",
        "VAT",
        "Accountant",
        header(
            "VAT Management",
            "Output − Input ± Adjustments · URA period tracking",
            '<button type="button" data-action="prepare-vat" class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Prepare Nov Draft Return</button>',
        )
        + f'<div class="grid gap-4 sm:grid-cols-4">{kpi("Output VAT", usd=12840)}{kpi("Eligible input VAT", usd=8320)}{kpi("Net payable", usd=4520, tone="text-violet-600")}{kpi("Period status", value="Draft")}</div>'
        + vat_workflow
        + table_wrap(
            search(),
            th("Txn", "Type", "Base", "VAT", "Classification", "Source"),
            f"""
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3">INV-2026-1101</td><td class="px-5 py-3">Output</td><td class="px-5 py-3">{money(720)}</td><td class="px-5 py-3">{money(130)}</td><td class="px-5 py-3">Taxable 18%</td><td class="px-5 py-3">Rent</td></tr>
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3">EXP-4412</td><td class="px-5 py-3">Input</td><td class="px-5 py-3">{money(576)}</td><td class="px-5 py-3">{money(104)}</td><td class="px-5 py-3">Taxable 18%</td><td class="px-5 py-3">Expense</td></tr>
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3">INV-2026-1108</td><td class="px-5 py-3">Output</td><td class="px-5 py-3">{money(980)}</td><td class="px-5 py-3">{money(0)}</td><td class="px-5 py-3">Exempt</td><td class="px-5 py-3">Residential rent</td></tr>
""",
        ),
    )

    write(
        "wht.html",
        "wht",
        "WHT",
        "Accountant",
        header(
            "Withholding Tax",
            "Configurable rates, certificates and remittance tracking",
            '<button type="button" data-action="prepare-wht" class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Prepare WHT Summary</button>',
        )
        + f'<div class="grid gap-4 sm:grid-cols-4">{kpi("WHT deducted (suppliers)", usd=1860)}{kpi("WHT suffered (incoming)", usd=420)}{kpi("Net remittance due", usd=2180, tone="text-sky-600")}{kpi("Certificates pending", value="6")}</div>'
        + table_wrap(
            search(),
            th("Ref", "Counterparty", "Category", "Base", "Rate", "WHT", "Status"),
            f"""
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3">WHT-221</td><td class="px-5 py-3">SecureGuard UG</td><td class="px-5 py-3">Professional services</td><td class="px-5 py-3">{money(2200)}</td><td class="px-5 py-3">6%</td><td class="px-5 py-3">{money(132)}</td><td class="px-5 py-3">{badge('Pending remittance','amber')}</td></tr>
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3">WHT-218</td><td class="px-5 py-3">CoolAir Services</td><td class="px-5 py-3">Professional services</td><td class="px-5 py-3">{money(95)}</td><td class="px-5 py-3">6%</td><td class="px-5 py-3">{money(6)}</td><td class="px-5 py-3">{badge('Certificate issued','green')}</td></tr>
""",
        ),
    )

    checklist = [
        ("Generate rent invoices", True),
        ("Verify rent collections", True),
        ("Review unpaid tenant balances", True),
        ("Record outstanding expenses", True),
        ("Review supplier invoices", True),
        ("Reconcile bank accounts", False),
        ("Review VAT calculations", True),
        ("Review WHT calculations", True),
        ("Generate trial balance", True),
        ("Generate financial statements", False),
        ("Review discrepancies", False),
        ("Accountant approval", False),
        ("Close accounting period", False),
    ]
    items = []
    for text, done in checklist:
        cls = "text-emerald-600 font-medium" if done else "text-amber-600 font-medium"
        label = "Done" if done else "Pending"
        items.append(
            f'<li class="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm"><span>{text}</span><span class="{cls}">{label}</span></li>'
        )

    write(
        "closing.html",
        "closing",
        "Month Close",
        "Accountant",
        header(
            "Monthly Financial Closing",
            "Controlled checklist — closed periods are protected",
            '<button type="button" data-action="close-month" class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Submit for Approval</button>',
        )
        + f'<div class="grid gap-4 sm:grid-cols-3">{kpi("Period", value="November 2026")}{kpi("Status", value="In progress", tone="text-amber-600")}{kpi("Checklist", value="9 / 13")}</div>'
        + '<section class="rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-100"><h2 class="mb-4 text-base font-bold">Closing checklist</h2><ul class="space-y-2">'
        + "".join(items)
        + "</ul></section>",
    )

    cards = [
        ("Income Statement", "Monthly P&amp;L by property and portfolio", "#"),
        ("Balance Sheet", "Assets, liabilities and equity", "#"),
        ("Cash Flow", "Operating, investing, financing", "#"),
        ("AR Aging", "Tenant arrears buckets", "arrears.html"),
        ("AP Aging", "Supplier outstanding balances", "suppliers.html"),
        ("Rent Collection", "Expected vs collected", "rent.html"),
        ("Property Profitability", "Income vs expenses per property", "index.html"),
        ("VAT Report", "Output, input and net position", "vat.html"),
        ("WHT Report", "Deductions, remittances, certificates", "wht.html"),
        ("Bank Reconciliation", "Matched and unmatched lines", "bank.html"),
        ("Trial Balance", "Ledger control check", "accounting.html"),
        ("Tax Filing Status", "Filed vs pending periods", "vat.html"),
    ]
    report_cards = "".join(
        f'<a href="{href}" class="rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-100 transition hover:ring-emerald-200"><h3 class="font-semibold text-slate-900">{title}</h3><p class="mt-1 text-sm text-slate-500">{desc}</p></a>'
        for title, desc, href in cards
    )

    write(
        "reports.html",
        "reports",
        "Reports",
        "Director/Owner",
        header(
            "Reporting &amp; Analytics",
            "PDF / Excel / CSV exports from the ledger",
            '<button type="button" data-action="export-dashboard" class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Export Pack (CSV)</button>',
        )
        + f'<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{report_cards}</div>',
    )

    write(
        "documents.html",
        "documents",
        "Documents",
        "Property Manager",
        header(
            "Document Management",
            "Leases, IDs, invoices, tax returns and certificates",
            '<button type="button" data-action="open-modal" data-modal="upload-document" class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Upload Document</button>',
        )
        + table_wrap(
            search()
            + '<select class="rounded-lg border border-slate-200 px-3 py-2 text-sm"><option>All categories</option><option>Lease</option><option>Tax</option><option>Invoice</option></select>',
            th("Document", "Category", "Linked to", "Uploaded", "Expires", "Access"),
            f"""
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">LSE-2024-088.pdf</td><td class="px-5 py-3">Lease</td><td class="px-5 py-3">Nakato Holdings</td><td class="px-5 py-3">02 Jan 2024</td><td class="px-5 py-3">31 Dec 2026</td><td class="px-5 py-3">{badge('Restricted','violet')}</td></tr>
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">VAT-Nov-Draft.pdf</td><td class="px-5 py-3">Tax return</td><td class="px-5 py-3">Nov 2026 period</td><td class="px-5 py-3">11 Nov 2026</td><td class="px-5 py-3">—</td><td class="px-5 py-3">{badge('Finance only','sky')}</td></tr>
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">WHT-Cert-218.pdf</td><td class="px-5 py-3">WHT certificate</td><td class="px-5 py-3">CoolAir Services</td><td class="px-5 py-3">05 Nov 2026</td><td class="px-5 py-3">—</td><td class="px-5 py-3">{badge('Finance only','sky')}</td></tr>
""",
        ),
    )

    write(
        "users.html",
        "users",
        "Users & Roles",
        "System Administrator",
        header(
            "Users &amp; RBAC",
            "Roles restrict financial ops and property scope",
            '<button type="button" data-action="open-modal" data-modal="add-user" class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Invite User</button>',
        )
        + table_wrap(
            search(),
            th("User", "Email", "Role", "Property scope", "MFA", "Status"),
            f"""
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">Alex Okello</td><td class="px-5 py-3">alex@propertyerp.ug</td><td class="px-5 py-3">Property Manager</td><td class="px-5 py-3">All</td><td class="px-5 py-3">On</td><td class="px-5 py-3">{badge('Active','green')}</td></tr>
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">Grace Atim</td><td class="px-5 py-3">grace@propertyerp.ug</td><td class="px-5 py-3">Accountant</td><td class="px-5 py-3">All</td><td class="px-5 py-3">On</td><td class="px-5 py-3">{badge('Active','green')}</td></tr>
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">Peter Ssebunya</td><td class="px-5 py-3">peter@propertyerp.ug</td><td class="px-5 py-3">Cashier</td><td class="px-5 py-3">Kololo, Ntinda</td><td class="px-5 py-3">Off</td><td class="px-5 py-3">{badge('Active','green')}</td></tr>
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">Audit Desk</td><td class="px-5 py-3">audit@propertyerp.ug</td><td class="px-5 py-3">Auditor</td><td class="px-5 py-3">Read-only all</td><td class="px-5 py-3">On</td><td class="px-5 py-3">{badge('Active','green')}</td></tr>
""",
        ),
    )

    write(
        "settings.html",
        "settings",
        "Settings",
        "System Administrator",
        header("System Settings", "Organization, tax configuration, FX and automation", "")
        + """
<div class="grid gap-4 lg:grid-cols-2">
  <section class="rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-100 space-y-3">
    <h2 class="text-base font-bold">Organization</h2>
    <label class="block text-sm"><span class="mb-1 block font-medium">Legal name</span><input class="field" value="Okello Property Holdings Ltd" /></label>
    <label class="block text-sm"><span class="mb-1 block font-medium">TIN</span><input class="field" value="1000789456" /></label>
    <label class="block text-sm"><span class="mb-1 block font-medium">Jurisdiction</span><select class="field"><option>Uganda (URA)</option><option>Kenya</option><option>Custom</option></select></label>
  </section>
  <section class="rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-100 space-y-3">
    <h2 class="text-base font-bold">Tax &amp; currency</h2>
    <label class="block text-sm"><span class="mb-1 block font-medium">Default VAT rate</span><input class="field" value="18%" /></label>
    <label class="block text-sm"><span class="mb-1 block font-medium">Default WHT (services)</span><input class="field" value="6%" /></label>
    <label class="block text-sm"><span class="mb-1 block font-medium">FX (USD → UGX)</span><input class="field" value="3700" /></label>
    <label class="block text-sm"><span class="mb-1 block font-medium">Display currency</span><select class="field"><option>USD + UGX</option><option>UGX only</option><option>USD only</option></select></label>
  </section>
  <section class="rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-100 space-y-3">
    <h2 class="text-base font-bold">Automation</h2>
    <label class="flex items-center gap-2 text-sm"><input type="checkbox" checked class="rounded border-slate-300 text-emerald-500" /> Auto monthly rent invoicing</label>
    <label class="flex items-center gap-2 text-sm"><input type="checkbox" checked class="rounded border-slate-300 text-emerald-500" /> Overdue rent reminders</label>
    <label class="flex items-center gap-2 text-sm"><input type="checkbox" checked class="rounded border-slate-300 text-emerald-500" /> Lease expiry alerts (60 days)</label>
    <label class="flex items-center gap-2 text-sm"><input type="checkbox" class="rounded border-slate-300 text-emerald-500" /> Auto bank payment (requires mandate)</label>
  </section>
  <section class="rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-100 space-y-3">
    <h2 class="text-base font-bold">Save</h2>
    <p class="text-sm text-slate-500">Tax rate changes are versioned by effective date and never rewrite history.</p>
    <button type="button" data-action="save-settings" class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Save Settings</button>
  </section>
</div>
""",
    )

    print("finance pages complete")


if __name__ == "__main__":
    main()
