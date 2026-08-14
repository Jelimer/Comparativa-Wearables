import React, { useEffect } from 'react';
import {
  X,
  Trash2,
  Zap,
  Check,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { Ereader } from '../../types/ereader';

interface EreaderComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDevices: Ereader[];
  onRemoveDevice: (deviceId: string) => void;
  onClearAll: () => void;
}

export const EreaderComparisonModal: React.FC<EreaderComparisonModalProps> = ({
  isOpen,
  onClose,
  selectedDevices,
  onRemoveDevice,
  onClearAll,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-hidden animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-7xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-900/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                Comparativa Lado a Lado de E-readers
              </h2>
              <p className="text-xs text-slate-400">
                Enfrentando {selectedDevices.length} de 4 modelos seleccionados
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {selectedDevices.length > 0 && (
              <button
                onClick={onClearAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold border border-rose-800/50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Vaciar Todo</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Table View */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-4 sm:p-6">
          {selectedDevices.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <Sparkles className="w-12 h-12 text-amber-400/50 mx-auto" />
              <h3 className="text-lg font-bold text-white">No has seleccionado ningún e-reader</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Cierra esta ventana y haz clic en el botón <strong>Comparar</strong> de hasta 4 lectores para enfrentarlos aquí.
              </p>
            </div>
          ) : (
            <table className="w-full min-w-[700px] border-collapse text-left text-xs sm:text-sm">
              {/* Product Header Row */}
              <thead>
                <tr>
                  <th className="p-3 w-44 bg-slate-950/60 rounded-tl-2xl border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-xs">
                    Dispositivo
                  </th>
                  {selectedDevices.map((d) => (
                    <th
                      key={d.id}
                      className="p-4 min-w-[200px] max-w-[280px] bg-slate-950/40 border-b border-slate-800 align-top relative"
                    >
                      <button
                        onClick={() => onRemoveDevice(d.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900 text-slate-400 hover:text-rose-200 transition-colors"
                        title="Quitar de la comparativa"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex flex-col items-center text-center space-y-3 pt-2">
                        <img
                          src={d.imageUrl}
                          alt={d.name}
                          className="h-28 object-contain filter drop-shadow-md"
                        />
                        <div>
                          <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wide block">
                            {d.brand}
                          </span>
                          <span className="font-bold text-white text-sm line-clamp-2">{d.name}</span>
                          <span className="text-base font-extrabold text-white mt-1 block">
                            ${d.priceUsd} <span className="text-xs text-slate-400 font-normal">USD</span>
                          </span>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/60">
                {/* Screen size & Tech */}
                <tr>
                  <td className="p-3 font-semibold text-slate-400 bg-slate-950/30">
                    Pantalla & Resolución
                  </td>
                  {selectedDevices.map((d) => (
                    <td key={d.id} className="p-3 text-slate-200">
                      <span className="font-bold text-white block">{d.screenSize}" • {d.ppi} PPI</span>
                      <span className="text-xs text-amber-400">{d.screenTech}</span>
                    </td>
                  ))}
                </tr>

                {/* Color E-Ink */}
                <tr>
                  <td className="p-3 font-semibold text-slate-400 bg-slate-950/30">
                    Pantalla a Color
                  </td>
                  {selectedDevices.map((d) => (
                    <td key={d.id} className="p-3">
                      {d.colorScreen ? (
                        <span className="inline-flex items-center gap-1 font-bold text-purple-400">
                          <Check className="w-4 h-4" />
                          <span>4096 Colores ({d.colorPpi} PPI)</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 font-medium">Monocromático</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Physical Buttons */}
                <tr>
                  <td className="p-3 font-semibold text-slate-400 bg-slate-950/30">
                    Botones Físicos de Página
                  </td>
                  {selectedDevices.map((d) => (
                    <td key={d.id} className="p-3">
                      {d.pageTurnButtons ? (
                        <span className="inline-flex items-center gap-1 font-bold text-amber-400">
                          <Check className="w-4 h-4" />
                          <span>Sí (Botones mecánicos)</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 font-medium">No (Solo táctil)</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Stylus / Notes Support */}
                <tr>
                  <td className="p-3 font-semibold text-slate-400 bg-slate-950/30">
                    Lápiz Óptico / Notas
                  </td>
                  {selectedDevices.map((d) => (
                    <td key={d.id} className="p-3">
                      {d.stylusSupport ? (
                        <span className="inline-flex items-center gap-1 font-bold text-blue-400">
                          <Check className="w-4 h-4" />
                          <span>Compatible con Stylus</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 font-medium">No compatible</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Warm Light */}
                <tr>
                  <td className="p-3 font-semibold text-slate-400 bg-slate-950/30">
                    Luz Cálida Ajustable
                  </td>
                  {selectedDevices.map((d) => (
                    <td key={d.id} className="p-3">
                      {d.warmLight ? (
                        <span className="inline-flex items-center gap-1 font-bold text-amber-300">
                          <Check className="w-4 h-4" />
                          <span>Sí (LEDs ámbar)</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 font-medium">Solo luz blanca</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Waterproof */}
                <tr>
                  <td className="p-3 font-semibold text-slate-400 bg-slate-950/30">
                    Resistencia al Agua
                  </td>
                  {selectedDevices.map((d) => (
                    <td key={d.id} className="p-3 font-medium text-slate-300">
                      {d.waterproof.includes('IPX8') ? (
                        <span className="text-cyan-400 font-bold">{d.waterproof}</span>
                      ) : (
                        <span className="text-slate-500">{d.waterproof}</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Battery Life */}
                <tr>
                  <td className="p-3 font-semibold text-slate-400 bg-slate-950/30">
                    Autonomía de Batería
                  </td>
                  {selectedDevices.map((d) => (
                    <td key={d.id} className="p-3 font-bold text-emerald-400">
                      <Zap className="w-3.5 h-3.5 text-amber-400 inline mr-1" />
                      {d.batteryLife}
                    </td>
                  ))}
                </tr>

                {/* Storage & Weight */}
                <tr>
                  <td className="p-3 font-semibold text-slate-400 bg-slate-950/30">
                    Capacidad & Peso
                  </td>
                  {selectedDevices.map((d) => (
                    <td key={d.id} className="p-3 text-slate-300 font-medium">
                      <span>{d.storageGb} GB • <strong>{d.weightGrams}g</strong></span>
                    </td>
                  ))}
                </tr>

                {/* Operating System / Android */}
                <tr>
                  <td className="p-3 font-semibold text-slate-400 bg-slate-950/30">
                    Sistema Operativo
                  </td>
                  {selectedDevices.map((d) => (
                    <td key={d.id} className="p-3">
                      {d.openAndroid ? (
                        <span className="text-emerald-400 font-bold">Android Abierto (Google Play)</span>
                      ) : (
                        <span className="text-slate-400 font-medium">Sistema Propietario</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Formats Supported */}
                <tr>
                  <td className="p-3 font-semibold text-slate-400 bg-slate-950/30">
                    Formatos Principales
                  </td>
                  {selectedDevices.map((d) => (
                    <td key={d.id} className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {d.supportedFormats.slice(0, 4).map((f) => (
                          <span
                            key={f}
                            className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Pros Summary */}
                <tr>
                  <td className="p-3 font-semibold text-emerald-400 bg-slate-950/30">
                    Puntos Fuertes
                  </td>
                  {selectedDevices.map((d) => (
                    <td key={d.id} className="p-3 align-top">
                      <ul className="space-y-1 text-xs text-slate-300">
                        {d.pros.slice(0, 3).map((p, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Cons Summary */}
                <tr>
                  <td className="p-3 font-semibold text-rose-400 bg-slate-950/30">
                    Carencias Críticas
                  </td>
                  {selectedDevices.map((d) => (
                    <td key={d.id} className="p-3 align-top">
                      <ul className="space-y-1 text-xs text-slate-300">
                        {d.cons.slice(0, 2).map((c, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-rose-400 font-bold">•</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-colors cursor-pointer"
          >
            Cerrar Comparativa
          </button>
        </div>
      </div>
    </div>
  );
};
