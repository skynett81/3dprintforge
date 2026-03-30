---
sidebar_position: 5
title: Controllo Stampante
description: Controlla temperatura, velocità, ventole e invia G-code direttamente alla stampante
---

# Controllo Stampante

Il pannello di controllo ti offre il controllo manuale completo della stampante direttamente dal dashboard.

## Controllo Temperatura

### Ugello
- Imposta la temperatura target tra 0–350 °C
- Clicca su **Imposta** per inviare il comando
- La lettura in tempo reale viene mostrata con un misuratore ad anello animato

### Piano di Stampa
- Imposta la temperatura target tra 0–120 °C
- Spegnimento automatico dopo la stampa (configurabile)

### Camera
- Visualizza la temperatura della camera (lettura in tempo reale)
- **X1E, H2S, H2D, H2C**: Controllo attivo del riscaldamento camera tramite M141 (temperatura target controllabile)
- **X1C**: Chiusura passiva — la temperatura della camera viene mostrata, ma non può essere controllata direttamente
- **P1S**: Chiusura passiva — mostra la temperatura, nessun controllo attivo del riscaldamento camera
- **P1P, A1, A1 mini e serie H senza chamberHeat**: Nessun sensore camera

:::warning Temperature massime
Non superare le temperature consigliate per ugello e piano. Per ugelli in acciaio indurito (tipo HF): max 300 °C. Per ottone: max 260 °C. Consulta il manuale della stampante.
:::

## Profili di Velocità

Il controllo velocità offre quattro profili preimpostati:

| Profilo | Velocità | Utilizzo |
|--------|----------|-------------|
| Silenziosa | 50% | Riduzione rumore, stampa notturna |
| Standard | 100% | Uso normale |
| Sport | 124% | Stampe più veloci |
| Turbo | 166% | Velocità massima (riduzione qualità) |

Il cursore ti permette di impostare una percentuale personalizzata tra 50–200%.

## Controllo Ventole

Controlla manualmente le velocità delle ventole:

| Ventola | Descrizione | Intervallo |
|-------|-------------|--------|
| Ventola di raffreddamento pezzo | Raffredda l'oggetto stampato | 0–100% |
| Ventola ausiliaria | Circolazione camera | 0–100% |
| Ventola camera | Raffreddamento attivo camera | 0–100% |

:::tip Buone impostazioni
- **PLA/PETG:** Raffreddamento pezzo 100%, aux 30%
- **ABS/ASA:** Raffreddamento pezzo 0–20%, ventola camera spenta
- **TPU:** Raffreddamento pezzo 50%, bassa velocità
:::

## Console G-code

Invia comandi G-code direttamente alla stampante:

```gcode
; Esempio: Sposta posizione testa
G28 ; Home tutti gli assi
G1 X150 Y150 Z10 F3000 ; Sposta al centro
M104 S220 ; Imposta temperatura ugello
M140 S60  ; Imposta temperatura piano
```

:::danger Attenzione con il G-code
Un G-code errato può danneggiare la stampante. Invia solo comandi che comprendi. Evita `M600` (cambio filamento) durante una stampa.
:::

## Operazioni Filamento

Dal pannello di controllo puoi:

- **Carica filamento** — riscalda l'ugello e inserisce il filamento
- **Scarica filamento** — riscalda e ritira il filamento
- **Pulisci ugello** — esegui il ciclo di pulizia

## Macro

Salva ed esegui sequenze di comandi G-code come macro:

1. Clicca su **Nuova macro**
2. Assegna un nome alla macro
3. Scrivi la sequenza G-code
4. Salva ed esegui con un clic

Macro di esempio per la calibrazione del piano:
```gcode
G28
M84
M500
```

## Controllo Stampa

Durante una stampa attiva puoi:

- **Pausa** — mette in pausa la stampa dopo lo strato corrente
- **Riprendi** — riprende una stampa in pausa
- **Ferma** — interrompe la stampa (non reversibile)
- **Arresto di emergenza** — arresto immediato di tutti i motori
