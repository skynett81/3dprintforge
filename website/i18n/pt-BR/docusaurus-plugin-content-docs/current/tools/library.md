---
sidebar_position: 2
title: Biblioteca de arquivos
description: Carregue e gerencie modelos 3D e arquivos G-code, analise G-code e conecte ao MakerWorld e Printables
---

# Biblioteca de arquivos

A biblioteca de arquivos é um local centralizado para armazenar e gerenciar todos os seus modelos 3D e arquivos G-code — com análise automática de G-code e integração com MakerWorld e Printables.

Acesse em: **https://localhost:3443/#library**

## Carregar modelos

### Upload único

1. Vá em **Biblioteca de arquivos**
2. Clique em **Carregar** ou arraste arquivos para a área de upload
3. Formatos suportados: `.3mf`, `.gcode`, `.bgcode`, `.stl`, `.obj`
4. O arquivo é analisado automaticamente após o upload

:::info Pasta de armazenamento
Os arquivos são armazenados na pasta configurada em **Configurações → Biblioteca de arquivos → Pasta de armazenamento**. Padrão: `./data/library/`
:::

### Upload em lote

Arraste e solte uma pasta inteira para carregar todos os arquivos suportados de uma vez. Os arquivos são processados em segundo plano e você é notificado quando tudo estiver pronto.

## Análise de G-code

Após o upload, arquivos `.gcode` e `.bgcode` são analisados automaticamente:

| Métrica | Descrição |
|---|---|
| Tempo estimado de impressão | Tempo calculado a partir dos comandos G-code |
| Consumo de filamento | Gramas e metros por material/cor |
| Contador de camadas | Número total de camadas |
| Espessura de camada | Espessura de camada registrada |
| Materiais | Materiais detectados (PLA, PETG, etc.) |
| Porcentagem de preenchimento | Se disponível nos metadados |
| Material de suporte | Peso estimado de suporte |
| Modelo da impressora | Impressora alvo dos metadados |

Os dados de análise são exibidos no cartão do arquivo e utilizados pela [Calculadora de custos](../analytics/costestimator).

## Cartões de arquivo e metadados

Cada cartão de arquivo exibe:
- **Nome do arquivo** e formato
- **Data de upload**
- **Miniatura** (do `.3mf` ou gerada)
- **Tempo de impressão analisado** e consumo de filamento
- **Tags** e categoria
- **Impressões associadas** — número de vezes impresso

Clique em um cartão para abrir a visualização detalhada com metadados completos e histórico.

## Organização

### Tags

Adicione tags para pesquisa fácil:
1. Clique no arquivo → **Editar metadados**
2. Digite as tags (separadas por vírgula): `benchy, teste, PLA, calibração`
3. Pesquise na biblioteca com filtro de tags

### Categorias

Organize arquivos em categorias:
- Clique em **Nova categoria** na barra lateral
- Arraste arquivos para a categoria
- As categorias podem ser aninhadas (subcategorias são suportadas)

## Conexão com MakerWorld

1. Vá em **Configurações → Integrações → MakerWorld**
2. Faça login com sua conta Bambu Lab
3. De volta à biblioteca: clique em um arquivo → **Conectar ao MakerWorld**
4. Pesquise o modelo no MakerWorld e selecione a correspondência correta
5. Os metadados (designer, licenciamento, avaliação) são importados do MakerWorld

A conexão exibe o nome do designer e a URL original no cartão do arquivo.

## Conexão com Printables

1. Vá em **Configurações → Integrações → Printables**
2. Cole sua chave de API do Printables
3. Conecte arquivos a modelos do Printables da mesma forma que o MakerWorld

## Enviar para a impressora

Da biblioteca de arquivos você pode enviar diretamente para a impressora:

1. Clique no arquivo → **Enviar para impressora**
2. Selecione a impressora alvo
3. Selecione o slot AMS (para impressões multicolor)
4. Clique em **Iniciar impressão** ou **Adicionar à fila**

:::warning Envio direto
O envio direto inicia a impressão imediatamente sem confirmação no Bambu Studio. Certifique-se de que a impressora está pronta.
:::
