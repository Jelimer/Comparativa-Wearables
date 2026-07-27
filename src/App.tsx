import { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { RecommendationBanner } from './components/RecommendationBanner';
import { FilterBar } from './components/FilterBar';
import { DeviceGrid } from './components/DeviceGrid';
import { StrategicGuide } from './components/StrategicGuide';
import { ComparisonModal } from './components/ComparisonModal';
import { DeviceDetailModal } from './components/DeviceDetailModal';
import { Footer } from './components/Footer';
import { WEARABLES_DATA } from './data/wearables';
import { Wearable, FilterState } from './types/wearable';

const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  brand: 'all',
  category: 'all',
  ecosystem: 'all',
  subscription: 'all',
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

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [detailedDevice, setDetailedDevice] = useState<Wearable | null>(null);

  const exploreRef = useRef<HTMLDivElement>(null);

  // Sync dark mode class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [darkMode]);

  // Count active non-default filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery.trim() !== '') count++;
    if (filters.brand !== 'all') count++;
    if (filters.category !== 'all') count++;
    if (filters.ecosystem !== 'all') count++;
    if (filters.subscription !== 'all') count++;
    if (filters.maxPrice < 1000) count++;
    if (filters.minBatteryHours > 0) count++;
    Object.values(filters.requiredSensors).forEach((val) => {
      if (val) count++;
    });
    return count;
  }, [filters]);

  // Reset all filters
  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  // Toggle device in compare selection (max 4)
  const handleToggleCompare = (device: Wearable) => {
    setSelectedCompareIds((prev) => {
      if (prev.includes(device.id)) {
        return prev.filter((id) => id !== device.id);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, device.id];
    });
  };

  const handleRemoveCompareDevice = (deviceId: string) => {
    setSelectedCompareIds((prev) => prev.filter((id) => id !== deviceId));
  };

  const handleClearCompareAll = () => {
    setSelectedCompareIds([]);
  };

  // Filter & Sort Wearables
  const filteredWearables = useMemo(() => {
    return WEARABLES_DATA.filter((device) => {
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

      // Brand filter
      if (filters.brand !== 'all' && device.brand !== filters.brand) {
        return false;
      }

      // Category filter
      if (filters.category !== 'all' && device.category !== filters.category) {
        return false;
      }

      // Ecosystem filter
      if (filters.ecosystem !== 'all') {
        if (!device.ecosystem.includes(filters.ecosystem as any)) {
          return false;
        }
      }

      // Subscription filter
      if (filters.subscription === 'free' && device.subscriptionRequired) {
        return false;
      }
      if (filters.subscription === 'subscription' && !device.subscriptionRequired) {
        return false;
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
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_asc':
          return a.priceUsd - b.priceUsd;
        case 'price_desc':
          return b.priceUsd - a.priceUsd;
        case 'battery_desc':
          return b.batteryHours - a.batteryHours;
        case 'rating_desc':
          return b.rating - a.rating;
        case 'name_asc':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [filters]);

  const selectedCompareDevices = useMemo(() => {
    return WEARABLES_DATA.filter((w) => selectedCompareIds.includes(w.id));
  }, [selectedCompareIds]);

  const scrollToExplore = () => {
    exploreRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white">
      {/* Header Bar */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        totalDevices={WEARABLES_DATA.length}
        filteredCount={filteredWearables.length}
        compareCount={selectedCompareIds.length}
        onOpenCompare={() => setIsCompareModalOpen(true)}
      />

      {/* Hero Section */}
      <HeroSection onScrollToExplore={scrollToExplore} />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {/* Recommendation Highlights */}
        <RecommendationBanner
          wearables={WEARABLES_DATA}
          onSelectDevice={(device) => setDetailedDevice(device)}
        />

        {/* Filter Section */}
        <div ref={exploreRef} className="scroll-mt-20">
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            onReset={handleResetFilters}
            activeFilterCount={activeFilterCount}
          />
        </div>

        {/* Catalog Device Grid */}
        <DeviceGrid
          devices={filteredWearables}
          totalDevicesCount={WEARABLES_DATA.length}
          selectedCompareIds={selectedCompareIds}
          onToggleCompare={handleToggleCompare}
          onOpenDetails={(device) => setDetailedDevice(device)}
          filters={filters}
          setFilters={setFilters}
          onResetFilters={handleResetFilters}
        />

        {/* Strategic Decision Guide (4 steps) */}
        <StrategicGuide />
      </main>

      {/* Footer */}
      <Footer />

      {/* Side-by-Side Comparison Modal */}
      <ComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        selectedDevices={selectedCompareDevices}
        onRemoveDevice={handleRemoveCompareDevice}
        onClearAll={handleClearCompareAll}
      />

      {/* Single Device Detail Modal */}
      <DeviceDetailModal
        device={detailedDevice}
        onClose={() => setDetailedDevice(null)}
        onToggleCompare={handleToggleCompare}
        isSelectedForCompare={Boolean(detailedDevice && selectedCompareIds.includes(detailedDevice.id))}
        isCompareMaxReached={selectedCompareIds.length >= 4}
      />
    </div>
  );
}
