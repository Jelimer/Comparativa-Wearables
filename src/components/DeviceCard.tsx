import React, { useState } from 'react';
import {
  Zap,
  DollarSign,
  CheckCircle,
  Plus,
  Check,
  Info,
  Star,
  Activity,
  Smartphone,
  ShieldAlert,
} from 'lucide-react';
import { Wearable } from '../types/wearable';
import { Tooltip } from './Tooltip';

interface DeviceCardProps {
  device: Wearable;
  isSelectedForCompare: boolean;
  onToggleCompare: (device: Wearable) => void;
  onOpenDetails: (device: Wearable) => void;
  isCompareMaxReached: boolean;
}

export const DeviceCard: React.FC<DeviceCardProps> = React.memo(({
  device,
  isSelectedForCompare,
  onToggleCompare,
  onOpenDetails,
  isCompareMaxReached,
}) => {
  const [imgError, setImgError] = useState(false);

  const getRecommendationBadge = () => {
    if (device.recommendationTag === 'best_overall') {
      return (
        <span className="px-2.5 py-1 text-xs font-extrabold rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-slate-950" />
          Mejor Opción Global
        </span>
      );
    }
    if (device.recommendationTag === 'best_budget') {
      return (
        <span className="px-2.5 py-1 text-xs font-extrabold rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md flex items-center gap-1">
          <DollarSign className="w-3.5 h-3.5" />
          Más Económica
        </span>
      );
    }
    if (device.recommendationTag === 'best_value') {
      return (
        <span className="px-2.5 py-1 text-xs font-extrabold rounded-full bg-gradient-to-r from-cyan-500 to-blue-400 text-slate-950 shadow-md flex items-center gap-1">
          <Activity className="w-3.5 h-3.5" />
          Mejor Calidad/Precio
        </span>
      );
    }
    return null;
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'smartwatch':
        return 'Smartwatch';
      case 'band':
        return 'Pulsera / Band';
      case 'ring':
        return 'Anillo Inteligente';
      default:
        return category;
    }
  };

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900/90 border transition-all duration-300 hover:shadow-xl dark:hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1 overflow-hidden ${
        isSelectedForCompare
          ? 'border-cyan-500 ring-2 ring-cyan-500/40 shadow-lg shadow-cyan-500/20'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Top Banner Badges */}
      <div className="p-4 pb-0 flex flex-wrap items-center justify-between gap-2 z-10">
        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          {device.brand}
        </span>
        {getRecommendationBadge()}
      </div>

      {/* Product Image Section */}
      <div className="relative w-full h-48 sm:h-52 flex items-center justify-center p-6 bg-gradient-to-b from-slate-100/70 to-transparent dark:from-slate-800/30 dark:to-transparent">
        {!imgError ? (
          <img
            src={device.imageUrl}
            alt={device.name}
            onError={(e) => {
              if (e.currentTarget.src.includes('placeholder.svg')) {
                setImgError(true);
              } else {
                e.currentTarget.src = '/images/devices/placeholder.svg';
              }
            }}
            className="max-h-full max-w-full object-contain filter drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-4 text-center">
            <Activity className="w-12 h-12 mb-2 text-cyan-600/40 dark:text-cyan-500/40 animate-pulse" />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{device.name}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">{getCategoryLabel(device.category)}</span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="uppercase tracking-wider font-semibold text-cyan-600 dark:text-cyan-400 text-[11px]">
              {getCategoryLabel(device.category)}
            </span>
            <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-500 dark:fill-amber-400" />
              <span>{device.rating}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors line-clamp-1">
            {device.name}
          </h3>

          {/* Price & Battery Row */}
          <div className="mt-3 flex items-center justify-between py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/60">
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wide block font-medium">
                Precio Hardware
              </span>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white">${device.priceUsd} <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">USD</span></span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center justify-end gap-1 font-medium">
                <span>Autonomía</span>
                <Tooltip termKey="battery" iconOnly />
              </span>
              <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 justify-end">
                <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                {device.batteryLife}
              </span>
            </div>
          </div>

          {/* Subscription Status */}
          <div className="mt-2.5">
            {device.subscriptionRequired ? (
              <div className="flex items-center justify-between text-xs text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 px-2.5 py-1 rounded-lg">
                <div className="flex items-center gap-1.5 truncate">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                  <span className="truncate">Suscripción: <strong>{device.subscriptionCost}</strong></span>
                </div>
                <Tooltip termKey="subscription" iconOnly />
              </div>
            ) : (
              <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 px-2.5 py-1 rounded-lg">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Sin Suscripción ($0 cuotas)</span>
                </div>
                <Tooltip termKey="subscription" iconOnly />
              </div>
            )}
          </div>

          {/* Key Sensor Badges */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {device.sensors.ecg && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded bg-cyan-50 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/60">
                <span>ECG FDA</span>
                <Tooltip termKey="ecg" iconOnly />
              </span>
            )}
            {device.sensors.spO2 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded bg-sky-50 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60">
                <span>SpO2</span>
                <Tooltip termKey="spO2" iconOnly />
              </span>
            )}
            {device.sensors.edaStress && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded bg-purple-50 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                <span>cEDA Estrés</span>
                <Tooltip termKey="edaStress" iconOnly />
              </span>
            )}
            {device.sensors.bodyComposition && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded bg-pink-50 dark:bg-pink-950 text-pink-800 dark:text-pink-300 border border-pink-200 dark:border-pink-800/60">
                <span>BIA Composición</span>
                <Tooltip termKey="bodyComposition" iconOnly />
              </span>
            )}
            {device.sensors.bloodPressure && (
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
                Presión Arterial
              </span>
            )}
            {device.sensors.gps && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                <span>GPS</span>
                <Tooltip termKey="gps" iconOnly />
              </span>
            )}
          </div>

          {/* Ecosystem Compatibility */}
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <Smartphone className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <span>Compatibilidad:</span>
            <div className="flex gap-1">
              {device.ecosystem.map((eco) => (
                <span
                  key={eco}
                  className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[10px]"
                >
                  {eco}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Card Action Buttons */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center gap-2">
          <button
            onClick={() => onOpenDetails(device)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Detalles</span>
          </button>

          <button
            onClick={() => onToggleCompare(device)}
            disabled={!isSelectedForCompare && isCompareMaxReached}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isSelectedForCompare
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : isCompareMaxReached
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border border-slate-200 dark:border-slate-800 cursor-not-allowed'
                : 'bg-slate-100 hover:bg-cyan-600 hover:text-white dark:bg-slate-800 dark:hover:bg-cyan-600 dark:hover:text-white text-cyan-700 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-500/30'
            }`}
          >
            {isSelectedForCompare ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Añadido</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Comparar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});
