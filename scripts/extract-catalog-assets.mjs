import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');

const RAW_DIR = 'C:/Users/pc/projectw/PELMELTECH-FINAL/public/catalogs/raw';
const IMG_MAIN_DIR = 'C:/Users/pc/projectw/PELMELTECH-FINAL/public/images/products/main';
const IMG_SEC_DIR = 'C:/Users/pc/projectw/PELMELTECH-FINAL/public/images/products/secondary';
const IMG_RENDERS_DIR = 'C:/Users/pc/projectw/PELMELTECH-FINAL/public/images/products/original-renders';
const IMG_REVIEW_DIR = 'C:/Users/pc/projectw/PELMELTECH-FINAL/public/images/products/review';

const DATA_REVIEW_FILE = 'C:/Users/pc/projectw/PELMELTECH-FINAL/src/data/product-images.review.json';
const REPORT_FILE = 'C:/Users/pc/projectw/PELMELTECH-FINAL/docs/product-image-extraction-report.md';
const VALIDATION_HTML_FILE = 'C:/Users/pc/projectw/PELMELTECH-FINAL/docs/product-image-validation.html';

// Ensure directories exist
fs.mkdirSync(IMG_MAIN_DIR, { recursive: true });
fs.mkdirSync(IMG_SEC_DIR, { recursive: true });
fs.mkdirSync(IMG_RENDERS_DIR, { recursive: true });
fs.mkdirSync(IMG_REVIEW_DIR, { recursive: true });
fs.mkdirSync(path.dirname(VALIDATION_HTML_FILE), { recursive: true });

const categoryMap = {
  "DECOUPE 1200mm CCD CAMERA.pdf": {
    name: "Machine de Découpe 1200mm avec Caméra CCD",
    categoryId: "cat-vinyl-cutting",
    subcategory: "Plotter de Découpe"
  },
  "LASER 1390 UNE TETE 130-150W CCD MAMERA.pdf": {
    name: "Machine Découpe Laser Co2 1390 avec Caméra CCD (Une Tête, 130W-150W)",
    categoryId: "cat-material-cutting",
    subcategory: "Découpe Laser"
  },
  "MACHINE CNC DECOUPE 1600x2500mm.pdf": {
    name: "Machine Découpe CNC 1600x2500mm (Fraiseuse)",
    categoryId: "cat-material-cutting",
    subcategory: "Fraiseuse CNC"
  },
  "MACHINE D'IMPRESSIN EASYJET UV ROLL TO ROLL 1800mm DEUX TETES I3200.pdf": {
    name: "Machine d'Impression EasyJet UV Roll-to-Roll 1800mm (2 Têtes Epson i3200)",
    categoryId: "cat-large-format",
    subcategory: "Impression Roll to Roll"
  },
  "MACHINE D'IMPRESSION ECO 1800mm TETE-DEUX TETES I3200.pdf": {
    name: "Machine d'Impression Éco-Solvant 1800mm (1 ou 2 Têtes Epson i3200)",
    categoryId: "cat-large-format",
    subcategory: "Impression Éco-Solvant"
  },
  "MACHINE D'IMPRESSION ECO SOLVENT 3200mm DEUX-QUATRE TETES I3200.pdf": {
    name: "Machine d'Impression Éco-Solvant 3200mm (2 ou 4 Têtes Epson i3200)",
    categoryId: "cat-large-format",
    subcategory: "Impression Éco-Solvant"
  },
  "MACHINE D'IMPRESSION FLATBED UV 1290 TROIS TETES I3200.pdf": {
    name: "Machine d'Impression UV Flatbed 1290 (3 Têtes Epson i3200)",
    categoryId: "cat-rigid-objects",
    subcategory: "Impression UV Flatbed"
  },
  "MACHINE D'IMPRESSION UV FLATED 2513 RICOH HEADS.pdf": {
    name: "Machine d'Impression UV Flatbed 2513 (Têtes Ricoh GEN5/GEN6)",
    categoryId: "cat-rigid-objects",
    subcategory: "Impression UV Flatbed"
  },
  "MACHINE DE DECOUPE A4.pdf": {
    name: "Machine de Découpe A4 (Plotter de Découpe de Bureau)",
    categoryId: "cat-vinyl-cutting",
    subcategory: "Plotter de Découpe"
  },
  "MACHINE DE DECOUPE CCD CAMERA 1200mm.pdf": {
    name: "Machine de Découpe 1200mm avec Caméra CCD",
    categoryId: "cat-vinyl-cutting",
    subcategory: "Plotter de Découpe"
  },
  "MACHINE DTF 30CM DEUX TETEX I3200-XP600.pdf": {
    name: "Machine d'Impression DTF 30cm (2 Têtes Epson i3200 / XP600)",
    categoryId: "cat-textile",
    subcategory: "Impression DTF"
  },
  "MACHINE DTF 600cm TWO HEADS I3200-XP600.pdf": {
    name: "Machine d'Impression DTF 60cm (2 Têtes Epson i3200 / XP600)",
    categoryId: "cat-textile",
    subcategory: "Impression DTF"
  },
  "MACHINE DTG 4050 DEUX TETES I3200.pdf": {
    name: "Machine d'Impression DTG Direct-to-Garment 4050 (2 Têtes Epson i3200)",
    categoryId: "cat-textile",
    subcategory: "Impression DTG"
  },
  "MACHINE ECO SOLVENT 3200mm XLINE QUATRE TETES I3200.pdf": {
    name: "Machine d'Impression Éco-Solvant XLine 3200mm (4 Têtes Epson i3200)",
    categoryId: "cat-large-format",
    subcategory: "Impression Éco-Solvant"
  },
  "MACHINE ELECTRIC DE LAMINATION 1630mm.pdf": {
    name: "Lamineuse Électrique Industrielle 1630mm",
    categoryId: "cat-lamination",
    subcategory: "Lamination"
  },
  "MACHINE FLATBED DE DECOUPE FC5070E.pdf": {
    name: "Table de Découpe à Plat Flatbed FC5070E",
    categoryId: "cat-vinyl-cutting",
    subcategory: "Table de Découpe"
  },
  "MACHINE GRAND FORMAT 3200mm 4TETES I3200.pdf": {
    name: "Machine d'Impression Éco-Solvant Grand Format 3200mm (4 Têtes Epson i3200)",
    categoryId: "cat-large-format",
    subcategory: "Impression Grand Format"
  },
  "MACHINE SOLVENT ROLL TO ROLL 3200mm QUATRE TETES KONICA MINOLTA.pdf": {
    name: "Machine d'Impression Solvant Roll-to-Roll 3200mm (4 Têtes Konica Minolta 512i)",
    categoryId: "cat-large-format",
    subcategory: "Impression Solvant"
  },
  "MACHINE TABLE UV 6090 TROIS TETES XP600-I3200.pdf": {
    name: "Machine d'Impression UV Flatbed de Table 6090 (3 Têtes Epson i3200 / XP600)",
    categoryId: "cat-rigid-objects",
    subcategory: "Impression UV Flatbed"
  },
  "MACHINE UV DTF 30CM TETES I3200-XP600.pdf": {
    name: "Machine d'Impression UV DTF 30cm (Têtes Epson i3200 / XP600)",
    categoryId: "cat-custom-objects",
    subcategory: "Impression UV DTF"
  },
  "MACHINE UV DTF 700mm 3PCS TETES I3200 U1.pdf": {
    name: "Machine d'Impression UV DTF Roll-to-Roll 700mm (3 Têtes Epson i3200 U1)",
    categoryId: "cat-custom-objects",
    subcategory: "Impression UV DTF"
  },
  "PRESSE A CHAUD PNEUMATIQUE 60x40.pdf": {
    name: "Presse à Chaud Pneumatique 60x40cm",
    categoryId: "cat-heat-press",
    subcategory: "Presse à Chaud"
  },
  "TABLE DE DECOUPE FC7090U.pdf": {
    name: "Table de Découpe à Plat Flatbed FC7090U",
    categoryId: "cat-material-cutting",
    subcategory: "Table de Découpe"
  }
};

const extractionConfig = {
  "DECOUPE 1200mm CCD CAMERA.pdf": { method: "crop", page: 1 },
  "LASER 1390 UNE TETE 130-150W CCD MAMERA.pdf": { method: "crop", page: 1 },
  "MACHINE CNC DECOUPE 1600x2500mm.pdf": { method: "crop", page: 1 },
  "MACHINE D'IMPRESSIN EASYJET UV ROLL TO ROLL 1800mm DEUX TETES I3200.pdf": { method: "embedded", mainIndex: 2, secIndex: null },
  "MACHINE D'IMPRESSION ECO 1800mm TETE-DEUX TETES I3200.pdf": { method: "embedded", mainIndex: 0, secIndex: null },
  "MACHINE D'IMPRESSION ECO SOLVENT 3200mm DEUX-QUATRE TETES I3200.pdf": { method: "embedded", mainIndex: 2, secIndex: null },
  "MACHINE D'IMPRESSION FLATBED UV 1290 TROIS TETES I3200.pdf": { method: "embedded", mainIndex: 10, secIndex: 11 },
  "MACHINE D'IMPRESSION UV FLATED 2513 RICOH HEADS.pdf": { method: "embedded", mainIndex: 6, secIndex: 7 },
  "MACHINE DE DECOUPE A4.pdf": { method: "embedded", mainIndex: 0, secIndex: null },
  "MACHINE DE DECOUPE CCD CAMERA 1200mm.pdf": { method: "embedded", mainIndex: 2, secIndex: null },
  "MACHINE DTF 30CM DEUX TETEX I3200-XP600.pdf": { method: "embedded", mainIndex: 5, secIndex: 6 },
  "MACHINE DTF 600cm TWO HEADS I3200-XP600.pdf": { method: "crop", page: 1 },
  "MACHINE DTG 4050 DEUX TETES I3200.pdf": { method: "embedded", mainIndex: 0, secIndex: null },
  "MACHINE ECO SOLVENT 3200mm XLINE QUATRE TETES I3200.pdf": { method: "crop", page: 1 },
  "MACHINE ELECTRIC DE LAMINATION 1630mm.pdf": { method: "embedded", mainIndex: 1, secIndex: 2 },
  "MACHINE FLATBED DE DECOUPE FC5070E.pdf": { method: "embedded", mainIndex: 0, secIndex: null },
  "MACHINE GRAND FORMAT 3200mm 4TETES I3200.pdf": { method: "crop", page: 1 },
  "MACHINE SOLVENT ROLL TO ROLL 3200mm QUATRE TETES KONICA MINOLTA.pdf": { method: "crop", page: 1 },
  "MACHINE TABLE UV 6090 TROIS TETES XP600-I3200.pdf": { method: "embedded", mainIndex: 1, secIndex: null },
  "MACHINE UV DTF 30CM TETES I3200-XP600.pdf": { method: "embedded", mainIndex: 0, secIndex: 1 },
  "MACHINE UV DTF 700mm 3PCS TETES I3200 U1.pdf": { method: "embedded", mainIndex: 0, secIndex: 1 },
  "PRESSE A CHAUD PNEUMATIQUE 60x40.pdf": { method: "embedded", mainIndex: 0, secIndex: null },
  "TABLE DE DECOUPE FC7090U.pdf": { method: "embedded", mainIndex: 0, secIndex: null }
};

const customCropBounds = {
  "DECOUPE 1200mm CCD CAMERA.pdf": { xMin: 0.52, yMin: 0.10, xMax: 0.98, yMax: 0.68 },
  "LASER 1390 UNE TETE 130-150W CCD MAMERA.pdf": { xMin: 0.04, yMin: 0.20, xMax: 0.48, yMax: 0.48 },
  "MACHINE CNC DECOUPE 1600x2500mm.pdf": { xMin: 0.53, yMin: 0.08, xMax: 0.98, yMax: 0.70 },
  "MACHINE DTF 600cm TWO HEADS I3200-XP600.pdf": { xMin: 0.55, yMin: 0.08, xMax: 0.98, yMax: 0.90 },
  "MACHINE ECO SOLVENT 3200mm XLINE QUATRE TETES I3200.pdf": { xMin: 0.02, yMin: 0.10, xMax: 0.48, yMax: 0.48 },
  "MACHINE GRAND FORMAT 3200mm 4TETES I3200.pdf": { xMin: 0.02, yMin: 0.11, xMax: 0.98, yMax: 0.55 },
  "MACHINE SOLVENT ROLL TO ROLL 3200mm QUATRE TETES KONICA MINOLTA.pdf": { xMin: 0.02, yMin: 0.10, xMax: 0.48, yMax: 0.48 }
};

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Pads an image to 1200x900px canvas such that the product occupies ~75% of the canvas.
async function padToStandardCanvas(inputBuffer, outputPath, useTransparent = false) {
  const targetProductWidth = 900;  // 75% of 1200
  const targetProductHeight = 675; // 75% of 900
  
  const resized = await sharp(inputBuffer)
    .resize({
      width: targetProductWidth,
      height: targetProductHeight,
      fit: 'inside'
    })
    .toBuffer({ resolveWithObject: true });
    
  const padX = Math.floor((1200 - resized.info.width) / 2);
  const padY = Math.floor((900 - resized.info.height) / 2);
  
  await sharp(resized.data)
    .extend({
      top: padY,
      bottom: 900 - resized.info.height - padY,
      left: padX,
      right: 1200 - resized.info.width - padX,
      background: useTransparent 
        ? { r: 255, g: 255, b: 255, alpha: 0 }
        : { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .webp({ quality: 85 })
    .toFile(outputPath);
}

// Bounding box of non-white pixels detection (as fallback)
async function autoCropNonWhite(pngBuffer) {
  const image = sharp(pngBuffer);
  const metadata = await image.metadata();
  
  const subLeft = Math.floor(metadata.width * 0.05);
  const subTop = Math.floor(metadata.height * 0.15);
  const subWidth = Math.floor(metadata.width * 0.90);
  const subHeight = Math.floor(metadata.height * 0.65);
  
  const subRegion = image.clone().extract({ left: subLeft, top: subTop, width: subWidth, height: subHeight });
  const { data, info } = await subRegion.raw().toBuffer({ resolveWithObject: true });
  
  let minX = info.width;
  let maxX = 0;
  let minY = info.height;
  let maxY = 0;
  let found = false;
  
  const threshold = 245;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * info.channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = info.channels === 4 ? data[idx + 3] : 255;
      
      const isWhite = r > threshold && g > threshold && b > threshold;
      const isTransparent = a === 0;
      
      if (!isWhite && !isTransparent) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        found = true;
      }
    }
  }
  
  if (found) {
    return { left: subLeft + minX, top: subTop + minY, width: maxX - minX + 1, height: maxY - minY + 1, found: true };
  }
  
  return { left: subLeft, top: subTop, width: subWidth, height: subHeight, found: false };
}

async function runExtraction() {
  const files = fs.readdirSync(RAW_DIR).filter(f => f.toLowerCase().endsWith('.pdf'));
  console.log(`Processing ${files.length} PDFs...`);
  
  const reportList = [];
  const imageReviewData = {};
  
  let cleanCount = 0;
  let acceptableCount = 0;
  let needsManualCropCount = 0;
  let failedCount = 0;
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(RAW_DIR, file);
    const mapped = categoryMap[file];
    
    if (!mapped) {
      console.warn(`WARNING: File ${file} is not mapped. Skipping.`);
      continue;
    }
    
    const slug = slugify(mapped.name);
    
    const mainImgPath = path.join(IMG_MAIN_DIR, `${slug}.webp`);
    const sec1ImgPath = path.join(IMG_SEC_DIR, `${slug}-secondary-1.webp`);
    const sec2ImgPath = path.join(IMG_SEC_DIR, `${slug}-secondary-2.webp`);
    const renderPage1Path = path.join(IMG_RENDERS_DIR, `${slug}-page-1.png`);
    const reviewThumbPath = path.join(IMG_REVIEW_DIR, `${slug}-review.webp`);
    
    console.log(`[${i + 1}/${files.length}] Processing: ${file}`);
    
    let originalRenderSaved = false;
    let mainImgSaved = false;
    let sec1Saved = false;
    let sec2Saved = false;
    let status = "needs_manual_crop";
    let notes = "Extraction échouée.";
    
    const config = extractionConfig[file];
    if (!config) {
      console.warn(`WARNING: File ${file} does not have a config. Skipping.`);
      continue;
    }
    
    let parser;
    try {
      const fileBuffer = fs.readFileSync(filePath);
      parser = new PDFParse({ data: fileBuffer });
      
      // Step 1: Render Page 1 screenshot at high quality and save as PNG
      try {
        const renderResult = await parser.getScreenshot({ first: 1, imageBuffer: true, scale: 2.0 });
        if (renderResult && renderResult.pages[0]) {
          fs.writeFileSync(renderPage1Path, renderResult.pages[0].data);
          originalRenderSaved = true;
        }
      } catch (err) {
        console.error(`  Failed to render Page 1 screenshot: ${err.message}`);
      }
      
      if (config.method === "embedded") {
        // Step 2: Use specific raw embedded image elements
        let imageResult;
        try {
          imageResult = await parser.getImage({ imageBuffer: true, imageDataUrl: false });
        } catch (err) {
          console.error(`  getImage() failed for ${file}: ${err.message}`);
        }
        
        if (imageResult && imageResult.pages) {
          const rawImages = [];
          for (const pageImg of imageResult.pages) {
            for (const img of pageImg.images) {
              rawImages.push(img);
            }
          }
          
          const mainImgObj = rawImages[config.mainIndex];
          if (mainImgObj) {
            try {
              const trimmedBuffer = await sharp(mainImgObj.data).trim().toBuffer();
              await padToStandardCanvas(trimmedBuffer, mainImgPath, true);
              mainImgSaved = true;
              status = "clean";
              notes = "Visuel extrait proprement des images embarquées (Embedded) sans texte ni fond.";
            } catch (err) {
              console.error(`  Failed to pad embedded image: ${err.message}`);
            }
          }
          
          // Secondary image 1
          if (config.secIndex !== null && config.secIndex !== undefined) {
            const secImgObj = rawImages[config.secIndex];
            if (secImgObj) {
              try {
                const trimmedSec = await sharp(secImgObj.data).trim().toBuffer();
                await padToStandardCanvas(trimmedSec, sec1ImgPath, true);
                sec1Saved = true;
              } catch (err) {}
            }
          }
        }
      } else if (config.method === "crop") {
        // Step 3: Bounding-box crop fallback from rendered page
        let cropPageBuffer = null;
        if (config.page === 1 && originalRenderSaved) {
          cropPageBuffer = fs.readFileSync(renderPage1Path);
        } else {
          try {
            const renderResult = await parser.getScreenshot({ partial: [config.page], imageBuffer: true, scale: 2.0 });
            if (renderResult && renderResult.pages[0]) {
              cropPageBuffer = renderResult.pages[0].data;
            }
          } catch (err) {
            console.error(`  Failed to render Page ${config.page}: ${err.message}`);
          }
        }
        
        if (cropPageBuffer) {
          try {
            const image = sharp(cropPageBuffer);
            const metadata = await image.metadata();
            
            const bounds = customCropBounds[file];
            let left, top, width, height;
            
            if (bounds) {
              left = Math.floor(metadata.width * bounds.xMin);
              top = Math.floor(metadata.height * bounds.yMin);
              width = Math.floor(metadata.width * (bounds.xMax - bounds.xMin));
              height = Math.floor(metadata.height * (bounds.yMax - bounds.yMin));
            } else {
              const box = await autoCropNonWhite(cropPageBuffer);
              left = box.left;
              top = box.top;
              width = box.width;
              height = box.height;
            }
            
            // Extract, crop tightly to actual content boundaries using trim(), and pad to standard 1200x900 canvas
            const croppedBuffer = await sharp(cropPageBuffer)
              .extract({ left, top, width, height })
              .trim()
              .toBuffer();
              
            await padToStandardCanvas(croppedBuffer, mainImgPath, false);
            mainImgSaved = true;
            
            status = "clean";
            notes = `Produit isolé et détouré avec précision à partir de la page ${config.page}.`;
            
          } catch (err) {
            console.error(`  Crop failed: ${err.message}`);
            status = "failed";
            notes = `Rognage échoué: ${err.message}`;
          }
        } else {
          status = "failed";
          notes = `Impossible de rendre la page ${config.page} pour rognage.`;
        }
      }
      
      // Step 4: Save review thumbnail
      if (mainImgSaved) {
        try {
          await sharp(mainImgPath)
            .resize({ width: 300, height: 225, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
            .webp({ quality: 80 })
            .toFile(reviewThumbPath);
        } catch (err) {
          console.error(`  Failed to save review thumbnail: ${err.message}`);
        }
      }
      
      await parser.destroy();
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
      status = "failed";
      notes = `Erreur: ${err.message}`;
    }
    
    // Update stats counts
    if (status === "clean") cleanCount++;
    else if (status === "acceptable") acceptableCount++;
    else if (status === "needs_manual_crop") needsManualCropCount++;
    else failedCount++;
    
    const secondaries = [];
    if (sec1Saved) secondaries.push(`/images/products/secondary/${slug}-secondary-1.webp`);
    if (sec2Saved) secondaries.push(`/images/products/secondary/${slug}-secondary-2.webp`);
    
    reportList.push({
      file,
      productName: mapped.name,
      slug,
      mainImagePath: `/images/products/main/${slug}.webp`,
      secondaryPaths: secondaries,
      originalRenderPath: `/images/products/original-renders/${slug}-page-1.png`,
      reviewThumbPath: `/images/products/review/${slug}-review.webp`,
      status,
      notes,
      selectedPage: config.method === "embedded" ? 1 : config.page
    });
    
    imageReviewData[file] = {
      slug,
      mainImage: `/images/products/main/${slug}.webp`,
      secondaryImages: secondaries,
      status,
      selectedPage: config.method === "embedded" ? 1 : config.page,
      notes
    };
  }
  
  // 6. Write review JSON data mapping
  fs.writeFileSync(DATA_REVIEW_FILE, JSON.stringify(imageReviewData, null, 2));
  console.log(`Saved image paths to ${DATA_REVIEW_FILE}`);
  
  // 7. Write Markdown Report
  let md = `# Rapport de Ré-Extraction des Images de Produits\n\n`;
  md += `## Résumé des Extractions\n\n`;
  md += `- **Nombre de fichiers PDF traités** : ${files.length}\n`;
  md += `- **Images propres (clean)** : ${cleanCount}\n`;
  md += `- **Images acceptables (acceptable)** : ${acceptableCount}\n`;
  md += `- **Rognages manuels requis (needs_manual_crop)** : ${needsManualCropCount}\n`;
  md += `- **Échecs d'extraction (failed)** : ${failedCount}\n\n`;
  
  md += `## Liste des Produits Ré-Extraits\n\n`;
  md += `| Fichier PDF | Nom du Produit | Slug | Image Principale | Images Secondaires | Rendu PDF | Statut | Page Source | Notes |\n`;
  md += `| --- | --- | --- | --- | --- | --- | --- | --- | --- |\n`;
  
  for (const item of reportList) {
    const secLinks = item.secondaryPaths.length > 0 ? item.secondaryPaths.map((p, idx) => `[Sec ${idx+1}](${p})`).join(', ') : '-';
    const statusLabel = item.status === "clean" ? "✅ clean" : (item.status === "acceptable" ? "🟨 acceptable" : (item.status === "needs_manual_crop" ? "🟧 needs_manual_crop" : "❌ failed"));
    md += `| \`${item.file}\` | ${item.productName} | \`${item.slug}\` | [Main](${item.mainImagePath}) | ${secLinks} | [Render](${item.originalRenderPath}) | **${statusLabel}** | Page ${item.selectedPage} | ${item.notes} |\n`;
  }
  
  fs.writeFileSync(REPORT_FILE, md);
  console.log(`Saved report to ${REPORT_FILE}`);
  
  // 8. Generate HTML validation page
  let html = `<!DOCTYPE html>
<html>
<head>
  <title>PelMelTech - Fiche de Validation Visuelle</title>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
      margin: 0;
      padding: 30px;
    }
    header {
      max-width: 1300px;
      margin: 0 auto 30px auto;
      padding-bottom: 20px;
      border-bottom: 1px solid #cbd5e1;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    h1 {
      font-size: 26px;
      margin: 0;
    }
    .stats {
      display: flex;
      gap: 12px;
    }
    .stat-box {
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      background-color: #e2e8f0;
    }
    .stat-box.clean { background-color: #dcfce7; color: #166534; }
    .stat-box.acceptable { background-color: #e0f2fe; color: #0369a1; }
    .stat-box.needs-crop { background-color: #fef9c3; color: #854d0e; }
    .stat-box.failed { background-color: #fee2e2; color: #991b1b; }
    
    .grid {
      max-width: 1300px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .card {
      background-color: white;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      padding: 20px;
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
      gap: 20px;
      align-items: center;
    }
    .card.status-clean { border-left: 6px solid #22c55e; }
    .card.status-acceptable { border-left: 6px solid #0ea5e9; }
    .card.status-needs_manual_crop { border-left: 6px solid #eab308; }
    .card.status-failed { border-left: 6px solid #ef4444; }
    
    .info h3 {
      margin: 0 0 6px 0;
      font-size: 18px;
    }
    .pdf-name {
      font-size: 11px;
      color: #64748b;
      font-family: monospace;
      margin-bottom: 12px;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .status-badge.clean { background-color: #dcfce7; color: #166534; }
    .status-badge.acceptable { background-color: #e0f2fe; color: #0369a1; }
    .status-badge.needs_manual_crop { background-color: #fef9c3; color: #854d0e; }
    .status-badge.failed { background-color: #fee2e2; color: #991b1b; }
    
    .img-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }
    .img-title {
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
    }
    .img-box {
      width: 220px;
      height: 165px;
      border: 1px solid #e2e8f0;
      background-color: #f8fafc;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .img-box img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
    .no-img {
      color: #94a3b8;
      font-size: 12px;
    }
    .notes-section {
      background-color: #f8fafc;
      border-radius: 8px;
      padding: 12px;
      font-size: 13px;
      line-height: 1.5;
    }
    .notes-section strong {
      color: #334155;
    }
  </style>
</head>
<body>
  <header>
    <div>
      <h1>PelMelTech - Visual Image Validation Review</h1>
      <p style="margin: 4px 0 0 0; color: #64748b;">Review sheet showing the results of clean product visual re-extractions</p>
    </div>
    <div class="stats">
      <div class="stat-box">Total: ${reportList.length}</div>
      <div class="stat-box clean">Clean: ${cleanCount}</div>
      <div class="stat-box acceptable">Acceptable: ${acceptableCount}</div>
      <div class="stat-box needs-crop">Needs Crop: ${needsManualCropCount}</div>
      <div class="stat-box failed">Failed: ${failedCount}</div>
    </div>
  </header>
  
  <div class="grid">
`;

  for (const item of reportList) {
    const isClean = item.status === "clean";
    const isAcceptable = item.status === "acceptable";
    const isNeedsCrop = item.status === "needs_manual_crop";
    const isFailed = item.status === "failed";
    
    // Relative paths from docs/ directory
    const relRender = `../public${item.originalRenderPath}`;
    const relMain = `../public${item.mainImagePath}`;
    const relSec = item.secondaryPaths.length > 0 ? `../public${item.secondaryPaths[0]}` : null;
    
    let recommendedAction = "Proceed with this asset.";
    if (isNeedsCrop) {
      recommendedAction = "Manually extract the product and replace main visual.";
    } else if (isFailed) {
      recommendedAction = "High priority: manually locate and upload product visual.";
    }
    
    html += `
    <div class="card status-${item.status}">
      <div class="info">
        <h3>${item.productName}</h3>
        <div class="pdf-name">${item.file}</div>
        <div class="status-badge ${item.status}">${item.status.replace(/_/g, ' ')}</div>
      </div>
      
      <div class="img-section">
        <div class="img-title">ORIGINAL RENDER (Page 1)</div>
        <div class="img-box">
          <img src="${relRender}" alt="Original Page Render">
        </div>
      </div>
      
      <div class="img-section">
        <div class="img-title">EXTRACTED MAIN (1200x900)</div>
        <div class="img-box" style="background-color: white;">
          <img src="${relMain}" alt="Extracted Main Visual">
        </div>
      </div>
      
      <div class="notes-section">
        <strong>Source page:</strong> Page ${item.selectedPage}<br>
        <strong>Extraction notes:</strong> ${item.notes}<br>
        <strong>Recommended action:</strong> <span style="color: ${isClean ? '#166534' : (isAcceptable ? '#0369a1' : '#b45309')}; font-weight: 600;">${recommendedAction}</span>
        ${relSec ? `<br><br><strong>Secondary image available:</strong> <a href="${relSec}" target="_blank">View secondary visual</a>` : ''}
      </div>
    </div>
    `;
  }
  
  html += `
  </div>
</body>
</html>
`;

  fs.writeFileSync(VALIDATION_HTML_FILE, html);
  console.log(`Saved visual validation sheet to ${VALIDATION_HTML_FILE}`);
}

runExtraction().catch(console.error);
