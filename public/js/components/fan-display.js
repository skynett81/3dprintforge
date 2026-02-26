// Fan Display — visual bars in dashboard card
(function() {
  function fanPercent(raw) {
    const val = parseInt(raw) || 0;
    return Math.round((val / 255) * 100);
  }

  function fanColor(pct) {
    if (pct === 0) return 'var(--text-muted)';
    if (pct >= 80) return 'var(--accent-yellow)';
    return 'var(--accent-green)';
  }

  function renderFanBars(container, fans) {
    container.innerHTML = `<div class="fan-bars">
      ${fans.map(f => `
        <div class="fan-bar-row">
          <span class="fan-bar-label">${f.label}</span>
          <div class="fan-bar-track">
            <div class="fan-bar-fill" style="width:${f.pct}%;background:${fanColor(f.pct)}"></div>
          </div>
          <span class="fan-bar-pct" style="color:${fanColor(f.pct)}">${f.pct}%</span>
        </div>`).join('')}
    </div>`;
  }

  // Legacy element update (for controls-panel compatibility)
  function updateFanEl(id, pct) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = `${pct}%`;
    const parent = el.closest('.qs-fan');
    if (parent) {
      parent.classList.toggle('fan-active', pct > 0);
    }
  }

  window.updateFanDisplay = function(data) {
    const partPct = fanPercent(data.cooling_fan_speed);
    const auxPct = fanPercent(data.big_fan1_speed);
    const chamberPct = fanPercent(data.big_fan2_speed);
    const heatbreakPct = fanPercent(data.heatbreak_fan_speed);

    // Dashboard card rendering
    const container = document.getElementById('fans-card-content');
    if (container) {
      renderFanBars(container, [
        { label: t('quick_status.fan_part'), pct: partPct },
        { label: t('quick_status.fan_aux'), pct: auxPct },
        { label: t('quick_status.fan_chamber'), pct: chamberPct },
        { label: t('quick_status.fan_heatbreak'), pct: heatbreakPct }
      ]);
    }

    // Legacy element updates (controls panel)
    updateFanEl('fan-part', partPct);
    updateFanEl('fan-aux', auxPct);
    updateFanEl('fan-chamber', chamberPct);
  };
})();
