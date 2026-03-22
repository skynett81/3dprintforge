---
sidebar_position: 6
title: Modo quiosque
description: Configure o Bambu Dashboard como uma tela montada na parede ou visualização hub com modo quiosque e rotação automática
---

# Modo quiosque

O modo quiosque é projetado para telas montadas na parede, TVs ou monitores dedicados que exibem continuamente o status das impressoras — sem teclado, interação com mouse ou interface do navegador.

Acesse em: **https://localhost:3443/#settings** → **Sistema → Quiosque**

## O que é o modo quiosque

No modo quiosque:
- O menu de navegação está oculto
- Nenhum controle interativo é visível
- O dashboard é atualizado automaticamente
- A tela rotaciona entre impressoras (se configurado)
- O timeout de inatividade está desativado

## Ativar modo quiosque via URL

Adicione `?kiosk=true` à URL para ativar o modo quiosque sem alterar as configurações:

```
https://localhost:3443/?kiosk=true
https://localhost:3443/#fleet?kiosk=true
```

O modo quiosque é desativado removendo o parâmetro ou adicionando `?kiosk=false`.

## Configurações do quiosque

1. Vá em **Configurações → Sistema → Quiosque**
2. Configure:

| Configuração | Valor padrão | Descrição |
|---|---|---|
| Visualização padrão | Visão geral da frota | Qual página é exibida |
| Intervalo de rotação | 30 segundos | Tempo por impressora na rotação |
| Modo de rotação | Somente ativas | Rotacionar apenas entre impressoras ativas |
| Tema | Escuro | Recomendado para telas |
| Tamanho da fonte | Grande | Legível à distância |
| Mostrar relógio | Desligado | Exibir relógio no canto |

## Visualização da frota para quiosque

A visão geral da frota é otimizada para quiosque:

```
https://localhost:3443/#fleet?kiosk=true&cols=3&size=large
```

Parâmetros para visualização da frota:
- `cols=N` — número de colunas (1–6)
- `size=small|medium|large` — tamanho do cartão

## Rotação de impressora única

Para rotação entre impressoras individuais (uma impressora por vez):

```
https://localhost:3443/?kiosk=true&rotate=true&interval=20
```

- `rotate=true` — ativar rotação
- `interval=N` — segundos por impressora

## Configuração no Raspberry Pi / NUC

Para hardware de quiosque dedicado:

### Chromium em modo quiosque (Linux)

```bash
chromium-browser \
  --kiosk \
  --noerrdialogs \
  --disable-infobars \
  --no-first-run \
  --app="https://localhost:3443/?kiosk=true"
```

Adicione o comando na inicialização automática (`~/.config/autostart/bambu-kiosk.desktop`).

### Login automático e inicialização

1. Configure o login automático no sistema operacional
2. Crie uma entrada de inicialização automática para o Chromium
3. Desative o protetor de tela e o gerenciamento de energia:
   ```bash
   xset s off
   xset -dpms
   xset s noblank
   ```

:::tip Conta de usuário dedicada
Crie uma conta de usuário dedicada do Bambu Dashboard com a função **Convidado** para o dispositivo quiosque. Assim, o dispositivo tem apenas acesso de leitura e não pode alterar configurações, mesmo que alguém acesse a tela.
:::

## Configurações de hub

O modo hub exibe uma página de visão geral com todas as impressoras e estatísticas principais — projetado para TVs grandes:

```
https://localhost:3443/#hub?kiosk=true
```

A visualização hub inclui:
- Grade de impressoras com status
- Números-chave agregados (impressões ativas, progresso total)
- Relógio e data
- Alertas HMS mais recentes
