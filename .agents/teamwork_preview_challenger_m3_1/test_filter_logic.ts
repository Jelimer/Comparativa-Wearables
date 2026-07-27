import { WEARABLES_DATA } from '../../src/data/wearables.js';
import { Wearable, FilterState, BrandType, CategoryType, EcosystemType } from '../../src/types/wearable.js';

// Filter implementation copied directly from App.tsx lines 98-160 for exact empirical testing
function filterWearables(data: Wearable[], filters: FilterState): Wearable[] {
  return data.filter((device) => {
    // Search query filter
    if (filters.searchQuery.trim() !== '') {
      const query = filters.searchQuery.toLowerCase();
      const matchName = device.name.toLowerCase().includes(query);
      const matchBrand = device.brand.toLowerCase().includes(query);
      const matchDesc = device.description.toLowerCase().includes(query);
      const matchPros = device.pros.some((p) => p.toLowerCase().includes(query));
      const matchCons = device.cons.some((c) => c.toLowerCase().includes(query));
      if (!matchName && !matchBrand && !matchDesc && !matchPros && !matchCons) {
        return false;
      }
    }

    // Brand multi-select filter (OR within brands)
    if (filters.selectedBrands.length > 0 && !filters.selectedBrands.includes(device.brand)) {
      return false;
    }

    // Category multi-select filter (OR within categories)
    if (filters.selectedCategories.length > 0 && !filters.selectedCategories.includes(device.category)) {
      return false;
    }

    // Ecosystem multi-select filter
    if (
      filters.selectedEcosystems.length > 0 &&
      !device.ecosystem.some((eco) => filters.selectedEcosystems.includes(eco))
    ) {
      return false;
    }

    // Subscription multi-select filter
    if (filters.selectedSubscriptions.length > 0) {
      const matchesFree = filters.selectedSubscriptions.includes('free') && !device.subscriptionRequired;
      const matchesSub = filters.selectedSubscriptions.includes('subscription') && device.subscriptionRequired;
      if (!matchesFree && !matchesSub) {
        return false;
      }
    }

    // Price filter
    if (device.priceUsd > filters.maxPrice) {
      return false;
    }

    // Battery filter
    if (device.batteryHours < filters.minBatteryHours) {
      return false;
    }

    // Sensor requirements
    const { ecg, spO2, edaStress, bodyComposition, bloodPressure, gps, skinTemp } =
      filters.requiredSensors;
    if (ecg && !device.sensors.ecg) return false;
    if (spO2 && !device.sensors.spO2) return false;
    if (edaStress && !device.sensors.edaStress) return false;
    if (bodyComposition && !device.sensors.bodyComposition) return false;
    if (bloodPressure && !device.sensors.bloodPressure) return false;
    if (gps && !device.sensors.gps) return false;
    if (skinTemp && !device.sensors.skinTemp) return false;

    return true;
  });
}

const INITIAL_FILTERS: FilterState = {
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

console.log('=== RUNNING EMPIRICAL TEST SUITE FOR MULTI-SELECT FILTERING ===\n');

let totalTests = 0;
let passedTests = 0;

function assertTest(name: string, condition: boolean, details: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`[PASS] ${name}`);
    console.log(`       Details: ${details}`);
  } else {
    console.log(`[FAIL] ${name}`);
    console.log(`       Details: ${details}`);
  }
}

// Suite 1: Empty Selections vs Multi-Brand Selections
console.log('--- TEST SUITE 1: Brand Selection Logic ---');

// Test 1.1: Default filters (empty brand selection)
const res1_1 = filterWearables(WEARABLES_DATA, INITIAL_FILTERS);
assertTest(
  'Test 1.1: Empty selectedBrands returns all 15 devices',
  res1_1.length === 15,
  `Expected 15, got ${res1_1.length}`
);

// Test 1.2: Single brand selection ('Garmin')
const res1_2 = filterWearables(WEARABLES_DATA, { ...INITIAL_FILTERS, selectedBrands: ['Garmin'] });
assertTest(
  'Test 1.2: Single brand "Garmin" returns 2 Garmin devices',
  res1_2.length === 2 && res1_2.every((d) => d.brand === 'Garmin'),
  `Expected 2 Garmin devices, got ${res1_2.length} (${res1_2.map((d) => d.name).join(', ')})`
);

// Test 1.3: Multi-brand selection ('Garmin' + 'Whoop' + 'Apple')
const res1_3 = filterWearables(WEARABLES_DATA, {
  ...INITIAL_FILTERS,
  selectedBrands: ['Garmin', 'Whoop', 'Apple'],
});
assertTest(
  'Test 1.3: Multi-brand ("Garmin", "Whoop", "Apple") returns 4 devices',
  res1_3.length === 4 &&
    res1_3.some((d) => d.brand === 'Garmin') &&
    res1_3.some((d) => d.brand === 'Whoop') &&
    res1_3.some((d) => d.brand === 'Apple'),
  `Expected 4 devices (2 Garmin, 1 Whoop, 1 Apple), got ${res1_3.length} (${res1_3.map((d) => d.name).join(', ')})`
);

// Test 1.4: Select all 9 brands
const allBrands: BrandType[] = [
  'Google/Fitbit',
  'Garmin',
  'Samsung',
  'Oura',
  'Whoop',
  'RingConn',
  'Signal',
  'Apple',
  'Xiaomi',
];
const res1_4 = filterWearables(WEARABLES_DATA, { ...INITIAL_FILTERS, selectedBrands: allBrands });
assertTest(
  'Test 1.4: Selecting all 9 brands returns all 15 devices',
  res1_4.length === 15,
  `Expected 15, got ${res1_4.length}`
);

// Suite 2: Cross-Category Filtering (Brands + Categories + Ecosystems + Subscriptions + Required Sensors)
console.log('\n--- TEST SUITE 2: Cross-Category Filtering ---');

// Test 2.1: Multi-category cross filter
// Samsung + Google/Fitbit, Smartwatches, Android, Sin Suscripcion, ECG + GPS
const res2_1 = filterWearables(WEARABLES_DATA, {
  ...INITIAL_FILTERS,
  selectedBrands: ['Samsung', 'Google/Fitbit'],
  selectedCategories: ['smartwatch'],
  selectedEcosystems: ['Android'],
  selectedSubscriptions: ['free'],
  requiredSensors: { ...INITIAL_FILTERS.requiredSensors, ecg: true, gps: true },
});
assertTest(
  'Test 2.1: Cross-filter (Samsung/Fitbit + Smartwatch + Android + Free + ECG + GPS)',
  res2_1.length === 4,
  `Expected 4 devices, got ${res2_1.length} (${res2_1.map((d) => d.name).join(', ')})`
);

// Test 2.2: Contradictory cross filter (iOS ecosystem + Samsung brand)
const res2_2 = filterWearables(WEARABLES_DATA, {
  ...INITIAL_FILTERS,
  selectedBrands: ['Samsung'],
  selectedEcosystems: ['iOS'],
});
assertTest(
  'Test 2.2: Contradictory filter (Brand: Samsung + Ecosystem: iOS) returns 0 devices',
  res2_2.length === 0,
  `Expected 0, got ${res2_2.length}`
);

// Test 2.3: Restrictive sensor filter (Ring category + ECG sensor)
const res2_3 = filterWearables(WEARABLES_DATA, {
  ...INITIAL_FILTERS,
  selectedCategories: ['ring'],
  requiredSensors: { ...INITIAL_FILTERS.requiredSensors, ecg: true },
});
assertTest(
  'Test 2.3: Restrictive filter (Category: Ring + Sensor: ECG) returns 0 devices',
  res2_3.length === 0,
  `Expected 0, got ${res2_3.length}`
);

// Test 2.4: Subscription filter ('subscription' required)
const res2_4 = filterWearables(WEARABLES_DATA, {
  ...INITIAL_FILTERS,
  selectedSubscriptions: ['subscription'],
});
assertTest(
  'Test 2.4: Subscription filter ("subscription") returns 2 devices (Oura 4, Whoop 4.0)',
  res2_4.length === 2 && res2_4.every((d) => d.subscriptionRequired),
  `Expected 2 devices, got ${res2_4.length} (${res2_4.map((d) => d.name).join(', ')})`
);

// Test 2.5: Dual subscription filter ('free' AND 'subscription')
const res2_5 = filterWearables(WEARABLES_DATA, {
  ...INITIAL_FILTERS,
  selectedSubscriptions: ['free', 'subscription'],
});
assertTest(
  'Test 2.5: Selecting both "free" and "subscription" returns all 15 devices',
  res2_5.length === 15,
  `Expected 15, got ${res2_5.length}`
);

// Suite 3: Empty Result Set & Reset Filters
console.log('\n--- TEST SUITE 3: Empty Result Set & Reset Filters ---');

// Test 3.1: Ultra restrictive filters (Max price $40)
const res3_1 = filterWearables(WEARABLES_DATA, {
  ...INITIAL_FILTERS,
  maxPrice: 40,
});
assertTest(
  'Test 3.1: Max price $40 (below min device price $49) yields empty result set',
  res3_1.length === 0,
  `Expected 0, got ${res3_1.length}`
);

// Test 3.2: Reset filters state comparison
const modifiedFilters: FilterState = {
  searchQuery: 'NonExistentDevice123',
  selectedBrands: ['Apple', 'Whoop'],
  selectedCategories: ['ring'],
  selectedEcosystems: ['Android'],
  selectedSubscriptions: ['subscription'],
  maxPrice: 100,
  minBatteryHours: 500,
  requiredSensors: {
    ecg: true,
    spO2: true,
    edaStress: true,
    bodyComposition: true,
    bloodPressure: true,
    gps: true,
    skinTemp: true,
  },
  sortBy: 'price_asc',
};

const emptyRes = filterWearables(WEARABLES_DATA, modifiedFilters);
const resetRes = filterWearables(WEARABLES_DATA, INITIAL_FILTERS);

assertTest(
  'Test 3.2: Reset filters restores result set from 0 back to all 15 devices',
  emptyRes.length === 0 && resetRes.length === 15,
  `Modified filter count: ${emptyRes.length}, Reset filter count: ${resetRes.length}`
);

// Suite 4: Edge Cases & Failure Mode Stress Testing
console.log('\n--- TEST SUITE 4: Edge Cases & Failure Mode Stress Testing ---');

// Test 4.1: Untrimmed whitespace in searchQuery ("  Garmin  ")
const res4_1 = filterWearables(WEARABLES_DATA, {
  ...INITIAL_FILTERS,
  searchQuery: '  Garmin  ',
});
assertTest(
  'Test 4.1: [BUG DETECTED] Search query with leading/trailing spaces ("  Garmin  ")',
  res4_1.length === 2,
  `Expected 2 Garmin devices, got ${res4_1.length}. BUG CONFIRMED: filters.searchQuery was not trimmed before checking .includes().`
);

// Test 4.2: Maximum battery threshold (720 hours / 30 days)
const res4_2 = filterWearables(WEARABLES_DATA, {
  ...INITIAL_FILTERS,
  minBatteryHours: 720,
});
assertTest(
  'Test 4.2: Min battery 720h returns 1 device (Garmin Epix Pro - 744h)',
  res4_2.length === 1 && res4_2[0].id === 'garmin-epix-pro',
  `Expected 1 (Garmin Epix Pro), got ${res4_2.length} (${res4_2.map((d) => d.name).join(', ')})`
);

// Test 4.3: Battery threshold exceeding max data (750 hours)
const res4_3 = filterWearables(WEARABLES_DATA, {
  ...INITIAL_FILTERS,
  minBatteryHours: 750,
});
assertTest(
  'Test 4.3: Min battery 750h (exceeding all devices) returns 0 devices',
  res4_3.length === 0,
  `Expected 0, got ${res4_3.length}`
);

// Test 4.4: Sensor requirement combination (Blood Pressure AND Body Composition)
const res4_4 = filterWearables(WEARABLES_DATA, {
  ...INITIAL_FILTERS,
  requiredSensors: { ...INITIAL_FILTERS.requiredSensors, bloodPressure: true, bodyComposition: true },
});
assertTest(
  'Test 4.4: Sensors (Blood Pressure AND Body Composition) returns 2 Samsung watches',
  res4_4.length === 2 && res4_4.every((d) => d.brand === 'Samsung'),
  `Expected 2 Samsung watches, got ${res4_4.length} (${res4_4.map((d) => d.name).join(', ')})`
);

console.log(`\n=== TEST SUMMARY: ${passedTests} / ${totalTests} PASSED ===`);
