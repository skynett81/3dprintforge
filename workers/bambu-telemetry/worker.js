// 3DPrintForge Telemetry Worker
// Cloudflare Worker + D1 — anonymous installation tracking

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    try {
      if (url.pathname === '/favicon.ico') {
        return new Response(null, { status: 204 });
      }
      if (url.pathname === '/ping' && request.method === 'POST') {
        return await handlePing(request, env);
      }
      if (url.pathname === '/stats' && request.method === 'GET') {
        const accept = request.headers.get('Accept') || '';
        if (accept.includes('text/html')) {
          return await handleStatsPage(env);
        }
        return await handleStats(env);
      }
      if (url.pathname === '/' && request.method === 'GET') {
        return await handleStatsPage(env);
      }
      return json({ error: 'Not found' }, 404);
    } catch (e) {
      return json({ error: 'Internal error' }, 500);
    }
  }
};

async function handlePing(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const { id, version, platform, nodeVersion } = body;
  if (!id || !version) {
    return json({ error: 'Missing id or version' }, 400);
  }

  // Sanitize existing fields
  const safeId = String(id).substring(0, 64);
  const safeVersion = String(version).substring(0, 20);
  const safePlatform = String(platform || 'unknown').substring(0, 30);
  const safeNode = String(nodeVersion || '').substring(0, 20);
  const safeArch = String(body.arch || '').substring(0, 20);
  const safeRam = parseInt(body.ramGb) || null;
  const safePrinterCount = parseInt(body.printerCount) || 0;
  const safePrinterModels = body.printerModels ? JSON.stringify(body.printerModels).substring(0, 500) : null;
  const safeTotalSpools = parseInt(body.totalSpools) || 0;
  const safeTotalProfiles = parseInt(body.totalProfiles) || 0;
  const safeFeatures = Array.isArray(body.features) ? body.features.join(',').substring(0, 500) : null;
  const safeDemo = body.demo ? 1 : 0;
  const safeLanguage = body.language ? String(body.language).substring(0, 10) : null;

  // Sanitize new print stats fields
  const safeTotalPrints = parseInt(body.totalPrints) || 0;
  const safeCompletedPrints = parseInt(body.completedPrints) || 0;
  // cancelledPrints maps to failed_prints; take whichever is provided, preferring failedPrints
  const safeFailedPrints = parseInt(body.failedPrints ?? body.cancelledPrints) || 0;
  const safeSuccessRate = Math.min(100, Math.max(0, parseInt(body.successRate) || 0));
  const safeTotalPrintHours = parseInt(body.totalPrintHours) || 0;
  const safeTotalFilamentKg = parseFloat(body.totalFilamentKg) || 0;

  // Sanitize new hardware/install fields
  const safeCpuModel = body.cpuModel ? String(body.cpuModel).substring(0, 100) : null;
  const safeCpuCores = parseInt(body.cpuCores) || null;
  const safeInstallAgeDays = parseInt(body.installAgeDays) || null;
  const safeMaterialTypes = Array.isArray(body.materialTypes)
    ? body.materialTypes.map(String).join(',').substring(0, 300)
    : null;

  // Fields accepted but not stored: queueItems, ecomActive, processUptimeH, uptimeH

  const today = new Date().toISOString().split('T')[0];

  // Upsert installation
  const existing = await env.DB.prepare(
    'SELECT id, first_seen FROM installations WHERE id = ?'
  ).bind(safeId).first();

  if (existing) {
    await env.DB.prepare(
      `UPDATE installations SET
        version = ?, platform = ?, node_version = ?, arch = ?, ram_gb = ?,
        printer_count = ?, printer_models = ?, total_spools = ?, total_profiles = ?,
        features = ?, demo = ?, language = ?,
        total_prints = ?, completed_prints = ?, failed_prints = ?, success_rate = ?,
        total_print_hours = ?, total_filament_kg = ?,
        cpu_model = ?, cpu_cores = ?, install_age_days = ?, material_types = ?,
        last_seen = datetime('now'), ping_count = ping_count + 1
       WHERE id = ?`
    ).bind(
      safeVersion, safePlatform, safeNode, safeArch, safeRam,
      safePrinterCount, safePrinterModels, safeTotalSpools, safeTotalProfiles,
      safeFeatures, safeDemo, safeLanguage,
      safeTotalPrints, safeCompletedPrints, safeFailedPrints, safeSuccessRate,
      safeTotalPrintHours, safeTotalFilamentKg,
      safeCpuModel, safeCpuCores, safeInstallAgeDays, safeMaterialTypes,
      safeId
    ).run();
  } else {
    await env.DB.prepare(
      `INSERT INTO installations (
        id, version, platform, node_version, arch, ram_gb,
        printer_count, printer_models, total_spools, total_profiles,
        features, demo, language,
        total_prints, completed_prints, failed_prints, success_rate,
        total_print_hours, total_filament_kg,
        cpu_model, cpu_cores, install_age_days, material_types
       ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?,
        ?, ?, ?, ?
       )`
    ).bind(
      safeId, safeVersion, safePlatform, safeNode, safeArch, safeRam,
      safePrinterCount, safePrinterModels, safeTotalSpools, safeTotalProfiles,
      safeFeatures, safeDemo, safeLanguage,
      safeTotalPrints, safeCompletedPrints, safeFailedPrints, safeSuccessRate,
      safeTotalPrintHours, safeTotalFilamentKg,
      safeCpuModel, safeCpuCores, safeInstallAgeDays, safeMaterialTypes
    ).run();

    // Increment new installs for today
    await env.DB.prepare(
      `INSERT INTO daily_stats (date, active_installs, new_installs) VALUES (?, 0, 1)
       ON CONFLICT(date) DO UPDATE SET new_installs = new_installs + 1`
    ).bind(today).run();
  }

  // Increment active installs for today
  await env.DB.prepare(
    `INSERT INTO daily_stats (date, active_installs, new_installs) VALUES (?, 1, 0)
     ON CONFLICT(date) DO UPDATE SET active_installs = active_installs + 1`
  ).bind(today).run();

  // Auto-cleanup: remove installations inactive for 30+ days (runs ~1% of pings)
  if (Math.random() < 0.01) {
    await env.DB.prepare(
      `DELETE FROM installations WHERE last_seen < datetime('now', '-30 days')`
    ).run();
  }

  return json({ ok: true });
}

async function handleStats(env) {
  return json(await getStatsData(env));
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
  });
}

async function handleStatsPage(env) {
  const s = await getStatsData(env);

  // Build daily chart bars (last 14 days)
  const dailyBars = (s.daily || []).slice(0, 14).reverse();
  const maxActive = Math.max(...dailyBars.map(d => d.active_installs || 0), 1);

  const chartHtml = dailyBars.map(d => {
    const pct = Math.round((d.active_installs || 0) / maxActive * 100);
    const label = d.date ? d.date.substring(5) : '';
    return `<div class="chart-col">
      <div class="chart-val">${d.active_installs || 0}</div>
      <div class="chart-bar-wrap"><div class="chart-bar" style="height:${pct}%"></div></div>
      <div class="chart-label">${esc(label)}</div>
    </div>`;
  }).join('');

  // New installs chart
  const maxNew = Math.max(...dailyBars.map(d => d.new_installs || 0), 1);
  const newChartHtml = dailyBars.map(d => {
    const pct = Math.round((d.new_installs || 0) / maxNew * 100);
    const label = d.date ? d.date.substring(5) : '';
    return `<div class="chart-col">
      <div class="chart-val">${d.new_installs || 0}</div>
      <div class="chart-bar-wrap"><div class="chart-bar purple-bar" style="height:${pct}%"></div></div>
      <div class="chart-label">${esc(label)}</div>
    </div>`;
  }).join('');

  // Recent activity table — show prints and success rate
  const recentHtml = s.recent.map(r => {
    const ago = timeAgo(r.last_seen);
    const plat = r.platform === 'win32' ? 'Windows' : r.platform === 'darwin' ? 'macOS' : r.platform;
    const totalPrints = r.total_prints || 0;
    const successRate = r.success_rate || 0;
    return `<tr>
      <td class="version-badge">v${esc(r.version)}</td>
      <td>${esc(plat)}${r.arch ? ` (${esc(r.arch)})` : ''}</td>
      <td>${r.ram_gb ? r.ram_gb + ' GB' : '—'}</td>
      <td>${totalPrints} prints (${successRate}% success)</td>
      <td style="color:rgba(255,255,255,0.5)">${r.ping_count} pings</td>
      <td style="color:var(--color-accent)">${ago}</td>
    </tr>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>3DPrintForge — Telemetry</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
:root {
  --color-primary: #1279ff;
  --color-accent: #00d4ff;
  --color-purple: #9b4dff;
  --color-pink: #ff4db8;
  --color-green: #00e676;
  --color-orange: #ff9f43;
  --color-dark: #0a0e27;
  --color-secondary: #1a1f3a;
  --font-heading: 'Orbitron', 'Rajdhani', ui-sans-serif, system-ui, sans-serif;
  --font-body: 'Rajdhani', 'Inter', 'Helvetica Neue', Helvetica, Arial, ui-sans-serif, system-ui, sans-serif;
}
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
body {
  font-family: var(--font-body);
  background: var(--color-dark);
  color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  -webkit-font-smoothing: antialiased;
}

/* Header */
.header {
  background: linear-gradient(to bottom, var(--color-dark), var(--color-secondary));
  border-bottom: 2px solid rgba(18, 121, 255, 0.3);
  box-shadow: 0 0 20px rgba(18, 121, 255, 0.3), 0 4px 15px rgba(0, 0, 0, 0.5);
  padding: 0 1rem;
}
.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}
.header-logo {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #fff;
  text-decoration: none;
  text-shadow: 0 0 10px rgba(18,121,255,0.8), 0 0 20px rgba(0,212,255,0.4);
}
.header-nav { display: flex; gap: 20px; }
.header-nav a {
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: color 0.3s;
}
.header-nav a:hover, .header-nav a.active { color: var(--color-accent); }

/* Hero */
.hero {
  background: linear-gradient(135deg, rgba(26,31,58,0.5), rgba(10,14,39,0.8));
  min-height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: 60px 1rem 40px;
}
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 0%, rgba(18,121,255,0.15) 0%, transparent 70%);
  pointer-events: none;
}
.hero-inner {
  text-align: center;
  position: relative;
  z-index: 1;
}
.hero h1 {
  font-family: var(--font-heading);
  font-size: 2.8rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #fff;
  text-shadow: 0 0 10px rgba(18,121,255,0.8), 0 0 20px rgba(18,121,255,0.6), 0 0 30px rgba(0,212,255,0.4);
  margin-bottom: 0.5rem;
}
.hero p {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  background: linear-gradient(90deg, var(--color-accent), var(--color-purple), var(--color-pink), var(--color-accent));
  background-size: 200% 200%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient 3s infinite;
}
@keyframes gradient { 0% { background-position: 0%; } 50% { background-position: 100%; } 100% { background-position: 0%; } }

/* Content */
.content-section { background: var(--color-dark); padding: 48px 1rem; }
.content-section-alt { background: linear-gradient(135deg, rgba(26,31,58,0.3), rgba(10,14,39,0.5)); padding: 48px 1rem; }
.container { max-width: 1200px; margin: 0 auto; }

/* Section titles */
.section-title {
  font-family: var(--font-heading);
  font-size: 1.3rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #fff;
  text-shadow: 0 0 10px rgba(18,121,255,0.6), 0 0 20px rgba(0,212,255,0.3);
  margin-bottom: 1.25rem;
  text-align: center;
}

/* Stats grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 14px;
  margin-bottom: 0;
}

/* Gaming card */
.g-card {
  clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px);
  background: linear-gradient(135deg, rgba(26,31,58,0.6), rgba(10,14,39,0.8));
  border: 2px solid rgba(18,121,255,0.3);
  position: relative;
  overflow: hidden;
  transition: all 0.4s;
}
.g-card:hover {
  border-color: rgba(0,212,255,0.5);
  box-shadow: 0 0 20px rgba(18,121,255,0.3), inset 0 0 20px rgba(0,212,255,0.05);
}
.g-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
  opacity: 0;
  transition: opacity 0.4s;
}
.g-card:hover::before { opacity: 1; }
.g-card-inner {
  padding: 20px 16px;
  position: relative;
  z-index: 1;
  text-align: center;
}
.g-card-value {
  font-family: var(--font-heading);
  font-size: 2.2rem;
  font-weight: 900;
  letter-spacing: 0.05em;
  color: var(--color-accent);
  text-shadow: 0 0 15px rgba(0,212,255,0.4);
}
.g-card-value.green { color: var(--color-green); text-shadow: 0 0 15px rgba(0,230,118,0.4); }
.g-card-value.purple { color: var(--color-purple); text-shadow: 0 0 15px rgba(155,77,255,0.4); }
.g-card-value.pink { color: var(--color-pink); text-shadow: 0 0 15px rgba(255,77,184,0.4); }
.g-card-value.orange { color: var(--color-orange); text-shadow: 0 0 15px rgba(255,159,67,0.4); }
.g-card-value.blue { color: var(--color-primary); text-shadow: 0 0 15px rgba(18,121,255,0.4); }
.g-card-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255,255,255,0.45);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 4px;
}

/* Data sections */
.data-section {
  clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px);
  background: linear-gradient(135deg, rgba(26,31,58,0.6), rgba(10,14,39,0.8));
  border: 2px solid rgba(18,121,255,0.3);
  overflow: hidden;
  margin-bottom: 20px;
}
.data-section-title {
  font-family: var(--font-heading);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-accent);
  padding: 14px 20px 8px;
}
table { width: 100%; border-collapse: collapse; }
th, td { padding: 8px 20px; text-align: left; }
th {
  color: rgba(255,255,255,0.35);
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-bottom: 1px solid rgba(18,121,255,0.15);
}
td {
  color: rgba(255,255,255,0.85);
  font-size: 0.85rem;
  font-weight: 500;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
tr:hover td { background: rgba(18,121,255,0.05); }
.bar-cell { width: 35%; }
.bar {
  height: 6px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  border-radius: 3px;
  min-width: 3px;
  box-shadow: 0 0 8px rgba(0,212,255,0.3);
}
.bar.purple-bar { background: linear-gradient(90deg, var(--color-purple), var(--color-pink)); box-shadow: 0 0 8px rgba(155,77,255,0.3); }
.bar.green-bar { background: linear-gradient(90deg, var(--color-green), #33ff99); box-shadow: 0 0 8px rgba(0,230,118,0.3); }
.version-badge {
  font-family: var(--font-heading);
  font-weight: 700;
  letter-spacing: 0.05em;
}

/* Charts */
.chart-wrap {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 140px;
  padding: 16px 20px 8px;
}
.chart-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}
.chart-bar-wrap {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.chart-bar {
  width: 100%;
  max-width: 28px;
  background: linear-gradient(to top, var(--color-primary), var(--color-accent));
  border-radius: 3px 3px 0 0;
  min-height: 2px;
  box-shadow: 0 0 8px rgba(0,212,255,0.2);
  transition: height 0.3s;
}
.chart-bar.purple-bar {
  background: linear-gradient(to top, var(--color-purple), var(--color-pink));
  box-shadow: 0 0 8px rgba(155,77,255,0.2);
}
.chart-label {
  font-size: 0.6rem;
  color: rgba(255,255,255,0.35);
  margin-top: 4px;
  white-space: nowrap;
}
.chart-val {
  font-size: 0.6rem;
  font-weight: 700;
  color: rgba(255,255,255,0.5);
  margin-bottom: 2px;
}

/* Footer */
.footer {
  background: linear-gradient(to bottom, var(--color-dark), #050508);
  border-top: 2px solid rgba(18,121,255,0.3);
  box-shadow: 0 -4px 30px rgba(18,121,255,0.15);
  padding: 24px 1rem;
  text-align: center;
  margin-top: auto;
}
.footer-inner { max-width: 1200px; margin: 0 auto; }
.footer-text { color: rgba(255,255,255,0.35); font-size: 0.8rem; }
.footer-text a { color: var(--color-accent); text-decoration: none; transition: color 0.3s; }
.footer-text a:hover { color: var(--color-pink); }
.footer-links { display: flex; justify-content: center; gap: 24px; margin-bottom: 12px; }
.footer-links a {
  color: rgba(255,255,255,0.5);
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: color 0.3s;
}
.footer-links a:hover { color: var(--color-accent); }

/* Layout helpers */
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.three-col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }

@media (max-width: 768px) {
  .hero h1 { font-size: 1.8rem; }
  .hero p { font-size: 0.85rem; }
  .two-col, .three-col { grid-template-columns: 1fr; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .g-card-value { font-size: 1.6rem; }
  .section-title { font-size: 1.1rem; }
}
@media (max-width: 480px) {
  .stats-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
  .g-card-inner { padding: 14px 12px; }
  .g-card-value { font-size: 1.4rem; }
}
</style>
</head>
<body>

<!-- Header -->
<header class="header">
  <div class="header-inner">
    <a href="/" class="header-logo">3DPrintForge</a>
    <nav class="header-nav">
      <a href="https://github.com/skynett81/3dprintforge">GitHub</a>
      <a href="/stats" class="active">Telemetry</a>
      <a href="https://geektech.no">GeekTech</a>
    </nav>
  </div>
</header>

<!-- Hero -->
<section class="hero">
  <div class="hero-inner">
    <h1>Telemetry</h1>
    <p>Anonymous installation statistics</p>
  </div>
</section>

<!-- Stats cards -->
<section class="content-section">
  <div class="container">
    <div class="stats-grid">
      <div class="g-card"><div class="g-card-inner">
        <div class="g-card-value">${s.total}</div>
        <div class="g-card-label">Total Installs</div>
      </div></div>
      <div class="g-card"><div class="g-card-inner">
        <div class="g-card-value green">${s.active_24h}</div>
        <div class="g-card-label">Active (24h)</div>
      </div></div>
      <div class="g-card"><div class="g-card-inner">
        <div class="g-card-value blue">${s.active_7d}</div>
        <div class="g-card-label">Active (7 days)</div>
      </div></div>
      <div class="g-card"><div class="g-card-inner">
        <div class="g-card-value purple">${s.active_30d}</div>
        <div class="g-card-label">Active (30 days)</div>
      </div></div>
      <div class="g-card"><div class="g-card-inner">
        <div class="g-card-value pink">${s.total_printers}</div>
        <div class="g-card-label">Total Printers</div>
      </div></div>
      <div class="g-card"><div class="g-card-inner">
        <div class="g-card-value orange">${s.total_spools}</div>
        <div class="g-card-label">Total Spools</div>
      </div></div>
      <div class="g-card"><div class="g-card-inner">
        <div class="g-card-value green">${s.global_prints}</div>
        <div class="g-card-label">Total Prints</div>
      </div></div>
      <div class="g-card"><div class="g-card-inner">
        <div class="g-card-value orange">${s.global_print_hours}</div>
        <div class="g-card-label">Print Hours</div>
      </div></div>
      <div class="g-card"><div class="g-card-inner">
        <div class="g-card-value purple">${s.global_filament_kg} kg</div>
        <div class="g-card-label">Filament Used</div>
      </div></div>
      <div class="g-card"><div class="g-card-inner">
        <div class="g-card-value pink">${s.avg_success_rate}%</div>
        <div class="g-card-label">Avg Success Rate</div>
      </div></div>
    </div>
  </div>
</section>

<!-- Charts -->
<section class="content-section-alt">
  <div class="container">
    <h2 class="section-title">Activity Trends</h2>
    <div class="two-col">
      <div class="data-section">
        <div class="data-section-title">Daily Active Installs (14 days)</div>
        <div class="chart-wrap">${chartHtml}</div>
      </div>
      <div class="data-section">
        <div class="data-section-title">New Installs per Day</div>
        <div class="chart-wrap">${newChartHtml}</div>
      </div>
    </div>
  </div>
</section>

<!-- Breakdowns -->
<section class="content-section">
  <div class="container">
    <h2 class="section-title">Breakdown</h2>
    <div class="three-col">
      ${s.versions.length ? `<div class="data-section">
        <div class="data-section-title">Versions</div>
        <table><thead><tr><th>Version</th><th>Count</th><th class="bar-cell"></th></tr></thead><tbody>${s.versions.map(v => {
          const maxV = s.versions[0]?.count || 1;
          return `<tr><td class="version-badge">v${esc(v.version)}</td><td>${v.count}</td><td class="bar-cell"><div class="bar" style="width:${Math.max(Math.round(v.count/maxV*100), 5)}%"></div></td></tr>`;
        }).join('')}</tbody></table>
      </div>` : ''}
      ${s.platforms.length ? `<div class="data-section">
        <div class="data-section-title">Platforms</div>
        <table><thead><tr><th>Platform</th><th>Count</th><th class="bar-cell"></th></tr></thead><tbody>${s.platforms.map(p => {
          const maxP = s.platforms[0]?.count || 1;
          const name = p.platform === 'win32' ? 'Windows' : p.platform === 'darwin' ? 'macOS' : p.platform;
          return `<tr><td>${esc(name)}</td><td>${p.count}</td><td class="bar-cell"><div class="bar green-bar" style="width:${Math.max(Math.round(p.count/maxP*100), 5)}%"></div></td></tr>`;
        }).join('')}</tbody></table>
      </div>` : ''}
      ${s.printerModels.length ? `<div class="data-section">
        <div class="data-section-title">Printer Models</div>
        <table><thead><tr><th>Model</th><th>Count</th><th class="bar-cell"></th></tr></thead><tbody>${s.printerModels.map(m => {
          const maxM = s.printerModels[0]?.count || 1;
          return `<tr><td>${esc(m.model)}</td><td>${m.count}</td><td class="bar-cell"><div class="bar purple-bar" style="width:${Math.max(Math.round(m.count/maxM*100), 5)}%"></div></td></tr>`;
        }).join('')}</tbody></table>
      </div>` : ''}
    </div>
    <div class="three-col" style="margin-top:20px">
      ${s.features.length ? `<div class="data-section">
        <div class="data-section-title">Features Enabled</div>
        <table><thead><tr><th>Feature</th><th>Count</th><th class="bar-cell"></th></tr></thead><tbody>${s.features.map(f => {
          const maxF = s.features[0]?.count || 1;
          const label = f.feature.replace('notif_', '').replace('_', ' ');
          return `<tr><td>${esc(label)}</td><td>${f.count}</td><td class="bar-cell"><div class="bar" style="width:${Math.max(Math.round(f.count/maxF*100), 5)}%"></div></td></tr>`;
        }).join('')}</tbody></table>
      </div>` : ''}
      ${s.languages.length ? `<div class="data-section">
        <div class="data-section-title">Languages</div>
        <table><thead><tr><th>Language</th><th>Count</th><th class="bar-cell"></th></tr></thead><tbody>${s.languages.map(l => {
          const maxL = s.languages[0]?.count || 1;
          return `<tr><td>${esc(l.language)}</td><td>${l.count}</td><td class="bar-cell"><div class="bar green-bar" style="width:${Math.max(Math.round(l.count/maxL*100), 5)}%"></div></td></tr>`;
        }).join('')}</tbody></table>
      </div>` : ''}
      ${s.nodeVersions.length ? `<div class="data-section">
        <div class="data-section-title">Node.js Versions</div>
        <table><thead><tr><th>Version</th><th>Count</th><th class="bar-cell"></th></tr></thead><tbody>${s.nodeVersions.map(n => {
          const maxN = s.nodeVersions[0]?.count || 1;
          return `<tr><td>${esc(n.node_version || 'Unknown')}</td><td>${n.count}</td><td class="bar-cell"><div class="bar purple-bar" style="width:${Math.max(Math.round(n.count/maxN*100), 5)}%"></div></td></tr>`;
        }).join('')}</tbody></table>
      </div>` : ''}
    </div>
  </div>
</section>

<!-- Recent Activity -->
<section class="content-section-alt">
  <div class="container">
    <h2 class="section-title">Recent Activity</h2>
    <div class="data-section">
      <div class="data-section-title">Last 10 Active Installations</div>
      <table><thead><tr><th>Version</th><th>Platform</th><th>RAM</th><th>Prints</th><th>Pings</th><th>Last Seen</th></tr></thead>
      <tbody>${recentHtml}</tbody></table>
    </div>
  </div>
</section>

<!-- Footer -->
<footer class="footer">
  <div class="footer-inner">
    <div class="footer-links">
      <a href="https://github.com/skynett81/3dprintforge">GitHub</a>
      <a href="/stats">JSON API</a>
      <a href="https://geektech.no">GeekTech</a>
    </div>
    <p class="footer-text">3DPrintForge by <a href="https://github.com/skynett81">SkyNett81</a> &middot; Powered by <a href="https://workers.cloudflare.com">Cloudflare Workers</a></p>
  </div>
</footer>

</body></html>`;
  return new Response(html, { headers: { 'Content-Type': 'text/html;charset=utf-8' } });
}

function esc(s) {
  if (s == null) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function timeAgo(dateStr) {
  if (!dateStr) return '—';
  const now = new Date();
  const then = new Date(dateStr + 'Z');
  const diffMs = now - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

async function getStatsData(env) {
  const [
    total, active24h, active7d, active30d, new7d, totalPings,
    versions, platforms, nodeVersions, archs, languages, daily, recent,
    totalPrinters, totalSpools, totalProfiles, demoCount, featureRows,
    globalPrints, globalCompleted, globalPrintHours, globalFilamentKg, avgSuccessRate,
  ] = await Promise.all([
    env.DB.prepare('SELECT COUNT(*) as count FROM installations').first(),
    env.DB.prepare(`SELECT COUNT(*) as count FROM installations WHERE last_seen >= datetime('now', '-1 day')`).first(),
    env.DB.prepare(`SELECT COUNT(*) as count FROM installations WHERE last_seen >= datetime('now', '-7 days')`).first(),
    env.DB.prepare(`SELECT COUNT(*) as count FROM installations WHERE last_seen >= datetime('now', '-30 days')`).first(),
    env.DB.prepare(`SELECT COUNT(*) as count FROM installations WHERE first_seen >= datetime('now', '-7 days')`).first(),
    env.DB.prepare('SELECT SUM(ping_count) as total FROM installations').first(),
    env.DB.prepare('SELECT version, COUNT(*) as count FROM installations GROUP BY version ORDER BY count DESC LIMIT 20').all(),
    env.DB.prepare('SELECT platform, COUNT(*) as count FROM installations GROUP BY platform ORDER BY count DESC LIMIT 10').all(),
    env.DB.prepare(`SELECT node_version, COUNT(*) as count FROM installations WHERE node_version IS NOT NULL AND node_version != '' GROUP BY node_version ORDER BY count DESC LIMIT 10`).all(),
    env.DB.prepare(`SELECT arch, COUNT(*) as count FROM installations WHERE arch IS NOT NULL AND arch != '' GROUP BY arch ORDER BY count DESC LIMIT 10`).all(),
    env.DB.prepare(`SELECT language, COUNT(*) as count FROM installations WHERE language IS NOT NULL AND language != '' GROUP BY language ORDER BY count DESC LIMIT 20`).all(),
    env.DB.prepare(`SELECT * FROM daily_stats WHERE date >= date('now', '-30 days') ORDER BY date DESC`).all(),
    env.DB.prepare('SELECT version, platform, node_version, arch, ram_gb, printer_count, printer_models, total_spools, total_profiles, features, demo, language, last_seen, ping_count, total_prints, success_rate FROM installations ORDER BY last_seen DESC LIMIT 10').all(),
    env.DB.prepare('SELECT SUM(printer_count) as total FROM installations').first(),
    env.DB.prepare('SELECT SUM(total_spools) as total FROM installations').first(),
    env.DB.prepare('SELECT SUM(total_profiles) as total FROM installations').first(),
    env.DB.prepare('SELECT COUNT(*) as count FROM installations WHERE demo = 1').first(),
    env.DB.prepare('SELECT features FROM installations WHERE features IS NOT NULL AND features != \'\'').all(),
    env.DB.prepare('SELECT SUM(total_prints) as total FROM installations').first(),
    env.DB.prepare('SELECT SUM(completed_prints) as total FROM installations').first(),
    env.DB.prepare('SELECT SUM(total_print_hours) as total FROM installations').first(),
    env.DB.prepare('SELECT ROUND(SUM(total_filament_kg), 1) as total FROM installations').first(),
    env.DB.prepare('SELECT ROUND(AVG(success_rate), 1) as avg FROM installations WHERE success_rate > 0').first(),
  ]);

  // Aggregate printer models across all installations
  const printerModelCounts = {};
  for (const row of (recent?.results || [])) {
    if (row.printer_models) {
      try {
        const models = JSON.parse(row.printer_models);
        for (const [model, count] of Object.entries(models)) {
          printerModelCounts[model] = (printerModelCounts[model] || 0) + count;
        }
      } catch { /* ignore */ }
    }
  }
  const printerModels = Object.entries(printerModelCounts)
    .map(([model, count]) => ({ model, count }))
    .sort((a, b) => b.count - a.count);

  // Aggregate features across all installations
  const featureCounts = {};
  for (const row of (featureRows?.results || [])) {
    if (row.features) {
      for (const f of row.features.split(',')) {
        const ft = f.trim();
        if (ft) featureCounts[ft] = (featureCounts[ft] || 0) + 1;
      }
    }
  }
  const features = Object.entries(featureCounts)
    .map(([feature, count]) => ({ feature, count }))
    .sort((a, b) => b.count - a.count);

  return {
    total: total?.count || 0,
    active_24h: active24h?.count || 0,
    active_7d: active7d?.count || 0,
    active_30d: active30d?.count || 0,
    new_7d: new7d?.count || 0,
    total_pings: totalPings?.total || 0,
    total_printers: totalPrinters?.total || 0,
    total_spools: totalSpools?.total || 0,
    total_profiles: totalProfiles?.total || 0,
    demo_count: demoCount?.count || 0,
    global_prints: globalPrints?.total || 0,
    global_completed: globalCompleted?.total || 0,
    global_print_hours: globalPrintHours?.total || 0,
    global_filament_kg: globalFilamentKg?.total || 0,
    avg_success_rate: avgSuccessRate?.avg || 0,
    versions: versions?.results || [],
    platforms: platforms?.results || [],
    nodeVersions: nodeVersions?.results || [],
    archs: archs?.results || [],
    languages: languages?.results || [],
    printerModels,
    features,
    daily: daily?.results || [],
    recent: recent?.results || [],
  };
}
