/**
 * Table Enhancer — adds search, column sorting, and pagination to Bootstrap tables.
 * Usage: enhanceTable(container, { searchable: true, sortable: true, pageSize: 20 })
 *
 * Expects the container to have a <table class="table"> with <thead> and <tbody>.
 * Inserts a search bar above and pagination below the table automatically.
 */
(function () {
  'use strict';

  const SORT_ASC = 'asc';
  const SORT_DESC = 'desc';

  /**
   * Enhance a table inside a container element.
   * @param {HTMLElement} container - The element wrapping the <table>
   * @param {Object} opts
   * @param {boolean} [opts.searchable=true] - Show search input
   * @param {boolean} [opts.sortable=true] - Enable column sorting
   * @param {number} [opts.pageSize=20] - Rows per page (0 = no pagination)
   * @param {string} [opts.searchPlaceholder='Search...'] - Placeholder text
   * @returns {{ refresh: Function, destroy: Function }}
   */
  window.enhanceTable = function (container, opts = {}) {
    const {
      searchable = true,
      sortable = true,
      pageSize = 20,
      searchPlaceholder = 'Search...'
    } = opts;

    const table = container.querySelector('table');
    if (!table) return null;

    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    if (!thead || !tbody) return null;

    let _allRows = [];
    let _filteredRows = [];
    let _currentPage = 1;
    let _sortCol = -1;
    let _sortDir = SORT_ASC;
    let _searchTerm = '';

    // ---- Search bar ----
    let searchInput = null;
    if (searchable) {
      const searchWrap = document.createElement('div');
      searchWrap.className = 'te-search-wrap';
      searchWrap.innerHTML = `<input type="text" class="form-input form-input-sm te-search" placeholder="${searchPlaceholder}">`;
      table.parentNode.insertBefore(searchWrap, table);
      searchInput = searchWrap.querySelector('input');
      searchInput.addEventListener('input', () => {
        _searchTerm = searchInput.value.trim().toLowerCase();
        _currentPage = 1;
        _applyFilter();
        _render();
      });
    }

    // ---- Sortable headers ----
    if (sortable) {
      const ths = thead.querySelectorAll('th');
      ths.forEach((th, idx) => {
        if (th.dataset.noSort != null) return;
        th.classList.add('te-sortable');
        th.style.cursor = 'pointer';
        th.addEventListener('click', () => {
          if (_sortCol === idx) {
            _sortDir = _sortDir === SORT_ASC ? SORT_DESC : SORT_ASC;
          } else {
            _sortCol = idx;
            _sortDir = SORT_ASC;
          }
          _updateSortIndicators(ths);
          _applySort();
          _render();
        });
      });
    }

    // ---- Pagination container ----
    let pagWrap = null;
    if (pageSize > 0) {
      pagWrap = document.createElement('nav');
      pagWrap.className = 'te-pagination-wrap';
      pagWrap.setAttribute('aria-label', 'Table pagination');
      table.parentNode.insertBefore(pagWrap, table.nextSibling);
    }

    // ---- Internal methods ----
    function _snapshot() {
      _allRows = Array.from(tbody.querySelectorAll('tr'));
      _applyFilter();
      _applySort();
    }

    function _applyFilter() {
      if (!_searchTerm) {
        _filteredRows = [..._allRows];
      } else {
        _filteredRows = _allRows.filter(row => {
          return row.textContent.toLowerCase().includes(_searchTerm);
        });
      }
    }

    function _applySort() {
      if (_sortCol < 0) return;
      _filteredRows.sort((a, b) => {
        const cellA = a.cells[_sortCol]?.textContent.trim() || '';
        const cellB = b.cells[_sortCol]?.textContent.trim() || '';
        // Try numeric comparison
        const numA = parseFloat(cellA.replace(/[^0-9.\-]/g, ''));
        const numB = parseFloat(cellB.replace(/[^0-9.\-]/g, ''));
        if (!isNaN(numA) && !isNaN(numB)) {
          return _sortDir === SORT_ASC ? numA - numB : numB - numA;
        }
        // Date comparison (dd.mm.yyyy or yyyy-mm-dd)
        const dateA = _parseDate(cellA);
        const dateB = _parseDate(cellB);
        if (dateA && dateB) {
          return _sortDir === SORT_ASC ? dateA - dateB : dateB - dateA;
        }
        // String comparison
        const cmp = cellA.localeCompare(cellB, undefined, { numeric: true, sensitivity: 'base' });
        return _sortDir === SORT_ASC ? cmp : -cmp;
      });
    }

    function _parseDate(str) {
      if (!str) return null;
      // yyyy-mm-dd
      const iso = Date.parse(str);
      if (!isNaN(iso)) return iso;
      // dd.mm.yyyy or dd/mm/yyyy
      const m = str.match(/^(\d{1,2})[./](\d{1,2})[./](\d{4})$/);
      if (m) return new Date(+m[3], +m[2] - 1, +m[1]).getTime();
      return null;
    }

    function _render() {
      // Hide all rows
      _allRows.forEach(r => r.style.display = 'none');

      // Determine page slice
      const total = _filteredRows.length;
      const totalPages = pageSize > 0 ? Math.max(1, Math.ceil(total / pageSize)) : 1;
      if (_currentPage > totalPages) _currentPage = totalPages;

      const start = pageSize > 0 ? (_currentPage - 1) * pageSize : 0;
      const end = pageSize > 0 ? start + pageSize : total;
      const pageRows = _filteredRows.slice(start, end);

      // Show visible rows and re-order in DOM
      pageRows.forEach(r => {
        r.style.display = '';
        tbody.appendChild(r); // re-order
      });

      // Render pagination
      if (pagWrap) _renderPagination(totalPages, total);
    }

    function _renderPagination(totalPages, totalItems) {
      if (totalPages <= 1) {
        pagWrap.innerHTML = totalItems > 0
          ? `<small class="te-page-info text-muted">${totalItems} items</small>`
          : '';
        return;
      }
      let html = `<small class="te-page-info text-muted">${totalItems} items · Page ${_currentPage}/${totalPages}</small>`;
      html += '<ul class="pagination pagination-sm mb-0">';
      html += `<li class="page-item ${_currentPage === 1 ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${_currentPage - 1}">‹</a></li>`;

      // Show up to 5 page buttons
      const startPage = Math.max(1, _currentPage - 2);
      const endPage = Math.min(totalPages, startPage + 4);
      for (let i = startPage; i <= endPage; i++) {
        html += `<li class="page-item ${i === _currentPage ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
      }

      html += `<li class="page-item ${_currentPage === totalPages ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${_currentPage + 1}">›</a></li>`;
      html += '</ul>';
      pagWrap.innerHTML = html;

      pagWrap.querySelectorAll('[data-page]').forEach(a => {
        a.addEventListener('click', (e) => {
          e.preventDefault();
          const p = parseInt(a.dataset.page);
          if (p >= 1 && p <= totalPages) {
            _currentPage = p;
            _render();
          }
        });
      });
    }

    function _updateSortIndicators(ths) {
      ths.forEach((th, idx) => {
        th.classList.remove('te-sort-asc', 'te-sort-desc');
        if (idx === _sortCol) {
          th.classList.add(_sortDir === SORT_ASC ? 'te-sort-asc' : 'te-sort-desc');
        }
      });
    }

    // ---- Public API ----
    function refresh() {
      _snapshot();
      _render();
    }

    function destroy() {
      if (searchInput?.parentNode) searchInput.parentNode.remove();
      if (pagWrap) pagWrap.remove();
      _allRows.forEach(r => r.style.display = '');
      thead.querySelectorAll('.te-sortable').forEach(th => {
        th.classList.remove('te-sortable', 'te-sort-asc', 'te-sort-desc');
        th.style.cursor = '';
      });
    }

    // Initial render
    _snapshot();
    _render();

    return { refresh, destroy };
  };
})();
