import React, { useState, useMemo, useRef, useCallback, Suspense, lazy } from 'react';
import { EreaderHero } from './ereaders/EreaderHero';
import { EreaderRecommendationBanner } from './ereaders/EreaderRecommendationBanner';
import { EreaderFilterBar } from './ereaders/EreaderFilterBar';
import { EreaderGrid } from './ereaders/EreaderGrid';
import { EREADERS_DATA } from '../data/ereaders';
import { Ereader, EreaderFilterState } from '../types/ereader';

// On-demand code splitting for heavy modals and guides
const EreaderComparisonModal = lazy(() =>
  import('./ereaders/EreaderComparisonModal').then((m) => ({ default: m.EreaderComparisonModal }))
);
const EreaderDetailModal = lazy(() =>
  import('./ereaders/EreaderDetailModal').then((m) => ({ default: m.EreaderDetailModal }))
);
const EreaderStrategicGuide = lazy(() =>
  import('./ereaders/EreaderStrategicGuide').then((m) => ({ default: m.EreaderStrategicGuide }))
);

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
  maxPrice: 600,
  sortBy: 'rating_desc',
};

interface EreadersViewProps {
  onOpenCompareGlobal?: () => void;
  selectedCompareIds: string[];
  setSelectedCompareIds: React.Dispatch<React.SetStateAction<string[]>>;
  isCompareModalOpen: boolean;
  setIsCompareModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onFilteredCountChange?: (count: number) => void;
}

export const EreadersView: React.FC<EreadersViewProps> = React.memo(({
  selectedCompareIds,
  setSelectedCompareIds,
  isCompareModalOpen,
  setIsCompareModalOpen,
  onFilteredCountChange,
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
    if (filters.maxPrice < 600) count++;
    return count;
  }, [filters]);

  const handleResetFilters = useCallback(() => {
    setFilters(INITIAL_EREADER_FILTERS);
  }, []);

  const handleToggleCompare = useCallback((device: Ereader) => {
    setSelectedCompareIds((prev) => {
      if (prev.includes(device.id)) {
        return prev.filter((id) => id !== device.id);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, device.id];
    });
  }, [setSelectedCompareIds]);

  const handleRemoveCompareDevice = useCallback((deviceId: string) => {
    setSelectedCompareIds((prev) => prev.filter((id) => id !== deviceId));
  }, [setSelectedCompareIds]);

  const handleClearCompareAll = useCallback(() => {
    setSelectedCompareIds([]);
  }, [setSelectedCompareIds]);

  const handleOpenDetails = useCallback((device: Ereader) => {
    setDetailedDevice(device);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setDetailedDevice(null);
  }, []);

  const handleCloseCompareModal = useCallback(() => {
    setIsCompareModalOpen(false);
  }, [setIsCompareModalOpen]);

  // Filter & Sort E-readers with fast-fail optimization & hoisted search normalization
  const filteredEreaders = useMemo(() => {
    const query = filters.searchQuery.trim().toLowerCase();

    return EREADERS_DATA.filter((device) => {
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

  // Sync filtered count with parent/header
  React.useEffect(() => {
    onFilteredCountChange?.(filteredEreaders.length);
  }, [filteredEreaders.length, onFilteredCountChange]);

  const selectedCompareDevices = useMemo(() => {
    return EREADERS_DATA.filter((e) => selectedCompareIds.includes(e.id));
  }, [selectedCompareIds]);

  const scrollToExplore = useCallback(() => {
    exploreRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <>
      {/* Hero Section */}
      <EreaderHero onScrollToExplore={scrollToExplore} />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-10 space-y-16">
        {/* Recommendation Banner */}
        <EreaderRecommendationBanner
          ereaders={EREADERS_DATA}
          onSelectDevice={handleOpenDetails}
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
          onOpenDetails={handleOpenDetails}
          filters={filters}
          setFilters={setFilters}
          onResetFilters={handleResetFilters}
        />

        {/* Strategic Decision Guide */}
        <Suspense
          fallback={
            <div className="h-64 rounded-3xl bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 animate-pulse flex items-center justify-center text-slate-500 dark:text-slate-400 text-xs">
              Cargando Guía Estratégica...
            </div>
          }
        >
          <EreaderStrategicGuide />
        </Suspense>
      </main>

      {/* Side-by-Side Comparison Modal */}
      {isCompareModalOpen && (
        <Suspense fallback={null}>
          <EreaderComparisonModal
            isOpen={isCompareModalOpen}
            onClose={handleCloseCompareModal}
            selectedDevices={selectedCompareDevices}
            onRemoveDevice={handleRemoveCompareDevice}
            onClearAll={handleClearCompareAll}
          />
        </Suspense>
      )}

      {/* Single Device Detail Modal */}
      {detailedDevice && (
        <Suspense fallback={null}>
          <EreaderDetailModal
            device={detailedDevice}
            onClose={handleCloseDetails}
            onToggleCompare={handleToggleCompare}
            isSelectedForCompare={selectedCompareIds.includes(detailedDevice.id)}
            isCompareMaxReached={selectedCompareIds.length >= 4}
          />
        </Suspense>
      )}
    </>
  );
});
