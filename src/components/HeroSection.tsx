import React from 'react';
import { HeartPulse, Zap, Shield, Sparkles, ArrowDown } from 'lucide-react';

interface HeroSectionProps {
  onScrollToExplore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToExplore }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800/80">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[250px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Top Pill Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Informe Técnico Actualizado — Julio 2026</span>
          </div>

          {/* Main Title */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Encuentra el <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">Wearable Perfecto</span> para tu Salud y Deporte
          </h2>

          {/* Subtitle */}
          <p className="mt-4 text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Compara objetivamente <strong>15 dispositivos biométricos líderes</strong> en 2026: desde anillos de titanio sin pantalla hasta computadoras multideporte de alta autonomía y smartwatches con ECG médico.
          </p>

          {/* Quick Pillars Grid */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Sensores Médicos</h3>
              </div>
              <p className="text-xs text-slate-400">
                ECG, SpO2, cEDA continua, Composición Corporal (BIA) y Presión Arterial sin manguito.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Autonomía Real</h3>
              </div>
              <p className="text-xs text-slate-400">
                Desde cargas diarias de 24 horas hasta baterías de larga duración de 31 días.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">TCO Transparente</h3>
              </div>
              <p className="text-xs text-slate-400">
                Evaluación clara de suscripciones mensuales obligatorias (Whoop, Oura) vs $0 cuotas de por vida.
              </p>
            </div>
          </div>

          {/* Call to action button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={onScrollToExplore}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-xl shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Explorar y Filtrar Dispositivos</span>
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
