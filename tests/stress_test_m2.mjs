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

console.log('====================================================');
console.log('  CHALLENGER 2: EMPIRICAL STRESS TEST SUITE (M2)');
console.log('====================================================\n');

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

// 1. STRESS TEST: Filter & Search Performance under 10,000 rapid cycles
console.log('\n--- 1. Filter & Search Algorithmic Throughput (10,000 cycles) ---');

const searchTerms = ['', 'apple', 'whoop', 'ecg', 'titanio', 'oura', 'gps', 'kobo', 'kindle', 'color', 'android', 'boox', 'remarkable', '300 ppi'];
const sortOptions = ['price_asc', 'price_desc', 'rating_desc', 'name_asc', 'battery_desc'];

const t0 = performance.now();
for (let i = 0; i < 10000; i++) {
  const query = searchTerms[i % searchTerms.length].trim().toLowerCase();
  const maxPrice = 100 + ((i * 37) % 900);
  const minBattery = (i % 5) * 24;
  const sortBy = sortOptions[i % sortOptions.length];

  // Wearables filter simulation
  const filteredW = WEARABLES_DATA.filter((device) => {
    if (device.priceUsd > maxPrice) return false;
    if (device.batteryHours < minBattery) return false;
    if (query !== '') {
      const matchName = device.name.toLowerCase().includes(query);
      const matchBrand = device.brand.toLowerCase().includes(query);
      const matchDesc = device.description.toLowerCase().includes(query);
      const matchPros = device.pros.some((p) => p.toLowerCase().includes(query));
      const matchCons = device.cons.some((c) => c.toLowerCase().includes(query));
      if (!matchName && !matchBrand && !matchDesc && !matchPros && !matchCons) return false;
    }
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price_asc': return a.priceUsd - b.priceUsd;
      case 'price_desc': return b.priceUsd - a.priceUsd;
      case 'battery_desc': return b.batteryHours - a.batteryHours;
      case 'rating_desc': return b.rating - a.rating;
      case 'name_asc': return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  // Ereaders filter simulation
  const filteredE = EREADERS_DATA.filter((device) => {
    if (device.priceUsd > maxPrice) return false;
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
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price_asc': return a.priceUsd - b.priceUsd;
      case 'price_desc': return b.priceUsd - a.priceUsd;
      case 'rating_desc': return b.rating - a.rating;
      case 'name_asc': return a.name.localeCompare(b.name);
      default: return 0;
    }
  });
}
const t1 = performance.now();
const totalMs = t1 - t0;
const perCycleUs = (totalMs / 10000) * 1000;

console.log(`10,000 cycles completed in ${totalMs.toFixed(2)} ms (${perCycleUs.toFixed(2)} microseconds per dual-filter cycle)`);
assert(totalMs < 500, 'Algorithmic filtering latency is sub-millisecond per frame', `Took ${totalMs.toFixed(2)}ms, expected < 500ms`);

// 2. STATE MUTATION & RE-RENDER LOOP IMMUNITY ANALYSIS
console.log('\n--- 2. State Mutation & Re-render Loop Analysis ---');

const appContent = fs.readFileSync(path.resolve('src/App.tsx'), 'utf-8');
const wearablesViewContent = fs.readFileSync(path.resolve('src/components/WearablesView.tsx'), 'utf-8');
const ereadersViewContent = fs.readFileSync(path.resolve('src/components/EreadersView.tsx'), 'utf-8');

const appUseCallbackCount = (appContent.match(/useCallback\(/g) || []).length;
assert(appUseCallbackCount >= 4, 'App.tsx stabilizes essential callback handlers with useCallback', `Found ${appUseCallbackCount}`);

const hasEmptyDepWearablesCount = appContent.includes('const handleWearablesFilteredCount = useCallback((count: number) => {') &&
  appContent.includes('setWearablesFilteredCount(count);\n  }, []);');
assert(hasEmptyDepWearablesCount, 'handleWearablesFilteredCount is referentially stable across parent renders');

const hasEmptyDepEreadersCount = appContent.includes('const handleEreadersFilteredCount = useCallback((count: number) => {') &&
  appContent.includes('setEreadersFilteredCount(count);\n  }, []);');
assert(hasEmptyDepEreadersCount, 'handleEreadersFilteredCount is referentially stable across parent renders');

const wearablesEffectSync = wearablesViewContent.includes('React.useEffect(() => {\n    onFilteredCountChange?.(filteredWearables.length);\n  }, [filteredWearables.length, onFilteredCountChange]);');
assert(wearablesEffectSync, 'WearablesView count sync effect depends strictly on length + stable callback');

const ereadersEffectSync = ereadersViewContent.includes('React.useEffect(() => {\n    onFilteredCountChange?.(filteredEreaders.length);\n  }, [filteredEreaders.length, onFilteredCountChange]);');
assert(ereadersEffectSync, 'EreadersView count sync effect depends strictly on length + stable callback');

// Test C: React.memo wrapping on critical leaf components
const deviceCardContent = fs.readFileSync(path.resolve('src/components/DeviceCard.tsx'), 'utf-8');
const ereaderCardContent = fs.readFileSync(path.resolve('src/components/ereaders/EreaderCard.tsx'), 'utf-8');
const filterBarContent = fs.readFileSync(path.resolve('src/components/FilterBar.tsx'), 'utf-8');
const ereaderFilterBarContent = fs.readFileSync(path.resolve('src/components/ereaders/EreaderFilterBar.tsx'), 'utf-8');
const headerContent = fs.readFileSync(path.resolve('src/components/Header.tsx'), 'utf-8');
const footerContent = fs.readFileSync(path.resolve('src/components/Footer.tsx'), 'utf-8');
const tooltipContent = fs.readFileSync(path.resolve('src/components/Tooltip.tsx'), 'utf-8');
const ereaderTooltipContent = fs.readFileSync(path.resolve('src/components/ereaders/EreaderTooltip.tsx'), 'utf-8');
const deviceGridContent = fs.readFileSync(path.resolve('src/components/DeviceGrid.tsx'), 'utf-8');
const ereaderGridContent = fs.readFileSync(path.resolve('src/components/ereaders/EreaderGrid.tsx'), 'utf-8');
const heroSectionContent = fs.readFileSync(path.resolve('src/components/HeroSection.tsx'), 'utf-8');
const ereaderHeroContent = fs.readFileSync(path.resolve('src/components/ereaders/EreaderHero.tsx'), 'utf-8');
const recBannerContent = fs.readFileSync(path.resolve('src/components/RecommendationBanner.tsx'), 'utf-8');
const ereaderRecBannerContent = fs.readFileSync(path.resolve('src/components/ereaders/EreaderRecommendationBanner.tsx'), 'utf-8');
const stratGuideContent = fs.readFileSync(path.resolve('src/components/StrategicGuide.tsx'), 'utf-8');
const ereaderStratGuideContent = fs.readFileSync(path.resolve('src/components/ereaders/EreaderStrategicGuide.tsx'), 'utf-8');

assert(deviceCardContent.includes('React.memo('), 'DeviceCard is wrapped in React.memo');
assert(ereaderCardContent.includes('React.memo('), 'EreaderCard is wrapped in React.memo');
assert(filterBarContent.includes('React.memo('), 'FilterBar is wrapped in React.memo');
assert(ereaderFilterBarContent.includes('React.memo('), 'EreaderFilterBar is wrapped in React.memo');
assert(deviceGridContent.includes('React.memo('), 'DeviceGrid is wrapped in React.memo');
assert(ereaderGridContent.includes('React.memo('), 'EreaderGrid is wrapped in React.memo');
assert(heroSectionContent.includes('React.memo('), 'HeroSection is wrapped in React.memo');
assert(ereaderHeroContent.includes('React.memo('), 'EreaderHero is wrapped in React.memo');
assert(recBannerContent.includes('React.memo('), 'RecommendationBanner is wrapped in React.memo');
assert(ereaderRecBannerContent.includes('React.memo('), 'EreaderRecommendationBanner is wrapped in React.memo');
assert(stratGuideContent.includes('React.memo('), 'StrategicGuide is wrapped in React.memo');
assert(ereaderStratGuideContent.includes('React.memo('), 'EreaderStrategicGuide is wrapped in React.memo');
assert(wearablesViewContent.includes('React.memo('), 'WearablesView is wrapped in React.memo');
assert(ereadersViewContent.includes('React.memo('), 'EreadersView is wrapped in React.memo');
assert(headerContent.includes('React.memo('), 'Header is wrapped in React.memo');
assert(footerContent.includes('React.memo('), 'Footer is wrapped in React.memo');
assert(tooltipContent.includes('React.memo('), 'Tooltip is wrapped in React.memo');
assert(ereaderTooltipContent.includes('React.memo('), 'EreaderTooltip is wrapped in React.memo');

// 3. CODE SPLITTING & BUNDLE INTEGRITY AUDIT
console.log('\n--- 3. Code Splitting & Chunk Architecture Audit ---');

const distDir = path.resolve('dist/assets');
assert(fs.existsSync(distDir), 'Build distribution directory dist/assets exists');

if (fs.existsSync(distDir)) {
  const files = fs.readdirSync(distDir);

  const vendorReactChunk = files.find(f => f.startsWith('vendor-react-') && f.endsWith('.js'));
  const vendorIconsChunk = files.find(f => f.startsWith('vendor-icons-') && f.endsWith('.js'));
  const indexChunk = files.find(f => f.startsWith('index-') && f.endsWith('.js'));
  const wearablesViewChunk = files.find(f => f.startsWith('WearablesView-') && f.endsWith('.js'));
  const ereadersViewChunk = files.find(f => f.startsWith('EreadersView-') && f.endsWith('.js'));
  const comparisonModalChunk = files.find(f => f.startsWith('ComparisonModal-') && f.endsWith('.js'));
  const ereaderComparisonModalChunk = files.find(f => f.startsWith('EreaderComparisonModal-') && f.endsWith('.js'));
  const deviceDetailModalChunk = files.find(f => f.startsWith('DeviceDetailModal-') && f.endsWith('.js'));
  const ereaderDetailModalChunk = files.find(f => f.startsWith('EreaderDetailModal-') && f.endsWith('.js'));
  const strategicGuideChunk = files.find(f => f.startsWith('StrategicGuide-') && f.endsWith('.js'));
  const ereaderStrategicGuideChunk = files.find(f => f.startsWith('EreaderStrategicGuide-') && f.endsWith('.js'));

  assert(!!vendorReactChunk, `vendor-react chunk isolated (${vendorReactChunk})`);
  assert(!!vendorIconsChunk, `vendor-icons chunk isolated (${vendorIconsChunk})`);
  assert(!!indexChunk, `index entrypoint chunk exists (${indexChunk})`);
  assert(!!wearablesViewChunk, `WearablesView code-split chunk exists (${wearablesViewChunk})`);
  assert(!!ereadersViewChunk, `EreadersView code-split chunk exists (${ereadersViewChunk})`);
  assert(!!comparisonModalChunk, `ComparisonModal on-demand chunk exists (${comparisonModalChunk})`);
  assert(!!ereaderComparisonModalChunk, `EreaderComparisonModal on-demand chunk exists (${ereaderComparisonModalChunk})`);
  assert(!!deviceDetailModalChunk, `DeviceDetailModal on-demand chunk exists (${deviceDetailModalChunk})`);
  assert(!!ereaderDetailModalChunk, `EreaderDetailModal on-demand chunk exists (${ereaderDetailModalChunk})`);
  assert(!!strategicGuideChunk, `StrategicGuide on-demand chunk exists (${strategicGuideChunk})`);
  assert(!!ereaderStrategicGuideChunk, `EreaderStrategicGuide on-demand chunk exists (${ereaderStrategicGuideChunk})`);

  const indexStat = fs.statSync(path.join(distDir, indexChunk));
  const indexSizeKb = indexStat.size / 1024;
  console.log(`Index Chunk Size: ${indexSizeKb.toFixed(2)} kB`);
  assert(indexSizeKb < 100, `Index entrypoint bundle is lightweight (<100 kB, actual: ${indexSizeKb.toFixed(2)} kB)`);
}

// 4. SUSPENSE & ACCESSIBILITY FALLBACK VALIDATION
console.log('\n--- 4. Suspense & Accessibility Fallback Validation ---');

assert(appContent.includes('<Suspense fallback={<ViewLoadingFallback'), 'App.tsx wraps views in Suspense with fallback');
assert(appContent.includes('role="status"'), 'ViewLoadingFallback includes role="status" for screen readers');
assert(appContent.includes('aria-live="polite"'), 'ViewLoadingFallback includes aria-live="polite"');
assert(wearablesViewContent.includes('<Suspense'), 'WearablesView provides Suspense wrappers for lazy modals');
assert(ereadersViewContent.includes('<Suspense'), 'EreadersView provides Suspense wrappers for lazy modals');

console.log(`\n====================================================`);
console.log(`  TOTAL TESTS: ${passCount + failCount} | PASSED: ${passCount} | FAILED: ${failCount}`);
console.log(`====================================================`);

if (failCount > 0) {
  process.exit(1);
}
