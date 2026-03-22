---
sidebar_position: 5
title: E-commerce
description: Gestisci ordini, clienti e fatturazione per la vendita di stampe 3D — richiede licenza da geektech.no
---

# E-commerce

Il modulo E-commerce ti fornisce un sistema completo per gestire clienti, ordini e fatturazione — perfetto per chi vende stampe 3D in modo professionale o semi-professionale.

Vai a: **https://localhost:3443/#orders**

:::danger Licenza e-commerce richiesta
Il modulo E-commerce richiede una licenza valida. Le licenze possono essere **acquistate esclusivamente tramite [geektech.no](https://geektech.no)**. Senza licenza attiva, il modulo è bloccato e non disponibile.
:::

## Licenza — Acquisto e Attivazione

### Acquistare la Licenza

1. Vai su **[geektech.no](https://geektech.no)** e crea un account
2. Seleziona **Bambu Dashboard — Licenza E-commerce**
3. Scegli il tipo di licenza:

| Tipo licenza | Descrizione | Stampanti |
|---|---|---|
| **Hobby** | Una stampante, uso personale e piccole vendite | 1 |
| **Professionale** | Fino a 5 stampanti, uso commerciale | 1–5 |
| **Enterprise** | Stampanti illimitate, supporto completo | Illimitate |

4. Completa il pagamento
5. Riceverai una **chiave di licenza** via email

### Attivare la Licenza

1. Vai a **Impostazioni → E-commerce** nel dashboard
2. Incolla la **chiave di licenza** nel campo
3. Clicca su **Attiva licenza**
4. Il dashboard autentica la chiave sui server di geektech.no
5. In caso di attivazione riuscita, vengono mostrati il tipo di licenza, la data di scadenza e il numero di stampanti

:::warning La chiave di licenza è legata alla tua installazione
La chiave viene attivata per un'installazione di Bambu Dashboard. Contatta [geektech.no](https://geektech.no) se hai bisogno di spostare la licenza su un nuovo server.
:::

### Validazione Licenza

- La licenza viene **validata online** all'avvio e successivamente ogni 24 ore
- In caso di mancanza di rete, la licenza funziona per un massimo di **7 giorni offline**
- Licenza scaduta → il modulo si blocca, ma i dati esistenti vengono mantenuti
- Il rinnovo avviene tramite **[geektech.no](https://geektech.no)** → Le mie licenze → Rinnova

### Verificare lo Stato della Licenza

Vai a **Impostazioni → E-commerce** oppure chiama l'API:

```bash
curl -sk https://localhost:3443/api/ecom-license/status
```

La risposta contiene:
```json
{
  "active": true,
  "type": "professional",
  "expires": "2027-03-22",
  "printers": 5,
  "licensee": "Nome Azienda SRL",
  "provider": "geektech.no"
}
```

## Clienti

### Creare un Cliente

1. Vai a **E-commerce → Clienti**
2. Clicca su **Nuovo cliente**
3. Compila:
   - **Nome / Ragione sociale**
   - **Persona di contatto** (per le aziende)
   - **Indirizzo email**
   - **Telefono**
   - **Indirizzo** (indirizzo di fatturazione)
   - **P.IVA / Codice fiscale** (opzionale, per soggetti registrati IVA)
   - **Nota** — annotazione interna
4. Clicca su **Crea**

### Panoramica Clienti

L'elenco clienti mostra:
- Nome e informazioni di contatto
- Numero totale di ordini
- Fatturato totale
- Data dell'ultimo ordine
- Stato (Attivo / Inattivo)

Clicca su un cliente per vedere tutta la cronologia ordini e fatturazione.

## Gestione Ordini

### Creare un Ordine

1. Vai a **E-commerce → Ordini**
2. Clicca su **Nuovo ordine**
3. Seleziona il **Cliente** dall'elenco
4. Aggiungi le righe d'ordine:
   - Seleziona file/modello dalla libreria file, o aggiungi una voce in testo libero
   - Indica quantità e prezzo unitario
   - Il sistema calcola il costo automaticamente se collegato a un progetto
5. Indica la **Data di consegna** (stimata)
6. Clicca su **Crea ordine**

### Stato Ordine

| Stato | Descrizione |
|---|---|
| Richiesta | Richiesta ricevuta, non confermata |
| Confermata | Il cliente ha confermato |
| In produzione | Stampe in corso |
| Pronto per la consegna | Finito, in attesa di ritiro/spedizione |
| Consegnato | Ordine completato |
| Annullato | Cancellato dal cliente o da te |

Aggiorna lo stato cliccando sull'ordine → **Cambia stato**.

### Collegare Stampe all'Ordine

1. Apri l'ordine
2. Clicca su **Collega stampa**
3. Seleziona le stampe dalla cronologia (selezione multipla supportata)
4. I dati di costo vengono recuperati automaticamente dalla cronologia stampe

## Fatturazione

Vedi [Progetti → Fatturazione](../funksjoner/projects#fatturering) per la documentazione dettagliata sulla fatturazione.

La fattura può essere generata direttamente da un ordine:

1. Apri l'ordine
2. Clicca su **Genera fattura**
3. Controlla importo e IVA
4. Scarica il PDF o invialo all'email del cliente

### Serie Numeri Fattura

Configura la serie di numeri fattura in **Impostazioni → E-commerce**:
- **Prefisso**: ad es. `2026-`
- **Numero iniziale**: ad es. `1001`
- Il numero fattura viene assegnato automaticamente in ordine crescente

## Reportistica e Tasse

### Reportistica Commissioni

Il sistema tiene traccia di tutte le commissioni di transazione:
- Vedi le commissioni in **E-commerce → Commissioni**
- Contrassegna le commissioni come segnalate per scopi contabili
- Esporta il riepilogo commissioni per periodo

### Statistiche

In **E-commerce → Statistiche**:
- Fatturato mensile (grafico a barre)
- Clienti top per fatturato
- Modelli/materiali più venduti
- Dimensione media dell'ordine

Esporta in CSV per il sistema contabile.

## Supporto e Contatti

:::info Hai bisogno di aiuto?
- **Domande sulla licenza**: contatta il supporto di [geektech.no](https://geektech.no)
- **Problemi tecnici**: [GitHub Issues](https://github.com/skynett81/bambu-dashboard/issues)
- **Richieste di funzionalità**: [GitHub Discussions](https://github.com/skynett81/bambu-dashboard/discussions)
:::
