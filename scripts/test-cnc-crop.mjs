import sharp from 'sharp';

async function run() {
  const cropPageBuffer = 'public/images/products/original-renders/machine-decoupe-cnc-1600x2500mm-fraiseuse-page-1.png';
  const image = sharp(cropPageBuffer);
  const metadata = await image.metadata();
  console.log('Metadata:', metadata.width, 'x', metadata.height);

  const bounds = { xMin: 0.53, yMin: 0.08, xMax: 0.98, yMax: 0.70 };
  const left = Math.floor(metadata.width * bounds.xMin);
  const top = Math.floor(metadata.height * bounds.yMin);
  const width = Math.floor(metadata.width * (bounds.xMax - bounds.xMin));
  const height = Math.floor(metadata.height * (bounds.yMax - bounds.yMin));

  console.log('Calculated Area:', { left, top, width, height });

  try {
    const cropped = await sharp(cropPageBuffer)
      .extract({ left, top, width, height })
      .toBuffer();
    console.log('Success extracting!');
  } catch (err) {
    console.error('Error extracting:', err.message);
  }
}

run().catch(console.error);
