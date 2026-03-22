---
sidebar_position: 1
title: Instalação
description: Instale o Bambu Dashboard no seu servidor ou máquina local
---

# Instalação

## Requisitos

| Requisito | Mínimo | Recomendado |
|-----------|--------|-------------|
| Node.js | 22.x | 22.x LTS |
| RAM | 512 MB | 1 GB+ |
| Disco | 500 MB | 2 GB+ |
| SO | Linux, macOS, Windows | Linux (Ubuntu/Debian) |

:::warning Node.js 22 é obrigatório
O Bambu Dashboard usa `--experimental-sqlite`, que está embutido no Node.js 22. Versões mais antigas não são suportadas.
:::

## Instalação com install.sh (recomendado)

A maneira mais fácil é usar o script de instalação interativo:

```bash
git clone https://github.com/skynett81/bambu-dashboard.git
cd bambu-dashboard
./install.sh
```

O script guia você pela configuração no navegador. Para instalação baseada em terminal com suporte a systemd:

```bash
./install.sh --cli
```

## Instalação manual

```bash
# 1. Clone o repositório
git clone https://github.com/skynett81/bambu-dashboard.git
cd bambu-dashboard

# 2. Instale as dependências
npm install

# 3. Inicie o dashboard
npm start
```

Abra o navegador em `https://localhost:3443` (ou `http://localhost:3000` que redireciona).

:::info Certificado SSL autoassinado
Na primeira inicialização, o dashboard gera um certificado SSL autoassinado. O navegador exibirá um aviso — isso é normal. Veja [Certificados HTTPS](./oppsett#https-sertifikater) para instalar seu próprio certificado.
:::

## Docker

```bash
docker-compose up -d
```

Veja [Configuração Docker](../avansert/docker) para configuração completa.

## Serviço systemd

Para executar o dashboard como um serviço em segundo plano:

```bash
./install.sh --cli
# Selecione "Sim" quando perguntado sobre o serviço systemd
```

Ou manualmente:

```bash
sudo systemctl enable --now bambu-dashboard
sudo systemctl status bambu-dashboard
```

## Atualização

O Bambu Dashboard possui atualização automática integrada via GitHub Releases. Você pode atualizar pelo dashboard em **Configurações → Atualização**, ou manualmente:

```bash
git pull
npm install
npm start
```

## Desinstalação

```bash
./uninstall.sh
```

O script remove o serviço, a configuração e os dados (você escolhe o que será excluído).
