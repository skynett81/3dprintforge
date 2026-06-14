// Print Activity Calendar — GitHub-style contribution heatmap with year selector
(function() {
  'use strict';

  function _t(key, fb) { if (typeof t === 'function') { const v = t(key); if (v && v !== key) return v; } return fb || key; }

  const MONTHS_FB = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const DAYS_FB = ['Mon','','Wed','','Fri','','Sun'];

  function _monthLabel(i) { return _t('calendar.' + ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'][i], MONTHS_FB[i]); }
  function _dayName(d) { return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()]; }
  function _fmtDate(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
  function _dateLabel(iso) {
    const d = new Date(iso + 'T00:00:00');
    return `${_dayName(d)} ${d.getDate()}. ${_monthLabel(d.getMonth())} ${d.getFullYear()}`;
  }

  function _colorForCount(count, max) {
    if (count === 0) return 'var(--bg-tertiary)';
    const pct = count / Math.max(max, 1);
    if (pct <= 0.25) return 'rgba(0, 230, 118, 0.3)';
    if (pct <= 0.5) return 'rgba(0, 230, 118, 0.5)';
    if (pct <= 0.75) return 'rgba(0, 230, 118, 0.7)';
    return 'rgba(0, 230, 118, 0.95)';
  }

  let _currentYear = new Date().getFullYear();
  let _container = null;
  let _dayMap = {};        // date -> day record, for the click-to-inspect detail
  let _maxPrints = 0;
  let _selectedDate = null;

  window.loadPrintCalendar = async function(container) {
    if (!container) container = document.getElementById('overlay-panel-body');
    if (!container) return;
    _container = container;
    _currentYear = new Date().getFullYear();
    await _loadYear(_currentYear);
  };

  async function _loadYear(year) {
    if (!_container) return;
    _currentYear = year;

    _container.innerHTML = '<div class="matrec-empty"><div class="matrec-spinner"></div></div>';

    let result;
    try {
      const res = await fetch('/api/stats/calendar?year=' + year);
      result = await res.json();
    } catch (e) {
      _container.innerHTML = `<p class="text-muted">${_t('calendar.load_failed', 'Could not load calendar data')}</p>`;
      return;
    }

    const data = result.days || result;
    const years = result.years || [year];

    if (!data || !data.length) {
      _container.innerHTML = _renderYearSelector(year, years) + `<p class="text-muted">${_t('calendar.no_data', 'No print data for this year')}</p>`;
      return;
    }

    // Build day map
    const dayMap = {};
    let maxPrints = 0;
    for (const d of data) {
      dayMap[d.date] = d;
      if (d.prints > maxPrints) maxPrints = d.prints;
    }
    _dayMap = dayMap;
    _maxPrints = maxPrints;
    _selectedDate = null;

    // Compute stats
    const totalPrints = data.reduce((s, d) => s + d.prints, 0);
    const activeDays = data.filter(d => d.prints > 0).length;
    const totalHours = data.reduce((s, d) => s + (d.hours || 0), 0);
    const totalCompleted = data.reduce((s, d) => s + (d.completed || 0), 0);
    const totalFailed = data.reduce((s, d) => s + (d.failed || 0), 0);
    const successRate = totalPrints > 0 ? Math.round(totalCompleted / totalPrints * 100) : 0;
    const avgPerDay = activeDays > 0 ? (totalPrints / activeDays).toFixed(1) : '0';

    // Compute streaks
    let currentStreak = 0, longestStreak = 0, tempStreak = 0;
    const activeDates = data.filter(d => d.prints > 0).map(d => d.date).sort();
    const today = _fmtDate(new Date());
    const yesterday = _fmtDate(new Date(Date.now() - 86400000));
    let checkDate = dayMap[today]?.prints > 0 ? new Date() : (dayMap[yesterday]?.prints > 0 ? new Date(Date.now() - 86400000) : null);
    if (checkDate) {
      while (dayMap[_fmtDate(checkDate)]?.prints > 0) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    }
    for (let i = 0; i < activeDates.length; i++) {
      if (i === 0) { tempStreak = 1; continue; }
      const diff = (new Date(activeDates[i]) - new Date(activeDates[i-1])) / 86400000;
      tempStreak = diff === 1 ? tempStreak + 1 : 1;
      if (tempStreak > longestStreak) longestStreak = tempStreak;
    }
    if (tempStreak > longestStreak) longestStreak = tempStreak;

    let h = '<div class="act-panel">';

    // ── Year selector ──
    h += _renderYearSelector(year, years);

    // ── Stats strip ──
    h += `<div class="stats-strip act-stats">
      <div class="spark-panel"><span class="spark-label">${_t('stats.total_prints', 'Total')}</span><span class="spark-value" style="color:var(--accent-blue)">${totalPrints}</span></div>
      <div class="spark-panel"><span class="spark-label">${_t('calendar.active_days', 'Active days')}</span><span class="spark-value" style="color: var(--accent-green-text)">${activeDays}</span></div>
      <div class="spark-panel"><span class="spark-label">${_t('activity.current_streak', 'Streak')}</span><span class="spark-value" style="color:var(--accent-yellow, #e6a817)">${currentStreak}d</span></div>
      <div class="spark-panel"><span class="spark-label">${_t('activity.longest_streak', 'Longest')}</span><span class="spark-value" style="color:var(--accent-purple)">${longestStreak}d</span></div>
      <div class="spark-panel" style="border-right:none"><span class="spark-label">${_t('stats.success_rate', 'Success rate')}</span><span class="spark-value" style="color:${successRate >= 80 ? 'var(--accent-green)' : successRate >= 50 ? 'var(--accent-orange)' : 'var(--accent-red)'}">${successRate}%</span></div>
    </div>`;

    // ── Secondary stat cards ──
    h += '<div class="auto-grid auto-grid--md act-cards">';
    h += _statCard(_t('stats.total_time', 'Print hours'), Math.round(totalHours) + _t('time.h', 't'), 'var(--accent-blue)');
    h += _statCard(_t('stats.completed', 'Completed'), totalCompleted, 'var(--accent-green)');
    h += _statCard(_t('stats.failed', 'Failed'), totalFailed, 'var(--accent-red)');
    h += _statCard(_t('activity.avg_per_day', 'Avg per day'), avgPerDay, 'var(--accent-purple)');
    h += '</div>';

    // ── SVG Heatmap (click a day to inspect) ──
    h += `<div class="card act-heatmap-card">
      <div class="card-title">${_t('activity.year_heatmap', 'Print activity')} — ${year}</div>
      ${_renderHeatmap(dayMap, maxPrints, data)}
      <div id="act-day-detail" class="act-day-detail">${_renderDayDetailHint()}</div>
    </div>`;

    // ── Weekday rhythm ──
    h += `<div class="card act-weekday-card">
      <div class="card-title">${_t('activity.weekday_rhythm', 'Weekly rhythm')}</div>
      ${_renderWeekdayRhythm(data)}
    </div>`;

    // ── Monthly breakdown ──
    h += `<div class="card act-monthly-card">
      <div class="card-title">${_t('activity.monthly_breakdown', 'Monthly overview')}</div>
      ${_renderMonthlyBars(data)}
    </div>`;

    // ── Busiest days ──
    h += `<div class="card act-busiest-card">
      <div class="card-title">${_t('activity.busiest_days', 'Busiest days')}</div>
      ${_renderBusiestDays(data)}
    </div>`;

    h += '</div>';
    _container.innerHTML = h;
  }

  function _renderYearSelector(currentYear, years) {
    const sorted = [...years].sort((a, b) => b - a);
    let h = '<div class="cal-year-selector">';
    for (const y of sorted) {
      const active = y === currentYear ? ' active' : '';
      h += `<button class="tab-btn${active}" onclick="_calSelectYear(${y})">${y}</button>`;
    }
    h += '</div>';
    return h;
  }

  window._calSelectYear = function(year) {
    _loadYear(year);
  };

  function _statCard(label, value, color) {
    return `<div class="act-stat-card">
      <span class="act-stat-label">${label}</span>
      <span class="act-stat-value" style="color:${color}">${value}</span>
    </div>`;
  }

  function _renderHeatmap(dayMap, maxPrints, rawData) {
    const start = new Date(rawData[0].date + 'T00:00:00');
    const end = new Date(rawData[rawData.length - 1].date + 'T00:00:00');
    while (start.getDay() !== 1) start.setDate(start.getDate() - 1);

    const cellSize = 13;
    const gap = 2;
    const step = cellSize + gap;

    const weeks = [];
    const d = new Date(start);
    let currentWeek = [];
    while (d <= end) {
      if (d.getDay() === 1 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    if (currentWeek.length > 0) weeks.push(currentWeek);

    const svgWidth = weeks.length * step + 30;
    const svgHeight = 7 * step + 25;

    let svg = `<div class="act-heatmap-scroll"><svg class="act-heatmap-svg" viewBox="0 0 ${svgWidth} ${svgHeight}">`;

    DAYS_FB.forEach((label, i) => {
      if (label) svg += `<text x="0" y="${i * step + cellSize + 18}" font-size="9" fill="var(--text-muted)" font-family="inherit">${label}</text>`;
    });

    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      const month = week[0].getMonth();
      if (month !== lastMonth) {
        svg += `<text x="${wi * step + 28}" y="10" font-size="9" fill="var(--text-muted)" font-family="inherit">${_monthLabel(month)}</text>`;
        lastMonth = month;
      }
    });

    weeks.forEach((week, wi) => {
      week.forEach(day => {
        const dayStr = _fmtDate(day);
        const entry = dayMap[dayStr];
        const count = entry?.prints || 0;
        const color = _colorForCount(count, maxPrints);
        const dow = (day.getDay() + 6) % 7;
        const x = wi * step + 28;
        const y = dow * step + 15;

        const dateLabel = dayStr.substring(8) + '.' + dayStr.substring(5, 7);
        const tooltip = count > 0
          ? `${dateLabel}: ${count} prints (${(entry.hours || 0).toFixed(1)}${_t('time.h', 't')})`
          : `${dateLabel}: ${_t('calendar.no_prints', 'no prints')}`;

        svg += `<rect class="act-cell" data-date="${dayStr}" x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2" fill="${color}" stroke="var(--border-subtle)" stroke-width="0.5" onclick="_calSelectDay('${dayStr}')"><title>${tooltip}</title></rect>`;
      });
    });

    svg += '</svg></div>';

    svg += `<div class="act-heatmap-legend">
      <span>${_t('calendar.less', 'Less')}</span>
      <div class="act-legend-cell" style="background:var(--bg-tertiary);border:1px solid var(--border-color)"></div>
      <div class="act-legend-cell" style="background:rgba(0,230,118,0.3)"></div>
      <div class="act-legend-cell" style="background:rgba(0,230,118,0.5)"></div>
      <div class="act-legend-cell" style="background:rgba(0,230,118,0.7)"></div>
      <div class="act-legend-cell" style="background:rgba(0,230,118,0.95)"></div>
      <span>${_t('calendar.more', 'More')}</span>
    </div>`;

    return svg;
  }

  function _renderMonthlyBars(data) {
    const months = {};
    for (const d of data) {
      const key = d.date.substring(0, 7);
      if (!months[key]) months[key] = { prints: 0, hours: 0 };
      months[key].prints += d.prints;
      months[key].hours += d.hours || 0;
    }

    const keys = Object.keys(months).sort();
    const activeKeys = keys.filter(k => months[k].prints > 0);
    if (!activeKeys.length) return `<div class="matrec-empty"><p>${_t('calendar.no_data', 'No data')}</p></div>`;

    const maxPrints = Math.max(...activeKeys.map(k => months[k].prints), 1);

    let h = '<div class="act-monthly-list">';
    for (const key of activeKeys) {
      const m = months[key];
      const pct = (m.prints / maxPrints) * 100;
      const [y, mon] = key.split('-');
      const label = `${_monthLabel(parseInt(mon) - 1)} ${y}`;
      h += `<div class="act-monthly-row">
        <span class="act-monthly-label">${label}</span>
        <div class="matrec-bar-track"><div class="matrec-bar-fill" style="width:${pct}%;background:var(--accent-green)"></div></div>
        <span class="act-monthly-value">${m.prints} <span class="act-monthly-detail">(${Math.round(m.hours)}${_t('time.h', 't')})</span></span>
      </div>`;
    }
    h += '</div>';
    return h;
  }

  function _renderBusiestDays(data) {
    const sorted = [...data].filter(d => d.prints > 0).sort((a, b) => b.prints - a.prints).slice(0, 10);
    if (!sorted.length) return `<div class="matrec-empty"><p>${_t('calendar.no_data', 'No data')}</p></div>`;

    let h = '<div class="auto-grid auto-grid--md">';
    for (let i = 0; i < sorted.length; i++) {
      const d = sorted[i];
      const dateStr = _dateLabel(d.date);
      const medal = i === 0 ? ' act-busiest--gold' : i === 1 ? ' act-busiest--silver' : i === 2 ? ' act-busiest--bronze' : '';

      h += `<div class="act-busiest-card${medal}">
        <div class="act-busiest-info">
          <span class="act-busiest-rank">#${i + 1}</span>
          <div>
            <div class="act-busiest-date">${dateStr}</div>
            <div class="act-busiest-meta">${(d.hours || 0).toFixed(1)}${_t('time.h', 't')} · ${d.completed || 0} ${_t('calendar.ok', 'ok')}, ${d.failed || 0} ${_t('calendar.failed', 'failed')}</div>
          </div>
        </div>
        <span class="act-busiest-count">${d.prints}</span>
      </div>`;
    }
    h += '</div>';
    return h;
  }

  function _renderDayDetailHint() {
    return `<div class="act-detail-hint">${_t('activity.click_day_hint', 'Click a day in the heatmap to inspect it')}</div>`;
  }

  // Click a heatmap cell to inspect that day's breakdown.
  window._calSelectDay = function(date) {
    const panel = document.getElementById('act-day-detail');
    if (!panel) return;
    document.querySelectorAll('.act-cell.selected').forEach(c => c.classList.remove('selected'));
    const cell = document.querySelector('.act-cell[data-date="' + date + '"]');
    if (cell) cell.classList.add('selected');
    _selectedDate = date;

    const d = _dayMap[date];
    const prints = d?.prints || 0;
    const hours = d?.hours || 0;
    const completed = d?.completed || 0;
    const failed = d?.failed || 0;
    const rate = prints > 0 ? Math.round(completed / prints * 100) : 0;

    if (prints === 0) {
      panel.innerHTML = `<div class="act-detail-head">
          <span class="act-detail-date">${_dateLabel(date)}</span>
          <span class="act-detail-empty">${_t('calendar.no_prints', 'No prints this day')}</span>
        </div>`;
      return;
    }
    const rateColor = rate >= 80 ? 'var(--accent-green)' : rate >= 50 ? 'var(--accent-orange)' : 'var(--accent-red)';
    panel.innerHTML = `<div class="act-detail-head">
        <span class="act-detail-date">${_dateLabel(date)}</span>
        <button class="form-btn form-btn-sm" onclick="location.hash='#history'">${_t('activity.view_in_history', 'Open history')}</button>
      </div>
      <div class="act-detail-stats">
        <div class="act-detail-stat"><span class="act-detail-num" style="color:var(--accent-blue)">${prints}</span><span class="act-detail-lbl">${_t('stats.total_prints', 'Prints')}</span></div>
        <div class="act-detail-stat"><span class="act-detail-num" style="color:var(--accent-green)">${completed}</span><span class="act-detail-lbl">${_t('stats.completed', 'Completed')}</span></div>
        <div class="act-detail-stat"><span class="act-detail-num" style="color:var(--accent-red)">${failed}</span><span class="act-detail-lbl">${_t('stats.failed', 'Failed')}</span></div>
        <div class="act-detail-stat"><span class="act-detail-num" style="color:var(--accent-purple)">${hours.toFixed(1)}${_t('time.h','h')}</span><span class="act-detail-lbl">${_t('stats.total_time', 'Hours')}</span></div>
        <div class="act-detail-stat"><span class="act-detail-num" style="color:${rateColor}">${rate}%</span><span class="act-detail-lbl">${_t('stats.success_rate', 'Success')}</span></div>
      </div>`;
  };

  // Total prints per weekday (Mon..Sun) — shows when the user prints most.
  function _renderWeekdayRhythm(data) {
    const totals = [0, 0, 0, 0, 0, 0, 0]; // 0 = Monday
    for (const d of data) {
      if (!d.prints) continue;
      const dt = new Date(d.date + 'T00:00:00');
      totals[(dt.getDay() + 6) % 7] += d.prints;
    }
    const max = Math.max(...totals, 1);
    const peak = totals.indexOf(Math.max(...totals));
    const labelKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const labelsFb = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    let h = '<div class="act-weekday-bars">';
    for (let i = 0; i < 7; i++) {
      const pct = (totals[i] / max) * 100;
      const isPeak = totals[i] > 0 && i === peak;
      h += `<div class="act-weekday-col">
        <div class="act-weekday-track"><div class="act-weekday-fill${isPeak ? ' act-weekday-fill--peak' : ''}" style="height:${Math.max(pct, 2)}%"></div></div>
        <span class="act-weekday-count">${totals[i]}</span>
        <span class="act-weekday-label">${_t('day.' + labelKeys[i], labelsFb[i])}</span>
      </div>`;
    }
    h += '</div>';
    return h;
  }

  window._buildCalendarModule = function(containerId) {
    const el = document.getElementById(containerId);
    if (el) loadPrintCalendar(el);
  };
})();
