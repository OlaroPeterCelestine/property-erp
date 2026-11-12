#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Property ERP — {title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="js/tailwind-config.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://use.hugeicons.com/font/icons.css" />
  <link rel="stylesheet" href="css/app.css" />
</head>
<body class="bg-surface text-slate-800 antialiased" data-page="{page}" data-role="{role}">
  <div id="app-shell" class="flex min-h-screen">
    <main class="min-w-0 flex-1">
      <div id="header-root"></div>
      <div class="space-y-6 p-4 sm:p-6">
{content}
      </div>
    </main>
  </div>
  <script src="js/money.js"></script>
  <script src="js/layout.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
"""


def money(usd, layout="stack", extra=""):
    return f'<div {extra} data-usd="{usd}" data-price-layout="{layout}"></div>'


def kpi(label, usd=None, value=None, tone="text-slate-900", hint=""):
    if usd is not None:
        body = money(
            usd,
            "stack",
            f'data-usd-class="mt-1 text-2xl font-bold {tone}" data-ugx-class="text-xs text-slate-400"',
        )
    else:
        body = f'<p class="mt-1 text-2xl font-bold {tone}">{value}</p>'
    hint_html = f'<p class="mt-1 text-xs text-slate-400">{hint}</p>' if hint else ""
    return (
        '<div class="rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-100">'
        f'<p class="text-sm text-slate-500">{label}</p>{body}{hint_html}</div>'
    )


def badge(text, color):
    colors = {
        "green": "bg-emerald-50 text-emerald-600",
        "amber": "bg-amber-50 text-amber-600",
        "rose": "bg-rose-50 text-rose-600",
        "sky": "bg-sky-50 text-sky-600",
        "violet": "bg-violet-50 text-violet-600",
        "slate": "bg-slate-100 text-slate-600",
    }
    return f'<span class="rounded-full {colors[color]} px-2.5 py-1 text-xs font-medium">{text}</span>'


def header(title, sub, actions=""):
    return (
        '<div class="flex flex-wrap items-center justify-between gap-3"><div>'
        f'<h1 class="text-xl font-bold tracking-tight text-slate-900">{title}</h1>'
        f'<p class="mt-1 text-sm text-slate-500">{sub}</p></div>'
        f'<div class="flex flex-wrap gap-2">{actions}</div></div>'
    )


def table_wrap(filters, thead, rows):
    return (
        '<section class="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-slate-100">'
        f'<div class="flex flex-wrap gap-2 border-b border-slate-100 p-4">{filters}</div>'
        '<div class="overflow-x-auto"><table class="w-full min-w-[800px] text-left text-sm">'
        f'<thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-400"><tr>{thead}</tr></thead>'
        f'<tbody class="divide-y divide-slate-100" data-filterable>{rows}</tbody></table></div></section>'
    )


def th(*cols):
    return "".join(f'<th class="px-5 py-3 font-medium">{c}</th>' for c in cols)


def search():
    return (
        '<input data-table-search type="search" placeholder="Search..." '
        'class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-300 focus:bg-white" />'
    )


def write(fname, page, title, role, content):
    (ROOT / fname).write_text(HEAD.format(title=title, page=page, role=role, content=content))
    print("wrote", fname)


def main():
    write(
        "units.html",
        "units",
        "Units",
        "Property Manager",
        header(
            "Rental Units",
            "Occupancy status across buildings and floors",
            '<button type="button" data-action="open-modal" data-modal="add-unit" class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Add Unit</button>',
        )
        + f'<div class="grid gap-4 sm:grid-cols-4">{kpi("Occupied", value="148", tone="text-emerald-600")}{kpi("Vacant", value="38", tone="text-amber-600")}{kpi("Maintenance", value="6", tone="text-rose-500")}{kpi("Occupancy rate", value="79.6%")}</div>'
        + table_wrap(
            search()
            + '<select class="rounded-lg border border-slate-200 px-3 py-2 text-sm"><option>All properties</option><option>Kololo Heights</option></select>',
            th("Unit", "Property", "Floor", "Type", "Tenant", "Rent", "Status"),
            f"""
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">A-1204</td><td class="px-5 py-3">Kololo Heights</td><td class="px-5 py-3">12</td><td class="px-5 py-3">2 Bed</td><td class="px-5 py-3">Nakato Holdings</td><td class="px-5 py-3">{money(850,'table')}</td><td class="px-5 py-3">{badge('Occupied','green')}</td></tr>
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">B-0208</td><td class="px-5 py-3">Kololo Heights</td><td class="px-5 py-3">2</td><td class="px-5 py-3">Studio</td><td class="px-5 py-3">—</td><td class="px-5 py-3">{money(420,'table')}</td><td class="px-5 py-3">{badge('Vacant','amber')}</td></tr>
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">C-05</td><td class="px-5 py-3">Ntinda Business Park</td><td class="px-5 py-3">G</td><td class="px-5 py-3">Shop</td><td class="px-5 py-3">Agaba Retail Ltd</td><td class="px-5 py-3">{money(1200,'table')}</td><td class="px-5 py-3">{badge('Occupied','green')}</td></tr>
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">D-1102</td><td class="px-5 py-3">Nakasero Residences</td><td class="px-5 py-3">11</td><td class="px-5 py-3">3 Bed</td><td class="px-5 py-3">Sarah Namutebi</td><td class="px-5 py-3">{money(980,'table')}</td><td class="px-5 py-3">{badge('Occupied','green')}</td></tr>
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">E-03</td><td class="px-5 py-3">Bugolobi Flats</td><td class="px-5 py-3">1</td><td class="px-5 py-3">1 Bed</td><td class="px-5 py-3">—</td><td class="px-5 py-3">{money(350,'table')}</td><td class="px-5 py-3">{badge('Under maintenance','rose')}</td></tr>
""",
        ),
    )

    write(
        "tenants.html",
        "tenants",
        "Tenants",
        "Property Manager",
        header(
            "Tenant Management",
            "Complete tenant records, deposits and ledgers",
            '<button type="button" data-action="import-csv" data-import="tenants" class="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium">Import CSV</button><button type="button" data-action="open-modal" data-modal="add-tenant" class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Add Tenant</button>',
        )
        + f'<div class="grid gap-4 sm:grid-cols-4">{kpi("Active", value="142", tone="text-emerald-600")}{kpi("Pending move-in", value="6", tone="text-sky-600")}{kpi("Vacated", value="38")}{kpi("Arrears tenants", value="23", tone="text-rose-500")}</div>'
        + table_wrap(
            search(),
            th("Tenant ID", "Name", "Phone", "Unit", "Deposit", "Balance", "Status"),
            f"""
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 text-slate-500">TNT-1042</td><td class="px-5 py-3 font-medium">Nakato Holdings Ltd</td><td class="px-5 py-3">+256 700 111 222</td><td class="px-5 py-3">A-1204</td><td class="px-5 py-3">{money(1700,'table')}</td><td class="px-5 py-3 text-emerald-600">{money(0,'table')}</td><td class="px-5 py-3">{badge('Active','green')}</td></tr>
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 text-slate-500">TNT-1043</td><td class="px-5 py-3 font-medium">Agaba Retail Ltd</td><td class="px-5 py-3">+256 772 333 444</td><td class="px-5 py-3">C-05</td><td class="px-5 py-3">{money(2400,'table')}</td><td class="px-5 py-3 text-rose-500">{money(1200,'table')}</td><td class="px-5 py-3">{badge('Active','green')}</td></tr>
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 text-slate-500">TNT-1048</td><td class="px-5 py-3 font-medium">Sarah Namutebi</td><td class="px-5 py-3">+256 755 888 999</td><td class="px-5 py-3">D-1102</td><td class="px-5 py-3">{money(1960,'table')}</td><td class="px-5 py-3 text-amber-600">{money(490,'table')}</td><td class="px-5 py-3">{badge('Active','green')}</td></tr>
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 text-slate-500">TNT-1051</td><td class="px-5 py-3 font-medium">Okello &amp; Sons</td><td class="px-5 py-3">+256 701 555 666</td><td class="px-5 py-3">Pending</td><td class="px-5 py-3">{money(900,'table')}</td><td class="px-5 py-3">{money(0,'table')}</td><td class="px-5 py-3">{badge('Pending move-in','sky')}</td></tr>
""",
        ),
    )

    write(
        "leases.html",
        "leases",
        "Leases",
        "Property Manager",
        header(
            "Lease Management",
            "Active agreements, renewals, escalations and terminations",
            '<button type="button" data-action="open-modal" data-modal="add-lease" class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Create Lease</button>',
        )
        + f'<div class="grid gap-4 sm:grid-cols-4">{kpi("Active leases", value="142")}{kpi("Expiring 60 days", value="8", tone="text-amber-600")}{kpi("Renewals pending", value="5", tone="text-sky-600")}{kpi("Terminated YTD", value="14")}</div>'
        + table_wrap(
            search(),
            th("Lease Ref", "Tenant", "Unit", "Rent", "Start", "Expiry", "Tax", "Status"),
            f"""
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">LSE-2024-088</td><td class="px-5 py-3">Nakato Holdings Ltd</td><td class="px-5 py-3">A-1204</td><td class="px-5 py-3">{money(850,'table')}</td><td class="px-5 py-3">01 Jan 2024</td><td class="px-5 py-3">31 Dec 2026</td><td class="px-5 py-3">VAT 18%</td><td class="px-5 py-3">{badge('Active','green')}</td></tr>
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">LSE-2025-014</td><td class="px-5 py-3">Agaba Retail Ltd</td><td class="px-5 py-3">C-05</td><td class="px-5 py-3">{money(1200,'table')}</td><td class="px-5 py-3">01 Mar 2025</td><td class="px-5 py-3">28 Feb 2027</td><td class="px-5 py-3">VAT 18%</td><td class="px-5 py-3">{badge('Active','green')}</td></tr>
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">LSE-2023-201</td><td class="px-5 py-3">Sarah Namutebi</td><td class="px-5 py-3">D-1102</td><td class="px-5 py-3">{money(980,'table')}</td><td class="px-5 py-3">15 Jun 2023</td><td class="px-5 py-3">14 Dec 2026</td><td class="px-5 py-3">Exempt</td><td class="px-5 py-3">{badge('Expiring soon','amber')}</td></tr>
""",
        ),
    )

    write(
        "rent.html",
        "rent",
        "Rent Invoices",
        "Accountant",
        header(
            "Automated Rent Invoicing",
            "Monthly invoices from active leases — UGX &amp; USD",
            '<button type="button" data-action="run-rent-cycle" class="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium">Generate November Cycle</button><button type="button" data-action="open-modal" data-modal="add-invoice" class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Manual Invoice</button>',
        )
        + f'<div class="grid gap-4 sm:grid-cols-4">{kpi("Issued", usd=84200)}{kpi("Paid", usd=71350, tone="text-emerald-600")}{kpi("Partial", usd=6400, tone="text-amber-600")}{kpi("Overdue", usd=28640, tone="text-rose-500")}</div>'
        + table_wrap(
            search()
            + '<select data-status-filter class="rounded-lg border border-slate-200 px-3 py-2 text-sm"><option value="all">All statuses</option><option value="paid">Paid</option><option value="partial">Partially paid</option><option value="overdue">Overdue</option><option value="issued">Issued</option></select>',
            th("Invoice", "Tenant", "Period", "Amount", "Due", "Status"),
            f"""
<tr data-status="paid" class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">INV-2026-1101</td><td class="px-5 py-3">Nakato Holdings Ltd</td><td class="px-5 py-3">Nov 2026</td><td class="px-5 py-3">{money(850,'table')}</td><td class="px-5 py-3">05 Nov 2026</td><td class="px-5 py-3">{badge('Paid','green')}</td></tr>
<tr data-status="overdue" class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">INV-2026-1102</td><td class="px-5 py-3">Agaba Retail Ltd</td><td class="px-5 py-3">Nov 2026</td><td class="px-5 py-3">{money(1200,'table')}</td><td class="px-5 py-3">05 Nov 2026</td><td class="px-5 py-3">{badge('Overdue','rose')}</td></tr>
<tr data-status="partial" class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">INV-2026-1108</td><td class="px-5 py-3">Sarah Namutebi</td><td class="px-5 py-3">Nov 2026</td><td class="px-5 py-3">{money(980,'table')}</td><td class="px-5 py-3">05 Nov 2026</td><td class="px-5 py-3">{badge('Partially paid','amber')}</td></tr>
<tr data-status="issued" class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">INV-2026-1115</td><td class="px-5 py-3">Mubiru Logistics</td><td class="px-5 py-3">Nov 2026</td><td class="px-5 py-3">{money(1500,'table')}</td><td class="px-5 py-3">05 Nov 2026</td><td class="px-5 py-3">{badge('Issued','sky')}</td></tr>
""",
        ),
    )

    write(
        "payments.html",
        "payments",
        "Collections",
        "Cashier",
        header(
            "Payment Collection",
            "Bank, cash, mobile money &amp; card receipts",
            '<button type="button" data-action="import-csv" data-import="payments" class="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium">Import Statement</button><button type="button" data-action="open-modal" data-modal="record-payment" class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Record Payment</button>',
        )
        + f'<div class="grid gap-4 sm:grid-cols-4">{kpi("Collected MTD", usd=71350, tone="text-emerald-600")}{kpi("Mobile money", usd=28400)}{kpi("Bank transfer", usd=35100)}{kpi("Unallocated", usd=1850, tone="text-amber-600")}</div>'
        + table_wrap(
            search(),
            th("Receipt", "Date", "Tenant", "Method", "Reference", "Amount", "Allocation"),
            f"""
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">RCP-8841</td><td class="px-5 py-3">10 Nov 2026</td><td class="px-5 py-3">Nakato Holdings Ltd</td><td class="px-5 py-3">Bank transfer</td><td class="px-5 py-3 text-slate-500">FT260110882</td><td class="px-5 py-3">{money(850,'table')}</td><td class="px-5 py-3">{badge('Allocated','green')}</td></tr>
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">RCP-8842</td><td class="px-5 py-3">09 Nov 2026</td><td class="px-5 py-3">Sarah Namutebi</td><td class="px-5 py-3">MTN MoMo</td><td class="px-5 py-3 text-slate-500">MM261109441</td><td class="px-5 py-3">{money(490,'table')}</td><td class="px-5 py-3">{badge('Partial','amber')}</td></tr>
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">RCP-8845</td><td class="px-5 py-3">08 Nov 2026</td><td class="px-5 py-3">Unidentified</td><td class="px-5 py-3">Airtel Money</td><td class="px-5 py-3 text-slate-500">AM261108992</td><td class="px-5 py-3">{money(300,'table')}</td><td class="px-5 py-3">{badge('Unmatched','rose')}</td></tr>
""",
        ),
    )

    write(
        "arrears.html",
        "arrears",
        "Arrears",
        "Property Manager",
        header(
            "Rent Arrears Aging",
            "Outstanding balances by tenant with automated reminders",
            '<button type="button" data-action="send-reminders" class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Send Overdue Reminders</button>',
        )
        + f'<div class="grid gap-4 sm:grid-cols-4">{kpi("0–30 days", usd=8400)}{kpi("31–60 days", usd=9200, tone="text-amber-600")}{kpi("61–90 days", usd=6100, tone="text-rose-500")}{kpi("90+ days", usd=4940, tone="text-rose-600")}</div>'
        + table_wrap(
            search(),
            th("Tenant", "Unit", "Oldest invoice", "Days overdue", "Balance", "Action"),
            f"""
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">Agaba Retail Ltd</td><td class="px-5 py-3">C-05</td><td class="px-5 py-3">INV-2026-1102</td><td class="px-5 py-3 text-rose-500">7</td><td class="px-5 py-3">{money(1200,'table')}</td><td class="px-5 py-3"><button type="button" data-action="send-reminders" class="text-sm font-medium text-emerald-600 hover:underline">Remind</button></td></tr>
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">Sarah Namutebi</td><td class="px-5 py-3">D-1102</td><td class="px-5 py-3">INV-2026-1108</td><td class="px-5 py-3 text-amber-600">7</td><td class="px-5 py-3">{money(490,'table')}</td><td class="px-5 py-3"><button type="button" data-action="send-reminders" class="text-sm font-medium text-emerald-600 hover:underline">Remind</button></td></tr>
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">Kasozi Traders</td><td class="px-5 py-3">Mall-12</td><td class="px-5 py-3">INV-2026-0912</td><td class="px-5 py-3 text-rose-600">62</td><td class="px-5 py-3">{money(3600,'table')}</td><td class="px-5 py-3"><button type="button" data-action="send-reminders" class="text-sm font-medium text-emerald-600 hover:underline">Remind</button></td></tr>
""",
        ),
    )

    # Expenses, suppliers, maintenance
    write(
        "expenses.html",
        "expenses",
        "Expenses",
        "Procurement Officer",
        header(
            "Expense Management",
            "Draft → Submitted → Approved → Posted → Paid",
            '<button type="button" data-action="open-modal" data-modal="add-expense" class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Record Expense</button>',
        )
        + f'<div class="grid gap-4 sm:grid-cols-4">{kpi("MTD expenses", usd=18420)}{kpi("Awaiting approval", usd=4200, tone="text-amber-600")}{kpi("Unpaid approved", usd=12680, tone="text-rose-500")}{kpi("Paid MTD", usd=9800, tone="text-emerald-600")}</div>'
        + table_wrap(
            search(),
            th("Ref", "Property", "Category", "Supplier", "Amount", "Tax", "Status"),
            f"""
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">EXP-4412</td><td class="px-5 py-3">Kololo Heights</td><td class="px-5 py-3">Repairs</td><td class="px-5 py-3">Kampala Plumbing Co</td><td class="px-5 py-3">{money(680,'table')}</td><td class="px-5 py-3">VAT 18%</td><td class="px-5 py-3">{badge('Approved','green')}</td></tr>
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">EXP-4418</td><td class="px-5 py-3">Ntinda Business Park</td><td class="px-5 py-3">Security</td><td class="px-5 py-3">SecureGuard UG</td><td class="px-5 py-3">{money(2200,'table')}</td><td class="px-5 py-3">WHT 6%</td><td class="px-5 py-3">{badge('Submitted','amber')}</td></tr>
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">EXP-4420</td><td class="px-5 py-3">Shared</td><td class="px-5 py-3">Insurance</td><td class="px-5 py-3">Jubilee Insurance</td><td class="px-5 py-3">{money(3100,'table')}</td><td class="px-5 py-3">Exempt</td><td class="px-5 py-3">{badge('Payment scheduled','sky')}</td></tr>
""",
        ),
    )

    write(
        "suppliers.html",
        "suppliers",
        "Suppliers",
        "Procurement Officer",
        header(
            "Supplier Management",
            "Contractors, TIN, VAT/WHT classification and payables",
            '<button type="button" data-action="open-modal" data-modal="add-supplier" class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Add Supplier</button>',
        )
        + f'<div class="grid gap-4 sm:grid-cols-3">{kpi("Active suppliers", value="48")}{kpi("Outstanding payables", usd=12680, tone="text-amber-600")}{kpi("WHT certificates due", value="6", tone="text-violet-600")}</div>'
        + table_wrap(
            search(),
            th("Supplier", "TIN", "VAT", "WHT class", "Terms", "Payable", "Status"),
            f"""
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">Kampala Plumbing Co</td><td class="px-5 py-3 text-slate-500">1000123456</td><td class="px-5 py-3">Registered</td><td class="px-5 py-3">Services 6%</td><td class="px-5 py-3">Net 30</td><td class="px-5 py-3">{money(680,'table')}</td><td class="px-5 py-3">{badge('Active','green')}</td></tr>
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">SecureGuard UG</td><td class="px-5 py-3 text-slate-500">1000987654</td><td class="px-5 py-3">Registered</td><td class="px-5 py-3">Services 6%</td><td class="px-5 py-3">Net 15</td><td class="px-5 py-3">{money(2200,'table')}</td><td class="px-5 py-3">{badge('Active','green')}</td></tr>
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">Jubilee Insurance</td><td class="px-5 py-3 text-slate-500">1000555123</td><td class="px-5 py-3">Registered</td><td class="px-5 py-3">N/A</td><td class="px-5 py-3">Net 30</td><td class="px-5 py-3">{money(3100,'table')}</td><td class="px-5 py-3">{badge('Active','green')}</td></tr>
""",
        ),
    )

    write(
        "maintenance.html",
        "maintenance",
        "Maintenance",
        "Property Manager",
        header(
            "Property Maintenance",
            "Requests, quotations, contractors and cost history",
            '<button type="button" data-action="open-modal" data-modal="add-maintenance" class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">New Request</button>',
        )
        + f'<div class="grid gap-4 sm:grid-cols-4">{kpi("Open", value="11", tone="text-amber-600")}{kpi("In progress", value="5", tone="text-sky-600")}{kpi("Awaiting quote", value="3")}{kpi("Completed MTD", value="18", tone="text-emerald-600")}</div>'
        + table_wrap(
            search(),
            th("Ticket", "Property / Unit", "Issue", "Priority", "Contractor", "Cost", "Status"),
            f"""
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">MNT-301</td><td class="px-5 py-3">Kololo · A-1204</td><td class="px-5 py-3">Leaking kitchen sink</td><td class="px-5 py-3">{badge('High','rose')}</td><td class="px-5 py-3">Kampala Plumbing Co</td><td class="px-5 py-3">{money(180,'table')}</td><td class="px-5 py-3">{badge('In progress','sky')}</td></tr>
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">MNT-305</td><td class="px-5 py-3">Bugolobi · E-03</td><td class="px-5 py-3">Electrical panel fault</td><td class="px-5 py-3">{badge('Critical','rose')}</td><td class="px-5 py-3">Pending quote</td><td class="px-5 py-3">—</td><td class="px-5 py-3">{badge('Quotation pending','amber')}</td></tr>
<tr class="hover:bg-slate-50/70"><td class="px-5 py-3 font-medium">MNT-298</td><td class="px-5 py-3">Ntinda · C-05</td><td class="px-5 py-3">AC servicing</td><td class="px-5 py-3">{badge('Medium','sky')}</td><td class="px-5 py-3">CoolAir Services</td><td class="px-5 py-3">{money(95,'table')}</td><td class="px-5 py-3">{badge('Completed','green')}</td></tr>
""",
        ),
    )

    print("batch 1 complete")


if __name__ == "__main__":
    main()
