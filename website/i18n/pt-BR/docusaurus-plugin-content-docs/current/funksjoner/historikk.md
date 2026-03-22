---
sidebar_position: 3
title: Histórico de impressões
description: Registro completo de todas as impressões com estatísticas, rastreamento de filamento e exportação
---

# Histórico de impressões

O histórico de impressões fornece um registro completo de todas as impressões realizadas com o dashboard, incluindo estatísticas, consumo de filamento e links para as fontes dos modelos.

## Tabela de histórico

A tabela exibe todas as impressões com:

| Coluna | Descrição |
|--------|-----------|
| Data/hora | Hora de início |
| Nome do modelo | Nome do arquivo ou título no MakerWorld |
| Impressora | Qual impressora foi usada |
| Duração | Tempo total de impressão |
| Filamento | Material e gramas usados |
| Placas | Número de camadas e peso (g) |
| Status | Concluída, cancelada, com falha |
| Imagem | Miniatura (com integração cloud) |

## Busca e filtragem

Use o campo de busca e os filtros para encontrar impressões:

- Busca em texto livre pelo nome do modelo
- Filtre por impressora, material, status, data
- Ordene por qualquer coluna

## Links para a fonte do modelo

Se a impressão foi iniciada do MakerWorld, um link direto para a página do modelo é exibido. Clique no nome do modelo para abrir o MakerWorld em uma nova aba.

:::info Bambu Cloud
Links de modelos e miniaturas requerem integração com Bambu Cloud. Veja [Bambu Cloud](../kom-i-gang/bambu-cloud).
:::

## Rastreamento de filamento

Para cada impressão é registrado:

- **Material** — PLA, PETG, ABS, etc.
- **Gramas usados** — consumo estimado
- **Bobina** — qual bobina foi usada (se registrada no estoque)
- **Cor** — código hexadecimal da cor

Isso oferece uma imagem precisa do consumo de filamento ao longo do tempo e ajuda a planejar compras.

## Estatísticas

Em **Histórico → Estatísticas** você encontra dados agregados:

- **Total de impressões** — e taxa de sucesso
- **Tempo total de impressão** — horas e dias
- **Consumo de filamento** — gramas e km por material
- **Impressões por dia** — gráfico animado
- **Materiais mais usados** — gráfico de pizza
- **Distribuição de duração** — histograma

As estatísticas podem ser filtradas por período (7d, 30d, 90d, 1 ano, tudo).

## Exportação

### Exportação CSV
Exporte todo o histórico ou resultados filtrados:
**Histórico → Exportar → Baixar CSV**

Os arquivos CSV contêm todas as colunas e podem ser abertos no Excel, LibreOffice Calc ou importados em outras ferramentas.

### Backup automático
O histórico faz parte do banco de dados SQLite que é automaticamente copiado durante as atualizações. Backup manual em **Configurações → Backup**.

## Edição

Você pode editar entradas do registro de impressão posteriormente:

- Corrigir nomes de modelos
- Adicionar notas
- Corrigir consumo de filamento
- Excluir impressões registradas incorretamente

Clique com o botão direito em uma linha e selecione **Editar** ou clique no ícone de lápis.
