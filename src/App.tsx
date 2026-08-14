import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WearablesView } from './components/WearablesView';
import { EreadersView } from './components/EreadersView';
import { Footer } from './components/Footer';
import { WEARABLES_DATA } from './data/wearables';
import { EREADERS_DATA } from './data/ereaders';

export default function App() {
  const [activeSection, setActiveSection] = useState<'wearables' | 'ereaders'>('wearables');
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Wearables state
  const [wearablesCompareIds, setWearablesCompareIds] = useState<string[]>([]);
  const [isWearablesCompareOpen, setIsWearablesCompareOpen] = useState<boolean>(false);

  // E-readers state
  const [ereadersCompareIds, setEreadersCompareIds] = useState<string[]>([]);
  const [isEreadersCompareOpen, setIsEreadersCompareOpen] = useState<boolean>(false);

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

  const handleOpenActiveCompare = () => {
    if (activeSection === 'wearables') {
      setIsWearablesCompareOpen(true);
    } else {
      setIsEreadersCompareOpen(true);
    }
  };

  const currentCompareCount =
    activeSection === 'wearables' ? wearablesCompareIds.length : ereadersCompareIds.length;

  const currentTotalDevices =
    activeSection === 'wearables' ? WEARABLES_DATA.length : EREADERS_DATA.length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      {/* Universal Header with Navigation Switcher */}
      <Header
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        totalDevices={currentTotalDevices}
        filteredCount={currentTotalDevices}
        compareCount={currentCompareCount}
        onOpenCompare={handleOpenActiveCompare}
      />

      {/* Main Dynamic View */}
      {activeSection === 'wearables' ? (
        <WearablesView
          selectedCompareIds={wearablesCompareIds}
          setSelectedCompareIds={setWearablesCompareIds}
          isCompareModalOpen={isWearablesCompareOpen}
          setIsCompareModalOpen={setIsWearablesCompareOpen}
        />
      ) : (
        <EreadersView
          selectedCompareIds={ereadersCompareIds}
          setSelectedCompareIds={setEreadersCompareIds}
          isCompareModalOpen={isEreadersCompareOpen}
          setIsCompareModalOpen={setIsEreadersCompareOpen}
        />
      )}

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
