---
sidebar_position: 3
title: Medição de energia
description: Meça o consumo real de energia por impressão com plug inteligente Shelly ou Tasmota e conecte à visão geral de custos
---

# Medição de energia

Conecte um plug inteligente com medição de energia à impressora para registrar o consumo real de energia por impressão — não apenas estimativas.

Acesse em: **https://localhost:3443/#settings** → **Integrações → Medição de energia**

## Dispositivos suportados

| Dispositivo | Protocolo | Recomendação |
|---|---|---|
| **Shelly Plug S / Plus Plug S** | HTTP REST / MQTT | Recomendado — configuração simples |
| **Shelly 1PM / 2PM** | HTTP REST / MQTT | Para instalação fixa |
| **Shelly Gen2 / Gen3** | HTTP REST / MQTT | Modelos mais recentes com API estendida |
| **Dispositivos Tasmota** | MQTT | Flexível para configurações personalizadas |

:::tip Dispositivo recomendado
O Shelly Plug S Plus com firmware 1.0+ foi testado e é recomendado. Suporta Wi-Fi, MQTT e HTTP REST sem dependência de nuvem.
:::

## Configuração com Shelly

### Pré-requisitos

- O plug Shelly está conectado à mesma rede que o 3DPrintForge
- O Shelly está configurado com IP estático ou reserva DHCP

### Configuração

1. Vá em **Configurações → Medição de energia**
2. Clique em **Adicionar medidor de energia**
3. Selecione o **Tipo**: Shelly
4. Preencha:
   - **Endereço IP**: ex.: `192.168.1.150`
   - **Canal**: 0 (para plugs de tomada única)
   - **Autenticação**: usuário e senha se configurado
5. Clique em **Testar conexão**
6. Vincule o plug a uma **Impressora**: selecione na lista suspensa
7. Clique em **Salvar**

### Intervalo de polling

O intervalo de polling padrão é de 10 segundos. Reduza para 5 para medições mais precisas, aumente para 30 para menor carga de rede.

## Configuração com Tasmota

1. Configure o dispositivo Tasmota com MQTT (veja a documentação do Tasmota)
2. No 3DPrintForge: selecione **Tipo**: Tasmota
3. Preencha o tópico MQTT do dispositivo: ex.: `tasmota/power-plug-1`
4. Vincule à impressora e clique em **Salvar**

O 3DPrintForge assina automaticamente `{topic}/SENSOR` para medições de potência.

## O que é medido

Quando a medição de energia está ativada, o seguinte é registrado por impressão:

| Métrica | Descrição |
|---|---|
| **Potência instantânea** | Watts durante a impressão (ao vivo) |
| **Consumo total de energia** | kWh para toda a impressão |
| **Potência média** | kWh / tempo de impressão |
| **Custo de energia** | kWh × preço de energia (do Tibber/Nordpool) |

Os dados são armazenados no histórico de impressões e ficam disponíveis para análise.

## Visualização ao vivo

O consumo de potência instantâneo é exibido em:

- **No dashboard** — como um widget extra (ative nas configurações de widget)
- **Na visão geral da frota** — como um pequeno indicador no cartão da impressora

## Comparação com estimativa

Após a impressão, é exibida uma comparação:

| | Estimado | Real |
|---|---|---|
| Consumo de energia | 1,17 kWh | 1,09 kWh |
| Custo de energia | R$ 2,16 | R$ 2,02 |
| Desvio | — | -6,8% |

Desvios consistentes podem ser usados para calibrar as estimativas na [Calculadora de custos](../analytics/costestimator).

## Desligar impressora automaticamente

O Shelly/Tasmota pode desligar a impressora automaticamente após a impressão:

1. Vá em **Medição de energia → [Impressora] → Desligar automático**
2. Ative **Desligar X minutos após impressão concluída**
3. Defina o atraso (ex.: 10 minutos)

:::danger Resfriamento
Deixe a impressora esfriar por pelo menos 5–10 minutos após a impressão antes de cortar a energia. O bico deve esfriar abaixo de 50°C para evitar rastejamento de calor no hotend.
:::
