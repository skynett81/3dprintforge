---
sidebar_position: 10
title: Streaming com OBS
description: Configure o Bambu Dashboard como overlay no OBS Studio para streaming profissional de impressão 3D
---

# Streaming de impressão 3D para o OBS

O Bambu Dashboard tem um overlay OBS integrado que exibe o status da impressora, progresso, temperaturas e feed da câmera diretamente na sua transmissão.

## Pré-requisitos

- OBS Studio instalado ([obsproject.com](https://obsproject.com))
- Bambu Dashboard rodando e conectado à impressora
- (Opcional) Câmera Bambu ativada para feed ao vivo

## Passo 1 — OBS Browser Source

O OBS tem uma **Browser Source** integrada que exibe uma página web diretamente na sua cena.

**Adicionar overlay no OBS:**

1. Abra o OBS Studio
2. Em **Fontes** (Sources), clique em **+**
3. Escolha **Navegador** (Browser)
4. Dê um nome à fonte, ex.: "Bambu Overlay"
5. Preencha:

| Configuração | Valor |
|-------------|-------|
| URL | `http://localhost:3000/obs/overlay` |
| Largura | `1920` |
| Altura | `1080` |
| FPS | `30` |
| CSS personalizado | Veja abaixo |

6. Marque **Controlar áudio via OBS**
7. Clique em **OK**

:::info Ajuste a URL para o seu servidor
O painel está rodando em uma máquina diferente do OBS? Substitua `localhost` pelo endereço IP do servidor, ex.: `http://192.168.1.50:3000/obs/overlay`
:::

## Passo 2 — Fundo transparente

Para o overlay se integrar na imagem, o fundo deve ser transparente:

**Nas configurações do OBS Browser Source:**
- Marque **Remover fundo** (Shutdown source when not visible / Remove background)

**CSS personalizado para forçar transparência:**
```css
body {
  background-color: rgba(0, 0, 0, 0) !important;
  margin: 0;
  overflow: hidden;
}
```

Cole isso no campo **CSS personalizado** nas configurações do Browser Source.

O overlay agora exibe apenas o próprio widget — sem fundo branco ou preto.

## Passo 3 — Personalizar o overlay

No Bambu Dashboard você pode configurar o que o overlay exibe:

1. Vá em **Funcionalidades → Overlay OBS**
2. Configure:

| Configuração | Opções |
|-------------|--------|
| Posição | Superior esquerdo, direito, inferior esquerdo, direito |
| Tamanho | Pequeno, médio, grande |
| Tema | Escuro, claro, transparente |
| Cor de destaque | Escolha uma cor que combine com o estilo da sua stream |
| Elementos | Escolha o que é exibido (veja abaixo) |

**Elementos de overlay disponíveis:**

- Nome e status da impressora (online/imprimindo/erro)
- Barra de progresso com porcentagem e tempo restante
- Filamento e cor
- Temperatura do bico e da mesa
- Filamento usado (gramas)
- Visão geral do AMS (compacto)
- Status do Print Guard

3. Clique em **Visualizar** para ver o resultado sem mudar para o OBS
4. Clique em **Salvar**

:::tip URL por impressora
Tem várias impressoras? Use URLs de overlay separadas:
```
/obs/overlay?printer=1
/obs/overlay?printer=2
```
:::

## Feed da câmera no OBS (fonte separada)

A câmera Bambu pode ser adicionada como uma fonte separada no OBS — independente do overlay:

**Opção 1: Via proxy de câmera do painel**

1. Vá em **Sistema → Câmera**
2. Copie a **URL do streaming RTSP ou MJPEG**
3. No OBS: Clique em **+** → **Fonte de mídia** (Media Source)
4. Cole a URL
5. Marque **Loop** e desative arquivos locais

**Opção 2: Browser Source com visualização da câmera**

1. No OBS: Adicione um **Browser Source**
2. URL: `http://localhost:3000/obs/camera?printer=1`
3. Largura/altura: correspondente à resolução da câmera (1080p ou 720p)

Agora você pode posicionar o feed da câmera livremente na cena e colocar o overlay em cima.

## Dicas para uma boa stream

### Configuração da cena de streaming

Uma cena típica para streaming de impressão 3D:

```
┌─────────────────────────────────────────┐
│                                         │
│      [Feed da câmera da impressora]     │
│                                         │
│  ┌──────────────────┐                  │
│  │ Bambu Overlay    │  ← Inferior esq. │
│  │ Print: Logo.3mf  │                  │
│  │ ████████░░ 82%   │                  │
│  │ 1h 24m restante  │                  │
│  │ 220°C / 60°C     │                  │
│  └──────────────────┘                  │
└─────────────────────────────────────────┘
```

### Configurações recomendadas

| Parâmetro | Valor recomendado |
|-----------|------------------|
| Tamanho do overlay | Médio (não muito dominante) |
| Taxa de atualização | 30 FPS (combina com o OBS) |
| Posição do overlay | Inferior esquerdo (evita rosto/chat) |
| Tema de cores | Escuro com destaque azul |

### Cenas e troca de cenas

Crie cenas OBS próprias:

- **"Impressão em andamento"** — visualização da câmera + overlay
- **"Pausado / aguardando"** — imagem estática + overlay
- **"Pronto"** — imagem do resultado + overlay mostrando "Concluído"

Alterne entre cenas com atalho de teclado no OBS ou via Scene Collection.

### Estabilização do feed da câmera

A câmera Bambu pode às vezes travar. No painel em **Sistema → Câmera**:
- Ative **Reconexão automática** — o painel se reconecta automaticamente
- Defina o **Intervalo de reconexão** para 10 segundos

### Áudio

Impressoras 3D fazem barulho — especialmente o AMS e o resfriamento. Considere:
- Posicione o microfone longe da impressora
- Adicione filtro de ruído no microfone no OBS (Noise Suppression)
- Ou use música de fundo / áudio do chat no lugar

:::tip Troca automática de cena
O OBS tem suporte integrado para troca de cena com base em títulos. Combine com um plugin (ex.: obs-websocket) e a API do Bambu Dashboard para trocar de cena automaticamente quando uma impressão começa e termina.
:::
