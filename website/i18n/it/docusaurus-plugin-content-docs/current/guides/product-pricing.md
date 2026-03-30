---
sidebar_position: 11
title: Prezzi dei prodotti — calcolare il prezzo di vendita
description: Guida completa per la determinazione dei prezzi delle stampe 3D in vendita con tutti i fattori di costo
---

# Prezzi dei prodotti — calcolare il prezzo di vendita

Questa guida spiega come utilizzare il calcolatore dei costi per trovare il giusto prezzo di vendita per le stampe 3D che vendi.

## Panoramica dei costi

Il costo di una stampa 3D è composto da questi elementi:

| Componente | Descrizione | Esempio |
|-----------|-------------|---------|
| **Filamento** | Costo del materiale basato su peso e prezzo della bobina | 100g × 0,25 kr/g = 25 kr |
| **Scarto** | Spreco di materiale (purge, stampe fallite, supporto) | 10% extra = 2,50 kr |
| **Elettricità** | Consumo elettrico durante la stampa | 3,5h × 150W × 1,50 kr/kWh = 0,79 kr |
| **Usura** | Ugello + valore macchina nel corso della vita utile | 3,5h × 0,15 kr/h = 0,53 kr |
| **Manodopera** | Il tuo tempo per configurazione, post-elaborazione, imballaggio | 10 min × 200 kr/h = 33,33 kr |
| **Ricarico** | Margine di profitto | 20% = 12,43 kr |

**Costo totale di produzione** = somma di tutti i componenti

## Configurare le impostazioni

### Impostazioni di base

Vai su **Filament → ⚙ Impostazioni** e compila:

1. **Prezzo elettricità (kr/kWh)** — il tuo prezzo dell'elettricità. Controlla la bolletta elettrica o usa l'integrazione Nordpool
2. **Potenza stampante (W)** — tipicamente 150W per stampanti Bambu Lab
3. **Costo macchina (kr)** — quanto hai pagato per la stampante
4. **Vita utile macchina (ore)** — vita utile prevista (3000-8000 ore)
5. **Costo manodopera (kr/ora)** — la tua tariffa oraria
6. **Tempo di preparazione (min)** — tempo medio per cambio filamento, controllo piatto, imballaggio
7. **Ricarico (%)** — margine di profitto desiderato
8. **Costo ugello (kr/ora)** — usura dell'ugello (HS01 ≈ 0,05 kr/h)
9. **Fattore di scarto** — spreco di materiale (1,1 = 10% extra, 1,15 = 15%)

:::tip Valori tipici per Bambu Lab
| Impostazione | Hobbista | Semi-pro | Professionale |
|---|---|---|---|
| Prezzo elettricità | 1,50 kr/kWh | 1,50 kr/kWh | 1,00 kr/kWh |
| Potenza stampante | 150W | 150W | 150W |
| Costo macchina | 5 000 kr | 12 000 kr | 25 000 kr |
| Vita utile macchina | 3 000h | 5 000h | 8 000h |
| Costo manodopera | 0 kr/h | 150 kr/h | 250 kr/h |
| Tempo di preparazione | 5 min | 10 min | 15 min |
| Ricarico | 0% | 30% | 50% |
| Fattore di scarto | 1,05 | 1,10 | 1,15 |
:::

## Calcolare il costo

1. Vai al **Calcolatore dei costi** (`https://localhost:3443/#costestimator`)
2. **Trascina e rilascia** un file `.3mf` o `.gcode`
3. Il sistema legge automaticamente: peso del filamento, tempo stimato, colori
4. **Collega le bobine** — seleziona quali bobine dall'inventario vengono utilizzate
5. Clicca su **Calcola costo**

### Il risultato mostra:

- **Filamento** — costo del materiale per colore
- **Scarto/spreco** — basato sul fattore di scarto
- **Elettricità** — utilizza il prezzo spot in tempo reale da Nordpool se disponibile
- **Usura** — ugello + valore macchina
- **Manodopera** — tariffa oraria + tempo di preparazione
- **Costo di produzione** — somma di tutto sopra
- **Ricarico** — il tuo margine di profitto
- **Costo totale** — il minimo che dovresti richiedere
- **Prezzi di vendita suggeriti** — margine 2×, 2,5×, 3×

## Strategie di prezzo

### Margine 2× (minimo raccomandato)
Copre il costo di produzione + spese impreviste. Da usare per amici/famiglia e geometrie semplici.

### Margine 2,5× (standard)
Buon equilibrio tra prezzo e valore. Funziona per la maggior parte dei prodotti.

### Margine 3× (premium)
Per modelli complessi, multicolore, alta qualità o mercati di nicchia.

:::warning Non dimenticare i costi nascosti
- Stampe fallite (5-15% di tutte le stampe falliscono)
- Filamento non utilizzato completamente (gli ultimi 50g sono spesso difficili)
- Tempo dedicato al servizio clienti
- Imballaggio e spedizione
- Manutenzione della stampante
:::

## Esempio: Stabilire il prezzo di un porta telefono

| Parametro | Valore |
|-----------|-------|
| Peso filamento | 45g PLA |
| Tempo di stampa | 2 ore |
| Prezzo spot | 1,20 kr/kWh |

**Calcolo:**
- Filamento: 45g × 0,25 kr/g = 11,25 kr
- Scarto (10%): 1,13 kr
- Elettricità: 2h × 0,15kW × 1,20 = 0,36 kr
- Usura: 2h × 0,15 = 0,30 kr
- Manodopera: (2h + 10min) × 200 kr/h = 433 kr (o 0 per hobbista)
- **Costo di produzione (hobbista)**: ~13 kr
- **Prezzo di vendita 2,5×**: ~33 kr

## Salvare la stima

Clicca su **Salva stima** per archiviare il calcolo. Le stime salvate si trovano nella scheda **Salvati** nel calcolatore dei costi.

## E-commerce

Se usi il [modulo e-commerce](../integrations/ecommerce), puoi collegare le stime dei costi direttamente agli ordini per il calcolo automatico dei prezzi.
