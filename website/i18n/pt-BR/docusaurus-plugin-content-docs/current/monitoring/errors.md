---
sidebar_position: 2
title: Registro de erros
description: Visão completa dos códigos de erro HMS das impressoras com nível de gravidade, busca e links para a Bambu Wiki
---

# Registro de erros

O registro de erros reúne todos os erros e alertas HMS (Health, Maintenance, Safety) das suas impressoras. O 3DPrintForge possui um banco de dados integrado com mais de 269 códigos HMS para impressoras Bambu Lab.

Acesse em: **https://localhost:3443/#errors**

## Códigos HMS

As impressoras Bambu Lab enviam códigos HMS via MQTT quando algo está errado. O 3DPrintForge os traduz automaticamente para mensagens de erro legíveis:

| Código | Exemplo | Categoria |
|--------|---------|-----------|
| `0700 0100 0001 0001` | Nozzle heatbreak clogged | Bico/Extrusor |
| `0700 0200 0002 0001` | AMS filament stuck | AMS |
| `0700 0300 0003 0001` | Bed leveling failed | Plataforma |
| `0700 0500 0001 0001` | MC disconnect | Eletrônica |

A lista completa cobre todos os 269+ códigos conhecidos para X1C, X1C Combo, X1E, P1S, P1S Combo, P1P, P2S, P2S Combo, A1, A1 Combo, A1 mini, H2S, H2D e H2C.

## Nível de gravidade

Os erros são classificados em quatro níveis:

| Nível | Cor | Descrição |
|-------|-----|-----------|
| **Crítico** | Vermelho | Requer ação imediata — impressão interrompida |
| **Alto** | Laranja | Deve ser tratado rapidamente — a impressão pode continuar |
| **Médio** | Amarelo | Deve ser investigado — sem risco imediato |
| **Info** | Azul | Mensagem informativa, nenhuma ação necessária |

## Busca e filtragem

Use a barra de ferramentas no topo do registro de erros:

1. **Busca em texto livre** — busque na mensagem de erro, código HMS ou descrição da impressora
2. **Impressora** — exiba erros apenas de uma impressora
3. **Categoria** — AMS / Bico / Placa / Eletrônica / Calibração / Outro
4. **Gravidade** — Todos / Crítico / Alto / Médio / Info
5. **Data** — filtre por período
6. **Não confirmados** — exiba apenas erros não confirmados

Clique em **Limpar filtro** para ver todos os erros.

## Links para o Wiki

Para cada código HMS é exibido um link para o Bambu Lab Wiki com:

- Descrição completa do erro
- Possíveis causas
- Guia de solução de problemas passo a passo
- Recomendações oficiais da Bambu Lab

Clique em **Abrir wiki** em uma entrada de erro para abrir a página relevante do wiki em uma nova aba.

:::tip Cópia local
O 3DPrintForge armazena em cache o conteúdo do wiki localmente para uso offline. O conteúdo é atualizado automaticamente semanalmente.
:::

## Confirmar erros

A confirmação marca um erro como tratado sem excluí-lo:

1. Clique em um erro na lista
2. Clique em **Confirmar** (ícone de marca de seleção)
3. Insira uma nota opcional sobre o que foi feito
4. O erro é marcado com uma marca de seleção e movido para a lista "Confirmados"

### Confirmação em massa

1. Selecione vários erros com caixas de seleção
2. Clique em **Confirmar selecionados**
3. Todos os erros selecionados são confirmados simultaneamente

## Estatísticas

No topo do registro de erros são exibidos:

- Total de erros nos últimos 30 dias
- Número de erros não confirmados
- Código HMS mais frequente
- Impressora com mais erros

## Exportação

1. Clique em **Exportar** (ícone de download)
2. Selecione o formato: **CSV** ou **JSON**
3. O filtro é aplicado à exportação — defina o filtro desejado primeiro
4. O arquivo é baixado automaticamente

## Alertas para novos erros

Ative alertas para novos erros HMS:

1. Vá em **Configurações → Alertas**
2. Marque **Novos erros HMS**
3. Selecione a gravidade mínima para alertas (recomendado: **Alto** e acima)
4. Selecione o canal de alerta

Veja [Alertas](../features/notifications) para configuração de canais.
