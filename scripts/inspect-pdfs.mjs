import fs from 'fs';
import path from 'path';

const REVIEW_FILE = 'C:/Users/pc/projectw/PELMELTECH-FINAL/src/data/product-images.review.json';
const EXTRACTED_FILE = 'C:/Users/pc/projectw/PELMELTECH-FINAL/src/data/products.extracted.json';
const FINAL_FILE = 'C:/Users/pc/projectw/PELMELTECH-FINAL/src/data/products.json';
const STORE_FILE = 'C:/Users/pc/projectw/PELMELTECH-FINAL/data/store.json';

function main() {
  console.log('Loading review mappings...');
  const reviewMappings = JSON.parse(fs.readFileSync(REVIEW_FILE, 'utf8'));
  
  console.log('Loading extracted products data...');
  const products = JSON.parse(fs.readFileSync(EXTRACTED_FILE, 'utf8'));
  
  let updatedCount = 0;
  for (const product of products) {
    const key = product.sourcePdf;
    const mapping = reviewMappings[key];
    if (mapping) {
      product.imageUrl = mapping.mainImage;
      product.gallery = mapping.secondaryImages || [];
      product.extractionStatus = mapping.status === 'failed' ? 'needs_review' : 'verified';
      updatedCount++;
    } else {
      console.warn(`No mapping found for sourcePdf: ${key}`);
    }
  }
  
  console.log(`Updated ${updatedCount} products in memory.`);
  
  // Write back to products.extracted.json
  fs.writeFileSync(EXTRACTED_FILE, JSON.stringify(products, null, 2));
  console.log(`Successfully wrote to ${EXTRACTED_FILE}`);
  
  // Copy to products.json
  fs.copyFileSync(EXTRACTED_FILE, FINAL_FILE);
  console.log(`Successfully copied to ${FINAL_FILE}`);
  
  // Delete cache at store.json
  if (fs.existsSync(STORE_FILE)) {
    fs.unlinkSync(STORE_FILE);
    console.log(`Deleted store cache at ${STORE_FILE}`);
  } else {
    console.log(`No cache found at ${STORE_FILE}`);
  }
  
  console.log('Website catalog successfully updated with clean product assets!');
}

main();
