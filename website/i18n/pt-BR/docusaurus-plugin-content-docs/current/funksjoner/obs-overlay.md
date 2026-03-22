---
sidebar_position: 4
title: OBS Overlay
description: Adicione um overlay de status transparente da sua impressora Bambu Lab diretamente no OBS Studio
---

# OBS Overlay

O OBS Overlay permite exibir o status em tempo real da impressora diretamente no OBS Studio — perfeito para transmissões ao vivo ou gravações de impressão 3D.

## URL do overlay

O overlay está disponível como uma página web com fundo transparente:

```
https://localhost:3443/obs-overlay?printer=PRINTER_ID
```

Substitua `PRINTER_ID` pelo ID da impressora (encontrado em **Configurações → Impressoras**).

### Parâmetros disponíveis

| Parâmetro | Valor padrão | Descrição |
|-----------|-------------|-----------|
| `printer` | primeira impressora | ID da impressora a ser exibida |
| `theme` | `dark` | `dark`, `light` ou `minimal` |
| `scale` | `1.0` | Escala (0.5–2.0) |
| `position` | `bottom-left` | `top-left`, `top-right`, `bottom-left`, `bottom-right` |
| `opacity` | `0.9` | Transparência (0.0–1.0) |
| `fields` | todos | Lista separada por vírgula: `progress,temp,ams,time` |
| `color` | `#00d4ff` | Cor de destaque (hex) |

**Exemplo com parâmetros:**
```
https://localhost:3443/obs-overlay?printer=abc123&theme=minimal&scale=1.2&position=top-right&fields=progress,time
```

## Configuração no OBS Studio

### Etapa 1: Adicionar fonte do navegador

1. Abra o OBS Studio
2. Clique em **+** em **Fontes**
3. Selecione **Navegador** (Browser Source)
4. Dê um nome à fonte, ex.: `Bambu Overlay`
5. Clique em **OK**

### Etapa 2: Configurar a fonte do navegador

Preencha o seguinte na caixa de diálogo de configurações:

| Campo | Valor |
|-------|-------|
| URL | `https://localhost:3443/obs-overlay?printer=SEU_ID` |
| Largura | `400` |
| Altura | `200` |
| FPS | `30` |
| CSS personalizado | *(deixe em branco)* |

Marque:
- ✅ **Desligar fonte quando não visível**
- ✅ **Atualizar navegador quando a cena for ativada**

:::warning HTTPS e localhost
O OBS pode alertar sobre certificado autoassinado. Acesse `https://localhost:3443` no Chrome/Firefox primeiro e aceite o certificado. O OBS usará a mesma aprovação.
:::

### Etapa 3: Fundo transparente

O overlay é construído com `background: transparent`. Para funcionar no OBS:

1. **Não** marque **Cor de fundo personalizada** na fonte do navegador
2. Certifique-se de que o overlay não está dentro de um elemento opaco
3. Defina o **Modo de mesclagem** como **Normal** na fonte do OBS

:::tip Alternativa: Chroma key
Se a transparência não funcionar, use filtro → **Chroma Key** com fundo verde:
Adicione `&bg=green` na URL e aplique o filtro chroma key na fonte do OBS.
:::

## O que é exibido no overlay

O overlay padrão contém:

- **Barra de progresso** com valor percentual
- **Tempo restante** (estimado)
- **Temperatura do bico** e **temperatura da mesa**
- **Ranhura AMS ativa** com cor e nome do filamento
- **Modelo e nome da impressora** (pode ser desativado)

## Modo minimal para streaming

Para um overlay discreto durante a transmissão:

```
https://localhost:3443/obs-overlay?theme=minimal&fields=progress,time&scale=0.8&opacity=0.7
```

Exibe apenas uma pequena barra de progresso com tempo restante no canto.
