---
sidebar_position: 3
title: Perfis de impressão
description: Crie, edite e gerencie perfis de impressão com configurações predefinidas para impressão rápida e consistente
---

# Perfis de impressão

Os perfis de impressão são conjuntos salvos de configurações de impressão que você pode reutilizar em diferentes impressões e impressoras. Economize tempo e garanta qualidade consistente definindo perfis para diferentes finalidades.

Acesse em: **https://localhost:3443/#profiles**

## Criar um perfil

1. Vá em **Ferramentas → Perfis de impressão**
2. Clique em **Novo perfil** (ícone +)
3. Preencha:
   - **Nome do perfil** — nome descritivo, ex.: «PLA - Produção rápida»
   - **Material** — selecione na lista (PLA / PETG / ABS / PA / PC / TPU / etc.)
   - **Modelo da impressora** — X1C / X1C Combo / X1E / P1S / P1S Combo / P1P / P2S / P2S Combo / A1 / A1 Combo / A1 mini / H2S / H2D / H2C / Todos
   - **Descrição** — texto opcional

4. Preencha as configurações (veja seções abaixo)
5. Clique em **Salvar perfil**

## Configurações de um perfil

### Temperatura
| Campo | Exemplo |
|---|---|
| Temperatura do bico | 220°C |
| Temperatura da mesa | 60°C |
| Temperatura da câmara (X1C) | 35°C |

### Velocidade
| Campo | Exemplo |
|---|---|
| Configuração de velocidade | Padrão |
| Velocidade máxima (mm/s) | 200 |
| Aceleração | 5000 mm/s² |

### Qualidade
| Campo | Exemplo |
|---|---|
| Espessura de camada | 0,2 mm |
| Porcentagem de preenchimento | 15% |
| Padrão de preenchimento | Grid |
| Material de suporte | Auto |

### AMS e cores
| Campo | Descrição |
|---|---|
| Volume de purga | Quantidade de purga na troca de cor |
| Slots preferidos | Quais slots AMS são preferidos |

### Avançado
| Campo | Descrição |
|---|---|
| Modo de secagem | Ativar secagem AMS para materiais úmidos |
| Tempo de resfriamento | Pausa entre camadas para resfriamento |
| Velocidade do ventilador | Velocidade do ventilador de resfriamento em porcentagem |

## Editar um perfil

1. Clique no perfil na lista
2. Clique em **Editar** (ícone de lápis)
3. Faça as alterações
4. Clique em **Salvar** (sobrescrever) ou **Salvar como novo** (cria uma cópia)

:::tip Versionamento
Use «Salvar como novo» para manter um perfil funcional enquanto experimenta alterações.
:::

## Usar um perfil

### Da biblioteca de arquivos

1. Selecione o arquivo na biblioteca
2. Clique em **Enviar para impressora**
3. Selecione o **Perfil** na lista suspensa
4. As configurações do perfil são aplicadas

### Da fila de impressão

1. Crie um novo trabalho na fila
2. Selecione o **Perfil** nas configurações
3. O perfil é vinculado ao trabalho na fila

## Importar e exportar perfis

### Exportação
1. Selecione um ou mais perfis
2. Clique em **Exportar**
3. Selecione o formato: **JSON** (para importar em outros dashboards) ou **PDF** (para impressão/documentação)

### Importação
1. Clique em **Importar perfis**
2. Selecione um arquivo `.json` exportado de outro 3DPrintForge
3. Perfis existentes com o mesmo nome podem ser sobrescritos ou ambos mantidos

## Compartilhar perfis

Compartilhe perfis com outros via o módulo de filamentos da comunidade (veja [Filamentos da comunidade](../integrations/community)) ou via exportação direta de JSON.

## Perfil padrão

Defina um perfil padrão por material:

1. Selecione o perfil
2. Clique em **Definir como padrão para [material]**
3. O perfil padrão é selecionado automaticamente quando você envia um arquivo com esse material
