// Telemetry Panel - Time-series charts for temperature, fans, speed, progress
(function() {
  window.loadTelemetryPanel = loadTelemetry;

  let currentRange = '1h';
  let _selectedTelePrinter = null;

  window.changeTelePrinter = function(value) {
    _selectedTelePrinter = value || null;
    loadTelemetry();
  };

  const RANGE_MAP = {
    '1h':  { ms: 3600000,    resolution: '30s' },
    '6h':  { ms: 21600000,   resolution: '5m' },
    '24h': { ms: 86400000,   resolution: '15m' },
    '7d':  { ms: 604800000,  resolution: '1h' }
  };

  async function loadTelemetry() {
    const panel = document.getElementById('overlay-panel-body');
    if (!panel) return;

    const printerId = _selectedTelePrinter || window.printerState.getActivePrinterId();
    _selectedTelePrinter = printerId;
    if (!printerId) {
      panel.innerHTML = `<p class="text-muted">${t('telemetry.no_printer')}</p>`;
      return;
    }

    const range = RANGE_MAP[currentRange];
    const from = new Date(Date.now() - range.ms).toISOString();
    const to = new Date().toISOString();

    try {
      const res = await fetch(`/api/telemetry?printer_id=${printerId}&from=${from}&to=${to}&resolution=${range.resolution}`);
      const data = await res.json();

      let html = buildPrinterSelector('changeTelePrinter', _selectedTelePrinter, false);

      // Time range selector
      html += '<div class="telemetry-range-selector">';
      for (const key of Object.keys(RANGE_MAP)) {
        const active = key === currentRange ? 'active' : '';
        html += `<button class="speed-btn ${active}" onclick="setTelemetryRange('${key}')">${key}</button>`;
      }
      html += '</div>';

      // Live values strip from current printer state
      html += buildLiveValues(printerId);

      if (!data || data.length === 0) {
        html += `<p class="text-muted mt-md">${t('telemetry.no_data')}</p>`;
        panel.innerHTML = html;
        return;
      }

      // Temperature chart with target lines
      const ps = window.printerState?._printers?.[printerId];
      const pd = ps?.print || ps;
      const targets = {
        nozzle_temp: pd?.nozzle_target_temper || pd?.nozzle_temper_target || 0,
        bed_temp: pd?.bed_target_temper || pd?.bed_temper_target || 0
      };

      html += `<div class="mt-md"><div class="card-title">${t('telemetry.temperatures')}</div>`;
      html += renderChart(data,
        ['nozzle_temp', 'bed_temp', 'chamber_temp'],
        { nozzle_temp: '#f85149', bed_temp: '#58a6ff', chamber_temp: '#e3b341' },
        { nozzle_temp: t('temperature.nozzle'), bed_temp: t('temperature.bed'), chamber_temp: t('temperature.chamber') },
        null, targets
      );
      html += '</div>';

      // Fan speed chart
      html += `<div class="mt-md"><div class="card-title">${t('telemetry.fan_speeds')}</div>`;
      html += renderChart(data,
        ['fan_cooling', 'fan_aux', 'fan_chamber', 'fan_heatbreak'],
        { fan_cooling: '#00e676', fan_aux: '#f0883e', fan_chamber: '#58a6ff', fan_heatbreak: '#bc8cff' },
        { fan_cooling: t('fans.part'), fan_aux: t('fans.aux'), fan_chamber: t('fans.chamber'), fan_heatbreak: t('telemetry.heatbreak') },
        255
      );
      html += '</div>';

      // Speed magnitude
      html += `<div class="mt-md"><div class="card-title">${t('telemetry.speed_mag')}</div>`;
      html += renderChart(data,
        ['speed_mag'],
        { speed_mag: '#e3b341' },
        { speed_mag: t('speed.label') },
        200
      );
      html += '</div>';

      // Print progress
      html += `<div class="mt-md"><div class="card-title">${t('telemetry.print_progress')}</div>`;
      html += renderChart(data,
        ['print_progress'],
        { print_progress: '#00e676' },
        { print_progress: '%' },
        100
      );
      html += '</div>';

      panel.innerHTML = html;
    } catch (e) {
      panel.innerHTML = `<p class="text-muted">${t('telemetry.load_failed')}</p>`;
    }
  }

  function buildLiveValues(printerId) {
    const ps = window.printerState?._printers?.[printerId];
    if (!ps) return '';
    const pd = ps.print || ps;

    const nozzle = Math.round(pd.nozzle_temper || 0);
    const bed = Math.round(pd.bed_temper || 0);
    const chamber = Math.round(pd.chamber_temper || 0);
    const nozzleTarget = Math.round(pd.nozzle_target_temper || pd.nozzle_temper_target || 0);
    const bedTarget = Math.round(pd.bed_target_temper || pd.bed_temper_target || 0);
    const fanPart = Math.round((parseInt(pd.cooling_fan_speed) || 0) / 255 * 100);
    const fanAux = Math.round((parseInt(pd.big_fan1_speed) || 0) / 255 * 100);
    const fanChamber = Math.round((parseInt(pd.big_fan2_speed) || 0) / 255 * 100);
    const wifi = pd.wifi_signal ? `${pd.wifi_signal}dBm` : '--';
    const speed = pd.spd_mag || pd.speed_magnitude || '--';

    return `<div class="tele-live-strip">
      <div class="tele-live-item">
        <span class="tele-live-icon" style="color:#f85149">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v10l4.24 4.24"/></svg>
        </span>
        <span class="tele-live-val">${nozzle}°C</span>
        ${nozzleTarget > 0 ? `<span class="tele-live-target">→${nozzleTarget}°C</span>` : ''}
        <span class="tele-live-label">${t('temperature.nozzle')}</span>
      </div>
      <div class="tele-live-item">
        <span class="tele-live-icon" style="color:#58a6ff">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/></svg>
        </span>
        <span class="tele-live-val">${bed}°C</span>
        ${bedTarget > 0 ? `<span class="tele-live-target">→${bedTarget}°C</span>` : ''}
        <span class="tele-live-label">${t('temperature.bed')}</span>
      </div>
      <div class="tele-live-item">
        <span class="tele-live-icon" style="color:#e3b341">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
        </span>
        <span class="tele-live-val">${chamber}°C</span>
        <span class="tele-live-label">${t('temperature.chamber')}</span>
      </div>
      <div class="tele-live-item">
        <span class="tele-live-icon" style="color:#00e676">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4"/></svg>
        </span>
        <span class="tele-live-val">${fanPart}%</span>
        <span class="tele-live-label">${t('fans.part')}</span>
      </div>
      <div class="tele-live-item">
        <span class="tele-live-icon" style="color:#bc8cff">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0114 0"/><path d="M1.42 9a16 16 0 0121.16 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><circle cx="12" cy="20" r="1"/></svg>
        </span>
        <span class="tele-live-val">${wifi}</span>
        <span class="tele-live-label">WiFi</span>
      </div>
    </div>`;
  }

  function renderChart(data, keys, colors, labels, maxVal, targets) {
    const W = 800, H = 180, PAD_L = 45, PAD_R = 10, PAD_T = 10, PAD_B = 25;
    const plotW = W - PAD_L - PAD_R;
    const plotH = H - PAD_T - PAD_B;

    if (!maxVal) {
      maxVal = 0;
      for (const d of data) {
        for (const k of keys) {
          if ((d[k] || 0) > maxVal) maxVal = d[k];
        }
      }
      // Also consider target lines
      if (targets) {
        for (const k of keys) {
          if (targets[k] > maxVal) maxVal = targets[k] * 1.1;
        }
      }
      maxVal = Math.ceil(maxVal / 10) * 10 || 100;
    }

    const chartId = 'tc-' + Math.random().toString(36).substr(2, 6);
    let svg = `<div class="telemetry-chart-wrap" id="${chartId}-wrap">`;
    svg += `<svg viewBox="0 0 ${W} ${H}" class="telemetry-chart" id="${chartId}" preserveAspectRatio="none">`;

    // Grid lines + labels
    for (let i = 0; i <= 4; i++) {
      const y = PAD_T + (plotH / 4) * i;
      const val = Math.round(maxVal - (maxVal / 4) * i);
      svg += `<line x1="${PAD_L}" y1="${y}" x2="${W - PAD_R}" y2="${y}" stroke="#30363d" stroke-width="1"/>`;
      svg += `<text x="${PAD_L - 5}" y="${y + 4}" text-anchor="end" fill="#e2e8f0" font-size="10">${val}</text>`;
    }

    // Time labels
    if (data.length > 1) {
      const step = Math.max(1, Math.floor(data.length / 6));
      for (let i = 0; i < data.length; i += step) {
        const x = PAD_L + (i / (data.length - 1)) * plotW;
        const time = data[i].time_bucket || '';
        const label = time.includes(' ') ? time.split(' ')[1].substring(0, 5) : time.substring(11, 16);
        svg += `<text x="${x}" y="${H - 4}" text-anchor="middle" fill="#e2e8f0" font-size="9">${label}</text>`;
      }
    }

    // Target temperature dashed lines
    if (targets) {
      for (const key of keys) {
        if (targets[key] && targets[key] > 0) {
          const y = PAD_T + plotH - (targets[key] / maxVal) * plotH;
          svg += `<line x1="${PAD_L}" y1="${y.toFixed(1)}" x2="${W - PAD_R}" y2="${y.toFixed(1)}" stroke="${colors[key]}" stroke-width="1" stroke-dasharray="6,4" opacity="0.5"/>`;
          svg += `<text x="${W - PAD_R + 2}" y="${y.toFixed(1) - (-4)}" fill="${colors[key]}" font-size="8" opacity="0.7">${targets[key]}°</text>`;
        }
      }
    }

    // Area fills (subtle)
    for (const key of keys) {
      const points = [];
      for (let i = 0; i < data.length; i++) {
        const x = PAD_L + (i / Math.max(data.length - 1, 1)) * plotW;
        const y = PAD_T + plotH - ((data[i][key] || 0) / maxVal) * plotH;
        points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
      }
      if (points.length > 1) {
        const lastX = PAD_L + ((data.length - 1) / Math.max(data.length - 1, 1)) * plotW;
        const firstX = PAD_L;
        const bottomY = PAD_T + plotH;
        svg += `<polygon points="${points.join(' ')} ${lastX.toFixed(1)},${bottomY} ${firstX},${bottomY}" fill="${colors[key]}" opacity="0.06"/>`;
      }
    }

    // Data lines
    for (const key of keys) {
      const points = [];
      for (let i = 0; i < data.length; i++) {
        const x = PAD_L + (i / Math.max(data.length - 1, 1)) * plotW;
        const y = PAD_T + plotH - ((data[i][key] || 0) / maxVal) * plotH;
        points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
      }
      svg += `<polyline points="${points.join(' ')}" fill="none" stroke="${colors[key]}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>`;
    }

    // Hover line (invisible, positioned by JS)
    svg += `<line class="tele-hover-line" x1="0" y1="${PAD_T}" x2="0" y2="${PAD_T + plotH}" stroke="#e2e8f0" stroke-width="1" opacity="0" stroke-dasharray="3,3"/>`;

    svg += '</svg>';

    // Tooltip
    svg += `<div class="tele-tooltip" id="${chartId}-tip"></div>`;
    svg += '</div>';

    // Legend
    svg += '<div class="chart-legend mt-sm">';
    for (const key of keys) {
      // Get latest value
      const lastVal = data.length > 0 ? (data[data.length - 1][key] || 0) : 0;
      const dispVal = maxVal > 100 ? Math.round(lastVal) : Math.round(lastVal * 10) / 10;
      svg += `<span class="legend-item"><span class="legend-dot" style="background:${colors[key]}"></span> ${labels[key]} <span class="legend-val">${dispVal}</span></span>`;
    }
    svg += '</div>';

    // Store chart metadata for hover handler
    setTimeout(() => {
      const wrap = document.getElementById(`${chartId}-wrap`);
      if (wrap) {
        wrap._chartData = data;
        wrap._chartKeys = keys;
        wrap._chartColors = colors;
        wrap._chartLabels = labels;
        wrap._chartMaxVal = maxVal;
        wrap._chartDims = { W, H, PAD_L, PAD_R, PAD_T, PAD_B, plotW, plotH };
        wrap.addEventListener('mousemove', handleChartHover);
        wrap.addEventListener('mouseleave', handleChartLeave);
      }
    }, 50);

    return svg;
  }

  function handleChartHover(e) {
    const wrap = e.currentTarget;
    const svg = wrap.querySelector('svg');
    const tip = wrap.querySelector('.tele-tooltip');
    const line = wrap.querySelector('.tele-hover-line');
    if (!svg || !tip || !wrap._chartData) return;

    const rect = svg.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const pct = mouseX / rect.width;
    const d = wrap._chartDims;
    const svgX = pct * d.W;

    if (svgX < d.PAD_L || svgX > d.W - d.PAD_R) {
      tip.style.opacity = '0';
      line.setAttribute('opacity', '0');
      return;
    }

    const dataIdx = Math.round(((svgX - d.PAD_L) / d.plotW) * (wrap._chartData.length - 1));
    const clampedIdx = Math.max(0, Math.min(dataIdx, wrap._chartData.length - 1));
    const point = wrap._chartData[clampedIdx];

    const lineX = d.PAD_L + (clampedIdx / Math.max(wrap._chartData.length - 1, 1)) * d.plotW;
    line.setAttribute('x1', lineX.toFixed(1));
    line.setAttribute('x2', lineX.toFixed(1));
    line.setAttribute('opacity', '0.5');

    const time = point.time_bucket || '';
    const timeStr = time.includes(' ') ? time.split(' ')[1].substring(0, 5) : time.substring(11, 16);
    let tipHtml = `<div class="tele-tip-time">${timeStr}</div>`;
    for (const key of wrap._chartKeys) {
      const val = point[key] || 0;
      const dispVal = wrap._chartMaxVal > 100 ? Math.round(val) : Math.round(val * 10) / 10;
      tipHtml += `<div class="tele-tip-row"><span class="legend-dot" style="background:${wrap._chartColors[key]}"></span> ${wrap._chartLabels[key]}: <strong>${dispVal}</strong></div>`;
    }
    tip.innerHTML = tipHtml;
    tip.style.opacity = '1';

    // Position tooltip
    const tipLeft = mouseX < rect.width / 2 ? mouseX + 12 : mouseX - tip.offsetWidth - 12;
    tip.style.left = tipLeft + 'px';
    tip.style.top = '10px';
  }

  function handleChartLeave(e) {
    const wrap = e.currentTarget;
    const tip = wrap.querySelector('.tele-tooltip');
    const line = wrap.querySelector('.tele-hover-line');
    if (tip) tip.style.opacity = '0';
    if (line) line.setAttribute('opacity', '0');
  }

  window.setTelemetryRange = function(range) {
    currentRange = range;
    loadTelemetry();
  };
})();
