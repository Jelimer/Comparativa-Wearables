import React from 'react';
import { Activity, ShieldCheck, Heart, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                Comparativa Wearables 2026
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Plataforma independiente de análisis técnico y comparativa multidimensional de smartwatches, pulseras biométricas y anillos inteligentes. Datos extraídos de la auditoría técnica de julio de 2026.
            </p>
          </div>

          {/* Col 2: Metodología */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Metodología</h4>
            <ul className="text-xs space-y-1.5 text-slate-400">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Auditoría de senores FDA / CE</span>
              </li>
              <li className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Cálculo TCO a 36 meses</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>Validación de precisión de VFC</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Enlaces y Créditos */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Proyecto</h4>
            <ul className="text-xs space-y-1.5 text-slate-400">
              <li>Web App desarrollada con React + Vite + TS + Tailwind CSS</li>
              <li>Repositorio: GitHub Jelimer/Comparativa-Wearables</li>
              <li>Actualizado: Julio 2026</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Comparativa de Wearables. Todos los derechos reservados.</p>
          <div className="flex items-center gap-1">
            <span>Diseñado para análisis de salud con</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>en Español</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
