import fs from 'fs';
import path from 'path';

// Parse TS data files directly
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

// Exact filter functions from WearablesView.tsx and EreadersView.tsx
function filterAndSortWearables(data, filters) {
  const query = filters.searchQuery.trim().toLowerCase();

  return data.filter((device) => {
    // 1. Fast Numeric checks (O(1))
    if (device.priceUsd > filters.maxPrice) return false;
    if (device.batteryHours < filters.minBatteryHours) return false;

    // 2. Fast Boolean sensor flags (O(1))
    const { ecg, spO2, edaStress, bodyComposition, bloodPressure, gps, skinTemp } =
      filters.requiredSensors;
    if (ecg && !device.sensors.ecg) return false;
    if (spO2 && !device.sensors.spO2) return false;
    if (edaStress && !device.sensors.edaStress) return false;
    if (bodyComposition && !device.sensors.bodyComposition) return false;
    if (bloodPressure && !device.sensors.bloodPressure) return false;
    if (gps && !device.sensors.gps) return false;
    if (skinTemp && !device.sensors.skinTemp) return false;

    // 3. Multi-select list checks (Small arrays O(k))
    if (filters.selectedBrands.length > 0 && !filters.selectedBrands.includes(device.brand)) {
      return false;
    }
    if (filters.selectedCategories.length > 0 && !filters.selectedCategories.includes(device.category)) {
      return false;
    }
    if (
      filters.selectedEcosystems.length > 0 &&
      !device.ecosystem.some((eco) => filters.selectedEcosystems.includes(eco))
    ) {
      return false;
    }
    if (filters.selectedSubscriptions.length > 0) {
      const matchesFree = filters.selectedSubscriptions.includes('free') && !device.subscriptionRequired;
      const matchesSub = filters.selectedSubscriptions.includes('subscription') && device.subscriptionRequired;
      if (!matchesFree && !matchesSub) return false;
    }

    // 4. Text search query
    if (query !== '') {
      const matchName = device.name.toLowerCase().includes(query);
      const matchBrand = device.brand.toLowerCase().includes(query);
      const matchDesc = device.description.toLowerCase().includes(query);
      const matchPros = device.pros.some((p) => p.toLowerCase().includes(query));
      const matchCons = device.cons.some((c) => c.toLowerCase().includes(query));
      if (!matchName && !matchBrand && !matchDesc && !matchPros && !matchCons) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'price_asc': return a.priceUsd - b.priceUsd;
      case 'price_desc': return b.priceUsd - a.priceUsd;
      case 'battery_desc': return b.batteryHours - a.batteryHours;
      case 'rating_desc': return b.rating - a.rating;
      case 'name_asc': return a.name.localeCompare(b.name);
      default: return 0;
    }
  });
}

function filterAndSortEreaders(data, filters) {
  const query = filters.searchQuery.trim().toLowerCase();

  return data.filter((device) => {
    // 1. Fast Numeric check (O(1))
    if (device.priceUsd > filters.maxPrice) return false;

    // 2. Fast Boolean feature toggles (O(1))
    if (filters.colorScreenOnly && !device.colorScreen) return false;
    if (filters.warmLightOnly && !device.warmLight) return false;
    if (filters.pageTurnButtonsOnly && !device.pageTurnButtons) return false;
    if (filters.stylusSupportOnly && !device.stylusSupport) return false;
    if (filters.waterproofOnly && !device.waterproof.includes('IPX8')) return false;
    if (filters.audiobookOnly && !device.audiobookSupport) return false;
    if (filters.openAndroidOnly && !device.openAndroid) return false;

    // 3. Multi-select list checks (Small arrays O(k))
    if (filters.selectedBrands.length > 0 && !filters.selectedBrands.includes(device.brand)) {
      return false;
    }
    if (
      filters.selectedCategories.length > 0 &&
      !filters.selectedCategories.includes(device.category)
    ) {
      return false;
    }

    // 4. Text search query
    if (query !== '') {
      const matchName = device.name.toLowerCase().includes(query);
      const matchBrand = device.brand.toLowerCase().includes(query);
      const matchDesc = device.description.toLowerCase().includes(query);
      const matchPros = device.pros.some((p) => p.toLowerCase().includes(query));
      const matchCons = device.cons.some((c) => c.toLowerCase().includes(query));
      const matchFormats = device.supportedFormats.some((f) => f.toLowerCase().includes(query));
      if (!matchName && !matchBrand && !matchDesc && !matchPros && !matchCons && !matchFormats) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'price_asc': return a.priceUsd - b.priceUsd;
      case 'price_desc': return b.priceUsd - a.priceUsd;
      case 'screen_desc': return b.screenSize - a.screenSize;
      case 'rating_desc': return b.rating - a.rating;
      case 'name_asc': return a.name.localeCompare(b.name);
      default: return 0;
    }
  });
}

const INITIAL_WEARABLE_FILTERS = {
  searchQuery: '',
  selectedBrands: [],
  selectedCategories: [],
  selectedEcosystems: [],
  selectedSubscriptions: [],
  maxPrice: 1000,
  minBatteryHours: 0,
  requiredSensors: {
    ecg: false,
    spO2: false,
    edaStress: false,
    bodyComposition: false,
    bloodPressure: false,
    gps: false,
    skinTemp: false,
  },
  sortBy: 'rating_desc',
};

const INITIAL_EREADER_FILTERS = {
  searchQuery: '',
  selectedBrands: [],
  selectedCategories: [],
  selectedScreenSizes: [],
  colorScreenOnly: false,
  warmLightOnly: false,
  pageTurnButtonsOnly: false,
  stylusSupportOnly: false,
  waterproofOnly: false,
  audiobookOnly: false,
  openAndroidOnly: false,
  maxPrice: 600,
  sortBy: 'rating_desc',
};

const results = [];

function check(testGroup, testName, pass, details = '') {
  results.push({ testGroup, testName, pass, details });
  const mark = pass ? '✓ PASS' : '✗ FAIL';
  console.log(`[${mark}] [${testGroup}] ${testName} ${details ? '(' + details + ')' : ''}`);
}

console.log('================================================================');
console.log('       SUITE DE PRUEBAS EMPÍRICAS DE DESAFÍO — MILESTONE 1      ');
console.log('================================================================\n');

// 1. DATASET INTEGRITY
check('DATASET', 'Wearables count is exactly 21', WEARABLES_DATA.length === 21, `Found ${WEARABLES_DATA.length}`);
check('DATASET', 'E-readers count is exactly 18', EREADERS_DATA.length === 18, `Found ${EREADERS_DATA.length}`);

// Check for unique IDs
const wearableIds = new Set(WEARABLES_DATA.map(w => w.id));
check('DATASET', 'Wearables have unique IDs', wearableIds.size === 21, `Unique: ${wearableIds.size}`);

const ereaderIds = new Set(EREADERS_DATA.map(e => e.id));
check('DATASET', 'E-readers have unique IDs', ereaderIds.size === 18, `Unique: ${ereaderIds.size}`);

// 2. INITIAL FILTER STATE
const initialW = filterAndSortWearables(WEARABLES_DATA, INITIAL_WEARABLE_FILTERS);
check('INITIAL_STATE', 'Wearables default yields all 21 items', initialW.length === 21, `Yielded ${initialW.length}/21`);

const initialE = filterAndSortEreaders(EREADERS_DATA, INITIAL_EREADER_FILTERS);
check('INITIAL_STATE', 'E-readers default yields all 18 items', initialE.length === 18, `Yielded ${initialE.length}/18`);

// 3. PRICE BOUNDS & THRESHOLDS
const wMaxPrice = Math.max(...WEARABLES_DATA.map(w => w.priceUsd));
check('PRICE_BOUNDS', 'Wearables max price ($' + wMaxPrice + ') is <= default maxPrice (1000)', wMaxPrice <= 1000, `Max price: $${wMaxPrice}`);

const eMaxPrice = Math.max(...EREADERS_DATA.map(e => e.priceUsd));
check('PRICE_BOUNDS', 'E-readers max price ($' + eMaxPrice + ') is <= default maxPrice (600)', eMaxPrice <= 600, `Max price: $${eMaxPrice}`);

// Threshold test: E-readers maxPrice 500 excludes remarkable-paper-pro ($579)
const eFiltered500 = filterAndSortEreaders(EREADERS_DATA, { ...INITIAL_EREADER_FILTERS, maxPrice: 500 });
check('PRICE_BOUNDS', 'E-readers maxPrice 500 excludes reMarkable Paper Pro ($579)', !eFiltered500.some(e => e.id === 'remarkable-paper-pro') && eFiltered500.length === 17, `Count: ${eFiltered500.length}`);

// Threshold test: Wearables maxPrice 300
const wFiltered300 = filterAndSortWearables(WEARABLES_DATA, { ...INITIAL_WEARABLE_FILTERS, maxPrice: 300 });
const wExpected300 = WEARABLES_DATA.filter(w => w.priceUsd <= 300).length;
check('PRICE_BOUNDS', 'Wearables maxPrice 300 matches manual filter', wFiltered300.length === wExpected300, `Count: ${wFiltered300.length}/${wExpected300}`);

// 4. BRAND FILTERS (MULTIPLE & SINGLE)
const brandCountsWearables = {
  'Google/Fitbit': 5,
  'Garmin': 2,
  'Samsung': 3,
  'Oura': 2,
  'Whoop': 3,
  'RingConn': 1,
  'Signal': 1,
  'Apple': 2,
  'Xiaomi': 2,
};

for (const [brand, expectedCount] of Object.entries(brandCountsWearables)) {
  const filtered = filterAndSortWearables(WEARABLES_DATA, { ...INITIAL_WEARABLE_FILTERS, selectedBrands: [brand] });
  check('BRAND_FILTER_W', `Brand "${brand}" yields ${expectedCount}`, filtered.length === expectedCount && filtered.every(w => w.brand === brand), `Got ${filtered.length}`);
}

const brandCountsEreaders = {
  'Amazon Kindle': 6,
  'Rakuten Kobo': 5,
  'Onyx BOOX': 3,
  'PocketBook': 1,
  'reMarkable': 2,
  'Lenovo': 1,
};

for (const [brand, expectedCount] of Object.entries(brandCountsEreaders)) {
  const filtered = filterAndSortEreaders(EREADERS_DATA, { ...INITIAL_EREADER_FILTERS, selectedBrands: [brand] });
  check('BRAND_FILTER_E', `Brand "${brand}" yields ${expectedCount}`, filtered.length === expectedCount && filtered.every(e => e.brand === brand), `Got ${filtered.length}`);
}

// 5. CATEGORY FILTERS
const catCountsWearables = { 'smartwatch': 8, 'band': 8, 'ring': 5 };
for (const [cat, expectedCount] of Object.entries(catCountsWearables)) {
  const filtered = filterAndSortWearables(WEARABLES_DATA, { ...INITIAL_WEARABLE_FILTERS, selectedCategories: [cat] });
  check('CATEGORY_FILTER_W', `Category "${cat}" yields ${expectedCount}`, filtered.length === expectedCount && filtered.every(w => w.category === cat), `Got ${filtered.length}`);
}

const catCountsEreaders = { 'compact': 3, 'standard': 5, 'large_note': 4, 'color': 6 };
for (const [cat, expectedCount] of Object.entries(catCountsEreaders)) {
  const filtered = filterAndSortEreaders(EREADERS_DATA, { ...INITIAL_EREADER_FILTERS, selectedCategories: [cat] });
  check('CATEGORY_FILTER_E', `Category "${cat}" yields ${expectedCount}`, filtered.length === expectedCount && filtered.every(e => e.category === cat), `Got ${filtered.length}`);
}

// 6. SENSORS & FEATURE TOGGLES
const sensorChecks = [
  { key: 'ecg', name: 'ECG' },
  { key: 'spO2', name: 'SpO2' },
  { key: 'edaStress', name: 'cEDA / Estrés' },
  { key: 'bodyComposition', name: 'Composición Corporal' },
  { key: 'bloodPressure', name: 'Presión Arterial' },
  { key: 'gps', name: 'GPS' },
  { key: 'skinTemp', name: 'Temperatura Cutánea' },
];

for (const s of sensorChecks) {
  const filtered = filterAndSortWearables(WEARABLES_DATA, {
    ...INITIAL_WEARABLE_FILTERS,
    requiredSensors: { ...INITIAL_WEARABLE_FILTERS.requiredSensors, [s.key]: true },
  });
  const expected = WEARABLES_DATA.filter(w => w.sensors[s.key]).length;
  check('SENSOR_FILTER', `Sensor ${s.name} (${s.key}) matches exact count`, filtered.length === expected && filtered.every(w => w.sensors[s.key]), `Got ${filtered.length}/${expected}`);
}

const ereaderToggles = [
  { key: 'colorScreenOnly', name: 'Color Screen', predicate: e => e.colorScreen },
  { key: 'warmLightOnly', name: 'Warm Light', predicate: e => e.warmLight },
  { key: 'pageTurnButtonsOnly', name: 'Page Turn Buttons', predicate: e => e.pageTurnButtons },
  { key: 'stylusSupportOnly', name: 'Stylus Support', predicate: e => e.stylusSupport },
  { key: 'waterproofOnly', name: 'Waterproof IPX8', predicate: e => e.waterproof.includes('IPX8') },
  { key: 'audiobookOnly', name: 'Audiobook Support', predicate: e => e.audiobookSupport },
  { key: 'openAndroidOnly', name: 'Open Android', predicate: e => e.openAndroid },
];

for (const t of ereaderToggles) {
  const filtered = filterAndSortEreaders(EREADERS_DATA, {
    ...INITIAL_EREADER_FILTERS,
    [t.key]: true,
  });
  const expected = EREADERS_DATA.filter(t.predicate).length;
  check('EREADER_TOGGLES', `Toggle ${t.name} (${t.key}) matches exact count`, filtered.length === expected && filtered.every(t.predicate), `Got ${filtered.length}/${expected}`);
}

// 7. SEARCH ALGORITHM OPTIMIZATION & NORMALIZATION
// Case Insensitivity
const queryLower = 'oura';
const queryUpper = 'OURA';
const queryMixed = 'OuRa';
const resLower = filterAndSortWearables(WEARABLES_DATA, { ...INITIAL_WEARABLE_FILTERS, searchQuery: queryLower });
const resUpper = filterAndSortWearables(WEARABLES_DATA, { ...INITIAL_WEARABLE_FILTERS, searchQuery: queryUpper });
const resMixed = filterAndSortWearables(WEARABLES_DATA, { ...INITIAL_WEARABLE_FILTERS, searchQuery: queryMixed });

check('SEARCH_NORMALIZATION', 'Wearables search is case-insensitive (lower == upper == mixed)', resLower.length === resUpper.length && resLower.length === resMixed.length, `Count: ${resLower.length}`);

// Leading & Trailing whitespace
const resTrim = filterAndSortWearables(WEARABLES_DATA, { ...INITIAL_WEARABLE_FILTERS, searchQuery: '   oura   ' });
check('SEARCH_NORMALIZATION', 'Wearables search trims leading/trailing whitespace', resTrim.length === resLower.length, `Count: ${resTrim.length}`);

// Empty search string returns everything
const resEmpty = filterAndSortWearables(WEARABLES_DATA, { ...INITIAL_WEARABLE_FILTERS, searchQuery: '     ' });
check('SEARCH_NORMALIZATION', 'Wearables whitespace-only query returns all 21 items', resEmpty.length === 21, `Count: ${resEmpty.length}`);

const resEEmpty = filterAndSortEreaders(EREADERS_DATA, { ...INITIAL_EREADER_FILTERS, searchQuery: '   ' });
check('SEARCH_NORMALIZATION', 'E-readers whitespace-only query returns all 18 items', resEEmpty.length === 18, `Count: ${resEEmpty.length}`);

// Non-matching query returns 0
const resNonMatchingW = filterAndSortWearables(WEARABLES_DATA, { ...INITIAL_WEARABLE_FILTERS, searchQuery: 'zzz_random_nonexistent_search_query_999' });
check('SEARCH_NORMALIZATION', 'Wearables non-matching query returns 0', resNonMatchingW.length === 0, `Count: ${resNonMatchingW.length}`);

const resNonMatchingE = filterAndSortEreaders(EREADERS_DATA, { ...INITIAL_EREADER_FILTERS, searchQuery: 'zzz_random_nonexistent_search_query_999' });
check('SEARCH_NORMALIZATION', 'E-readers non-matching query returns 0', resNonMatchingE.length === 0, `Count: ${resNonMatchingE.length}`);

// Multi-term substring matching in pros/cons/description
const resTitanium = filterAndSortWearables(WEARABLES_DATA, { ...INITIAL_WEARABLE_FILTERS, searchQuery: 'titanio' });
check('SEARCH_RELEVANCE', 'Wearables search finds "titanio" across fields', resTitanium.length >= 3, `Found: ${resTitanium.length} (${resTitanium.map(w => w.name).join(', ')})`);

const resKaleido = filterAndSortEreaders(EREADERS_DATA, { ...INITIAL_EREADER_FILTERS, searchQuery: 'kaleido' });
check('SEARCH_RELEVANCE', 'E-readers search finds "kaleido" across fields', resKaleido.length >= 3, `Found: ${resKaleido.length} (${resKaleido.map(e => e.name).join(', ')})`);

// 8. SORTING VERIFICATION
// Wearables Price Ascending
const wSortPriceAsc = filterAndSortWearables(WEARABLES_DATA, { ...INITIAL_WEARABLE_FILTERS, sortBy: 'price_asc' });
let isPriceAsc = true;
for (let i = 0; i < wSortPriceAsc.length - 1; i++) {
  if (wSortPriceAsc[i].priceUsd > wSortPriceAsc[i + 1].priceUsd) isPriceAsc = false;
}
check('SORTING', 'Wearables price_asc sorts correctly from min to max', isPriceAsc, `Min: $${wSortPriceAsc[0].priceUsd}, Max: $${wSortPriceAsc[wSortPriceAsc.length - 1].priceUsd}`);

// Wearables Price Descending
const wSortPriceDesc = filterAndSortWearables(WEARABLES_DATA, { ...INITIAL_WEARABLE_FILTERS, sortBy: 'price_desc' });
let isPriceDesc = true;
for (let i = 0; i < wSortPriceDesc.length - 1; i++) {
  if (wSortPriceDesc[i].priceUsd < wSortPriceDesc[i + 1].priceUsd) isPriceDesc = false;
}
check('SORTING', 'Wearables price_desc sorts correctly from max to min', isPriceDesc, `Max: $${wSortPriceDesc[0].priceUsd}, Min: $${wSortPriceDesc[wSortPriceDesc.length - 1].priceUsd}`);

// Wearables Battery Descending
const wSortBatteryDesc = filterAndSortWearables(WEARABLES_DATA, { ...INITIAL_WEARABLE_FILTERS, sortBy: 'battery_desc' });
let isBatteryDesc = true;
for (let i = 0; i < wSortBatteryDesc.length - 1; i++) {
  if (wSortBatteryDesc[i].batteryHours < wSortBatteryDesc[i + 1].batteryHours) isBatteryDesc = false;
}
check('SORTING', 'Wearables battery_desc sorts correctly from highest battery to lowest', isBatteryDesc, `Max: ${wSortBatteryDesc[0].batteryHours}h, Min: ${wSortBatteryDesc[wSortBatteryDesc.length - 1].batteryHours}h`);

// E-readers Screen Size Descending
const eSortScreenDesc = filterAndSortEreaders(EREADERS_DATA, { ...INITIAL_EREADER_FILTERS, sortBy: 'screen_desc' });
let isScreenDesc = true;
for (let i = 0; i < eSortScreenDesc.length - 1; i++) {
  if (eSortScreenDesc[i].screenSize < eSortScreenDesc[i + 1].screenSize) isScreenDesc = false;
}
check('SORTING', 'E-readers screen_desc sorts correctly from largest screen to smallest', isScreenDesc, `Max: ${eSortScreenDesc[0].screenSize}", Min: ${eSortScreenDesc[eSortScreenDesc.length - 1].screenSize}"`);

// 9. COMPLEX MULTI-FILTER COMBINATIONS
// Combined 1: Wearables Garmin + GPS + MinBattery 168h + Price <= 900
const wComplex1 = filterAndSortWearables(WEARABLES_DATA, {
  ...INITIAL_WEARABLE_FILTERS,
  selectedBrands: ['Garmin'],
  minBatteryHours: 168,
  maxPrice: 900,
  requiredSensors: { ...INITIAL_WEARABLE_FILTERS.requiredSensors, gps: true },
});
check('COMPLEX_MULTI_FILTER', 'Wearables Garmin + GPS + Battery >= 168h + Price <= 900', wComplex1.length === 1 && wComplex1.every(w => w.brand === 'Garmin' && w.batteryHours >= 168 && w.sensors.gps && w.priceUsd <= 900), `Found: ${wComplex1.length} (${wComplex1.map(w => w.name).join(', ')})`);

// Combined 2: E-readers Color + Stylus + MaxPrice 600
const eComplex1 = filterAndSortEreaders(EREADERS_DATA, {
  ...INITIAL_EREADER_FILTERS,
  colorScreenOnly: true,
  stylusSupportOnly: true,
  maxPrice: 600,
});
check('COMPLEX_MULTI_FILTER', 'E-readers Color + Stylus Support + MaxPrice 600', eComplex1.length === 3 && eComplex1.every(e => e.colorScreen && e.stylusSupport), `Found: ${eComplex1.length} (${eComplex1.map(e => e.name).join(', ')})`);

// Combined 3: E-readers Kobo + Waterproof + Audiobooks + MaxPrice 250
const eComplex2 = filterAndSortEreaders(EREADERS_DATA, {
  ...INITIAL_EREADER_FILTERS,
  selectedBrands: ['Rakuten Kobo'],
  waterproofOnly: true,
  audiobookOnly: true,
  maxPrice: 250,
});
check('COMPLEX_MULTI_FILTER', 'E-readers Kobo + Waterproof + Audiobooks + MaxPrice 250', eComplex2.length === 3 && eComplex2.every(e => e.brand === 'Rakuten Kobo' && e.waterproof.includes('IPX8') && e.audiobookSupport && e.priceUsd <= 250), `Found: ${eComplex2.length} (${eComplex2.map(e => e.name).join(', ')})`);

// Combined 4: Wearables Subscription Free + Rings
const wComplex2 = filterAndSortWearables(WEARABLES_DATA, {
  ...INITIAL_WEARABLE_FILTERS,
  selectedCategories: ['ring'],
  selectedSubscriptions: ['free'],
});
check('COMPLEX_MULTI_FILTER', 'Wearables Rings + Free Subscription (No monthly fees)', wComplex2.length === 3 && wComplex2.every(w => w.category === 'ring' && !w.subscriptionRequired), `Found: ${wComplex2.length} (${wComplex2.map(w => w.name).join(', ')})`);

console.log('\n================================================================');
const total = results.length;
const passed = results.filter(r => r.pass).length;
const failed = results.filter(r => !r.pass).length;
console.log(`TOTAL DE PRUEBAS EJECUTADAS: ${total}`);
console.log(`EXITOSAS: ${passed}`);
console.log(`FALLIDAS: ${failed}`);
console.log('================================================================');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('¡TODAS LAS PRUEBAS EMPÍRICAS PASARON CON 100% DE ÉXITO!');
}
