---
sidebar_position: 1
title: Kurulum
description: Bambu Dashboard'u sunucunuza veya yerel makinenize kurun
---

# Kurulum

## Gereksinimler

| Gereksinim | Minimum | Önerilen |
|------|---------|---------|
| Node.js | 22.x | 22.x LTS |
| RAM | 512 MB | 1 GB+ |
| Disk | 500 MB | 2 GB+ |
| İşletim Sistemi | Linux, macOS, Windows | Linux (Ubuntu/Debian) |

:::warning Node.js 22 zorunludur
Bambu Dashboard, Node.js 22'ye yerleşik `--experimental-sqlite` kullanır. Eski sürümler desteklenmez.
:::

## install.sh ile kurulum (önerilen)

En kolay yöntem, etkileşimli kurulum betiğini kullanmaktır:

```bash
git clone https://github.com/skynett81/bambu-dashboard.git
cd bambu-dashboard
./install.sh
```

Betik, tarayıcıda kurulumu adım adım yönlendirir. Systemd desteği ile terminal tabanlı kurulum için:

```bash
./install.sh --cli
```

## Manuel kurulum

```bash
# 1. Depoyu klonlayın
git clone https://github.com/skynett81/bambu-dashboard.git
cd bambu-dashboard

# 2. Bağımlılıkları yükleyin
npm install

# 3. Dashboard'u başlatın
npm start
```

Tarayıcıyı `https://localhost:3443` adresinde açın (`http://localhost:3000` yönlendirir).

:::info Kendinden imzalı SSL sertifikası
İlk başlatmada dashboard otomatik olarak kendinden imzalı bir SSL sertifikası oluşturur. Tarayıcı bir uyarı gösterir — bu normaldir. Kendi sertifikanızı yüklemek için [HTTPS sertifikaları](./oppsett#https-sertifikater) bölümüne bakın.
:::

## Docker

```bash
docker-compose up -d
```

Tam yapılandırma için [Docker kurulumu](../avansert/docker) bölümüne bakın.

## Systemd hizmeti

Dashboard'u arka plan hizmeti olarak çalıştırmak için:

```bash
./install.sh --cli
# Systemd hizmeti sorulduğunda "Evet" seçin
```

Ya da manuel olarak:

```bash
sudo systemctl enable --now bambu-dashboard
sudo systemctl status bambu-dashboard
```

## Güncelleme

Bambu Dashboard, GitHub Releases üzerinden yerleşik otomatik güncelleme özelliğine sahiptir. Dashboard'da **Ayarlar → Güncelleme** bölümünden güncelleyebilir ya da manuel olarak yapabilirsiniz:

```bash
git pull
npm install
npm start
```

## Kaldırma

```bash
./uninstall.sh
```

Betik, hizmet, yapılandırma ve verileri kaldırır (nelerin silineceğini siz seçersiniz).
