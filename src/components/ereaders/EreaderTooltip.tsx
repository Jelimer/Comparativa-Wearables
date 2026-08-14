import React, { useState, useEffect, useRef } from 'react';
import { HelpCircle, X, BookOpen } from 'lucide-react';
import { EREADER_TOOLTIP_DICTIONARY } from '../../data/ereaderTooltipDictionary';

interface EreaderTooltipProps {
  termKey: string;
  label?: string;
  iconOnly?: boolean;
  className?: string;
}

export const EreaderTooltip: React.FC<EreaderTooltipProps> = ({
  termKey,
  label,
  iconOnly = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const info = EREADER_TOOLTIP_DICTIONARY[termKey];

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
        aria-label={`Información técnica sobre ${info.term}`}
        className="text-amber-400 hover:text-amber-300 focus:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 p-0.5 rounded-full hover:bg-amber-500/10 transition-colors cursor-pointer inline-flex items-center justify-center"
      >
        <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </button>

      {isOpen && (
        <div
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 sm:w-80 p-4 bg-slate-900/95 backdrop-blur-md border border-amber-500/50 rounded-2xl shadow-2xl z-50 text-left space-y-2.5 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold text-amber-300 line-clamp-1">{info.term}</h4>
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

          <p className="text-xs font-semibold text-slate-200 leading-snug">{info.shortDescription}</p>
          <p className="text-[11px] text-slate-400 leading-relaxed">{info.detailedExplanation}</p>

          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900 pointer-events-none" />
        </div>
      )}
    </div>
  );
};
