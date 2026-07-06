# React PoC — Production / Parts panel

A proof-of-concept: the **Projects → Production/Parts** panel rebuilt in
**Vite + React 18 + TypeScript**, talking to the *live* 3DPrintForge JSON API.

This exists so we can feel the difference between the current vanilla
approach and a modern component stack **before** committing to anything.
It is fully isolated: it has its own dependencies and dev server and does
**not** touch or affect the main app. Delete the `poc/` folder and nothing
changes.

## Run it

1. Start the main 3DPrintForge server as usual (HTTPS on 3443, or HTTP on 3000).
2. In this folder:

   ```bash
   npm install
   npm run dev            # → http://localhost:5174
   ```

   The Vite dev server proxies `/api/*` to `https://localhost:3443`
   (self-signed cert accepted). Point it elsewhere with:

   ```bash
   VITE_API_TARGET=http://localhost:3000 npm run dev
   ```

3. Open http://localhost:5174, pick a project, add parts, hit **+plate**.
   It writes to the same database as the main dashboard — so a part you
   credit here shows up in the real Orders panel, and a queue job that
   auto-credits a part shows up here (polled every 4 s).

## What it demonstrates

- **Typed API client** (`src/api.ts` + `src/types.ts`) — compile-time safety
  against the real endpoints.
- **Component composition** — `App` → `ProjectPicker` / `PartRow` /
  `AddPartForm`, each a small file with its own props.
- **Hooks for data + polling** (`src/hooks.ts`) — declarative state instead
  of manual DOM writes and `innerHTML` string building.
- **A build step** — `npm run build` type-checks and bundles.

## Honest comparison

The same feature already exists in the main app inside
`public/js/components/order-panel.js` (`_renderPartsSection` +
`_orderAddPart` / `_orderCreditPart` / `_orderDeletePart`) as vanilla JS
template strings, with **no** build step and **no** types.

Trade-off in one line: React/TS buys component reuse, type safety and a
real UI ecosystem; it costs a build pipeline and a heavier toolchain. This
PoC is small enough to weigh both honestly.
