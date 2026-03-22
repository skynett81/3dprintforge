---
sidebar_position: 5
title: PA / Nylon
description: Guida alla stampa nylon — essiccazione, colla stick, impostazioni e varianti
---

# PA / Nylon

Il nylon (poliammide / PA) è uno dei materiali per stampa 3D più resistenti e durevoli. È ideale per parti meccaniche, ingranaggi, cuscinetti e altri componenti ad alto carico.

## Impostazioni

| Parametro | PA6 | PA12 | PA-CF |
|-----------|-----|------|-------|
| Temperatura ugello | 260–280 °C | 250–270 °C | 270–290 °C |
| Temperatura piano | 70–90 °C | 60–80 °C | 80–100 °C |
| Raffreddamento pezzo | 0–30% | 0–30% | 0–20% |
| Essiccazione (obbligatoria) | 80 °C / 8–12 ore | 80 °C / 8 ore | 80 °C / 12 ore |

## Essiccazione — critica per il nylon

Il nylon è **estremamente igroscopico**. Assorbe umidità dall'aria in poche ore.

:::danger Essicca sempre il nylon
Il nylon umido produce risultati scadenti — stampa fragile, bolle, superficie bollosa e cattiva fusione degli strati. Essicca il nylon **immediatamente** prima della stampa, e usalo entro poche ore.

- **Temperatura:** 75–85 °C
- **Tempo:** 8–12 ore
- **Metodo:** Essiccatore di filamento o forno con ventola
:::

L'AMS di Bambu non è consigliato per il nylon senza configurazione sigillata e asciutta. Usa un alimentatore di filamento esterno direttamente alla stampante se possibile.

## Piani consigliati

| Piano | Idoneità | Colla stick? |
|-------|---------|----------|
| Engineering Plate (PEI testurizzato) | Eccellente | Sì (obbligatoria) |
| High Temp Plate | Buono | Sì (obbligatoria) |
| Cool Plate | Scarso | — |

:::warning La colla stick è obbligatoria
Il nylon aderisce male senza colla stick. Usa uno strato sottile e uniforme di colla stick (Bambu Lab o Pritt Stick). Senza colla stick il nylon si solleva dal piano.
:::

## Warping

Il nylon ha un warping significativo:
- Usa il brim (8–15 mm)
- Chiudi la camera (X1C/P1S danno i migliori risultati)
- Evita parti grandi e piatte senza brim
- Mantieni la ventilazione al minimo

## Varianti

### PA6 (Nylon 6)
Il più comune, buona resistenza e flessibilità. Assorbe molta umidità.

### PA12 (Nylon 12)
Più dimensionalmente stabile e assorbe meno umidità rispetto al PA6. Più facile da stampare.

### PA-CF (fibra di carbonio)
Molto rigido e leggero. Richiede ugello in acciaio indurito. Stampa in modo più secco rispetto al nylon standard.

### PA-GF (fibra di vetro)
Buona rigidità a costo inferiore rispetto al CF. Richiede ugello in acciaio indurito.

## Conservazione

Conserva il nylon in scatola sigillata con gel di silice aggressivo. La scatola di essiccazione di Bambu Lab è ideale. Non lasciare mai il nylon esposto all'aria overnight.
