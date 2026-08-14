import React, { useState } from 'react';
import {
  Search,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Tag,
  CheckSquare,
  Square,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { EreaderFilterState, EreaderBrand, EreaderCategory } from '../../types/ereader';
import { EreaderTooltip } from './EreaderTooltip';

interface EreaderFilterBarProps {
  filters: EreaderFilterState;
  setFilters: React.Dispatch<React.SetStateAction<EreaderFilterState>>;
  onReset: () => void;
  activeFilterCount: number;
}

const BRANDS: EreaderBrand[] = [
  'Amazon Kindle',
  'Rakuten Kobo',
  'reMarkable',
  'Onyx BOOX',
  'Lenovo',
  'PocketBook',
];

const CATEGORIES: { id: EreaderCategory; label: string; icon: string }[] = [
  { id: 'compact', label: 'Compactos (6.0")', icon: '📱' },
  { id: 'standard', label: 'Estándar (6.8" - 8.0")', icon: '📖' },
  { id: 'large_note', label: 'Gran Formato & Notas (10"+)', icon: '📝' },
  { id: 'color', label: 'Pantallas a Color', icon: '🎨' },
];

export const EreaderFilterBar: React.FC<EreaderFilterBarProps> = ({
  filters,
  setFilters,
  onReset,
  activeFilterCount,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleBrand = (brand: EreaderBrand) => {
    setFilters((prev) => ({
      ...prev,
      selectedBrands: prev.selectedBrands.includes(brand)
        ? prev.selectedBrands.filter((b) => b !== brand)
        : [...prev.selectedBrands, brand],
    }));
  };

  const toggleCategory = (category: EreaderCategory) => {
    setFilters((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter((c) => c !== category)
        : [...prev.selectedCategories, category],
    }));
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-6 shadow-xl space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            placeholder="Buscar por modelo, marca (Kindle, Kobo, reMarkable, BOOX, Lenovo)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Borrar
            </button>
          )}
        </div>

        {/* Sort and Actions */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, sortBy: e.target.value as EreaderFilterState['sortBy'] }))
            }
            className="px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer"
          >
            <option value="rating_desc">Puntuación (Mayor a menor)</option>
            <option value="price_asc">Precio (Más económico primero)</option>
            <option value="price_desc">Precio (Mayor a menor)</option>
            <option value="screen_desc">Tamaño de Pantalla (Mayor a menor)</option>
            <option value="name_asc">Nombre A-Z</option>
          </select>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              isExpanded || activeFilterCount > 0
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filtros {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={onReset}
              title="Limpiar todos los filtros"
              className="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold border border-rose-800/50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Limpiar</span>
            </button>
          )}
        </div>
      </div>

      {/* Brand & Category Filter Badges */}
      <div className="space-y-4 pt-2 border-t border-slate-800/80">
        {/* Brand Multi-select */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Tag className="w-3.5 h-3.5 text-amber-400" />
            <span>Marca:</span>
          </span>
          {BRANDS.map((brand) => {
            const isSelected = filters.selectedBrands.includes(brand);
            return (
              <button
                key={brand}
                onClick={() => toggleBrand(brand)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                }`}
              >
                {isSelected ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5 text-slate-400" />}
                <span>{brand}</span>
              </button>
            );
          })}
        </div>

        {/* Category Multi-select */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <BookOpen className="w-3.5 h-3.5 text-yellow-400" />
            <span>Tipo:</span>
          </span>
          {CATEGORIES.map((cat) => {
            const isSelected = filters.selectedCategories.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-yellow-500 text-slate-950 font-bold shadow-md shadow-yellow-500/20'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expanded Advanced Filters Panel */}
      {isExpanded && (
        <div className="pt-4 border-t border-slate-800 space-y-6 animate-in fade-in duration-200">
          {/* Key Hardware Toggles Grid */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Características Clave de Hardware
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {/* Color Screen */}
              <button
                onClick={() => setFilters((prev) => ({ ...prev, colorScreenOnly: !prev.colorScreenOnly }))}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                  filters.colorScreenOnly
                    ? 'bg-amber-950/50 border-amber-500 text-amber-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>🎨</span>
                  <span>Pantalla a Color</span>
                </div>
                <EreaderTooltip termKey="kaleido_3" iconOnly />
              </button>

              {/* Page Turn Buttons */}
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, pageTurnButtonsOnly: !prev.pageTurnButtonsOnly }))
                }
                className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                  filters.pageTurnButtonsOnly
                    ? 'bg-amber-950/50 border-amber-500 text-amber-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>🔘</span>
                  <span>Botones Físicos de Página</span>
                </div>
                <EreaderTooltip termKey="page_buttons" iconOnly />
              </button>

              {/* Stylus Support */}
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, stylusSupportOnly: !prev.stylusSupportOnly }))
                }
                className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                  filters.stylusSupportOnly
                    ? 'bg-amber-950/50 border-amber-500 text-amber-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>✏️</span>
                  <span>Soporte Lápiz (Stylus)</span>
                </div>
                <EreaderTooltip termKey="stylus" iconOnly />
              </button>

              {/* Warm Light */}
              <button
                onClick={() => setFilters((prev) => ({ ...prev, warmLightOnly: !prev.warmLightOnly }))}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                  filters.warmLightOnly
                    ? 'bg-amber-950/50 border-amber-500 text-amber-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>🌙</span>
                  <span>Luz Cálida Ajustable</span>
                </div>
                <EreaderTooltip termKey="warm_light" iconOnly />
              </button>

              {/* Waterproof */}
              <button
                onClick={() => setFilters((prev) => ({ ...prev, waterproofOnly: !prev.waterproofOnly }))}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                  filters.waterproofOnly
                    ? 'bg-amber-950/50 border-amber-500 text-amber-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>💧</span>
                  <span>Resistente al Agua (IPX8)</span>
                </div>
                <EreaderTooltip termKey="ipx8" iconOnly />
              </button>

              {/* Android Open with Google Play */}
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, openAndroidOnly: !prev.openAndroidOnly }))
                }
                className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                  filters.openAndroidOnly
                    ? 'bg-amber-950/50 border-amber-500 text-amber-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>🤖</span>
                  <span>Android + Google Play</span>
                </div>
                <EreaderTooltip termKey="android_open" iconOnly />
              </button>

              {/* Audiobook Support */}
              <button
                onClick={() => setFilters((prev) => ({ ...prev, audiobookOnly: !prev.audiobookOnly }))}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                  filters.audiobookOnly
                    ? 'bg-amber-950/50 border-amber-500 text-amber-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>🎧</span>
                  <span>Soporte de Audiolibros</span>
                </div>
              </button>
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
              <span>Precio Máximo Hardware:</span>
              <span className="text-amber-400 font-extrabold text-sm">${filters.maxPrice} USD</span>
            </div>
            <input
              type="range"
              min="90"
              max="600"
              step="10"
              value={filters.maxPrice}
              onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>$90 USD (Kindle Básico)</span>
              <span>$300 USD</span>
              <span>$600 USD (reMarkable Paper Pro)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
