import React from 'react';
import {
  X,
  Check,
  Minus,
  Sparkles,
  Zap,
  DollarSign,
  HeartPulse,
  Trash2,
  ExternalLink,
  Award,
} from 'lucide-react';
import { Wearable } from '../types/wearable';
import { Tooltip } from './Tooltip';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDevices: Wearable[];
  onRemoveDevice: (deviceId: string) => void;
  onClearAll: () => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  selectedDevices,
  onRemoveDevice,
  onClearAll,
}) => {
  if (!isOpen || selectedDevices.length === 0) return null;

  // Determine winner among compared group
  const bestRatingDevice = [...selectedDevices].sort((a, b) => b.rating - a.rating)[0];
  const bestBatteryDevice = [...selectedDevices].sort((a, b) => b.batteryHours - a.batteryHours)[0];
  const lowestPriceDevice = [...selectedDevices].sort((a, b) => a.priceUsd - b.priceUsd)[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-[95vw] 2xl:max-w-7xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span>Comparativa Lado a Lado (Side-by-Side)</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 font-bold border border-cyan-800">
                  {selectedDevices.length} / 4
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Análisis matriz de especificaciones, sensores biométricos y pros/contras
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClearAll}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Limpiar todo</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-8 flex-1">
          {/* Winner Callout Summary */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/60 border border-cyan-500/30 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 flex-shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wide block">
                  Mejor Valoración del Grupo
                </span>
                <span className="text-sm font-extrabold text-white">{bestRatingDevice.name}</span>
                <span className="text-xs text-slate-400 block">⭐ {bestRatingDevice.rating} / 5</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 flex-shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wide block">
                  Mayor Autonomía del Grupo
                </span>
                <span className="text-sm font-extrabold text-white">{bestBatteryDevice.name}</span>
                <span className="text-xs text-slate-400 block font-medium">⚡ {bestBatteryDevice.batteryLife}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 flex-shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wide block">
                  Precio Más Económico
                </span>
                <span className="text-sm font-extrabold text-white">{lowestPriceDevice.name}</span>
                <span className="text-xs text-slate-400 block font-medium">${lowestPriceDevice.priceUsd} USD</span>
              </div>
            </div>
          </div>

          {/* Matrix Grid Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="p-3 bg-slate-950/80 text-slate-400 text-xs font-bold uppercase tracking-wider w-44 rounded-tl-2xl border-b border-slate-800">
                    Característica
                  </th>
                  {selectedDevices.map((dev) => (
                    <th
                      key={dev.id}
                      className="p-4 bg-slate-950/40 border-b border-slate-800 text-center min-w-[200px]"
                    >
                      <div className="relative flex flex-col items-center">
                        <button
                          onClick={() => onRemoveDevice(dev.id)}
                          className="absolute -top-2 -right-2 p-1 rounded-full bg-slate-800 hover:bg-rose-900 text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title="Quitar de comparación"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <img
                          src={dev.imageUrl}
                          alt={dev.name}
                          className="w-16 h-16 object-contain mb-2 filter drop-shadow-md"
                          onError={(e) => {
                            e.currentTarget.src = '/images/devices/placeholder.svg';
                          }}
                        />
                        <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
                          {dev.brand}
                        </span>
                        <h4 className="text-sm font-extrabold text-white line-clamp-1">{dev.name}</h4>
                        <a
                          href={dev.officialSiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 text-[11px] text-slate-400 hover:text-cyan-300 inline-flex items-center gap-1"
                        >
                          <span>Sitio oficial</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-sm">
                {/* General Specs */}
                <MatrixRow label="Precio Hardware" icon={<DollarSign className="w-4 h-4 text-emerald-400" />}>
                  {selectedDevices.map((dev) => (
                    <td key={dev.id} className="p-3 text-center font-extrabold text-white text-base">
                      ${dev.priceUsd} <span className="text-xs font-normal text-slate-400">USD</span>
                    </td>
                  ))}
                </MatrixRow>

                <MatrixRow label="Autonomía Batería" icon={<Zap className="w-4 h-4 text-amber-400" />} termKey="battery">
                  {selectedDevices.map((dev) => (
                    <td key={dev.id} className="p-3 text-center font-bold text-emerald-400">
                      {dev.batteryLife}
                    </td>
                  ))}
                </MatrixRow>

                <MatrixRow label="Suscripción Mensual" icon={<Sparkles className="w-4 h-4 text-purple-400" />} termKey="subscription">
                  {selectedDevices.map((dev) => (
                    <td key={dev.id} className="p-3 text-center text-xs">
                      {dev.subscriptionRequired ? (
                        <span className="px-2 py-1 rounded bg-amber-950/60 text-amber-300 border border-amber-800/60 font-semibold block">
                          {dev.subscriptionCost}
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 font-semibold block">
                          $0 / mes (Sin cuota)
                        </span>
                      )}
                    </td>
                  ))}
                </MatrixRow>

                <MatrixRow label="Ecosistemas Compatibles">
                  {selectedDevices.map((dev) => (
                    <td key={dev.id} className="p-3 text-center">
                      <div className="flex flex-wrap justify-center gap-1">
                        {dev.ecosystem.map((eco) => (
                          <span
                            key={eco}
                            className="px-2 py-0.5 text-xs font-semibold rounded bg-slate-800 text-slate-200"
                          >
                            {eco}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </MatrixRow>

                {/* Medical Sensors Matrix */}
                <tr className="bg-slate-950/90 font-bold text-cyan-400 text-xs">
                  <td colSpan={selectedDevices.length + 1} className="p-2.5 px-4 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <HeartPulse className="w-4 h-4 text-cyan-400" />
                      <span>Matriz de Sensores Biométricos Clínicos</span>
                    </div>
                  </td>
                </tr>

                <SensorCheckRow label="ECG (Electrocardiograma FDA)" keyName="ecg" devices={selectedDevices} termKey="ecg" />
                <SensorCheckRow label="SpO2 (Oxígeno en sangre)" keyName="spO2" devices={selectedDevices} termKey="spO2" />
                <SensorCheckRow label="cEDA (Estrés Continuo 24/7)" keyName="edaStress" devices={selectedDevices} termKey="edaStress" />
                <SensorCheckRow label="Composición Corporal (BIA)" keyName="bodyComposition" devices={selectedDevices} termKey="bodyComposition" />
                <SensorCheckRow label="Presión Arterial Continuo" keyName="bloodPressure" devices={selectedDevices} />
                <SensorCheckRow label="GPS Integrado" keyName="gps" devices={selectedDevices} termKey="gps" />
                <SensorCheckRow label="Temperatura Cutánea" keyName="skinTemp" devices={selectedDevices} termKey="skinTemp" />

                {/* Pros and Cons Matrix */}
                <tr className="bg-slate-950/90 font-bold text-cyan-400 text-xs">
                  <td colSpan={selectedDevices.length + 1} className="p-2.5 px-4 uppercase tracking-wider">
                    Pros y Contras Lado a Lado
                  </td>
                </tr>

                <tr>
                  <td className="p-3 bg-slate-950/50 font-semibold text-slate-300 text-xs">
                    Ventajas Destacadas (Pros)
                  </td>
                  {selectedDevices.map((dev) => (
                    <td key={dev.id} className="p-3 text-xs align-top">
                      <ul className="space-y-1.5">
                        {dev.pros.map((p, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-slate-300">
                            <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 bg-slate-950/50 font-semibold text-slate-300 text-xs">
                    Limitaciones (Contras)
                  </td>
                  {selectedDevices.map((dev) => (
                    <td key={dev.id} className="p-3 text-xs align-top">
                      <ul className="space-y-1.5">
                        {dev.cons.map((c, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-slate-400">
                            <Minus className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg transition-colors cursor-pointer"
          >
            Cerrar Comparativa
          </button>
        </div>
      </div>
    </div>
  );
};

interface MatrixRowProps {
  label: string;
  icon?: React.ReactNode;
  termKey?: string;
  children: React.ReactNode;
}

const MatrixRow: React.FC<MatrixRowProps> = ({ label, icon, termKey, children }) => (
  <tr className="hover:bg-slate-800/30 transition-colors">
    <td className="p-3 bg-slate-950/50 text-slate-300 font-semibold text-xs border-r border-slate-800/50">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {icon}
          <span>{label}</span>
        </div>
        {termKey && <Tooltip termKey={termKey} iconOnly />}
      </div>
    </td>
    {children}
  </tr>
);

interface SensorCheckRowProps {
  label: string;
  keyName: keyof Wearable['sensors'];
  devices: Wearable[];
  termKey?: string;
}

const SensorCheckRow: React.FC<SensorCheckRowProps> = ({ label, keyName, devices, termKey }) => (
  <tr className="hover:bg-slate-800/30 transition-colors">
    <td className="p-3 bg-slate-950/50 text-slate-300 font-semibold text-xs border-r border-slate-800/50">
      <div className="flex items-center justify-between gap-2">
        <span>{label}</span>
        {termKey && <Tooltip termKey={termKey} iconOnly />}
      </div>
    </td>
    {devices.map((dev) => {
      const isPresent = Boolean(dev.sensors[keyName]);
      return (
        <td key={dev.id} className="p-3 text-center">
          {isPresent ? (
            <span className="inline-flex items-center justify-center p-1 rounded-full bg-emerald-500/20 text-emerald-400">
              <Check className="w-4 h-4 stroke-[3]" />
            </span>
          ) : (
            <span className="inline-flex items-center justify-center p-1 rounded-full bg-slate-800 text-slate-600">
              <X className="w-4 h-4" />
            </span>
          )}
        </td>
      );
    })}
  </tr>
);
