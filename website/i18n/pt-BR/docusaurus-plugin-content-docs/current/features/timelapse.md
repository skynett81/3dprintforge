---
sidebar_position: 7
title: Timelapse
description: Ative a gravação automática de timelapse de impressões 3D, gerencie vídeos e reproduza-os diretamente no dashboard
---

# Timelapse

O Bambu Dashboard pode tirar fotos automaticamente durante a impressão e combiná-las em um vídeo timelapse. Os vídeos são salvos localmente e podem ser reproduzidos diretamente no dashboard.

Acesse em: **https://localhost:3443/#timelapse**

## Ativação

1. Vá em **Configurações → Timelapse**
2. Ative **Ativar gravação de timelapse**
3. Selecione o **Modo de gravação**:
   - **Por camada** — uma imagem por camada (recomendado para alta qualidade)
   - **Baseado em tempo** — uma imagem a cada N segundos (ex.: a cada 30 segundos)
4. Selecione quais impressoras devem ter o timelapse ativado
5. Clique em **Salvar**

:::tip Intervalo de imagens
"Por camada" produz a animação mais suave porque o movimento é consistente. "Baseado em tempo" usa menos espaço de armazenamento.
:::

## Configurações de gravação

| Configuração | Valor padrão | Descrição |
|-------------|-------------|-----------|
| Resolução | 1280×720 | Tamanho da imagem (640×480 / 1280×720 / 1920×1080) |
| Qualidade da imagem | 85% | Qualidade de compressão JPEG |
| FPS no vídeo | 30 | Quadros por segundo no vídeo final |
| Formato de vídeo | MP4 (H.264) | Formato de saída |
| Girar imagem | Desligado | Girar 90°/180°/270° para orientação de montagem |

:::warning Espaço de armazenamento
Um timelapse com 500 imagens em 1080p usa aproximadamente 200–400 MB antes da compilação. O vídeo MP4 final é tipicamente 20–80 MB.
:::

## Armazenamento

As imagens e vídeos do timelapse são salvos em `data/timelapse/` na pasta do projeto. A estrutura é organizada por impressora e impressão:

```
data/timelapse/
├── <printer-id>/                     ← ID único da impressora
│   ├── 2026-03-22_nome-do-modelo/    ← Sessão de impressão (data_nome)
│   │   ├── frame_0001.jpg
│   │   ├── frame_0002.jpg
│   │   ├── frame_0003.jpg
│   │   └── ...                       ← Imagens brutas (excluídas após compilação)
│   ├── 2026-03-22_nome-do-modelo.mp4 ← Vídeo timelapse final
│   ├── 2026-03-20_3dbenchy.mp4
│   └── 2026-03-15_suporte-celular.mp4
├── <printer-id-2>/                   ← Várias impressoras (multi-impressora)
│   └── ...
```

:::tip Armazenamento externo
Para economizar espaço no disco do sistema, você pode criar um link simbólico da pasta timelapse para um disco externo:
```bash
# Exemplo: mover para um disco externo montado em /mnt/storage
mv data/timelapse /mnt/storage/timelapse

# Criar link simbólico de volta
ln -s /mnt/storage/timelapse data/timelapse
```
O dashboard segue o link simbólico automaticamente. Você pode usar qualquer disco ou compartilhamento de rede.
:::

## Compilação automática

Quando a impressão termina, as imagens são automaticamente compiladas em um vídeo com ffmpeg:

1. O Bambu Dashboard recebe o evento "print complete" do MQTT
2. O ffmpeg é chamado com as imagens coletadas
3. O vídeo é salvo na pasta de armazenamento
4. A página de timelapse é atualizada com o novo vídeo

Você pode ver o progresso na aba **Timelapse → Processando**.

## Reprodução

1. Acesse **https://localhost:3443/#timelapse**
2. Selecione uma impressora na lista suspensa
3. Clique em um vídeo na lista para reproduzi-lo
4. Use os controles de reprodução:
   - ▶ / ⏸ — Reproduzir / Pausar
   - ⏪ / ⏩ — Retroceder / Avançar
   - Botões de velocidade: 0,5× / 1× / 2× / 4×
5. Clique em **Tela cheia** para abrir em tela cheia
6. Clique em **Baixar** para baixar o arquivo MP4

## Excluir timelapse

1. Selecione o vídeo na lista
2. Clique em **Excluir** (ícone de lixeira)
3. Confirme na caixa de diálogo

:::danger Exclusão permanente
Vídeos e imagens brutas de timelapse excluídos não podem ser recuperados. Baixe o vídeo primeiro se quiser mantê-lo.
:::

## Compartilhar timelapse

Vídeos de timelapse podem ser compartilhados via link com tempo limitado:

1. Selecione o vídeo e clique em **Compartilhar**
2. Defina o tempo de expiração (1 hora / 24 horas / 7 dias / sem expiração)
3. Copie o link gerado e compartilhe
4. O destinatário não precisa fazer login para ver o vídeo
