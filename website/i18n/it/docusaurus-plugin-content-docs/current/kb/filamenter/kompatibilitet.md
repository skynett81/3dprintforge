---
sidebar_position: 10
title: Matrice di compatibilità
description: Panoramica completa della compatibilità dei materiali con piani, stampanti e ugelli Bambu Lab
---

# Matrice di compatibilità

Questa pagina fornisce una panoramica completa di quali materiali funzionano con quali piani di stampa, stampanti e tipi di ugello. Usa le tabelle come riferimento quando pianifichi stampe con nuovi materiali.

---

## Materiali e piani di stampa

| Materiale | Cool Plate | Engineering Plate | High Temp Plate | Textured PEI | Colla stick |
|-----------|-----------|-------------------|-----------------|--------------|------------|
| PLA | Eccellente | Buono | Non consigliato | Buono | No |
| PLA+ | Eccellente | Buono | Non consigliato | Buono | No |
| PLA-CF | Eccellente | Buono | Non consigliato | Buono | No |
| PLA Silk | Eccellente | Buono | Non consigliato | Buono | No |
| PETG | Scarso | Eccellente | Buono | Buono | Sì (Cool) |
| PETG-CF | Scarso | Eccellente | Buono | Accettabile | Sì (Cool) |
| ABS | Non consigliato | Eccellente | Buono | Accettabile | Sì (HT) |
| ASA | Non consigliato | Eccellente | Buono | Accettabile | Sì (HT) |
| TPU | Buono | Buono | Non consigliato | Eccellente | No |
| PA (Nylon) | Non consigliato | Eccellente | Buono | Scarso | Sì |
| PA-CF | Non consigliato | Eccellente | Buono | Scarso | Sì |
| PA-GF | Non consigliato | Eccellente | Buono | Scarso | Sì |
| PC | Non consigliato | Accettabile | Eccellente | Non consigliato | Sì (Eng) |
| PC-CF | Non consigliato | Accettabile | Eccellente | Non consigliato | Sì (Eng) |
| PVA | Eccellente | Buono | Non consigliato | Buono | No |
| HIPS | Non consigliato | Buono | Buono | Accettabile | No |
| PVB | Buono | Buono | Non consigliato | Buono | No |

**Legenda:**
- **Eccellente** — funziona in modo ottimale, combinazione consigliata
- **Buono** — funziona bene, alternativa accettabile
- **Accettabile** — funziona, ma non ideale — richiede misure aggiuntive
- **Scarso** — può funzionare con modifiche, ma non consigliato
- **Non consigliato** — risultati scadenti o rischio di danno al piano

:::tip PETG e Cool Plate
Il PETG aderisce **troppo bene** alla Cool Plate (Smooth PEI) e può strappare il rivestimento PEI quando si rimuove il pezzo. Usa sempre la colla stick come pellicola di separazione, o scegli l'Engineering Plate.
:::

:::warning PC e scelta del piano
Il PC richiede High Temp Plate a causa delle alte temperature del piatto (100–120 °C). Altri piani possono deformarsi permanentemente a queste temperature.
:::

---

## Materiali e stampanti

| Materiale | A1 Mini | A1 | P1P | P1S | P2S | X1C | X1E | H2S | H2D | H2C |
|-----------|---------|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| PLA | Sì | Sì | Sì | Sì | Sì | Sì | Sì | Sì | Sì | Sì |
| PLA+ | Sì | Sì | Sì | Sì | Sì | Sì | Sì | Sì | Sì | Sì |
| PLA-CF | Sì* | Sì* | Sì* | Sì* | Sì* | Sì | Sì | Sì* | Sì* | Sì* |
| PETG | Sì | Sì | Sì | Sì | Sì | Sì | Sì | Sì | Sì | Sì |
| PETG-CF | Sì* | Sì* | Sì* | Sì* | Sì* | Sì | Sì | Sì* | Sì* | Sì* |
| ABS | No | No | Possibile** | Sì | Sì | Sì | Sì | Sì | Sì | Sì |
| ASA | No | No | Possibile** | Sì | Sì | Sì | Sì | Sì | Sì | Sì |
| TPU | Sì | Sì | Sì | Sì | Sì | Sì | Sì | Sì | Sì | Sì |
| PA (Nylon) | No | No | No | Possibile** | Possibile** | Sì | Sì | Sì | Sì | Sì |
| PA-CF | No | No | No | No | No | Sì | Sì | Possibile** | Possibile** | Possibile** |
| PA-GF | No | No | No | No | No | Sì | Sì | Possibile** | Possibile** | Possibile** |
| PC | No | No | No | Possibile** | No | Sì | Sì | Possibile** | Possibile** | Possibile** |
| PC-CF | No | No | No | No | No | Sì | Sì | No | No | No |
| PVA | Sì | Sì | Sì | Sì | Sì | Sì | Sì | Sì | Sì | Sì |
| HIPS | No | No | Possibile** | Sì | Sì | Sì | Sì | Sì | Sì | Sì |

**Legenda:**
- **Sì** — completamente supportato e consigliato
- **Sì*** — richiede ugello in acciaio temprato (HS01 o equivalente)
- **Possibile**** — può funzionare con limitazioni, non ufficialmente consigliato
- **No** — non adatto (manca enclosure, temperature troppo basse, ecc.)

:::danger Requisiti di enclosure
Materiali che richiedono enclosure (ABS, ASA, PA, PC):
- **A1 e A1 Mini** hanno telaio aperto — non adatti
- **P1P** ha telaio aperto — richiede accessorio enclosure
- **P1S** ha enclosure, ma senza riscaldamento attivo della camera
- **X1C e X1E** hanno enclosure completo con riscaldamento attivo — consigliati per materiali impegnativi
:::

---

## Materiali e tipi di ugello

| Materiale | Ottone (standard) | Acciaio temprato (HS01) | Hardened Steel |
|-----------|------------------|------------------------|----------------|
| PLA | Eccellente | Eccellente | Eccellente |
| PLA+ | Eccellente | Eccellente | Eccellente |
| PLA-CF | Non usare | Eccellente | Eccellente |
| PLA Silk | Eccellente | Eccellente | Eccellente |
| PETG | Eccellente | Eccellente | Eccellente |
| PETG-CF | Non usare | Eccellente | Eccellente |
| ABS | Eccellente | Eccellente | Eccellente |
| ASA | Eccellente | Eccellente | Eccellente |
| TPU | Eccellente | Buono | Buono |
| PA (Nylon) | Buono | Eccellente | Eccellente |
| PA-CF | Non usare | Eccellente | Eccellente |
| PA-GF | Non usare | Eccellente | Eccellente |
| PC | Buono | Eccellente | Eccellente |
| PC-CF | Non usare | Eccellente | Eccellente |
| PVA | Eccellente | Buono | Buono |
| HIPS | Eccellente | Eccellente | Eccellente |
| PVB | Eccellente | Buono | Buono |

:::danger Fibra di carbonio e vetro richiedono ugello temprato
Tutti i materiali con **-CF** (fibra di carbonio) o **-GF** (fibra di vetro) **richiedono un ugello in acciaio temprato**. L'ottone si usura in ore o giorni con questi materiali. Si consiglia Bambu Lab HS01.

Materiali che richiedono ugello temprato:
- PLA-CF
- PETG-CF
- PA-CF / PA-GF
- PC-CF / PC-GF
:::

:::tip Ottone vs acciaio temprato per materiali comuni
L'ugello in ottone offre **migliore conducibilità termica** e quindi un'estrusione più uniforme per materiali comuni (PLA, PETG, ABS). L'acciaio temprato funziona bene, ma può richiedere 5–10 °C in più. Usa ottone per l'uso quotidiano e passa all'acciaio temprato per materiali CF/GF.
:::

---

## Consigli per il cambio materiale

Quando si cambia materiale nell'AMS o manualmente, uno spurgo corretto è importante per evitare contaminazioni.

### Quantità di spurgo consigliata

| Da → A | Quantità di spurgo | Note |
|--------|-------------------|------|
| PLA → PLA (altro colore) | 100–150 mm³ | Cambio colore standard |
| PLA → PETG | 200–300 mm³ | Aumento temperatura, flusso diverso |
| PETG → PLA | 200–300 mm³ | Diminuzione temperatura |
| ABS → PLA | 300–400 mm³ | Grande differenza di temperatura |
| PLA → ABS | 300–400 mm³ | Grande differenza di temperatura |
| PA → PLA | 400–500 mm³ | Il nylon rimane nell'hotend |
| PC → PLA | 400–500 mm³ | Il PC richiede spurgo approfondito |
| Scuro → Chiaro | 200–300 mm³ | Il pigmento scuro è difficile da eliminare |
| Chiaro → Scuro | 100–150 mm³ | Transizione più facile |

### Cambio temperatura durante cambio materiale

| Transizione | Raccomandazione |
|------------|----------------|
| Freddo → Caldo (es. PLA → ABS) | Riscaldare al nuovo materiale, spurgare a fondo |
| Caldo → Freddo (es. ABS → PLA) | Spurgare prima ad alta temperatura, poi abbassare |
| Temperature simili (es. PLA → PLA) | Spurgo standard |
| Grande differenza (es. PLA → PC) | Una sosta intermedia con PETG può aiutare |

:::warning Nylon e PC lasciano residui
PA (Nylon) e PC sono particolarmente difficili da spurgare. Dopo l'uso di questi materiali:
1. Spurgare con **PETG** o **ABS** ad alta temperatura (260–280 °C)
2. Far passare almeno **500 mm³** di materiale di spurgo
3. Ispezionare visivamente l'estrusione — deve essere completamente pulita senza scolorimento
:::

---

## Riferimento rapido — scelta del materiale

Non sai quale materiale ti serve? Usa questa guida:

| Esigenza | Materiale consigliato |
|----------|----------------------|
| Prototipazione / uso quotidiano | PLA |
| Resistenza meccanica | PETG, PLA Tough |
| Uso esterno | ASA |
| Resistenza termica | ABS, ASA, PC |
| Parti flessibili | TPU |
| Massima resistenza | PA-CF, PC-CF |
| Trasparente | PETG (naturale), PC (naturale) |
| Estetica / decorazione | PLA Silk, PLA Sparkle |
| Clip / cerniere viventi | PETG, PA |
| Contatto alimentare | PLA (con riserve) |
