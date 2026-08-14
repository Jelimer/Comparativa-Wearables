import React from 'react';
import { Compass } from 'lucide-react';

export const EreaderStrategicGuide: React.FC = () => {
  return (
    <section className="space-y-8 pt-8 border-t border-slate-800">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Compass className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-white">
            Guía Estratégica para Elegir tu E-reader (4 Pasos Clave)
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Aplica estos filtros secuenciales para no equivocarte de modelo ni pagar de más
          </p>
        </div>
      </div>

      {/* 4 Steps Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step 1: B/N vs Color */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-black text-xs border border-amber-500/40">
              Paso 1
            </span>
            <h4 className="text-base font-bold text-white">
              ¿Pantalla en Blanco y Negro o Pantalla a Color?
            </h4>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            La tinta a color ha madurado mucho, pero tiene un compromiso técnico que debes conocer:
          </p>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="font-bold text-emerald-400 block">
                ⚪ Elige Blanco y Negro (Carta 1200 / 1300):
              </span>
              <p className="text-slate-300">
                Si el 90% de lo que lees son novelas, ensayos y libros de texto puro. Las pantallas B/N tienen un fondo blanco más puro y no necesitan encender la luz integrada durante el día.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="font-bold text-purple-400 block">
                🎨 Elige Pantalla a Color (Kaleido 3 / Colorsoft):
              </span>
              <p className="text-slate-300">
                Si lees mangas en color, cómics occidentales, libros de cocina, cuentos infantiles o te encanta organizar tus notas y subrayados en amarillo, verde y azul.
              </p>
            </div>
          </div>
        </div>

        {/* Step 2: Ecosystem */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-black text-xs border border-indigo-500/40">
              Paso 2
            </span>
            <h4 className="text-base font-bold text-white">
              ¿Amazon Kindle, Kobo o Android Abierto?
            </h4>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Tu procedencia de libros define la marca que más te conviene:
          </p>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="font-bold text-amber-400 block">Amazon Kindle:</span>
              <p className="text-slate-300">
                La experiencia más fluida y sin fricción para comprar con un clic. Sincronización instantánea con la app móvil y catálogo masivo en Kindle Unlimited.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="font-bold text-cyan-400 block">Rakuten Kobo:</span>
              <p className="text-slate-300">
                Libertad total para leer EPUBs nativos, integración con Dropbox/Google Drive y compatibilidad con OverDrive para tomar libros prestados de bibliotecas públicas.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="font-bold text-emerald-400 block">Onyx BOOX (Android):</span>
              <p className="text-slate-300">
                Sin ataduras. Te permite tener las apps de Kindle, Kobo, Storytel, Readwise y Libby en un solo dispositivo con Google Play Store.
              </p>
            </div>
          </div>
        </div>

        {/* Step 3: Size & Ergonomics */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-xs border border-emerald-500/40">
              Paso 3
            </span>
            <h4 className="text-base font-bold text-white">
              Tamaño de Pantalla y Botones Físicos
            </h4>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="font-bold text-white">6.0 Pulgadas (150-170g):</span>
              <span className="text-slate-400">Ultra portátil, cabe en cualquier bolsillo.</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="font-bold text-white">6.8" - 7.0" Pulgadas:</span>
              <span className="text-slate-400">El tamaño ideal para novelas y lectura prolongada.</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="font-bold text-white">8.0" - 10.3" Pulgadas:</span>
              <span className="text-slate-400">Indispensable para PDFs a doble columna y notas.</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="font-bold text-amber-400">Botones Físicos:</span>
              <span className="text-slate-400">Ideales para leer en la cama o con una sola mano.</span>
            </div>
          </div>
        </div>

        {/* Step 4: Decision Matrix */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 font-black text-xs border border-pink-500/40">
              Paso 4
            </span>
            <h4 className="text-base font-bold text-white">
              Veredicto según tu Perfil de Lectura
            </h4>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="font-bold text-amber-400 block mb-0.5">
                📖 Lector Voraz de Novelas:
              </span>
              <p className="text-slate-300">
                👉 <strong>Kindle Paperwhite (16GB)</strong> o <strong>Kobo Clara BW</strong>. Máximo contraste, luz cálida y 10 semanas de batería.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="font-bold text-purple-400 block mb-0.5">
                🎨 Cómics, Manga & Botones:
              </span>
              <p className="text-slate-300">
                👉 <strong>Kobo Libra Colour</strong> o <strong>Kindle Colorsoft</strong>. Portadas y viñetas vivas con botones táctiles ergonómicos.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="font-bold text-blue-400 block mb-0.5">
                📝 Estudio, Notas & PDFs Técnicos:
              </span>
              <p className="text-slate-300">
                👉 <strong>Kindle Scribe</strong> (10.2" nítido a 300 PPI) o <strong>BOOX Note Air3 C</strong> (con Android y Wacom Stylus).
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="font-bold text-emerald-400 block mb-0.5">
                🎒 Máxima Portabilidad / Bolsillo:
              </span>
              <p className="text-slate-300">
                👉 <strong>Kindle Básico</strong> ($99 USD) o <strong>BOOX Palma</strong> (formato smartphone con Google Play).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
