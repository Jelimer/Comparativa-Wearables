import React, { useState } from 'react';
import {
  BookOpen,
  Smartphone,
  Share2,
  Calculator,
  Compass,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react';
import { WEARABLES_DATA } from '../data/wearables';

export const StrategicGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'compatibility' | 'sync' | 'tco' | 'lifestyle'>(
    'compatibility'
  );

  // State for TCO Calculator
  const [selectedTcoId, setSelectedTcoId] = useState<string>('whoop-4');

  // State for Lifestyle Finder
  const [selectedGoal, setSelectedGoal] = useState<'sleep' | 'sports' | 'invisible' | 'heart'>(
    'sleep'
  );

  const selectedTcoDevice = WEARABLES_DATA.find((w) => w.id === selectedTcoId) || WEARABLES_DATA[0];

  // Calculate 3-Year TCO
  const getMonthlySubPrice = (device: typeof selectedTcoDevice) => {
    if (!device.subscriptionRequired) return 0;
    if (device.id === 'whoop-4') return 30; // $30/mo
    if (device.id === 'oura-ring-4') return 6; // $6/mo
    return 10;
  };

  const monthlyFee = getMonthlySubPrice(selectedTcoDevice);
  const totalSub3Years = monthlyFee * 36;
  const tco3Years = selectedTcoDevice.priceUsd + totalSub3Years;

  return (
    <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Guía Estratégica de Decisión Biométrica (4 Pasos)
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Metodología interactiva para elegir tu wearable sin cometer errores de compatibilidad ni costos ocultos
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <TabButton
          id="compatibility"
          active={activeTab === 'compatibility'}
          onClick={() => setActiveTab('compatibility')}
          icon={<Smartphone className="w-4 h-4" />}
          label="1. Compatibilidad Smartphone"
        />
        <TabButton
          id="sync"
          active={activeTab === 'sync'}
          onClick={() => setActiveTab('sync')}
          icon={<Share2 className="w-4 h-4" />}
          label="2. Sincronización Health Connect"
        />
        <TabButton
          id="tco"
          active={activeTab === 'tco'}
          onClick={() => setActiveTab('tco')}
          icon={<Calculator className="w-4 h-4" />}
          label="3. Calculadora TCO a 3 Años"
        />
        <TabButton
          id="lifestyle"
          active={activeTab === 'lifestyle'}
          onClick={() => setActiveTab('lifestyle')}
          icon={<Compass className="w-4 h-4" />}
          label="4. Matriz de Estilo de Vida"
        />
      </div>

      {/* Tab 1: Smartphone Compatibility */}
      {activeTab === 'compatibility' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-200 flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Regla de oro:</strong> Antes de comprar, verifica que el sistema operativo de tu teléfono no bloquee funciones biométricas clave (como ECG o Presión Arterial).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="px-2.5 py-1 rounded bg-blue-950 text-blue-300 text-xs font-bold border border-blue-800">
                Usuarios de iPhone (iOS)
              </span>
              <h4 className="text-sm font-bold text-white">Compatibilidad Recomendada</h4>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span><strong>Apple Watch Series 10:</strong> 100% integración nativa.</span>
                </li>
                <li className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span><strong>Garmin Epix Pro / CIRQA, Oura Ring 4, Whoop 4.0:</strong> Excelente app de iOS.</span>
                </li>
                <li className="flex items-center gap-2 text-rose-400">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span><strong>Samsung Galaxy Watch / Ring:</strong> 0% Incompatible.</span>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 text-xs font-bold border border-emerald-800">
                Usuarios de Android (Google / Motorola / Xiaomi / Nothing)
              </span>
              <h4 className="text-sm font-bold text-white">Compatibilidad Recomendada</h4>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span><strong>Pixel Watch 4 & Fitbit Series:</strong> Máxima integración con Google AI.</span>
                </li>
                <li className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span><strong>Garmin, Oura, RingConn, Xiaomi, Whoop:</strong> Totalmente funcionales.</span>
                </li>
                <li className="flex items-center gap-2 text-amber-400">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span><strong>Samsung Galaxy Watch:</strong> Funciona pero bloquea ECG/Presión sin teléfono Samsung.</span>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="px-2.5 py-1 rounded bg-purple-950 text-purple-300 text-xs font-bold border border-purple-800">
                Usuarios de Samsung Galaxy
              </span>
              <h4 className="text-sm font-bold text-white">Compatibilidad Recomendada</h4>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span><strong>Galaxy Watch Ultra 2 & Watch 9:</strong> Desbloquea sensor BioActivo 3-en-1 completo + Apnea del sueño.</span>
                </li>
                <li className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span><strong>Galaxy Ring:</strong> Integración fluida en Samsung Health sin mensualidad.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Health Connect Sync */}
      {activeTab === 'sync' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <h4 className="text-base font-bold text-white">
              Ecosistema Abierto: Google Health Connect 2.0 & Apple Health
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              En 2026, la fragmentación de datos de salud se resuelve mediante hubs de sincronización encriptada en el propio dispositivo. Google Health Connect permite unificar la lectura del sensor cEDA de Fitbit con las métricas de entrenamiento de Garmin y el seguimiento térmico de Oura.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <h5 className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider mb-2">
                  Google Health Connect (Android 14/15/16)
                </h5>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Sincronización instantánea en milisegundos entre Fitbit, Garmin Connect y Oura.</li>
                  <li>Privacidad local: las claves biométricas residen en el chip de seguridad del teléfono.</li>
                  <li>Inclusión de métricas de ronquidos, SpO2 continua y variabilidad del ritmo cardíaco (VFC).</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <h5 className="text-xs font-extrabold text-blue-400 uppercase tracking-wider mb-2">
                  Apple Health (HealthKit iOS 18/19)
                </h5>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Centralización completa de ECG, audiometría, fases de sueño y temperatura basal.</li>
                  <li>Integración directa con registros de salud hospitalarios en EE. UU. y Europa.</li>
                  <li>Soporte bidireccional con Oura, Whoop y Garmin Connect.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Interactive 3-Year TCO Calculator */}
      {activeTab === 'tco' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-white">Calculadora de Costo Total a 3 Años (TCO)</h4>
                <p className="text-xs text-slate-400">
                  El precio de compra del hardware es solo el inicio. Descubre el costo real acumulado sumando las cuotas mensuales obligatorias.
                </p>
              </div>

              {/* Device selector for TCO */}
              <div className="min-w-[220px]">
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Selecciona Dispositivo:
                </label>
                <select
                  value={selectedTcoId}
                  onChange={(e) => setSelectedTcoId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-cyan-500"
                >
                  {WEARABLES_DATA.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} (${w.priceUsd})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* TCO Breakdown Display */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-cyan-500/30 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase tracking-wide block font-semibold">
                  Costo Hardware Inicial
                </span>
                <span className="text-2xl font-black text-white mt-1 block">
                  ${selectedTcoDevice.priceUsd} <span className="text-xs text-slate-400">USD</span>
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase tracking-wide block font-semibold">
                  Suscripción Acumulada (36 Meses)
                </span>
                <span className="text-2xl font-black text-amber-400 mt-1 block">
                  ${totalSub3Years} <span className="text-xs text-slate-400">USD</span>
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">
                  {monthlyFee > 0 ? `$${monthlyFee}/mes` : '$0/mes (Incluido)'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-cyan-950/60 border border-cyan-500/40">
                <span className="text-[11px] text-cyan-300 uppercase tracking-wide block font-extrabold">
                  TCO Total en 3 Años
                </span>
                <span className="text-3xl font-black text-cyan-400 mt-1 block">
                  ${tco3Years} <span className="text-xs text-slate-400">USD</span>
                </span>
              </div>
            </div>

            {/* Explanatory note */}
            <p className="text-xs text-slate-400 italic">
              *Nota: Dispositivos como <strong>Whoop 4.0</strong> ($239 inicial + $30/mes = ~$1,319 USD a 3 años) u <strong>Oura Ring 4</strong> ($299 + $6/mes = ~$515 USD) requieren suscripción continua, mientras que <strong>Garmin, Samsung y RingConn</strong> ofrecen costo recurrente $0.
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Lifestyle Matrix */}
      {activeTab === 'lifestyle' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <h4 className="text-base font-bold text-white">¿Cuál es tu objetivo primordial de uso?</h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <GoalButton
                active={selectedGoal === 'sleep'}
                onClick={() => setSelectedGoal('sleep')}
                label="Biohacking & Sueño"
              />
              <GoalButton
                active={selectedGoal === 'sports'}
                onClick={() => setSelectedGoal('sports')}
                label="Deporte & Outdoor"
              />
              <GoalButton
                active={selectedGoal === 'invisible'}
                onClick={() => setSelectedGoal('invisible')}
                label="Rastreo Pasivo Invisible"
              />
              <GoalButton
                active={selectedGoal === 'heart'}
                onClick={() => setSelectedGoal('heart')}
                label="Salud Cardiovascular"
              />
            </div>

            {/* Goal Output Recommendation */}
            <div className="p-5 rounded-xl bg-slate-900 border border-cyan-500/30">
              {selectedGoal === 'sleep' && (
                <div className="space-y-2">
                  <h5 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Recomendación: Oura Ring 4 / RingConn Gen 2 / Fitbit Sense 2</span>
                  </h5>
                  <p className="text-xs text-slate-300">
                    Formato ultracómodo para dormir sin molestias de pantalla. El sensor cEDA del Sense 2 y la matriz térmica de Oura ofrecen la máxima precisión histórica en predicción de fases de sueño y alertas de enfermedad.
                  </p>
                </div>
              )}

              {selectedGoal === 'sports' && (
                <div className="space-y-2">
                  <h5 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Recomendación: Garmin Epix Pro / Whoop 4.0 / Galaxy Watch Ultra 2</span>
                  </h5>
                  <p className="text-xs text-slate-300">
                    Autonomía de semanas, mapas sin conexión, resistencia militar en titanio y cálculo avanzado de Strain (Esfuerzo Acumulado), VFC y VO2 Max de nivel olímpico.
                  </p>
                </div>
              )}

              {selectedGoal === 'invisible' && (
                <div className="space-y-2">
                  <h5 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Recomendación: Fitbit Air / Garmin CIRQA / Samsung Galaxy Ring</span>
                  </h5>
                  <p className="text-xs text-slate-300">
                    Diseñados para quienes no desean una pantalla adicional ni notificaciones interrumpiendo su jornada. Recopilación pasiva de ritmo cardíaco 24/7 en muñeca o dedo.
                  </p>
                </div>
              )}

              {selectedGoal === 'heart' && (
                <div className="space-y-2">
                  <h5 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Recomendación: Signal Ring / Galaxy Watch Ultra 2 / Pixel Watch 4</span>
                  </h5>
                  <p className="text-xs text-slate-300">
                    Signal Ring lidera la medición continua de Presión Arterial sin manguito, mientras que Pixel Watch 4 y Galaxy Watch cuentan con ECG verificado por la FDA para detección temprana de Fibrilación Auricular.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

interface TabButtonProps {
  id: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
      active
        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
        : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

interface GoalButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

const GoalButton: React.FC<GoalButtonProps> = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`p-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
      active
        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-sm'
        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
    }`}
  >
    {label}
  </button>
);
