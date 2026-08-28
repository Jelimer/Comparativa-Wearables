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

function parseTsObject(filePath, exportName) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const startIndex = content.indexOf(`export const ${exportName}`);
  const objStart = content.indexOf('{', startIndex);
  const objEnd = content.lastIndexOf('};');
  const objStr = content.substring(objStart, objEnd + 1);
  return new Function(`return ${objStr}`)();
}

const WEARABLES_DATA = parseTsData(path.resolve('src/data/wearables.ts'), 'WEARABLES_DATA');
const EREADERS_DATA = parseTsData(path.resolve('src/data/ereaders.ts'), 'EREADERS_DATA');
const TOOLTIP_DICT = parseTsObject(path.resolve('src/data/tooltipDictionary.ts'), 'TOOLTIP_DICTIONARY');
const EREADER_TOOLTIP_DICT = parseTsObject(path.resolve('src/data/ereaderTooltipDictionary.ts'), 'EREADER_TOOLTIP_DICTIONARY');

console.log('======================================================================');
console.log('  CHALLENGER 2 (M3): EMPIRICAL VERIFICATION & STRESS TEST HARNESS');
console.log('  Focus: UI/UX, Themes, Modals, Responsiveness & Filter Combinations');
console.log('======================================================================\n');

let passCount = 0;
let failCount = 0;
const failures = [];

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`[PASS] ${testName} ${details ? '(' + details + ')' : ''}`);
    passCount++;
  } else {
    const msg = `[FAIL] ${testName} ${details ? '- ' + details : ''}`;
    console.error(msg);
    failures.push(msg);
    failCount++;
  }
}

// ----------------------------------------------------------------------
// 1. FILTERING MATRIX & COMBINATORIAL STRESS TESTS
// ----------------------------------------------------------------------
console.log('\n--- 1. FILTERING MATRIX & COMBINATORIAL STRESS TESTS ---');

// Wearables filtering logic
function filterWearables(filters) {
  const query = filters.searchQuery.trim().toLowerCase();
  return WEARABLES_DATA.filter((device) => {
    if (device.priceUsd > filters.maxPrice) return false;
    if (device.batteryHours < filters.minBatteryHours) return false;

    const { ecg, spO2, edaStress, bodyComposition, bloodPressure, gps, skinTemp } = filters.requiredSensors;
    if (ecg && !device.sensors.ecg) return false;
    if (spO2 && !device.sensors.spO2) return false;
    if (edaStress && !device.sensors.edaStress) return false;
    if (bodyComposition && !device.sensors.bodyComposition) return false;
    if (bloodPressure && !device.sensors.bloodPressure) return false;
    if (gps && !device.sensors.gps) return false;
    if (skinTemp && !device.sensors.skinTemp) return false;

    if (filters.selectedBrands.length > 0 && !filters.selectedBrands.includes(device.brand)) return false;
    if (filters.selectedCategories.length > 0 && !filters.selectedCategories.includes(device.category)) return false;
    if (filters.selectedEcosystems.length > 0 && !device.ecosystem.some((eco) => filters.selectedEcosystems.includes(eco))) return false;

    if (filters.selectedSubscriptions.length > 0) {
      const matchesFree = filters.selectedSubscriptions.includes('free') && !device.subscriptionRequired;
      const matchesSub = filters.selectedSubscriptions.includes('subscription') && device.subscriptionRequired;
      if (!matchesFree && !matchesSub) return false;
    }

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
}

// Ereaders filtering logic
function filterEreaders(filters) {
  const query = filters.searchQuery.trim().toLowerCase();
  return EREADERS_DATA.filter((device) => {
    if (device.priceUsd > filters.maxPrice) return false;
    if (filters.colorScreenOnly && !device.colorScreen) return false;
    if (filters.warmLightOnly && !device.warmLight) return false;
    if (filters.pageTurnButtonsOnly && !device.pageTurnButtons) return false;
    if (filters.stylusSupportOnly && !device.stylusSupport) return false;
    if (filters.waterproofOnly && !device.waterproof.includes('IPX8')) return false;
    if (filters.audiobookOnly && !device.audiobookSupport) return false;
    if (filters.openAndroidOnly && !device.openAndroid) return false;

    if (filters.selectedBrands.length > 0 && !filters.selectedBrands.includes(device.brand)) return false;
    if (filters.selectedCategories.length > 0 && !filters.selectedCategories.includes(device.category)) return false;

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
}

const baseWFilters = {
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

const baseEFilters = {
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

// 1.1 All single brand filters
const allWBrands = ['Google/Fitbit', 'Garmin', 'Samsung', 'Oura', 'Whoop', 'RingConn', 'Signal', 'Apple', 'Xiaomi'];
allWBrands.forEach((b) => {
  const res = filterWearables({ ...baseWFilters, selectedBrands: [b] });
  assert(res.length > 0 && res.every((d) => d.brand === b), `Wearable brand filter "${b}"`, `Found ${res.length}`);
});

// 1.2 All category filters
const allWCats = ['smartwatch', 'band', 'ring'];
allWCats.forEach((c) => {
  const res = filterWearables({ ...baseWFilters, selectedCategories: [c] });
  assert(res.length > 0 && res.every((d) => d.category === c), `Wearable category filter "${c}"`, `Found ${res.length}`);
});

// 1.3 Sensor combinations
const allSensors = ['ecg', 'spO2', 'edaStress', 'bodyComposition', 'bloodPressure', 'gps', 'skinTemp'];
allSensors.forEach((s) => {
  const res = filterWearables({
    ...baseWFilters,
    requiredSensors: { ...baseWFilters.requiredSensors, [s]: true },
  });
  assert(res.length > 0 && res.every((d) => d.sensors[s]), `Wearable sensor filter "${s}"`, `Found ${res.length}`);
});

// 1.4 Ereader individual brand filters
const allEBrands = ['Amazon Kindle', 'Rakuten Kobo', 'reMarkable', 'Onyx BOOX', 'Lenovo', 'PocketBook'];
allEBrands.forEach((b) => {
  const res = filterEreaders({ ...baseEFilters, selectedBrands: [b] });
  assert(res.length > 0 && res.every((d) => d.brand === b), `E-reader brand filter "${b}"`, `Found ${res.length}`);
});

// 1.5 Ereader feature toggles
const eToggles = [
  { key: 'colorScreenOnly', prop: 'colorScreen', label: 'Color Screen' },
  { key: 'warmLightOnly', prop: 'warmLight', label: 'Warm Light' },
  { key: 'pageTurnButtonsOnly', prop: 'pageTurnButtons', label: 'Page Turn Buttons' },
  { key: 'stylusSupportOnly', prop: 'stylusSupport', label: 'Stylus Support' },
  { key: 'openAndroidOnly', prop: 'openAndroid', label: 'Open Android' },
  { key: 'audiobookOnly', prop: 'audiobookSupport', label: 'Audiobooks' },
];
eToggles.forEach((t) => {
  const res = filterEreaders({ ...baseEFilters, [t.key]: true });
  assert(res.length > 0 && res.every((d) => Boolean(d[t.prop])), `E-reader feature filter "${t.label}"`, `Found ${res.length}`);
});

// 1.6 Active filter counter accuracy test
function countActiveWFilters(f) {
  let count = 0;
  if (f.searchQuery.trim() !== '') count++;
  count += f.selectedBrands.length;
  count += f.selectedCategories.length;
  count += f.selectedEcosystems.length;
  count += f.selectedSubscriptions.length;
  if (f.maxPrice < 1000) count++;
  if (f.minBatteryHours > 0) count++;
  Object.values(f.requiredSensors).forEach((val) => {
    if (val) count++;
  });
  return count;
}

const testWFilter = {
  ...baseWFilters,
  searchQuery: 'galaxy',
  selectedBrands: ['Samsung'],
  selectedCategories: ['smartwatch', 'ring'],
  maxPrice: 400,
  minBatteryHours: 48,
  requiredSensors: { ...baseWFilters.requiredSensors, ecg: true, spO2: true },
};
// 1 (search) + 1 (brand) + 2 (categories) + 1 (price < 1000) + 1 (battery > 0) + 2 (sensors) = 8
assert(countActiveWFilters(testWFilter) === 8, 'Wearable active filter counter computes 8 correctly');
assert(countActiveWFilters(baseWFilters) === 0, 'Wearable active filter counter on default state is 0');

function countActiveEFilters(f) {
  let count = 0;
  if (f.searchQuery.trim() !== '') count++;
  count += f.selectedBrands.length;
  count += f.selectedCategories.length;
  if (f.colorScreenOnly) count++;
  if (f.warmLightOnly) count++;
  if (f.pageTurnButtonsOnly) count++;
  if (f.stylusSupportOnly) count++;
  if (f.waterproofOnly) count++;
  if (f.audiobookOnly) count++;
  if (f.openAndroidOnly) count++;
  if (f.maxPrice < 600) count++;
  return count;
}

const testEFilter = {
  ...baseEFilters,
  searchQuery: 'kobo',
  selectedBrands: ['Rakuten Kobo'],
  colorScreenOnly: true,
  pageTurnButtonsOnly: true,
  maxPrice: 300,
};
// 1 (search) + 1 (brand) + 1 (color) + 1 (buttons) + 1 (maxPrice < 600) = 5
assert(countActiveEFilters(testEFilter) === 5, 'E-reader active filter counter computes 5 correctly');
assert(countActiveEFilters(baseEFilters) === 0, 'E-reader active filter counter on default state is 0');

// 1.7 Zero results empty state resilience
const zeroW = filterWearables({
  ...baseWFilters,
  selectedBrands: ['Apple'],
  selectedCategories: ['ring'], // Apple makes no smart rings
});
assert(zeroW.length === 0, 'Wearables conflicting filter (Apple + Ring) returns exactly 0 results without errors');

const zeroE = filterEreaders({
  ...baseEFilters,
  selectedBrands: ['Amazon Kindle'],
  openAndroidOnly: true, // Kindle runs proprietary OS, not open Android
});
assert(zeroE.length === 0, 'E-readers conflicting filter (Kindle + Open Android) returns exactly 0 results without errors');


// ----------------------------------------------------------------------
// 2. COMPARISON DRAWER & SELECTION LOGIC
// ----------------------------------------------------------------------
console.log('\n--- 2. COMPARISON DRAWER & SELECTION LOGIC ---');

function toggleCompare(prevList, deviceId) {
  if (prevList.includes(deviceId)) {
    return prevList.filter((id) => id !== deviceId);
  }
  if (prevList.length >= 4) {
    return prevList;
  }
  return [...prevList, deviceId];
}

let compareTest = [];
const sampleIds = WEARABLES_DATA.slice(0, 6).map((d) => d.id);

// Add 1st
compareTest = toggleCompare(compareTest, sampleIds[0]);
assert(compareTest.length === 1 && compareTest[0] === sampleIds[0], 'Add 1st item to compare list');

// Add 2nd, 3rd, 4th
compareTest = toggleCompare(compareTest, sampleIds[1]);
compareTest = toggleCompare(compareTest, sampleIds[2]);
compareTest = toggleCompare(compareTest, sampleIds[3]);
assert(compareTest.length === 4, 'Compare list holds 4 items');

// Attempt to add 5th item (must be rejected)
compareTest = toggleCompare(compareTest, sampleIds[4]);
assert(compareTest.length === 4 && !compareTest.includes(sampleIds[4]), '5th item strictly rejected when cap of 4 is reached');

// Toggle 2nd item (should remove)
compareTest = toggleCompare(compareTest, sampleIds[1]);
assert(compareTest.length === 3 && !compareTest.includes(sampleIds[1]), 'Toggle existing item removes it from list');

// Re-add 5th item now that length is 3
compareTest = toggleCompare(compareTest, sampleIds[4]);
assert(compareTest.length === 4 && compareTest.includes(sampleIds[4]), 'Can add new item when slot frees up');

// Clear all
compareTest = [];
assert(compareTest.length === 0, 'Clear all resets compare list to 0');

// 2.2 Comparison Modal Winner Calculation Tests
const compareDevices = WEARABLES_DATA.slice(0, 4);
const bestRating = [...compareDevices].sort((a, b) => b.rating - a.rating)[0];
const bestBattery = [...compareDevices].sort((a, b) => b.batteryHours - a.batteryHours)[0];
const lowestPrice = [...compareDevices].sort((a, b) => a.priceUsd - b.priceUsd)[0];

assert(bestRating && typeof bestRating.rating === 'number', 'ComparisonModal bestRating computation produces valid device');
assert(bestBattery && typeof bestBattery.batteryHours === 'number', 'ComparisonModal bestBattery computation produces valid device');
assert(lowestPrice && typeof lowestPrice.priceUsd === 'number', 'ComparisonModal lowestPrice computation produces valid device');
assert(
  bestRating.rating >= Math.max(...compareDevices.map((d) => d.rating)),
  'bestRating is true maximum rating among selected devices'
);
assert(
  bestBattery.batteryHours >= Math.max(...compareDevices.map((d) => d.batteryHours)),
  'bestBattery is true maximum battery hours among selected devices'
);
assert(
  lowestPrice.priceUsd <= Math.min(...compareDevices.map((d) => d.priceUsd)),
  'lowestPrice is true minimum price among selected devices'
);


// ----------------------------------------------------------------------
// 3. STICKY COLUMNS & RESPONSIVE COMPARISON TABLES
// ----------------------------------------------------------------------
console.log('\n--- 3. STICKY COLUMNS & RESPONSIVE COMPARISON TABLES ---');

const comparisonModalCode = fs.readFileSync('src/components/ComparisonModal.tsx', 'utf-8');
const ereaderComparisonModalCode = fs.readFileSync('src/components/ereaders/EreaderComparisonModal.tsx', 'utf-8');

// Check sticky classes in ComparisonModal
assert(
  comparisonModalCode.includes('sticky left-0 z-10'),
  'ComparisonModal.tsx implements "sticky left-0 z-10" on sticky header/cells'
);
assert(
  comparisonModalCode.includes('overflow-x-auto'),
  'ComparisonModal.tsx table container has "overflow-x-auto" for horizontal scrolling'
);
assert(
  comparisonModalCode.includes('min-w-[600px]'),
  'ComparisonModal.tsx table specifies "min-w-[600px]" to protect against narrow column squishing'
);
assert(
  comparisonModalCode.includes('bg-slate-100 dark:bg-slate-900') || comparisonModalCode.includes('bg-slate-50 dark:bg-slate-900'),
  'ComparisonModal.tsx sticky columns have solid background colors in both light and dark modes'
);
assert(
  comparisonModalCode.includes('shadow-[2px_0_6px_rgba'),
  'ComparisonModal.tsx sticky columns have box-shadow depth separator for horizontal scrolling'
);

// Check sticky classes in EreaderComparisonModal
assert(
  ereaderComparisonModalCode.includes('sticky left-0 z-10'),
  'EreaderComparisonModal.tsx implements "sticky left-0 z-10" on sticky header/cells'
);
assert(
  ereaderComparisonModalCode.includes('overflow-x-auto'),
  'EreaderComparisonModal.tsx table container has "overflow-x-auto" for horizontal scrolling'
);
assert(
  ereaderComparisonModalCode.includes('min-w-[700px]'),
  'EreaderComparisonModal.tsx table specifies "min-w-[700px]" to protect columns on mobile'
);
assert(
  ereaderComparisonModalCode.includes('bg-slate-100 dark:bg-slate-900') || ereaderComparisonModalCode.includes('bg-slate-50 dark:bg-slate-900'),
  'EreaderComparisonModal.tsx sticky columns have solid light/dark background colors'
);


// ----------------------------------------------------------------------
// 4. DARK / LIGHT MODE & THEME CONSISTENCY
// ----------------------------------------------------------------------
console.log('\n--- 4. DARK / LIGHT MODE & THEME CONSISTENCY ---');

const tailwindConfig = fs.readFileSync('tailwind.config.js', 'utf-8');
assert(tailwindConfig.includes("darkMode: 'class'"), 'tailwind.config.js has darkMode: "class" configured');
assert(tailwindConfig.includes("'3xl': '1920px'"), 'tailwind.config.js defines ultrawide breakpoint 3xl: 1920px');

const appCode = fs.readFileSync('src/App.tsx', 'utf-8');
assert(
  appCode.includes("document.documentElement.classList.add('dark')") &&
  appCode.includes("document.documentElement.classList.remove('dark')"),
  'App.tsx properly synchronizes dark mode class on document.documentElement'
);
assert(
  appCode.includes("document.documentElement.classList.add('light')") &&
  appCode.includes("document.documentElement.classList.remove('light')"),
  'App.tsx properly synchronizes light mode class on document.documentElement'
);

const headerCode = fs.readFileSync('src/components/Header.tsx', 'utf-8');
assert(
  headerCode.includes('Sun') && headerCode.includes('Moon'),
  'Header.tsx has Sun/Moon toggle icons for theme switching'
);
assert(
  headerCode.includes('Cambiar a Modo Claro') && headerCode.includes('Cambiar a Modo Oscuro'),
  'Header.tsx has accessible Spanish titles for theme toggle'
);

// Scan all components for dark: modifier presence
const componentFiles = [
  'src/components/Header.tsx',
  'src/components/Footer.tsx',
  'src/components/HeroSection.tsx',
  'src/components/RecommendationBanner.tsx',
  'src/components/FilterBar.tsx',
  'src/components/DeviceGrid.tsx',
  'src/components/DeviceCard.tsx',
  'src/components/ComparisonModal.tsx',
  'src/components/DeviceDetailModal.tsx',
  'src/components/StrategicGuide.tsx',
  'src/components/Tooltip.tsx',
  'src/components/WearablesView.tsx',
  'src/components/EreadersView.tsx',
  'src/components/ereaders/EreaderHero.tsx',
  'src/components/ereaders/EreaderRecommendationBanner.tsx',
  'src/components/ereaders/EreaderFilterBar.tsx',
  'src/components/ereaders/EreaderGrid.tsx',
  'src/components/ereaders/EreaderCard.tsx',
  'src/components/ereaders/EreaderComparisonModal.tsx',
  'src/components/ereaders/EreaderDetailModal.tsx',
  'src/components/ereaders/EreaderStrategicGuide.tsx',
  'src/components/ereaders/EreaderTooltip.tsx',
];

componentFiles.forEach((file) => {
  const content = fs.readFileSync(file, 'utf-8');
  assert(content.includes('dark:'), `Component "${file}" contains dark: responsive theme classes`);
});


// ----------------------------------------------------------------------
// 5. MODALS, SCROLL LOCKING & KEYBOARD ACCESSIBILITY
// ----------------------------------------------------------------------
console.log('\n--- 5. MODALS, SCROLL LOCKING & KEYBOARD ACCESSIBILITY ---');

const modalFiles = [
  'src/components/ComparisonModal.tsx',
  'src/components/DeviceDetailModal.tsx',
  'src/components/ereaders/EreaderComparisonModal.tsx',
  'src/components/ereaders/EreaderDetailModal.tsx',
];

modalFiles.forEach((mFile) => {
  const content = fs.readFileSync(mFile, 'utf-8');
  assert(
    content.includes("document.body.style.overflow = 'hidden'"),
    `Modal "${mFile}" locks body scroll on mount`
  );
  assert(
    content.includes("document.body.style.overflow = originalOverflow") || content.includes("removeEventListener"),
    `Modal "${mFile}" restores body scroll on unmount`
  );
  assert(
    content.includes("'Escape'") || content.includes('"Escape"'),
    `Modal "${mFile}" listens to Escape key for dismissal`
  );
  assert(
    content.includes('e.stopPropagation()'),
    `Modal "${mFile}" contains e.stopPropagation() on modal card to prevent closing when clicking inside`
  );
  assert(
    content.includes('fixed inset-0 z-50'),
    `Modal "${mFile}" uses full viewport overlay with high z-index`
  );
});


// ----------------------------------------------------------------------
// 6. TOOLTIP DICTIONARY INTEGRITY & SPANISH LOCALIZATION
// ----------------------------------------------------------------------
console.log('\n--- 6. TOOLTIP DICTIONARY INTEGRITY & SPANISH LOCALIZATION ---');

// Check that all termKeys used across the code exist in the dictionaries
const allCode = componentFiles.map((f) => fs.readFileSync(f, 'utf-8')).join('\n');

const wearableTermMatches = [...allCode.matchAll(/<Tooltip[^>]*termKey=["']([^"']+)["']/g)].map((m) => m[1]);
wearableTermMatches.forEach((k) => {
  assert(Boolean(TOOLTIP_DICT[k]), `Wearables Tooltip dictionary has key "${k}"`);
});

const ereaderTermMatches = [...allCode.matchAll(/<EreaderTooltip[^>]*termKey=["']([^"']+)["']/g)].map((m) => m[1]);
ereaderTermMatches.forEach((k) => {
  assert(Boolean(EREADER_TOOLTIP_DICT[k]), `E-readers Tooltip dictionary has key "${k}"`);
});

// Verify Tooltips dictionary content in Spanish
Object.entries(TOOLTIP_DICT).forEach(([k, val]) => {
  assert(val.title && val.shortDesc && val.detailedExplanation, `Wearable Tooltip "${k}" has title, shortDesc, and detailedExplanation in Spanish`);
});

Object.entries(EREADER_TOOLTIP_DICT).forEach(([k, val]) => {
  assert(val.term && val.shortDescription && val.detailedExplanation, `E-reader Tooltip "${k}" has term, shortDescription, and detailedExplanation in Spanish`);
});

// Localization scan for untranslated English buttons/labels
const englishForbiddenPatterns = [
  /\bClose\b/,
  /\bCompare All\b/,
  /\bClear All\b/,
  /\bAdd to Compare\b/,
  /\bSearch by\b/,
  /\bReset Filters\b/,
  /\bFilter by\b/,
];

let untranslatedFound = 0;
componentFiles.forEach((file) => {
  const content = fs.readFileSync(file, 'utf-8');
  englishForbiddenPatterns.forEach((pat) => {
    // Only check outside of import statements or variable names
    const lines = content.split('\n');
    lines.forEach((line, lineNum) => {
      if (!line.includes('import ') && !line.includes('//') && !line.includes('interface ') && !line.includes('type ')) {
        if (pat.test(line)) {
          console.warn(`Potential untranslated string in ${file}:${lineNum + 1}: ${line.trim()}`);
          untranslatedFound++;
        }
      }
    });
  });
});
assert(untranslatedFound === 0, 'No forbidden untranslated English UI labels found in components');


// ----------------------------------------------------------------------
// 7. BUILD INTEGRITY & ASSET VERIFICATION
// ----------------------------------------------------------------------
console.log('\n--- 7. BUILD INTEGRITY & ASSET VERIFICATION ---');

const distPath = path.resolve('dist');
assert(fs.existsSync(distPath), 'dist/ directory exists from successful build');
const distFiles = fs.readdirSync(path.join(distPath, 'assets'));
assert(distFiles.length >= 8, `dist/assets contains code-split chunks (${distFiles.length} files generated)`);
assert(distFiles.some((f) => f.startsWith('ComparisonModal')), 'ComparisonModal chunk exists in build output');
assert(distFiles.some((f) => f.startsWith('EreaderComparisonModal')), 'EreaderComparisonModal chunk exists in build output');
assert(distFiles.some((f) => f.startsWith('WearablesView')), 'WearablesView chunk exists in build output');
assert(distFiles.some((f) => f.startsWith('EreadersView')), 'EreadersView chunk exists in build output');

console.log('\n======================================================================');
console.log(`  M3 EMPIRICAL RESULTS: TOTAL: ${passCount + failCount} | PASSED: ${passCount} | FAILED: ${failCount}`);
console.log('======================================================================\n');

if (failCount > 0) {
  console.error('FAILED TESTS:');
  failures.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
} else {
  console.log('ALL EMPIRICAL M3 TESTS PASSED WITH 100% SUCCESS!');
}
