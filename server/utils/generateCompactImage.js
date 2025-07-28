// utils/generateCompactImage.js
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const COMPACT_DIR = path.join(process.cwd(), 'file_manager', 'uploads', 'compact-pics');

if (!fs.existsSync(COMPACT_DIR)) {
  fs.mkdirSync(COMPACT_DIR, { recursive: true });
}

async function generateCompactImage(originalPath, compactFilename) {
  const compactPath = path.join(COMPACT_DIR, compactFilename);

  try {
    await sharp(originalPath)
      .resize(300, 157)
      .jpeg({ quality: 70 })
      .toFile(compactPath);

    return `/uploads/compact-pics/${compactFilename}`;
  } catch (err) {
    console.error('Error generating compact image:', err);
    return null;
  }
}

module.exports = generateCompactImage;
