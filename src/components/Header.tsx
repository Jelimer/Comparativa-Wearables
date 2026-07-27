import React from 'react';
import { Activity, Moon, Sun, ShieldCheck, Cpu, Layers } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  totalDevices: number;
  filteredCount: number;
  compareCount: number;
  onOpenCompare: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  totalDevices,
  filteredCount,
  compareCount,
  onOpenCompare,
}) => {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-slate-900/80 dark:bg-slate-950/80 border-b border-slate-800 transition-colors">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Logo and title */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/20 text-white">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                Comparativa Wearables
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60 shadow-sm">
                Edición 2026
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Plataforma Biométrica de Salud y Rendimiento Deportivo
            </p>
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div className="hidden lg:flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/70 border border-slate-700/60 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span><strong className="text-white">{totalDevices}</strong> Dispositivos</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/70 border border-slate-700/60 text-slate-300">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span><strong className="text-white">{filteredCount}</strong> Filtrados</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/70 border border-slate-700/60 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Informe 2026 Auditado</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Comparison floating counter badge / button */}
          <button
            onClick={onOpenCompare}
            disabled={compareCount === 0}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              compareCount > 0
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <span>Comparar</span>
            <span
              className={`inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full ${
                compareCount > 0
                  ? 'bg-white text-slate-900'
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              {compareCount}
            </span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
