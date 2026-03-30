---
sidebar_position: 3
title: Integração com Bambu Cloud
description: Conecte o dashboard ao Bambu Lab Cloud para sincronização de modelos e histórico de impressões
---

# Integração com Bambu Cloud

O Bambu Dashboard pode se conectar à **Bambu Lab Cloud** para buscar imagens de modelos, histórico de impressões e dados de filamento. O dashboard funciona perfeitamente sem conexão com a nuvem, mas a integração oferece vantagens adicionais.

## Benefícios da integração com a nuvem

| Função | Sem nuvem | Com nuvem |
|--------|-----------|-----------|
| Status ao vivo da impressora | Sim | Sim |
| Histórico de impressões (local) | Sim | Sim |
| Imagens de modelos do MakerWorld | Não | Sim |
| Perfis de filamento da Bambu | Não | Sim |
| Sincronização do histórico de impressões | Não | Sim |
| Filamento AMS da nuvem | Não | Sim |

## Conectar ao Bambu Cloud

1. Vá em **Configurações → Bambu Cloud**
2. Insira seu e-mail e senha da Bambu Lab
3. Clique em **Entrar**
4. Selecione quais dados devem ser sincronizados

:::warning Privacidade
Usuário e senha não são armazenados em texto puro. O dashboard usa a API da Bambu Labs para obter um token OAuth que é salvo localmente. Seus dados nunca saem do seu servidor.
:::

## Sincronização

### Imagens de modelos

Quando a nuvem está conectada, as imagens de modelos são buscadas automaticamente no **MakerWorld** e exibidas em:
- Histórico de impressões
- Dashboard (durante impressão ativa)
- Visualizador de modelos 3D

### Histórico de impressões

A sincronização com a nuvem importa o histórico de impressões do aplicativo Bambu Lab. Duplicatas são filtradas automaticamente com base em carimbo de data/hora e número de série.

### Perfis de filamento

Os perfis oficiais de filamento da Bambu Labs são sincronizados e exibidos no estoque de filamentos. Você pode usá-los como ponto de partida para seus próprios perfis.

## O que funciona sem a nuvem?

Todas as funções principais funcionam sem conexão com a nuvem:

- Conexão MQTT direta com a impressora via LAN
- Status ao vivo, temperatura, câmera
- Histórico de impressões e estatísticas locais
- Estoque de filamentos (gerenciado manualmente)
- Alertas e agendador

:::tip Modo somente LAN
Deseja usar o dashboard completamente sem conexão com a internet? Ele funciona perfeitamente em uma rede isolada — basta conectar à impressora via IP e deixar a integração com a nuvem desativada.
:::

## Solução de problemas

**Login falha:**
- Verifique se o e-mail e a senha estão corretos para o aplicativo Bambu Lab
- Verifique se a conta usa autenticação de dois fatores (ainda não suportada)
- Tente sair e entrar novamente

**A sincronização para:**
- O token pode ter expirado — saia e entre novamente em Configurações
- Verifique a conexão com a internet do seu servidor
