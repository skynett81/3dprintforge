// Browser Notifications for print events
(function() {
  let previousStates = {};
  let enabled = false;
  let recentNotifs = {};
  const COOLDOWN_MS = 60000; // Don't repeat same notification within 60s

  function requestPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(p => { enabled = p === 'granted'; });
    }
    enabled = typeof Notification !== 'undefined' && Notification.permission === 'granted';
  }

  function notify(key, title, body) {
    if (!enabled) return;
    // Debounce: skip if same notification was sent recently
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

    // Skip first update (initialization) — no previous state to compare
    if (!prev) return;
    // Skip if state didn't change
    if (prev === curr) return;

    const name = data.subtask_name || t('notify.print');
    const key = `${printerId}:${curr}`;

    if (prev === 'RUNNING' && curr === 'FINISH') {
      notify(key, t('notify.print_finished'), t('notify.print_finished_body', { name }));
      if (typeof notificationSound !== 'undefined') notificationSound.printComplete();
    } else if (prev === 'RUNNING' && curr === 'FAILED') {
      notify(key, t('notify.print_failed'), t('notify.print_failed_body', { name }));
      if (typeof notificationSound !== 'undefined') notificationSound.printFailed();
    } else if (prev !== 'RUNNING' && curr === 'RUNNING') {
      notify(key, t('notify.print_started'), t('notify.print_started_body', { name }));
      if (typeof notificationSound !== 'undefined') notificationSound.info();
    }
  };

  document.addEventListener('DOMContentLoaded', requestPermission);
})();
