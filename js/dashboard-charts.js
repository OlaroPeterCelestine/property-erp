(function () {
  if (typeof Chart === 'undefined') return;

  Chart.defaults.font.family = 'Inter, ui-sans-serif, system-ui, sans-serif';
  Chart.defaults.color = '#94a3b8';

  const gauge = document.getElementById('kpiGauge');
  if (gauge) {
    new Chart(gauge, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [80, 20],
          backgroundColor: ['#2dd4bf', '#e2e8f0'],
          borderWidth: 0,
          circumference: 180,
          rotation: 270,
        }],
      },
      options: {
        responsive: false,
        cutout: '72%',
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
      },
    });
  }

  const asset = document.getElementById('kpiAsset');
  if (asset) {
    new Chart(asset, {
      type: 'bar',
      data: {
        labels: ['', '', '', '', '', '', ''],
        datasets: [{ data: [4, 7, 5, 9, 6, 8, 10], backgroundColor: '#38bdf8', borderRadius: 4, barPercentage: 0.55 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false, beginAtZero: true } },
      },
    });
  }

  const sold = document.getElementById('kpiSold');
  if (sold) {
    new Chart(sold, {
      type: 'bar',
      data: {
        labels: ['', '', '', '', '', '', ''],
        datasets: [{ data: [5, 3, 8, 4, 9, 6, 7], backgroundColor: '#fbbf24', borderRadius: 4, barPercentage: 0.55 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false, beginAtZero: true } },
      },
    });
  }

  const clients = document.getElementById('kpiClients');
  if (clients) {
    new Chart(clients, {
      type: 'line',
      data: {
        labels: ['', '', '', '', '', '', '', ''],
        datasets: [{
          data: [3, 5, 4, 8, 6, 9, 7, 10],
          borderColor: '#a78bfa',
          backgroundColor: 'rgba(167, 139, 250, 0.15)',
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false } },
      },
    });
  }

  const status = document.getElementById('statusChart');
  if (status) {
    new Chart(status, {
      type: 'doughnut',
      data: {
        labels: ['Collected', 'Outstanding', 'Expenses'],
        datasets: [{
          data: [71350, 28640, 18420],
          backgroundColor: ['#8b5cf6', '#fbbf24', '#38bdf8'],
          borderWidth: 0,
          hoverOffset: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const ugx = Math.round(Number(ctx.raw) * 3700);
                const ugxLabel = ugx >= 1_000_000 ? `UGX ${(ugx / 1_000_000).toFixed(1)}M` : `UGX ${ugx.toLocaleString()}`;
                return `${ctx.label}: ${ugxLabel} ($${Number(ctx.raw).toLocaleString()})`;
              },
            },
          },
        },
      },
    });
  }

  const revenue = document.getElementById('revenueChart');
  if (revenue) {
    // Values stored as USD thousands; axis labeled in UGX millions (×3.7)
    new Chart(revenue, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Collected',
            data: [48, 52, 61, 58, 66, 70, 74, 69, 72, 78, 71, 84],
            backgroundColor: '#14b8a6',
            borderRadius: { topLeft: 0, topRight: 0, bottomLeft: 6, bottomRight: 6 },
            barPercentage: 0.55,
            categoryPercentage: 0.7,
          },
          {
            label: 'Expected',
            data: [22, 18, 24, 20, 26, 21, 28, 24, 22, 25, 20, 18],
            backgroundColor: '#99f6e4',
            borderRadius: { topLeft: 6, topRight: 6, bottomLeft: 0, bottomRight: 0 },
            barPercentage: 0.55,
            categoryPercentage: 0.7,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const ugxM = (ctx.raw * 3.7).toFixed(1);
                return `${ctx.dataset.label}: UGX ${ugxM}M ($${ctx.raw}k)`;
              },
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            grid: { display: false },
            ticks: { font: { size: 11 } },
            border: { display: false },
          },
          y: {
            stacked: true,
            beginAtZero: true,
            max: 120,
            ticks: {
              stepSize: 20,
              callback: (v) => (v === 0 ? 'UGX 0' : `UGX ${(v * 3.7).toFixed(0)}M`),
              font: { size: 11 },
            },
            grid: { color: '#f1f5f9' },
            border: { display: false },
          },
        },
      },
    });
  }
})();
