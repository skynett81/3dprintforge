---
sidebar_position: 6
title: Bed Mesh
description: Visualização 3D da calibração de nivelamento da mesa com heatmap, varredura pela interface e guia de calibração
---

# Bed Mesh

A ferramenta Bed Mesh fornece uma representação visual do nivelamento da mesa de impressão — essencial para boa aderência e uma primeira camada uniforme.

Acesse em: **https://localhost:3443/#bedmesh**

## O que é bed mesh?

As impressoras Bambu Lab escaneiam a superfície da mesa com uma sonda e criam um mapa (mesh) das variações de altura. O firmware da impressora compensa automaticamente as variações durante a impressão. O Bambu Dashboard visualiza esse mapa para você.

## Visualização

### Superfície 3D

O mapa bed mesh é exibido como uma superfície 3D interativa:

- Use o mouse para girar a visualização
- Role para ampliar/reduzir
- Clique em **Vista superior** para visão de cima
- Clique em **Vista lateral** para ver o perfil

A escala de cores mostra o desvio em relação à altura média:
- **Azul** — abaixo do centro (côncavo)
- **Verde** — aproximadamente plano (< 0,1 mm de desvio)
- **Amarelo** — desvio moderado (0,1–0,2 mm)
- **Vermelho** — desvio elevado (> 0,2 mm)

### Heatmap

Clique em **Heatmap** para uma visualização 2D plana do mapa mesh — mais fácil de ler para a maioria das pessoas.

O heatmap exibe:
- Valores exatos de desvio (mm) para cada ponto de medição
- Pontos problemáticos marcados (desvio > 0,3 mm)
- Dimensões das medições (número de linhas × colunas)

## Escanear bed mesh pela interface

:::warning Requisito
O escaneamento requer que a impressora esteja ociosa e a temperatura da mesa esteja estabilizada. Aqueça a mesa até a temperatura desejada ANTES do escaneamento.
:::

1. Vá em **Bed Mesh**
2. Selecione a impressora na lista suspensa
3. Clique em **Escanear agora**
4. Selecione a temperatura da mesa para o escaneamento:
   - **Fria** (temperatura ambiente) — rápido, mas menos preciso
   - **Quente** (50–60°C PLA, 70–90°C PETG) — recomendado
5. Confirme no diálogo — a impressora inicia automaticamente a sequência de sondagem
6. Aguarde o escaneamento terminar (3–8 minutos dependendo do tamanho do mesh)
7. O novo mapa mesh é exibido automaticamente

## Guia de calibração

Após o escaneamento, o sistema fornece recomendações concretas:

| Resultado | Recomendação |
|---|---|
| Desvio < 0,1 mm em todos os pontos | Excelente — nenhuma ação necessária |
| Desvio 0,1–0,2 mm | Bom — compensação tratada pelo firmware |
| Desvio > 0,2 mm nos cantos | Ajuste as molas da mesa manualmente (se possível) |
| Desvio > 0,3 mm | A mesa pode estar danificada ou mal montada |
| Centro mais alto que os cantos | Expansão térmica — normal para mesas aquecidas |

:::tip Comparação histórica
Clique em **Comparar com anterior** para ver se o mapa mesh mudou ao longo do tempo — útil para detectar que a chapa está se curvando gradualmente.
:::

## Histórico de mesh

Todos os escaneamentos mesh são armazenados com timestamp:

1. Clique em **Histórico** no painel lateral do bed mesh
2. Selecione dois escaneamentos para compará-los (mapa de diferença é exibido)
3. Exclua escaneamentos antigos que não são mais necessários

## Exportação

Exporte os dados mesh como:
- **PNG** — imagem do heatmap (para documentação)
- **CSV** — dados brutos com X, Y e desvio de altura por ponto
