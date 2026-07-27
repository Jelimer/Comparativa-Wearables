import React from 'react';
import { Award, DollarSign, Activity, Sparkles, CheckCircle2 } from 'lucide-react';
import { Wearable } from '../types/wearable';

interface RecommendationBannerProps {
  wearables: Wearable[];
  onSelectDevice: (device: Wearable) => void;
}

export const RecommendationBanner: React.FC<RecommendationBannerProps> = ({
  wearables,
  onSelectDevice,
}) => {
  const bestOverall = wearables.filter((w) => w.recommendationTag === 'best_overall');
  const bestBudget = wearables.filter((w) => w.recommendationTag === 'best_budget');
  const bestValue = wearables.filter((w) => w.recommendationTag === 'best_value');

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-xl font-black text-white">Recomendaciones Oficiales de la Comparativa 2026</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Selección destacada según la auditoría clínica y de rendimiento del informe técnico
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Mejor Opción Global */}
        <div className="relative rounded-2xl bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/40 p-6 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
              <Award className="w-4 h-4" />
              <span>Mejor Opción Global</span>
            </div>
            <h4 className="text-lg font-bold text-white">Alto Rendimiento & Salud Clínica</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Dispositivos sin concesiones para quienes buscan la máxima precisión biométrica, ECG médico FDA y análisis avanzado.
            </p>
            <div className="space-y-2 pt-2">
              {bestOverall.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectDevice(item)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={item.imageUrl} alt={item.name} className="w-8 h-8 object-contain" />
                    <div>
                      <span className="text-xs font-bold text-white block line-clamp-1">{item.name}</span>
                      <span className="text-[10px] text-amber-400 font-semibold">{item.brand} • ${item.priceUsd} USD</span>
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Opción Más Económica */}
        <div className="relative rounded-2xl bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 p-6 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
              <DollarSign className="w-4 h-4" />
              <span>Opción Más Económica</span>
            </div>
            <h4 className="text-lg font-bold text-white">Presupuesto Eficiente & Gran Batería</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Inversión mínima para obtener seguimiento continuo de frecuencia cardíaca, SpO2 y sueño sin pagar mensualidades.
            </p>
            <div className="space-y-2 pt-2">
              {bestBudget.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectDevice(item)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={item.imageUrl} alt={item.name} className="w-8 h-8 object-contain" />
                    <div>
                      <span className="text-xs font-bold text-white block line-clamp-1">{item.name}</span>
                      <span className="text-[10px] text-emerald-400 font-semibold">{item.brand} • ${item.priceUsd} USD</span>
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 3: Mejor Calidad / Precio */}
        <div className="relative rounded-2xl bg-gradient-to-b from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/40 p-6 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold">
              <Activity className="w-4 h-4" />
              <span>Mejor Calidad / Precio</span>
            </div>
            <h4 className="text-lg font-bold text-white">Equilibrio Técnico Perfecto</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Métricas avanzadas (composición corporal, cEDA o 10 días de autonomía) a un costo competitivo sin ataduras.
            </p>
            <div className="space-y-2 pt-2">
              {bestValue.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectDevice(item)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={item.imageUrl} alt={item.name} className="w-8 h-8 object-contain" />
                    <div>
                      <span className="text-xs font-bold text-white block line-clamp-1">{item.name}</span>
                      <span className="text-[10px] text-cyan-400 font-semibold">{item.brand} • ${item.priceUsd} USD</span>
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
