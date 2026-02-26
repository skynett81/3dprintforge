// Dashboard Drag & Drop — reorder cards with persistence + lock toggle
(function() {
  const STORAGE_KEY = 'dashboard-card-order';
  const LOCK_KEY = 'dashboard-layout-locked';
  let _draggedCard = null;
  let _locked = true;

  function getCardIds(grid) {
    return Array.from(grid.children)
      .filter(el => el.classList.contains('card'))
      .map(el => el.id);
  }

  function saveOrder(grid) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(getCardIds(grid)));
    } catch (_) {}
  }

  function restoreOrder(grid) {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!Array.isArray(saved)) return;

      const cards = {};
      grid.querySelectorAll('.card').forEach(c => { cards[c.id] = c; });

      // Only restore if all saved IDs exist
      if (!saved.every(id => cards[id])) return;

      saved.forEach(id => {
        if (cards[id]) grid.appendChild(cards[id]);
      });
    } catch (_) {}
  }

  function onDragStart(e) {
    if (_locked) { e.preventDefault(); return; }
    _draggedCard = this;
    this.classList.add('card-dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.id);
  }

  function onDragOver(e) {
    if (_locked) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  function onDragEnter(e) {
    if (_locked) return;
    e.preventDefault();
    if (this !== _draggedCard && this.classList.contains('card')) {
      this.classList.add('card-drag-over');
    }
  }

  function onDragLeave() {
    this.classList.remove('card-drag-over');
  }

  function onDrop(e) {
    if (_locked) return;
    e.preventDefault();
    this.classList.remove('card-drag-over');

    if (!_draggedCard || this === _draggedCard || !this.classList.contains('card')) return;

    const grid = this.parentNode;
    const cards = Array.from(grid.querySelectorAll('.card'));
    const fromIdx = cards.indexOf(_draggedCard);
    const toIdx = cards.indexOf(this);

    if (fromIdx < 0 || toIdx < 0) return;

    // Swap positions in DOM
    if (fromIdx < toIdx) {
      grid.insertBefore(_draggedCard, this.nextSibling);
    } else {
      grid.insertBefore(_draggedCard, this);
    }

    saveOrder(grid);
  }

  function onDragEnd() {
    _draggedCard = null;
    document.querySelectorAll('.card-dragging, .card-drag-over').forEach(el => {
      el.classList.remove('card-dragging', 'card-drag-over');
    });
  }

  function applyLockState() {
    const grid = document.getElementById('dashboard-grid');
    if (!grid) return;

    grid.querySelectorAll('.card').forEach(card => {
      card.draggable = !_locked;
    });

    grid.classList.toggle('layout-unlocked', !_locked);

    // Update lock button icon + tooltip
    const btn = document.getElementById('layout-lock-btn');
    if (btn) {
      btn.classList.toggle('unlocked', !_locked);
      btn.title = _locked ? t('layout.locked') : t('layout.unlocked');
    }
  }

  window.toggleLayoutLock = function() {
    _locked = !_locked;
    try { localStorage.setItem(LOCK_KEY, _locked ? '1' : '0'); } catch (_) {}
    applyLockState();
  };

  function init() {
    const grid = document.getElementById('dashboard-grid');
    if (!grid) return;

    // Restore lock state (default: locked)
    try {
      const saved = localStorage.getItem(LOCK_KEY);
      _locked = saved === null ? true : saved === '1';
    } catch (_) { _locked = true; }

    restoreOrder(grid);

    grid.querySelectorAll('.card').forEach(card => {
      card.addEventListener('dragstart', onDragStart);
      card.addEventListener('dragover', onDragOver);
      card.addEventListener('dragenter', onDragEnter);
      card.addEventListener('dragleave', onDragLeave);
      card.addEventListener('drop', onDrop);
      card.addEventListener('dragend', onDragEnd);
    });

    applyLockState();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
