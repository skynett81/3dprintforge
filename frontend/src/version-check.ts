// version-check.ts — auto-reload the /v2 SPA when a newer build is deployed.
//
// The app is a hash-router SPA: navigating between panels never reloads the
// page, so an open tab keeps running whatever bundle it first loaded. This
// polls the (no-cache) index.html for the content-hashed JS filename and, if
// it changed, reloads once — so users always see the latest slicer/UI without
// a manual hard-refresh.

const HASH_RE = /assets\/(index-[A-Za-z0-9_-]+\.js)/;

function runningHash(): string | null {
  const src = [...document.scripts].map((s) => s.src).find((s) => HASH_RE.test(s));
  return src?.match(HASH_RE)?.[1] ?? null;
}

export function initVersionCheck() {
  const initial = runningHash();
  if (!initial) return;

  // We're on the latest we tried to reach → clear the loop guard.
  if (sessionStorage.getItem('v2.updatedTo') === initial) sessionStorage.removeItem('v2.updatedTo');

  let busy = false;
  async function check() {
    if (busy || document.hidden) return;
    busy = true;
    try {
      const res = await fetch('/v2/index.html', { cache: 'no-store' });
      if (!res.ok) return;
      const latest = (await res.text()).match(HASH_RE)?.[1] ?? null;
      if (latest && latest !== initial && sessionStorage.getItem('v2.updatedTo') !== latest) {
        sessionStorage.setItem('v2.updatedTo', latest);   // guard against reload loops
        location.reload();
      }
    } catch { /* offline / transient — ignore */ }
    finally { busy = false; }
  }

  window.addEventListener('focus', check);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) check(); });
  setInterval(check, 3 * 60 * 1000);
  setTimeout(check, 4000);
}
