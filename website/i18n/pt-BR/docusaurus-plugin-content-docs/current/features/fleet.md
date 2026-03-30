---
sidebar_position: 3
title: Visão geral da frota
description: Gerencie e monitore todas as impressoras Bambu Lab em uma grade com ordenação, filtragem e status em tempo real
---

# Visão geral da frota

A visão geral da frota oferece uma visão compacta de todas as impressoras conectadas em uma única página. Perfeita para oficinas, salas de aula ou qualquer pessoa que tenha mais de uma impressora.

Acesse em: **https://localhost:3443/#fleet**

## Grade de múltiplas impressoras

Todas as impressoras registradas são exibidas em uma grade responsiva:

- **Tamanho do cartão** — Pequeno (compacto), Médio (padrão), Grande (detalhado)
- **Número de colunas** — Ajustado automaticamente conforme a largura da tela, ou definido manualmente
- **Atualização** — Cada cartão é atualizado independentemente via MQTT

Cada cartão de impressora exibe:
| Campo | Descrição |
|-------|-----------|
| Nome da impressora | Nome configurado com ícone do modelo |
| Status | Livre / Imprimindo / Pausa / Erro / Desconectada |
| Progresso | Barra percentual com tempo restante |
| Temperatura | Bico e mesa (compacto) |
| Filamento ativo | Cor e material do AMS |
| Miniatura da câmera | Imagem estática atualizada a cada 30 segundos |

## Indicador de status por impressora

As cores de status facilitam ver o estado à distância:

- **Verde pulsante** — Imprimindo ativamente
- **Azul** — Livre e pronta
- **Amarelo** — Pausada (manualmente ou pelo Print Guard)
- **Vermelho** — Erro detectado
- **Cinza** — Desconectada ou indisponível

:::tip Modo quiosque
Use a visão geral da frota no modo quiosque em uma tela montada na parede. Veja [Modo quiosque](../system/kiosk) para configuração.
:::

## Ordenação

Clique em **Ordenar** para escolher a ordem:

1. **Nome** — Alfabética A–Z
2. **Status** — Impressoras ativas primeiro
3. **Progresso** — Mais próximo de concluir primeiro
4. **Último ativo** — Usado mais recentemente primeiro
5. **Modelo** — Agrupado por modelo de impressora

A ordenação é lembrada até a próxima visita.

## Filtragem

Use o campo de filtro no topo para limitar a visualização:

- Digite o nome da impressora ou parte dele
- Selecione **Status** na lista suspensa (Todas / Imprimindo / Livre / Erro)
- Selecione **Modelo** para exibir apenas um tipo de impressora (X1C, P1S, A1, etc.)
- Clique em **Limpar filtro** para mostrar todas

:::info Busca
A busca filtra em tempo real sem recarregar a página.
:::

## Ações da visão geral da frota

Clique com o botão direito em um cartão (ou clique nos três pontos) para ações rápidas:

- **Abrir dashboard** — Ir diretamente para o painel principal da impressora
- **Pausar impressão** — Coloca a impressora em pausa
- **Parar impressão** — Cancela a impressão em andamento (requer confirmação)
- **Ver câmera** — Abre a visualização da câmera em popup
- **Ir para configurações** — Abre as configurações da impressora

:::danger Parar impressão
Parar uma impressão não é reversível. Sempre confirme na caixa de diálogo exibida.
:::

## Estatísticas agregadas

No topo da visão geral da frota é exibida uma linha de resumo:

- Total de impressoras
- Número de impressões ativas
- Consumo total de filamento hoje
- Tempo estimado de conclusão da impressão mais longa em andamento
