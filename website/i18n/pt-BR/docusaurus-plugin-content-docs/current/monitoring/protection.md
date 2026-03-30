---
sidebar_position: 1
title: Print Guard
description: Monitoramento automático com detecção de eventos XCam, monitoramento de sensores e ações configuráveis em caso de desvios
---

# Print Guard

O Print Guard é o sistema de monitoramento em tempo real do Bambu Dashboard. Ele monitora continuamente a câmera, sensores e dados da impressora e executa ações configuráveis quando algo está errado.

Acesse em: **https://localhost:3443/#protection**

## Detecção de eventos XCam

As impressoras Bambu Lab enviam eventos XCam via MQTT quando a câmera de IA detecta problemas:

| Evento | Código | Gravidade |
|--------|--------|-----------|
| Espaguete detectado | `xcam_spaghetti` | Crítica |
| Descolamento da placa | `xcam_detach` | Alta |
| Mau funcionamento na primeira camada | `xcam_first_layer` | Alta |
| Stringing | `xcam_stringing` | Média |
| Erro de extrusão | `xcam_extrusion` | Alta |

Para cada tipo de evento você pode configurar uma ou mais ações:

- **Alertar** — enviar alerta via canais de alerta ativos
- **Pausar** — colocar a impressão em pausa para verificação manual
- **Parar** — cancelar a impressão imediatamente
- **Nenhuma** — ignorar o evento (mas registrá-lo)

:::danger Comportamento padrão
Por padrão, os eventos XCam estão configurados como **Alertar** e **Pausar**. Mude para **Parar** se você confiar totalmente na detecção por IA.
:::

## Monitoramento de sensores

O Print Guard monitora continuamente os dados dos sensores e dispara alarmes em caso de desvios:

### Desvio de temperatura

1. Vá em **Print Guard → Temperatura**
2. Defina o **Desvio máximo da temperatura alvo** (recomendado: ±5°C para bico, ±3°C para mesa)
3. Selecione a **Ação em caso de desvio**: Alertar / Pausar / Parar
4. Defina o **Atraso** (segundos) antes da ação ser executada — dá tempo à temperatura para estabilizar

### Filamento baixo

O sistema calcula o filamento restante nas bobinas:

1. Vá em **Print Guard → Filamento**
2. Defina o **Limite mínimo** em gramas (ex.: 50 g)
3. Selecione a ação: **Pausar e alertar** (recomendado) para trocar a bobina manualmente

### Detecção de parada da impressão

Detecta quando a impressão parou inesperadamente (timeout MQTT, quebra de filamento, etc.):

1. Ative **Detecção de parada**
2. Defina o **Timeout** (recomendado: 120 segundos sem dados = parada)
3. Ação: Sempre alertar — a impressão pode já ter parado

## Configuração

### Ativar o Print Guard

1. Vá em **Configurações → Print Guard**
2. Ative **Ativar Print Guard**
3. Selecione quais impressoras devem ser monitoradas
4. Clique em **Salvar**

### Regras por impressora

Impressoras diferentes podem ter regras diferentes:

1. Clique em uma impressora na visão geral do Print Guard
2. Desative **Herdar regras globais**
3. Configure regras próprias para esta impressora

## Registro e histórico de eventos

Todos os eventos do Print Guard são registrados:

- Vá em **Print Guard → Registro**
- Filtre por impressora, tipo de evento, data e gravidade
- Clique em um evento para ver informações detalhadas e as ações executadas
- Exporte o registro para CSV

:::tip Falsos positivos
Se o Print Guard acionar pausas desnecessárias, ajuste a sensibilidade em **Print Guard → Configurações → Sensibilidade**. Comece com "Baixo" e aumente gradualmente.
:::
