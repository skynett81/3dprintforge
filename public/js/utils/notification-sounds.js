// Notification Sounds — Web Audio API tones (no external files needed)
(function() {
  'use strict';

  let _audioCtx = null;
  let _enabled = true;

  function _ctx() {
    if (!_audioCtx) {
      try { _audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (_) {}
    }
    return _audioCtx;
  }

  function _playTone(freq, duration, type, volume) {
    if (!_enabled) return;
    const ctx = _ctx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    gain.gain.value = volume || 0.15;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (duration || 0.3));
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + (duration || 0.3));
  }

  window.notificationSound = {
    success: () => { _playTone(523, 0.15); setTimeout(() => _playTone(659, 0.15), 150); setTimeout(() => _playTone(784, 0.2), 300); },
    error: () => { _playTone(330, 0.2, 'square', 0.1); setTimeout(() => _playTone(262, 0.3, 'square', 0.1), 200); },
    warning: () => { _playTone(440, 0.15); setTimeout(() => _playTone(440, 0.15), 200); },
    info: () => { _playTone(587, 0.2, 'sine', 0.1); },
    printComplete: () => { _playTone(523, 0.12); setTimeout(() => _playTone(659, 0.12), 120); setTimeout(() => _playTone(784, 0.12), 240); setTimeout(() => _playTone(1047, 0.25), 360); },
    printFailed: () => { _playTone(440, 0.2, 'sawtooth', 0.08); setTimeout(() => _playTone(370, 0.2, 'sawtooth', 0.08), 200); setTimeout(() => _playTone(311, 0.3, 'sawtooth', 0.08), 400); },

    setEnabled: (val) => { _enabled = !!val; try { localStorage.setItem('notification-sounds', _enabled ? '1' : '0'); } catch (_) {} },
    isEnabled: () => _enabled
  };

  // Restore preference
  try {
    const stored = localStorage.getItem('notification-sounds');
    if (stored === '0') _enabled = false;
  } catch (_) {}
})();
