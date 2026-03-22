---
sidebar_position: 2
title: Arquitetura técnica
description: Visão geral da arquitetura do Bambu Dashboard — stack, módulos, banco de dados e WebSocket
---

# Arquitetura técnica

## Diagrama do sistema

```
Browser <──WebSocket──> Node.js <──MQTTS:8883──> Printer
Browser <──WS:9001+──> ffmpeg  <──RTSPS:322───> Camera
```

O dashboard se comunica com a impressora via MQTT sobre TLS (porta 8883) e com a câmera via RTSPS (porta 322). O navegador se conecta ao dashboard via HTTPS e WebSocket.

## Stack técnico

| Camada | Tecnologia |
|--------|------------|
| Frontend | Vanilla HTML/CSS/JS — 76 módulos de componentes, sem etapa de build, sem frameworks |
| Backend | Node.js 22 com 3 pacotes npm: `mqtt`, `ws`, `basic-ftp` |
| Banco de dados | SQLite (integrado ao Node.js 22 via `--experimental-sqlite`) |
| Câmera | ffmpeg transcodifica RTSPS para MPEG1, jsmpeg renderiza no navegador |
| Tempo real | WebSocket hub transmite o estado da impressora para todos os clientes conectados |
| Protocolo | MQTT sobre TLS (porta 8883) com o LAN Access Code da impressora |

## Portas

| Porta | Protocolo | Direção | Descrição |
|-------|-----------|---------|-----------|
| 3000 | HTTP + WS | Entrada | Dashboard (redireciona para HTTPS) |
| 3443 | HTTPS + WSS | Entrada | Dashboard seguro (padrão) |
| 9001+ | WS | Entrada | Streams de câmera (um por impressora) |
| 8883 | MQTTS | Saída | Conexão com impressora |
| 322 | RTSPS | Saída | Câmera da impressora |

## Módulos do servidor (44)

| Módulo | Finalidade |
|--------|------------|
| `index.js` | Servidores HTTP/HTTPS, SSL automático, headers CSP/HSTS, arquivos estáticos, modo demo |
| `config.js` | Carregamento de configuração, valores padrão, substituições de env e migrações |
| `database.js` | Esquema SQLite, 105 migrações, operações CRUD |
| `api-routes.js` | API REST (284+ endpoints) |
| `auth.js` | Autenticação e gerenciamento de sessão |
| `backup.js` | Backup e restauração |
| `printer-manager.js` | Ciclo de vida da impressora, gerenciamento de conexões MQTT |
| `mqtt-client.js` | Conexão MQTT com impressoras Bambu |
| `mqtt-commands.js` | Construção de comandos MQTT (pausar, retomar, parar, etc.) |
| `websocket-hub.js` | Transmissão WebSocket para todos os clientes do navegador |
| `camera-stream.js` | Gerenciamento de processos ffmpeg para streams de câmera |
| `print-tracker.js` | Rastreamento de trabalhos de impressão, transições de estado, registro de histórico |
| `print-guard.js` | Proteção de impressão via xcam + monitoramento de sensores |
| `queue-manager.js` | Fila de impressão com despacho multi-impressora e balanceamento de carga |
| `slicer-service.js` | Ponte CLI de fatiador local, upload de arquivo, upload FTPS |
| `telemetry.js` | Processamento de dados de telemetria |
| `telemetry-sampler.js` | Amostragem de dados de série temporal |
| `thumbnail-service.js` | Busca de miniaturas via FTPS do SD da impressora |
| `timelapse-service.js` | Gravação e gerenciamento de timelapse |
| `notifications.js` | Sistema de alertas de 7 canais (Telegram, Discord, E-mail, Webhook, ntfy, Pushover, SMS) |
| `updater.js` | Atualização automática do GitHub Releases com backup |
| `setup-wizard.js` | Assistente de configuração web para o primeiro uso |
| `ecom-license.js` | Gerenciamento de licenças |
| `failure-detection.js` | Detecção e análise de falhas |
| `bambu-cloud.js` | Integração com a API Bambu Cloud |
| `bambu-rfid-data.js` | Dados de filamento RFID do AMS |
| `circuit-breaker.js` | Padrão circuit breaker para estabilidade de serviços |
| `energy-service.js` | Cálculo de energia e preço de eletricidade |
| `error-pattern-analyzer.js` | Análise de padrões de erros HMS |
| `file-parser.js` | Análise de arquivos 3MF/GCode |
| `logger.js` | Log estruturado |
| `material-recommender.js` | Recomendações de material |
| `milestone-service.js` | Rastreamento de marcos e conquistas |
| `plugin-manager.js` | Sistema de plugins para extensões |
| `power-monitor.js` | Integração com medidor de energia (Shelly/Tasmota) |
| `price-checker.js` | Busca de preços de energia (Tibber/Nordpool) |
| `printer-discovery.js` | Descoberta automática de impressoras na LAN |
| `remote-nodes.js` | Gerenciamento de múltiplos nós |
| `report-service.js` | Geração de relatórios |
| `seed-filament-db.js` | Semeadura do banco de dados de filamentos |
| `spoolease-data.js` | Integração SpoolEase |
| `validate.js` | Validação de dados de entrada |
| `wear-prediction.js` | Previsão de desgaste de componentes |

## Componentes frontend (76)

Todos os componentes são módulos JavaScript vanilla sem etapa de build. Eles são carregados diretamente no navegador via `<script type="module">`.

| Componente | Finalidade |
|------------|------------|
| `print-preview.js` | Visualizador de modelos 3D + revelação de imagens MakerWorld |
| `model-viewer.js` | Renderização 3D WebGL com animação de camadas |
| `temperature-gauge.js` | Medidores de anel SVG animados |
| `sparkline-stats.js` | Painéis de estatísticas estilo Grafana |
| `ams-panel.js` | Visualização de filamento AMS |
| `camera-view.js` | Player de vídeo jsmpeg com tela cheia |
| `controls-panel.js` | UI de controle da impressora |
| `history-table.js` | Histórico de impressões com pesquisa, filtros, exportação CSV |
| `filament-tracker.js` | Estoque de filamentos com favoritos, filtragem por cor |
| `queue-panel.js` | Gerenciamento da fila de impressão |
| `knowledge-panel.js` | Leitor e editor da base de conhecimento |

## Banco de dados

O banco de dados SQLite é integrado ao Node.js 22 e não requer instalação externa. O esquema é gerenciado por 105 migrações em `db/migrations.js`.

Tabelas principais:

- `printers` — configuração da impressora
- `print_history` — todos os trabalhos de impressão
- `filaments` — estoque de filamentos
- `ams_slots` — vinculação de slots AMS
- `queue` — fila de impressão
- `notifications_config` — configurações de alertas
- `maintenance_log` — registro de manutenção

## Segurança

- HTTPS com certificado autogerado (ou o seu próprio)
- Autenticação baseada em JWT
- Headers CSP e HSTS
- Rate limiting (200 req/min)
- Sem dependência de nuvem externa para funções principais
