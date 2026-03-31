---
sidebar_position: 2
title: Estoque de filamentos
description: Gerencie bobinas de filamento, sincronização AMS, secagem e muito mais
---

# Estoque de filamentos

O estoque de filamentos oferece uma visão completa de todas as bobinas de filamento, integrado ao AMS e ao histórico de impressões.

## Visão geral

O estoque exibe todas as bobinas registradas com:

- **Cor** — cartela de cores visual
- **Material** — PLA, PETG, ABS, TPU, PA, etc.
- **Fabricante** — Bambu Lab, Polymaker, eSUN, etc.
- **Peso** — gramas restantes (estimado ou pesado)
- **Ranhura AMS** — qual ranhura a bobina está ocupando
- **Status** — ativa, vazia, secando, armazenada

## Adicionar bobinas

1. Clique em **+ Nova bobina**
2. Preencha material, cor, fabricante e peso
3. Escaneie a etiqueta NFC se disponível, ou insira manualmente
4. Salve

:::tip Bobinas Bambu Lab
As bobinas oficiais da Bambu Lab podem ser importadas automaticamente via integração Bambu Cloud. Veja [Bambu Cloud](../getting-started/bambu-cloud).
:::

## Sincronização AMS

Quando o dashboard está conectado à impressora, o status do AMS é sincronizado automaticamente:

- As ranhuras são exibidas com a cor e material corretos do AMS
- O consumo é atualizado após cada impressão
- Bobinas vazias são marcadas automaticamente

Para vincular uma bobina local a uma ranhura AMS:
1. Vá em **Filamento → AMS**
2. Clique na ranhura que deseja vincular
3. Selecione a bobina do estoque

## Secagem

Registre ciclos de secagem para rastrear a exposição à umidade:

| Campo | Descrição |
|-------|-----------|
| Data de secagem | Quando a bobina foi seca |
| Temperatura | Temperatura de secagem (°C) |
| Duração | Número de horas |
| Método | Forno, caixa de secagem, secador de filamento |

:::info Temperaturas de secagem recomendadas
Veja a [Base de conhecimento](../kb/intro) para tempos e temperaturas de secagem específicos por material.
:::

## Cartela de cores

A visualização de cartela de cores organiza as bobinas visualmente por cor. Útil para encontrar a cor certa rapidamente. Filtre por material, fabricante ou status.

## Etiquetas NFC

O 3DPrintForge suporta etiquetas NFC para identificação rápida de bobinas:

1. Grave o ID da etiqueta NFC na bobina no estoque
2. Escaneie a etiqueta com o celular
3. A bobina abre diretamente no dashboard

## Importação e exportação

### Exportação
Exporte todo o estoque como CSV: **Filamento → Exportar → CSV**

### Importação
Importe bobinas de CSV: **Filamento → Importar → Selecionar arquivo**

Formato CSV:
```
nome,material,cor_hex,fabricante,peso_gramas,nfc_id
PLA Branco,PLA,#FFFFFF,Bambu Lab,1000,
PETG Preto,PETG,#000000,Polymaker,850,ABC123
```

## Estatísticas

Em **Filamento → Estatísticas** você encontra:

- Consumo total por material (últimos 30/90/365 dias)
- Consumo por impressora
- Vida útil estimada restante por bobina
- Cores e fabricantes mais usados
