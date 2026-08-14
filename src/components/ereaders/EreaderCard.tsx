import React, { useState } from 'react';
import {
  Zap,
  DollarSign,
  Plus,
  Check,
  Info,
  Star,
  BookOpen,
  Award,
  Palette,
  Edit3,
} from 'lucide-react';
import { Ereader } from '../../types/ereader';
import { EreaderTooltip } from './EreaderTooltip';

interface EreaderCardProps {
  device: Ereader;
  isSelectedForCompare: boolean;
  onToggleCompare: (device: Ereader) => void;
  onOpenDetails: (device: Ereader) => void;
  isCompareMaxReached: boolean;
}

export const EreaderCard: React.FC<EreaderCardProps> = ({
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
          <Award className="w-3.5 h-3.5" />
          Mejor Opción Global
        </span>
      );
    }
    if (device.recommendationTag === 'best_budget') {
      return (
        <span className="px-2.5 py-1 text-xs font-extrabold rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md flex items-center gap-1">
          <DollarSign className="w-3.5 h-3.5" />
          Más Económico
        </span>
      );
    }
    if (device.recommendationTag === 'best_value') {
      return (
        <span className="px-2.5 py-1 text-xs font-extrabold rounded-full bg-gradient-to-r from-purple-500 to-indigo-400 text-white shadow-md flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-white" />
          Mejor Calidad/Precio
        </span>
      );
    }
    if (device.recommendationTag === 'best_color') {
      return (
        <span className="px-2.5 py-1 text-xs font-extrabold rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md flex items-center gap-1">
          <Palette className="w-3.5 h-3.5" />
          Mejor Pantalla Color
        </span>
      );
    }
    if (device.recommendationTag === 'best_notes') {
      return (
        <span className="px-2.5 py-1 text-xs font-extrabold rounded-full bg-gradient-to-r from-indigo-500 to-blue-400 text-white shadow-md flex items-center gap-1">
          <Edit3 className="w-3.5 h-3.5" />
          Mejor Gran Pantalla & Notas
        </span>
      );
    }
    return null;
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'compact':
        return 'Compacto 6.0"';
      case 'standard':
        return 'Estándar 6.8"-8.0"';
      case 'large_note':
        return 'Gran Formato 10.2"+';
      case 'color':
        return 'Pantalla Color';
      default:
        return cat;
    }
  };

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl bg-slate-900/90 border transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 overflow-hidden ${
        isSelectedForCompare
          ? 'border-amber-500 ring-2 ring-amber-500/40 shadow-lg shadow-amber-500/20'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Top Banner Badges */}
      <div className="p-4 pb-0 flex flex-wrap items-center justify-between gap-2 z-10">
        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
          {device.brand}
        </span>
        {getRecommendationBadge()}
      </div>

      {/* Product Image Section */}
      <div className="relative w-full h-48 sm:h-52 flex items-center justify-center p-6 bg-gradient-to-b from-slate-800/30 to-transparent">
        {!imgError ? (
          <img
            src={device.imageUrl}
            alt={device.name}
            onError={() => setImgError(true)}
            className="max-h-full max-w-full object-contain filter drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-500 p-4 text-center">
            <BookOpen className="w-12 h-12 mb-2 text-amber-500/40 animate-pulse" />
            <span className="text-xs font-semibold text-slate-400">{device.name}</span>
            <span className="text-[10px] text-slate-500">{getCategoryLabel(device.category)}</span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="uppercase tracking-wider font-semibold text-amber-400 text-[11px]">
              {getCategoryLabel(device.category)}
            </span>
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{device.rating}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
            {device.name}
          </h3>

          {/* Price & Battery Row */}
          <div className="mt-3 flex items-center justify-between py-2 px-3 rounded-xl bg-slate-950/70 border border-slate-800/60">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wide block font-medium">
                Precio
              </span>
              <span className="text-lg font-extrabold text-white">
                ${device.priceUsd} <span className="text-xs text-slate-400 font-normal">USD</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wide flex items-center justify-end gap-1 font-medium">
                <span>Batería</span>
                <EreaderTooltip termKey="battery_weeks" iconOnly />
              </span>
              <span className="text-xs sm:text-sm font-bold text-emerald-400 flex items-center gap-1 justify-end">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                {device.batteryLife}
              </span>
            </div>
          </div>

          {/* Screen Specs Row */}
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-300 bg-slate-950/40 border border-slate-800/60 px-3 py-1.5 rounded-lg">
            <span>
              Pantalla: <strong>{device.screenSize}" ({device.ppi} PPI)</strong>
            </span>
            <span className="text-amber-400 font-semibold">{device.screenTech}</span>
          </div>

          {/* Key Feature Badges */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {device.colorScreen && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded bg-purple-950 text-purple-300 border border-purple-800/60">
                <span>Color {device.colorPpi ? `(${device.colorPpi} PPI)` : ''}</span>
                <EreaderTooltip termKey="kaleido_3" iconOnly />
              </span>
            )}
            {device.pageTurnButtons && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded bg-amber-950 text-amber-300 border border-amber-800/60">
                <span>Botones Físicos</span>
                <EreaderTooltip termKey="page_buttons" iconOnly />
              </span>
            )}
            {device.stylusSupport && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded bg-blue-950 text-blue-300 border border-blue-800/60">
                <span>Lápiz / Notas</span>
                <EreaderTooltip termKey="stylus" iconOnly />
              </span>
            )}
            {device.warmLight && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded bg-orange-950 text-orange-300 border border-orange-800/60">
                <span>Luz Cálida</span>
                <EreaderTooltip termKey="warm_light" iconOnly />
              </span>
            )}
            {device.waterproof.includes('IPX8') && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                <span>IPX8 Agua</span>
                <EreaderTooltip termKey="ipx8" iconOnly />
              </span>
            )}
            {device.openAndroid && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                <span>Google Play</span>
                <EreaderTooltip termKey="android_open" iconOnly />
              </span>
            )}
          </div>
        </div>

        {/* Card Action Buttons */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
          <button
            onClick={() => onOpenDetails(device)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>Detalles</span>
          </button>

          <button
            onClick={() => onToggleCompare(device)}
            disabled={!isSelectedForCompare && isCompareMaxReached}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isSelectedForCompare
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : isCompareMaxReached
                ? 'bg-slate-800 text-slate-600 border border-slate-800 cursor-not-allowed'
                : 'bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-400 border border-amber-500/30'
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
};
