import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WEARABLES_DATA } from './data/wearables';
import { EREADERS_DATA } from './data/ereaders';

// Code-Splitting: Lazy load main section views
const WearablesView = lazy(() =>
  import('./components/WearablesView').then((m) => ({ default: m.WearablesView }))
);
const EreadersView = lazy(() =>
  import('./components/EreadersView').then((m) => ({ default: m.EreadersView }))
);

interface ViewLoadingFallbackProps {
  activeSection: 'wearables' | 'ereaders';
}

function ViewLoadingFallback({ activeSection }: ViewLoadingFallbackProps) {
  const isWearables = activeSection === 'wearables';
  const label = isWearables ? 'Wearables de Salud y Deporte' : 'E-readers & Kindles';

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Cargando catálogo de ${label}...`}
      className="flex-1 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-16 flex flex-col items-center justify-center space-y-6"
    >
      <div className="relative flex items-center justify-center">
        <div
          className={`w-14 h-14 rounded-full border-4 ${
            isWearables
              ? 'border-cyan-500/20 border-t-cyan-500'
              : 'border-amber-500/20 border-t-amber-500'
          } animate-spin`}
        />
      </div>
      <div className="text-center space-y-1.5">
        <p className="text-sm font-bold text-slate-900 dark:text-white">
          Cargando catálogo de {label}...
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Preparando comparativas técnicas, sensores y métricas de autonomía
        </p>
      </div>
      <span className="sr-only">Cargando {label}...</span>
    </div>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState<'wearables' | 'ereaders'>('wearables');
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Wearables state
  const [wearablesCompareIds, setWearablesCompareIds] = useState<string[]>([]);
  const [isWearablesCompareOpen, setIsWearablesCompareOpen] = useState<boolean>(false);
  const [wearablesFilteredCount, setWearablesFilteredCount] = useState<number>(WEARABLES_DATA.length);

  // E-readers state
  const [ereadersCompareIds, setEreadersCompareIds] = useState<string[]>([]);
  const [isEreadersCompareOpen, setIsEreadersCompareOpen] = useState<boolean>(false);
  const [ereadersFilteredCount, setEreadersFilteredCount] = useState<number>(EREADERS_DATA.length);

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

  const handleOpenActiveCompare = useCallback(() => {
    if (activeSection === 'wearables') {
      setIsWearablesCompareOpen(true);
    } else {
      setIsEreadersCompareOpen(true);
    }
  }, [activeSection]);

  const handleSetActiveSection = useCallback((section: 'wearables' | 'ereaders') => {
    setActiveSection(section);
  }, []);

  const handleSetDarkMode = useCallback((val: boolean) => {
    setDarkMode(val);
  }, []);

  const handleWearablesFilteredCount = useCallback((count: number) => {
    setWearablesFilteredCount(count);
  }, []);

  const handleEreadersFilteredCount = useCallback((count: number) => {
    setEreadersFilteredCount(count);
  }, []);

  const currentCompareCount =
    activeSection === 'wearables' ? wearablesCompareIds.length : ereadersCompareIds.length;

  const currentTotalDevices =
    activeSection === 'wearables' ? WEARABLES_DATA.length : EREADERS_DATA.length;

  const currentFilteredCount =
    activeSection === 'wearables' ? wearablesFilteredCount : ereadersFilteredCount;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-cyan-500 selection:text-white dark:selection:bg-amber-500 dark:selection:text-slate-950 transition-colors duration-200">
      {/* Universal Header with Navigation Switcher */}
      <Header
        activeSection={activeSection}
        setActiveSection={handleSetActiveSection}
        darkMode={darkMode}
        setDarkMode={handleSetDarkMode}
        totalDevices={currentTotalDevices}
        filteredCount={currentFilteredCount}
        compareCount={currentCompareCount}
        onOpenCompare={handleOpenActiveCompare}
      />

      {/* Main Dynamic View with Lazy Loading Suspense */}
      <Suspense fallback={<ViewLoadingFallback activeSection={activeSection} />}>
        {activeSection === 'wearables' ? (
          <WearablesView
            selectedCompareIds={wearablesCompareIds}
            setSelectedCompareIds={setWearablesCompareIds}
            isCompareModalOpen={isWearablesCompareOpen}
            setIsCompareModalOpen={setIsWearablesCompareOpen}
            onFilteredCountChange={handleWearablesFilteredCount}
          />
        ) : (
          <EreadersView
            selectedCompareIds={ereadersCompareIds}
            setSelectedCompareIds={setEreadersCompareIds}
            isCompareModalOpen={isEreadersCompareOpen}
            setIsCompareModalOpen={setIsEreadersCompareOpen}
            onFilteredCountChange={handleEreadersFilteredCount}
          />
        )}
      </Suspense>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
