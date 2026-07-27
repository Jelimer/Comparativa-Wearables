import React from 'react';
import {
  X,
  ExternalLink,
  Check,
  Zap,
  DollarSign,
  HeartPulse,
  Star,
  Plus,
} from 'lucide-react';
import { Wearable } from '../types/wearable';
import { Tooltip } from './Tooltip';

interface DeviceDetailModalProps {
  device: Wearable | null;
  onClose: () => void;
  onToggleCompare: (device: Wearable) => void;
  isSelectedForCompare: boolean;
  isCompareMaxReached: boolean;
}

export const DeviceDetailModal: React.FC<DeviceDetailModalProps> = ({
  device,
  onClose,
  onToggleCompare,
  isSelectedForCompare,
  isCompareMaxReached,
}) => {
  if (!device) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-bold">
              {device.brand}
            </span>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wide">
              {device.category}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Main Info Hero */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-40 h-40 bg-slate-950 rounded-2xl p-4 flex items-center justify-center border border-slate-800 flex-shrink-0">
              <img
                src={device.imageUrl}
                alt={device.name}
                className="max-h-full max-w-full object-contain filter drop-shadow-xl"
                onError={(e) => {
                  e.currentTarget.src = '/images/devices/placeholder.svg';
                }}
              />
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1">
              <h3 className="text-2xl font-black text-white">{device.name}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{device.description}</p>

              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{device.rating} / 5.0</span>
                </div>

                <div className="flex items-center gap-1 text-emerald-400 font-extrabold text-lg">
                  <DollarSign className="w-4 h-4" />
                  <span>${device.priceUsd} USD</span>
                </div>

                <div className="flex items-center gap-1 text-slate-300 font-bold text-xs bg-slate-800 px-3 py-1 rounded-lg">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Autonomía: {device.batteryLife}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription & Ecosystem info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wide font-bold block mb-1">
                Modelo de Cobro
              </span>
              {device.subscriptionRequired ? (
                <span className="text-xs font-bold text-amber-400">
                  Requiere Suscripción: {device.subscriptionCost}
                </span>
              ) : (
                <span className="text-xs font-bold text-emerald-400">
                  Sin Suscripción Mensual ($0/mes)
                </span>
              )}
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wide font-bold block mb-1">
                Ecosistemas Compatibles
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {device.ecosystem.map((eco) => (
                  <span
                    key={eco}
                    className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-xs font-semibold"
                  >
                    {eco}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Sensors Grid */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
              <HeartPulse className="w-4 h-4" />
              <span>Capacidades de Sensores Médicos Biométricos</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <SensorDetailPill label="Electrocardiograma (ECG)" active={device.sensors.ecg} termKey="ecg" />
              <SensorDetailPill label="Oxígeno SpO2" active={device.sensors.spO2} termKey="spO2" />
              <SensorDetailPill label="cEDA Estrés 24/7" active={device.sensors.edaStress} termKey="edaStress" />
              <SensorDetailPill label="Composición Corporal BIA" active={device.sensors.bodyComposition} termKey="bodyComposition" />
              <SensorDetailPill label="Presión Arterial" active={Boolean(device.sensors.bloodPressure)} />
              <SensorDetailPill label="GPS Integrado" active={device.sensors.gps} termKey="gps" />
              <SensorDetailPill label="Temperatura Cutánea" active={device.sensors.skinTemp} termKey="skinTemp" />
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              *Sensor de frecuencia cardíaca: <strong>{device.sensors.heartRate}</strong>
            </p>
          </div>

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Ventajas Clave</h4>
              <ul className="text-xs text-slate-300 space-y-1.5">
                {device.pros.map((p, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Limitaciones</h4>
              <ul className="text-xs text-slate-300 space-y-1.5">
                {device.cons.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <a
            href={device.officialSiteUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <span>Ver en sitio oficial</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleCompare(device)}
              disabled={!isSelectedForCompare && isCompareMaxReached}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isSelectedForCompare
                  ? 'bg-cyan-500 text-white shadow-md'
                  : isCompareMaxReached
                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-slate-800 hover:bg-cyan-600 hover:text-white text-cyan-400 border border-cyan-500/30'
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
                  <span>Añadir a Comparar</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SensorDetailPill: React.FC<{ label: string; active: boolean; termKey?: string }> = ({
  label,
  active,
  termKey,
}) => (
  <div
    className={`p-2 rounded-lg border flex items-center justify-between gap-1.5 ${
      active
        ? 'bg-cyan-950/40 border-cyan-800/60 text-cyan-300 font-semibold'
        : 'bg-slate-900 border-slate-800 text-slate-600 line-through'
    }`}
  >
    <div className="flex items-center gap-1.5 truncate">
      {active ? (
        <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
      ) : (
        <X className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
      )}
      <span className="truncate">{label}</span>
    </div>
    {termKey && <Tooltip termKey={termKey} iconOnly />}
  </div>
);
