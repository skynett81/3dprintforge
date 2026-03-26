// Notification Sounds — Web Audio API tones + custom audio file support
(function() {
  'use strict';

  let _audioCtx = null;
  let _enabled = true;
  let _volume = 0.5;  // Master volume 0-1
  let _customSounds = {}; // { event: { url, name } }
  let _eventEnabled = {}; // { event: true/false }
  let _countdownPlayed = {}; // { printerId: true } — prevent repeat
  let _activeAudio = null; // Currently playing Audio element

  const EVENTS = [
    'print_complete', 'print_failed', 'print_started', 'print_paused',
    'filament_low', 'temperature_warning', 'countdown_1min',
    'maintenance_due', 'error'
  ];

  const EVENT_LABELS = {
    print_complete: 'Print completed',
    print_failed: 'Print failed',
    print_started: 'Print started',
    print_paused: 'Print paused',
    filament_low: 'Filament low',
    temperature_warning: 'Temperature warning',
    countdown_1min: 'Countdown (1 min left)',
    maintenance_due: 'Maintenance overdue',
    error: 'Error'
  };

  function _ctx() {
    if (!_audioCtx) {
      try { _audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (_) {}
    }
    // Resume if suspended (autoplay policy)
    if (_audioCtx && _audioCtx.state === 'suspended') _audioCtx.resume();
    return _audioCtx;
  }

  function _playTone(freq, duration, type, vol) {
    if (!_enabled) return;
    const ctx = _ctx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    const v = (vol || 0.15) * _volume;
    gain.gain.value = v;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (duration || 0.3));
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + (duration || 0.3));
  }

  // Play a custom audio file (mp3/ogg/wav) — max 10 seconds
  function _playCustom(event) {
    const sound = _customSounds[event];
    if (!sound?.url) return false;
    try {
      // Stop any currently playing custom sound
      if (_activeAudio) { _activeAudio.pause(); _activeAudio = null; }
      const audio = new Audio(sound.url);
      audio.volume = _volume;
      // Enforce 10-second max
      audio.addEventListener('timeupdate', () => {
        if (audio.currentTime >= 10) { audio.pause(); audio.currentTime = 0; _activeAudio = null; }
      });
      audio.addEventListener('ended', () => { _activeAudio = null; });
      audio.play().catch(() => {});
      _activeAudio = audio;
      return true;
    } catch { return false; }
  }

  function _isEventEnabled(event) {
    if (!_enabled) return false;
    return _eventEnabled[event] !== false; // Default: enabled
  }

  // Play sound for an event — custom file first, then built-in fallback
  function _play(event, fallbackFn) {
    if (!_isEventEnabled(event)) return;
    if (!_playCustom(event) && fallbackFn) fallbackFn();
  }

  // Built-in tone sequences
  const BUILTIN = {
    print_complete: () => { _playTone(523, 0.12); setTimeout(() => _playTone(659, 0.12), 120); setTimeout(() => _playTone(784, 0.12), 240); setTimeout(() => _playTone(1047, 0.25), 360); },
    print_failed: () => { _playTone(440, 0.2, 'sawtooth', 0.08); setTimeout(() => _playTone(370, 0.2, 'sawtooth', 0.08), 200); setTimeout(() => _playTone(311, 0.3, 'sawtooth', 0.08), 400); },
    print_started: () => { _playTone(587, 0.2, 'sine', 0.1); },
    print_paused: () => { _playTone(440, 0.15); setTimeout(() => _playTone(330, 0.2), 200); },
    filament_low: () => { _playTone(440, 0.15); setTimeout(() => _playTone(440, 0.15), 200); },
    temperature_warning: () => { _playTone(880, 0.1, 'square', 0.08); setTimeout(() => _playTone(880, 0.1, 'square', 0.08), 150); setTimeout(() => _playTone(880, 0.1, 'square', 0.08), 300); },
    countdown_1min: () => { _playTone(523, 0.12); setTimeout(() => _playTone(659, 0.12), 120); setTimeout(() => _playTone(784, 0.12), 240); },
    maintenance_due: () => { _playTone(392, 0.2); setTimeout(() => _playTone(440, 0.2), 250); },
    error: () => { _playTone(330, 0.2, 'square', 0.1); setTimeout(() => _playTone(262, 0.3, 'square', 0.1), 200); },
  };

  window.notificationSound = {
    // Legacy API (backward compatible)
    success: () => _play('print_complete', BUILTIN.print_complete),
    error: () => _play('error', BUILTIN.error),
    warning: () => _play('filament_low', BUILTIN.filament_low),
    info: () => _play('print_started', BUILTIN.print_started),
    printComplete: () => _play('print_complete', BUILTIN.print_complete),
    printFailed: () => _play('print_failed', BUILTIN.print_failed),

    // New event-based API
    play: (event) => _play(event, BUILTIN[event]),
    stop: () => { if (_activeAudio) { _activeAudio.pause(); _activeAudio = null; } },

    // Countdown — check remaining time and play once at 1 min
    checkCountdown: (printerId, remainingSeconds) => {
      if (!_isEventEnabled('countdown_1min')) return;
      if (remainingSeconds > 0 && remainingSeconds <= 60 && !_countdownPlayed[printerId]) {
        _countdownPlayed[printerId] = true;
        _play('countdown_1min', BUILTIN.countdown_1min);
      }
      // Reset when print ends or new print starts
      if (remainingSeconds <= 0 || remainingSeconds > 120) {
        delete _countdownPlayed[printerId];
      }
    },

    // Configuration
    setEnabled: (val) => { _enabled = !!val; _save(); },
    isEnabled: () => _enabled,

    setVolume: (val) => { _volume = Math.max(0, Math.min(1, parseFloat(val) || 0.5)); _save(); },
    getVolume: () => _volume,

    setEventEnabled: (event, val) => { _eventEnabled[event] = !!val; _save(); },
    isEventEnabled: (event) => _eventEnabled[event] !== false,

    // Custom sound management
    setCustomSound: (event, url, name) => {
      if (url) {
        _customSounds[event] = { url, name: name || 'Custom' };
      } else {
        delete _customSounds[event];
      }
      _save();
    },
    getCustomSound: (event) => _customSounds[event] || null,
    removeCustomSound: (event) => { delete _customSounds[event]; _save(); },

    // Upload a custom sound file — returns data URL (stored in localStorage)
    uploadSound: (event, file) => {
      return new Promise((resolve, reject) => {
        if (!file) return reject(new Error('No file'));
        if (file.size > 512000) return reject(new Error('Max 500 KB'));
        if (!file.type.startsWith('audio/')) return reject(new Error('Not an audio file'));
        const reader = new FileReader();
        reader.onload = () => {
          // Validate duration (max 10 seconds)
          const audio = new Audio(reader.result);
          audio.addEventListener('loadedmetadata', () => {
            if (audio.duration > 10.5) {
              return reject(new Error('Max 10 seconds'));
            }
            _customSounds[event] = { url: reader.result, name: file.name };
            _save();
            resolve({ name: file.name, duration: Math.round(audio.duration * 10) / 10 });
          });
          audio.addEventListener('error', () => reject(new Error('Invalid audio')));
        };
        reader.onerror = () => reject(new Error('Read failed'));
        reader.readAsDataURL(file);
      });
    },

    // Metadata
    EVENTS,
    EVENT_LABELS,
    getConfig: () => ({ enabled: _enabled, volume: _volume, events: { ..._eventEnabled }, custom: { ..._customSounds } })
  };

  // Persistence
  function _save() {
    try {
      localStorage.setItem('notification-sounds', JSON.stringify({
        enabled: _enabled,
        volume: _volume,
        events: _eventEnabled,
        custom: _customSounds
      }));
    } catch (_) {}
  }

  // Restore preferences
  try {
    const raw = localStorage.getItem('notification-sounds');
    if (raw) {
      if (raw === '0') {
        _enabled = false; // Legacy format
      } else if (raw === '1') {
        _enabled = true; // Legacy format
      } else {
        const cfg = JSON.parse(raw);
        if (typeof cfg.enabled === 'boolean') _enabled = cfg.enabled;
        if (typeof cfg.volume === 'number') _volume = cfg.volume;
        if (cfg.events) _eventEnabled = cfg.events;
        if (cfg.custom) _customSounds = cfg.custom;
      }
    }
  } catch (_) {}
})();
