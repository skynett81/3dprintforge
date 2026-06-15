// whats-new.js
// A one-time, dismissible "What's new" modal that surfaces recently added
// features users would otherwise never discover. Shown once per VERSION to
// users who have already finished onboarding.
//
// KEEP THIS CURRENT: whenever a release adds user-facing features, refresh the
// FEATURES list with the new batch and bump VERSION so everyone sees it again.
// VERSION history: 1 = sidebar search/pin, overlay, Spoolman. 2 = v1.1.24.
// 3 = richer stats, accessories, reliable history. 4 = inventory expiry +
// procurement + scan/stocktake + reports, Print Guard upgrade, unified UI.
// 3 = filament insights, connected accessories, reliable print history.
(function () {
  'use strict';

  var VERSION = '4';
  var KEY = 'whatsnew-seen-v' + VERSION;

  var FEATURES = [
    {
      icon: 'bi-hourglass-split',
      title: 'Filament expiry & shelf-life',
      desc: 'Give spools an expiry date (or let it suggest one from the material shelf life) and the inventory flags them with "expires in N days" / "expired" badges. The Inventory Health overview counts what is expiring at a glance.',
      action: { label: 'Open', fn: function () { if (window.openPanel) { window.openPanel('filament'); } location.hash = '#filament'; } },
    },
    {
      icon: 'bi-cart-check',
      title: 'Purchases — order to shelf',
      desc: 'A new Purchases tab (under Storage) tracks what you bought, the cost and when. Mark a purchase received to add it to inventory, or "Buy again" straight from a low-stock restock suggestion.',
      action: { label: 'Open', fn: function () { if (window.openPanel) { window.openPanel('filament'); } location.hash = '#filament'; } },
    },
    {
      icon: 'bi-upc-scan',
      title: 'Scan to act + stocktake',
      desc: 'Scan a spool QR or short code to open a quick-action sheet (details, edit, check out/in, weigh in, mark empty). A new stocktake mode lets you scan through the shelf and tick everything off.',
    },
    {
      icon: 'bi-file-earmark-bar-graph',
      title: 'Inventory reports',
      desc: 'A Reports tab (under Statistics) gives a period-scoped, exportable summary — consumed weight, filament cost, success rate, waste — with a per-material breakdown and one-click CSV export.',
    },
    {
      icon: 'bi-shield-check',
      title: 'Print Guard upgrade',
      desc: 'Fire a safe test alert to verify your notifications, snooze a printer\'s guard for 15/30/60 min during a tricky print, and see a per-printer reliability summary (incidents, last 7 days, most common issue).',
      action: { label: 'Open', fn: function () { if (window.openPanel) { window.openPanel('protection'); } location.hash = '#protection'; } },
    },
    {
      icon: 'bi-grid-1x2',
      title: 'Cleaner, unified interface',
      desc: 'The sidebar is grouped into Operate / Create / Manage zones, and the whole app now shares one design system — consistent colours, cards, badges, notices and empty states from Dashboard to Admin.',
    },
  ];

  function markSeen() { try { localStorage.setItem(KEY, '1'); } catch (e) { /* ignore */ } }

  function show() {
    if (typeof window.openModal !== 'function') { setTimeout(show, 600); return; }
    var rows = FEATURES.map(function (f, i) {
      var border = i < FEATURES.length - 1 ? 'border-bottom:1px solid var(--border-color)' : '';
      var btn = f.action ? '<button class="form-btn form-btn-sm" data-wn-action="' + i + '" style="align-self:center;white-space:nowrap">' + f.action.label + '</button>' : '';
      return '<div style="display:flex;gap:12px;align-items:flex-start;padding:12px 0;' + border + '">'
        + '<div style="width:34px;height:34px;flex-shrink:0;display:flex;align-items:center;justify-content:center;border-radius:8px;background:var(--bg-tertiary);color: var(--accent-green-text)"><i class="bi ' + f.icon + '" style="font-size:1.1rem"></i></div>'
        + '<div style="flex:1;min-width:0"><div style="font-weight:600;font-size:0.9rem">' + f.title + '</div>'
        + '<div class="text-muted" style="font-size:0.78rem">' + f.desc + '</div></div>'
        + btn + '</div>';
    }).join('');

    var html = '<div style="padding:22px;max-width:560px">'
      + '<h3 style="margin:0 0 4px;font-size:1.1rem;display:flex;align-items:center;gap:8px"><i class="bi bi-stars" style="color: var(--accent-green-text)"></i> What\'s new</h3>'
      + '<p class="text-muted" style="font-size:0.82rem;margin:0 0 8px">A few recent additions you might have missed.</p>'
      + rows
      + '<div style="display:flex;justify-content:flex-end;margin-top:16px"><button class="form-btn form-btn-sm form-btn-success" data-wn-dismiss>Got it</button></div>'
      + '</div>';

    var modal = window.openModal(html, { style: 'max-width:600px;width:94%' });
    markSeen(); // showing it counts as seen, however it is closed

    modal.overlay.querySelectorAll('[data-wn-action]').forEach(function (b) {
      b.addEventListener('click', function () {
        var f = FEATURES[parseInt(b.getAttribute('data-wn-action'), 10)];
        modal.close();
        if (f && f.action && f.action.fn) { try { f.action.fn(); } catch (e) { /* ignore */ } }
      });
    });
    var dismiss = modal.overlay.querySelector('[data-wn-dismiss]');
    if (dismiss) dismiss.addEventListener('click', modal.close);
  }

  function init() {
    try { if (localStorage.getItem(KEY)) return; } catch (e) { return; }
    // New installs: let onboarding lead. Re-checks on a later session once the
    // tour is done, so the announcement isn't lost — just deferred.
    try { if (!localStorage.getItem('onboarding-completed')) return; } catch (e) { return; }
    setTimeout(show, 1500);
  }

  // Manual entry point (navbar "What's new" button) — re-opens the modal any
  // time, regardless of whether it has already been auto-shown/dismissed.
  window.showWhatsNew = show;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
