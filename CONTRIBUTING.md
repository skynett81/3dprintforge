# Contributing to 3DPrintForge

First off — thank you for taking the time to contribute! 🎉 3DPrintForge is a
self-hosted dashboard for 3D printers, and it gets better with every person who
reports a bug, improves the docs, adds a printer integration, or builds a new
feature. This guide explains how to get involved.

By participating, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## Ways to contribute

You don't have to write code to help:

- **Report bugs** — open an issue with clear reproduction steps.
- **Request features** — tell us what would make 3DPrintForge more useful.
- **Improve documentation** — the docs live in `website/` (Docusaurus) and are
  published to GitHub Pages. Fixes and clarifications are always welcome.
- **Add printer support** — new brand/protocol connectors are hugely valuable.
- **Translate** — UI strings live in `public/lang/` (`en.json` is primary,
  `nb.json` is Norwegian Bokmål).
- **Test on your hardware** — reports of what works (or doesn't) on real printers
  help everyone.

---

## Getting started (development setup)

### Prerequisites

- **Node.js 22.0+** (the project uses Node's built-in SQLite — older versions
  will not work)
- **npm** (bundled with Node.js)
- **git**
- Optional: **ffmpeg** (camera livestream), **openssl** (auto-SSL, usually
  pre-installed)

### Clone and run

```bash
git clone https://github.com/skynett81/3dprintforge.git
cd 3dprintforge
npm install

# Run against 3 simulated printers — no hardware needed:
npm run demo

# Or run a normal dev server with auto-reload:
npm run dev
```

The server starts on `http://localhost:3000` (and HTTPS on `:3443`). The classic
dashboard is at `/`, the modern React dashboard at `/v2`.

`npm run demo` (sets `BAMBU_DEMO=true`) is the easiest way to develop — it spins
up simulated printers so you can work on the UI and features without owning a
printer.

---

## Making changes

1. **Fork** the repository and create a feature branch off `main`:
   ```bash
   git checkout -b feat/my-improvement
   ```
2. **Make your change.** Keep pull requests focused — one logical change per PR
   is much easier to review than a large mixed one.
3. **Add or update tests** when you change behaviour (see below).
4. **Run the full check suite locally** before pushing.
5. **Open a pull request** against `main` and fill out the template.

### Running the checks

The CI runs exactly these — run them locally first so your PR goes green:

```bash
# Backend tests (node:test, ~1300+ tests)
npm test

# Run a single backend test file:
node --test --test-force-exit tests/api/health.test.js

# Frontend (/v2 React dashboard) type-check + tests
npm --prefix frontend ci
npm --prefix frontend run typecheck
npm --prefix frontend test

# Language files must be valid JSON
node -e "JSON.parse(require('fs').readFileSync('public/lang/en.json','utf8'))"
node -e "JSON.parse(require('fs').readFileSync('public/lang/nb.json','utf8'))"
```

---

## Project layout (where things live)

```
server/            Backend: raw node:http/https, no web framework
  api-routes.js    ~1000 REST endpoints (grep by method+path to find handlers)
  db/              SQLite (Node built-in DatabaseSync) + sequential migrations
  *-client.js      One protocol client per printer brand
  generators/      Parametric 3D model generators (Model Forge)
public/            Classic vanilla-JS dashboard (no build step)
  js/components/   Self-contained UI modules
  lang/            i18n strings (en.json primary, nb.json)
frontend/          Modern React dashboard served at /v2 (Vite + TypeScript)
website/           Docusaurus documentation site
tests/             node:test suite
electron/          Optional desktop app wrapper
```

Finding a backend handler quickly:

```bash
grep -n "method === 'GET' && path === '/api/inventory/spools'" server/api-routes.js
```

---

## Coding conventions

- **No web framework** on the backend — stick to `node:http`/`node:https` and the
  existing patterns in `api-routes.js`.
- **Keep dependencies minimal.** The backend intentionally ships with very few npm
  deps. Please discuss in an issue before adding a new runtime dependency.
- **Frontend i18n gotcha:** `window.t(key, varsOrFallback)` returns the *raw key*
  when no translation exists. The 2nd arg is interpolation vars (object) OR a
  string fallback used only when the key is missing:
  `t('foo.bar', 'Default text')`. **Never** write `t('foo.bar') || 'Default'` —
  `t` returns the truthy key, so the fallback never fires.
- **Service worker:** if you ship JS the user must see immediately, bump
  `CACHE_NAME` in `public/sw.js`.
- **Database:** add new schema changes as a new migration in `server/db/`. Never
  edit existing migrations — append.

---

## Commit messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <short description>
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`.
Add a scope in parentheses when helpful, e.g. `fix(slicer): …`,
`feat(inventory): …`, `fix(security): …`.

---

## Pull request expectations

- CI (tests + type-check + JSON validation + CodeQL) must pass.
- Include a clear description of *what* and *why*.
- Update docs (`website/`) if you change user-facing behaviour.
- Update translations (`public/lang/en.json`, and `nb.json` if you can) for new
  UI strings.
- Be responsive to review feedback — maintainers are happy to help you get it
  merged.

---

## Reporting security issues

**Please do not open a public issue for security problems.** See
[SECURITY.md](SECURITY.md) for private reporting instructions.

---

## License

3DPrintForge is licensed under **AGPL-3.0-only**. By contributing, you agree that
your contributions will be licensed under the same license. The AGPL means that
if you run a modified version as a network service, you must make your source
changes available to its users — please keep this in mind when building on top of
the project.

Questions? Open a [Discussion](https://github.com/skynett81/3dprintforge/discussions)
or an issue. Happy printing! 🖨️
