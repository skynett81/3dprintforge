# Features

Complete feature list for 3DPrintForge v1.1.16.

---

## Real-time Monitoring

- **Live sparkline stats** — Grafana-style rolling graphs for nozzle, bed, chamber temps, fan speed, print speed, and layer progress
- **Temperature gauges** — animated SVG ring gauges for nozzle, bed, and chamber
- **Print progress** — percentage ring, countdown timer, ETA, elapsed time, layer info
- **3D print preview** — live WebGL 3D model viewer with layer-by-layer animation and filament color tracking
- **3D fullscreen** — click to open full-size 3D view with real-time layer progress
- **MakerWorld integration** — auto-detects MakerWorld prints and shows model image with visual print progress reveal
- **AMS visualization** — filament colors, remaining %, humidity, temperature (multi-AMS support)
- **Camera livestream** — RTSPS via ffmpeg + jsmpeg, click-to-fullscreen with direct stream URL
- **OBS streaming overlay** — standalone page at `/obs.html` for OBS Browser Source with camera + HUD overlay

## Multi-printer Support

- Manage multiple printers from a single dashboard
- Instant printer switching with per-printer data across all panels
- Supports all Bambu Lab printers: P1S/P1S Combo/P1P, P2S/P2S Combo, X1C/X1C Combo/X1E, A1/A1 Combo/A1 Mini, H2S/H2D/H2C

## Controls

- Pause / resume / stop with confirmation dialogs
- Light toggle, speed profiles (Silent / Standard / Sport / Ludicrous)
- Speed slider (50%–166%) with live percentage display
- Fan control (part, aux, chamber), temperature presets
- Home / calibration commands, G-code console
- Skip failed objects during active print
- AI detection toggles (spaghetti, first layer)
- Extrude/retract controls
- File upload with drag-and-drop (3MF, G-code, STL, OBJ, STEP)

## Print Guard

- **Automatic print protection** using printer xcam sensors
- Spaghetti detection, first layer issues, foreign objects, nozzle clumps
- **5 sensor-based guards:** temperature deviation, filament runout, print error, fan failure, print stall
- Configurable actions per event: notify, pause, stop, or ignore
- Adjustable thresholds (temperature deviation, filament low %, stall time)
- Per-printer settings with cooldown and auto-resume options
- Active alert dashboard with resolve functionality
- Full protection event log with filtering

## Print Queue

- **Multi-target dispatch** — select multiple printers per queue job
- **Pre-print filament check** — verifies spool weight and AMS material match
- **Intelligent load balancing** — dispatches to printer with lowest job count
- **Auto-print** — automatically starts next job when printer becomes available
- Queue status tracking (pending, printing, completed, failed)
- Toggle All printer selection

## Filament Inventory

- **Hero card summary** with total spools, weight, cost
- **AMS tray display** with progress bars
- **Spool management** — drag-and-drop between printers
- **Favorite spools** — heart toggle, favorites sorted to top
- **Color family filter** — 12 HSL-based color chips (Red, Orange, Yellow, Green, Blue, Purple, Pink, Brown, Black, White, Gray, Transparent)
- **View modes** — Grid (cards), List (compact rows), Table (full data)
- **Bulk add** — quantity field (1–50) for creating multiple identical spools
- **HueForge TD** — Transmission Distance field for lithophane/HueForge printing
- **Shareable color palette** — public URL with color swatches and view counter
- **Enhanced import** — drag-and-drop CSV/JSON with auto-detection for Polymaker, Prusament, eSUN, Spoolman formats
- **Duplicate detection** during import with preview table
- **Spoolman integration** — optional connection to external Spoolman server
- Stock health visualization, low stock warnings

## Cloud Slicer

- **File upload** — drag-and-drop upload zone for 3MF, G-code, STL, OBJ, STEP (up to 100 MB)
- **Local slicer bridge** — auto-detects OrcaSlicer and PrusaSlicer CLI
- **Automatic slicing** — STL/OBJ/STEP to 3MF with filament estimates and print time
- **FTPS upload** — uploads sliced files directly to printer SD card
- Job tracking (uploading, slicing, ready, uploaded)
- Configurable via `SLICER_PATH` environment variable

## Data & Analytics

- **Print history** — full log with status, duration, filament, layers (CSV export)
- **Statistics** — success rates, filament usage by type/brand, prints per week, monthly trends, peak temps, top files
- **Telemetry** — hero cards for live values, fan dashboard, time-series charts for temperatures/fans/speed
- **Error log** — all printer errors with severity, timestamps, search, and HMS error code descriptions with wiki links
- **Waste tracking** — automatic and manual waste logging with cost estimates, efficiency metrics
- **Maintenance** — component wear tracking, nozzle history, maintenance scheduling
- **Model info** — link prints to MakerWorld, Printables, or Thingiverse with cover image and stats

## Notifications

7 channels supported:

| Channel | Description |
|---------|-------------|
| **Telegram** | Bot token + chat ID |
| **Discord** | Webhook URL |
| **Email** | SMTP with TLS verification |
| **Webhook** | Custom URL with headers |
| **ntfy** | Server URL + topic + optional token |
| **Pushover** | API token + user key |
| **SMS** | Twilio or generic HTTP SMS gateway |

14 events: print started, finished, failed, cancelled, printer error, maintenance due, bed cooled, update available, protection alert, drying due, filament low stock, queue item started/completed/failed, queue completed.

Quiet hours support — no notifications during specified time window.

## Learning Center & Knowledge Base

### Learning Center
- Multi-step course system with progress tracking per user
- Categories: Getting Started, Filament Guide, Maintenance, Print Quality
- Built-in courses with markdown content and step-by-step navigation
- Progress persistence in database with completion tracking

### Knowledge Base
- Searchable database of printers, accessories, filaments, and slicer profiles
- Full CRUD for all categories with tagging system
- Cross-category search with relevance scoring
- Seed data generator for quick setup

## Infrastructure

- **Authentication** — optional password protection with session management (username + password or simple password)
- **English UI** — entire application in English, documentation available in English and Norwegian
- **HTTPS by default** — auto-generated self-signed SSL certificates, forced HTTPS redirect, HSTS headers
- **Content Security Policy** — CSP headers to prevent XSS and code injection
- **Theme system** — Light/Dark/Auto modes, 6 color presets, custom accent color, border radius slider
- **Locale-based currency** — automatic formatting using `Intl.NumberFormat`
- **Browser notifications** — real-time alerts for print events
- **Responsive design** — desktop, tablet, mobile
- **Auto-update** — checks GitHub Releases, one-click update with automatic backup
- **Setup wizard** — web-based first-time configuration
- **Zero framework frontend** — pure HTML/CSS/JS, no build step
- **Layout lock** — drag-and-drop module ordering in all panels
- **Demo mode** — 3 mock printers for testing without hardware
- **Pterodactyl / wisp.gg** — ready-made egg file for game panel hosting
- **HMS error database** — 268 error codes with descriptions and wiki links

## Model Forge (17 tools)

Parametric 3D generators built into the dashboard — create custom models without leaving the browser:

| Tool | Description |
|------|-------------|
| **Sign Maker** | Custom 3D-printable signs with text and icons |
| **Lithophane** | Convert images to lithophane 3D models |
| **Storage Box** | Parametric storage boxes with dividers |
| **Text Plate** | Text plates and labels |
| **Keychain** | Custom keychains with text and shapes |
| **Cable Label** | Cable management labels |
| **Image Relief** | Convert images to 3D relief models |
| **Stencil** | Stencil generator from images |
| **NFC Filament Tag** | NFC tags for filament spool identification |
| **3MF Converter** | Convert between 3D file formats to 3MF |
| **Calibration Tools** | Temperature towers, retraction tests, flow calibration |
| **Lattice Structure** | Lattice and infill structure generator |
| **Multi-Color** | Multi-color model preparation and splitting |
| **Advanced Vase** | Vase mode models with advanced shapes |
| **Threads & Joints** | Threaded fasteners and snap-fit joints |
| **Texture Surface** | Apply textures and patterns to surfaces |
| **3MF Validator** | Validate and repair 3MF files |

## 3D Viewer Enhancements

- **Layer scrubber** — slider to navigate through print layers
- **Parts panel** — tree view of model parts and components
- **Materials panel** — material properties and colour display
- **3MFConsortium 3mfViewer** — full 3D viewer with scene tree, wireframe, colours
- **Gcode toolpath** — per-layer colour visualisation (blue bottom to red top)
- **Three.js EnhancedViewer** — smooth shading, orbit controls, clipping planes

## Security

16 hardening improvements (CIS/NIS2 compliant):

- **TOFU cert pinning** — Trust-on-first-use certificate pinning for MQTT connections
- **First-message WebSocket authentication** — secure WS connection from first message
- **Color matcher API** — colour matching against filament inventory
- **CSP headers** — Content Security Policy to prevent XSS and code injection
- **HTTPS by default** — auto-generated self-signed SSL certificates, forced HTTPS redirect, HSTS headers
- **CSRF protection** — validation on state-changing requests
- **Rate limiting** — 200 req/min per IP (API), 5 login attempts per 15 min
- **Session management** — role-based permissions (admin, controls, print, queue, view)
- **API key support** — Bearer token or X-API-Key header authentication
- **Server management** — restart and clear cache from the dashboard

## API

- **590+ REST endpoints** with OpenAPI documentation at `/api/docs`
- Rate limiting with `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` headers
- RESTful pattern: `GET/POST/PUT/DELETE /api/{resource}[/:id]`
- Error responses: `{ error: "message" }` with appropriate HTTP status codes
