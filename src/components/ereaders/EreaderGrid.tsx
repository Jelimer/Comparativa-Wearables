import React from 'react';
import { Ereader, EreaderFilterState } from '../../types/ereader';
import { EreaderCard } from './EreaderCard';
import { BookOpen, RotateCcw, ArrowUpDown } from 'lucide-react';

interface EreaderGridProps {
  devices: Ereader[];
  totalDevicesCount: number;
  selectedCompareIds: string[];
  onToggleCompare: (device: Ereader) => void;
  onOpenDetails: (device: Ereader) => void;
  filters: EreaderFilterState;
  setFilters: React.Dispatch<React.SetStateAction<EreaderFilterState>>;
  onResetFilters: () => void;
}

export const EreaderGrid: React.FC<EreaderGridProps> = React.memo(({
  devices,
  totalDevicesCount,
  selectedCompareIds,
  onToggleCompare,
  onOpenDetails,
  filters,
  setFilters,
  onResetFilters,
}) => {
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: e.target.value as EreaderFilterState['sortBy'],
    }));
  };

  return (
    <section className="space-y-6">
      {/* Header bar of the grid */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Catálogo Completo de E-readers</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-amber-700 dark:text-amber-400 font-semibold border border-slate-200 dark:border-slate-700">
              {devices.length} de {totalDevicesCount}
            </span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Haz clic en <strong>Comparar</strong> para enfrentar hasta 4 modelos en pantalla dividida
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <label htmlFor="ereader-sort-select" className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Ordenar por:
          </label>
          <select
            id="ereader-sort-select"
            value={filters.sortBy}
            onChange={handleSortChange}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
          >
            <option value="rating_desc">Puntuación (Mayor a menor)</option>
            <option value="release_desc">Fecha de Lanzamiento (Más recientes)</option>
            <option value="release_asc">Fecha de Lanzamiento (Más antiguos)</option>
            <option value="price_asc">Precio: Menor a Mayor</option>
            <option value="price_desc">Precio: Mayor a Menor</option>
            <option value="screen_desc">Tamaño de Pantalla (Mayor a menor)</option>
            <option value="name_asc">Nombre Alfabético</option>
          </select>
        </div>
      </div>

      {/* Grid of Devices */}
      {devices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-6">
          {devices.map((device) => (
            <EreaderCard
              key={device.id}
              device={device}
              isSelectedForCompare={selectedCompareIds.includes(device.id)}
              onToggleCompare={onToggleCompare}
              onOpenDetails={onOpenDetails}
              isCompareMaxReached={selectedCompareIds.length >= 4}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 px-4 text-center rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">No se encontraron e-readers con estos filtros</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Prueba relajando los criterios de búsqueda, seleccionando otras marcas o limpiando los filtros avanzados.
            </p>
          </div>
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restablecer Filtros</span>
          </button>
        </div>
      )}
    </section>
  );
});
