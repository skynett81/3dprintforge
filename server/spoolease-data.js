/**
 * SpoolEase-derived data catalogs for enhanced filament management.
 * Source: https://github.com/yanshay/SpoolEase (Apache-2.0 with Commons Clause)
 *
 * 1. Spool core weights (200+ manufacturers)
 * 2. Bambu Lab filament codes (90+ codes)
 * 3. Material types with slicer codes and temp ranges
 */

// ---- Spool Core Weights ----
// Format: [name, weight_g]
export const SPOOL_CORE_WEIGHTS = [
  ['3D FilaPrint - Cardboard', 210], ['3D FilaPrint - Plastic', 238], ['3D Fuel - Plastic', 264],
  ['3D Power - Plastic', 220], ['3D Solutech - Plastic', 173], ['3DE - Cardboard', 136],
  ['3DE - Plastic', 181], ['3DHOJOR - Cardboard', 157], ['3DJake - Cardboard', 209],
  ['3DJake - Plastic', 232], ['3DJake 250g - Plastic', 91], ['3DXTech - Plastic', 258],
  ['AIO Robotics 250g - Plastic', 120], ['Amazon Basics - Plastic', 190],
  ['American Filament - Plastic', 310], ['Amolen - Plastic', 150], ['AMZ3D - Plastic', 233],
  ['Anycubic - Cardboard', 125], ['Anycubic - Plastic', 127], ['Atomic Filament - Plastic', 272],
  ['Aurapol PLA', 220], ['Azure Film - Plastic', 163],
  ['Bambu Lab - High Temp Grey', 216], ['Bambu Lab - Low Temp Clear', 250],
  ['Bambu Lab - Low Temp Light Grey', 208], ['Bambu Lab - White', 253],
  ['CC3D PETG', 162], ['Coex3D - Cardboard', 190], ['Colorfabb - Plastic', 236],
  ['Colorfabb 750g - Cardboard', 152], ['Colorfabb 750g - Plastic', 254],
  ['Comgrow - Cardboard', 166], ['Creality - Cardboard', 180], ['Creality - Plastic', 135],
  ['Das Filament - Plastic', 211], ['Devil Designs - Plastic', 256],
  ['Duramic 3D - Cardboard', 136], ['Eibos - Plastic', 184],
  ['Elegoo - Cardboard', 153], ['Elegoo - Plastic', 111],
  ['Eryone - Cardboard', 156], ['Eryone - Plastic', 187],
  ['eSUN - Cardboard', 147], ['eSUN - Plastic (Black)', 240], ['eSUN - Plastic (Clear)', 209],
  ['eSUN 2.5kg - Plastic', 634], ['Extrudr - Plastic', 244],
  ['Fiberlogy - Plastic (ABS)', 260], ['Filament PM - Plastic', 224],
  ['Fillamentum - Plastic', 230], ['Flashforge - Plastic', 167],
  ['FormFutura - Cardboard', 155], ['FormFutura 750g - Plastic', 212],
  ['Fusion Filaments - Plastic', 162], ['Geeetech - Plastic', 178],
  ['Hatchbox - Plastic', 225], ['Inland (Micro Center) - Cardboard', 142],
  ['Inland (Micro Center) - Plastic', 210], ['Jayo - Cardboard', 120],
  ['Jayo - Plastic', 126], ['Jayo 250g - Plastic', 58],
  ['Kexcelled - Cardboard', 204], ['Kingroon - Cardboard', 155], ['Kingroon - Plastic', 156],
  ['KVP - Plastic (Clear)', 263], ['KVP - Plastic (Black)', 337],
  ['Matter Hackers - Plastic', 215], ['MG Chemicals - Cardboard', 150],
  ['MG Chemicals - Plastic', 239], ['Mika3D - Plastic', 175],
  ['MonoPrice - Plastic', 221], ['Numakers - Plastic', 198],
  ['Overture - Cardboard', 150], ['Overture - Plastic', 237],
  ['PolyMaker - Cardboard', 137], ['PolyMaker - Plastic', 220],
  ['PolyMaker 3kg - Cardboard', 418], ['Polymaker PolyTerra PLA', 139],
  ['PrimaSelect - Plastic', 222], ['ProtoPasta - Cardboard', 80],
  ['Prusament - Plastic', 201], ['Prusament - Cardboard Core', 196],
  ['Prusament 2kg', 209], ['Rosa3D - Plastic', 245],
  ['Sakata3D - Plastic', 205], ['Siddament - Cardboard', 125],
  ['Snapmaker - Cardboard', 148], ['Sovol - Cardboard', 145],
  ['Spectrum - Cardboard', 180], ['Spectrum - Plastic', 257],
  ['Sunlu - Plastic', 117], ['Sunlu - Plastic V2', 165], ['Sunlu V3', 179],
  ['Sunlu 250g - Plastic', 55], ['TTYT3D - Cardboard', 121], ['TTYT3D - Plastic', 190],
  ['UltiMaker - Plastic', 235], ['UltiMaker 750g', 229],
  ['Voxelab - Plastic', 171], ['Wanhao - Plastic', 267], ['Ziro - Plastic', 166],
  ['ZYLtech - Plastic', 179], ['add:north - Plastic', 220],
  ['AnkerMake - Plastic', 200], ['BASF - Plastic', 250],
  ['Bambu Lab Refill', 0], ['Generic Cardboard', 150], ['Generic Plastic', 200],
];

// ---- Bambu Lab Filament Codes ----
// Format: [code, name, temp_min, temp_max, material_type]
export const BAMBU_FILAMENT_CODES = [
  ['GFA00', 'Bambu PLA Basic', 190, 240, 'PLA'],
  ['GFA01', 'Bambu PLA Matte', 190, 240, 'PLA'],
  ['GFA02', 'Bambu PLA Metal', 190, 240, 'PLA'],
  ['GFA05', 'Bambu PLA Silk', 190, 240, 'PLA'],
  ['GFA06', 'Bambu PLA Silk+', 190, 240, 'PLA'],
  ['GFA07', 'Bambu PLA Marble', 190, 240, 'PLA'],
  ['GFA08', 'Bambu PLA Sparkle', 190, 240, 'PLA'],
  ['GFA09', 'Bambu PLA Tough', 190, 240, 'PLA'],
  ['GFA10', 'Bambu PLA Basic 2.0', 190, 240, 'PLA'],
  ['GFA11', 'Bambu PLA Aero', 210, 260, 'PLA-AERO'],
  ['GFA12', 'Bambu PLA Glow', 190, 240, 'PLA'],
  ['GFA13', 'Bambu PLA Dynamic', 190, 240, 'PLA'],
  ['GFA15', 'Bambu PLA Galaxy', 190, 240, 'PLA'],
  ['GFA16', 'Bambu PLA Wood', 190, 240, 'PLA'],
  ['GFA17', 'Bambu PLA Translucent', 190, 240, 'PLA'],
  ['GFA18', 'Bambu PLA Lite', 190, 240, 'PLA'],
  ['GFA50', 'Bambu PLA-CF', 210, 250, 'PLA-CF'],
  ['GFB00', 'Bambu ABS', 240, 280, 'ABS'],
  ['GFB01', 'Bambu ASA', 240, 280, 'ASA'],
  ['GFB02', 'Bambu ASA-Aero', 240, 280, 'ASA-AERO'],
  ['GFB50', 'Bambu ABS-GF', 240, 280, 'ABS-GF'],
  ['GFB51', 'Bambu ASA-CF', 250, 280, 'ASA-CF'],
  ['GFC00', 'Bambu PC', 260, 290, 'PC'],
  ['GFC01', 'Bambu PC FR', 260, 290, 'PC'],
  ['GFG00', 'Bambu PETG Basic', 230, 270, 'PETG'],
  ['GFG01', 'Bambu PETG Translucent', 230, 270, 'PETG'],
  ['GFG02', 'Bambu PETG HF', 230, 270, 'PETG'],
  ['GFG50', 'Bambu PETG-CF', 240, 270, 'PETG-CF'],
  ['GFN03', 'Bambu PA-CF', 260, 300, 'PA-CF'],
  ['GFN04', 'Bambu PAHT-CF', 260, 300, 'PA-CF'],
  ['GFN05', 'Bambu PA6-CF', 260, 300, 'PA6-CF'],
  ['GFN06', 'Bambu PPA-CF', 280, 320, 'PPA-CF'],
  ['GFN07', 'Bambu PPA-GF', 280, 320, 'PPA-GF'],
  ['GFN08', 'Bambu PA6-GF', 260, 300, 'PA-GF'],
  ['GFS00', 'Bambu Support W', 190, 240, 'PLA-S'],
  ['GFS02', 'Bambu Support For PLA', 190, 240, 'PLA-S'],
  ['GFS03', 'Bambu Support For PA/PET', 260, 300, 'PA-S'],
  ['GFS04', 'Bambu PVA', 210, 250, 'PVA'],
  ['GFS05', 'Bambu Support For PLA/PETG', 190, 240, 'PLA-S'],
  ['GFS06', 'Bambu Support for ABS', 240, 270, 'ABS-S'],
  ['GFT01', 'Bambu PET-CF', 260, 290, 'PET-CF'],
  ['GFT02', 'Bambu PPS-CF', 310, 340, 'PPS-CF'],
  ['GFU00', 'Bambu TPU 95A HF', 200, 250, 'TPU'],
  ['GFU01', 'Bambu TPU 95A', 200, 250, 'TPU'],
  ['GFU02', 'Bambu TPU for AMS', 220, 240, 'TPU-AMS'],
  ['GFU03', 'Bambu TPU 90A', 200, 240, 'TPU'],
  ['GFU04', 'Bambu TPU 85A', 200, 240, 'TPU'],
  // Third-party with Bambu codes
  ['GFB60', 'PolyLite ABS', 240, 280, 'ABS'],
  ['GFB61', 'PolyLite ASA', 240, 280, 'ASA'],
  ['GFG60', 'PolyLite PETG', 220, 260, 'PETG'],
  ['GFL00', 'PolyLite PLA', 190, 240, 'PLA'],
  ['GFL01', 'PolyTerra PLA', 190, 240, 'PLA'],
  ['GFL03', 'eSUN PLA+', 190, 240, 'PLA'],
  ['GFL04', 'Overture PLA', 190, 240, 'PLA'],
  ['GFL05', 'Overture Matte PLA', 190, 240, 'PLA'],
  ['GFSNL02', 'SUNLU PLA Matte', 205, 245, 'PLA'],
  ['GFSNL03', 'SUNLU PLA+', 190, 240, 'PLA'],
  ['GFSNL08', 'SUNLU PETG', 230, 280, 'PETG'],
  // Generics
  ['GFL95', 'Generic PLA High Speed', 190, 240, 'PLA'],
  ['GFL99', 'Generic PLA', 190, 240, 'PLA'],
  ['GFL98', 'Generic PLA-CF', 190, 240, 'PLA-CF'],
  ['GFB98', 'Generic ASA', 240, 280, 'ASA'],
  ['GFB99', 'Generic ABS', 240, 280, 'ABS'],
  ['GFC99', 'Generic PC', 260, 290, 'PC'],
  ['GFG97', 'Generic PCTG', 240, 270, 'PCTG'],
  ['GFG98', 'Generic PETG-CF', 240, 270, 'PETG-CF'],
  ['GFG99', 'Generic PETG', 220, 270, 'PETG'],
  ['GFN98', 'Generic PA-CF', 260, 300, 'PA-CF'],
  ['GFN99', 'Generic PA', 240, 280, 'PA'],
  ['GFP97', 'Generic PP', 220, 250, 'PP'],
  ['GFS97', 'Generic BVOH', 190, 240, 'BVOH'],
  ['GFS98', 'Generic HIPS', 220, 270, 'HIPS'],
  ['GFS99', 'Generic PVA', 190, 240, 'PVA'],
  ['GFU98', 'Generic TPU for AMS', 200, 250, 'TPU-AMS'],
  ['GFU99', 'Generic TPU', 200, 250, 'TPU'],
];

// ---- Material Types with Slicer Codes ----
// Format: [material, slicer_code, temp_min, temp_max]
export const MATERIAL_TYPES = [
  ['ABS', 'GFB99', 240, 280], ['ABS-GF', 'GFB50', 240, 280], ['ASA', 'GFB98', 240, 280],
  ['ASA-CF', 'GFB51', 240, 280], ['BVOH', 'GFS97', 190, 240], ['HIPS', 'GFS98', 220, 270],
  ['PA', 'GFN99', 260, 300], ['PA-CF', 'GFN98', 260, 300], ['PA-GF', 'GFN08', 260, 300],
  ['PA6-CF', 'GFN05', 260, 300], ['PC', 'GFC99', 260, 290], ['PCTG', 'GFG97', 220, 260],
  ['PE', 'GFP99', 190, 240], ['PET-CF', 'GFT01', 220, 260], ['PETG', 'GFG99', 220, 260],
  ['PETG-CF', 'GFG98', 220, 260], ['PLA', 'GFL99', 190, 240], ['PLA-AERO', 'GFA11', 190, 240],
  ['PLA-CF', 'GFL98', 190, 240], ['PP', 'GFP97', 220, 250], ['PPA-CF', 'GFN97', 280, 320],
  ['PPA-GF', 'GFN96', 280, 320], ['PPS', 'GFT97', 300, 340], ['PPS-CF', 'GFT98', 300, 340],
  ['PVA', 'GFS99', 190, 240], ['TPU', 'GFU99', 200, 250], ['TPU-AMS', 'GFU98', 200, 250],
];

// Lookup helpers
export function lookupFilamentCode(code) {
  if (!code) return null;
  const entry = BAMBU_FILAMENT_CODES.find(e => e[0] === code);
  if (!entry) return null;
  return { code: entry[0], name: entry[1], temp_min: entry[2], temp_max: entry[3], material: entry[4] };
}

export function lookupCoreWeight(brandName) {
  if (!brandName) return null;
  const lower = brandName.toLowerCase();
  // Exact match first
  const exact = SPOOL_CORE_WEIGHTS.find(e => e[0].toLowerCase() === lower);
  if (exact) return exact[1];
  // Partial match
  const partial = SPOOL_CORE_WEIGHTS.find(e => lower.includes(e[0].toLowerCase().split(' - ')[0].split(' ')[0]));
  return partial ? partial[1] : null;
}

export function lookupMaterialSlicerCode(material) {
  if (!material) return null;
  const entry = MATERIAL_TYPES.find(e => e[0] === material);
  return entry ? { material: entry[0], slicer_code: entry[1], temp_min: entry[2], temp_max: entry[3] } : null;
}
