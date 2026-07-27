import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Filter,
  X,
  RotateCcw,
  CheckCircle2,
  DollarSign,
  Battery,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Check,
} from 'lucide-react';
import { FilterState, BrandType, CategoryType, EcosystemType } from '../types/wearable';
import { Tooltip } from './Tooltip';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onReset: () => void;
  activeFilterCount: number;
}

const ALL_BRANDS: { label: string; value: BrandType }[] = [
  { label: 'Google / Fitbit', value: 'Google/Fitbit' },
  { label: 'Garmin', value: 'Garmin' },
  { label: 'Samsung', value: 'Samsung' },
  { label: 'Oura', value: 'Oura' },
  { label: 'Whoop', value: 'Whoop' },
  { label: 'RingConn', value: 'RingConn' },
  { label: 'Signal', value: 'Signal' },
  { label: 'Apple', value: 'Apple' },
  { label: 'Xiaomi', value: 'Xiaomi' },
];

const ALL_CATEGORIES: { label: string; value: CategoryType }[] = [
  { label: 'Smartwatches', value: 'smartwatch' },
  { label: 'Pulseras / Bands', value: 'band' },
  { label: 'Anillos Inteligentes', value: 'ring' },
];

const ALL_ECOSYSTEMS: { label: string; value: EcosystemType }[] = [
  { label: 'iOS (iPhone)', value: 'iOS' },
  { label: 'Android (Universal)', value: 'Android' },
  { label: 'Samsung Exclusive', value: 'Samsung' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  onReset,
  activeFilterCount,
}) => {
  const [showAdvancedSensors, setShowAdvancedSensors] = useState(false);
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const brandDropdownRef = useRef<HTMLDivElement>(null);

  // Close brand dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (brandDropdownRef.current && !brandDropdownRef.current.contains(e.target as Node)) {
        setIsBrandDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
  };

  const toggleBrand = (brand: BrandType) => {
    setFilters((prev) => ({
      ...prev,
      selectedBrands: prev.selectedBrands.includes(brand)
        ? prev.selectedBrands.filter((b) => b !== brand)
        : [...prev.selectedBrands, brand],
    }));
  };

  const toggleCategory = (cat: CategoryType) => {
    setFilters((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(cat)
        ? prev.selectedCategories.filter((c) => c !== cat)
        : [...prev.selectedCategories, cat],
    }));
  };

  const toggleEcosystem = (eco: EcosystemType) => {
    setFilters((prev) => ({
      ...prev,
      selectedEcosystems: prev.selectedEcosystems.includes(eco)
        ? prev.selectedEcosystems.filter((e) => e !== eco)
        : [...prev.selectedEcosystems, eco],
    }));
  };

  const toggleSubscription = (sub: 'free' | 'subscription') => {
    setFilters((prev) => ({
      ...prev,
      selectedSubscriptions: prev.selectedSubscriptions.includes(sub)
        ? prev.selectedSubscriptions.filter((s) => s !== sub)
        : [...prev.selectedSubscriptions, sub],
    }));
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }));
  };

  const handleMinBatteryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, minBatteryHours: Number(e.target.value) }));
  };

  const toggleSensor = (sensorKey: keyof FilterState['requiredSensors']) => {
    setFilters((prev) => ({
      ...prev,
      requiredSensors: {
        ...prev.requiredSensors,
        [sensorKey]: !prev.requiredSensors[sensorKey],
      },
    }));
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-xl space-y-6">
      {/* Header of Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">Filtros Multidimensionales</h3>
          {activeFilterCount > 0 && (
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              {activeFilterCount} activo{activeFilterCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {activeFilterCount > 0 && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar filtros</span>
            </button>
          )}
        </div>
      </div>

      {/* Real-time search query box */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={filters.searchQuery}
          onChange={handleSearchChange}
          placeholder="Buscar por nombre, tecnología o característica (ej. Whoop, ECG, Titanio)..."
          className="w-full pl-11 pr-10 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
        />
        {filters.searchQuery && (
          <button
            onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Multi-select Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Multi-select Brand Dropdown */}
        <div className="relative" ref={brandDropdownRef}>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">
            Marcas ({filters.selectedBrands.length === 0 ? 'Todas' : `${filters.selectedBrands.length} selec.`})
          </label>
          <button
            type="button"
            onClick={() => setIsBrandDropdownOpen((prev) => !prev)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs sm:text-sm font-medium hover:border-slate-700 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <span className="truncate">
              {filters.selectedBrands.length === 0
                ? 'Todas las marcas'
                : filters.selectedBrands.join(', ')}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
          </button>

          {isBrandDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-40 max-h-60 overflow-y-auto space-y-1">
              <div className="flex items-center justify-between px-2 py-1 border-b border-slate-800 text-[11px] font-bold text-slate-400">
                <span>SELECCIÓN MÚLTIPLE</span>
                {filters.selectedBrands.length > 0 && (
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, selectedBrands: [] }))}
                    className="text-cyan-400 hover:underline"
                  >
                    Borrar
                  </button>
                )}
              </div>
              {ALL_BRANDS.map((b) => {
                const isSelected = filters.selectedBrands.includes(b.value);
                return (
                  <button
                    key={b.value}
                    type="button"
                    onClick={() => toggleBrand(b.value)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{b.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Category Multi-select Chips */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">
            Categoría Formato (Multiselección)
          </label>
          <div className="flex flex-wrap gap-1.5">
            {ALL_CATEGORIES.map((cat) => {
              const isSelected = filters.selectedCategories.includes(cat.value);
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => toggleCategory(cat.value)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Ecosystem Multi-select Chips */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">
            Ecosistema Smartphone
          </label>
          <div className="flex flex-wrap gap-1.5">
            {ALL_ECOSYSTEMS.map((eco) => {
              const isSelected = filters.selectedEcosystems.includes(eco.value);
              return (
                <button
                  key={eco.value}
                  type="button"
                  onClick={() => toggleEcosystem(eco.value)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  {eco.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Subscription Multi-select */}
        <div>
          <div className="flex items-center gap-1 mb-1.5">
            <label className="block text-xs font-semibold text-slate-400">Tipo de Cobro</label>
            <Tooltip termKey="subscription" iconOnly />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => toggleSubscription('free')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                filters.selectedSubscriptions.includes('free')
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300'
              }`}
            >
              $0 Cuotas (Sin sub.)
            </button>
            <button
              type="button"
              onClick={() => toggleSubscription('subscription')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                filters.selectedSubscriptions.includes('subscription')
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300'
              }`}
            >
              Con Suscripción
            </button>
          </div>
        </div>
      </div>

      {/* Price & Battery Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-800/80">
        {/* Price Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-slate-300 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Precio Máximo Hardware
            </span>
            <span className="text-emerald-400 font-bold">
              ${filters.maxPrice} USD {filters.maxPrice >= 1000 ? '(Sin límite)' : ''}
            </span>
          </div>
          <input
            type="range"
            min="40"
            max="1000"
            step="20"
            value={filters.maxPrice}
            onChange={handleMaxPriceChange}
            className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-950 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>$40</span>
            <span>$500</span>
            <span>$1000+</span>
          </div>
        </div>

        {/* Battery Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-slate-300 flex items-center gap-1">
              <Battery className="w-3.5 h-3.5 text-amber-400" />
              <span>Batería Mínima</span>
              <Tooltip termKey="battery" iconOnly />
            </span>
            <span className="text-amber-400 font-bold">
              {filters.minBatteryHours === 0
                ? 'Todas'
                : `${filters.minBatteryHours} h (${Math.round(filters.minBatteryHours / 24)} días approx)`}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="720"
            step="24"
            value={filters.minBatteryHours}
            onChange={handleMinBatteryChange}
            className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-950 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>24h (1 día)</span>
            <span>168h (7 días)</span>
            <span>720h (30 días)</span>
          </div>
        </div>
      </div>

      {/* Advanced Medical Sensors Toggle */}
      <div className="pt-2 border-t border-slate-800/80">
        <button
          onClick={() => setShowAdvancedSensors(!showAdvancedSensors)}
          className="flex items-center justify-between w-full py-2 text-xs font-bold text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            <span>Filtro de Sensores Médicos Específicos</span>
          </div>
          {showAdvancedSensors ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAdvancedSensors && (
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 pt-2">
            <SensorCheckbox
              label="ECG (Electrocardiograma)"
              termKey="ecg"
              checked={filters.requiredSensors.ecg}
              onChange={() => toggleSensor('ecg')}
            />
            <SensorCheckbox
              label="SpO2 (Oxígeno en sangre)"
              termKey="spO2"
              checked={filters.requiredSensors.spO2}
              onChange={() => toggleSensor('spO2')}
            />
            <SensorCheckbox
              label="cEDA / Estrés Continuo"
              termKey="edaStress"
              checked={filters.requiredSensors.edaStress}
              onChange={() => toggleSensor('edaStress')}
            />
            <SensorCheckbox
              label="Composición Corporal (BIA)"
              termKey="bodyComposition"
              checked={filters.requiredSensors.bodyComposition}
              onChange={() => toggleSensor('bodyComposition')}
            />
            <SensorCheckbox
              label="Presión Arterial Continuo"
              checked={filters.requiredSensors.bloodPressure}
              onChange={() => toggleSensor('bloodPressure')}
            />
            <SensorCheckbox
              label="GPS Integrado"
              termKey="gps"
              checked={filters.requiredSensors.gps}
              onChange={() => toggleSensor('gps')}
            />
            <SensorCheckbox
              label="Temperatura Cutánea"
              termKey="skinTemp"
              checked={filters.requiredSensors.skinTemp}
              onChange={() => toggleSensor('skinTemp')}
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface SensorCheckboxProps {
  label: string;
  termKey?: string;
  checked: boolean;
  onChange: () => void;
}

const SensorCheckbox: React.FC<SensorCheckboxProps> = ({ label, termKey, checked, onChange }) => (
  <div
    className={`flex items-center justify-between gap-1 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
      checked
        ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/50 shadow-sm'
        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300'
    }`}
  >
    <button
      type="button"
      onClick={onChange}
      className="flex items-center gap-2 flex-1 min-w-0 text-left cursor-pointer"
    >
      <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${checked ? 'text-cyan-400' : 'text-slate-600'}`} />
      <span className="truncate">{label}</span>
    </button>
    {termKey && <Tooltip termKey={termKey} iconOnly />}
  </div>
);
