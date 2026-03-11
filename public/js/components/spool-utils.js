// Global spool SVG utilities — reusable across all components
(function() {
  'use strict';

  /**
   * Inline mini spool SVG — replaces color dots/swatches everywhere.
   * @param {string} color - CSS color (hex or rgb)
   * @param {number} [size=16] - Size in px
   * @param {number} [pct=80] - Fill percentage (0-100)
   * @returns {string} HTML string with inline SVG
   */
  window.miniSpool = function(color, size, pct) {
    const sz = size || 16;
    const p = pct != null ? pct : 80;
    const hubR = 13;
    const maxR = 38;
    const filR = p > 0 ? hubR + (maxR - hubR) * Math.max(5, p) / 100 : hubR;
    const style = `display:inline-block;width:${sz}px;height:${sz}px;vertical-align:middle;flex-shrink:0`;
    return `<span style="${style}"><svg viewBox="0 0 100 100" style="width:100%;height:100%">
      <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border-color)" stroke-width="2.5" opacity="0.5"/>
      <circle cx="50" cy="50" r="${filR.toFixed(1)}" fill="${color || '#888'}"/>
      <circle cx="50" cy="50" r="${hubR}" fill="var(--bg-card, #1a1c20)" stroke="var(--border-color)" stroke-width="1.5"/>
      <circle cx="50" cy="50" r="5" fill="var(--bg-primary, #0d0f12)"/>
    </svg></span>`;
  };

  /**
   * Larger spool SVG with winding detail — for cards, headers, larger displays.
   * @param {string} color - CSS color
   * @param {number} [size=48] - Size in px
   * @param {number} [pct=80] - Fill percentage
   * @returns {string} HTML string
   */
  window.spoolIcon = function(color, size, pct) {
    const sz = size || 48;
    const p = pct != null ? pct : 80;
    const hubR = 13;
    const maxR = 38;
    const filR = p > 0 ? hubR + (maxR - hubR) * Math.max(5, p) / 100 : hubR;

    let windings = '';
    if (p > 8) {
      const gap = (filR - hubR) / Math.min(5, Math.max(2, Math.round((filR - hubR) / 4)));
      for (let r = hubR + gap; r < filR - 1; r += gap) {
        windings += `<circle cx="50" cy="50" r="${r.toFixed(1)}" fill="none" stroke="rgba(0,0,0,0.12)" stroke-width="0.6"/>`;
      }
    }

    const notches = [0, 90, 180, 270].map(deg => {
      const rad = deg * Math.PI / 180;
      const x1 = 50 + 40 * Math.cos(rad), y1 = 50 + 40 * Math.sin(rad);
      const x2 = 50 + 44 * Math.cos(rad), y2 = 50 + 44 * Math.sin(rad);
      return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="var(--border-color)" stroke-width="1.2" opacity="0.4"/>`;
    }).join('');

    const style = `display:inline-block;width:${sz}px;height:${sz}px;vertical-align:middle;flex-shrink:0`;
    return `<span style="${style}"><svg viewBox="0 0 100 100" style="width:100%;height:100%" class="spool-svg">
      <circle cx="50" cy="50" r="44" fill="rgba(0,0,0,0.06)"/>
      <circle cx="50" cy="50" r="42" class="spool-flange"/>
      ${notches}
      <circle cx="50" cy="50" r="${filR.toFixed(1)}" fill="${color || '#888'}" class="spool-filament"/>
      ${windings}
      <circle cx="50" cy="50" r="${hubR}" class="spool-hub"/>
      <circle cx="50" cy="50" r="5" class="spool-hole"/>
    </svg></span>`;
  };
})();
