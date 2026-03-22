---
sidebar_position: 1
title: Home Assistant
description: Integre o Bambu Dashboard com o Home Assistant via descoberta MQTT, entidades automáticas e exemplos de automação
---

# Home Assistant

A integração com o Home Assistant expõe todas as impressoras Bambu Lab como entidades no Home Assistant via MQTT Discovery — automaticamente, sem configuração manual de YAML.

Acesse em: **https://localhost:3443/#settings** → aba **Integrações → Home Assistant**

## Pré-requisitos

- Home Assistant em execução na rede
- Broker MQTT (Mosquitto) instalado e configurado no Home Assistant
- Bambu Dashboard e Home Assistant usando o mesmo broker MQTT

## Ativar MQTT Discovery

1. Vá em **Configurações → Integrações → Home Assistant**
2. Preencha as configurações do broker MQTT (se ainda não configurado):
   - **Endereço do broker**: ex.: `192.168.1.100`
   - **Porta**: `1883` (ou `8883` para TLS)
   - **Usuário e senha**: se exigido pelo broker
3. Ative **MQTT Discovery**
4. Defina o **Prefixo de discovery**: o padrão é `homeassistant`
5. Clique em **Salvar e ativar**

O Bambu Dashboard agora publica mensagens de discovery para todas as impressoras registradas.

## Entidades no Home Assistant

Após a ativação, uma nova entidade por impressora aparece no Home Assistant (**Configurações → Dispositivos e serviços → MQTT**):

### Padrão de ID de entidade

Os IDs de entidade seguem o padrão `sensor.{printer_name_slug}_{sensor_id}`, onde `printer_name_slug` é o nome da impressora em minúsculas com caracteres especiais substituídos por sublinhado. Exemplo: uma impressora chamada «Minha P1S» gera `sensor.minha_p1s_status`.

### Sensores (leitura)

| ID do sensor | Unidade | Exemplo |
|---|---|---|
| `{slug}_status` | texto | `RUNNING` |
| `{slug}_progress` | % | `47` |
| `{slug}_remaining` | min | `83` |
| `{slug}_layer` | número | `124` |
| `{slug}_total_layers` | número | `280` |
| `{slug}_nozzle_temp` | °C | `220.5` |
| `{slug}_nozzle_target` | °C | `220.0` |
| `{slug}_bed_temp` | °C | `60.1` |
| `{slug}_bed_target` | °C | `60.0` |
| `{slug}_chamber_temp` | °C | `34.2` |
| `{slug}_current_file` | texto | `benchy.3mf` |
| `{slug}_speed` | % | `100` |
| `{slug}_wifi_signal` | texto | `-65dBm` |

### Sensores binários

| ID do sensor | Estado |
|---|---|
| `{slug}_printing` | `on` / `off` |
| `{slug}_online` | `on` / `off` |

:::info Observação
Os botões (pausar/retomar/parar) não são publicados via MQTT Discovery. Use a API do Bambu Dashboard para enviar comandos a partir de automações.
:::

## Exemplos de automação

### Notificar no celular quando a impressão terminar

Substitua `minha_p1s` pelo slug do nome da sua impressora.

```yaml
automation:
  - alias: "Bambu - Impressão concluída"
    trigger:
      - platform: state
        entity_id: binary_sensor.minha_p1s_printing
        from: "on"
        to: "off"
    condition:
      - condition: state
        entity_id: sensor.minha_p1s_status
        state: "FINISH"
    action:
      - service: notify.mobile_app_meu_telefone
        data:
          title: "Impressão concluída!"
          message: "{{ states('sensor.minha_p1s_current_file') }} terminou."
```

### Reduzir as luzes quando a impressão começar

```yaml
automation:
  - alias: "Bambu - Reduzir luzes durante impressão"
    trigger:
      - platform: state
        entity_id: binary_sensor.minha_p1s_printing
        to: "on"
    action:
      - service: light.turn_on
        target:
          entity_id: light.porão
        data:
          brightness_pct: 30
```

## Monitoramento de energia

A medição de energia via Shelly ou Tasmota é tratada separadamente e não é exposta diretamente via MQTT Discovery para o Home Assistant. Veja [Medição de energia](./power) para configuração do plug inteligente.
