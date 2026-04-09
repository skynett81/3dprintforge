// Fan Display — visual bars in dashboard card. Type-aware for all printers.
(function() {
  function fanPercent(raw) {
    const val = parseInt(raw) || 0;
    if (val === 0) return 0;
    const max = val > 15 ? 255 : 15;
    return Math.min(100, Math.round((val / max) * 100));
  }

  function fanColor(pct) {
    if (pct === 0) return 'var(--text-muted)';
    if (pct >= 80) return 'var(--accent-yellow)';
    return 'var(--accent-green)';
  }

  function renderFanBars(container, fans) {
    const visible = fans.filter(f => f.pct > 0 || f.always);
    if (visible.length === 0) {
      container.innerHTML = '<div style="font-size:0.72rem;color:var(--text-muted);padding:6px">All fans off</div>';
      return;
    }
    container.innerHTML = `<div class="fan-bars">
      ${visible.map(f => `
        <div class="fan-bar-row">
          <span class="fan-bar-label">${f.label}</span>
          <div class="fan-bar-track">
            <div class="fan-bar-fill" style="width:${f.pct}%;background:${fanColor(f.pct)}"></div>
          </div>
          <span class="fan-bar-pct" style="color:${fanColor(f.pct)}">${f.pct}%</span>
        </div>`).join('')}
    </div>`;
  }

  function updateFanEl(id, pct) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = `${pct}%`;
    const parent = el.closest('.qs-fan');
    if (parent) parent.classList.toggle('fan-active', pct > 0);
  }

  window.updateFanDisplay = function(data) {
    const container = document.getElementById('fans-card-content');
    if (!container) return;

    const pt = typeof getPrinterType === 'function' ? getPrinterType(null, data) : {};
    const fans = [];

    if (pt.isBambu) {
      // Bambu: 4 dedicated fans
      fans.push({ label: t('quick_status.fan_part'), pct: fanPercent(data.cooling_fan_speed), always: true });
      fans.push({ label: t('quick_status.fan_aux'), pct: fanPercent(data.big_fan1_speed) });
      fans.push({ label: t('quick_status.fan_chamber'), pct: fanPercent(data.big_fan2_speed) });
      fans.push({ label: t('quick_status.fan_heatbreak'), pct: fanPercent(data.heatbreak_fan_speed) });
    } else if (pt.isMoonraker || pt.isKlipper) {
      // Klipper: part cooling + detected fans
      fans.push({ label: 'Part Cooling', pct: fanPercent(data.cooling_fan_speed), always: true });
      // Controller fan
      if (data._temp_fans?.controller_fan) {
        fans.push({ label: 'Controller', pct: data._temp_fans.controller_fan.speed });
      }
      // Exhaust fan
      if (data._temp_fans?.exhaust_fan) {
        fans.push({ label: 'Exhaust', pct: data._temp_fans.exhaust_fan.speed });
      }
      // Nevermore
      if (data._nevermore) {
        fans.push({ label: 'Nevermore', pct: data._nevermore.speed });
      }
      // Cavity fan (Snapmaker U1)
      if (data._purifier?.fan) {
        fans.push({ label: 'Purifier', pct: Math.round((data._purifier.fan_speed || 0)) });
      }
    } else if (pt.isOctoPrint) {
      // OctoPrint: part cooling only (fan speed not exposed in API)
      fans.push({ label: 'Part Cooling', pct: fanPercent(data.cooling_fan_speed || 0), always: true });
    } else if (pt.isPrusaLink) {
      // PrusaLink: part cooling + print fan
      fans.push({ label: 'Print Fan', pct: fanPercent(data.cooling_fan_speed || data._fan_printing || 0), always: true });
    } else if (pt.isSacp) {
      // SACP: part cooling + enclosure
      fans.push({ label: 'Part Cooling', pct: fanPercent(data.cooling_fan_speed || 0), always: true });
      if (data._enclosure?.fan) {
        fans.push({ label: 'Enclosure', pct: 100 });
      }
      if (data._purifier?.fan) {
        fans.push({ label: 'Purifier', pct: data._purifier.speedLevel * 25 });
      }
    } else {
      // Generic fallback
      fans.push({ label: 'Fan', pct: fanPercent(data.cooling_fan_speed || 0), always: true });
    }

    renderFanBars(container, fans);

    // Legacy element updates
    updateFanEl('fan-part', fans[0]?.pct || 0);
    updateFanEl('fan-aux', fans[1]?.pct || 0);
    updateFanEl('fan-chamber', fans[2]?.pct || 0);
  };
})();
