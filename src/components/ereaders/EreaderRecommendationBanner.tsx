import React from 'react';
import { Award, DollarSign, Sparkles, CheckCircle2, Palette } from 'lucide-react';
import { Ereader } from '../../types/ereader';
import { EreaderTooltip } from './EreaderTooltip';

interface EreaderRecommendationBannerProps {
  ereaders: Ereader[];
  onSelectDevice: (device: Ereader) => void;
}

export const EreaderRecommendationBanner: React.FC<EreaderRecommendationBannerProps> = ({
  ereaders,
  onSelectDevice,
}) => {
  const bestOverall = ereaders.find((e) => e.recommendationTag === 'best_overall');
  const bestBudget = ereaders.find((e) => e.recommendationTag === 'best_budget');
  const bestValue = ereaders.filter((e) => e.recommendationTag === 'best_value');

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-xl font-black text-white">Recomendaciones Oficiales de E-readers 2026</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Selección destacada según resolución, contraste de pantalla, ergonomía y relación valor/precio
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Mejor Opción Global */}
        {bestOverall && (
          <div className="relative rounded-2xl bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/40 p-6 flex flex-col justify-between space-y-4 shadow-xl">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
                <Award className="w-4 h-4" />
                <span>Mejor Opción Global</span>
              </div>
              <h4 className="text-lg font-bold text-white">Equilibrio Perfecto de Lectura</h4>
              <p className="text-xs text-slate-300 leading-relaxed inline-flex flex-wrap items-center gap-1">
                <span>Pantalla Carta 1200 de 6.8", luz cálida ajustable, 10 semanas de batería y resistencia</span>
                <EreaderTooltip termKey="ipx8" label="IPX8 al agua" />.
              </p>

              <div className="pt-2">
                <div
                  onClick={() => onSelectDevice(bestOverall)}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={bestOverall.imageUrl}
                      alt={bestOverall.name}
                      className="w-10 h-10 object-contain"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">{bestOverall.name}</span>
                      <span className="text-[10px] text-amber-400 font-semibold">
                        {bestOverall.brand} • ${bestOverall.priceUsd} USD • 6.8" (300 PPI)
                      </span>
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Card 2: Opción Más Económica */}
        {bestBudget && (
          <div className="relative rounded-2xl bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 p-6 flex flex-col justify-between space-y-4 shadow-xl">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                <DollarSign className="w-4 h-4" />
                <span>Opción Más Económica</span>
              </div>
              <h4 className="text-lg font-bold text-white">Máxima Portabilidad (158g)</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                El precio más accesible por debajo de $100 USD con panel de 300 PPI de alta nitidez, conector USB-C y 16GB de almacenamiento.
              </p>

              <div className="pt-2">
                <div
                  onClick={() => onSelectDevice(bestBudget)}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={bestBudget.imageUrl}
                      alt={bestBudget.name}
                      className="w-10 h-10 object-contain"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">{bestBudget.name}</span>
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        {bestBudget.brand} • ${bestBudget.priceUsd} USD • 6.0" (158g)
                      </span>
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Card 3: Mejor Calidad / Precio & Pantalla Color */}
        <div className="relative rounded-2xl bg-gradient-to-b from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/40 p-6 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-bold">
              <Palette className="w-4 h-4" />
              <span>Mejor Color & Botones</span>
            </div>
            <h4 className="text-lg font-bold text-white">Tinta a Color & Ecosistemas Abiertos</h4>
            <p className="text-xs text-slate-300 leading-relaxed inline-flex flex-wrap items-center gap-1">
              <span>Modelos versátiles con</span>
              <EreaderTooltip termKey="kaleido_3" label="pantalla a color" />
              <span>y</span>
              <EreaderTooltip termKey="page_buttons" label="botones físicos" />.
            </p>

            <div className="space-y-2 pt-2">
              {bestValue.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectDevice(item)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-8 h-8 object-contain"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block line-clamp-1">{item.name}</span>
                      <span className="text-[10px] text-purple-300 font-semibold">
                        {item.brand} • ${item.priceUsd} USD
                      </span>
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
