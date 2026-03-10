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

// Expose globally for non-module scripts
window.esc = esc;
