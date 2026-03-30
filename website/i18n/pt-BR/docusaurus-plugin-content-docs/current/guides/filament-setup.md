---
sidebar_position: 2
title: Configurar o estoque de filamentos
description: Como criar, configurar e acompanhar seus carretéis de filamento no Bambu Dashboard
---

# Configurar o estoque de filamentos

O estoque de filamentos no Bambu Dashboard te dá visão completa de todos os seus carretéis — o que resta, o que você usou e quais carretéis estão no AMS agora.

## Criação automática do AMS

Ao conectar uma impressora com AMS, o painel lê automaticamente as informações dos chips RFID nos carretéis Bambu:

- Tipo de filamento (PLA, PETG, ABS, TPU, etc.)
- Cor (com código hex)
- Marca (Bambu Lab)
- Peso do carretel e quantidade restante

**Esses carretéis são criados automaticamente no estoque** — você não precisa fazer nada. Veja-os em **Filamento → Estoque**.

:::info Apenas carretéis Bambu têm RFID
Carretéis de terceiros (ex.: eSUN, Polymaker, recargas Bambu sem chip) não são reconhecidos automaticamente. Esses devem ser adicionados manualmente.
:::

## Adicionando carretéis manualmente

Para carretéis sem RFID, ou para carretéis que não estão no AMS:

1. Vá em **Filamento → Estoque**
2. Clique em **+ Novo carretel** no canto superior direito
3. Preencha os campos:

| Campo | Exemplo | Obrigatório |
|-------|---------|-------------|
| Marca | eSUN, Polymaker, Bambu | Sim |
| Tipo | PLA, PETG, ABS, TPU | Sim |
| Cor | #FF5500 ou escolha no seletor de cores | Sim |
| Peso inicial | 1000 g | Recomendado |
| Restante | 850 g | Recomendado |
| Diâmetro | 1,75 mm | Sim |
| Nota | "Comprado em 2025-01, funciona bem" | Opcional |

4. Clique em **Salvar**

## Configurando cores e marcas

Você pode editar um carretel a qualquer momento clicando nele na visão geral do estoque:

- **Cor** — Escolha no seletor de cores ou digite o valor hex. A cor é usada como marcador visual na visão geral do AMS
- **Marca** — Exibida em estatísticas e filtragem. Crie marcas próprias em **Filamento → Marcas**
- **Perfil de temperatura** — Insira a temperatura recomendada de bico e mesa do fabricante do filamento. O painel pode então alertar se você escolher a temperatura errada

## Entendendo a sincronização AMS

O painel sincroniza o status do AMS em tempo real:

```
Slot AMS 1 → Carretel: Bambu PLA Branco  [███████░░░] 72% restante
Slot AMS 2 → Carretel: eSUN PETG Cinza   [████░░░░░░] 41% restante
Slot AMS 3 → (vazio)
Slot AMS 4 → Carretel: Bambu PLA Vermelho [██████████] 98% restante
```

A sincronização é atualizada:
- **Durante a impressão** — o consumo é descontado em tempo real
- **Ao final da impressão** — o consumo final é registrado no histórico
- **Manualmente** — clique no ícone de sincronização em um carretel para buscar dados atualizados do AMS

:::tip Corrigindo a estimativa do AMS
A estimativa do AMS via RFID nem sempre é 100% precisa após o primeiro uso. Pese o carretel e atualize o peso manualmente para melhor precisão.
:::

## Verificando consumo e quantidade restante

### Por carretel
Clique em um carretel no estoque para ver:
- Total usado (gramas, todas as impressões)
- Quantidade estimada restante
- Lista de todas as impressões que usaram este carretel

### Estatísticas consolidadas
Em **Análise → Análise de filamentos** você vê:
- Consumo por tipo de filamento ao longo do tempo
- Quais marcas você usa mais
- Custo estimado com base no preço de compra por kg

### Alertas de nível baixo
Configure alertas quando um carretel estiver chegando ao fim:

1. Vá em **Filamento → Configurações**
2. Ative **Notificar quando estoque estiver baixo**
3. Defina o limite (ex.: 100 g restantes)
4. Escolha o canal de notificação (Telegram, Discord, e-mail)

## Dica: Pese os carretéis para maior precisão

As estimativas do AMS e das estatísticas de impressão nunca são totalmente exatas. O método mais preciso é pesar o carretel:

**Como fazer:**

1. Encontre o peso de tara (carretel vazio) — geralmente 200–250 g, verifique o site do fabricante ou o fundo do carretel
2. Pese o carretel com filamento em uma balança de cozinha
3. Subtraia o peso de tara
4. Atualize **Restante** no perfil do carretel

**Exemplo:**
```
Peso medido:      743 g
Tara (vazio):   - 230 g
Filamento restante: 513 g
```

:::tip Gerador de etiquetas de carretel
Em **Ferramentas → Etiquetas** você pode imprimir etiquetas com QR code para seus carretéis. Escaneie o código com o celular para abrir rapidamente o perfil do carretel.
:::
