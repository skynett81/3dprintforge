---
sidebar_position: 5
title: Úspěchy
description: Gamifikační systém s odemykatelnými úspěchy, stupni vzácnosti a milníky pro 3D tisk s Bambu Lab
---

# Úspěchy

Úspěchy (achievements) jsou gamifikačním prvkem, který odměňuje milníky a vzrušující okamžiky ve vaší tiskové cestě. Sbírejte úspěchy a sledujte postup k dalšímu odemčení.

Přejděte na: **https://localhost:3443/#achievements**

## Stupně vzácnosti

Úspěchy jsou klasifikovány do čtyř stupňů vzácnosti:

| Stupeň | Barva | Popis |
|---|---|---|
| **Obyčejný** | Šedá | Jednoduché milníky, snadno dosažitelné |
| **Neobvyklý** | Zelená | Vyžaduje trochu úsilí nebo čas |
| **Vzácný** | Modrá | Vyžaduje soustředěné úsilí po delší dobu |
| **Legendární** | Zlatá | Mimořádné výkony |

## Příklady úspěchů

### Tiskové milníky (Obyčejný / Neobvyklý)
| Úspěch | Požadavek |
|---|---|
| První tisk | Dokončete svůj úplně první tisk |
| Celý den | Tisknout celkem více než 24 hodin |
| Vysoká míra úspěšnosti | 10 úspěšných tisků v řadě |
| Sběratel filamentů | Zaregistrujte 10 různých typů filamentů |
| Více barev | Dokončete vícebarevný tisk |

### Objemové úspěchy (Neobvyklý / Vzácný)
| Úspěch | Požadavek |
|---|---|
| Kilogram | Celkem použijte 1 kg filamentu |
| 10 kg | Celkem použijte 10 kg filamentu |
| 100 tisků | 100 úspěšných tisků |
| 500 hodin | 500 kumulativních tiskových hodin |
| Noční směna | Dokončete tisk trvající déle než 20 hodin |

### Údržba a péče (Neobvyklý / Vzácný)
| Úspěch | Požadavek |
|---|---|
| Svědomitý | Zaznamenejte úlohu údržby |
| Pečovatel tiskárny | 10 zalogovaných úloh údržby |
| Žádný odpad | Vytvořte tisk s > 90% účinností materiálu |
| Mistr trysek | Vyměňte trysku 5× (dokumentováno) |

### Legendární úspěchy
| Úspěch | Požadavek |
|---|---|
| Neúnavný | 1000 úspěšných tisků |
| Titan filamentů | 50 kg celkové spotřeby filamentu |
| Bezchybný týden | 7 dní bez jediného neúspěšného tisku |
| Knihovník tisku | 100 různých modelů v knihovně souborů |

## Zobrazení úspěchů

Stránka úspěchů zobrazuje:

- **Odemčené** — úspěchy, které jste dosáhli (s datem)
- **Blízko** — úspěchy, které jsou blízko dosažení (ukazatel průběhu)
- **Zamčené** — všechny úspěchy, které jste ještě nedosáhli

Filtrujte podle **Stupně**, **Kategorie** nebo **Stavu** (odemčeno / v procesu / zamčeno).

## Ukazatel průběhu

Pro úspěchy s počítáním se zobrazuje ukazatel průběhu:

```
Kilogram — 1 kg filamentu
[████████░░] 847 g / 1000 g (84,7 %)
```

## Upozornění

Při dosažení nového úspěchu jste automaticky upozorněni:
- **Popup v prohlížeči** s názvem úspěchu a grafikou
- Volitelně: upozornění přes Telegram / Discord (nakonfigurujte v **Nastavení → Upozornění → Úspěchy**)

## Podpora více uživatelů

V systémech s více uživateli má každý uživatel vlastní profil úspěchů. **Žebříček** (leaderboard) zobrazuje pořadí podle:

- Celkového počtu odemčených úspěchů
- Celkového počtu tisků
- Celkových tiskových hodin

:::tip Soukromý režim
Vypněte žebříček v části **Nastavení → Úspěchy → Skrýt ze žebříčku** pro zachování soukromí profilu.
:::
