// Permission state for frontend UI gating
// Fetches user permissions from /api/auth/status and provides window._can() for all components
(function() {
  let _perms = ['*'];
  let _user = null;
  let _authEnabled = false;

  function can(permission) {
    if (!_authEnabled) return true;
    if (_perms.includes('*')) return true;
    return _perms.includes(permission);
  }

  function canAny(...permissions) {
    return permissions.some(p => can(p));
  }

  function getUser() {
    return _user;
  }

  function isAuthEnabled() {
    return _authEnabled;
  }

  async function init() {
    try {
      const res = await fetch('/api/auth/status');
      const data = await res.json();
      _authEnabled = !!data.enabled;
      if (data.enabled && data.user) {
        _user = data.user;
        _perms = data.user.permissions || ['view'];
      } else if (!data.enabled) {
        _perms = ['*'];
      }
    } catch {
      _perms = ['*'];
    }
  }

  // Apply permission gating to DOM elements
  // Elements with data-perm="permission" will be hidden if user lacks that permission
  function applyGating(container) {
    if (!container) return;
    const els = container.querySelectorAll('[data-perm]');
    for (const el of els) {
      const perm = el.dataset.perm;
      if (!can(perm)) {
        el.style.display = 'none';
      }
    }
  }

  window._can = can;
  window._canAny = canAny;
  window._getUser = getUser;
  window._isAuthEnabled = isAuthEnabled;
  window._initPermissions = init;
  window._applyPermGating = applyGating;
})();
