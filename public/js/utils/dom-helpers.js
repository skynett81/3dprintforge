export function el(tag, attrs = {}, ...children) {
  const element = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(element.style, value);
    } else if (key.startsWith('on')) {
      element.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      element.setAttribute(key, value);
    }
  }
  for (const child of children) {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else if (child) {
      element.appendChild(child);
    }
  }
  return element;
}

export function $(selector) {
  return document.querySelector(selector);
}

export function $$(selector) {
  return document.querySelectorAll(selector);
}

export function setText(selector, text) {
  const elem = typeof selector === 'string' ? $(selector) : selector;
  if (elem) elem.textContent = text;
}

export function setHTML(selector, html) {
  const elem = typeof selector === 'string' ? $(selector) : selector;
  if (elem) elem.innerHTML = html;
}

const ESC_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function esc(str) {
  if (str == null) return '';
  return String(str).replace(/[&<>"']/g, c => ESC_MAP[c]);
}

/**
 * Generate HTML for an empty state placeholder.
 * @param {Object} opts
 * @param {string} opts.icon - SVG string for the icon
 * @param {string} opts.title - Main heading
 * @param {string} [opts.desc] - Description text
 * @param {string} [opts.actionLabel] - Button label
 * @param {string} [opts.actionOnClick] - onclick handler string
 * @returns {string} HTML string
 */
export function emptyState({ icon, title, desc, actionLabel, actionOnClick }) {
  let html = '<div class="empty-state">';
  if (icon) html += '<div class="empty-state-icon">' + icon + '</div>';
  html += '<div class="empty-state-title">' + esc(title) + '</div>';
  if (desc) html += '<div class="empty-state-desc">' + esc(desc) + '</div>';
  if (actionLabel) {
    html += '<div class="empty-state-action"><button class="form-btn" ' +
      (actionOnClick ? 'onclick="' + esc(actionOnClick) + '"' : '') +
      '>' + esc(actionLabel) + '</button></div>';
  }
  html += '</div>';
  return html;
}

window.emptyState = emptyState;

/**
 * Trigger a file download from the given URL.
 * @param {string} url - The URL to download from
 */
export function downloadExport(url) {
  const a = document.createElement('a');
  a.href = url;
  a.download = '';
  document.body.appendChild(a);
  a.click();
  a.remove();
}
window.downloadExport = downloadExport;

export function copyToClipboard(text, label) {
  navigator.clipboard.writeText(text).then(() => {
    if (typeof showToast === 'function') showToast((label || 'Kopiert') + ': ' + text, 'success', 2000);
  }).catch(() => {
    // Fallback for non-secure contexts
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;left:-9999px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    if (typeof showToast === 'function') showToast((label || 'Kopiert') + ': ' + text, 'success', 2000);
  });
}
window.copyToClipboard = copyToClipboard;

// Compact relative time ("3m ago", "2h ago", "5d ago") — shared so every
// panel formats timestamps the same way instead of rolling its own.
export function relativeTime(iso) {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  if (isNaN(then)) return '';
  const mins = Math.floor((Date.now() - then) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return mins + 'm ago';
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + 'h ago';
  const days = Math.floor(hrs / 24);
  if (days < 7) return days + 'd ago';
  if (days < 35) return Math.floor(days / 7) + 'w ago';
  if (days < 365) return Math.floor(days / 30) + 'mo ago';
  return Math.floor(days / 365) + 'y ago';
}
// Same value wrapped so hovering reveals the exact local timestamp.
export function relativeTimeHtml(iso) {
  if (!iso) return '';
  const rel = relativeTime(iso);
  if (!rel) return '';
  let abs = '';
  try { abs = new Date(iso).toLocaleString(); } catch (e) { abs = String(iso); }
  return '<span class="rel-time" title="' + String(abs).replace(/"/g, '&quot;') + '">' + rel + '</span>';
}
window.relativeTime = relativeTime;
window.relativeTimeHtml = relativeTimeHtml;

// Expose globally for non-module scripts
window.esc = esc;
