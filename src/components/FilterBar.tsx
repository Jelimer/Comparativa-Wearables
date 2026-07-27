import React, { useState } from 'react';
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
} from 'lucide-react';
import { FilterState, BrandType, CategoryType, EcosystemType } from '../types/wearable';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onReset: () => void;
  activeFilterCount: number;
}

const BRANDS: { label: string; value: BrandType | 'all' }[] = [
  { label: 'Todas las marcas', value: 'all' },
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

const CATEGORIES: { label: string; value: CategoryType | 'all' }[] = [
  { label: 'Todas las categorías', value: 'all' },
  { label: 'Smartwatches', value: 'smartwatch' },
  { label: 'Pulseras / Bands', value: 'band' },
  { label: 'Anillos Inteligentes', value: 'ring' },
];

const ECOSYSTEMS: { label: string; value: EcosystemType | 'all' }[] = [
  { label: 'Todos los ecosistemas', value: 'all' },
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
  };

  const handleBrandChange = (value: string) => {
    setFilters((prev) => ({ ...prev, brand: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFilters((prev) => ({ ...prev, category: value }));
  };

  const handleEcosystemChange = (value: string) => {
    setFilters((prev) => ({ ...prev, ecosystem: value }));
  };

  const handleSubscriptionChange = (value: string) => {
    setFilters((prev) => ({ ...prev, subscription: value }));
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
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
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
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Select Dropdowns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Brand */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">Marca</label>
          <select
            value={filters.brand}
            onChange={(e) => handleBrandChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
          >
            {BRANDS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">Categoría de Formato</label>
          <select
            value={filters.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Ecosystem */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">Ecosistema Smartphone</label>
          <select
            value={filters.ecosystem}
            onChange={(e) => handleEcosystemChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
          >
            {ECOSYSTEMS.map((e) => (
              <option key={e.value} value={e.value}>
                {e.label}
              </option>
            ))}
          </select>
        </div>

        {/* Fee Type */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">Tipo de Cobro / Suscripción</label>
          <select
            value={filters.subscription}
            onChange={(e) => handleSubscriptionChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
          >
            <option value="all">Cualquier modelo</option>
            <option value="free">Sin suscripción ($0/mes)</option>
            <option value="subscription">Requiere suscripción mensual</option>
          </select>
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
              Batería Mínima (Horas)
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
          className="flex items-center justify-between w-full py-2 text-xs font-bold text-slate-300 hover:text-cyan-400 transition-colors"
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
              checked={filters.requiredSensors.ecg}
              onChange={() => toggleSensor('ecg')}
            />
            <SensorCheckbox
              label="SpO2 (Oxígeno en sangre)"
              checked={filters.requiredSensors.spO2}
              onChange={() => toggleSensor('spO2')}
            />
            <SensorCheckbox
              label="cEDA / Estrés Continuo"
              checked={filters.requiredSensors.edaStress}
              onChange={() => toggleSensor('edaStress')}
            />
            <SensorCheckbox
              label="Composición Corporal (BIA)"
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
              checked={filters.requiredSensors.gps}
              onChange={() => toggleSensor('gps')}
            />
            <SensorCheckbox
              label="Temperatura Cutánea"
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
  checked: boolean;
  onChange: () => void;
}

const SensorCheckbox: React.FC<SensorCheckboxProps> = ({ label, checked, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left ${
      checked
        ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/50 shadow-sm'
        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300'
    }`}
  >
    <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${checked ? 'text-cyan-400' : 'text-slate-600'}`} />
    <span className="truncate">{label}</span>
  </button>
);
