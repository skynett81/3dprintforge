# Frontend Migration Plan — vanilla JS → React (incremental)

Status: proposal · Backend: unchanged (Node.js, raw `node:http`)
Basis: the working PoC in this folder, proven to coexist at `/v2` with zero
backend changes.

---

## 1. Goal & non-goals

**Goal.** Move the 3DPrintForge frontend from 168 hand-written vanilla-JS
components to a typed React + Vite component layer, **incrementally**, without
freezing the product or rewriting the backend.

**Non-goals.**
- Not Next.js / SSR. This is a real-time localhost dashboard; SSR adds cost
  and no value. A Vite SPA on the existing JSON API is the right shape (PoC
  confirmed).
- Not a big-bang rewrite. No "stop and rebuild everything" phase ever.
- Not a backend change. `server/` stays as-is; React consumes the same
  `/api` + `/ws`.

## 2. Guiding principles

1. **Strangler pattern.** New/high-churn panels are built in React under
   `/v2`; the current UI keeps running. Ported panels are removed from the
   old app only after the React version is at parity.
2. **One server.** The existing static handler serves `public/v2/` — both
   frontends share origin, auth, CSP, `/api` and `/ws`. No proxy, no second
   process in production.
3. **Always shippable.** Every phase ends with `main` green and the product
   fully usable. Any phase can be the last one.
4. **Type the boundary.** Generate/maintain TS types for API responses so the
   frontend breaks at compile time, not in the browser.

## 3. Current state (facts this plan is sized against)

| | |
|---|---|
| Vanilla components | 168 (`public/js/components/*.js`) |
| Backend | `api-routes.js` ~14.4k lines, ~590 endpoints, raw `node:http` |
| Tests | 972 (node:test) — backend + db, unaffected by frontend work |
| Ships as | systemd user service · Electron (mac/win/linux) · Docker (host net) |
| Runtime deps | 12; **no build step today** |
| Real-time | WebSocket hub (`/ws`), MQTT, ffmpeg camera streams |
| PoC status | 7 panels (Dashboard, Production, Fleet, Inventory, Queue, Analytics, History) + live WS, served at `/v2`, 53 kB gzip |

## 4. Target architecture

```
Browser ── / ──────► existing vanilla UI (public/)         ┐
Browser ── /v2 ─────► React SPA (public/v2, built by Vite) ┘  same Node server
                        │
                        ├─ /api/*  (unchanged REST)
                        └─ /ws     (unchanged WebSocket hub)
```

- Source lives in `frontend/` (promoted from `poc/react-parts/`).
- `npm run build:web` emits to `public/v2/` (base `/v2/`).
- Cutover (end state): the vanilla `/` is retired and `/v2` becomes `/`.

## 5. Phased plan

### Phase 0 — Foundation (DONE)
- Vite + React + TS scaffold, typed API client, `useResource`/live hooks,
  design tokens, coexistence at `/v2`. **Built.**
- Promoted `poc/react-parts/` → `frontend/`; `npm run build:web` (root) builds
  it into `public/v2`; Vitest + React Testing Library set up (`npm run web:test`,
  10 tests green). **Done.**

### Phase 1 — CI & desktop integration (DONE)
- `release-build.yml` runs `npm run build:web` before packaging in all three
  desktop jobs; electron-builder already bundles `public/**` so `/v2` ships.
- `test.yml` gained a frontend gate (type-check + Vitest).
- `electron:build*` scripts chain `build:web` for local packaging.
- Entry points both ways: a "New UI (beta)" link in the classic sidebar →
  `/v2`, and a "← Classic UI" link in the React sidebar → `/`.
- Remaining gate to confirm post-release: `/v2` reachable inside a packaged
  Electron build and in Docker (both bundle `public/`, so expected to work).

### Phase 2 — High-value panels to parity (DONE)

An **i18n foundation** (`src/i18n.tsx`) loads the existing `public/lang/*.json`
and exposes `t(key, fallback)` (same convention as the vanilla app, no key
fork). All five high-value panels are at parity, each under a `v2.<panel>.*`
namespace, with a per-component test:
- **Production** — create/add/edit/credit/delete parts, confirm-on-delete.
- **Fleet** — printer detail drawer with pause/resume/stop/light control.
- **Queue** — item list with inline edit (copies/priority), delete, and
  queue pause/resume; bed-hold confirmation.
- **Inventory** — spool drawer with editable remaining/cost/location + archive.
- **Analytics + History** — full i18n; History adds status + printer filters
  (pure `filterHistory`, unit-tested).

23 frontend tests green.

Port the panels that change most and benefit most from components. The PoC
already covers the read side of most; bring them to full parity (writes,
edge cases, i18n):
1. Production / Orders (parts + invoices) — active development area
2. Queue (dispatch, holds, item editing)
3. Fleet + printer detail (live control: pause/resume/stop/light)
4. Inventory (spool CRUD, filters, bulk actions)
5. Analytics + History

Each panel: build in React → reach parity → flip the old sidebar entry to
deep-link `/v2/<panel>` → delete the vanilla component.

### Phase 3 — Shared shell & the long tail (IN PROGRESS)
- Shared shell DONE: a **toast** system (`src/toast.tsx`, `ToastProvider` +
  `useToast`) now gives cross-panel success/error feedback on every write
  (Production, Queue, Fleet control, Inventory); an **auth-aware** shell
  (`useAuth` reads `/api/auth/status`) shows the signed-in user / local mode
  in the sidebar.
- Notification center DONE: a bell in the shell (unread badge tracked via
  localStorage) opens a drawer listing recent notifications from
  `/api/notifications/log`.
- Remaining: porting the remaining interactive panels (Settings,
  Calibration, etc.).

### Phase 4 — Low-churn / heavy panels (large, optional / last)
- The 51 Model Forge generators and deep calibration wizards are stable and
  expensive to port. Either port last, wrap the existing vanilla code in an
  iframe/mount under `/v2`, or leave on `/` indefinitely. **Explicitly
  optional** — parity here buys little.

### Phase 5 — Cutover (small, only when ready)
- When `/v2` covers the daily-driver surface, make it the default (`/`), keep
  the old UI at `/legacy` for one release, then remove.

## 6. Build & CI

- Root scripts: `build:web` (Vite → `public/v2`), run in the release
  workflow before packaging.
- `public/v2/` stays gitignored (build output); CI produces it.
- Type-check (`tsc --noEmit`) and Vitest run in CI as a required check.
- Bundle-size budget (e.g. warn > 250 kB gzip) so the SPA stays lean.

## 7. Electron / desktop

- The desktop build already serves static files; `public/v2` is just more
  static files — no new runtime. Confirm the packaged app can reach `/v2`
  (Phase 1 gate). No SSR server to bundle (a Next.js migration would have
  forced exactly that — avoided).

## 8. Cross-cutting concerns

| Concern | Approach |
|---|---|
| **Auth** | Same session cookie / API key; same-origin, so `/v2` inherits it. Add a typed `useAuth` hook reading `/api/auth/status`. |
| **i18n** | Reuse `public/lang/*.json`. Load via a small React i18n context mirroring `t(key, fallback)`. Do NOT fork the key set. |
| **Service worker** | The current SW is scoped to `/` and is network-first. Verify it doesn't cache `/v2` staleness; give `/v2` its own SW or none during migration. |
| **WebSocket** | Reuse `/ws` (init snapshot + deltas). The PoC's `useLivePrinters` is the template. |
| **Design system** | Port the existing CSS tokens (accent `#009789`, spacing) into `frontend/` so `/v2` matches the brand — started in the PoC. |
| **State** | Local component state + hooks first; add a small store (Zustand) only if cross-panel shared state demands it. No Redux. |

## 9. Testing

- Backend/db: the existing 972 node:test suite is unaffected — keep it green.
- Frontend: Vitest + React Testing Library for components/hooks; type-check
  as a gate. Optional Playwright smoke over `/v2` for critical flows.
- Parity rule: a panel is "done" only when its React version passes the same
  manual/automated checks the vanilla one did.

## 10. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Migration stalls half-done | Strangler means half-done is still shippable; each panel is independently valuable. |
| Two paradigms confuse contributors | Clear rule: new UI in `frontend/`, old only bug-fixed; `/v2` is the direction. |
| Lose the "zero-build, runs anywhere" trait | Keep the build simple (one `vite build`), single artifact folder, no server runtime added. |
| SW cache serves stale `/v2` | Scope/So version the SW; test cache behavior early (Phase 1). |
| Dependency upkeep (React/Vite churn) | Pin versions, Dependabot (already on the repo), small dep surface. |
| i18n drift between the two UIs | Single source of truth in `public/lang/*`. |

## 11. Effort & sequencing (honest sizing)

Relative, not calendar-committed:

- Phase 0 remaining: **S** (promote + CI scaffold)
- Phase 1: **S–M** (CI + Electron + entry point)
- Phase 2: **M**, iterative — the bulk of user-visible value; ~1 panel at a
  time, each independently shippable
- Phase 3: **M**
- Phase 4: **L**, optional/deferrable
- Phase 5: **S**, only when ready

The product is fully usable and improving from the end of Phase 1 onward.
There is no point where it must be "down for the rewrite."

## 12. Decision gates / off-ramps

- After **Phase 1**: is `/v2` pleasant to build in and does it hold up in
  Electron/Docker? If no → stop, cost is tiny.
- After **Phase 2**: are the daily-driver panels better in React? If yes →
  continue to cutover; if "good enough as a hybrid" → stop and keep both.
- **Phase 4 is opt-in.** Not porting the Model Forge generators is a valid
  permanent end state.

---

**Bottom line.** The risky, expensive part (does a modern frontend even fit
this app?) is already answered by the PoC: yes, at `/v2`, with no backend
change. The rest is incremental, reversible, and always shippable.
