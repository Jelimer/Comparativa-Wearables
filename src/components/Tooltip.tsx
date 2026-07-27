import React, { useState, useEffect, useRef } from 'react';
import { HelpCircle, X, Activity, Info } from 'lucide-react';
import { TOOLTIP_DICTIONARY } from '../data/tooltipDictionary';

interface TooltipProps {
  termKey: string;
  label?: string;
  iconOnly?: boolean;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  termKey,
  label,
  iconOnly = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const info = TOOLTIP_DICTIONARY[termKey];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard events (ESC to close)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
  };

  if (!info) {
    return label ? <span className={className}>{label}</span> : null;
  }

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center gap-1 group ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {!iconOnly && label && (
        <span className="text-slate-300 font-medium text-xs sm:text-sm">{label}</span>
      )}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-label={`Información médica y técnica sobre ${info.title}`}
        className="text-cyan-400 hover:text-cyan-300 focus:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 p-0.5 rounded-full hover:bg-cyan-500/10 transition-colors cursor-pointer inline-flex items-center justify-center"
      >
        <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </button>

      {isOpen && (
        <div
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 sm:w-80 p-4 bg-slate-900/95 backdrop-blur-md border border-cyan-500/50 rounded-2xl shadow-2xl z-50 text-left space-y-2.5 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Popover Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5">
              <Info className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold text-cyan-300 line-clamp-1">{info.title}</h4>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="text-slate-400 hover:text-white p-0.5 rounded-md hover:bg-slate-800 transition-colors"
              aria-label="Cerrar ventana de información"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Short & Detailed Descriptions */}
          <p className="text-xs font-semibold text-slate-200 leading-snug">{info.shortDesc}</p>
          <p className="text-[11px] text-slate-400 leading-relaxed">{info.detailedExplanation}</p>

          {/* Clinical Relevance Badge */}
          {info.clinicalRelevance && (
            <div className="pt-1.5 text-[11px] text-emerald-300 font-medium bg-emerald-950/50 border border-emerald-800/50 rounded-xl p-2.5 space-y-1">
              <div className="flex items-center gap-1 text-emerald-400 font-bold text-[10px] uppercase tracking-wide">
                <Activity className="w-3 h-3" />
                <span>Relevancia Clínica y de Rendimiento</span>
              </div>
              <p className="text-[10px] text-emerald-200/90 leading-tight">{info.clinicalRelevance}</p>
            </div>
          )}

          {/* Arrow Pointer */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900 pointer-events-none" />
        </div>
      )}
    </div>
  );
};
