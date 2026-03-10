// Theme engine — presets + customization, persisted to localStorage
(function() {
  'use strict';

  const STORAGE_KEY = 'bambu-theme';
  const DEFAULT_ACCENT = '#00AE42';
  const DEFAULT_RADIUS = 12;

  const PRESETS = {
    light: {
      '--bg-primary': '#f5f5f5',
      '--bg-secondary': '#ffffff',
      '--bg-tertiary': '#f0f0f0',
      '--bg-card': '#ffffff',
      '--bg-elevated': '#ffffff',
      '--bg-inset': 'rgba(0, 0, 0, 0.04)',
      '--text-primary': '#1a1a1a',
      '--text-secondary': '#555555',
      '--text-muted': '#999999',
      '--border-color': 'rgba(0, 0, 0, 0.08)',
      '--border-subtle': 'rgba(0, 0, 0, 0.05)',
      '--shadow-sm': '0 1px 3px rgba(0, 0, 0, 0.06)',
      '--shadow-md': '0 4px 12px rgba(0, 0, 0, 0.08)',
      '--shadow-lg': '0 8px 24px rgba(0, 0, 0, 0.12)',
      '--shadow-glow': 'none',
      '--shadow-neon': 'none',
      '--shadow-inset': 'none',
      '--surface-glass': 'rgba(255, 255, 255, 0.95)',
      '--surface-glass-strong': 'rgba(255, 255, 255, 0.98)',
      '--neon-blue': 'transparent',
      '--neon-cyan': 'transparent',
      '--neon-purple': 'transparent',
      '--glow-green': 'rgba(0, 174, 66, 0.08)',
      '--glow-blue': 'rgba(18, 121, 255, 0.06)',
      '--glow-red': 'rgba(229, 57, 53, 0.06)',
      '--glow-cyan': 'rgba(0, 174, 66, 0.06)',
    },
    dark: {
      '--bg-primary': '#121218',
      '--bg-secondary': '#1a1a24',
      '--bg-tertiary': '#222230',
      '--bg-card': '#1a1a24',
      '--bg-elevated': '#252535',
      '--bg-inset': 'rgba(0, 0, 0, 0.2)',
      '--text-primary': '#e8e8ec',
      '--text-secondary': '#a0a0b0',
      '--text-muted': '#6b6b7a',
      '--border-color': 'rgba(255, 255, 255, 0.08)',
      '--border-subtle': 'rgba(255, 255, 255, 0.05)',
      '--shadow-sm': '0 1px 3px rgba(0, 0, 0, 0.3)',
      '--shadow-md': '0 4px 12px rgba(0, 0, 0, 0.4)',
      '--shadow-lg': '0 8px 24px rgba(0, 0, 0, 0.5)',
      '--shadow-glow': 'none',
      '--shadow-neon': 'none',
      '--shadow-inset': 'none',
      '--surface-glass': 'rgba(26, 26, 36, 0.95)',
      '--surface-glass-strong': 'rgba(26, 26, 36, 0.98)',
      '--neon-blue': 'transparent',
      '--neon-cyan': 'transparent',
      '--neon-purple': 'transparent',
      '--glow-green': 'rgba(0, 174, 66, 0.15)',
      '--glow-blue': 'rgba(18, 121, 255, 0.12)',
      '--glow-red': 'rgba(229, 57, 53, 0.12)',
      '--glow-cyan': 'rgba(0, 174, 66, 0.12)',
    },
    oled: {
      '--bg-primary': '#000000',
      '--bg-secondary': '#0a0a0a',
      '--bg-tertiary': '#111111',
      '--bg-card': '#0a0a0a',
      '--bg-elevated': '#151515',
      '--bg-inset': 'rgba(0, 0, 0, 0.4)',
      '--text-primary': '#e8e8ec',
      '--text-secondary': '#a0a0b0',
      '--text-muted': '#6b6b7a',
      '--border-color': 'rgba(255, 255, 255, 0.06)',
      '--border-subtle': 'rgba(255, 255, 255, 0.03)',
      '--shadow-sm': '0 1px 3px rgba(0, 0, 0, 0.5)',
      '--shadow-md': '0 4px 12px rgba(0, 0, 0, 0.6)',
      '--shadow-lg': '0 8px 24px rgba(0, 0, 0, 0.7)',
      '--shadow-glow': 'none',
      '--shadow-neon': 'none',
      '--shadow-inset': 'none',
      '--surface-glass': 'rgba(10, 10, 10, 0.95)',
      '--surface-glass-strong': 'rgba(10, 10, 10, 0.98)',
      '--neon-blue': 'transparent',
      '--neon-cyan': 'transparent',
      '--neon-purple': 'transparent',
      '--glow-green': 'rgba(0, 174, 66, 0.15)',
      '--glow-blue': 'rgba(18, 121, 255, 0.12)',
      '--glow-red': 'rgba(229, 57, 53, 0.12)',
      '--glow-cyan': 'rgba(0, 174, 66, 0.12)',
    },
    bambuGreen: {
      '--bg-primary': '#0a1a0f',
      '--bg-secondary': '#0f2015',
      '--bg-tertiary': '#142a1b',
      '--bg-card': '#0f2015',
      '--bg-elevated': '#1a3522',
      '--bg-inset': 'rgba(0, 0, 0, 0.3)',
      '--text-primary': '#e0f0e6',
      '--text-secondary': '#8fbf9a',
      '--text-muted': '#5a8a66',
      '--border-color': 'rgba(0, 212, 106, 0.1)',
      '--border-subtle': 'rgba(0, 212, 106, 0.06)',
      '--shadow-sm': '0 1px 3px rgba(0, 0, 0, 0.4)',
      '--shadow-md': '0 4px 12px rgba(0, 0, 0, 0.5)',
      '--shadow-lg': '0 8px 24px rgba(0, 0, 0, 0.6)',
      '--shadow-glow': 'none',
      '--shadow-neon': 'none',
      '--shadow-inset': 'none',
      '--surface-glass': 'rgba(15, 32, 21, 0.95)',
      '--surface-glass-strong': 'rgba(15, 32, 21, 0.98)',
      '--neon-blue': 'transparent',
      '--neon-cyan': 'transparent',
      '--neon-purple': 'transparent',
      '--glow-green': 'rgba(0, 212, 106, 0.2)',
      '--glow-blue': 'rgba(18, 121, 255, 0.12)',
      '--glow-red': 'rgba(229, 57, 53, 0.12)',
      '--glow-cyan': 'rgba(0, 212, 106, 0.15)',
      '--accent-green': '#00d46a',
    },
    midnightBlue: {
      '--bg-primary': '#0a0f1a',
      '--bg-secondary': '#0f1520',
      '--bg-tertiary': '#14202a',
      '--bg-card': '#0f1520',
      '--bg-elevated': '#1a2535',
      '--bg-inset': 'rgba(0, 0, 0, 0.3)',
      '--text-primary': '#e0e8f0',
      '--text-secondary': '#8fa0bf',
      '--text-muted': '#5a6a8a',
      '--border-color': 'rgba(77, 159, 255, 0.1)',
      '--border-subtle': 'rgba(77, 159, 255, 0.06)',
      '--shadow-sm': '0 1px 3px rgba(0, 0, 0, 0.4)',
      '--shadow-md': '0 4px 12px rgba(0, 0, 0, 0.5)',
      '--shadow-lg': '0 8px 24px rgba(0, 0, 0, 0.6)',
      '--shadow-glow': 'none',
      '--shadow-neon': 'none',
      '--shadow-inset': 'none',
      '--surface-glass': 'rgba(15, 21, 32, 0.95)',
      '--surface-glass-strong': 'rgba(15, 21, 32, 0.98)',
      '--neon-blue': 'transparent',
      '--neon-cyan': 'transparent',
      '--neon-purple': 'transparent',
      '--glow-green': 'rgba(0, 174, 66, 0.15)',
      '--glow-blue': 'rgba(77, 159, 255, 0.2)',
      '--glow-red': 'rgba(229, 57, 53, 0.12)',
      '--glow-cyan': 'rgba(77, 159, 255, 0.15)',
      '--accent-blue': '#4d9fff',
    }
  };

  let _config = { preset: 'light', accentColor: null, radius: DEFAULT_RADIUS };
  let _mediaQuery = null;

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        _config.preset = ['light', 'dark', 'auto', 'oled', 'bambuGreen', 'midnightBlue'].includes(parsed.preset) ? parsed.preset : 'light';
        _config.accentColor = typeof parsed.accentColor === 'string' ? parsed.accentColor : null;
        _config.radius = typeof parsed.radius === 'number' ? Math.max(0, Math.min(20, parsed.radius)) : DEFAULT_RADIUS;
      }
    } catch (_) {}
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(_config)); } catch (_) {}
  }

  function resolvePreset() {
    if (_config.preset === 'auto') {
      return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    }
    return PRESETS[_config.preset] ? _config.preset : 'light';
  }

  function apply() {
    const resolved = resolvePreset();
    const vars = PRESETS[resolved];
    const root = document.documentElement;

    // Enable smooth theme transition
    document.documentElement.classList.add('theme-transitioning');

    // Apply preset vars
    for (const [key, val] of Object.entries(vars)) {
      root.style.setProperty(key, val);
    }

    // Accent color override
    const accent = _config.accentColor || DEFAULT_ACCENT;
    root.style.setProperty('--accent-green', accent);
    root.style.setProperty('--accent-cyan', accent);
    root.style.setProperty('--accent-primary', accent);

    // Generate glow from accent
    const rgb = hexToRGB(accent);
    if (rgb) {
      const glowOpacity = resolved === 'dark' ? 0.15 : 0.08;
      const glowVal = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${glowOpacity})`;
      root.style.setProperty('--glow-green', glowVal);
      root.style.setProperty('--glow-cyan', glowVal);
    }

    // Radius
    const r = _config.radius;
    root.style.setProperty('--radius', r + 'px');
    root.style.setProperty('--radius-sm', Math.max(r - 4, 2) + 'px');
    root.style.setProperty('--radius-xs', Math.max(r - 8, 0) + 'px');

    // data-theme attribute for CSS selectors (icon visibility etc.)
    const themeFamily = (resolved === 'light') ? 'light' : 'dark';
    root.setAttribute('data-theme', themeFamily);

    // Update toggle button icon if present
    updateToggleButton(themeFamily);

    // Remove transition class after animation completes
    clearTimeout(window._themeTransTimeout);
    window._themeTransTimeout = setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 400);
  }

  function updateToggleButton(resolved) {
    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;
    const sunIcon = btn.querySelector('.theme-icon-light');
    const moonIcon = btn.querySelector('.theme-icon-dark');
    if (sunIcon) sunIcon.style.display = resolved === 'dark' ? 'none' : 'block';
    if (moonIcon) moonIcon.style.display = resolved === 'dark' ? 'block' : 'none';
  }

  function hexToRGB(hex) {
    const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
    if (!m) return null;
    return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
  }

  function setupAutoListener() {
    if (_mediaQuery) return;
    if (!window.matchMedia) return;
    _mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    _mediaQuery.addEventListener('change', () => {
      if (_config.preset === 'auto') apply();
    });
  }

  // Public API
  window.theme = {
    get() {
      return { ..._config };
    },

    set(updates) {
      if (updates.preset !== undefined) {
        _config.preset = ['light', 'dark', 'auto', 'oled', 'bambuGreen', 'midnightBlue'].includes(updates.preset) ? updates.preset : 'light';
      }
      if (updates.accentColor !== undefined) {
        _config.accentColor = updates.accentColor;
      }
      if (updates.radius !== undefined) {
        _config.radius = Math.max(0, Math.min(20, updates.radius));
      }
      save();
      apply();
    },

    toggle() {
      const resolved = resolvePreset();
      _config.preset = resolved === 'light' ? 'dark' : 'light';
      save();
      apply();
    },

    getPresets() {
      const result = {};
      for (const key of Object.keys(PRESETS)) {
        result[key] = { ...PRESETS[key] };
      }
      return result;
    },

    getCSSVar(name) {
      return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    },

    getDefaultAccent() {
      return DEFAULT_ACCENT;
    },

    getDefaultRadius() {
      return DEFAULT_RADIUS;
    }
  };

  // Compact mode toggle
  window.toggleCompactMode = function() {
    const isCompact = document.body.classList.toggle('compact-mode');
    try { localStorage.setItem('compact-mode', isCompact ? '1' : '0'); } catch (_) {}
  };

  // Init immediately
  load();
  setupAutoListener();
  apply();

  // Restore compact mode from localStorage
  try {
    if (localStorage.getItem('compact-mode') === '1') document.body.classList.add('compact-mode');
  } catch (_) {}
})();
