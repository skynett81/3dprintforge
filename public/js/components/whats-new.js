// whats-new.js
// A one-time, dismissible "What's new" modal that surfaces recently added
// features users would otherwise never discover (sidebar search, pinned
// favourites, the streaming overlay, the Spoolman server). Shown once per
// VERSION to users who have already finished onboarding; bump VERSION to
// re-announce a new batch.
(function () {
  'use strict';

  var VERSION = '1';
  var KEY = 'whatsnew-seen-v' + VERSION;

  var FEATURES = [
    {
      icon: 'bi-search',
      title: 'Quick sidebar search',
      desc: 'Type in the search box at the top of the sidebar to jump straight to any panel.',
      action: { label: 'Try it', fn: function () { var i = document.getElementById('sidebar-search-input'); if (i) { i.focus(); } } },
    },
    {
      icon: 'bi-pin-angle',
      title: 'Pin favourites',
      desc: 'Hover any menu item and click the pin to keep your most-used panels at the top.',
    },
    {
      icon: 'bi-broadcast',
      title: 'Streaming overlay',
      desc: 'On the camera card, the broadcast button gives you an embeddable OBS / kiosk URL with live status.',
    },
    {
      icon: 'bi-hdd-stack',
      title: 'Spoolman server',
      desc: 'Use 3DPrintForge as your Klipper Spoolman server so Mainsail / Fluidd show this inventory.',
      action: { label: 'Open settings', fn: function () { if (window.openPanel) { window.openPanel('settings'); } location.hash = '#settings/system/integrations'; } },
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

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
