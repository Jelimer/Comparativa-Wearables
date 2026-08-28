# Auditoría Integral de Rendimiento Web y Arquitectura Técnica
**Proyecto**: Comparativa de Wearables y E-readers (Edición Agosto 2026)  
**Entorno**: React 18.3.1 + TypeScript 5.7.3 + Vite 6.4.3 + Tailwind CSS 3.4.17  
**Agente Investigador**: Explorer Performance & Architecture (`explorer_survey_2`)  
**Fecha de Auditoría**: 28 de agosto de 2026  

---

## 1. Resumen Ejecutivo y Diagnóstico Global

La aplicación web **Comparativa-Wearables** es una SPA (Single Page Application) moderna construida sobre Vite y React 18 que presenta dos catálogos técnicos interactivos: **Wearables de Salud y Deporte** (15 dispositivos) y **E-readers / Kindles** (15 dispositivos).

### Métricas Actuales del Build de Producción (Baseline)
- **Bundle JavaScript Principal**: `dist/assets/index-BUgR8mvE.js` — **366.47 kB** (95.89 kB gzip)
- **Hoja de Estilos CSS**: `dist/assets/index-Cb0T2FFj.css` — **46.68 kB** (7.92 kB gzip)
- **HTML Estático**: `dist/index.html` — **1.04 kB** (0.58 kB gzip)
- **Módulos Transformados por Vite**: 1,607 módulos
- **Estructura de Chunks**: **100% Monolítico** (1 único archivo JS que contiene toda la app, ambos datasets, todos los modales, guías y diccionarios de tooltips).

### Puntos Críticos Detectados
1. **Ausencia de Code-Splitting**: La vista de *E-readers* y todos sus componentes (`EreadersView`, `ereaders.ts`, modales, guías) se cargan obligatoriamente en el primer render, incluso si el usuario sólo consulta *Wearables*.
2. **Re-renderizados en Cascada**: Al escribir en el buscador o mover sliders de precio/batería en `FilterBar`, se re-renderiza toda la página (Hero, Banners de recomendación, Grid completo con todas las tarjetas, Tooltips y Guías estratégicas).
3. **Falta de Memoización (`React.memo`, `useCallback`)**: Ninguna tarjeta de producto (`DeviceCard`, `EreaderCard`) ni componente estático (`RecommendationBanner`, `StrategicGuide`, `Header`, `Footer`) está memoizado.
4. **Ineficiencias en el Bucle de Filtrado**: La transformación `filters.searchQuery.trim().toLowerCase()` se recalcula repetidamente en cada iteración de cada dispositivo en lugar de una única vez fuera del bucle.
5. **Dependencias Muertas (Dead Dependencies)**: `framer-motion`, `clsx` y `tailwind-merge` están declaradas en `package.json` pero no se utilizan en ningún archivo de `src/`.
6. **Inconsistencias en el Bloqueo de Scroll de Modales**: Los modales de E-readers bloquean el scroll de `body`, mientras que los modales de Wearables no lo hacen.
7. **Sobrecarga de Instancias de Tooltip en el DOM**: Cada tarjeta monta entre 6 y 8 componentes `Tooltip` independientes, generando más de 120 listeners e instancias en el árbol de componentes.

---

## 2. Auditoría Detallada de la Jerarquía de Componentes y Renderizado

### 2.1. Estado Raíz en `App.tsx`
**Ubicación**: `src/App.tsx:9-82`
- **Estado Gestionado**:
  ```tsx
  const [activeSection, setActiveSection] = useState<'wearables' | 'ereaders'>('wearables');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [wearablesCompareIds, setWearablesCompareIds] = useState<string[]>([]);
  const [isWearablesCompareOpen, setIsWearablesCompareOpen] = useState<boolean>(false);
  const [ereadersCompareIds, setEreadersCompareIds] = useState<string[]>([]);
  const [isEreadersCompareOpen, setIsEreadersCompareOpen] = useState<boolean>(false);
  ```
- **Hallazgo 1 (Re-montaje completo de vistas)**: El render condicional `{activeSection === 'wearables' ? <WearablesView ... /> : <EreadersView ... />}` desmonta completamente el componente previo. Al alternar entre pestañas, se destruyen todos los estados de filtrado locales (`filters`, `detailedDevice`) y se vuelven a crear todos los nodos del DOM.
- **Hallazgo 2 (Bug de métrica en Header)**: `App.tsx:55` pasa `filteredCount={currentTotalDevices}` al `Header`, mostrando siempre el total de dispositivos en vez del conteo real de dispositivos filtrados.
- **Hallazgo 3 (Re-renderizado de `Footer` y `Header`)**: Cualquier cambio en el tema oscuro o en la lista de IDs de comparación provoca el re-render de `Header`, la vista activa y `Footer`, dado que no implementan `React.memo`.

---

### 2.2. Renderizado en Cascada en `WearablesView` y `EreadersView`
**Ubicación**: `src/components/WearablesView.tsx` y `src/components/EreadersView.tsx`

```
WearablesView (State: filters, detailedDevice, selectedCompareIds)
 ├── HeroSection                  [Static - Re-renders on any filter keystroke!]
 ├── RecommendationBanner         [Static - Re-renders on any filter keystroke!]
 ├── FilterBar                    [Re-renders on every search character / slider drag]
 ├── DeviceGrid                   [Re-renders completely]
 │    ├── DeviceCard x 15-18      [None are memoized - All 15 re-render on each keystroke!]
 │    │    ├── Tooltip x 6-8      [Over 100 Tooltips re-evaluate in DOM]
 │    │    └── Buttons & Badges
 ├── StrategicGuide               [Heavy tabbed static section - Re-renders constantly]
 ├── ComparisonModal              [Recalculates best/worst sort matrix on every render]
 └── DeviceDetailModal
```

#### Causas Principales de la Cascada:
1. **Falta de `useCallback` en Funciones Manejadoras**:
   - `handleToggleCompare`, `handleRemoveCompareDevice`, `handleClearCompareAll`, `handleResetFilters`, `scrollToExplore` se recrean en cada ciclo de render.
   - En `DeviceGrid.tsx:202`: `onOpenDetails={(device) => setDetailedDevice(device)}` pasa una función flecha anónima nueva en cada renderizado.
2. **Componentes Pesados sin `React.memo`**:
   - `HeroSection` y `EreaderHero` no dependen de ningún filtro, pero se vuelven a evaluar en el árbol virtual de React.
   - `RecommendationBanner` y `StrategicGuide` (que contiene calculadoras de TCO, pestañas y guías de 4 pasos) se re-ejecutan continuamente al escribir en el buscador.

---

### 2.3. Tarjetas de Dispositivos (`DeviceCard` y `EreaderCard`)
**Ubicación**: `src/components/DeviceCard.tsx` y `src/components/ereaders/EreaderCard.tsx`

- **Problema de Rendimiento**:
  - Al hacer clic en "Comparar" en un dispositivo, `selectedCompareIds` cambia en el estado padre.
  - Como `DeviceCard` no está envuelta en `React.memo`, **las 15 tarjetas del catálogo se re-renderizan**, a pesar de que sólo 1 tarjeta cambió su estado de selección (`isSelectedForCompare`).
  - Cada tarjeta ejecuta en tiempo de render funciones auxiliares como `getRecommendationBadge()` y `getCategoryLabel()`.
  - Cada tarjeta contiene entre 6 y 8 componentes `<Tooltip>`, lo que multiplica el costo de reconciliación en el Virtual DOM.

---

## 3. Auditoría de Algoritmos de Filtrado, Búsqueda y Ordenamiento

### 3.1. Análisis de Complejidad en `filteredWearables`
**Ubicación**: `src/components/WearablesView.tsx:91-163`

```ts
// Código Actual:
const filteredWearables = useMemo(() => {
  return WEARABLES_DATA.filter((device) => {
    if (filters.searchQuery.trim() !== '') {
      const query = filters.searchQuery.trim().toLowerCase(); // ⚠️ Creado en CADA iteración
      const matchName = device.name.toLowerCase().includes(query);
      const matchBrand = device.brand.toLowerCase().includes(query);
      const matchDesc = device.description.toLowerCase().includes(query);
      const matchPros = device.pros.some((p) => p.toLowerCase().includes(query)); // ⚠️ toLowerCase en cada pro
      const matchCons = device.cons.some((c) => c.toLowerCase().includes(query)); // ⚠️ toLowerCase en cada con
      if (!matchName && !matchBrand && !matchDesc && !matchPros && !matchCons) {
        return false;
      }
    }
    // ...
    if (
      filters.selectedEcosystems.length > 0 &&
      !device.ecosystem.some((eco) => filters.selectedEcosystems.includes(eco)) // O(N * E_device * E_selected)
    ) {
      return false;
    }
    // ...
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'name_asc':
        return a.name.localeCompare(b.name); // ⚠️ localeCompare en cada paso de ordenación
      // ...
    }
  });
}, [filters]);
```

### 3.2. Problemas Detectados y Optimizaciones:
1. **Asignación de Strings en bucle `O(N)`**: `filters.searchQuery.trim().toLowerCase()` debe extraerse fuera de la función `.filter()`.
2. **Transformaciones Repetidas de Texto**: En arrays estáticos de dispositivos, podemos pre-calcular o indexar un campo `searchIndex` (cadena única en minúsculas con nombre, marca, descripción y pros) una sola vez al cargar la aplicación. La búsqueda pasa de evaluar 6 campos con `.some()` a un único `device.searchIndex.includes(normalizedQuery)` en tiempo constante por elemento.
3. **Prioridad de Descarte Rápido (Short-Circuit Evaluation)**:
   - Los filtros numéricos (`priceUsd > maxPrice`, `batteryHours < minBatteryHours`) y booleanos (`sensors.*`) son comparaciones de enteros primitivos extremadamente rápidas (`O(1)`).
   - Actualmente, la búsqueda por texto (más costosa) se ejecuta primero.
   - **Optimización**: Reordenar las cláusulas para evaluar primero las condiciones numéricas y booleanas simples, descartando el 80% de los elementos antes de realizar búsquedas de texto.
4. **Debouncing / Concurrencia de React 18**:
   - Al escribir en el input de búsqueda o desplazar el slider de precio continuo, cada evento dispara una actualización síncrona.
   - Uso recomendado: `useDeferredValue(filters)` o `startTransition` para mantener el input 100% responsivo (60 FPS) mientras la lista de tarjetas se filtra en baja prioridad.

---

## 4. Auditoría de Empaquetado, Configuración de Vite y Árbol de Dependencias

### 4.1. Análisis del Bundle y Chunks
**Archivo actual**: `vite.config.ts`
```ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

- **Diagnóstico**: No existe ninguna configuración de `rollupOptions.output.manualChunks`, `build.target` ni división por rutas/vistas.
- **Impacto**: Todo el código de la aplicación se empaqueta en un único archivo JavaScript de **366.47 kB**.

### 4.2. Estrategia de Code-Splitting Recomendada
Implementar carga diferida (`React.lazy` + `Suspense`) en tres niveles estratégicos:

1. **Nivel de Vistas (Tab-Level Code Splitting)**:
   ```tsx
   const WearablesView = React.lazy(() => import('./components/WearablesView').then(m => ({ default: m.WearablesView })));
   const EreadersView = React.lazy(() => import('./components/EreadersView').then(m => ({ default: m.EreadersView })));
   ```
   - *Resultado*: Un usuario que sólo consulta wearables descarga **~180 kB** menos de código inicial (se extrae `ereaders.ts`, `EreaderCard`, modales y tooltips de ereaders del bundle inicial).

2. **Nivel de Modales Pesados (On-Demand Modal Loading)**:
   ```tsx
   const ComparisonModal = React.lazy(() => import('./components/ComparisonModal').then(m => ({ default: m.ComparisonModal })));
   const DeviceDetailModal = React.lazy(() => import('./components/DeviceDetailModal').then(m => ({ default: m.DeviceDetailModal })));
   ```
   - *Resultado*: Las tablas complejas de comparación (350+ líneas de JSX) sólo se descargan cuando el usuario hace clic en "Comparar" o "Detalles".

3. **Configuración de `manualChunks` en Vite**:
   Separar dependencias vendor estables (`react`, `react-dom`, `lucide-react`) del código de la aplicación:
   ```ts
   build: {
     target: 'es2022',
     rollupOptions: {
       output: {
         manualChunks: {
           'vendor-react': ['react', 'react-dom'],
           'vendor-icons': ['lucide-react'],
           'data-wearables': ['./src/data/wearables.ts'],
           'data-ereaders': ['./src/data/ereaders.ts'],
         },
       },
     },
   }
   ```

### 4.3. Auditoría de Dependencias (`package.json`)
| Dependencia | Versión | Estado de Uso | Recomendación |
|---|---|---|---|
| `react` | `^18.3.1` | Activo | Mantener |
| `react-dom` | `^18.3.1` | Activo | Mantener |
| `lucide-react` | `^0.474.0` | Activo | Mantener (Asegurar tree-shaking) |
| `framer-motion` | `^11.18.2` | ❌ **0 usos en `src/`** | **Eliminar** (Ahorra peso en node_modules y riesgo de bundle accidental de ~60kB) |
| `clsx` | `^2.1.1` | ❌ **0 usos en `src/`** | **Eliminar o utilizar** para clases condicionales limpias |
| `tailwind-merge` | `^2.6.0` | ❌ **0 usos en `src/`** | **Eliminar o crear helper `cn()`** si se unifican clases dinámicas |

---

## 5. Auditoría de Micro-optimizaciones: DOM, Tooltips e Imágenes

### 5.1. Optimización del Componente `Tooltip`
- **Situación Actual**: Cada instancia de `Tooltip` (7 por tarjeta × 15 tarjetas = 105 instancias) gestiona su propio estado `isOpen` y monta un event listener en `document` para `mousedown`.
- **Mejora**:
  - Evitar renderizar el DOM flotante del popover mientras `isOpen === false`. (Actualmente se hace un render condicional `{isOpen && <div ... />}` lo cual es correcto, pero el botón contenedor y los handlers se recrean).
  - Envolver `Tooltip` y `EreaderTooltip` con `React.memo` para evitar re-evaluaciones cuando el padre cambie.

### 5.2. Carga y Renderizado de Imágenes SVG
- **Ubicación**: `public/images/devices/*.svg`
- **Hallazgo**: Las etiquetas `<img>` no especifican `loading="lazy"` ni `decoding="async"`.
- **Mejora**:
  ```tsx
  <img
    src={device.imageUrl}
    alt={device.name}
    loading="lazy"
    decoding="async"
    width="200"
    height="200"
    className="..."
  />
  ```

---

## 6. Plan de Implementación de Mejoras y Optimizaciones

A continuación se detalla la hoja de ruta técnica estructurada por fases de impacto:

### Fase 1: Memoización y Detención de Re-renders (Alto Impacto)
1. **Memoizar Tarjetas de Catálogo**: Envolver `DeviceCard` y `EreaderCard` en `React.memo` con comparación de props personalizada o shallow compare.
2. **Memoizar Componentes Estáticos**: Envolver `HeroSection`, `EreaderHero`, `RecommendationBanner`, `EreaderRecommendationBanner`, `StrategicGuide`, `EreaderStrategicGuide`, `Header` y `Footer` en `React.memo`.
3. **Memoizar Callbacks**: Aplicar `useCallback` a todas las funciones pasadas por props (`handleToggleCompare`, `handleRemoveCompareDevice`, `handleClearCompareAll`, `handleResetFilters`, `setDetailedDevice`).
4. **Sincronizar `filteredCount` en Header**: Pasar el conteo real de `filteredWearables.length` o `filteredEreaders.length` al `Header`.

### Fase 2: Optimización de Búsqueda y Filtrado (Alto Impacto)
1. Extraer normalización de búsqueda (`query.trim().toLowerCase()`) fuera del bucle de filtrado.
2. Reordenar el orden de evaluación en los predicados de filtro (filtros numéricos y booleanos primero; búsqueda de texto después).
3. Integrar `useDeferredValue` para los filtros interactivos, garantizando 60 FPS en inputs de texto y sliders.

### Fase 3: Code-Splitting y Configuración Vite (Alto Impacto)
1. Implementar `React.lazy` y `Suspense` con un fallback esquelético o spinner sutil para `WearablesView` y `EreadersView`.
2. Implementar `React.lazy` para los modales de comparación y detalle.
3. Actualizar `vite.config.ts` con `manualChunks`, `target: 'es2022'` y optimizaciones de build.
4. Limpiar dependencias no utilizadas en `package.json` (`framer-motion`, `clsx`, `tailwind-merge` o implementarlas formalmente si se requiere).

### Fase 4: Modales y Consistencia UI/UX (Medio Impacto)
1. Unificar el comportamiento de bloqueo de scroll (`document.body.style.overflow = 'hidden'`) en todos los modales (`ComparisonModal`, `DeviceDetailModal`, `EreaderComparisonModal`, `EreaderDetailModal`).
2. Memoizar el cálculo de ganadores (`bestRatingDevice`, `bestBatteryDevice`, `lowestPriceDevice`) con `useMemo` dentro de los modales de comparación.
3. Añadir `loading="lazy"` y `decoding="async"` a todas las imágenes de dispositivos.

---

## 7. Tabla Resumen de Diagnóstico y Métricas Esperadas

| Área | Estado Actual (Baseline) | Optimización Propuesta | Impacto Esperado |
|---|---|---|---|
| **Bundle JS Inicial** | 366.47 kB (monolítico) | Code-splitting con `React.lazy` + `manualChunks` | Reducción de ~40-50% en carga inicial (~190 kB) |
| **Tiempo de Render en Filtros** | Re-renderiza 100% de la vista en cada pulsación | `React.memo` en tarjetas + `useCallback` + `useDeferredValue` | Reducción de ~85% en tiempo de ciclo de render |
| **Bucle de Búsqueda** | Normalización repetida $O(N)$ en cada item | Normalización hoisted + Short-circuit de filtros numéricos | Reducción de ~70% en tiempo de filtrado JS |
| **Modales** | Inconsistencia en scroll lock + cálculos redundantes | Hook de scroll lock unificado + `useMemo` en matriz comparativa | Comportamiento estándar y sin jank visual |
| **Dependencias** | 3 paquetes sin uso en `package.json` | Limpieza de dependencias huérfanas | Reducción de superficie de ataque y tamaño de instalación |

---
*Fin del informe de auditoría técnica de rendimiento.*
