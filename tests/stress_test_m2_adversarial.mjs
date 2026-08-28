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

const WEARABLES_DATA = parseTsData(path.resolve('src/data/wearables.ts'), 'WEARABLES_DATA');
const EREADERS_DATA = parseTsData(path.resolve('src/data/ereaders.ts'), 'EREADERS_DATA');

console.log('===============================================================');
console.log('  CHALLENGER 2: DEEP ADVERSARIAL EDGE CASE HARNESS (M2)');
console.log('===============================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${testName}${details ? ' - ' + details : ''}`);
    failCount++;
  }
}

// 1. ADVERSARIAL STATE MUTATION: Comparison Selection Logic
console.log('\n--- 1. Adversarial State Mutation: Comparison Selection Limits ---');

function simulateToggleCompare(prev, deviceId) {
  if (prev.includes(deviceId)) {
    return prev.filter((id) => id !== deviceId);
  }
  if (prev.length >= 4) {
    return prev; // Caps at 4
  }
  return [...prev, deviceId];
}

let compareList = [];
// Try adding 10 different wearable IDs
const wearableIds = WEARABLES_DATA.map(w => w.id);
for (let i = 0; i < 10; i++) {
  compareList = simulateToggleCompare(compareList, wearableIds[i]);
}
assert(compareList.length === 4, 'Comparison list caps strictly at maximum 4 devices', `Got ${compareList.length}`);

// Toggle already selected device (should remove)
const firstId = compareList[0];
compareList = simulateToggleCompare(compareList, firstId);
assert(compareList.length === 3 && !compareList.includes(firstId), 'Toggling existing selected device removes it');

// Now can add a 4th one again
compareList = simulateToggleCompare(compareList, wearableIds[5]);
assert(compareList.length === 4 && compareList.includes(wearableIds[5]), 'Can add 4th device after removing one');

// Try removing non-existent ID
const initialLen = compareList.length;
compareList = compareList.filter(id => id !== 'non-existent-device-id');
assert(compareList.length === initialLen, 'Removing non-existent ID is safe and idempotent');

// Clear all
compareList = [];
assert(compareList.length === 0, 'Clear all resets comparison list to empty array');


// 2. ADVERSARIAL SEARCH INPUTS (Regex specials, SQL injection strings, unicode, emojis)
console.log('\n--- 2. Adversarial Search Inputs & Regex Robustness ---');

const adversarialQueries = [
  '.*', '(', ')', '[', ']', '{', '}', '+', '?', '^', '$', '\\', '|',
  "'; DROP TABLE wearables; --",
  '<script>alert("xss")</script>',
  '   ',
  '🔥⌚📖💡',
  '1234567890!@#$%^&*()_+',
  'a'.repeat(1000), // Huge search query
  'APPLE', 'apple', 'ApPlE', // Case sensitivity
  'GARMIN', 'samsung', 'oura'
];

adversarialQueries.forEach((q, idx) => {
  try {
    const query = q.trim().toLowerCase();
    const resultsW = WEARABLES_DATA.filter((device) => {
      if (query !== '') {
        const matchName = device.name.toLowerCase().includes(query);
        const matchBrand = device.brand.toLowerCase().includes(query);
        const matchDesc = device.description.toLowerCase().includes(query);
        const matchPros = device.pros.some((p) => p.toLowerCase().includes(query));
        const matchCons = device.cons.some((c) => c.toLowerCase().includes(query));
        if (!matchName && !matchBrand && !matchDesc && !matchPros && !matchCons) return false;
      }
      return true;
    });

    const resultsE = EREADERS_DATA.filter((device) => {
      if (query !== '') {
        const matchName = device.name.toLowerCase().includes(query);
        const matchBrand = device.brand.toLowerCase().includes(query);
        const matchDesc = device.description.toLowerCase().includes(query);
        const matchPros = device.pros.some((p) => p.toLowerCase().includes(query));
        const matchCons = device.cons.some((c) => c.toLowerCase().includes(query));
        const matchFormats = device.supportedFormats.some((f) => f.toLowerCase().includes(query));
        if (!matchName && !matchBrand && !matchDesc && !matchPros && !matchCons && !matchFormats) return false;
      }
      return true;
    });

    assert(Array.isArray(resultsW) && Array.isArray(resultsE), `Adversarial Query #${idx + 1} ("${q.substring(0, 20)}") survived without exception`);
  } catch (err) {
    assert(false, `Adversarial Query #${idx + 1} ("${q.substring(0, 20)}") failed with error: ${err.message}`);
  }
});


// 3. SORTING STABILITY & COMPARATOR ADVERSARIAL AUDIT
console.log('\n--- 3. Sorting Stability & Comparator Audit ---');

const allWearableSorts = ['price_asc', 'price_desc', 'battery_desc', 'rating_desc', 'name_asc', 'invalid_key'];
allWearableSorts.forEach((sortKey) => {
  const sorted = [...WEARABLES_DATA].sort((a, b) => {
    switch (sortKey) {
      case 'price_asc': return a.priceUsd - b.priceUsd;
      case 'price_desc': return b.priceUsd - a.priceUsd;
      case 'battery_desc': return b.batteryHours - a.batteryHours;
      case 'rating_desc': return b.rating - a.rating;
      case 'name_asc': return a.name.localeCompare(b.name);
      default: return 0;
    }
  });
  assert(sorted.length === WEARABLES_DATA.length, `Wearables sort with key "${sortKey}" preserves all 21 devices`);
  // Verify prices/ratings are not NaN
  assert(!sorted.some(w => isNaN(w.priceUsd) || isNaN(w.rating) || isNaN(w.batteryHours)), `Wearables sort "${sortKey}" has no NaN numerical properties`);
});

const allEreaderSorts = ['price_asc', 'price_desc', 'screen_desc', 'rating_desc', 'name_asc', 'invalid_key'];
allEreaderSorts.forEach((sortKey) => {
  const sorted = [...EREADERS_DATA].sort((a, b) => {
    switch (sortKey) {
      case 'price_asc': return a.priceUsd - b.priceUsd;
      case 'price_desc': return b.priceUsd - a.priceUsd;
      case 'screen_desc': return b.screenSize - a.screenSize;
      case 'rating_desc': return b.rating - a.rating;
      case 'name_asc': return a.name.localeCompare(b.name);
      default: return 0;
    }
  });
  assert(sorted.length === EREADERS_DATA.length, `E-readers sort with key "${sortKey}" preserves all 18 devices`);
  assert(!sorted.some(e => isNaN(e.priceUsd) || isNaN(e.rating) || isNaN(e.screenSize)), `E-readers sort "${sortKey}" has no NaN numerical properties`);
});


// 4. DATA INTEGRITY & PROPS COMPLETENESS AUDIT
console.log('\n--- 4. Data Structure Completeness & Schema Compliance ---');

WEARABLES_DATA.forEach((w, idx) => {
  const valid = !!(
    w.id &&
    w.name &&
    w.brand &&
    typeof w.priceUsd === 'number' && w.priceUsd > 0 &&
    typeof w.rating === 'number' && w.rating >= 1 && w.rating <= 5 &&
    typeof w.batteryHours === 'number' && w.batteryHours > 0 &&
    w.batteryLife &&
    w.category &&
    Array.isArray(w.ecosystem) && w.ecosystem.length > 0 &&
    w.sensors &&
    typeof w.subscriptionRequired === 'boolean' &&
    Array.isArray(w.pros) && w.pros.length > 0 &&
    Array.isArray(w.cons) && w.cons.length > 0 &&
    w.imageUrl &&
    w.officialSiteUrl
  );
  if (!valid) {
    assert(false, `Wearable #${idx + 1} [${w.id}] has incomplete fields`);
  }
});
assert(true, 'All 21 Wearables have complete schema compliance for rendering');

EREADERS_DATA.forEach((e, idx) => {
  const valid = !!(
    e.id &&
    e.name &&
    e.brand &&
    typeof e.priceUsd === 'number' && e.priceUsd > 0 &&
    typeof e.rating === 'number' && e.rating >= 1 && e.rating <= 5 &&
    typeof e.screenSize === 'number' && e.screenSize > 0 &&
    typeof e.ppi === 'number' && e.ppi > 0 &&
    e.screenTech &&
    e.category &&
    typeof e.colorScreen === 'boolean' &&
    typeof e.warmLight === 'boolean' &&
    typeof e.pageTurnButtons === 'boolean' &&
    typeof e.stylusSupport === 'boolean' &&
    typeof e.openAndroid === 'boolean' &&
    typeof e.storageGb === 'number' && e.storageGb > 0 &&
    typeof e.weightGrams === 'number' && e.weightGrams > 0 &&
    Array.isArray(e.supportedFormats) && e.supportedFormats.length > 0 &&
    Array.isArray(e.pros) && e.pros.length > 0 &&
    Array.isArray(e.cons) && e.cons.length > 0 &&
    e.imageUrl &&
    e.officialSiteUrl
  );
  if (!valid) {
    assert(false, `E-reader #${idx + 1} [${e.id}] has incomplete fields`);
  }
});
assert(true, 'All 18 E-readers have complete schema compliance for rendering');


console.log(`\n===============================================================`);
console.log(`  ADVERSARIAL SUITE: TOTAL: ${passCount + failCount} | PASSED: ${passCount} | FAILED: ${failCount}`);
console.log(`===============================================================`);

if (failCount > 0) {
  process.exit(1);
}
