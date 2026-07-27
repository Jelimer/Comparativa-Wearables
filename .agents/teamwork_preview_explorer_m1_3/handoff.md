# Informe de Handoff: Análisis de Requerimiento 3 (Tooltips Educativos) y Requerimiento 4 (Filtros Multiselección)

**Agente Responsable**: `teamwork_preview_explorer_m1_3`  
**Fecha/Hora**: 2026-07-27  
**Proyecto**: Comparativa de Wearables de Salud  
**Estado**: Completado (Investigación y Diseño Técnico)

---

## 1. Observation (Observaciones Directas de la Base de Código)

A través de las herramientas de inspección del sistema (`view_file`, `list_dir`, `grep_search`), se verificó la arquitectura actual en la ruta `c:\Users\jelim\.gemini\antigravity\scratch\comparativa-wearables`:

1. **Definición de Tipos y Estado de Filtros (`src/types/wearable.ts`)**:
   - En las líneas 50-68 de `src/types/wearable.ts`, la interfaz `FilterState` está estructurada actualmente con selección individual de cadenas para las categorías principales:
     - `brand: string` (Línea 52)
     - `category: string` (Línea 53)
     - `ecosystem: string` (Línea 54)
     - `subscription: string` (Línea 55)
   - Los sensores médicos requeridos ya están modelados como un objeto booleano `requiredSensors: { ecg, spO2, edaStress, bodyComposition, bloodPressure, gps, skinTemp }` (Líneas 58-66).

2. **Lógica de Filtrado en la Aplicación (`src/App.tsx`)**:
   - En las líneas 14-32 de `src/App.tsx`, `INITIAL_FILTERS` asigna `'all'` a `brand`, `category`, `ecosystem` y `subscription`.
   - En las líneas 55-68, `activeFilterCount` suma +1 por cada filtro cuya propiedad sea distinta de `'all'`.
   - En las líneas 97-158, la función `filteredWearables` evalúa comparaciones de igualdad directa para cada filtro:
     ```typescript
     if (filters.brand !== 'all' && device.brand !== filters.brand) return false;
     if (filters.category !== 'all' && device.category !== filters.category) return false;
     if (filters.ecosystem !== 'all' && !device.ecosystem.includes(filters.ecosystem as any)) return false;
     ```

3. **Componente de Interfaz de Filtros (`src/components/FilterBar.tsx`)**:
   - En las líneas 143-206, `FilterBar.tsx` renderiza cuatro elementos HTML `<select>` estándar de opción única para Marca, Categoría de Formato, Ecosistema y Tipo de Suscripción.
   - En las líneas 267-319, existe un panel colapsable de "Filtro de Sensores Médicos Específicos" que usa componentes tipo checkbox/botón `SensorCheckbox`.
   - Actualmente **no existe un sistema unificado de Tooltips explicativos** para guiar al usuario en la terminología técnica avanzada (ECG, SpO2, HRV, cEDA, BIA, TCO/Suscripción, etc.).

4. **Términos Técnicos Identificados en los Datos (`src/data/wearables.ts` y componentes)**:
   - Se registraron los siguientes términos biológicos, sensores y métricas de mercado en los 12 dispositivos del catálogo:
     - **ECG** (Electrocardiograma / Detección de AFib aprobada por la FDA)
     - **SpO2** (Saturación de Oxígeno en Sangre / Pulsioximetría nocturna)
     - **HRV** (Variabilidad de la Frecuencia Cardíaca / Heart Rate Variability)
     - **Skin Temp** (Temperatura Cutánea / Desviación del basal nocturno)
     - **cEDA / EDA Stress** (Actividad Electrodérmica / Estrés continuo por micro-sudoración)
     - **Body Composition / BIA** (Impedancia Bioeléctrica / Grasa, músculo y masa ósea)
     - **GPS** (GPS Integrado autónomo vs GPS asistido por smartphone)
     - **Subscription** (Cobro de membresía mensual SaaS vs Modelo libre de cuotas)
     - **Battery metrics** (Autonomía continua en horas/días con/sin Always-On Display).

---

## 2. Logic Chain (Cadena Lógica de Análisis y Diseño)

### R3: Tooltips Educativos (Educational Tooltips)

1. **Necesidad del Usuario**: El usuario de wearables se enfrenta a acrónimos médicos complejos (ECG, SpO2, HRV, cEDA, BIA). Sin contextualización clínica, los filtros pierden efectividad.
2. **Estructura del Diccionario de Tooltips**:
   Se debe crear una fuente centralizada de verdad en `src/data/tooltipDictionary.ts` con definiciones claras, relevancia clínica y benchmark de valores normales.
3. **Diseño del Componente React `<Tooltip />`**:
   - Componente reutilizable con soporte responsivo: Hover en desktop, Tap/Click popover en móviles y accesibilidad por teclado (`aria-label`, `tabIndex`).
   - Icono distintivo (`HelpCircle` o `Info` de `lucide-react`) con animación sutil.
   - Posicionamiento flotante o desplegable que evita desbordamientos (*overflow*) del contenedor.

### R4: Filtros Multiselección (Multi-select Filters)

1. **Limitación Actual**: El selector `<select>` actual obliga a elegir una sola marca o categoría (ej. solo Garmin O solo Apple). Si un usuario desea comparar Garmin Y Apple o Smartwatches Y Anillos Inteligentes, la arquitectura actual no lo permite.
2. **Evolución del Esquema de Estado (`FilterState`)**:
   - Transformar los atributos escalares `brand: string`, `category: string`, etc., en arreglos de cadenas `selectedBrands: BrandType[]`, `selectedCategories: CategoryType[]`, `selectedEcosystems: EcosystemType[]`, `selectedSubscriptions: ('free' | 'subscription')[]`.
   - Un arreglo vacío `[]` representa "Todas las opciones" (sin filtro activo).
3. **Evolución de la Lógica de Filtrado (Evaluación OR dentro de categoría, AND entre categorías)**:
   - Para Marcas: `selectedBrands.length === 0 || selectedBrands.includes(device.brand)`
   - Para Categorías: `selectedCategories.length === 0 || selectedCategories.includes(device.category)`
   - Para Ecosistemas: `selectedEcosystems.length === 0 || device.ecosystem.some(e => selectedEcosystems.includes(e))`
   - Para Suscripción: `selectedSubscriptions.length === 0 || (selectedSubscriptions.includes('free') && !device.subscriptionRequired) || (selectedSubscriptions.includes('subscription') && device.subscriptionRequired)`
4. **Diseño de Interfaz de Usuario en `FilterBar.tsx`**:
   - Reemplazar los `<select>` estáticos por dos patrones UX modernos de alto rendimiento:
     - **Pill/Chip Toggles** para opciones con pocos elementos (Categorías de Formato, Ecosistema, Suscripción).
     - **Multi-select Checkbox Dropdown / Popover** con contador de ítems seleccionados para Marcas (que tiene 9+ opciones).

---

## 3. Caveats (Advertencias y Supuestos)

- **Compatibilidad con datos existentes**: Los tipos de marca (`BrandType`), categoría (`CategoryType`) y ecosistema (`EcosystemType`) definidos en `src/types/wearable.ts` no deben ser modificados en su unión de literales para mantener compatibilidad total con `WEARABLES_DATA`.
- **Efectos en la búsqueda en tiempo real**: Al cambiar a filtros basados en arreglos, la operación `includes()` y `some()` sobre arreglos pequeños de 12 elementos en memoria tiene complejidad O(N), por lo que el impacto en tiempo de ejecución es insignificante (< 1ms).
- **Experiencia Móvil para Tooltips**: En dispositivos móviles con pantallas táctiles (`touch`), el evento `onMouseEnter`/`onMouseLeave` no es fiable. El componente Tooltip debe incluir un estado interno `isOpen` activable por click/tap con un botón de cierre o evento *click outside*.

---

## 4. Conclusion (Propuesta de Implementación Detallada)

### Especificación para R3: Diccionario y Componente de Tooltips

#### A. Diccionario de Términos (`src/data/tooltipDictionary.ts`)

```typescript
export interface TooltipItem {
  id: string;
  title: string;
  category: 'sensor' | 'metrica' | 'modelo_negocio';
  shortDesc: string;
  detailedExplanation: string;
  clinicalRelevance?: string;
}

export const TOOLTIP_DICTIONARY: Record<string, TooltipItem> = {
  ecg: {
    id: 'ecg',
    title: 'Electrocardiograma (ECG)',
    category: 'sensor',
    shortDesc: 'Registro de la actividad eléctrica cardíaca en reposo.',
    detailedExplanation: 'Utiliza electrodos en el bisel o chasis para registrar el ritmo eléctrico del corazón durante 30 segundos.',
    clinicalRelevance: 'Detecta Fibrilación Auricular (AFib), una causa común de accidentes cerebrovasculares.',
  },
  spO2: {
    id: 'spO2',
    title: 'Saturación de Oxígeno (SpO2)',
    category: 'sensor',
    shortDesc: 'Porcentaje de hemoglobina oxigenada en sangre.',
    detailedExplanation: 'Sensores de luz roja e infrarroja miden la absorción de luz por los capilares sanguíneos.',
    clinicalRelevance: 'Indicador clave de apneas nocturnas y adaptación a altitudes elevadas (Normal: 95%-100%).',
  },
  hrv: {
    id: 'hrv',
    title: 'Variabilidad de Frecuencia Cardíaca (HRV)',
    category: 'metrica',
    shortDesc: 'Variación en milisegundos entre latidos cardíacos consecutivos.',
    detailedExplanation: 'Mide la flexibilidad del Sistema Nervioso Autónomo (Simpático vs Parasimpático).',
    clinicalRelevance: 'Una HRV alta indica excelente recuperación y baja fatiga física o estrés.',
  },
  skinTemp: {
    id: 'skinTemp',
    title: 'Temperatura Cutánea Nocturna',
    category: 'sensor',
    shortDesc: 'Desviación de la temperatura de la piel respecto al basal.',
    detailedExplanation: 'Monitoriza la temperatura periférica durante el sueño profundo.',
    clinicalRelevance: 'Permite anticipar infecciones, fiebre incipiente y seguimiento del ciclo menstrual.',
  },
  edaStress: {
    id: 'edaStress',
    title: 'Actividad Electrodérmica (cEDA / Estrés)',
    category: 'sensor',
    shortDesc: 'Medición de la respuesta de sudoración microscópica de la piel.',
    detailedExplanation: 'Registra cambios en la conductancia galvánica inducidos por el sistema nervioso simpático.',
    clinicalRelevance: 'Identifica eventos de estrés físico y emocional en tiempo real.',
  },
  bodyComposition: {
    id: 'bodyComposition',
    title: 'Composición Corporal (BIA)',
    category: 'sensor',
    shortDesc: 'Análisis de Impedancia Bioeléctrica desde la muñeca.',
    detailedExplanation: 'Envía microcorrientes seguras para calcular la resistencia de tejidos grasos y magros.',
    clinicalRelevance: 'Estima porcentaje de grasa corporal, masa muscular esquelética y agua corporal.',
  },
  gps: {
    id: 'gps',
    title: 'GPS Integrado / GNSS Multi-banda',
    category: 'metrica',
    shortDesc: 'Módulo de localización autónomo dentro del dispositivo.',
    detailedExplanation: 'Permite registrar rutas, ritmo y distancia al aire libre sin llevar el teléfono móvil.',
    clinicalRelevance: 'Indispensable para métricas de ritmo VO2 Max y entrenamiento exterior preciso.',
  },
  subscription: {
    id: 'subscription',
    title: 'Modelo de Suscripción (SaaS)',
    category: 'modelo_negocio',
    shortDesc: 'Pago mensual obligatorio para acceder a métricas avanzadas.',
    detailedExplanation: 'Marcas como Whoop o Oura requieren una tarifa continua ($6 a $30/mes) para desbloquear la app.',
    clinicalRelevance: 'Afecta sustancialmente el Costo Total de Propiedad (TCO) a 3 años.',
  },
  battery: {
    id: 'battery',
    title: 'Autonomía de Batería (Horas/Días)',
    category: 'metrica',
    shortDesc: 'Duración continua de carga del hardware.',
    detailedExplanation: 'Varía desde 24-48 horas en smartwatches con pantallas AMOLED hasta 30 días en pulseras/anillos.',
    clinicalRelevance: 'Crucial para evitar interrupciones en la monitorización del sueño nocturno.',
  },
};
```

#### B. Componente React reutilizable (`src/components/Tooltip.tsx`)

```tsx
import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { TOOLTIP_DICTIONARY } from '../data/tooltipDictionary';

interface TooltipProps {
  termKey: string;
  label?: string;
  iconOnly?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({ termKey, label, iconOnly = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const info = TOOLTIP_DICTIONARY[termKey];

  if (!info) return label ? <span>{label}</span> : null;

  return (
    <div className="relative inline-flex items-center gap-1 group">
      {label && <span className="text-slate-300 font-medium">{label}</span>}
      
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="text-cyan-400/80 hover:text-cyan-300 focus:outline-none transition-colors p-0.5 rounded-full hover:bg-cyan-500/10 cursor-pointer"
        aria-label={`Información sobre ${info.title}`}
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 sm:w-72 p-3.5 bg-slate-900 border border-cyan-500/40 rounded-xl shadow-2xl z-50 text-left space-y-2 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              {info.title}
            </h4>
            <button
              onClick={() => setIsOpen(false)}
              className="sm:hidden text-slate-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">{info.shortDesc}</p>
          <p className="text-[10px] text-slate-400 leading-normal">{info.detailedExplanation}</p>
          {info.clinicalRelevance && (
            <div className="pt-1 text-[10px] text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-800/40 rounded px-2 py-1">
              💡 <strong>Relevancia:</strong> {info.clinicalRelevance}
            </div>
          )}
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
};
```

---

### Especificación para R4: Esquema y Código para Filtros Multiselección

#### A. Nuevo Esquema de Tipo (`src/types/wearable.ts`)

```typescript
export interface FilterState {
  searchQuery: string;
  selectedBrands: BrandType[];          // [] = Todas
  selectedCategories: CategoryType[];    // [] = Todas
  selectedEcosystems: EcosystemType[];  // [] = Todos
  selectedSubscriptions: ('free' | 'subscription')[]; // [] = Todos los modelos
  maxPrice: number;
  minBatteryHours: number;
  requiredSensors: {
    ecg: boolean;
    spO2: boolean;
    edaStress: boolean;
    bodyComposition: boolean;
    bloodPressure: boolean;
    gps: boolean;
    skinTemp: boolean;
  };
  sortBy: 'price_asc' | 'price_desc' | 'battery_desc' | 'rating_desc' | 'name_asc';
}
```

#### B. Actualización del Estado Inicial y Contador de Filtros (`src/App.tsx`)

```typescript
// Estado Inicial en App.tsx
const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  selectedBrands: [],
  selectedCategories: [],
  selectedEcosystems: [],
  selectedSubscriptions: [],
  maxPrice: 1000,
  minBatteryHours: 0,
  requiredSensors: {
    ecg: false,
    spO2: false,
    edaStress: false,
    bodyComposition: false,
    bloodPressure: false,
    gps: false,
    skinTemp: false,
  },
  sortBy: 'rating_desc',
};

// Cálculo de activeFilterCount
const activeFilterCount = useMemo(() => {
  let count = 0;
  if (filters.searchQuery.trim() !== '') count++;
  count += filters.selectedBrands.length;
  count += filters.selectedCategories.length;
  count += filters.selectedEcosystems.length;
  count += filters.selectedSubscriptions.length;
  if (filters.maxPrice < 1000) count++;
  if (filters.minBatteryHours > 0) count++;
  Object.values(filters.requiredSensors).forEach((val) => {
    if (val) count++;
  });
  return count;
}, [filters]);
```

#### C. Lógica de Filtrado en `filteredWearables` (`src/App.tsx`)

```typescript
const filteredWearables = useMemo(() => {
  return WEARABLES_DATA.filter((device) => {
    // 1. Filtro de búsqueda por texto
    if (filters.searchQuery.trim() !== '') {
      const query = filters.searchQuery.toLowerCase();
      const matchName = device.name.toLowerCase().includes(query);
      const matchBrand = device.brand.toLowerCase().includes(query);
      const matchDesc = device.description.toLowerCase().includes(query);
      const matchPros = device.pros.some((p) => p.toLowerCase().includes(query));
      const matchCons = device.cons.some((c) => c.toLowerCase().includes(query));
      if (!matchName && !matchBrand && !matchDesc && !matchPros && !matchCons) {
        return false;
      }
    }

    // 2. Filtro Multiselección de Marcas (Lógica OR interna)
    if (filters.selectedBrands.length > 0 && !filters.selectedBrands.includes(device.brand)) {
      return false;
    }

    // 3. Filtro Multiselección de Categorías (Lógica OR interna)
    if (
      filters.selectedCategories.length > 0 &&
      !filters.selectedCategories.includes(device.category)
    ) {
      return false;
    }

    // 4. Filtro Multiselección de Ecosistemas
    if (
      filters.selectedEcosystems.length > 0 &&
      !device.ecosystem.some((eco) => filters.selectedEcosystems.includes(eco))
    ) {
      return false;
    }

    // 5. Filtro Multiselección de Suscripción
    if (filters.selectedSubscriptions.length > 0) {
      const matchesFree =
        filters.selectedSubscriptions.includes('free') && !device.subscriptionRequired;
      const matchesSub =
        filters.selectedSubscriptions.includes('subscription') && device.subscriptionRequired;
      if (!matchesFree && !matchesSub) {
        return false;
      }
    }

    // 6. Filtros continuos (Precio y Batería)
    if (device.priceUsd > filters.maxPrice) return false;
    if (device.batteryHours < filters.minBatteryHours) return false;

    // 7. Filtro de Sensores requeridos (AND estricto)
    const { ecg, spO2, edaStress, bodyComposition, bloodPressure, gps, skinTemp } =
      filters.requiredSensors;
    if (ecg && !device.sensors.ecg) return false;
    if (spO2 && !device.sensors.spO2) return false;
    if (edaStress && !device.sensors.edaStress) return false;
    if (bodyComposition && !device.sensors.bodyComposition) return false;
    if (bloodPressure && !device.sensors.bloodPressure) return false;
    if (gps && !device.sensors.gps) return false;
    if (skinTemp && !device.sensors.skinTemp) return false;

    return true;
  });
}, [filters]);
```

#### D. Modificaciones UI en `FilterBar.tsx`

Se proponen funciones auxiliares de conmutación (*toggle*):

```typescript
const toggleBrand = (brand: BrandType) => {
  setFilters((prev) => ({
    ...prev,
    selectedBrands: prev.selectedBrands.includes(brand)
      ? prev.selectedBrands.filter((b) => b !== brand)
      : [...prev.selectedBrands, brand],
  }));
};

const toggleCategory = (cat: CategoryType) => {
  setFilters((prev) => ({
    ...prev,
    selectedCategories: prev.selectedCategories.includes(cat)
      ? prev.selectedCategories.filter((c) => c !== cat)
      : [...prev.selectedCategories, cat],
  }));
};
```

Además, incorporar el componente `<Tooltip termKey="..." />` en los encabezados de cada sección de filtros en `FilterBar.tsx` (ej. junto a "Filtro de Sensores Médicos Específicos", "Tipo de Cobro / Suscripción", "Batería Mínima", etc.).

---

## 5. Verification Method (Método de Verificación Independiente)

Para verificar independientemente la validez del diseño propuesto cuando el equipo implementador aplique los cambios:

1. **Verificación de Compilación de TypeScript**:
   Ejecutar en la consola interactiva de PowerShell en la raíz del proyecto:
   ```powershell
   npm run build
   ```
   *Criterio de Éxito*: La compilación con `tsc` debe completarse con cero errores de tipo en `FilterState`, `FilterBar.tsx` y `App.tsx`.

2. **Verificación Funcional del Comportamiento Multiselección**:
   - Seleccionar "Garmin" y "Apple" simultáneamente.
   - *Resultado Esperado*: La cuadrícula debe mostrar únicamente dispositivos cuya marca sea Garmin O Apple.
   - Seleccionar las categorías "Smartwatch" y "Anillo Inteligente".
   - *Resultado Esperado*: Se muestran relogios inteligentes y anillos, excluyendo las pulseras (Bands).

3. **Verificación de Tooltips**:
   - Pasar el cursor (o pulsar) sobre el ícono de ayuda `?` en cualquier etiqueta técnica (ej. ECG, SpO2, HRV, cEDA).
   - *Resultado Esperado*: Aparece el cuadro flotante desplegable con el título, la descripción simplificada y la relevancia clínica definida en `tooltipDictionary.ts`.

4. **Condiciones de Invalidación**:
   - Si al limpiar filtros (`Limpiar filtros`) el estado de los arreglos no vuelve a `[]`, la verificación falla.
   - Si un tooltip se desborda por fuera de la pantalla en dispositivos móviles sin scroll horizontal, la verificación falla.
