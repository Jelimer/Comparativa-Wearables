import React from 'react';
import { ArrowUpDown, AlertCircle, RotateCcw } from 'lucide-react';
import { Wearable, FilterState } from '../types/wearable';
import { DeviceCard } from './DeviceCard';

interface DeviceGridProps {
  devices: Wearable[];
  totalDevicesCount: number;
  selectedCompareIds: string[];
  onToggleCompare: (device: Wearable) => void;
  onOpenDetails: (device: Wearable) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onResetFilters: () => void;
}

export const DeviceGrid: React.FC<DeviceGridProps> = ({
  devices,
  totalDevicesCount,
  selectedCompareIds,
  onToggleCompare,
  onOpenDetails,
  filters,
  setFilters,
  onResetFilters,
}) => {
  const isCompareMaxReached = selectedCompareIds.length >= 4;

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: e.target.value as FilterState['sortBy'],
    }));
  };

  return (
    <section className="space-y-6">
      {/* Grid Top Bar: Count & Sort */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-2 px-1 border-b border-slate-800">
        <div>
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            <span>Catálogo de Wearables</span>
            <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-slate-700">
              {devices.length} de {totalDevicesCount}
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Mostrando resultados ordenados y filtrados en tiempo real
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-cyan-400" />
          <label htmlFor="sort-select" className="text-xs font-semibold text-slate-400">
            Ordenar por:
          </label>
          <select
            id="sort-select"
            value={filters.sortBy}
            onChange={handleSortChange}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
          >
            <option value="rating_desc">Mayor Valoración (Puntuación)</option>
            <option value="price_asc">Precio: Menor a Mayor</option>
            <option value="price_desc">Precio: Mayor a Menor</option>
            <option value="battery_desc">Mayor Autonomía Batería</option>
            <option value="name_asc">Nombre Alfabético</option>
          </select>
        </div>
      </div>

      {/* Grid Content or Empty State */}
      {devices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {devices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              isSelectedForCompare={selectedCompareIds.includes(device.id)}
              onToggleCompare={onToggleCompare}
              onOpenDetails={onOpenDetails}
              isCompareMaxReached={isCompareMaxReached}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 max-w-lg mx-auto my-8">
          <div className="p-4 rounded-full bg-slate-800/80 text-cyan-400 w-16 h-16 mx-auto flex items-center justify-center">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-white">No se encontraron dispositivos</h4>
          <p className="text-xs text-slate-400 px-6">
            Ningún wearable coincide exactamente con la combinación de filtros seleccionados. Intenta ampliar el rango de precio, reducir los requisitos de batería o limpiar filtros.
          </p>
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restablecer Filtros</span>
          </button>
        </div>
      )}
    </section>
  );
};
