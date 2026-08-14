import React, { useState, useMemo, useRef } from 'react';
import { EreaderHero } from './ereaders/EreaderHero';
import { EreaderRecommendationBanner } from './ereaders/EreaderRecommendationBanner';
import { EreaderFilterBar } from './ereaders/EreaderFilterBar';
import { EreaderGrid } from './ereaders/EreaderGrid';
import { EreaderStrategicGuide } from './ereaders/EreaderStrategicGuide';
import { EreaderComparisonModal } from './ereaders/EreaderComparisonModal';
import { EreaderDetailModal } from './ereaders/EreaderDetailModal';
import { EREADERS_DATA } from '../data/ereaders';
import { Ereader, EreaderFilterState } from '../types/ereader';

const INITIAL_EREADER_FILTERS: EreaderFilterState = {
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
  maxPrice: 500,
  sortBy: 'rating_desc',
};

interface EreadersViewProps {
  onOpenCompareGlobal?: () => void;
  selectedCompareIds: string[];
  setSelectedCompareIds: React.Dispatch<React.SetStateAction<string[]>>;
  isCompareModalOpen: boolean;
  setIsCompareModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EreadersView: React.FC<EreadersViewProps> = ({
  selectedCompareIds,
  setSelectedCompareIds,
  isCompareModalOpen,
  setIsCompareModalOpen,
}) => {
  const [filters, setFilters] = useState<EreaderFilterState>(INITIAL_EREADER_FILTERS);
  const [detailedDevice, setDetailedDevice] = useState<Ereader | null>(null);

  const exploreRef = useRef<HTMLDivElement>(null);

  // Count active non-default filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery.trim() !== '') count++;
    count += filters.selectedBrands.length;
    count += filters.selectedCategories.length;
    if (filters.colorScreenOnly) count++;
    if (filters.warmLightOnly) count++;
    if (filters.pageTurnButtonsOnly) count++;
    if (filters.stylusSupportOnly) count++;
    if (filters.waterproofOnly) count++;
    if (filters.audiobookOnly) count++;
    if (filters.openAndroidOnly) count++;
    if (filters.maxPrice < 500) count++;
    return count;
  }, [filters]);

  const handleResetFilters = () => {
    setFilters(INITIAL_EREADER_FILTERS);
  };

  const handleToggleCompare = (device: Ereader) => {
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

  // Filter & Sort E-readers
  const filteredEreaders = useMemo(() => {
    return EREADERS_DATA.filter((device) => {
      // Search query
      if (filters.searchQuery.trim() !== '') {
        const query = filters.searchQuery.trim().toLowerCase();
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

      // Brand multi-select
      if (filters.selectedBrands.length > 0 && !filters.selectedBrands.includes(device.brand)) {
        return false;
      }

      // Category multi-select
      if (
        filters.selectedCategories.length > 0 &&
        !filters.selectedCategories.includes(device.category)
      ) {
        return false;
      }

      // Feature toggles
      if (filters.colorScreenOnly && !device.colorScreen) return false;
      if (filters.warmLightOnly && !device.warmLight) return false;
      if (filters.pageTurnButtonsOnly && !device.pageTurnButtons) return false;
      if (filters.stylusSupportOnly && !device.stylusSupport) return false;
      if (filters.waterproofOnly && !device.waterproof.includes('IPX8')) return false;
      if (filters.audiobookOnly && !device.audiobookSupport) return false;
      if (filters.openAndroidOnly && !device.openAndroid) return false;

      // Price filter
      if (device.priceUsd > filters.maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_asc':
          return a.priceUsd - b.priceUsd;
        case 'price_desc':
          return b.priceUsd - a.priceUsd;
        case 'screen_desc':
          return b.screenSize - a.screenSize;
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
    return EREADERS_DATA.filter((e) => selectedCompareIds.includes(e.id));
  }, [selectedCompareIds]);

  const scrollToExplore = () => {
    exploreRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero Section */}
      <EreaderHero onScrollToExplore={scrollToExplore} />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-10 space-y-16">
        {/* Recommendation Banner */}
        <EreaderRecommendationBanner
          ereaders={EREADERS_DATA}
          onSelectDevice={(device) => setDetailedDevice(device)}
        />

        {/* Filter Section */}
        <div ref={exploreRef} className="scroll-mt-20">
          <EreaderFilterBar
            filters={filters}
            setFilters={setFilters}
            onReset={handleResetFilters}
            activeFilterCount={activeFilterCount}
          />
        </div>

        {/* Catalog Grid */}
        <EreaderGrid
          devices={filteredEreaders}
          totalDevicesCount={EREADERS_DATA.length}
          selectedCompareIds={selectedCompareIds}
          onToggleCompare={handleToggleCompare}
          onOpenDetails={(device) => setDetailedDevice(device)}
          filters={filters}
          setFilters={setFilters}
          onResetFilters={handleResetFilters}
        />

        {/* Strategic Decision Guide */}
        <EreaderStrategicGuide />
      </main>

      {/* Side-by-Side Comparison Modal */}
      <EreaderComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        selectedDevices={selectedCompareDevices}
        onRemoveDevice={handleRemoveCompareDevice}
        onClearAll={handleClearCompareAll}
      />

      {/* Single Device Detail Modal */}
      <EreaderDetailModal
        device={detailedDevice}
        onClose={() => setDetailedDevice(null)}
        onToggleCompare={handleToggleCompare}
        isSelectedForCompare={Boolean(detailedDevice && selectedCompareIds.includes(detailedDevice.id))}
        isCompareMaxReached={selectedCompareIds.length >= 4}
      />
    </>
  );
};
