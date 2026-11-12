(function () {
  // Demo FX rate — amounts in data-usd are stored as USD, displayed UGX-first
  const USD_TO_UGX = 3700;

  function toUGX(amountUsd) {
    return Math.round(Number(amountUsd) * USD_TO_UGX);
  }

  function formatUSD(amount) {
    if (Math.abs(amount) >= 1_000_000_000) {
      return `$${(amount / 1_000_000_000).toFixed(amount % 1_000_000_000 === 0 ? 0 : 1)}B`;
    }
    if (Math.abs(amount) >= 1_000_000) {
      return `$${(amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1)}M`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  function formatUGX(amountUsd) {
    const ugx = toUGX(amountUsd);
    if (Math.abs(ugx) >= 1_000_000_000) {
      return `UGX ${(ugx / 1_000_000_000).toFixed(1)}B`;
    }
    if (Math.abs(ugx) >= 1_000_000) {
      return `UGX ${(ugx / 1_000_000).toFixed(1)}M`;
    }
    return `UGX ${new Intl.NumberFormat('en-UG').format(ugx)}`;
  }

  function renderPrice(el) {
    const usd = Number(el.dataset.usd);
    if (Number.isNaN(usd)) return;

    const layout = el.dataset.priceLayout || 'stack';
    const usdText = formatUSD(usd);
    const ugxText = formatUGX(usd);

    // Primary = UGX, secondary = USD
    if (layout === 'inline') {
      el.innerHTML = `<span class="font-semibold text-brand-600">${ugxText}</span><span class="mx-1.5 text-slate-300">·</span><span class="text-slate-500">${usdText}</span>`;
      return;
    }

    if (layout === 'table') {
      el.innerHTML = `<div class="font-semibold text-slate-800">${ugxText}</div><div class="text-xs font-normal text-slate-400">${usdText}</div>`;
      return;
    }

    // stack — primary styles historically lived on data-usd-class; apply them to UGX
    const primaryClass = el.dataset.primaryClass || el.dataset.usdClass || 'text-sm font-bold text-brand-500';
    const secondaryClass = el.dataset.secondaryClass || el.dataset.ugxClass || 'text-xs text-slate-400';
    el.innerHTML = `<div class="${primaryClass}">${ugxText}</div><div class="${secondaryClass}">${usdText}</div>`;
  }

  function init() {
    document.querySelectorAll('[data-usd]').forEach(renderPrice);
  }

  window.DatabrainMoney = { USD_TO_UGX, toUGX, formatUSD, formatUGX, init };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
