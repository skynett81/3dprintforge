// Browser Notifications for print events + sound integration
(function() {
  let previousStates = {};
  let enabled = false;
  let recentNotifs = {};
  const COOLDOWN_MS = 60000;

  function requestPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(p => { enabled = p === 'granted'; });
    }
    enabled = typeof Notification !== 'undefined' && Notification.permission === 'granted';
  }

  function notify(key, title, body) {
    if (!enabled) return;
    const now = Date.now();
    if (recentNotifs[key] && now - recentNotifs[key] < COOLDOWN_MS) return;
    recentNotifs[key] = now;
    try {
      new Notification(title, { body, icon: '/assets/favicon.svg' });
    } catch (e) { /* ignore */ }
  }

  window.checkNotifications = function(printerId, data) {
    const curr = data.gcode_state;
    if (!curr) return;

    const prev = previousStates[printerId];
    previousStates[printerId] = curr;

    const name = data.subtask_name || t('notify.print');
    const ns = typeof notificationSound !== 'undefined' ? notificationSound : null;

    // Countdown check — play sound when ≤1 min remaining
    if (curr === 'RUNNING' && ns) {
      const remainSec = parseInt(data.mc_remaining_time) * 60;
      if (remainSec > 0) ns.checkCountdown(printerId, remainSec);
    }

    // Skip first update (initialization)
    if (!prev) return;
    if (prev === curr) return;

    const key = `${printerId}:${curr}`;

    if (prev === 'RUNNING' && curr === 'FINISH') {
      notify(key, t('notify.print_finished'), t('notify.print_finished_body', { name }));
      if (ns) ns.play('print_complete');
    } else if (prev === 'RUNNING' && curr === 'FAILED') {
      notify(key, t('notify.print_failed'), t('notify.print_failed_body', { name }));
      if (ns) ns.play('print_failed');
    } else if (prev !== 'RUNNING' && curr === 'RUNNING') {
      notify(key, t('notify.print_started'), t('notify.print_started_body', { name }));
      if (ns) ns.play('print_started');
    } else if (prev === 'RUNNING' && curr === 'PAUSE') {
      notify(key, t('notify.print_paused') || 'Print paused', name);
      if (ns) ns.play('print_paused');
    }
  };

  document.addEventListener('DOMContentLoaded', requestPermission);
})();
