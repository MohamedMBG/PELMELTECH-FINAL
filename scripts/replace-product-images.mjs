import sharp from 'sharp';
import path from 'node:path';
import fs from 'node:fs';

const SRC_DIR = 'C:/Users/omen/Downloads/SITE 2026/SITE 2026/output/product-images';
const OUT_DIR = path.resolve('public/images/products/main');

const map = {
  'DECOUPE 1200mm CCD CAMERA.png': 'machine-de-decoupe-1200mm-avec-camera-ccd.webp',
  'LASER 1390 UNE TETE 130-150W CCD MAMERA.png': 'machine-decoupe-laser-co2-1390-avec-camera-ccd-une-tete-130w-150w.webp',
  'MACHINE CNC DECOUPE 1600x2500mm.png': 'machine-decoupe-cnc-1600x2500mm-fraiseuse.webp',
  "MACHINE D'IMPRESSIN EASYJET UV ROLL TO ROLL 1800mm DEUX TETES I3200.png": 'machine-d-impression-easyjet-uv-roll-to-roll-1800mm-2-tetes-epson-i3200.webp',
  "MACHINE D'IMPRESSION ECO 1800mm TETE-DEUX TETES I3200.png": 'machine-d-impression-eco-solvant-1800mm-1-ou-2-tetes-epson-i3200.webp',
  "MACHINE D'IMPRESSION ECO SOLVENT 3200mm DEUX-QUATRE TETES I3200.png": 'machine-d-impression-eco-solvant-3200mm-2-ou-4-tetes-epson-i3200.webp',
  "MACHINE D'IMPRESSION FLATBED UV 1290 TROIS TETES I3200.png": 'machine-d-impression-uv-flatbed-1290-3-tetes-epson-i3200.webp',
  "MACHINE D'IMPRESSION UV FLATED 2513 RICOH HEADS.png": 'machine-d-impression-uv-flatbed-2513-tetes-ricoh-gen5-gen6.webp',
  'MACHINE DE DECOUPE A4.png': 'machine-de-decoupe-a4-plotter-de-decoupe-de-bureau.webp',
  'MACHINE DTF 30CM DEUX TETEX I3200-XP600.png': 'machine-d-impression-dtf-30cm-2-tetes-epson-i3200-xp600.webp',
  'MACHINE DTF 600cm TWO HEADS I3200-XP600.png': 'machine-d-impression-dtf-60cm-2-tetes-epson-i3200-xp600.webp',
  'MACHINE DTG 4050 DEUX TETES I3200.png': 'machine-d-impression-dtg-direct-to-garment-4050-2-tetes-epson-i3200.webp',
  'MACHINE ECO SOLVENT 3200mm XLINE QUATRE TETES I3200.png': 'machine-d-impression-eco-solvant-xline-3200mm-4-tetes-epson-i3200.webp',
  'MACHINE ELECTRIC DE LAMINATION 1630mm.png': 'lamineuse-electrique-industrielle-1630mm.webp',
  'MACHINE FLATBED DE DECOUPE FC5070E.png': 'table-de-decoupe-a-plat-flatbed-fc5070e.webp',
  'MACHINE GRAND FORMAT 3200mm 4TETES I3200.png': 'machine-d-impression-eco-solvant-grand-format-3200mm-4-tetes-epson-i3200.webp',
  'MACHINE SOLVENT ROLL TO ROLL 3200mm QUATRE TETES KONICA MINOLTA.png': 'machine-d-impression-solvant-roll-to-roll-3200mm-4-tetes-konica-minolta-512i.webp',
  'MACHINE TABLE UV 6090 TROIS TETES XP600-I3200.png': 'machine-d-impression-uv-flatbed-de-table-6090-3-tetes-epson-i3200-xp600.webp',
  'MACHINE UV DTF 30CM TETES I3200-XP600.png': 'machine-d-impression-uv-dtf-30cm-tetes-epson-i3200-xp600.webp',
  'MACHINE UV DTF 700mm 3PCS TETES I3200 U1.png': 'machine-d-impression-uv-dtf-roll-to-roll-700mm-3-tetes-epson-i3200-u1.webp',
  'PRESSE A CHAUD PNEUMATIQUE 60x40.png': 'presse-a-chaud-pneumatique-60x40cm.webp',
  'TABLE DE DECOUPE FC7090U.png': 'table-de-decoupe-a-plat-flatbed-fc7090u.webp',
};

const targetProductWidth = 900;
const targetProductHeight = 675;

async function convert(srcFile, destFile) {
  const srcPath = path.join(SRC_DIR, srcFile);
  const destPath = path.join(OUT_DIR, destFile);

  const trimmed = await sharp(srcPath).trim().toBuffer();

  const resized = await sharp(trimmed)
    .resize({ width: targetProductWidth, height: targetProductHeight, fit: 'inside' })
    .toBuffer({ resolveWithObject: true });

  const padX = Math.floor((1200 - resized.info.width) / 2);
  const padY = Math.floor((900 - resized.info.height) / 2);

  await sharp(resized.data)
    .extend({
      top: padY,
      bottom: 900 - resized.info.height - padY,
      left: padX,
      right: 1200 - resized.info.width - padX,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .webp({ quality: 85 })
    .toFile(destPath);

  console.log(`${srcFile} -> ${destFile}`);
}

const entries = Object.entries(map);
for (const [src, dest] of entries) {
  if (!fs.existsSync(path.join(SRC_DIR, src))) {
    console.error(`MISSING SOURCE: ${src}`);
    continue;
  }
  await convert(src, dest);
}
console.log(`Done. ${entries.length} images processed.`);
