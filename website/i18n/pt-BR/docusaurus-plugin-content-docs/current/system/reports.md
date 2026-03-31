---
sidebar_position: 7
title: Relatórios
description: Relatórios automáticos semanais e mensais por e-mail com estatísticas, resumo de atividades e lembretes de manutenção
---

# Relatórios

O 3DPrintForge pode enviar relatórios automáticos por e-mail com estatísticas e resumo de atividades — semanal, mensal ou ambos.

Acesse em: **https://localhost:3443/#settings** → **Sistema → Relatórios**

## Pré-requisitos

Os relatórios requerem que os alertas por e-mail estejam configurados. Configure o SMTP em **Configurações → Alertas → E-mail** antes de ativar os relatórios. Veja [Alertas](../features/notifications).

## Ativar relatórios automáticos

1. Vá em **Configurações → Relatórios**
2. Ative **Relatório semanal** e/ou **Relatório mensal**
3. Selecione o **Horário de envio**:
   - Semanal: dia da semana e horário
   - Mensal: dia do mês (ex.: 1ª segunda-feira / última sexta-feira)
4. Preencha o **E-mail do destinatário** (separado por vírgula para vários)
5. Clique em **Salvar**

Envie um relatório de teste para ver a formatação: clique em **Enviar relatório de teste agora**.

## Conteúdo do relatório semanal

O relatório semanal cobre os últimos 7 dias:

### Resumo
- Total de impressões
- Número de bem-sucedidas / com falha / canceladas
- Taxa de sucesso e variação em relação à semana anterior
- Impressora mais ativa

### Atividade
- Impressões por dia (minigráfico)
- Total de horas de impressão
- Consumo total de filamento (gramas e custo)

### Filamento
- Consumo por material e fabricante
- Estimativa restante por bobina (bobinas abaixo de 20% destacadas)

### Manutenção
- Tarefas de manutenção realizadas nesta semana
- Tarefas de manutenção atrasadas (aviso vermelho)
- Tarefas com vencimento na próxima semana

### Erros HMS
- Número de erros HMS nesta semana por impressora
- Erros não reconhecidos (requerem atenção)

## Conteúdo do relatório mensal

O relatório mensal cobre os últimos 30 dias e contém tudo do relatório semanal, além de:

### Tendência
- Comparação com o mês anterior (%)
- Mapa de atividade (miniatura do heatmap para o mês)
- Evolução da taxa de sucesso mensal

### Custos
- Custo total de filamento
- Custo total de energia (se a medição de energia estiver configurada)
- Custo total de desgaste
- Custo total de manutenção

### Desgaste e saúde
- Pontuação de saúde por impressora (com variação em relação ao mês anterior)
- Componentes que estão se aproximando do prazo de substituição

### Destaques das estatísticas
- Impressão bem-sucedida mais longa
- Tipo de filamento mais usado
- Impressora com maior atividade

## Personalizar o relatório

1. Vá em **Configurações → Relatórios → Personalização**
2. Marque/desmarque as seções que deseja incluir
3. Selecione o **Filtro de impressora**: todas as impressoras ou uma seleção
4. Selecione **Exibição de logotipo**: mostrar o logotipo do 3DPrintForge no cabeçalho ou desativar
5. Clique em **Salvar**

## Arquivo de relatórios

Todos os relatórios enviados são armazenados e podem ser reabertos:

1. Vá em **Configurações → Relatórios → Arquivo**
2. Selecione o relatório na lista (ordenado por data)
3. Clique em **Abrir** para ver a versão HTML
4. Clique em **Baixar PDF** para baixar o relatório

Os relatórios são excluídos automaticamente após **90 dias** (configurável).
