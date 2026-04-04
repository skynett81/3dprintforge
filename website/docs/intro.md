---
sidebar_position: 1
title: Velkommen til 3DPrintForge
description: En kraftig, selvdriftet dashboard for alle dine 3D-printere
---

# Velkommen til 3DPrintForge

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/V7V21NRKM7)

**3DPrintForge** er et selvdriftet, fullverdig kontrollpanel for alle dine 3D-printere. Det gir deg full oversikt og kontroll over printer, filamentlager, printhistorikk og mer — alt fra én nettleser-fane.

## Hva er 3DPrintForge?

3DPrintForge kobler seg til printerne dine via MQTT (Bambu Lab) eller Moonraker WebSocket (Snapmaker, Voron, Creality K1 og andre Klipper-printere) over LAN. Synkroniser modeller og printhistorikk via Bambu Cloud, Snapmaker Cloud, eller hent data direkte fra printeren.

### Viktigste funksjoner

- **Live dashboard** — sanntids temperatur, fremgang, kamera, AMS-status med LIVE-indikator
- **3D modellvisning** — 3MFConsortium 3mfViewer for 3MF-filer, gcode toolpath-visning med per-lag farger, Three.js-basert rendering
- **AdminLTE 4** — moderne dashboard-rammeverk med treeview-sidebar og responsivt design
- **CRM-system** — kunder, ordrer, fakturaer, bedriftsinnstillinger og printhistorikk-kobling
- **Filamentlager** — spor alle spoler med AMS-synk, EXT-spool støtte, materialinfo, plate-kompatibilitet og tørkeguide
- **Filament-tracking** — live sporing under printing med 4-nivå fallback (AMS-sensor → EXT-estimat → cloud → varighet)
- **Materialguide** — 15 materialer med temperaturer, plate-kompatibilitet, tørking, egenskaper og tips
- **Printhistorikk** — komplett logg med modellnavn, MakerWorld-lenker, filamentforbruk, kostnader og 3D-forhåndsvisning
- **Planlegger** — kalendervisning, print-kø med lastbalansering og filamentsjekk
- **Printerkontroll** — temperatur, hastighet, vifter, G-code konsoll
- **Print Guard** — automatisk beskyttelse med xcam + 5 sensormonitorer
- **Kostnadsestimator** — material, strøm, arbeid, slitasje, markup, filamentbytte-tid og salgsprisforslag
- **Vedlikehold** — sporing med KB-baserte intervaller, dyselevetid, plate-levetid og guide
- **Lydvarsler** — 9 konfigurerbare events med custom lyd-upload og printerhøyttaler (M300)
- **Aktivitetslogg** — persistent tidslinje fra alle hendelser (prints, feil, vedlikehold, filament)
- **AMS fuktighet/temperatur** — 5-nivå vurdering med anbefalinger for optimal oppbevaring
- **Achievements** — 18 verdens landemerker som milepæler for filamentforbruk med XP-progresjon
- **Varsler** — 7 kanaler (Telegram, Discord, e-post, ntfy, Pushover, SMS, webhook)
- **Multi-printer, multi-brand** — Bambu Lab (MQTT) + Snapmaker, Voron, Creality og alle Klipper/Moonraker-printere
- **Printer-capabilities** — per-merke konfigurasjon for filtilgang, kamera og funksjoner
- **Filbibliotek** — 3MF/STL/gcode-bibliotek med thumbnails, kategorier, tags og 3D-forhåndsvisning
- **2 språk** — norsk og engelsk
- **Selvdriftet** — ingen sky-avhengighet, dine data på din maskin

### Nytt i v1.1.15

- **3MF Consortium-integrasjon** — lib3mf WASM for spec-kompatibel 3MF-parsing, 3mfViewer embed for full 3D-visning
- **Gcode toolpath-viewer** — per-lag fargevisualisering for alle Moonraker/Klipper-printere
- **Three.js EnhancedViewer** — smooth shading, orbit controls, clipping planes for print-progress
- **Universell 3D-forhåndsvisning** — fungerer for alle printertyper (Bambu FTPS, Moonraker HTTP, lokale filer)
- **Printer-capabilities** — per-merke/modell konfigurasjon (Bambu Lab, Snapmaker, Voron, Creality etc.)
- **History 3MF-linking** — last opp, erstatt og slett 3MF-filer koblet til printhistorikk
- **Auto 3MF-caching** — lagrer modellnavn og metadata fra Bambu-printer ved print-start
- **3D-knapper overalt** — history, library, kø, planlegger og galleri

### Nytt i v1.1.14

- **AdminLTE 4-integrasjon** — komplett HTML-restrukturering med treeview-sidebar, moderne layout og CSP-støtte for CDN
- **CRM-system** — full kundebehandling med 4 paneler: kunder, ordrer, fakturaer og bedriftsinnstillinger med historikk-integrasjon
- **Moderne UI** — teal aksent, gradient titler, hover glow, floating orbs og forbedret mørkt tema
- **Achievements: 18 landemerker** — vikingskip, Frihetsgudinnen, Eiffeltårnet, Big Ben, Brandenburger Tor, Sagrada Família, Colosseum, Tokyo Tower, Gyeongbokgung, nederlandsk vindmølle, Wawel-dragen, Cristo Redentor, Turning Torso, Hagia Sophia, Moderlandet, Den kinesiske mur, Praha orloj, Budapest parlament — med detalj-popup, XP og rarity
- **AMS fuktighet/temperatur** — 5-nivå vurdering med anbefalinger for oppbevaring og tørking
- **Live filament-tracking** — sanntids oppdatering under printing via cloud estimate fallback
- **Komplett i18n** — alle 3252 nøkler oversatt til 2 språk inkludert CRM og landemerke-achievements

## Hurtigstart

| Oppgave | Lenke |
|---------|-------|
| Installer dashboardet | [Installasjon](./getting-started/installation) |
| Konfigurer første printer | [Oppsett](./getting-started/setup) |
| Koble til Bambu Cloud | [Bambu Cloud](./getting-started/bambu-cloud) |
| Utforsk alle funksjoner | [Funksjoner](./features/overview) |
| Filamentguide | [Materialguide](./kb/filaments/guide) |
| Vedlikeholdsguide | [Vedlikehold](./kb/maintenance/nozzle) |
| API-dokumentasjon | [API](./advanced/api) |

:::tip Demo-modus
Du kan prøve dashboardet uten en fysisk printer ved å kjøre `npm run demo`. Dette starter 3 simulerte printere med live print-sykluser.
:::

## Støttede printere

### Bambu Lab (via MQTT)
- **X1-serien**: X1C, X1C Combo, X1E
- **P1-serien**: P1S, P1S Combo, P1P
- **P2-serien**: P2S, P2S Combo
- **A-serien**: A1, A1 Combo, A1 mini
- **H2-serien**: H2S, H2D (dobbel dyse), H2C (verktøybytter, 6 hoder)

### Klipper/Moonraker-printere (via WebSocket + REST API)
- **Snapmaker**: U1 (opptil 4 verktøyhoder), J1, A350T, A250T
- **Voron**: V0, Trident, V2.4
- **Creality**: K1, K1 Max, K2 Plus (med Klipper-firmware)
- **Sovol**: SV06, SV07, SV08
- **QIDI**: X-Max 3, X-Plus 3, Q1 Pro
- **Ratrig**: V-Core, V-Minion
- **Alle andre** Klipper + Moonraker-baserte printere

## 3D-modellvisning

3DPrintForge integrerer 3MF Consortium sine offisielle verktøy for 3D-modellvisning:

### 3MF-filer (Library og History)
- **3mfViewer** fra [3MFConsortium](https://github.com/3MFConsortium/3mfViewer) — full 3D-viewer med scene tree, materialer, wireframe og farger
- **lib3mf WASM** for spec-kompatibel parsing av metadata, thumbnails og mesh-data
- Last opp 3MF-filer direkte til printhistorikk for 3D-visning

### Gcode toolpath (Moonraker og Bambu)
- Per-lag fargevisualisering (blå bunn → rød topp)
- Automatisk nedlasting fra Moonraker HTTP API eller Bambu FTPS
- Downsampling for store filer (maks 100k segmenter)

### Printer-spesifikk tilgang
| Printertype | 3MF-tilgang | Gcode-tilgang |
|-------------|-------------|---------------|
| Bambu Lab | FTPS (port 990) | Innebygd i gcode.3mf |
| Moonraker/Klipper | Ikke på printer | HTTP API `/server/files/gcodes/` |
| Library-filer | Lokal disk | N/A |

## Teknisk oversikt

3DPrintForge er bygget med Node.js 22 og vanilla HTML/CSS/JS — ingen tunge rammeverk, ingen build-steg. Databasen er SQLite, innebygd i Node.js 22.

- **Backend**: Node.js 22 med 6 npm-pakker (mqtt, ws, basic-ftp, admin-lte, ssh2, @3mfconsortium/lib3mf)
- **Frontend**: AdminLTE 4 + vanilla HTML/CSS/JS + Three.js (vendored) + 3mfViewer (embedded), ingen build-steg
- **Database**: SQLite (innebygd i Node.js 22)
- **3D-visning**: Three.js r183 + 3MFConsortium 3mfViewer + lib3mf WASM
- **Dokumentasjon**: Docusaurus med 2 språk, automatisk bygget ved installasjon
- **API**: 180+ endepunkter, OpenAPI-dokumentasjon på `/api/docs`

Se [Arkitektur](./advanced/architecture) for detaljer.
