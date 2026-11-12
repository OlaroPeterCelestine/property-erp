#!/usr/bin/env python3
"""Generate Property ERP client pitch PDF."""

from pathlib import Path

from reportlab.lib.colors import Color, HexColor, white, black
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

OUT = Path(__file__).resolve().parents[1] / "Property-ERP-Client-Pitch.pdf"
W, H = A4

TEAL = HexColor("#0d9488")
TEAL_DEEP = HexColor("#0f766e")
TEAL_SOFT = HexColor("#ccfbf1")
TEAL_MID = HexColor("#14b8a6")
INK = HexColor("#0f172a")
MUTED = HexColor("#64748b")
LINE = HexColor("#e2e8f0")
SURFACE = HexColor("#f3f4f6")
AMBER = HexColor("#d97706")
SKY = HexColor("#0284c7")


def draw_header_bar(c, title=None):
    c.setFillColor(TEAL_DEEP)
    c.rect(0, H - 8 * mm, W, 8 * mm, fill=1, stroke=0)
    if title:
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 8)
        c.drawString(18 * mm, H - 14 * mm, "Property ERP  ·  Client Pitch")
        c.drawRightString(W - 18 * mm, H - 14 * mm, title)


def draw_footer(c, page, total):
    c.setStrokeColor(LINE)
    c.setLineWidth(0.5)
    c.line(18 * mm, 14 * mm, W - 18 * mm, 14 * mm)
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 8)
    c.drawString(18 * mm, 8 * mm, "Confidential  ·  Uganda  ·  UGX-first")
    c.drawRightString(W - 18 * mm, 8 * mm, f"{page} / {total}")


def rounded_rect(c, x, y, w, h, r=6, fill=None, stroke=None, sw=0.8):
    c.saveState()
    if fill:
        c.setFillColor(fill)
    if stroke:
        c.setStrokeColor(stroke)
        c.setLineWidth(sw)
    c.roundRect(x, y, w, h, r, fill=1 if fill else 0, stroke=1 if stroke else 0)
    c.restoreState()


def bullet(c, x, y, text, max_width=160 * mm, size=10, leading=14, color=INK):
    c.setFillColor(TEAL_MID)
    c.circle(x + 1.6 * mm, y + 1.2 * mm, 1.1 * mm, fill=1, stroke=0)
    c.setFillColor(color)
    c.setFont("Helvetica", size)
    # simple wrap
    words = text.split()
    lines = []
    cur = ""
    for w in words:
        test = f"{cur} {w}".strip()
        if c.stringWidth(test, "Helvetica", size) <= max_width:
            cur = test
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    for i, line in enumerate(lines):
        c.drawString(x + 5 * mm, y - i * leading, line)
    return len(lines) * leading


def page_cover(c, total):
    # Full teal wash
    c.setFillColor(TEAL_DEEP)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(TEAL)
    c.setFillColor(Color(0.08, 0.58, 0.53, alpha=0.35))
    path = c.beginPath()
    path.moveTo(0, H * 0.55)
    path.curveTo(W * 0.3, H * 0.7, W * 0.6, H * 0.35, W, H * 0.5)
    path.lineTo(W, 0)
    path.lineTo(0, 0)
    path.close()
    c.setFillColor(HexColor("#14b8a6"))
    c.setFillAlpha(0.25)
    c.drawPath(path, fill=1, stroke=0)
    c.setFillAlpha(1)

    # Brand mark
    rounded_rect(c, 22 * mm, H - 42 * mm, 14 * mm, 14 * mm, r=4, fill=white)
    c.setFillColor(TEAL_DEEP)
    c.setFont("Helvetica-Bold", 11)
    c.drawCentredString(29 * mm, H - 36.5 * mm, "PE")

    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(40 * mm, H - 33 * mm, "Property ERP")
    c.setFont("Helvetica", 9)
    c.setFillColor(TEAL_SOFT)
    c.drawString(40 * mm, H - 38 * mm, "Uganda  ·  URA ready  ·  UGX-first")

    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 28)
    c.drawString(22 * mm, H * 0.58, "Run your portfolio")
    c.drawString(22 * mm, H * 0.58 - 12 * mm, "like a command centre.")

    c.setFont("Helvetica", 11)
    c.setFillColor(TEAL_SOFT)
    text = (
        "A modern property operating system for Kampala landlords and managers — "
        "rent, arrears, VAT/WHT, WhatsApp collections, and smart meter cut-off in one place."
    )
    # wrap
    words = text.split()
    lines, cur = [], ""
    for w in words:
        test = f"{cur} {w}".strip()
        if c.stringWidth(test, "Helvetica", 11) < 150 * mm:
            cur = test
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    y = H * 0.58 - 28 * mm
    for line in lines:
        c.drawString(22 * mm, y, line)
        y -= 5.5 * mm

    # CTA box
    rounded_rect(c, 22 * mm, 32 * mm, 110 * mm, 28 * mm, r=8, fill=white)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(28 * mm, 48 * mm, "Live product")
    c.setFont("Helvetica", 9)
    c.setFillColor(MUTED)
    c.drawString(28 * mm, 41 * mm, "https://property-erp-iota.vercel.app")
    c.drawString(28 * mm, 36 * mm, "Prepared for client presentation  ·  2026")

    c.setFillColor(TEAL_SOFT)
    c.setFont("Helvetica", 8)
    c.drawRightString(W - 18 * mm, 10 * mm, f"1 / {total}")
    c.showPage()


def page_problem(c, page, total):
    draw_header_bar(c, "The challenge")
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 20)
    c.drawString(18 * mm, H - 28 * mm, "Property ops are still scattered.")

    c.setFillColor(MUTED)
    c.setFont("Helvetica", 10)
    c.drawString(18 * mm, H - 36 * mm, "Most Kampala portfolios still run on spreadsheets, WhatsApp chats, and paper files.")

    problems = [
        ("Rent leakage", "Late invoices, weak arrears chasing, and no clear UGX cash picture."),
        ("Tax friction", "VAT and WHT prepared late — URA risk and month-close stress."),
        ("Blind assets", "No live view of occupancy, NOI, or which buildings actually make money."),
        ("Slow collections", "Reminders and viewing bookings live outside the system of record."),
        ("Utility control", "Cutting power/water for arrears is manual, inconsistent, and hard to audit."),
        ("No single source", "Owners get different numbers from managers, accountants, and caretakers."),
    ]

    cols = 2
    card_w = 85 * mm
    card_h = 32 * mm
    gap = 6 * mm
    start_y = H - 48 * mm
    for i, (title, body) in enumerate(problems):
        col = i % cols
        row = i // cols
        x = 18 * mm + col * (card_w + gap)
        y = start_y - row * (card_h + gap) - card_h
        rounded_rect(c, x, y, card_w, card_h, r=8, fill=SURFACE, stroke=LINE)
        c.setFillColor(TEAL_DEEP)
        c.setFont("Helvetica-Bold", 11)
        c.drawString(x + 5 * mm, y + card_h - 10 * mm, title)
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 9)
        # wrap body
        words = body.split()
        lines, cur = [], ""
        for w in words:
            test = f"{cur} {w}".strip()
            if c.stringWidth(test, "Helvetica", 9) < card_w - 12 * mm:
                cur = test
            else:
                lines.append(cur)
                cur = w
        if cur:
            lines.append(cur)
        by = y + card_h - 17 * mm
        for line in lines[:3]:
            c.drawString(x + 5 * mm, by, line)
            by -= 4.2 * mm

    draw_footer(c, page, total)
    c.showPage()


def page_solution(c, page, total):
    draw_header_bar(c, "The solution")
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 20)
    c.drawString(18 * mm, H - 28 * mm, "Property ERP — one operating system.")

    c.setFillColor(MUTED)
    c.setFont("Helvetica", 10)
    c.drawString(18 * mm, H - 36 * mm, "Built for Uganda: UGX primary, USD secondary, URA-aware finance, WhatsApp-native ops.")

    pillars = [
        ("Portfolio analytics", "Photo-led assets with occupancy, collections, NOI, yield, and analyst notes per property."),
        ("Rent & arrears", "Invoices, dual-currency ledgers, arrears aging, and one-tap WhatsApp rent reminders."),
        ("Tax & month close", "VAT, WHT, bank recon, and closing checklists for directors and accountants."),
        ("WhatsApp assistant", "Book viewings and draft collection messages without leaving the ERP."),
        ("IoT house control", "Link UMEME & NWSC meters, track kWh/m³ usage, cut or restore supply with audit trail."),
        ("Roles & control", "Owners, managers, and finance see the same numbers — with clear actions."),
    ]

    y = H - 48 * mm
    for title, body in pillars:
        rounded_rect(c, 18 * mm, y - 22 * mm, W - 36 * mm, 24 * mm, r=7, fill=white, stroke=LINE)
        c.setFillColor(TEAL)
        c.circle(28 * mm, y - 10 * mm, 3.2 * mm, fill=1, stroke=0)
        c.setFillColor(white)
        c.setFont("Helvetica-Bold", 8)
        c.drawCentredString(28 * mm, y - 11.2 * mm, "✓")
        c.setFillColor(INK)
        c.setFont("Helvetica-Bold", 11)
        c.drawString(36 * mm, y - 8 * mm, title)
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 9)
        c.drawString(36 * mm, y - 14.5 * mm, body)
        y -= 28 * mm

    draw_footer(c, page, total)
    c.showPage()


def page_modules(c, page, total):
    draw_header_bar(c, "Product modules")
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 20)
    c.drawString(18 * mm, H - 28 * mm, "What your team gets on day one.")

    modules = [
        ("Dashboard", "Portfolio KPIs, collection pulse, alerts"),
        ("Properties", "Image cards, scores, full asset analytics"),
        ("Units & Tenants", "Hierarchy, occupancy, lease status"),
        ("Rent & Payments", "Invoices, collections, dual currency"),
        ("Arrears", "Aging, reminder workflows"),
        ("Expenses", "Approvals, suppliers, cost history"),
        ("Maintenance", "Tickets, quotes, contractors"),
        ("Accounting", "GL, bank recon, VAT, WHT, close"),
        ("Reports", "Owner packs and operational views"),
        ("IoT Controls", "Power/water usage + remote cut-off"),
        ("WhatsApp Bot", "Bookings + rent reminder drafts"),
        ("Settings", "Org, tax, FX, meter connections"),
    ]

    card_w = 56 * mm
    card_h = 28 * mm
    gap = 5 * mm
    start_y = H - 42 * mm
    for i, (title, body) in enumerate(modules):
        col = i % 3
        row = i // 3
        x = 18 * mm + col * (card_w + gap)
        y = start_y - row * (card_h + gap) - card_h
        rounded_rect(c, x, y, card_w, card_h, r=7, fill=SURFACE if row % 2 == 0 else white, stroke=LINE)
        c.setFillColor(TEAL_DEEP)
        c.setFont("Helvetica-Bold", 10)
        c.drawString(x + 4 * mm, y + card_h - 9 * mm, title)
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 8)
        words = body.split()
        lines, cur = [], ""
        for w in words:
            test = f"{cur} {w}".strip()
            if c.stringWidth(test, "Helvetica", 8) < card_w - 8 * mm:
                cur = test
            else:
                lines.append(cur)
                cur = w
        if cur:
            lines.append(cur)
        by = y + card_h - 15 * mm
        for line in lines[:2]:
            c.drawString(x + 4 * mm, by, line)
            by -= 3.8 * mm

    draw_footer(c, page, total)
    c.showPage()


def page_value(c, page, total):
    draw_header_bar(c, "Why it wins")
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 20)
    c.drawString(18 * mm, H - 28 * mm, "Built for how Uganda actually operates.")

    items = [
        ("UGX-first money", "Every screen leads with Uganda Shillings; USD stays secondary for contracts and reporting."),
        ("URA-aware finance", "VAT and WHT sitting next to rent and expenses — ready for month close, not year-end panic."),
        ("Collections that close", "WhatsApp reminders and booking flows meet tenants where they already are."),
        ("Asset intelligence", "Photo portfolios, NOI, yield, occupancy trends, and analyst notes per building."),
        ("Utility leverage", "Connect UMEME/NWSC meters, see usage, and disconnect with a signed audit trail."),
        ("Fast to adopt", "Browser-based, mobile-ready, live today — no heavy install for managers on site."),
    ]

    y = H - 42 * mm
    for title, body in items:
        c.setFillColor(TEAL_MID)
        c.roundRect(18 * mm, y - 18 * mm, 4 * mm, 18 * mm, 2, fill=1, stroke=0)
        c.setFillColor(INK)
        c.setFont("Helvetica-Bold", 11)
        c.drawString(28 * mm, y - 6 * mm, title)
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 9)
        c.drawString(28 * mm, y - 12 * mm, body)
        y -= 26 * mm

    # Live URL strip
    rounded_rect(c, 18 * mm, 22 * mm, W - 36 * mm, 16 * mm, r=6, fill=TEAL_DEEP)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 10)
    c.drawCentredString(W / 2, 28 * mm, "Try it live:  https://property-erp-iota.vercel.app")

    draw_footer(c, page, total)
    c.showPage()


def page_roadmap(c, page, total):
    draw_header_bar(c, "Engagement")
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 20)
    c.drawString(18 * mm, H - 28 * mm, "A simple path to go live.")

    steps = [
        ("01", "Discovery", "Portfolio size, roles, URA needs, meter readiness, WhatsApp number."),
        ("02", "Configure", "Properties, units, tenants, tariffs, tax rates, gateway IDs."),
        ("03", "Pilot", "One residential + one commercial asset — rent cycle + reminders."),
        ("04", "Rollout", "Full portfolio, IoT links, owner dashboards, month-close pack."),
    ]

    y = H - 48 * mm
    for num, title, body in steps:
        rounded_rect(c, 18 * mm, y - 28 * mm, W - 36 * mm, 30 * mm, r=8, fill=white, stroke=LINE)
        c.setFillColor(TEAL_SOFT)
        c.circle(32 * mm, y - 13 * mm, 8 * mm, fill=1, stroke=0)
        c.setFillColor(TEAL_DEEP)
        c.setFont("Helvetica-Bold", 11)
        c.drawCentredString(32 * mm, y - 14.5 * mm, num)
        c.setFillColor(INK)
        c.setFont("Helvetica-Bold", 12)
        c.drawString(46 * mm, y - 9 * mm, title)
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 9)
        c.drawString(46 * mm, y - 16 * mm, body)
        y -= 36 * mm

    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(18 * mm, 40 * mm, "Ask from the client")
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 9)
    asks = [
        "List of properties/units and current rent roll (UGX)",
        "Preferred WhatsApp business number for reminders & bookings",
        "UMEME / NWSC meter IDs where cut-off is required",
        "Owner vs manager roles and approval rules",
    ]
    y = 33 * mm
    for a in asks:
        c.setFillColor(TEAL_MID)
        c.circle(20 * mm, y + 1 * mm, 1 * mm, fill=1, stroke=0)
        c.setFillColor(MUTED)
        c.drawString(24 * mm, y, a)
        y -= 5 * mm

    draw_footer(c, page, total)
    c.showPage()


def page_close(c, page, total):
    c.setFillColor(TEAL_DEEP)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 22)
    c.drawString(22 * mm, H * 0.62, "Ready when you are.")

    c.setFont("Helvetica", 11)
    c.setFillColor(TEAL_SOFT)
    lines = [
        "Let’s walk the live product with your portfolio data,",
        "agree the pilot assets, and lock a go-live date.",
    ]
    y = H * 0.62 - 12 * mm
    for line in lines:
        c.drawString(22 * mm, y, line)
        y -= 6 * mm

    rounded_rect(c, 22 * mm, H * 0.38, W - 44 * mm, 42 * mm, r=10, fill=white)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(30 * mm, H * 0.38 + 30 * mm, "Property ERP")
    c.setFont("Helvetica", 10)
    c.setFillColor(MUTED)
    c.drawString(30 * mm, H * 0.38 + 22 * mm, "Live demo")
    c.setFillColor(TEAL_DEEP)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(30 * mm, H * 0.38 + 14 * mm, "https://property-erp-iota.vercel.app")
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 9)
    c.drawString(30 * mm, H * 0.38 + 6 * mm, "Any login works on the demo  ·  Sign in → explore → IoT → Properties")

    c.setFillColor(TEAL_SOFT)
    c.setFont("Helvetica", 8)
    c.drawString(22 * mm, 16 * mm, "Confidential client pitch  ·  2026")
    c.drawRightString(W - 22 * mm, 16 * mm, f"{page} / {total}")
    c.showPage()


def main():
    total = 7
    c = canvas.Canvas(str(OUT), pagesize=A4)
    c.setTitle("Property ERP — Client Pitch")
    c.setAuthor("Property ERP")
    c.setSubject("Client pitch for Uganda property portfolio operations")

    page_cover(c, total)
    page_problem(c, 2, total)
    page_solution(c, 3, total)
    page_modules(c, 4, total)
    page_value(c, 5, total)
    page_roadmap(c, 6, total)
    page_close(c, 7, total)

    c.save()
    print(OUT)


if __name__ == "__main__":
    main()
