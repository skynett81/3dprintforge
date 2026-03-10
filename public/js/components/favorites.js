(function() {
  'use strict';

  const STORAGE_KEY = 'favoritePanels';

  function _getFavs() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  }

  function _saveFavs(favs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
  }

  window.toggleFavorite = function(panelName) {
    const favs = _getFavs();
    const idx = favs.indexOf(panelName);
    if (idx === -1) {
      favs.push(panelName);
    } else {
      favs.splice(idx, 1);
    }
    _saveFavs(favs);
    window.renderFavorites();
    // Update the star button in panel header if visible
    _updatePanelStarButton(panelName);
  };

  window.isFavorite = function(panelName) {
    return _getFavs().indexOf(panelName) !== -1;
  };

  window.getFavorites = function() {
    return _getFavs();
  };

  function _updatePanelStarButton(panelName) {
    const btn = document.querySelector('.fav-toggle-btn');
    if (!btn || btn.dataset.panel !== panelName) return;
    const isFav = window.isFavorite(panelName);
    btn.classList.toggle('is-fav', isFav);
    btn.innerHTML = isFav
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
    btn.title = isFav ? 'Fjern fra favoritter' : 'Legg til favoritter';
  }

  window.renderFavorites = function() {
    const nav = document.getElementById('sidebar-nav');
    if (!nav) return;

    // Remove existing favorites section
    const existing = nav.querySelector('.sidebar-favorites');
    if (existing) existing.remove();

    const favs = _getFavs();
    if (favs.length === 0) return;

    // Get PANEL_TITLES from app.js scope — we read from the sidebar buttons as fallback
    const container = document.createElement('div');
    container.className = 'sidebar-favorites';

    const heading = document.createElement('div');
    heading.className = 'sidebar-section-toggle';
    heading.style.cssText = 'font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-muted);padding:4px 8px 2px;cursor:default;pointer-events:none;';
    heading.innerHTML = '<span>&#9733; Favoritter</span>';
    container.appendChild(heading);

    for (const panelName of favs) {
      // Find the original sidebar button to clone its icon and label
      const origBtn = nav.querySelector('.sidebar-btn[data-panel="' + panelName + '"]');
      if (!origBtn) continue;

      const btn = document.createElement('button');
      btn.className = 'sidebar-btn';
      btn.setAttribute('data-panel', panelName);
      btn.setAttribute('data-ripple', '');
      btn.onclick = function() { window.openPanel(panelName); };

      // Star icon
      const star = document.createElement('span');
      star.className = 'fav-star';
      star.innerHTML = '&#9733;';
      btn.appendChild(star);

      // Clone label text
      const labelSpan = origBtn.querySelector('span');
      if (labelSpan) {
        const cloned = labelSpan.cloneNode(true);
        btn.appendChild(cloned);
      } else {
        btn.textContent = panelName;
      }

      // Un-favorite button (small X)
      const unfav = document.createElement('span');
      unfav.className = 'fav-remove-btn';
      unfav.innerHTML = '&times;';
      unfav.title = 'Fjern fra favoritter';
      unfav.style.cssText = 'margin-left:auto;cursor:pointer;opacity:0.5;font-size:14px;padding:0 4px;';
      unfav.onclick = function(e) {
        e.stopPropagation();
        window.toggleFavorite(panelName);
      };
      btn.appendChild(unfav);

      container.appendChild(btn);
    }

    // Insert before the first child of nav (dashboard button or first section)
    nav.insertBefore(container, nav.firstChild);

    // Re-apply active state if current panel is a favorite
    if (window._activePanel && favs.indexOf(window._activePanel) !== -1) {
      const activeBtn = container.querySelector('.sidebar-btn[data-panel="' + window._activePanel + '"]');
      if (activeBtn) activeBtn.classList.add('active');
    }
  };

  document.addEventListener('DOMContentLoaded', function() {
    window.renderFavorites();
  });
})();
