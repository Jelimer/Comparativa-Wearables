# Auditoría y Evaluación Integral de UI/UX, Sistema de Diseño y Comportamiento Responsivo

**Fecha de Auditoría:** Agosto 2026  
**Proyecto:** Comparativa de Wearables de Salud y E-readers / Kindles  
**Agente Investigador:** Explorer (UI/UX & Design Systems)  
**Objetivo:** Diagnosticar la experiencia visual, consistencia del sistema de diseño, accesibilidad, microinteracciones, adaptabilidad responsiva y coherencia entre vistas (Wearables vs E-readers) para fundamentar las optimizaciones de la plataforma web.

---

## 1. Resumen Ejecutivo

La aplicación web presenta una arquitectura moderna basada en **React 18 + TypeScript + Vite + TailwindCSS**, con soporte para dos grandes universos tecnológicos: **Wearables de Salud & Rendimiento** y **E-readers / Kindles**. La dirección de arte digital es atractiva, con gradientes sutiles, efectos de resplandor ambiental (*glow effects*) y una paleta bien diferenciada entre sectores (cian/azul tecnológico para wearables y ámbar/esmeralda para tinta electrónica).

Sin embargo, la auditoría forense de UI/UX ha revelado deficiencias de diseño, accesibilidad, responsividad y consistencia que degradan la experiencia de usuario prémium:

1. **Modo Claro (Light Mode) Inoperativo/Roto:** Aunque existe un botón conmutador de modo claro/oscuro en la cabecera que añade la clase `.light`, casi la totalidad de los componentes (`App.tsx`, `Header.tsx`, `FilterBar.tsx`, `DeviceCard.tsx`, modales, etc.) tienen clases fijas oscuras (`bg-slate-950`, `bg-slate-900`, `text-slate-300`, `border-slate-800`), provocando que la interfaz continúe viéndose oscura o con fallos de contraste severos.
2. **Desbordamiento de Tooltips en Pantallas Móviles:** Los tooltips flotantes (`Tooltip.tsx` y `EreaderTooltip.tsx`) utilizan posicionamiento estático absoluto (`w-72 sm:w-80`, `left-1/2 -translate-x-1/2 bottom-full`), lo que provoca que se desborden de los límites de la pantalla en dispositivos móviles y columnas laterales, o queden recortados dentro de contenedores con scroll.
3. **Pérdida de Contexto en Comparativa Móvil:** En los modales de comparativa (`ComparisonModal.tsx` y `EreaderComparisonModal.tsx`), al desplazar horizontalmente la tabla en móvil para ver 3 o 4 dispositivos, la primera columna de características (`Característica`) no está fija (`sticky left-0`), perdiéndose de vista los nombres de las métricas.
4. **Saturación Visual en Tarjetas de Dispositivos:** `DeviceCard.tsx` incrusta hasta 8 botones de tooltips individuales dentro de la tarjeta, saturando visualmente el componente y generando riesgo de toques accidentales en pantallas táctiles.
5. **Inconsistencias Funcionales entre Modales:** `EreaderComparisonModal` y `EreaderDetailModal` bloquean el scroll del fondo (`body.style.overflow = 'hidden'`) y escuchan la tecla `Escape`, mientras que los modales de `Wearables` carecen de estas características. Además, ningún modal admite cierre mediante clic en el fondo oscurecido (*backdrop click*).
6. **Discrepancia en Grids Ultrawide:** `DeviceGrid.tsx` aprovecha monitores ultra panorámicos con `2xl:grid-cols-5 3xl:grid-cols-6`, mientras que `EreaderGrid.tsx` solo llega a `xl:grid-cols-4`, desbalanceando la vista.
7. **Textos y Contadores Hardcodeados Desincronizados:** Múltiples componentes muestran cifras desfasadas (por ejemplo, el header indica 15 wearables cuando el dataset contiene 21, y menciona fechas de "julio 2026" en lugar de "agosto 2026").

---

## 2. Diagnóstico Detallado por Dimensión

### 2.1. Sistema de Diseño, Tokens y Modo Claro/Oscuro

#### Diagnóstico
* En `tailwind.config.js`, la configuración es mínima:
  ```javascript
  darkMode: 'class',
  theme: {
    extend: {
      screens: { '3xl': '1920px' },
      colors: {
        brand: {
          50: '#f0f9ff', 100: '#e0f2fe', 500: '#0284c7', 600: '#0284c7', 700: '#0369a1'
        }
      }
    }
  }
  ```
  No se han definido tokens semánticos (superficies primarias/secundarias, bordes, estados de interacción, texto contrastado).
* En `App.tsx` (línea 47):
  ```tsx
  <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
  ```
  El contenedor principal fuerza el fondo `bg-slate-950` y texto `text-slate-100` sin prefijos `dark:`. Al alternar a `.light`, `document.documentElement` recibe la clase `light`, pero el `div` principal y todos sus hijos siguen renderizando estilos oscuros.
* En `src/index.css`, existen estilos para `.light body { background-color: #f8fafc; color: #0f172a; }`, pero quedan totalmente anulados por los estilos de Tailwind aplicados a nivel de componente.

#### Impacto UI/UX
* El interruptor de modo oscuro/claro no funciona correctamente, ofreciendo una experiencia rota a usuarios que prefieren el modo claro en entornos de alta luminosidad.

---

### 2.2. Jerarquía Visual, Tipografía y Estética Prémium

#### Diagnóstico
* **Paleta Temática Dual:**
  * *Wearables:* Gradientes cian/azul (`from-cyan-500 to-blue-600`), acentos esmeralda para autonomía y ámbar para suscripciones. Transmite precisión biométrica y alta tecnología.
  * *E-readers:* Gradientes ámbar/oro (`from-amber-500 to-yellow-500`), acentos púrpura para color e índigo para ecosistemas. Transmite calidez de lectura y tinta electrónica.
* **Tipografía:** Utiliza la familia tipográfica `Inter` (cargada en `index.html`) con pesos del 300 al 800. Los títulos `font-black` y `font-extrabold` tienen buen impacto. Sin embargo, en algunas zonas (como en `DeviceCard.tsx`) coexisten 6 tamaños distintos de texto (`text-[10px]`, `text-[11px]`, `text-xs`, `text-sm`, `text-base`, `text-lg`), lo que genera una jerarquía tipográfica algo fragmentada.
* **Clases CSS Inválidas:**
  * En `Header.tsx` (L71 y L86) y en `DeviceCard.tsx` (L222) se utiliza `py-0.2`, la cual no es una clase estándar de TailwindCSS y es ignorada por el compilador, provocando que los badges queden con padding vertical descompensado. Debe corregirse a `py-0.5` o `py-[2px]`.

---

### 2.3. Microinteracciones, Estados Hover, Active y Transiciones

#### Diagnóstico
* **Navegación de Pestañas (Header):**
  * La conmutación entre *Wearables* y *E-readers / Kindles* cambia el estado de forma inmediata, pero carece de un indicador animado deslizante (usando `framer-motion` o transiciones de transformación), lo que hace que el cambio sea visualmente abrupto.
* **Tarjetas de Producto:**
  * Estados hover: `hover:scale-105` en la imagen del dispositivo y `hover:shadow-2xl hover:shadow-cyan-500/10` en la tarjeta. Son transiciones fluidas de 300ms bien ejecutadas.
  * Estado de selección para comparar: Añade un anillo de color brillante (`ring-2 ring-cyan-500/40` o `ring-2 ring-amber-500/40`), comunicando con claridad que el producto está listo para la matriz.
  * Estados de botones: El botón "Comparar" se convierte en "Añadido" con icono de confirmación (`Check`).
* **Filtros e Inputs:**
  * Los chips de categorías y marcas tienen un excelente feedback de clic (`cursor-pointer`, cambio de borde y fondo).
  * Los sliders de rango nativos (`input[type=range]`) usan `accent-cyan-500` / `accent-amber-500`, pero carecen de una barra de progreso que se llene dinámicamente según el valor seleccionado, lo que resta refinamiento visual.
  * Los botones de acción carecen de estados `focus-visible:ring-2` para navegación mediante teclado (accesibilidad WCAG 2.1).

---

### 2.4. Comportamiento Responsivo (Mobile, Tablet, Desktop, Ultrawide)

#### Diagnóstico
* **Móvil (<640px):**
  * *Header:* Se envuelve en múltiples líneas en pantallas pequeñas (<380px), ocupando más de 120px de alto. Los elementos de navegación y acciones deberían compactarse en una barra superior optimizada.
  * *Grid de dispositivos:* Pasa correctamente a 1 columna (`grid-cols-1`).
  * *Filtros:* Se apilan correctamente en una columna. Sin embargo, la barra de filtros ocupa bastante espacio vertical, por lo que un botón colapsable ("Ver Filtros") en móvil mejoraría el ratio de contenido visible.
* **Tablet (640px - 1024px):**
  * Las tarjetas se distribuyen en 2 columnas (`sm:grid-cols-2`). Los modales de detalle ocupan el 90% del ancho con lectura cómoda.
* **Desktop (1024px - 1536px):**
  * Distribución en 3 y 4 columnas (`lg:grid-cols-3 xl:grid-cols-4`). Los filtros de marcas, categorías y sliders se organizan en 4 columnas sin apiñamiento.
* **Ultrawide (>1536px / 1920px):**
  * *Wearables Grid:* Utiliza `2xl:grid-cols-5 3xl:grid-cols-6` dentro de `max-w-[1920px]`, aprovechando el ancho de pantallas 1440p, 4K y monitores 21:9.
  * *E-readers Grid:* Se queda en `xl:grid-cols-4`, provocando que en monitores ultrapanorámicos las tarjetas de e-readers se estiren horizontalmente de manera desproporcionada.

---

### 2.5. Componentes de Tooltip, Popovers y Diccionario Contextual

#### Diagnóstico
* **Posicionamiento Fijo Peligroso:**
  * En `Tooltip.tsx` (L79) y `EreaderTooltip.tsx` (L77):
    ```tsx
    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 sm:w-80 p-4 bg-slate-900/95 backdrop-blur-md border border-cyan-500/50 rounded-2xl shadow-2xl z-50 text-left space-y-2.5 animate-in fade-in zoom-in-95 duration-150"
    ```
  * Un ancho fijo de 288px a 320px centrado horizontalmente (`left-1/2 -translate-x-1/2`) produce desbordamientos fuera de la pantalla cuando el icono de tooltip está cerca del borde izquierdo o derecho de la ventana.
  * En modales con scroll (`overflow-y-auto`), el tooltip superior puede quedar cortado por el margen superior del modal.
* **Sobrecarga de Disparadores en Tarjeta:**
  * Cada `DeviceCard` incluye tooltips en batería, suscripción, ECG, SpO2, cEDA, BIA y GPS. En dispositivos táctiles, tocar la tarjeta a menudo activa involuntariamente el popover del tooltip en lugar de abrir el detalle o seleccionar el producto.
* **Duplicación de Código:**
  * Existen dos componentes casi gemelos (`Tooltip.tsx` y `EreaderTooltip.tsx`) y dos diccionarios separados (`tooltipDictionary.ts` y `ereaderTooltipDictionary.ts`), lo que duplica la lógica de eventos y dificulta el mantenimiento unificado.

---

### 2.6. Modales de Comparativa y Detalle

#### Diagnóstico
* **Comparativa Lado a Lado (`ComparisonModal.tsx` y `EreaderComparisonModal.tsx`):**
  * En móvil y tablet, la tabla requiere scroll horizontal (`min-w-[600px]`).
  * **Problema:** La cabecera y celdas de la primera columna (`Característica` / `Dispositivo`) se desplazan junto con el resto de la tabla, perdiendo la referencia de qué fila se está leyendo.
  * **Solución requerida:** Aplicar `sticky left-0 bg-slate-900 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.5)]` a la primera columna.
  * **Asimetría:** `ComparisonModal.tsx` (Wearables) incluye un bloque resumen de 3 ganadores ("Mejor Valoración", "Mayor Autonomía", "Precio Más Económico") y tooltips en cada fila; `EreaderComparisonModal.tsx` carece de estas dos características clave.
* **Modales de Detalle (`DeviceDetailModal.tsx` y `EreaderDetailModal.tsx`):**
  * Diseño limpio con imagen destacada, precio, rating, ficha de sensores/especificaciones y lista de pros y contras.
  * Falta unificar el comportamiento de accesibilidad: bloqueo del scroll del documento (`document.body.style.overflow = 'hidden'`), soporte de tecla `Escape` y cierre al pulsar fuera de la caja modal (*backdrop click*).

---

### 2.7. Filtros, Búsqueda y Controles Interactivos

#### Diagnóstico
* **Búsqueda en Tiempo Real:**
  * Búsqueda ágil y reactiva con botón de borrado inmediato (`X`).
  * En `EreadersView.tsx`, la búsqueda incluye formatos soportados (`EPUB`, `PDF`, etc.), nombre y pros/contras.
* **Dropdown Multiselección de Marcas (`FilterBar.tsx`):**
  * Cuenta con botón "Borrar", lista con checks y cierre por clic exterior.
  * Podría enriquecerse con un contador de resultados por marca y animación fluida al abrir.
* **Filtros Avanzados Colapsables:**
  * `FilterBar.tsx` permite desplegar sensores médicos específicos; `EreaderFilterBar.tsx` permite desplegar características clave (Color, Botones, Stylus, Luz Cálida, IPX8, Android).
  * La interacción es clara y el badge superior indica el número total de filtros activos con opción de reset rápido (`Limpiar filtros`).

---

### 2.8. Consistencia Editorial, Fechas y Textos Hardcodeados

#### Diagnóstico de Discrepancias
| Componente | Línea | Texto Actual | Corrección Requerida |
|---|---|---|---|
| `Header.tsx` | L72 | `15` (Badge Wearables) | `{totalWearables}` (Dinámico: 21) |
| `Header.tsx` | L87 | `18` (Badge E-readers) | `{totalEreaders}` (Dinámico: 18) |
| `HeroSection.tsx` | L20 | `Julio 2026` | `Agosto 2026` |
| `HeroSection.tsx` | L30 | `15 dispositivos biométricos` | `{WEARABLES_DATA.length} dispositivos biométricos` |
| `EreaderHero.tsx` | L30 | `15 lectores de libros electrónicos` | `{EREADERS_DATA.length} lectores de libros electrónicos` |
| `Footer.tsx` | L16 | `Comparativa Wearables 2026` | `Comparativa Tech 2026 (Wearables & E-readers)` |
| `Footer.tsx` | L20 | `julio de 2026` | `agosto de 2026` |
| `Footer.tsx` | L30 | `senores FDA / CE` (typo) | `sensores FDA / CE` |
| `Footer.tsx` | L49 | `Julio 2026` | `Agosto 2026` |
| `StrategicGuide.tsx` | L32-35 | Hardcoded solo `whoop-4` y `oura-ring-4` | Soporte para `whoop-5-0`, `whoop-mg`, `oura-ring-5`, `signal-ring`, etc. |

---

## 3. Matriz de Hallazgos y Priorización

| ID | Hallazgo / Problema | Severidad | Categoría | Archivos Afectados |
|---|---|---|---|---|
| **H1** | Modo Claro (Light Mode) roto o con contrastes oscuros forzados | **Alta** | Sistema de Diseño / Color | `App.tsx`, `src/index.css`, `Header.tsx`, `FilterBar.tsx`, `DeviceCard.tsx`, modales |
| **H2** | Tooltips fijos se desbordan de la pantalla en móviles y bordes | **Alta** | UX / Responsividad | `Tooltip.tsx`, `EreaderTooltip.tsx`, `DeviceCard.tsx` |
| **H3** | Falta de columna fija (`sticky left-0`) en modales de comparativa | **Alta** | UX / Tablas Comparativas | `ComparisonModal.tsx`, `EreaderComparisonModal.tsx` |
| **H4** | Modales de Wearables sin bloqueo de scroll de body ni tecla `Escape` | **Media** | Accesibilidad / UX | `ComparisonModal.tsx`, `DeviceDetailModal.tsx` |
| **H5** | Modales sin cierre por clic en el fondo oscurecido (*backdrop click*) | **Media** | Usabilidad | Todos los modales |
| **H6** | Grid de E-readers sin adaptación a resoluciones ultrawide (2xl/3xl) | **Media** | Layout Responsivo | `EreaderGrid.tsx` |
| **H7** | Clases CSS no estándar (`py-0.2`) en badges de Header y tarjetas | **Baja** | Calidad CSS | `Header.tsx`, `DeviceCard.tsx` |
| **H8** | Asimetría de funciones en modales de comparativa (falta ganadores y tooltips en E-readers) | **Media** | Consistencia de Funciones | `EreaderComparisonModal.tsx` |
| **H9** | Textos, fechas y contadores numéricos hardcodeados o con erratas | **Media** | Calidad Editorial | `Header.tsx`, `HeroSection.tsx`, `EreaderHero.tsx`, `Footer.tsx`, `StrategicGuide.tsx` |
| **H10** | Ruido visual por exceso de tooltips en tarjetas individuales | **Baja** | Jerarquía Visual | `DeviceCard.tsx`, `EreaderCard.tsx` |

---

## 4. Propuestas Concretas de Código y Solución Técnica

### 4.1. Solución para Modo Claro / Oscuro Completo

#### A. Ajuste en `App.tsx`
```tsx
// Reemplazar:
// <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 ...">
// Por:
<div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-cyan-500 selection:text-white dark:selection:bg-amber-500 dark:selection:text-slate-950 transition-colors duration-200">
```

#### B. Enriquecimiento de `tailwind.config.js` y `src/index.css`
Añadir tokens semánticos claros para fondos de tarjetas, bordes y textos secundarios:
```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        '3xl': '1920px',
      },
      colors: {
        surface: {
          light: '#ffffff',
          'light-subtle': '#f1f5f9',
          dark: '#0f172a',
          'dark-subtle': '#020617',
        }
      }
    }
  }
}
```

---

### 4.2. Solución para Tooltips Responsivos Seguros contra Desbordamiento

Modificar `Tooltip.tsx` para usar cálculo dinámico de posición, ajuste a los bordes de la pantalla y detección segura contra cortes:

```tsx
// Tooltip con limitación de ancho máx. y posicionamiento adaptable
<div
  role="tooltip"
  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[calc(100vw-2rem)] max-w-xs sm:max-w-sm p-4 bg-slate-900/95 dark:bg-slate-900/95 bg-white text-slate-900 dark:text-slate-100 backdrop-blur-md border border-cyan-500/50 rounded-2xl shadow-2xl z-50 text-left space-y-2.5"
>
  {/* Contenido del popover */}
</div>
```

---

### 4.3. Solución para la Matriz de Comparativa en Móvil (Columna Sticky)

En `ComparisonModal.tsx` y `EreaderComparisonModal.tsx`, fijar la primera columna para que permanezca visible al hacer scroll horizontal:

```tsx
{/* Cabecera de la primera columna */}
<th className="sticky left-0 z-10 p-3 bg-slate-900 dark:bg-slate-950 text-slate-400 text-xs font-bold uppercase tracking-wider w-44 rounded-tl-2xl border-b border-r border-slate-800 shadow-[2px_0_6px_rgba(0,0,0,0.4)]">
  Característica
</th>

{/* Celdas de la primera columna */}
<td className="sticky left-0 z-10 p-3 bg-slate-900/95 dark:bg-slate-950/95 text-slate-200 font-semibold text-xs border-r border-slate-800 shadow-[2px_0_6px_rgba(0,0,0,0.4)]">
  <div className="flex items-center justify-between gap-2">
    <span>{label}</span>
    {termKey && <Tooltip termKey={termKey} iconOnly />}
  </div>
</td>
```

---

### 4.4. Solución para Accesibilidad y Comportamiento de Modales

Crear un hook o envoltorio uniforme para todos los modales:
1. Escuchar tecla `Escape` para cerrar.
2. Bloquear scroll del body al abrir (`document.body.style.overflow = 'hidden'`).
3. Añadir `onClick={onClose}` en el fondo exterior oscurecido y `onClick={(e) => e.stopPropagation()}` en la caja modal interior.
4. Incluir `role="dialog"`, `aria-modal="true"` y `aria-labelledby`.

---

### 4.5. Solución para Grid Ultrawide en E-readers

En `EreaderGrid.tsx` (L44):
```tsx
// Reemplazar:
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
// Por:
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-6">
```

---

### 4.6. Corrección de Contadores y Textos Dinámicos

En `Header.tsx`:
```tsx
// Reemplazar los valores 15 y 18 fijos por props o constantes reales:
<span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900/60 text-slate-200">
  {WEARABLES_DATA.length}
</span>

<span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-extrabold">
  {EREADERS_DATA.length}
</span>
```

---

## 5. Hoja de Ruta para Implementación

1. **Fase 1: Correcciones Críticas de Usabilidad y Responsividad**
   - Implementar columna `sticky left-0` en `ComparisonModal.tsx` y `EreaderComparisonModal.tsx`.
   - Ajustar el ancho y contención de los tooltips en pantallas móviles.
   - Corregir el cierre por backdrop y tecla ESC en modales.
   - Sincronizar `EreaderGrid` para soporte ultrawide (`2xl/3xl`).

2. **Fase 2: Pulido del Sistema de Diseño y Modo Claro/Oscuro**
   - Asegurar soporte de clases `dark:` en `App.tsx`, `Header.tsx`, `FilterBar.tsx`, `DeviceCard.tsx`, modales y pie de página.
   - Corregir clases no estándar (`py-0.2` → `py-0.5`).
   - Mejorar contraste en badges secundarios y botones.

3. **Fase 3: Consistencia Editorial y Sincronización de Datos**
   - Reemplazar textos y conteos hardcodeados por variables dinámicas vinculadas a `wearables.ts` y `ereaders.ts`.
   - Actualizar menciones de fecha a "Agosto 2026" en `HeroSection`, `EreaderHero`, `Footer` y guías.
   - Corregir erratas tipográficas detectadas.

4. **Fase 4: Microinteracciones y Refinamiento Visual**
   - Añadir transiciones suaves en selectores de pestañas y botones de acción.
   - Refinar el estilo de los sliders de rango para indicar visualmente el progreso.
