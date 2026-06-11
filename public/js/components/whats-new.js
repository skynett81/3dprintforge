// whats-new.js
// A one-time, dismissible "What's new" modal that surfaces recently added
// features users would otherwise never discover. Shown once per VERSION to
// users who have already finished onboarding.
//
// KEEP THIS CURRENT: whenever a release adds user-facing features, refresh the
// FEATURES list with the new batch and bump VERSION so everyone sees it again.
// VERSION history: 1 = sidebar search/pin, overlay, Spoolman. 2 = v1.1.24.
(function () {
  'use strict';

  var VERSION = '2';
  var KEY = 'whatsnew-seen-v' + VERSION;

  var FEATURES = [
    {
      icon: 'bi-rulers',
      title: 'Pressure-advance pattern calibration',
      desc: 'A new line-method PA/LA test in Calibration & Tuning (the Sineos/Ellis method), with a link to Ellis\' Print Tuning Guide.',
      action: { label: 'Open', fn: function () { if (window.openPanel) { window.openPanel('calibration'); } location.hash = '#calibration'; } },
    },
    {
      icon: 'bi-arrow-counterclockwise',
      title: 'Undo on delete',
      desc: 'Deleted something by accident? An Undo button now appears in the toast — for spools, queues, backups, screenshots, profiles, tags and more.',
    },
    {
      icon: 'bi-trophy',
      title: 'Achievements: levels & XP',
      desc: 'Achievements now earn real XP toward named tiers, and new unlocks are celebrated with a toast.',
      action: { label: 'View', fn: function () { if (window.openPanel) { window.openPanel('achievements'); } location.hash = '#achievements'; } },
    },
    {
      icon: 'bi-hdd-stack',
      title: 'Spoolman server — full control',
      desc: 'Mainsail / Fluidd can now create, edit and delete spools in your inventory, not just read it.',
      action: { label: 'Open settings', fn: function () { if (window.openPanel) { window.openPanel('settings'); } location.hash = '#settings/system/integrations'; } },
    },
    {
      icon: 'bi-wifi-off',
      title: 'Stays clear when offline',
      desc: 'A banner now warns you the moment you go offline and reconnects automatically when you are back.',
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
