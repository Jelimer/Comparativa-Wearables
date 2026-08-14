import React from 'react';
import { Ereader, EreaderFilterState } from '../../types/ereader';
import { EreaderCard } from './EreaderCard';
import { BookOpen, RotateCcw } from 'lucide-react';

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

export const EreaderGrid: React.FC<EreaderGridProps> = ({
  devices,
  totalDevicesCount,
  selectedCompareIds,
  onToggleCompare,
  onOpenDetails,
  onResetFilters,
}) => {
  return (
    <section className="space-y-6">
      {/* Header bar of the grid */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Catálogo Completo de E-readers</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-400 font-semibold border border-slate-700">
              {devices.length} de {totalDevicesCount}
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Haz clic en <strong>Comparar</strong> para enfrentar hasta 4 modelos en pantalla dividida
          </p>
        </div>
      </div>

      {/* Grid of Devices */}
      {devices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
        <div className="py-16 px-4 text-center rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h4 className="text-lg font-bold text-white">No se encontraron e-readers con estos filtros</h4>
            <p className="text-xs text-slate-400">
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
};
