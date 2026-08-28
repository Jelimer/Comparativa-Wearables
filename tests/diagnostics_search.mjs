import fs from 'fs';
import path from 'path';

function parseTsData(filePath, exportName) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const startIndex = content.indexOf(`export const ${exportName}`);
  const arrayStart = content.indexOf('[', startIndex);
  const arrayEnd = content.lastIndexOf('];');
  const arrayStr = content.substring(arrayStart, arrayEnd + 1);
  return new Function(`return ${arrayStr}`)();
}

const wearables = parseTsData(path.resolve('src/data/wearables.ts'), 'WEARABLES_DATA');
const ereaders = parseTsData(path.resolve('src/data/ereaders.ts'), 'EREADERS_DATA');

console.log('=== DIAGNOSTICS: WEARABLES SEARCH "pixel" ===');
const queryW = 'pixel';
wearables.forEach(w => {
  const matchName = w.name.toLowerCase().includes(queryW);
  const matchBrand = w.brand.toLowerCase().includes(queryW);
  const matchDesc = w.description.toLowerCase().includes(queryW);
  const matchPros = w.pros.some(p => p.toLowerCase().includes(queryW));
  const matchCons = w.cons.some(c => c.toLowerCase().includes(queryW));
  if (matchName || matchBrand || matchDesc || matchPros || matchCons) {
    console.log(`Matched: [${w.id}] ${w.name}`);
    console.log(`  - name: ${matchName}, brand: ${matchBrand}, desc: ${matchDesc}, pros: ${matchPros}, cons: ${matchCons}`);
  }
});

console.log('\n=== DIAGNOSTICS: EREADERS SEARCH "kindle" ===');
const queryE = 'kindle';
ereaders.forEach(e => {
  const matchName = e.name.toLowerCase().includes(queryE);
  const matchBrand = e.brand.toLowerCase().includes(queryE);
  const matchDesc = e.description.toLowerCase().includes(queryE);
  const matchPros = e.pros.some(p => p.toLowerCase().includes(queryE));
  const matchCons = e.cons.some(c => c.toLowerCase().includes(queryE));
  const matchFormats = e.supportedFormats.some(f => f.toLowerCase().includes(queryE));
  if (matchName || matchBrand || matchDesc || matchPros || matchCons || matchFormats) {
    console.log(`Matched: [${e.id}] ${e.name} (${e.brand})`);
    console.log(`  - name: ${matchName}, brand: ${matchBrand}, desc: ${matchDesc}, pros: ${matchPros}, cons: ${matchCons}, formats: ${matchFormats}`);
  }
});
