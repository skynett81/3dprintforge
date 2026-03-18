/**
 * Bambu Lab RFID Library — complete variant→color mapping.
 * Source: https://github.com/skynett81/Bambu-Lab-RFID-Library
 * Combined with SpoolEase bambu-color-names.csv for hex codes.
 *
 * Format: [variant_id, product_code, material_name, color_name, material_id, color_hex]
 */

export const BAMBU_VARIANTS = [
  // ── PLA Basic ──
  ['A00-W1','10100','PLA Basic','Jade White','GFA00','FFFEF2'],
  ['A00-P0','10201','PLA Basic','Beige','GFA00','F7E6DE'],
  ['A00-D2','10104','PLA Basic','Light Gray','GFA00','D1D3D5'],
  ['A00-Y0','10400','PLA Basic','Yellow','GFA00','F4EE2A'],
  ['A00-Y2','10402','PLA Basic','Sunflower Yellow','GFA00','FEC600'],
  ['A00-A1','10301','PLA Basic','Pumpkin Orange','GFA00','FF9016'],
  ['A00-A0','10300','PLA Basic','Orange','GFA00','FF6A13'],
  ['A00-Y4','10401','PLA Basic','Gold','GFA00','E4BD68'],
  ['A00-G3','10503','PLA Basic','Bright Green','GFA00','BECF00'],
  ['A00-G1','10501','PLA Basic','Bambu Green','GFA00','00AE42'],
  ['A00-G2','10502','PLA Basic','Mistletoe Green','GFA00','3F8E43'],
  ['A00-R3','10204','PLA Basic','Hot Pink','GFA00','F5547C'],
  ['A00-R1','10203','PLA Basic','Pink','GFA00','F55A74'],
  ['A00-P6','10202','PLA Basic','Magenta','GFA00','EC008C'],
  ['A00-R0','10200','PLA Basic','Red','GFA00','C12E1F'],
  ['A00-R2','10205','PLA Basic','Maroon Red','GFA00','9D2235'],
  ['A00-P5','10700','PLA Basic','Purple','GFA00','5E43B7'],
  ['A00-P2','10701','PLA Basic','Indigo Purple','GFA00','482960'],
  ['A00-B5','10605','PLA Basic','Turquoise','GFA00','00B1B7'],
  ['A00-B8','10603','PLA Basic','Cyan','GFA00','0086D6'],
  ['A00-B3','10604','PLA Basic','Cobalt Blue','GFA00','0056B8'],
  ['A09-B4','10601','PLA Basic','Blue','GFA00','0A2989'],
  ['A00-N0','10800','PLA Basic','Brown','GFA00','9D432C'],
  ['A00-N1','10802','PLA Basic','Cocoa Brown','GFA00','6F5034'],
  ['A00-Y3','10801','PLA Basic','Bronze','GFA00','847D48'],
  ['A00-D0','10103','PLA Basic','Gray','GFA00','8E9089'],
  ['A00-D1','10102','PLA Basic','Silver','GFA00','A6A9AA'],
  ['A00-B1','10602','PLA Basic','Blue Grey','GFA00','5B6579'],
  ['A00-D3','10105','PLA Basic','Dark Gray','GFA00','545454'],
  ['A00-K0','10101','PLA Basic','Black','GFA00','000000'],
  ['A00-G0','10500','PLA Basic','Green','GFA00','164B35'],
  // ── PLA Basic Gradient ──
  ['A00-M0','10900','PLA Basic Gradient','Arctic Whisper','GFA00','FFFFFF'],
  ['A00-M1','10901','PLA Basic Gradient','Solar Breeze','GFA00','E94B3C'],
  ['A00-M2','10902','PLA Basic Gradient','Ocean to Meadow','GFA00','307FE2'],
  ['A00-M3','10903','PLA Basic Gradient','Pink Citrus','GFA00','F78F77'],
  ['A00-M4','10904','PLA Basic Gradient','Mint Lime','GFA00','4EC939'],
  ['A00-M5','10905','PLA Basic Gradient','Blueberry Bubblegum','GFA00','6FCAEF'],
  ['A00-M6','10906','PLA Basic Gradient','Dusk Glare','GFA00','CE4406'],
  ['A00-M7','10907','PLA Basic Gradient','Cotton Candy Cloud','GFA00','8EC9E9'],
  // ── PLA Matte ──
  ['A01-W2','11100','PLA Matte','Ivory White','GFA01','FFFFFF'],
  ['A01-W3','11103','PLA Matte','Bone White','GFA01','CBC6B8'],
  ['A01-Y2','11400','PLA Matte','Lemon Yellow','GFA01','F7D959'],
  ['A01-Y3','11401','PLA Matte','Desert Tan','GFA01','E8DBB7'],
  ['A01-A2','11300','PLA Matte','Mandarin Orange','GFA01','F99963'],
  ['A01-P3','11201','PLA Matte','Sakura Pink','GFA01','E8AFCF'],
  ['A01-P4','11700','PLA Matte','Lilac Purple','GFA01','AE96D4'],
  ['A01-R3','11204','PLA Matte','Plum','GFA01','950051'],
  ['A01-R1','11200','PLA Matte','Scarlet Red','GFA01','DE4343'],
  ['A01-R4','11202','PLA Matte','Dark Red','GFA01','BB3D43'],
  ['A01-R2','11203','PLA Matte','Terracotta','GFA01','B15533'],
  ['A01-G0','11502','PLA Matte','Apple Green','GFA01','C2E189'],
  ['A01-G1','11500','PLA Matte','Grass Green','GFA01','61C680'],
  ['A01-G7','11501','PLA Matte','Dark Green','GFA01','68724D'],
  ['A01-B4','11601','PLA Matte','Ice Blue','GFA01','A3D8E1'],
  ['A01-B0','11603','PLA Matte','Sky Blue','GFA01','56B7E6'],
  ['A01-B3','11600','PLA Matte','Marine Blue','GFA01','0078BF'],
  ['A01-B6','11602','PLA Matte','Dark Blue','GFA01','042F56'],
  ['A01-N1','11800','PLA Matte','Latte Brown','GFA01','D3B7A7'],
  ['A01-N3','11803','PLA Matte','Caramel','GFA01','AE835B'],
  ['A01-N2','11801','PLA Matte','Dark Brown','GFA01','7D6556'],
  ['A01-N0','11802','PLA Matte','Dark Chocolate','GFA01','4D3324'],
  ['A01-D3','11102','PLA Matte','Ash Gray','GFA01','9B9EA0'],
  ['A01-D0','11104','PLA Matte','Nardo Gray','GFA01','757575'],
  ['A01-K1','11101','PLA Matte','Charcoal','GFA01','000000'],
  // ── PLA Silk+ ──
  ['A06-Y1','13405','PLA Silk+','Gold','GFA06','F4A925'],
  ['A06-D0','13108','PLA Silk+','Titan Gray','GFA06','5F6367'],
  ['A06-D1','13109','PLA Silk+','Silver','GFA06','C8C8C8'],
  ['A06-W0','13110','PLA Silk+','White','GFA06','FFFFFF'],
  ['A06-R0','13205','PLA Silk+','Candy Red','GFA06','D02727'],
  ['A06-G0','13506','PLA Silk+','Candy Green','GFA06','018814'],
  ['A06-G1','13507','PLA Silk+','Mint','GFA06','96DCB9'],
  ['A06-B1','13604','PLA Silk+','Blue','GFA06','008BDA'],
  ['A06-B0','13603','PLA Silk+','Baby Blue','GFA06','A8C6EE'],
  ['A06-P0','13702','PLA Silk+','Purple','GFA06','8671CB'],
  ['A06-R1','13206','PLA Silk+','Rose Gold','GFA06','BA9594'],
  ['A06-R2','13207','PLA Silk+','Pink','GFA06','F7ADA6'],
  ['A06-Y0','13404','PLA Silk+','Champagne','GFA06','F3CFB2'],
  // ── PLA Silk Multi-Color ──
  ['A05-T1','13901','PLA Silk Multi-Color','Gilded Rose','GFA05','FF9425'],
  ['A05-T2','13902','PLA Silk Multi-Color','Midnight Blaze','GFA05','0047BB'],
  ['A05-T3','13903','PLA Silk Multi-Color','Neon City','GFA05','BB22A3'],
  ['A05-T4','13904','PLA Silk Multi-Color','Blue Hawaii','GFA05','70C884'],
  ['A05-T5','13905','PLA Silk Multi-Color','Velvet Eclipse','GFA05','000000'],
  ['A05-M1','13906','PLA Silk Multi-Color','South Beach','GFA05','00918B'],
  ['A05-M4','13909','PLA Silk Multi-Color','Aurora Purple','GFA05','7F3696'],
  ['A05-M8','13912','PLA Silk Multi-Color','Dawn Radiance','GFA05','EC984C'],
  // ── PLA Glow ──
  ['A12-G0','15500','PLA Glow','Glow Green','GFA12','A1FFAC'],
  ['A12-R0','15200','PLA Glow','Glow Pink','GFA12','F17B8F'],
  ['A12-A0','15300','PLA Glow','Glow Orange','GFA12','FF9D5B'],
  ['A12-Y0','15400','PLA Glow','Glow Yellow','GFA12','F8FF80'],
  ['A12-B0','15600','PLA Glow','Glow Blue','GFA12','7AC0E9'],
  // ── PLA Marble ──
  ['A07-R5','13201','PLA Marble','Red Granite','GFA07','AD4E38'],
  ['A07-D4','13103','PLA Marble','White Marble','GFA07','F7F3F0'],
  // ── PLA Sparkle ──
  ['A08-G3','13501','PLA Sparkle','Alpine Green','GFA08','3F5443'],
  ['A08-D5','13102','PLA Sparkle','Slate Gray','GFA08','8E9089'],
  ['A08-B7','13700','PLA Sparkle','Royal Purple','GFA08','483D8B'],
  ['A08-R2','13200','PLA Sparkle','Crimson Red','GFA08','792B36'],
  ['A08-K2','13101','PLA Sparkle','Onyx Black','GFA08','2D2B28'],
  ['A08-Y1','13402','PLA Sparkle','Classic Gold','GFA08','CEA629'],
  // ── PLA Metal ──
  ['A02-B2','13600','PLA Metal','Cobalt Blue Metallic','GFA02','39699E'],
  ['A02-G2','13500','PLA Metal','Oxide Green Metallic','GFA02','1D7C6A'],
  ['A02-Y1','13400','PLA Metal','Iridium Gold Metallic','GFA02','B39B84'],
  ['A02-N3','13800','PLA Metal','Copper Brown Metallic','GFA02','AA6443'],
  ['A02-D2','13100','PLA Metal','Iron Gray Metallic','GFA02','43403D'],
  // ── PLA Galaxy ──
  ['A15-B0','13602','PLA Galaxy','Purple','GFA15','594177'],
  ['A15-G0','13503','PLA Galaxy','Green','GFA15','3B665E'],
  ['A15-G1','13504','PLA Galaxy','Nebulae','GFA15','424379'],
  ['A15-R0','13203','PLA Galaxy','Brown','GFA15','684A43'],
  // ── PLA Wood ──
  ['A16-K0','13107','PLA Wood','Black Walnut','GFA16','4F3F24'],
  ['A16-R0','13204','PLA Wood','Rosewood','GFA16','4C241C'],
  ['A16-N0','13801','PLA Wood','Clay Brown','GFA16','995F11'],
  ['A16-G0','13505','PLA Wood','Classic Birch','GFA16','918669'],
  ['A16-W0','13106','PLA Wood','White Oak','GFA16','D6CCA3'],
  ['A16-Y0','13403','PLA Wood','Ochre Yellow','GFA16','C98935'],
  // ── PLA Translucent ──
  ['A17-B1','13611','PLA Translucent','Blue','GFA17','0047BB'],
  ['A17-A0','13301','PLA Translucent','Orange','GFA17','F74E02'],
  ['A17-P0','13710','PLA Translucent','Purple','GFA17','8344B0'],
  ['A17-R0','13210','PLA Translucent','Red','GFA17','B50011'],
  ['A17-G0','13510','PLA Translucent','Light Jade','GFA17','96D8AF'],
  ['A17-Y0','13410','PLA Translucent','Mellow Yellow','GFA17','F5DBAB'],
  ['A17-R1','13211','PLA Translucent','Cherry Pink','GFA17','F5B6CD'],
  ['A17-B0','13610','PLA Translucent','Ice Blue','GFA17','B8CDE9'],
  ['A17-P1','13711','PLA Translucent','Lavender','GFA17','B8ACD6'],
  // ── PLA-CF ──
  ['A50-D6','14101','PLA-CF','Lava Gray','GFA50','4D5054'],
  ['A50-K0','14100','PLA-CF','Black','GFA50','000000'],
  ['A50-B6','14601','PLA-CF','Royal Blue','GFA50','2842AD'],
  // ── PLA Lite ──
  ['A18-K0','16100','PLA Lite','Black','GFA18','000000'],
  ['A18-D0','16101','PLA Lite','Gray','GFA18','999D9D'],
  ['A18-W0','16103','PLA Lite','White','GFA18','FFFFFF'],
  ['A18-R0','16200','PLA Lite','Red','GFA18','C6001A'],
  ['A18-Y0','16400','PLA Lite','Yellow','GFA18','EFE255'],
  ['A18-B0','16600','PLA Lite','Cyan','GFA18','4DAFDA'],
  ['A18-B1','16601','PLA Lite','Blue','GFA18','004EA8'],
  // ── PLA Tough / Tough+ ──
  ['A09-B5','12005','PLA Tough','Lavender Blue','GFA09','6667AB'],
  ['A09-A0','12002','PLA Tough','Orange','GFA09','FF7F41'],
  ['A09-D1','12001','PLA Tough','Silver','GFA09','898D8D'],
  ['A09-R3','12003','PLA Tough','Vermilion Red','GFA09','DD3C22'],
  ['A09-Y0','12000','PLA Tough','Yellow','GFA09','FEDB00'],
  ['A10-K0','12104','PLA Tough+','Black','GFA10','000000'],
  ['A10-W0','12107','PLA Tough+','White','GFA10','FFFFFF'],
  ['A10-D0','12105','PLA Tough+','Gray','GFA10','AFB1AE'],
  // ── PLA Aero ──
  ['A11-W0','14102','PLA Aero','White','GFA11','FFFFFF'],
  ['A11-K0','14103','PLA Aero','Black','GFA11','000000'],
  // ── PETG HF ──
  ['G02-K0','33102','PETG HF','Black','GFG02','000000'],
  ['G02-W0','33100','PETG HF','White','GFG02','FFFFFF'],
  ['G02-R0','33200','PETG HF','Red','GFG02','BC0900'],
  ['G02-D0','33101','PETG HF','Gray','GFG02','ADB1B2'],
  ['G02-D1','33103','PETG HF','Dark Gray','GFG02','515151'],
  ['G02-Y1','33401','PETG HF','Cream','GFG02','F9DFB9'],
  ['G02-Y0','33400','PETG HF','Yellow','GFG02','FFD00B'],
  ['G02-A0','33300','PETG HF','Orange','GFG02','F75403'],
  ['G02-N1','33801','PETG HF','Peanut Brown','GFG02','875718'],
  ['G02-G1','33501','PETG HF','Lime Green','GFG02','6EE53C'],
  ['G02-G0','33500','PETG HF','Green','GFG02','00AE42'],
  ['G02-G2','33502','PETG HF','Forest Green','GFG02','39541A'],
  ['G02-B1','33601','PETG HF','Lake Blue','GFG02','1F79E5'],
  ['G02-B0','33600','PETG HF','Blue','GFG02','002E96'],
  // ── PETG Translucent ──
  ['G01-C0','32101','PETG Translucent','Clear','GFG01','FFFFFF'],
  ['G01-D0','32100','PETG Translucent','Gray','GFG01','8E8E8E'],
  ['G01-G0','32500','PETG Translucent','Olive','GFG01','748C45'],
  ['G01-G1','32501','PETG Translucent','Teal','GFG01','77EDD7'],
  ['G01-N0','32800','PETG Translucent','Brown','GFG01','C9A381'],
  ['G01-A0','32300','PETG Translucent','Orange','GFG01','FF911A'],
  ['G01-P1','32200','PETG Translucent','Pink','GFG01','F9C1BD'],
  ['G01-P0','32700','PETG Translucent','Purple','GFG01','D6ABFF'],
  ['G01-B0','32600','PETG Translucent','Light Blue','GFG01','61B0FF'],
  // ── PETG-CF ──
  ['G50-G7','31500','PETG-CF','Malachite Green','GFG50','16B08E'],
  ['G50-D6','31101','PETG-CF','Titan Gray','GFG50','565656'],
  ['G50-R4','31200','PETG-CF','Brick Red','GFG50','9F332A'],
  ['G50-P7','31700','PETG-CF','Violet Purple','GFG50','583061'],
  ['G50-K0','31100','PETG-CF','Black','GFG50','000000'],
  // ── PETG Basic ──
  ['G00-K0','30101','PETG Basic','Black','GFG00','000000'],
  ['G00-W0','30100','PETG Basic','White','GFG00','FFFFFF'],
  ['G00-R0','30200','PETG Basic','Red','GFG00','D6001C'],
  ['G00-G0','30500','PETG Basic','Green','GFG00','009639'],
  ['G00-B0','30600','PETG Basic','Blue','GFG00','001489'],
  ['G00-Y0','30400','PETG Basic','Yellow','GFG00','FCE300'],
  ['G00-A0','30300','PETG Basic','Orange','GFG00','FF671F'],
  // ── ABS ──
  ['B00-K0','40101','ABS','Black','GFB00','000000'],
  ['B00-W0','40100','ABS','White','GFB00','FFFFFF'],
  ['B00-D1','40102','ABS','Silver','GFB00','87909A'],
  ['B00-R0','40200','ABS','Red','GFB00','D32941'],
  ['B00-A0','40300','ABS','Orange','GFB00','FF6A13'],
  ['B00-Y1','40402','ABS','Tangerine Yellow','GFB00','FFC72C'],
  ['B00-Y0','40400','ABS','Yellow','GFB00','FCE900'],
  ['B00-G6','40500','ABS','Bambu Green','GFB00','00AE42'],
  ['B00-G7','40502','ABS','Olive','GFB00','789D4A'],
  ['B00-B0','40600','ABS','Blue','GFB00','0A2CA5'],
  ['B00-B4','40601','ABS','Azure','GFB00','489FDF'],
  ['B00-B6','40602','ABS','Navy Blue','GFB00','0C2340'],
  // ── ABS-GF ──
  ['B50-K0','41101','ABS-GF','Black','GFB50','000000'],
  ['B50-W0','41100','ABS-GF','White','GFB50','FFFFFF'],
  ['B50-R0','41200','ABS-GF','Red','GFB50','E83100'],
  ['B50-A0','41300','ABS-GF','Orange','GFB50','F48438'],
  ['B50-G0','41500','ABS-GF','Green','GFB50','61BF36'],
  // ── ASA ──
  ['B01-K0','45101','ASA','Black','GFB01','000000'],
  ['B01-W0','45100','ASA','White','GFB01','FFFAF2'],
  ['B01-D0','45102','ASA','Gray','GFB01','8A949E'],
  ['B01-R0','45200','ASA','Red','GFB01','E02928'],
  ['B01-B0','45600','ASA','Blue','GFB01','2140B4'],
  ['B02-W0','46100','ASA Aero','White','GFB02','F5F1DD'],
  ['B51-K0','46101','ASA-CF','Black','GFB51','000000'],
  // ── PC ──
  ['C00-K0','60101','PC','Black','GFC00','686865'],
  ['C00-W0','60100','PC','White','GFC00','FFFFFF'],
  ['C00-C0','60102','PC','Clear Black','GFC00','000000'],
  ['C00-C1','60103','PC','Transparent','GFC00','FFFFFF'],
  ['C01-K0','63100','PC FR','Black','GFC01','000000'],
  ['C01-W0','63101','PC FR','White','GFC01','FFFFFF'],
  ['C01-D0','63102','PC FR','Gray','GFC01','A8A8AA'],
  // ── TPU ──
  ['U02-B0','53600','TPU for AMS','Blue','GFU02','5898DD'],
  ['U02-D0','53102','TPU for AMS','Gray','GFU02','939393'],
  ['U02-K0','53101','TPU for AMS','Black','GFU02','000000'],
  ['U02-G0','53500','TPU for AMS','Neon Green','GFU02','90FF1A'],
  ['U02-W0','53100','TPU for AMS','White','GFU02','FFFFFF'],
  ['U02-R0','53200','TPU for AMS','Red','GFU02','ED0000'],
  ['U02-Y0','53400','TPU for AMS','Yellow','GFU02','F9EF41'],
  // ── PA ──
  ['N04-K0','70100','PAHT-CF','Black','GFN04','000000'],
  ['N08-K0','72104','PA6-GF','Black','GFN08','000000'],
  // ── Support ──
  ['S02-W0','65102','Support for PLA/PETG','Nature','GFS05','000000'],
  ['S05-C0','65103','Support for PLA/PETG','Black','GFS05','000000'],
  ['S02-W1','65104','Support for PLA','White','GFS02','FFFFFF'],
  ['S06-W0','66100','Support for ABS','White','GFS06','FFFFFF'],
  ['S03-G1','65500','Support for PA/PET','Green','GFS03','C0DF16'],
  ['S04-Y0','66400','PVA','Clear','GFS04','F0F1A8'],
];

// ── RFID tag field positions (MIFARE Classic 1K blocks) ──
export const RFID_BLOCK_MAP = {
  variant_id:       { block: 1, offset: 0, length: 8, type: 'ascii' },
  material_id:      { block: 1, offset: 8, length: 8, type: 'ascii' },
  filament_type:    { block: 2, offset: 0, length: 16, type: 'ascii' },
  detailed_type:    { block: 4, offset: 0, length: 16, type: 'ascii' },
  color_rgba:       { block: 5, offset: 0, length: 4, type: 'hex' },
  spool_weight:     { block: 5, offset: 4, length: 2, type: 'uint16le' },
  filament_diameter:{ block: 5, offset: 8, length: 4, type: 'float32le' },
  drying_temp:      { block: 6, offset: 0, length: 2, type: 'uint16le' },
  drying_time:      { block: 6, offset: 2, length: 2, type: 'uint16le' },
  max_hotend:       { block: 6, offset: 8, length: 2, type: 'uint16le' },
  min_hotend:       { block: 6, offset: 10, length: 2, type: 'uint16le' },
  tray_uid:         { block: 9, offset: 0, length: 16, type: 'hex' },
  production_date:  { block: 12, offset: 0, length: 16, type: 'ascii' },
  filament_length:  { block: 14, offset: 4, length: 2, type: 'uint16le' },
};

// ── Drying recommendations per material (from RFID data) ──
export const DRYING_RECOMMENDATIONS = [
  ['PLA', 55, 8, 'Tørk hvis du hører popping eller ser stringing'],
  ['PLA Matte', 55, 8, 'Samme som standard PLA'],
  ['PLA Silk+', 55, 8, 'Forsiktig med høy temp — kan ødelegge glans'],
  ['PLA-CF', 55, 8, 'Karbonfiberforsterket — tørk som standard PLA'],
  ['PLA Aero', 55, 8, 'Lett PLA — standard tørking'],
  ['PETG', 65, 8, 'Absorberer fukt over 1–3 uker i åpen luft'],
  ['PETG HF', 65, 8, 'High Flow PETG — samme tørking som standard'],
  ['PETG-CF', 65, 8, 'Karbonfiberforsterket PETG'],
  ['ABS', 80, 8, 'Mindre fuktighetssensitiv, men tørking forbedrer resultater'],
  ['ABS-GF', 80, 8, 'Glassfiberforsterket — standard ABS-tørking'],
  ['ASA', 80, 8, 'UV-stabilt — tørk som ABS'],
  ['ASA-CF', 80, 8, 'Karbonfiberforsterket ASA'],
  ['PC', 80, 12, 'Polykarbonat — svært fuktighetssensitiv'],
  ['PC FR', 80, 12, 'Flammehemmende PC — tørk grundig'],
  ['PA', 90, 12, 'Nylon — ekstremt fuktighetssensitiv, må være knusktørr'],
  ['PA-CF', 90, 12, 'Karbonfibernylon — tørk alltid før bruk'],
  ['PA6-CF', 90, 12, 'PA6 karbonfiber — krever grundig tørking'],
  ['PA6-GF', 90, 12, 'PA6 glassfiber — svært hygroskopisk'],
  ['PAHT-CF', 90, 12, 'Høytemperatur PA — tørk minst 12 timer'],
  ['PPA-CF', 90, 12, 'PPA karbonfiber — krever lang tørketid'],
  ['TPU', 55, 6, 'Fleksibelt filament — absorberer fukt raskt'],
  ['TPU for AMS', 55, 6, 'AMS-kompatibel TPU'],
  ['PVA', 55, 8, 'Støttemateriale — svært fuktighetssensitiv'],
  ['Support', 55, 6, 'Støttemateriale for PLA/PETG'],
];

// Lookup helpers
export function lookupVariant(variantId) {
  if (!variantId) return null;
  const clean = variantId.replace(/\s/g, '').toUpperCase();
  const entry = BAMBU_VARIANTS.find(e => e[0].toUpperCase() === clean);
  if (!entry) return null;
  return {
    variant_id: entry[0], product_code: entry[1], material_name: entry[2],
    color_name: entry[3], material_id: entry[4], color_hex: entry[5],
  };
}

export function lookupByProductCode(code) {
  if (!code) return null;
  const entry = BAMBU_VARIANTS.find(e => e[1] === String(code));
  if (!entry) return null;
  return {
    variant_id: entry[0], product_code: entry[1], material_name: entry[2],
    color_name: entry[3], material_id: entry[4], color_hex: entry[5],
  };
}

export function getVariantsForMaterial(materialId) {
  return BAMBU_VARIANTS
    .filter(e => e[4] === materialId)
    .map(e => ({ variant_id: e[0], product_code: e[1], material_name: e[2], color_name: e[3], color_hex: e[5] }));
}

export function getDryingRecommendation(materialName) {
  if (!materialName) return null;
  const lower = materialName.toLowerCase();
  const entry = DRYING_RECOMMENDATIONS.find(e => lower.includes(e[0].toLowerCase()));
  return entry ? { material: entry[0], temp_c: entry[1], hours: entry[2], notes: entry[3] } : null;
}
