import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');
const wearablesFilePath = path.join(projectRoot, 'src/data/wearables.ts');
const publicDir = path.join(projectRoot, 'public');
const devicesDir = path.join(publicDir, 'images/devices');

console.log('--- EMPIRICAL INTEGRITY VERIFICATION ---');
console.log(`Project root: ${projectRoot}`);
console.log(`Wearables file: ${wearablesFilePath}`);
console.log(`Devices dir: ${devicesDir}`);

if (!fs.existsSync(wearablesFilePath)) {
  console.error('FAIL: wearables.ts does not exist!');
  process.exit(1);
}

if (!fs.existsSync(devicesDir)) {
  console.error('FAIL: public/images/devices directory does not exist!');
  process.exit(1);
}

const fileContent = fs.readFileSync(wearablesFilePath, 'utf-8');

// Parse WEARABLES_DATA using TypeScript AST or evaluating object structure safely
// Since it's a TS export, let's extract individual wearable objects using regex/parsing or evaluating
// Let's check how many wearables exist.

const idMatches = [...fileContent.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
console.log(`Found ${idMatches.length} wearable IDs:`, idMatches);

// Check unique IDs
const uniqueIds = new Set(idMatches);
if (uniqueIds.size !== idMatches.length) {
  console.error(`FAIL: Duplicate IDs found! Total: ${idMatches.length}, Unique: ${uniqueIds.size}`);
} else {
  console.log(`SUCCESS: All ${idMatches.length} IDs are unique.`);
}

// Extract imageUrls
const imageMatches = [...fileContent.matchAll(/imageUrl:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
console.log(`Found ${imageMatches.length} imageUrl fields.`);

let missingImages = 0;
let emptyImages = 0;

imageMatches.forEach((imgUrl, index) => {
  const localPath = path.join(publicDir, imgUrl);
  if (!fs.existsSync(localPath)) {
    console.error(`FAIL: Image missing for ID [${idMatches[index]}]: ${imgUrl} -> local: ${localPath}`);
    missingImages++;
  } else {
    const stats = fs.statSync(localPath);
    if (stats.size === 0) {
      console.error(`FAIL: Image file is 0 bytes for ID [${idMatches[index]}]: ${localPath}`);
      emptyImages++;
    }
  }
});

if (missingImages === 0 && emptyImages === 0) {
  console.log(`SUCCESS: All ${imageMatches.length} referenced images exist and have non-zero size.`);
} else {
  console.error(`FAIL: ${missingImages} missing images, ${emptyImages} 0-byte images.`);
}

// Check devices directory contents vs referenced images
const dirFiles = fs.readdirSync(devicesDir);
console.log(`Files in public/images/devices (${dirFiles.length}):`, dirFiles);

const referencedFilenames = imageMatches.map(u => path.basename(u));
dirFiles.forEach(file => {
  if (!referencedFilenames.includes(file)) {
    console.log(`INFO: Unreferenced image in devices dir: ${file}`);
  }
});

// Detailed check of fields per wearable
// Let's import or parse items completely
// We can strip types and import dynamically or parse block by block
const itemsBlocks = fileContent.split(/{\s*id:\s*['"]/);
itemsBlocks.shift(); // remove header before first item

let integrityErrors = 0;

itemsBlocks.forEach((block, idx) => {
  const fullBlock = "{ id: '" + block;
  const idMatch = block.match(/^([^'"]+)['"]/);
  const id = idMatch ? idMatch[1] : `item_${idx}`;

  const nameMatch = block.match(/name:\s*['"]([^'"]+)['"]/);
  const brandMatch = block.match(/brand:\s*['"]([^'"]+)['"]/);
  const categoryMatch = block.match(/category:\s*['"]([^'"]+)['"]/);
  const priceMatch = block.match(/priceUsd:\s*(\d+)/);
  const batteryLifeMatch = block.match(/batteryLife:\s*['"]([^'"]+)['"]/);
  const batteryHoursMatch = block.match(/batteryHours:\s*(\d+)/);
  const subscriptionReqMatch = block.match(/subscriptionRequired:\s*(true|false)/);
  const officialSiteMatch = block.match(/officialSiteUrl:\s*['"]([^'"]+)['"]/);
  const ratingMatch = block.match(/rating:\s*([\d.]+)/);

  if (!nameMatch || !nameMatch[1].trim()) {
    console.error(`FAIL [${id}]: Missing or empty name`);
    integrityErrors++;
  }
  if (!brandMatch || !brandMatch[1].trim()) {
    console.error(`FAIL [${id}]: Missing or empty brand`);
    integrityErrors++;
  }
  if (!categoryMatch || !['smartwatch', 'band', 'ring'].includes(categoryMatch[1])) {
    console.error(`FAIL [${id}]: Invalid category: ${categoryMatch ? categoryMatch[1] : 'none'}`);
    integrityErrors++;
  }
  if (!priceMatch || isNaN(parseInt(priceMatch[1])) || parseInt(priceMatch[1]) <= 0) {
    console.error(`FAIL [${id}]: Invalid priceUsd`);
    integrityErrors++;
  }
  if (!batteryLifeMatch || !batteryLifeMatch[1].trim()) {
    console.error(`FAIL [${id}]: Missing batteryLife`);
    integrityErrors++;
  }
  if (!batteryHoursMatch || isNaN(parseInt(batteryHoursMatch[1])) || parseInt(batteryHoursMatch[1]) <= 0) {
    console.error(`FAIL [${id}]: Invalid batteryHours`);
    integrityErrors++;
  }
  if (!subscriptionReqMatch) {
    console.error(`FAIL [${id}]: Missing subscriptionRequired boolean`);
    integrityErrors++;
  }
  if (!officialSiteMatch || !officialSiteMatch[1].startsWith('http')) {
    console.error(`FAIL [${id}]: Invalid officialSiteUrl`);
    integrityErrors++;
  }
  if (!ratingMatch || isNaN(parseFloat(ratingMatch[1])) || parseFloat(ratingMatch[1]) <= 0) {
    console.error(`FAIL [${id}]: Invalid rating`);
    integrityErrors++;
  }
});

if (integrityErrors === 0) {
  console.log(`SUCCESS: All ${itemsBlocks.length} dataset entries passed field integrity verification.`);
} else {
  console.error(`FAIL: Found ${integrityErrors} field integrity errors.`);
  process.exit(1);
}
