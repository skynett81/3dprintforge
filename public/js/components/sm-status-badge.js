// Snapmaker U1 — Rich status badge component
(function() {
  'use strict';

  const CATEGORY_COLORS = {
    idle: '#00e676', printing: '#448aff', calibrating: '#ffab00',
    loading: '#00e5ff', unloading: '#00e5ff', error: '#ff5252',
    maintenance: '#ff9100', unknown: '#888888',
  };

  window.renderSmStatusBadge = function(data) {
    if (!data._sm_state_label) return '';
    const cat = data._sm_state_category || 'unknown';
    const color = CATEGORY_COLORS[cat] || CATEGORY_COLORS.unknown;
    return `<span style="display:inline-flex;align-items:center;gap:4px;padding:2px 10px;border-radius:10px;font-size:0.75rem;font-weight:600;background:${color}22;color:${color};border:1px solid ${color}44">
      <span style="width:6px;height:6px;border-radius:50%;background:${color};display:inline-block"></span>
      ${data._sm_state_label}
    </span>`;
  };
})();
