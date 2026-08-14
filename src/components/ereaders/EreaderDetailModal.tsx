import React, { useEffect } from 'react';
import {
  X,
  Star,
  Zap,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Plus,
  Check,
  BookOpen,
  Layers,
  Cpu,
} from 'lucide-react';
import { Ereader } from '../../types/ereader';
import { EreaderTooltip } from './EreaderTooltip';

interface EreaderDetailModalProps {
  device: Ereader | null;
  onClose: () => void;
  onToggleCompare: (device: Ereader) => void;
  isSelectedForCompare: boolean;
  isCompareMaxReached: boolean;
}

export const EreaderDetailModal: React.FC<EreaderDetailModalProps> = ({
  device,
  onClose,
  onToggleCompare,
  isSelectedForCompare,
  isCompareMaxReached,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (device) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [device, onClose]);

  if (!device) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-900/90 sticky top-0 z-10 backdrop-blur-md">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {device.brand}
              </span>
              <span className="text-xs text-slate-400">
                Pantalla {device.screenSize}" ({device.ppi} PPI)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">{device.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-8 max-h-[75vh] overflow-y-auto">
          {/* Top Hero Card with Image & Specs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-6 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-center p-4">
              <img
                src={device.imageUrl}
                alt={device.name}
                className="max-h-64 max-w-full object-contain filter drop-shadow-2xl"
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wide block">Precio Oficial</span>
                  <span className="text-2xl font-black text-white">${device.priceUsd} <span className="text-sm font-normal text-slate-400">USD</span></span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{device.rating} / 5.0</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{device.description}</p>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                  Perfil de Usuario Recomendado
                </span>
                <p className="text-xs text-slate-200">{device.bestFor}</p>
              </div>
            </div>
          </div>

          {/* Technical Specs Grid */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>Especificaciones Técnicas Detalladas</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-slate-400 block mb-1">Tecnología de Pantalla:</span>
                <span className="font-bold text-white flex items-center gap-1">
                  {device.screenTech}
                  <EreaderTooltip termKey="carta_1300" iconOnly />
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-slate-400 block mb-1">Resolución & Nitidez:</span>
                <span className="font-bold text-white">{device.screenResolution}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-slate-400 block mb-1">Color E-Ink:</span>
                <span className={`font-bold ${device.colorScreen ? 'text-purple-400' : 'text-slate-400'}`}>
                  {device.colorScreen ? `Sí (4096 Colores • ${device.colorPpi} PPI)` : 'Monocromático (B/N)'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-slate-400 block mb-1">Autonomía de Batería:</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  {device.batteryLife}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-slate-400 block mb-1">Botones de Paso de Página:</span>
                <span className={`font-bold ${device.pageTurnButtons ? 'text-amber-400' : 'text-slate-400'}`}>
                  {device.pageTurnButtons ? 'Sí (Botones Físicos)' : 'No (Solo táctil)'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-slate-400 block mb-1">Luz Cálida Nocturna:</span>
                <span className={`font-bold ${device.warmLight ? 'text-amber-300' : 'text-slate-400'}`}>
                  {device.warmLight ? 'Sí (LEDs ámbar regulables)' : 'No (Solo luz blanca fría)'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-slate-400 block mb-1">Lápiz Óptico (Stylus / Notas):</span>
                <span className={`font-bold ${device.stylusSupport ? 'text-blue-400' : 'text-slate-400'}`}>
                  {device.stylusSupport ? 'Sí (Anotaciones y dibujos)' : 'No compatible'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-slate-400 block mb-1">Resistencia al Agua:</span>
                <span className={`font-bold ${device.waterproof.includes('IPX8') ? 'text-cyan-400' : 'text-slate-400'}`}>
                  {device.waterproof}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-slate-400 block mb-1">Almacenamiento Interno:</span>
                <span className="font-bold text-white">{device.storageGb} GB</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-slate-400 block mb-1">Peso en Mano:</span>
                <span className="font-bold text-white">{device.weightGrams} gramos</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-slate-400 block mb-1">Sistema Operativo:</span>
                <span className={`font-bold ${device.openAndroid ? 'text-emerald-400' : 'text-slate-300'}`}>
                  {device.openAndroid ? 'Android Libre (Google Play)' : 'Sistema Propio del Fabricante'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-slate-400 block mb-1">Audiolibros / Bluetooth:</span>
                <span className="font-bold text-indigo-300">
                  {device.audiobookSupport ? 'Sí (Bluetooth para Audífonos)' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Formats & Ecosystem */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>Formatos Soportados</span>
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {device.supportedFormats.map((fmt) => (
                  <span
                    key={fmt}
                    className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700"
                  >
                    {fmt}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                <span>Ecosistema & Nube</span>
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {device.ecosystem.map((eco) => (
                  <span
                    key={eco}
                    className="px-2 py-0.5 rounded-lg bg-indigo-950/60 text-indigo-300 text-xs font-medium border border-indigo-800/60"
                  >
                    {eco}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Pros & Cons Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 space-y-2.5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wide">
                <CheckCircle2 className="w-4 h-4" />
                <span>Puntos Fuertes (Ventajas)</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {device.pros.map((pro, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-2.5">
              <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs uppercase tracking-wide">
                <XCircle className="w-4 h-4" />
                <span>Puntos Débiles (Carencias)</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {device.cons.map((con, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-800 bg-slate-900 flex flex-wrap items-center justify-between gap-3">
          <a
            href={device.officialSiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <span>Ver en Tienda Oficial</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              Cerrar
            </button>

            <button
              onClick={() => onToggleCompare(device)}
              disabled={!isSelectedForCompare && isCompareMaxReached}
              className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isSelectedForCompare
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : isCompareMaxReached
                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-lg'
              }`}
            >
              {isSelectedForCompare ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>En Comparativa</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Añadir a Comparativa</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
