import React from 'react';
import { BookOpen, Palette, BatteryCharging, Sparkles, ArrowDown, Library } from 'lucide-react';

interface EreaderHeroProps {
  onScrollToExplore: () => void;
}

export const EreaderHero: React.FC<EreaderHeroProps> = ({ onScrollToExplore }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 bg-gradient-to-b from-amber-950/20 via-slate-950 to-slate-950 border-b border-slate-800/80">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[250px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Top Pill Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Guía de Compra y Comparativa — E-readers & Kindles 2026</span>
          </div>

          {/* Main Title */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Descubre el <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 bg-clip-text text-transparent">E-reader Ideal</span> para Leer sin Fatiga
          </h2>

          {/* Subtitle */}
          <p className="mt-4 text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Compara objetivamente <strong>15 lectores de libros electrónicos líderes</strong> en 2026: desde los nuevos Kindles a color y modelos ultraligeros de 6", hasta dispositivos Kobo con botones físicos y tablets Android E-Ink con Google Play.
          </p>

          {/* Quick Pillars Grid */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <Palette className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Tinta Color & B/N</h3>
              </div>
              <p className="text-xs text-slate-400">
                Paneles Carta 1300 con +25% de contraste, Colorsoft y Kaleido 3 para cómics y mangas.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <BatteryCharging className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Batería en Semanas</h3>
              </div>
              <p className="text-xs text-slate-400">
                Disfruta de entre 6 y 12 semanas de lectura continua con una sola carga por USB-C.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Library className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Ecosistemas Abiertos</h3>
              </div>
              <p className="text-xs text-slate-400">
                Kindle Store, Kobo Plus, soporte nativo de EPUB, bibliotecas públicas (Libby) y Android libre.
              </p>
            </div>
          </div>

          {/* Call to action button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={onScrollToExplore}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-slate-950" />
              <span>Explorar y Filtrar E-readers</span>
              <ArrowDown className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
