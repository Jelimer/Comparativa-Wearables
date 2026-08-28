import { WEARABLES_DATA } from '../src/data/wearables.ts';
import { EREADERS_DATA } from '../src/data/ereaders.ts';

console.log('=== DATASET COUNT VERIFICATION ===');
console.log(`WEARABLES_DATA count: ${WEARABLES_DATA.length}`);
console.log(`EREADERS_DATA count: ${EREADERS_DATA.length}`);

console.log('\nWearable IDs:');
WEARABLES_DATA.forEach((w, i) => console.log(` ${i + 1}. [${w.id}] ${w.name} ($${w.priceUsd}) - ${w.brand}`));

console.log('\nE-reader IDs:');
EREADERS_DATA.forEach((e, i) => console.log(` ${i + 1}. [${e.id}] ${e.name} ($${e.priceUsd}) - ${e.brand}`));
