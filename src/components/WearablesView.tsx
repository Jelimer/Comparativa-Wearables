import React, { useState, useMemo, useRef } from 'react';
import { HeroSection } from './HeroSection';
import { RecommendationBanner } from './RecommendationBanner';
import { FilterBar } from './FilterBar';
import { DeviceGrid } from './DeviceGrid';
import { StrategicGuide } from './StrategicGuide';
import { ComparisonModal } from './ComparisonModal';
import { DeviceDetailModal } from './DeviceDetailModal';
import { WEARABLES_DATA } from '../data/wearables';
import { Wearable, FilterState } from '../types/wearable';

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

interface WearablesViewProps {
  selectedCompareIds: string[];
  setSelectedCompareIds: React.Dispatch<React.SetStateAction<string[]>>;
  isCompareModalOpen: boolean;
  setIsCompareModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const WearablesView: React.FC<WearablesViewProps> = ({
  selectedCompareIds,
  setSelectedCompareIds,
  isCompareModalOpen,
  setIsCompareModalOpen,
}) => {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [detailedDevice, setDetailedDevice] = useState<Wearable | null>(null);

  const exploreRef = useRef<HTMLDivElement>(null);

  // Count active non-default filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery.trim() !== '') count++;
    count += filters.selectedBrands.length;
    count += filters.selectedCategories.length;
    count += filters.selectedEcosystems.length;
    count += filters.selectedSubscriptions.length;
    if (filters.maxPrice < 1000) count++;
    if (filters.minBatteryHours > 0) count++;
    Object.values(filters.requiredSensors).forEach((val) => {
      if (val) count++;
    });
    return count;
  }, [filters]);

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

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
      if (filters.searchQuery.trim() !== '') {
        const query = filters.searchQuery.trim().toLowerCase();
        const matchName = device.name.toLowerCase().includes(query);
        const matchBrand = device.brand.toLowerCase().includes(query);
        const matchDesc = device.description.toLowerCase().includes(query);
        const matchPros = device.pros.some((p) => p.toLowerCase().includes(query));
        const matchCons = device.cons.some((c) => c.toLowerCase().includes(query));
        if (!matchName && !matchBrand && !matchDesc && !matchPros && !matchCons) {
          return false;
        }
      }

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

      if (device.priceUsd > filters.maxPrice) {
        return false;
      }

      if (device.batteryHours < filters.minBatteryHours) {
        return false;
      }

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
    <>
      {/* Hero Section */}
      <HeroSection onScrollToExplore={scrollToExplore} />

      {/* Main App Container */}
      <main className="flex-1 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-10 space-y-16">
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
    </>
  );
};
