import fs from 'node:fs';
import path from 'node:path';

const srcFile = path.resolve('src/data/products.extracted.json');
const destFile = path.resolve('src/data/products.json');
const storeFile = path.resolve('data/store.json');

try {
  fs.copyFileSync(srcFile, destFile);
  console.log('Successfully copied products.extracted.json to products.json.');
} catch (e) {
  console.error('Error copying file:', e);
}

try {
  if (fs.existsSync(storeFile)) {
    fs.unlinkSync(storeFile);
    console.log('Deleted data/store.json cache successfully.');
  } else {
    console.log('data/store.json does not exist. No cache to delete.');
  }
} catch (e) {
  console.error('Error deleting cache:', e);
}
