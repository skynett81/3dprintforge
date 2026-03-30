---
sidebar_position: 5
title: Controle da impressora
description: Controle temperatura, velocidade, ventiladores e envie G-code diretamente para a impressora
---

# Controle da impressora

O painel de controle oferece controle manual completo da impressora diretamente do dashboard.

## Controle de temperatura

### Bico
- Defina a temperatura alvo entre 0–350 °C
- Clique em **Definir** para enviar o comando
- Leitura em tempo real exibida com medidor de anel animado

### Mesa aquecida
- Defina a temperatura alvo entre 0–120 °C
- Desligamento automático após a impressão (configurável)

### Câmara
- Veja a temperatura da câmara (leitura em tempo real)
- **X1E, H2S, H2D, H2C**: Controle ativo de aquecimento da câmara via M141 (temperatura alvo controlável)
- **X1C**: Câmara passiva — a temperatura é exibida, mas não pode ser controlada diretamente
- **P1S**: Câmara passiva — exibe temperatura, sem controle ativo de aquecimento
- **P1P, A1, A1 mini e série H sem chamberHeat**: Sem sensor de câmara

:::warning Temperaturas máximas
Não exceda as temperaturas recomendadas para bico e mesa. Para bico de aço endurecido (tipo HF): máx. 300 °C. Para latão: máx. 260 °C. Consulte o manual da impressora.
:::

## Perfis de velocidade

O controle de velocidade oferece quatro perfis predefinidos:

| Perfil | Velocidade | Uso |
|--------|------------|-----|
| Silencioso | 50% | Redução de ruído, impressão noturna |
| Padrão | 100% | Uso normal |
| Sport | 124% | Impressões mais rápidas |
| Turbo | 166% | Velocidade máxima (queda de qualidade) |

O controle deslizante permite definir uma porcentagem personalizada entre 50–200%.

## Controle de ventiladores

Controle as velocidades dos ventiladores manualmente:

| Ventilador | Descrição | Faixa |
|------------|-----------|-------|
| Part cooling fan | Resfria o objeto impresso | 0–100% |
| Auxiliary fan | Circulação da câmara | 0–100% |
| Chamber fan | Resfriamento ativo da câmara | 0–100% |

:::tip Boas configurações
- **PLA/PETG:** Part cooling 100%, aux 30%
- **ABS/ASA:** Part cooling 0–20%, ventilador da câmara desligado
- **TPU:** Part cooling 50%, velocidade baixa
:::

## Console G-code

Envie comandos G-code diretamente para a impressora:

```gcode
; Exemplo: Mover posição do cabeçote
G28 ; Home em todos os eixos
G1 X150 Y150 Z10 F3000 ; Mover para o centro
M104 S220 ; Definir temperatura do bico
M140 S60  ; Definir temperatura da mesa
```

:::danger Cuidado com G-code
G-code incorreto pode danificar a impressora. Envie apenas comandos que você compreende. Evite `M600` (troca de filamento) no meio de uma impressão.
:::

## Operações de filamento

No painel de controle você pode:

- **Carregar filamento** — aquece o bico e puxa o filamento para dentro
- **Descarregar filamento** — aquece e puxa o filamento para fora
- **Purgar bico** — executa ciclo de purga

## Macros

Salve e execute sequências de comandos G-code como macros:

1. Clique em **Nova macro**
2. Dê um nome à macro
3. Escreva a sequência G-code
4. Salve e execute com um clique

Exemplo de macro para calibração da mesa:
```gcode
G28
M84
M500
```

## Controle de impressão

Durante uma impressão ativa você pode:

- **Pausar** — coloca a impressão em pausa após a camada atual
- **Retomar** — continua uma impressão pausada
- **Parar** — cancela a impressão (irreversível)
- **Parada de emergência** — parada imediata de todos os motores
