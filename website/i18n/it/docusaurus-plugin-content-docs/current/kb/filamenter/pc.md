---
sidebar_position: 7
title: PC
description: Guida alla stampa in policarbonato con Bambu Lab — alta resistenza, resistenza termica e requisiti
---

# PC (Policarbonato)

Il policarbonato è uno dei materiali termoplastici più resistenti disponibili per la stampa FDM. Combina una resistenza all'urto estremamente elevata, resistenza termica fino a 110–130 °C e trasparenza naturale. Il PC è un materiale impegnativo da stampare, ma offre risultati che si avvicinano alla qualità dello stampaggio a iniezione.

## Impostazioni

| Parametro | PC puro | Blend PC-ABS | PC-CF |
|-----------|---------|-------------|-------|
| Temperatura ugello | 260–280 °C | 250–270 °C | 270–290 °C |
| Temperatura piatto | 100–120 °C | 90–110 °C | 100–120 °C |
| Temperatura camera | 50–60 °C (richiesto) | 45–55 °C | 50–60 °C |
| Raffreddamento pezzo | 0–20% | 20–30% | 0–20% |
| Velocità | 60–80% | 70–90% | 50–70% |
| Essiccazione necessaria | Sì (critico) | Sì | Sì (critico) |

## Piani di stampa consigliati

| Piano | Idoneità | Colla stick? |
|-------|----------|-------------|
| High Temp Plate | Eccellente (richiesto) | No |
| Engineering Plate | Accettabile | Sì |
| Textured PEI | Non consigliato | — |
| Cool Plate (Smooth PEI) | Non usare | — |

:::danger High Temp Plate è richiesto
Il PC richiede temperature del piatto di 100–120 °C. Cool Plate e Textured PEI non sopportano queste temperature e verranno danneggiati. Usa **sempre** High Temp Plate per PC puro.
:::

## Requisiti di stampante e attrezzatura

### Enclosure (richiesto)

Il PC richiede una **camera completamente chiusa** con temperatura stabile di 50–60 °C. Senza di essa sperimenterai warping severo, delaminazione e separazione degli strati.

### Ugello temprato (fortemente consigliato)

Il PC puro non è abrasivo, ma PC-CF e PC-GF **richiedono un ugello in acciaio temprato** (es. Bambu Lab HS01). Per il PC puro, un ugello temprato è comunque consigliato per le alte temperature.

### Compatibilità stampanti

| Stampante | Adatta per PC? | Note |
|-----------|---------------|------|
| X1C | Eccellente | Completamente chiusa, HS01 disponibile |
| X1E | Eccellente | Progettata per materiali ingegneristici |
| P1S | Limitata | Chiusa, ma senza riscaldamento attivo della camera |
| P1P | Non consigliata | Senza enclosure |
| A1 / A1 Mini | Non usare | Telaio aperto, temperature troppo basse |

:::warning Solo X1C e X1E consigliate
Il PC richiede riscaldamento attivo della camera per risultati consistenti. La P1S può dare risultati accettabili con pezzi piccoli, ma aspettati warping e delaminazione con pezzi più grandi.
:::

## Essiccazione

Il PC è **altamente igroscopico** e assorbe umidità rapidamente. Un PC umido dà risultati di stampa catastrofici.

| Parametro | Valore |
|-----------|--------|
| Temperatura di essiccazione | 70–80 °C |
| Tempo di essiccazione | 6–8 ore |
| Livello igroscopico | Alto |
| Umidità max consigliata | < 0,02% |

- **Sempre** essiccare il PC prima della stampa — anche bobine appena aperte possono aver assorbito umidità
- Stampare direttamente dalla scatola essiccatrice se possibile
- L'AMS **non è sufficiente** per la conservazione del PC — l'umidità è troppo alta
- Usare un essiccatore per filamento dedicato con riscaldamento attivo

:::danger L'umidità distrugge le stampe in PC
Segni di PC umido: scoppiettii forti, bolle sulla superficie, adesione tra strati pessima, stringing. Il PC umido non può essere compensato con le impostazioni — **deve** essere essiccato prima.
:::

## Proprietà

| Proprietà | Valore |
|-----------|--------|
| Resistenza a trazione | 55–75 MPa |
| Resistenza all'urto | Estremamente alta |
| Resistenza termica (HDT) | 110–130 °C |
| Trasparenza | Sì (variante naturale/trasparente) |
| Resistenza chimica | Moderata |
| Resistenza UV | Moderata (ingiallisce nel tempo) |
| Ritiro | ~0,5–0,7% |

## Blend PC

### PC-ABS

Una miscela di policarbonato e ABS che combina i punti di forza di entrambi i materiali:

- **Più facile da stampare** del PC puro — temperature più basse e meno warping
- **Resistenza all'urto** tra ABS e PC
- **Popolare nell'industria** — usato in interni auto e alloggiamenti elettronici
- Stampa a 250–270 °C ugello, 90–110 °C piatto

### PC-CF (fibra di carbonio)

PC rinforzato con fibra di carbonio per massima rigidità e resistenza:

- **Estremamente rigido** — ideale per parti strutturali
- **Leggero** — la fibra di carbonio riduce il peso
- **Richiede ugello temprato** — l'ottone si usura in ore
- Stampa a 270–290 °C ugello, 100–120 °C piatto
- Più costoso del PC puro, ma offre proprietà meccaniche vicine all'alluminio

### PC-GF (fibra di vetro)

PC rinforzato con fibra di vetro:

- **Più economico del PC-CF** con buona rigidità
- **Superficie più bianca** del PC-CF
- **Richiede ugello temprato** — le fibre di vetro sono molto abrasive
- Leggermente meno rigido del PC-CF, ma migliore resistenza all'urto

## Applicazioni

Il PC viene usato dove serve **massima resistenza e/o resistenza termica**:

- **Parti meccaniche** — ingranaggi, supporti, giunti sotto carico
- **Parti ottiche** — lenti, guide luce, coperture trasparenti (PC trasparente)
- **Parti resistenti al calore** — vano motore, vicino a elementi riscaldanti
- **Alloggiamenti elettronici** — involucri protettivi con buona resistenza all'urto
- **Utensili e maschere** — utensili di montaggio di precisione

## Consigli per una stampa PC di successo

### Primo strato

- Ridurre la velocità al **30–40%** per il primo strato
- Aumentare la temperatura del piatto di 5 °C sopra lo standard per i primi 3–5 strati
- **Il brim è obbligatorio** per la maggior parte dei pezzi PC — usa 8–10 mm

### Temperatura della camera

- La camera deve raggiungere **50 °C+** prima dell'inizio della stampa
- **Non aprire la porta della camera** durante la stampa — il calo di temperatura causa warping immediato
- Dopo la stampa: lasciare raffreddare il pezzo **lentamente** nella camera (1–2 ore)

### Raffreddamento

- Usare **raffreddamento minimo** (0–20%) per la migliore adesione tra strati
- Per ponti e sporgenze: aumentare temporaneamente al 30–40%
- Dare priorità alla resistenza degli strati rispetto all'estetica con il PC

### Considerazioni di progettazione

- **Evitare angoli vivi** — arrotondare con raggio minimo di 1 mm
- **Spessore parete uniforme** — spessori irregolari creano tensioni interne
- **Le grandi superfici piatte** sono difficili — dividere o aggiungere nervature

:::tip Nuovo con il PC? Inizia con PC-ABS
Se non hai mai stampato PC, inizia con un blend PC-ABS. È molto più tollerante del PC puro e ti dà esperienza con il materiale senza i requisiti estremi. Una volta padroneggiato il PC-ABS, passa al PC puro.
:::

---

## Post-lavorazione

- **Carteggiatura** — il PC si carteggia bene, ma usa carteggiatura bagnata per PC trasparente
- **Lucidatura** — il PC trasparente può essere lucidato fino a qualità quasi ottica
- **Incollaggio** — l'incollaggio con diclorometano dà giunti invisibili (usa protezioni!)
- **Verniciatura** — richiede primer per buona adesione
- **Ricottura** — 120 °C per 1–2 ore riduce le tensioni interne

:::warning Incollaggio con diclorometano
Il diclorometano è tossico e richiede aspirazione, guanti resistenti ai prodotti chimici e occhiali protettivi. Lavorare sempre in un ambiente ben ventilato o sotto cappa aspirante.
:::
