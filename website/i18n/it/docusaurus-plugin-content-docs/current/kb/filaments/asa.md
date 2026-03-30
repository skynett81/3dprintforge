---
sidebar_position: 6
title: ASA
description: Guida alla stampa ASA con Bambu Lab — resistente ai raggi UV, uso esterno, temperature e consigli
---

# ASA

L'ASA (Acrilonitrile Stirene Acrilato) è una variante dell'ABS resistente ai raggi UV, sviluppata specificamente per l'uso in esterni. Il materiale combina la resistenza e la rigidità dell'ABS con una resistenza significativamente migliore ai raggi UV, all'invecchiamento e alle intemperie.

## Impostazioni

| Parametro | Valore |
|-----------|--------|
| Temperatura ugello | 240–260 °C |
| Temperatura piatto | 90–110 °C |
| Temperatura camera | 40–50 °C (consigliato) |
| Raffreddamento pezzo | 30–50% |
| Velocità | 80–100% |
| Essiccazione necessaria | Sì |

## Piani di stampa consigliati

| Piano | Idoneità | Colla stick? |
|-------|----------|-------------|
| Engineering Plate | Eccellente | No |
| High Temp Plate | Buono | Sì |
| Textured PEI | Accettabile | Sì |
| Cool Plate (Smooth PEI) | Non consigliato | — |

:::tip L'Engineering Plate è la migliore per ASA
L'Engineering Plate offre l'adesione più affidabile per l'ASA senza colla stick. Il piano sopporta le alte temperature e garantisce una buona adesione senza che il pezzo rimanga incollato permanentemente.
:::

## Requisiti della stampante

L'ASA richiede una **camera chiusa (enclosure)** per i migliori risultati. Senza enclosure sperimenterai:

- **Warping** — gli angoli si sollevano dal piano di stampa
- **Delaminazione** — scarsa adesione tra gli strati
- **Crepe superficiali** — crepe visibili lungo la stampa

| Stampante | Adatta per ASA? | Note |
|-----------|----------------|------|
| X1C | Eccellente | Completamente chiusa, riscaldamento attivo |
| X1E | Eccellente | Completamente chiusa, riscaldamento attivo |
| P1S | Buona | Chiusa, riscaldamento passivo |
| P1P | Possibile con accessorio | Richiede accessorio enclosure |
| A1 | Non consigliata | Telaio aperto |
| A1 Mini | Non consigliata | Telaio aperto |

## ASA vs ABS — confronto

| Proprietà | ASA | ABS |
|-----------|-----|-----|
| Resistenza UV | Eccellente | Scarsa |
| Uso esterno | Sì | No (ingiallisce e diventa fragile) |
| Warping | Moderato | Alto |
| Superficie | Opaca, uniforme | Opaca, uniforme |
| Resistenza chimica | Buona | Buona |
| Prezzo | Leggermente più alto | Più basso |
| Odore durante la stampa | Moderato | Forte |
| Resistenza all'urto | Buona | Buona |
| Resistenza termica | ~95–105 °C | ~95–105 °C |

:::warning Ventilazione
L'ASA emette gas durante la stampa che possono essere irritanti. Stampa in una stanza ben ventilata o con un sistema di filtraggio dell'aria. Non stampare ASA in una stanza dove soggiorni a lungo senza ventilazione.
:::

## Essiccazione

L'ASA è **moderatamente igroscopico** e assorbe umidità dall'aria nel tempo.

| Parametro | Valore |
|-----------|--------|
| Temperatura di essiccazione | 65 °C |
| Tempo di essiccazione | 4–6 ore |
| Livello igroscopico | Medio |
| Segni di umidità | Scoppiettii, bolle, superficie scadente |

- Conservare in busta sigillata con gel di silice dopo l'apertura
- L'AMS con essiccante è sufficiente per la conservazione a breve termine
- Per conservazione prolungata: usare buste sottovuoto o scatola essiccatrice per filamento

## Applicazioni

L'ASA è il materiale preferito per tutto ciò che verrà utilizzato **all'esterno**:

- **Componenti auto** — alloggiamenti specchietti, dettagli cruscotto, cappucci ventilazione
- **Attrezzi da giardino** — supporti, morsetti, parti per mobili da giardino
- **Segnaletica esterna** — cartelli, lettere, loghi
- **Parti per droni** — carrello di atterraggio, supporti fotocamera
- **Montaggi pannelli solari** — supporti e angolari
- **Parti per cassetta postale** — meccanismi e decorazioni

## Consigli per una stampa ASA di successo

### Brim e adesione

- **Usa il brim** per pezzi grandi e pezzi con poca superficie di contatto
- Un brim di 5–8 mm previene efficacemente il warping
- Per pezzi più piccoli puoi provare senza brim, ma tienilo pronto come backup

### Evitare correnti d'aria

- **Chiudi tutte le porte e finestre** della stanza durante la stampa
- Le correnti d'aria e l'aria fredda sono il peggior nemico dell'ASA
- Non aprire la porta della camera durante la stampa

### Stabilità della temperatura

- Lascia riscaldare la camera per **10–15 minuti** prima dell'inizio della stampa
- Una temperatura della camera stabile dà risultati più uniformi
- Evita di posizionare la stampante vicino a finestre o bocchette di ventilazione

### Raffreddamento

- L'ASA necessita di **raffreddamento limitato** — 30–50% è tipico
- Per sporgenze e ponti puoi aumentare al 60–70%, ma aspettati qualche delaminazione
- Per parti meccaniche: dai priorità all'adesione tra strati rispetto ai dettagli riducendo il raffreddamento

:::tip Prima volta con l'ASA?
Inizia con un piccolo pezzo di prova (es. un cubo da 30 mm) per calibrare le impostazioni. L'ASA si comporta in modo molto simile all'ABS, ma con una tendenza al warping leggermente inferiore. Se hai esperienza con l'ABS, l'ASA ti sembrerà un upgrade.
:::

---

## Ritiro

L'ASA si ritira più del PLA e del PETG, ma generalmente un po' meno dell'ABS:

| Materiale | Ritiro |
|-----------|--------|
| PLA | ~0,3–0,5% |
| PETG | ~0,3–0,6% |
| ASA | ~0,5–0,7% |
| ABS | ~0,7–0,8% |

Per pezzi con tolleranze strette: compensa con 0,5–0,7% nello slicer, o testa prima con pezzi di prova.

---

## Post-lavorazione

- **Levigatura con acetone** — l'ASA può essere levigato con vapori di acetone, come l'ABS
- **Carteggiatura** — si carteggia bene con carta abrasiva grana 200–400
- **Incollaggio** — la colla CA o la saldatura con acetone funzionano eccellentemente
- **Verniciatura** — accetta bene la vernice dopo una leggera carteggiatura

:::danger Manipolazione dell'acetone
L'acetone è infiammabile ed emette vapori tossici. Usare sempre in un ambiente ben ventilato, evitare fiamme libere e usare dispositivi di protezione (guanti e occhiali).
:::
