---
sidebar_position: 1
title: Sua primeira impressão
description: Guia passo a passo para iniciar sua primeira impressão 3D e monitorá-la no 3DPrintForge
---

# Sua primeira impressão

Este guia vai te acompanhar por todo o processo — desde uma impressora conectada até uma impressão finalizada — com o 3DPrintForge como centro de controle.

## Passo 1 — Verifique se a impressora está conectada

Ao abrir o painel, você verá o cartão de status da impressora no topo da barra lateral ou no painel de visão geral.

**Status verde** significa que a impressora está online e pronta.

| Status | Cor | Significado |
|--------|-----|-------------|
| Online | Verde | Pronta para imprimir |
| Inativa | Cinza | Conectada, mas não ativa |
| Imprimindo | Azul | Impressão em andamento |
| Erro | Vermelho | Requer atenção |

Se a impressora mostrar status vermelho:
1. Verifique se a impressora está ligada
2. Confirme que está conectada à mesma rede que o painel
3. Vá em **Configurações → Impressoras** e confirme o endereço IP e código de acesso

:::tip Use o modo LAN para resposta mais rápida
O modo LAN oferece menor latência do que o modo nuvem. Ative-o nas configurações da impressora se a impressora e o painel estiverem na mesma rede.
:::

## Passo 2 — Envie seu modelo

O 3DPrintForge não inicia impressões diretamente — isso é tarefa do Bambu Studio ou MakerWorld. O painel assume assim que a impressão começa.

**Via Bambu Studio:**
1. Abra o Bambu Studio no seu computador
2. Importe ou abra seu arquivo `.stl` ou `.3mf`
3. Fatie o modelo (escolha filamento, suportes, preenchimento, etc.)
4. Clique em **Imprimir** no canto superior direito

**Via MakerWorld:**
1. Encontre o modelo em [makerworld.com](https://makerworld.com)
2. Clique em **Imprimir** diretamente no site
3. O Bambu Studio abre automaticamente com o modelo pronto

## Passo 3 — Inicie a impressão

No Bambu Studio, escolha o método de envio:

| Método | Requisitos | Vantagens |
|--------|-----------|-----------|
| **Nuvem** | Conta Bambu + internet | Funciona em qualquer lugar |
| **LAN** | Mesma rede | Mais rápido, sem nuvem |
| **Cartão SD** | Acesso físico | Sem requisitos de rede |

Clique em **Enviar** — a impressora recebe o trabalho e inicia automaticamente a fase de aquecimento.

:::info A impressão aparece no painel
Alguns segundos após o Bambu Studio enviar o trabalho, a impressão ativa aparece no painel em **Impressão ativa**.
:::

## Passo 4 — Monitorar no painel

Enquanto a impressão está em andamento, o painel te dá visão completa:

### Progresso
- Porcentagem concluída e tempo estimado restante são exibidos no cartão da impressora
- Clique no cartão para ver a visualização detalhada com informações de camadas

### Temperaturas
O painel de detalhes mostra temperaturas em tempo real:
- **Bico** — temperatura atual e alvo
- **Mesa** — temperatura atual e alvo
- **Câmara** — temperatura do ar dentro da impressora (importante para ABS/ASA)

### Câmera
Clique no ícone de câmera no cartão da impressora para ver o feed ao vivo diretamente no painel. Você pode deixar a câmera aberta em uma janela separada enquanto faz outras coisas.

:::warning Verifique as primeiras camadas
As primeiras 3–5 camadas são críticas. Má aderência agora significa uma impressão fracassada depois. Observe a câmera e verifique se o filamento está sendo depositado de forma limpa e uniforme.
:::

### Print Guard
O 3DPrintForge tem um **Print Guard** movido por IA que detecta automaticamente falhas de espaguete e pode pausar a impressão. Ative em **Monitoramento → Print Guard**.

## Passo 5 — Após a impressão

Quando a impressão terminar, o painel exibe uma mensagem de conclusão (e envia uma notificação se você configurou [notificações](./notification-setup)).

### Verifique o histórico
Vá em **Histórico** na barra lateral para ver a impressão concluída:
- Tempo total de impressão
- Consumo de filamento (gramas usadas, custo estimado)
- Erros ou eventos HMS durante a impressão
- Foto da câmera no encerramento (se habilitado)

### Adicione uma nota
Clique na impressão no histórico e adicione uma nota — ex.: "Precisava de um pouco mais de brim" ou "Resultado perfeito". Útil quando você imprimir o mesmo modelo novamente.

### Verifique o consumo de filamento
Em **Filamento** você pode ver que o peso do carretel foi atualizado com base no que foi usado. O painel desconta automaticamente.

## Dicas para iniciantes

:::tip Não deixe a primeira impressão sozinha
Fique de olho nos primeiros 10–15 minutos. Quando tiver certeza de que a impressão está bem aderida, pode deixar o painel monitorar o restante.
:::

- **Pese os carretéis vazios** — insira o peso inicial dos carretéis para cálculo preciso do restante (veja [Gerenciamento de filamento](./filament-setup))
- **Configure notificações do Telegram** — receba uma mensagem quando a impressão terminar sem precisar ficar esperando (veja [Notificações](./notification-setup))
- **Verifique a mesa** — mesa limpa = melhor aderência. Limpe com IPA (isopropanol) entre impressões
- **Use a placa certa** — veja [Escolhendo a placa certa](./choosing-plate) para o que combina com o seu filamento
