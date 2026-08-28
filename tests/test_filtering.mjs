import fs from 'fs';
import path from 'path';

// Parse TS data files directly to get exact data objects
function parseTsData(filePath, exportName) {
  const content = fs.readFileSync(filePath, 'utf-8');
  // Extract array contents between export const EXPORT_NAME: Type[] = [ and ];
  const startIndex = content.indexOf(`export const ${exportName}`);
  const arrayStart = content.indexOf('[', startIndex);
  const arrayEnd = content.lastIndexOf('];');
  const arrayStr = content.substring(arrayStart, arrayEnd + 1);
  
  // Use Function to evaluate JS object literal safely
  return new Function(`return ${arrayStr}`)();
}

const wearables = parseTsData(path.resolve('src/data/wearables.ts'), 'WEARABLES_DATA');
const ereaders = parseTsData(path.resolve('src/data/ereaders.ts'), 'EREADERS_DATA');

console.log('=== DATASET INTEGRITY CHECK ===');
console.log(`Wearables loaded: ${wearables.length}`);
console.log(`Ereaders loaded: ${ereaders.length}`);

if (wearables.length !== 21) {
  throw new Error(`Expected 21 wearables, found ${wearables.length}`);
}
if (ereaders.length !== 18) {
  throw new Error(`Expected 18 ereaders, found ${ereaders.length}`);
}

// Wearables Filter Logic (Mirror of WearablesView.tsx)
function filterWearables(data, filters) {
  const query = filters.searchQuery.trim().toLowerCase();

  return data.filter((device) => {
    // 1. Fast Numeric checks (O(1))
    if (device.priceUsd > filters.maxPrice) {
      return false;
    }

    if (device.batteryHours < filters.minBatteryHours) {
      return false;
    }

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
      if (!matchesFree && !matchesSub) {
        return false;
      }
    }

    // 4. Text search query (Evaluated last only on survivors)
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
  });
}

// Ereaders Filter Logic (Mirror of EreadersView.tsx)
function filterEreaders(data, filters) {
  const query = filters.searchQuery.trim().toLowerCase();

  return data.filter((device) => {
    // 1. Fast Numeric check (O(1))
    if (device.priceUsd > filters.maxPrice) {
      return false;
    }

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

    // 4. Text search query (Evaluated last only on survivors)
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

const testResults = [];

function assert(condition, testName, details = '') {
  if (condition) {
    testResults.push({ name: testName, status: 'PASS', details });
    console.log(`[PASS] ${testName} ${details ? '(' + details + ')' : ''}`);
  } else {
    testResults.push({ name: testName, status: 'FAIL', details });
    console.error(`[FAIL] ${testName} ${details ? '(' + details + ')' : ''}`);
  }
}

console.log('\n=== TEST SUITE 1: INITIAL DEFAULT STATE ===');
const defaultWearables = filterWearables(wearables, INITIAL_WEARABLE_FILTERS);
assert(defaultWearables.length === 21, 'Wearables Initial State Count', `Expected 21, got ${defaultWearables.length}`);

const defaultEreaders = filterEreaders(ereaders, INITIAL_EREADER_FILTERS);
assert(defaultEreaders.length === 18, 'Ereaders Initial State Count', `Expected 18, got ${defaultEreaders.length}`);

console.log('\n=== TEST SUITE 2: PRICE BOUNDS & THRESHOLDS ===');
// Wearables Price Bounds
const wMax1000 = filterWearables(wearables, { ...INITIAL_WEARABLE_FILTERS, maxPrice: 1000 });
assert(wMax1000.length === 21, 'Wearables maxPrice 1000 includes all', `Count: ${wMax1000.length}`);

const wMax300 = filterWearables(wearables, { ...INITIAL_WEARABLE_FILTERS, maxPrice: 300 });
const wMax300Expected = wearables.filter(w => w.priceUsd <= 300).length;
assert(wMax300.length === wMax300Expected, 'Wearables maxPrice 300 filter', `Got ${wMax300.length}, expected ${wMax300Expected}`);

const wMax40 = filterWearables(wearables, { ...INITIAL_WEARABLE_FILTERS, maxPrice: 40 });
const wMax40Expected = wearables.filter(w => w.priceUsd <= 40).length;
assert(wMax40.length === wMax40Expected, 'Wearables maxPrice 40 filter (lowest bound)', `Got ${wMax40.length}, expected ${wMax40Expected}`);

// Ereaders Price Bounds
const eMax600 = filterEreaders(ereaders, { ...INITIAL_EREADER_FILTERS, maxPrice: 600 });
assert(eMax600.length === 18, 'Ereaders maxPrice 600 includes all', `Count: ${eMax600.length}`);

const eMax500 = filterEreaders(ereaders, { ...INITIAL_EREADER_FILTERS, maxPrice: 500 });
// remarkable-paper-pro is $579, so it should be excluded
assert(!eMax500.some(e => e.id === 'remarkable-paper-pro'), 'Ereaders maxPrice 500 excludes reMarkable Paper Pro ($579)');
assert(eMax500.length === 17, 'Ereaders maxPrice 500 yields 17 devices', `Got ${eMax500.length}`);

const eMax100 = filterEreaders(ereaders, { ...INITIAL_EREADER_FILTERS, maxPrice: 100 });
const eMax100Expected = ereaders.filter(e => e.priceUsd <= 100).length;
assert(eMax100.length === eMax100Expected, 'Ereaders maxPrice 100 filter (lowest bound)', `Got ${eMax100.length}, expected ${eMax100Expected}`);

console.log('\n=== TEST SUITE 3: SEARCH QUERIES (CASE, SUBSTRING, PROS/CONS, BRAND) ===');

// Wearables Search
// Lowercase
const wQueryPixel = filterWearables(wearables, { ...INITIAL_WEARABLE_FILTERS, searchQuery: 'pixel' });
assert(wQueryPixel.length === 2 && wQueryPixel.every(w => w.name.includes('Pixel')), 'Wearables search "pixel" (lowercase)');

// Uppercase
const wQueryPIXEL = filterWearables(wearables, { ...INITIAL_WEARABLE_FILTERS, searchQuery: 'PIXEL' });
assert(wQueryPIXEL.length === wQueryPixel.length, 'Wearables search "PIXEL" (uppercase case-insensitivity)');

// Whitespace trim
const wQueryPixelSpaces = filterWearables(wearables, { ...INITIAL_WEARABLE_FILTERS, searchQuery: '  pixel   ' });
assert(wQueryPixelSpaces.length === wQueryPixel.length, 'Wearables search with leading/trailing whitespace');

// Partial match in description or pros
const wQueryTitanium = filterWearables(wearables, { ...INITIAL_WEARABLE_FILTERS, searchQuery: 'titanio' });
assert(wQueryTitanium.length > 0, 'Wearables search "titanio" in pros/description', `Found ${wQueryTitanium.length} devices`);

// Non-matching query
const wQueryNonMatching = filterWearables(wearables, { ...INITIAL_WEARABLE_FILTERS, searchQuery: 'xyz_nonexistent_brand_123' });
assert(wQueryNonMatching.length === 0, 'Wearables search non-matching query yields 0');

// Empty query
const wQueryEmpty = filterWearables(wearables, { ...INITIAL_WEARABLE_FILTERS, searchQuery: '   ' });
assert(wQueryEmpty.length === 21, 'Wearables search with blank spaces yields all 21');

// Ereaders Search
// Lowercase
const eQueryKindle = filterEreaders(ereaders, { ...INITIAL_EREADER_FILTERS, searchQuery: 'kindle' });
assert(eQueryKindle.length === 6, 'Ereaders search "kindle" (6 devices)', `Got ${eQueryKindle.length}`);

// Uppercase
const eQueryKINDLE = filterEreaders(ereaders, { ...INITIAL_EREADER_FILTERS, searchQuery: 'KINDLE' });
assert(eQueryKINDLE.length === 6, 'Ereaders search "KINDLE" (uppercase case-insensitivity)');

// Search formats (e.g., EPUB, PDF)
const eQueryEpub = filterEreaders(ereaders, { ...INITIAL_EREADER_FILTERS, searchQuery: 'epub' });
assert(eQueryEpub.length > 0, 'Ereaders search "epub" in supportedFormats', `Found ${eQueryEpub.length}`);

// Non-matching query
const eQueryNonMatching = filterEreaders(ereaders, { ...INITIAL_EREADER_FILTERS, searchQuery: 'supercalifragilistic' });
assert(eQueryNonMatching.length === 0, 'Ereaders search non-matching yields 0');

console.log('\n=== TEST SUITE 4: MULTI-FILTER COMBINATIONS ===');

// Wearables: Apple + Smartwatch + iOS + ECG
const wMulti1 = filterWearables(wearables, {
  ...INITIAL_WEARABLE_FILTERS,
  selectedBrands: ['Apple'],
  selectedCategories: ['smartwatch'],
  selectedEcosystems: ['iOS'],
  requiredSensors: { ...INITIAL_WEARABLE_FILTERS.requiredSensors, ecg: true },
});
assert(wMulti1.length === 2 && wMulti1.every(w => w.brand === 'Apple'), 'Wearables Multi: Apple + Smartwatch + iOS + ECG', `Found ${wMulti1.length}`);

// Wearables: Rings with No Subscription
const wMulti2 = filterWearables(wearables, {
  ...INITIAL_WEARABLE_FILTERS,
  selectedCategories: ['ring'],
  selectedSubscriptions: ['free'],
});
assert(
  wMulti2.length > 0 && wMulti2.every(w => w.category === 'ring' && !w.subscriptionRequired),
  'Wearables Multi: Rings + Free Subscription',
  `Found ${wMulti2.length} (${wMulti2.map(w => w.name).join(', ')})`
);

// Wearables: Rings with Subscription (e.g. Oura)
const wMulti3 = filterWearables(wearables, {
  ...INITIAL_WEARABLE_FILTERS,
  selectedCategories: ['ring'],
  selectedSubscriptions: ['subscription'],
});
assert(
  wMulti3.length > 0 && wMulti3.every(w => w.category === 'ring' && w.subscriptionRequired),
  'Wearables Multi: Rings + Paid Subscription',
  `Found ${wMulti3.length} (${wMulti3.map(w => w.name).join(', ')})`
);

// Ereaders: Color screen + Page turn buttons
const eMulti1 = filterEreaders(ereaders, {
  ...INITIAL_EREADER_FILTERS,
  colorScreenOnly: true,
  pageTurnButtonsOnly: true,
});
assert(
  eMulti1.length > 0 && eMulti1.every(e => e.colorScreen && e.pageTurnButtons),
  'Ereaders Multi: Color Screen + Page Turn Buttons',
  `Found ${eMulti1.length} (${eMulti1.map(e => e.name).join(', ')})`
);

// Ereaders: Open Android + Stylus support
const eMulti2 = filterEreaders(ereaders, {
  ...INITIAL_EREADER_FILTERS,
  openAndroidOnly: true,
  stylusSupportOnly: true,
});
assert(
  eMulti2.length > 0 && eMulti2.every(e => e.openAndroid && e.stylusSupport),
  'Ereaders Multi: Open Android + Stylus Support',
  `Found ${eMulti2.length} (${eMulti2.map(e => e.name).join(', ')})`
);

// Ereaders: Brand Kobo + Waterproof + MaxPrice 300
const eMulti3 = filterEreaders(ereaders, {
  ...INITIAL_EREADER_FILTERS,
  selectedBrands: ['Rakuten Kobo'],
  waterproofOnly: true,
  maxPrice: 300,
});
assert(
  eMulti3.length > 0 && eMulti3.every(e => e.brand === 'Rakuten Kobo' && e.waterproof.includes('IPX8') && e.priceUsd <= 300),
  'Ereaders Multi: Kobo + IPX8 Waterproof + MaxPrice 300',
  `Found ${eMulti3.length} (${eMulti3.map(e => e.name).join(', ')})`
);

console.log('\n=== SUMMARY OF RESULTS ===');
const passed = testResults.filter(r => r.status === 'PASS').length;
const failed = testResults.filter(r => r.status === 'FAIL').length;
console.log(`Total tests: ${testResults.length} | Passed: ${passed} | Failed: ${failed}`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL EMPIRICAL TESTS PASSED PERFECTLY!');
}
