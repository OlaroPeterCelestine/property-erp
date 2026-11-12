#!/usr/bin/env python3
"""Expand list-page tables with richer mock rows and wire tables.js."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

PROPERTIES = [
    "Kololo Heights",
    "Ntinda Business Park",
    "Nakasero Residences",
    "Entebbe Road Mall",
    "Bugolobi Flats",
    "Old Jinja Warehouse",
]

TENANTS = [
    "Nakato Holdings Ltd",
    "Agaba Retail Ltd",
    "Sarah Namutebi",
    "Okello Family Trust",
    "Fintech UG",
    "LogiMove Ltd",
    "Joan Kizza",
    "Brian Mugisha",
    "Achieng Consulting",
    "Rita Nalwoga",
    "Paul Kato",
    "Musoke Traders",
    "Lillian Asiimwe",
    "City Mart",
    "Fashion Hub UG",
    "PhoneZone",
    "Book Corner",
    "CoolAir Services",
    "SecureGuard UG",
    "Denis Wanyama",
]

SUPPLIERS = [
    "Kampala Plumbing Co",
    "SecureGuard UG",
    "CoolAir Services",
    "Sparkle Facilities",
    "UAP Old Mutual",
    "BuildRight Contractors",
    "UMEME / NWSC",
    "Audit Partners",
]


def pill(status: str) -> str:
    mapping = {
        "Active": "bg-brand-50 text-brand-600",
        "Occupied": "bg-brand-50 text-brand-600",
        "Paid": "bg-brand-50 text-brand-600",
        "Approved": "bg-brand-50 text-brand-600",
        "Completed": "bg-brand-50 text-brand-600",
        "Matched": "bg-brand-50 text-brand-600",
        "Posted": "bg-brand-50 text-brand-600",
        "Vacant": "bg-amber-50 text-amber-600",
        "Submitted": "bg-amber-50 text-amber-600",
        "Partially paid": "bg-amber-50 text-amber-600",
        "Under maintenance": "bg-amber-50 text-amber-600",
        "In progress": "bg-sky-50 text-sky-600",
        "Issued": "bg-sky-50 text-sky-600",
        "Pending move-in": "bg-sky-50 text-sky-600",
        "Pending": "bg-sky-50 text-sky-600",
        "Overdue": "bg-rose-50 text-rose-600",
        "Critical": "bg-rose-50 text-rose-600",
        "High": "bg-rose-50 text-rose-600",
        "Unmatched": "bg-rose-50 text-rose-600",
        "Inactive": "bg-slate-100 text-slate-600",
        "Draft": "bg-slate-100 text-slate-600",
        "Medium": "bg-sky-50 text-sky-600",
        "Low": "bg-slate-100 text-slate-600",
        "Expired": "bg-rose-50 text-rose-600",
        "Terminated": "bg-slate-100 text-slate-600",
        "Quotation pending": "bg-amber-50 text-amber-600",
        "Scheduled": "bg-amber-50 text-amber-600",
        "Restricted": "bg-violet-50 text-violet-600",
        "Finance only": "bg-sky-50 text-sky-600",
    }
    cls = mapping.get(status, "bg-slate-100 text-slate-600")
    return f'<span class="rounded-full {cls} px-2.5 py-1 text-xs font-medium">{status}</span>'


def money(usd: int | float) -> str:
    return f'<div data-usd="{int(usd)}" data-price-layout="table"></div>'


def replace_tbody(html: str, rows_html: str) -> str:
    return re.sub(
        r'(<tbody[^>]*data-filterable[^>]*>)(.*?)(</tbody>)',
        lambda m: f"{m.group(1)}\n{rows_html}\n{m.group(3)}",
        html,
        count=1,
        flags=re.S,
    )


def ensure_script(html: str) -> str:
    if "js/tables.js" in html:
        return html
    if "js/app.js" in html:
        return html.replace(
            '<script src="js/app.js"></script>',
            '<script src="js/tables.js"></script>\n  <script src="js/app.js"></script>',
            1,
        )
    return html


def toolbar(search_ph: str, extra_selects: str = "") -> str:
    return (
        '<div data-table-toolbar class="flex flex-wrap items-center gap-2 border-b border-slate-100 p-4">'
        f'<input data-table-search type="search" placeholder="{search_ph}" '
        'class="min-w-[180px] flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-300 focus:bg-white" />'
        f"{extra_selects}"
        "</div>"
    )


def replace_toolbar_section(html: str, new_toolbar: str) -> str:
    return re.sub(
        r'<div class="flex flex-wrap gap-2 border-b border-slate-100 p-4">.*?</div>',
        new_toolbar,
        html,
        count=1,
        flags=re.S,
    )


def build_properties() -> str:
    data = [
        ("PRP-001", "Kololo Heights", "Kololo, Kampala", "Residential", 42, "Active", 24200),
        ("PRP-002", "Ntinda Business Park", "Ntinda, Kampala", "Commercial", 28, "Active", 17000),
        ("PRP-003", "Nakasero Residences", "Nakasero, Kampala", "Residential", 36, "Active", 11800),
        ("PRP-004", "Entebbe Road Mall", "Entebbe Rd", "Commercial", 18, "Under maintenance", 8200),
        ("PRP-005", "Bugolobi Flats", "Bugolobi", "Residential", 24, "Active", 6900),
        ("PRP-006", "Old Jinja Warehouse", "Industrial Area", "Commercial", 6, "Inactive", 0),
        ("PRP-007", "Muyenga Terraces", "Muyenga", "Residential", 16, "Active", 5400),
        ("PRP-008", "Acacia Mall Annex", "Kisementi", "Commercial", 12, "Active", 9100),
        ("PRP-009", "Namugongo Court", "Namugongo", "Residential", 20, "Active", 4300),
        ("PRP-010", "Port Bell Yards", "Luzira", "Commercial", 8, "Under maintenance", 2100),
        ("PRP-011", "Makerere Suites", "Wandegeya", "Residential", 30, "Active", 7600),
        ("PRP-012", "Kira Road Offices", "Kira Rd", "Commercial", 14, "Active", 10200),
        ("PRP-013", "Bbunga Villas", "Bbunga", "Residential", 10, "Inactive", 0),
        ("PRP-014", "Kawuku Studios", "Kawuku", "Residential", 22, "Active", 3800),
        ("PRP-015", "Industrial Shed C", "Namanve", "Commercial", 5, "Active", 6400),
        ("PRP-016", "Naalya Heights", "Naalya", "Residential", 26, "Active", 8700),
        ("PRP-017", "Garden City Retail", "Yusuf Lule Rd", "Commercial", 9, "Active", 11200),
        ("PRP-018", "Lubowa Park Homes", "Lubowa", "Residential", 18, "Under maintenance", 2900),
        ("PRP-019", "Jinja Road Hub", "Jinja Rd", "Commercial", 11, "Active", 7200),
        ("PRP-020", "Nsambya Flats", "Nsambya", "Residential", 28, "Active", 5100),
        ("PRP-021", "Gaba Lakeside", "Gaba", "Residential", 14, "Active", 4600),
        ("PRP-022", "Mukono Depot", "Mukono", "Commercial", 4, "Inactive", 0),
        ("PRP-023", "Bukoto Towers", "Bukoto", "Residential", 32, "Active", 13400),
        ("PRP-024", "Wandegeya Shops", "Wandegeya", "Commercial", 15, "Active", 5800),
    ]
    slugs = {
        "Kololo Heights": "kololo-heights",
        "Ntinda Business Park": "ntinda-business-park",
        "Nakasero Residences": "nakasero-residences",
        "Entebbe Road Mall": "entebbe-road-mall",
        "Bugolobi Flats": "bugolobi-flats",
        "Old Jinja Warehouse": "old-jinja-warehouse",
    }
    rows = []
    for code, name, loc, typ, units, status, net in data:
        slug = slugs.get(name, name.lower().replace(" ", "-"))
        href = f'property.html?id={slug}' if name in slugs else "properties.html"
        rows.append(
            "<tr "
            f'data-status="{status}" data-type="{typ}" data-property="{name}" '
            'class="hover:bg-slate-50/70">'
            f'<td class="px-5 py-3 text-slate-500">{code}</td>'
            f'<td class="px-5 py-3 font-medium"><a href="{href}" class="text-slate-900 hover:text-emerald-600 hover:underline">{name}</a></td>'
            f'<td class="px-5 py-3">{loc}</td>'
            f'<td class="px-5 py-3">{typ}</td>'
            f'<td class="px-5 py-3">{units}</td>'
            f'<td class="px-5 py-3">{pill(status)}</td>'
            f'<td class="px-5 py-3">{money(net)}</td>'
            f'<td class="px-5 py-3"><a href="{href}" class="text-sm font-medium text-emerald-600 hover:underline">Analytics →</a></td>'
            "</tr>"
        )
    return "\n".join(rows)


def build_units() -> str:
    types = ["Studio", "1 Bed", "2 Bed", "3 Bed", "Shop", "Office"]
    statuses = ["Occupied", "Vacant", "Under maintenance"]
    rows = []
    for i in range(1, 37):
        prop = PROPERTIES[i % len(PROPERTIES)]
        status = statuses[i % len(statuses)] if i % 7 == 0 else ("Vacant" if i % 5 == 0 else "Occupied")
        typ = types[i % len(types)]
        tenant = "—" if status != "Occupied" else TENANTS[i % len(TENANTS)]
        unit = f"{chr(65 + (i % 6))}-{(i % 14) + 1:02d}{(i % 9) + 1}"
        rent = 280 + (i * 37) % 1600
        rows.append(
            f'<tr data-status="{status}" data-property="{prop}" data-type="{typ}" class="hover:bg-slate-50/70">'
            f'<td class="px-5 py-3 font-medium">{unit}</td>'
            f'<td class="px-5 py-3">{prop}</td>'
            f'<td class="px-5 py-3">{(i % 12) + 1 if "Shop" not in typ else "G"}</td>'
            f'<td class="px-5 py-3">{typ}</td>'
            f'<td class="px-5 py-3">{tenant}</td>'
            f'<td class="px-5 py-3">{money(rent)}</td>'
            f'<td class="px-5 py-3">{pill(status)}</td>'
            "</tr>"
        )
    return "\n".join(rows)


def build_tenants() -> str:
    statuses = ["Active", "Pending move-in", "Active", "Active", "Vacated", "Suspended"]
    rows = []
    for i in range(1, 33):
        status = statuses[i % len(statuses)]
        name = TENANTS[i % len(TENANTS)]
        unit = f"{chr(65 + (i % 5))}-{(i % 20) + 1:02d}"
        deposit = 400 + (i * 50) % 2000
        balance = 0 if i % 4 else (150 + i * 40)
        bal_cls = "text-emerald-600" if balance == 0 else "text-rose-500"
        pill_status = "Inactive" if status == "Vacated" else status
        rows.append(
            f'<tr data-status="{status}" data-property="{PROPERTIES[i % len(PROPERTIES)]}" class="hover:bg-slate-50/70">'
            f'<td class="px-5 py-3 text-slate-500">TNT-{1000 + i}</td>'
            f'<td class="px-5 py-3 font-medium">{name}</td>'
            f'<td class="px-5 py-3">+256 700 {(100 + i):03d} {(200 + i):03d}</td>'
            f'<td class="px-5 py-3">{unit}</td>'
            f'<td class="px-5 py-3">{money(deposit)}</td>'
            f'<td class="px-5 py-3 {bal_cls}">{money(balance)}</td>'
            f'<td class="px-5 py-3">{pill(pill_status).replace(">Inactive<", ">Vacated<")}</td>'
            "</tr>"
        )
    return "\n".join(rows)


def build_leases() -> str:
    statuses = ["Active", "Active", "Expiring", "Active", "Terminated", "Expired"]
    taxes = ["VAT 18%", "Exempt", "Zero-rated", "VAT 18%"]
    rows = []
    for i in range(1, 29):
        status = statuses[i % len(statuses)]
        display = "Active" if status == "Expiring" else status
        if status == "Expiring":
            display = "Active"
        tenant = TENANTS[i % len(TENANTS)]
        unit = f"{chr(65 + (i % 6))}-{(i % 15) + 1:02d}"
        rent = 350 + (i * 55) % 1800
        rows.append(
            f'<tr data-status="{display if status != "Expiring" else "Active"}" data-property="{PROPERTIES[i % len(PROPERTIES)]}" data-type="{taxes[i % len(taxes)]}" class="hover:bg-slate-50/70">'
            f'<td class="px-5 py-3 font-medium">LSE-2024-{80 + i:03d}</td>'
            f'<td class="px-5 py-3">{tenant}</td>'
            f'<td class="px-5 py-3">{unit}</td>'
            f'<td class="px-5 py-3">{money(rent)}</td>'
            f'<td class="px-5 py-3">0{(i % 9) + 1} Jan 2024</td>'
            f'<td class="px-5 py-3">{"15 Jan 2027" if status == "Expiring" else "31 Dec 2026"}</td>'
            f'<td class="px-5 py-3">{taxes[i % len(taxes)]}</td>'
            f'<td class="px-5 py-3">{pill(display if status != "Expiring" else ("Expired" if status == "Expired" else display))}</td>'
            "</tr>"
        )
    # simpler clean version
    rows = []
    for i in range(1, 29):
        status = ["Active", "Active", "Active", "Expired", "Terminated", "Active"][i % 6]
        tax = taxes[i % len(taxes)]
        rows.append(
            f'<tr data-status="{status}" data-property="{PROPERTIES[i % len(PROPERTIES)]}" data-type="{tax}" class="hover:bg-slate-50/70">'
            f'<td class="px-5 py-3 font-medium">LSE-2024-{80 + i:03d}</td>'
            f'<td class="px-5 py-3">{TENANTS[i % len(TENANTS)]}</td>'
            f'<td class="px-5 py-3">{chr(65 + (i % 6))}-{(i % 15) + 1:02d}</td>'
            f'<td class="px-5 py-3">{money(350 + (i * 55) % 1800)}</td>'
            f'<td class="px-5 py-3">0{(i % 9) + 1} Jan 2024</td>'
            f'<td class="px-5 py-3">{"28 Feb 2027" if i % 5 == 0 else "31 Dec 2026"}</td>'
            f'<td class="px-5 py-3">{tax}</td>'
            f'<td class="px-5 py-3">{pill(status)}</td>'
            "</tr>"
        )
    return "\n".join(rows)


def build_rent() -> str:
    statuses = ["Paid", "Partially paid", "Overdue", "Issued", "Paid", "Overdue"]
    rows = []
    for i in range(1, 34):
        status = statuses[i % len(statuses)]
        key = {
            "Paid": "paid",
            "Partially paid": "partial",
            "Overdue": "overdue",
            "Issued": "issued",
        }[status]
        rows.append(
            f'<tr data-status="{status}" data-property="{PROPERTIES[i % len(PROPERTIES)]}" class="hover:bg-slate-50/70">'
            f'<td class="px-5 py-3 font-medium">INV-2026-{1100 + i}</td>'
            f'<td class="px-5 py-3">{TENANTS[i % len(TENANTS)]}</td>'
            f'<td class="px-5 py-3">Nov 2026</td>'
            f'<td class="px-5 py-3">{money(320 + (i * 48) % 1900)}</td>'
            f'<td class="px-5 py-3">{(i % 28) + 1:02d} Nov 2026</td>'
            f'<td class="px-5 py-3">{pill(status)}</td>'
            "</tr>"
        )
    return "\n".join(rows)


def build_payments() -> str:
    methods = ["Bank transfer", "MTN MoMo", "Airtel Money", "Cash", "Card"]
    statuses = ["Posted", "Posted", "Pending", "Posted"]
    rows = []
    for i in range(1, 31):
        method = methods[i % len(methods)]
        status = statuses[i % len(statuses)]
        rows.append(
            f'<tr data-status="{status}" data-method="{method}" data-property="{PROPERTIES[i % len(PROPERTIES)]}" class="hover:bg-slate-50/70">'
            f'<td class="px-5 py-3 font-medium">PAY-26{1000 + i}</td>'
            f'<td class="px-5 py-3">{TENANTS[i % len(TENANTS)]}</td>'
            f'<td class="px-5 py-3">{money(250 + (i * 63) % 2200)}</td>'
            f'<td class="px-5 py-3">{method}</td>'
            f'<td class="px-5 py-3">MM2611{i:04d}</td>'
            f'<td class="px-5 py-3">{(i % 28) + 1:02d} Nov 2026</td>'
            f'<td class="px-5 py-3">{pill(status)}</td>'
            "</tr>"
        )
    return "\n".join(rows)


def build_arrears() -> str:
    rows = []
    for i in range(1, 28):
        days = [5, 12, 18, 27, 35, 48, 61, 74][i % 8]
        aging = "1-7 days" if days <= 7 else "8-30 days" if days <= 30 else "31-60 days" if days <= 60 else "60+ days"
        rows.append(
            f'<tr data-aging="{aging}" data-property="{PROPERTIES[i % len(PROPERTIES)]}" class="hover:bg-slate-50/70">'
            f'<td class="px-5 py-3 font-medium">{TENANTS[i % len(TENANTS)]}</td>'
            f'<td class="px-5 py-3">{chr(65 + (i % 5))}-{(i % 12) + 1:02d}</td>'
            f'<td class="px-5 py-3">INV-2026-{1080 + i}</td>'
            f'<td class="px-5 py-3 text-rose-500">{days}</td>'
            f'<td class="px-5 py-3">{money(400 + i * 85)}</td>'
            f'<td class="px-5 py-3"><button type="button" data-action="send-reminders" class="text-sm font-medium text-emerald-600 hover:underline">Remind</button></td>'
            "</tr>"
        )
    return "\n".join(rows)


def build_expenses() -> str:
    cats = ["Repairs", "Security", "Cleaning", "Insurance", "Utilities", "Professional services"]
    statuses = ["Approved", "Submitted", "Paid", "Draft", "Approved"]
    taxes = ["VAT 18%", "WHT 6%", "Exempt", "VAT 18%"]
    rows = []
    for i in range(1, 32):
        status = statuses[i % len(statuses)]
        cat = cats[i % len(cats)]
        prop = PROPERTIES[i % len(PROPERTIES)]
        rows.append(
            f'<tr data-status="{status}" data-category="{cat}" data-property="{prop}" class="hover:bg-slate-50/70">'
            f'<td class="px-5 py-3 font-medium">EXP-{4400 + i}</td>'
            f'<td class="px-5 py-3">{prop}</td>'
            f'<td class="px-5 py-3">{cat}</td>'
            f'<td class="px-5 py-3">{SUPPLIERS[i % len(SUPPLIERS)]}</td>'
            f'<td class="px-5 py-3">{money(180 + (i * 77) % 2400)}</td>'
            f'<td class="px-5 py-3">{taxes[i % len(taxes)]}</td>'
            f'<td class="px-5 py-3">{pill(status)}</td>'
            "</tr>"
        )
    return "\n".join(rows)


def build_suppliers() -> str:
    statuses = ["Active", "Active", "Inactive", "Active"]
    vat = ["Registered", "Not registered"]
    rows = []
    names = SUPPLIERS + ["GreenScape UG", "LiftCare East Africa", "PaintPro Uganda", "NetLink ISP", "FireSafe Systems", "DoorTech Ltd"]
    for i, name in enumerate(names * 2, start=1):
        status = statuses[i % len(statuses)]
        rows.append(
            f'<tr data-status="{status}" data-type="{vat[i % 2]}" class="hover:bg-slate-50/70">'
            f'<td class="px-5 py-3 font-medium">SUP-{200 + i}</td>'
            f'<td class="px-5 py-3">{name}</td>'
            f'<td class="px-5 py-3">1000{800000 + i}</td>'
            f'<td class="px-5 py-3">{vat[i % 2]}</td>'
            f'<td class="px-5 py-3">{"Services 6%" if i % 2 == 0 else "Goods 6%"}</td>'
            f'<td class="px-5 py-3">{money((i * 420) % 5000)}</td>'
            f'<td class="px-5 py-3">{pill(status)}</td>'
            "</tr>"
        )
    return "\n".join(rows)


def build_maintenance() -> str:
    priorities = ["Low", "Medium", "High", "Critical"]
    statuses = ["In progress", "Quotation pending", "Completed", "Scheduled", "In progress"]
    rows = []
    for i in range(1, 29):
        priority = priorities[i % len(priorities)]
        status = statuses[i % len(statuses)]
        prop = PROPERTIES[i % len(PROPERTIES)]
        rows.append(
            f'<tr data-status="{status}" data-priority="{priority}" data-property="{prop}" class="hover:bg-slate-50/70">'
            f'<td class="px-5 py-3 font-medium">MNT-{280 + i}</td>'
            f'<td class="px-5 py-3">{prop} · {chr(65 + (i % 4))}-{(i % 10) + 1:02d}</td>'
            f'<td class="px-5 py-3">{["Leaking pipe", "AC fault", "Broken lock", "Paint touch-up", "Electrical issue", "Lift service"][i % 6]}</td>'
            f'<td class="px-5 py-3">{pill(priority)}</td>'
            f'<td class="px-5 py-3">{SUPPLIERS[i % len(SUPPLIERS)] if status != "Quotation pending" else "Pending quote"}</td>'
            f'<td class="px-5 py-3">{"—" if status == "Quotation pending" else money(80 + i * 25)}</td>'
            f'<td class="px-5 py-3">{pill(status)}</td>'
            "</tr>"
        )
    return "\n".join(rows)


def build_bank() -> str:
    statuses = ["Matched", "Unmatched", "Matched", "Unmatched", "Matched"]
    methods = ["Stanbic", "MTN MoMo", "Airtel Money", "Centenary"]
    rows = []
    for i in range(1, 30):
        status = statuses[i % len(statuses)]
        method = methods[i % len(methods)]
        rows.append(
            f'<tr data-status="{status}" data-method="{method}" class="hover:bg-slate-50/70">'
            f'<td class="px-5 py-3 font-medium">{(i % 28) + 1:02d} Nov 2026</td>'
            f'<td class="px-5 py-3">{method}</td>'
            f'<td class="px-5 py-3">STMT-NOV-{i:03d}</td>'
            f'<td class="px-5 py-3">{["Rent receipt", "Supplier payment", "Transfer", "Fee", "MoMo collection"][i % 5]}</td>'
            f'<td class="px-5 py-3">{money(120 + i * 95)}</td>'
            f'<td class="px-5 py-3">{"INV-2026-" + str(1100 + i) if status == "Matched" else "—"}</td>'
            f'<td class="px-5 py-3">{pill(status)}</td>'
            "</tr>"
        )
    return "\n".join(rows)


def build_accounting() -> str:
    statuses = ["Posted", "Posted", "Draft", "Posted"]
    rows = []
    for i in range(1, 28):
        status = statuses[i % len(statuses)]
        rows.append(
            f'<tr data-status="{status}" data-category="{["Rent income", "Repairs", "Security", "Bank charges", "VAT", "WHT"][i % 6]}" class="hover:bg-slate-50/70">'
            f'<td class="px-5 py-3 font-medium">JE-2026-{900 + i}</td>'
            f'<td class="px-5 py-3">{(i % 28) + 1:02d} Nov 2026</td>'
            f'<td class="px-5 py-3">{["Accrue rent", "Post expense", "Bank charge", "VAT output", "WHT deduction", "Deposit transfer"][i % 6]}</td>'
            f'<td class="px-5 py-3">{["1100 AR", "5100 Repairs", "5200 Security", "6100 Bank", "2100 VAT", "2200 WHT"][i % 6]}</td>'
            f'<td class="px-5 py-3">{money(200 + i * 70)}</td>'
            f'<td class="px-5 py-3">{money(200 + i * 70)}</td>'
            f'<td class="px-5 py-3">{pill(status)}</td>'
            "</tr>"
        )
    return "\n".join(rows)


def build_users() -> str:
    roles = ["Property Manager", "Accountant", "Cashier", "Auditor", "Finance Approver", "Procurement Officer"]
    statuses = ["Active", "Active", "Inactive", "Active"]
    rows = []
    names = ["Alex Okello", "Grace Atim", "Peter Ssebunya", "Audit Desk", "Mary Nabirye", "Jonah Kiggundu", "Irene Achieng", "Samuel Ocen"]
    for i, name in enumerate(names * 3, start=1):
        role = roles[i % len(roles)]
        status = statuses[i % len(statuses)]
        rows.append(
            f'<tr data-status="{status}" data-role="{role}" class="hover:bg-slate-50/70">'
            f'<td class="px-5 py-3 font-medium">{name}</td>'
            f'<td class="px-5 py-3">{name.split()[0].lower()}@propertyerp.ug</td>'
            f'<td class="px-5 py-3">{role}</td>'
            f'<td class="px-5 py-3">{"All" if i % 3 == 0 else "Kololo, Ntinda"}</td>'
            f'<td class="px-5 py-3">{"On" if i % 2 == 0 else "Off"}</td>'
            f'<td class="px-5 py-3">{pill(status)}</td>'
            "</tr>"
        )
    return "\n".join(rows)


def build_vat() -> str:
    statuses = ["Draft", "Submitted", "Filed", "Draft"]
    rows = []
    for i in range(1, 20):
        status = statuses[i % len(statuses)]
        rows.append(
            f'<tr data-status="{status}" class="hover:bg-slate-50/70">'
            f'<td class="px-5 py-3 font-medium">{"Nov" if i < 10 else "Oct"} 2026</td>'
            f'<td class="px-5 py-3">{money(800 + i * 120)}</td>'
            f'<td class="px-5 py-3">{money(300 + i * 40)}</td>'
            f'<td class="px-5 py-3">{money(500 + i * 80)}</td>'
            f'<td class="px-5 py-3">{pill(status)}</td>'
            "</tr>"
        )
    return "\n".join(rows)


def build_wht() -> str:
    statuses = ["Pending certificate", "Issued", "Remitted", "Pending certificate"]
    # map to simpler status labels that pills support
    display = {
        "Pending certificate": "Pending",
        "Issued": "Issued",
        "Remitted": "Paid",
    }
    rows = []
    for i in range(1, 22):
        status = statuses[i % len(statuses)]
        rows.append(
            f'<tr data-status="{display[status]}" data-property="{PROPERTIES[i % len(PROPERTIES)]}" class="hover:bg-slate-50/70">'
            f'<td class="px-5 py-3 font-medium">WHT-{300 + i}</td>'
            f'<td class="px-5 py-3">{SUPPLIERS[i % len(SUPPLIERS)]}</td>'
            f'<td class="px-5 py-3">Services 6%</td>'
            f'<td class="px-5 py-3">{money(40 + i * 12)}</td>'
            f'<td class="px-5 py-3">{pill(display[status])}</td>'
            "</tr>"
        )
    return "\n".join(rows)


BUILDERS = {
    "properties.html": build_properties,
    "units.html": build_units,
    "tenants.html": build_tenants,
    "leases.html": build_leases,
    "rent.html": build_rent,
    "payments.html": build_payments,
    "arrears.html": build_arrears,
    "expenses.html": build_expenses,
    "suppliers.html": build_suppliers,
    "maintenance.html": build_maintenance,
    "bank.html": build_bank,
    "accounting.html": build_accounting,
    "users.html": build_users,
    "vat.html": build_vat,
    "wht.html": build_wht,
}


def main() -> None:
    for name, builder in BUILDERS.items():
        path = ROOT / name
        html = path.read_text()
        html = ensure_script(html)
        html = replace_tbody(html, builder())
        # Normalize toolbar wrapper if present
        html = re.sub(
            r'<div class="flex flex-wrap gap-2 border-b border-slate-100 p-4">',
            '<div data-table-toolbar class="flex flex-wrap items-center gap-2 border-b border-slate-100 p-4">',
            html,
            count=1,
        )
        path.write_text(html)
        print("updated", name)

    # documents + remaining pages: just ensure tables.js
    for path in ROOT.glob("*.html"):
        text = path.read_text()
        new = ensure_script(text)
        if new != text:
            path.write_text(new)
            print("script", path.name)


if __name__ == "__main__":
    main()
