---
sidebar_position: 1
title: Etiquetas
description: Gere QR codes, etiquetas de bobina para impressoras térmicas (ZPL), cartões de cores e paletas de cores compartilhadas para o estoque de filamentos
---

# Etiquetas

A ferramenta de etiquetas gera etiquetas profissionais para suas bobinas de filamento — QR codes, etiquetas de bobina para impressoras térmicas e cartões de cores para identificação visual.

Acesse em: **https://localhost:3443/#labels**

## QR Codes

Gere QR codes que apontam para as informações do filamento no dashboard:

1. Vá em **Etiquetas → QR Codes**
2. Selecione a bobina para a qual deseja gerar o QR code
3. O QR code é gerado automaticamente e exibido na pré-visualização
4. Clique em **Baixar PNG** ou **Imprimir**

O QR code contém uma URL para o perfil do filamento no dashboard. Escaneie com o celular para acessar rapidamente as informações da bobina.

### Geração em lote

1. Clique em **Selecionar todos** ou marque bobinas individuais
2. Clique em **Gerar todos os QR codes**
3. Baixe como ZIP com um PNG por bobina, ou imprima todos de uma vez

## Etiquetas de bobina

Etiquetas profissionais para impressoras térmicas com informações completas da bobina:

### Conteúdo da etiqueta (padrão)

- Cor da bobina (bloco de cor preenchido)
- Nome do material (letra grande)
- Fabricante
- Código hexadecimal da cor
- Recomendações de temperatura (bico e mesa)
- QR code
- Código de barras (opcional)

### ZPL para impressoras térmicas

Gere código ZPL (Zebra Programming Language) para impressoras Zebra, Brother e Dymo:

1. Vá em **Etiquetas → Impressão térmica**
2. Selecione o tamanho da etiqueta: **25×54 mm** / **36×89 mm** / **62×100 mm**
3. Selecione a(s) bobina(s)
4. Clique em **Gerar ZPL**
5. Envie o código ZPL para a impressora via:
   - **Imprimir diretamente** (conexão USB)
   - **Copiar ZPL** e enviar via comando de terminal
   - **Baixar arquivo .zpl**

:::tip Configuração da impressora
Para impressão automática, configure a impressora em **Configurações → Impressora de etiquetas** com endereço IP e porta (padrão: 9100 para TCP RAW).
:::

### Etiquetas em PDF

Para impressoras comuns, gere PDF com as dimensões corretas:

1. Selecione o tamanho da etiqueta no modelo
2. Clique em **Gerar PDF**
3. Imprima em papel adesivo (Avery ou equivalente)

## Cartões de cores

Os cartões de cores são uma grade compacta que exibe todas as bobinas visualmente:

1. Vá em **Etiquetas → Cartão de cores**
2. Selecione quais bobinas incluir (todas ativas, ou selecione manualmente)
3. Selecione o formato do cartão: **A4** (4×8), **A3** (6×10), **Letter**
4. Clique em **Gerar PDF**

Cada campo exibe:
- Bloco de cor com a cor real
- Nome do material e código hexadecimal
- Número do material (para referência rápida)

Ideal para plastificar e pendurar na estação de impressoras.

## Paletas de cores compartilhadas

Exporte uma seleção de cores como paleta compartilhada:

1. Vá em **Etiquetas → Paletas de cores**
2. Selecione as bobinas a incluir na paleta
3. Clique em **Compartilhar paleta**
4. Copie o link — outros podem importar a paleta para seu dashboard
5. A paleta é exibida com códigos hexadecimais e pode ser exportada para **Adobe Swatch** (`.ase`) ou **Procreate** (`.swatches`)
