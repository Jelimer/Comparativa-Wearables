# Informe de Auditoría UI/UX, Sistema de Diseño, Temas y Accesibilidad (M3)

- **Explorador**: Explorer 3 (M3: UI/UX, Temas, Modales & Responsividad)
- **Fecha de Auditoría**: 28 de agosto de 2026
- **Ámbito**: Componentes React (`src/components/`, `src/components/ereaders/`), `App.tsx`, hojas de estilo (`index.css`), configuración Tailwind (`tailwind.config.js`), tooltips, badges, modales y accesibilidad.

---

## 1. Resumen Ejecutivo y Veredicto General

La interfaz de usuario de la plataforma *Comparativa Tech 2026* presenta un estándar visual prémium y una arquitectura moderna orientada a la experiencia de usuario y rendimiento. Las dos secciones principales (**Wearables de Salud y Rendimiento** y **E-readers & Kindles**) guardan una notable simetría visual y estructural, con una clara identidad cromática diferenciadora:
- **Wearables**: Acentos cian y azul (`cyan-500` / `blue-600`), iconografía biométrica (`Activity`, `HeartPulse`, `Zap`).
- **E-readers**: Acentos ámbar y amarillo (`amber-500` / `yellow-500`), iconografía editorial (`BookOpen`, `Palette`, `Library`).

### Veredicto Global
- **Calidad de Diseño y Jerarquía**: **9.3 / 10** — Estructura limpia, tipografía escalada armónicamente y microinteracciones fluidas.
- **Soporte Dark/Light Mode**: **Parcial (8.0 / 10)** — Excelente en el 85% de la aplicación (Header, Hero, FilterBar, Cards, Grids y Modales), pero con **bloqueo estático de clases oscuras** en las Guías Estratégicas (`StrategicGuide.tsx` y `EreaderStrategicGuide.tsx`), en los placeholders de carga diferida (`Suspense`) y en el pie de página (`Footer.tsx`).
- **Tooltips y Responsividad Móvil**: **7.8 / 10** — Buenas definiciones semánticas y soporte de teclado/clic exterior, pero con **riesgo de recorte visual (`overflow-hidden`)** en tarjetas de catálogo y potencial desbordamiento horizontal en viewports móviles estrechos (<380px).
- **Consistencia de Badges y Chips**: **9.7 / 10** — Estructura modular altamente uniforme entre Wearables y E-readers en chips de precio, autonomía, badges de recomendación y chips de filtros.
- **Accesibilidad (a11y)**: **9.0 / 10** — Contrastes cromáticos adecuados en la mayoría de combinaciones, soporte de foco visible por teclado, bloqueo de scroll en modales y roles ARIA implementados.

---

## 2. Auditoría Detallada por Ejes

### Eje 1: Consistencia del Sistema de Diseño, Jerarquía Tipográfica y Paleta de Colores

#### 1.1 Jerarquía Tipográfica
La jerarquía tipográfica basada en la fuente `Inter` (importada en `index.html`) está correctamente estructurada:
- **Nivel H1 (Header)**: `text-xl sm:text-2xl font-extrabold tracking-tight` con degradado `bg-clip-text text-transparent`.
- **Nivel H2 (Hero & Modales)**: `text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight` en Hero; `text-lg sm:text-xl font-black` en encabezados de modales.
- **Nivel H3 (Secciones & Grids)**: `text-xl font-extrabold text-slate-900 dark:text-white` en cabeceras de grids y banners.
- **Nivel H4 / Tarjetas**: `text-base sm:text-lg font-bold line-clamp-1` para nombres de dispositivos.
- **Micro-textos y Metadatos**: `text-xs` (12px) y `text-[10px]` / `text-[11px]` en mayúsculas (`uppercase tracking-wide`) para categorías, PPI, sensores y compatibilidad.

#### 1.2 Paleta de Colores y Modo Claro / Oscuro
- **Fondo Global y Contenedores**:
  - Modo Claro: `bg-slate-50`, tarjetas en `bg-white`, bordes en `border-slate-200` o `border-slate-300`.
  - Modo Oscuro: `dark:bg-slate-950`, tarjetas en `dark:bg-slate-900/90`, bordes en `dark:border-slate-800`.
- **Inconsistencias Detectadas (Bloqueos de Modo Oscuro Fijo)**:
  1. `src/components/StrategicGuide.tsx`: El contenedor principal usa `className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"` y todos sus elementos internos tienen `text-white`, `bg-slate-950`, `text-slate-300`, `text-slate-400` fijos sin variantes para modo claro. Al activar el modo claro, esta sección permanece como un bloque negro oscuro.
  2. `src/components/ereaders/EreaderStrategicGuide.tsx`: De manera similar, usa `bg-slate-900/90`, `border-slate-800`, `text-white` fijos sin clases para modo claro (`bg-white dark:bg-slate-900/90`).
  3. `src/components/Footer.tsx`: Contenedor fijo en `bg-slate-950 border-t border-slate-800 text-slate-400`. Si bien un footer oscuro en modo claro es un patrón aceptable, carece de adaptación sutil de contraste o sincronización con el modo claro.
  4. `src/components/WearablesView.tsx` (L243) y `EreadersView.tsx` (L224): El fallback del `Suspense` para las Guías Estratégicas tiene `bg-slate-900/50 border border-slate-800` fijo.

---

### Eje 2: Tooltips e Interacciones en Viewports Móviles

#### 2.1 Componentes `Tooltip.tsx` y `EreaderTooltip.tsx`
Ambos componentes comparten una arquitectura basada en popover:
- **Activación**: Doble modalidad (hover en desktop + clic/tap en móvil con listener `mousedown` para cerrar al hacer clic fuera).
- **Accesibilidad**: Cierre con tecla `Escape`, apertura/cierre con `Enter` / `Space`, atributos `role="tooltip"`, `aria-expanded` y `aria-label`.
- **Estilo**: `w-72 sm:w-80 max-w-[calc(100vw-2rem)]`, fondo con desenfoque de cristal `bg-white/95 dark:bg-slate-900/95 backdrop-blur-md`, bordes temáticos cian (`dark:border-cyan-500/50`) y ámbar (`dark:border-amber-500/50`).

#### 2.2 Problemas de Recorte y Desbordamiento (Clipping & Overflow)
1. **Recorte por `overflow-hidden` en `DeviceCard.tsx` y `EreaderCard.tsx`**:
   - Tanto `DeviceCard` (L77) como `EreaderCard` (L95) tienen la clase contenedora `overflow-hidden`.
   - Los tooltips se encuentran anidados dentro de filas internas (ej. chip de batería `Tooltip termKey="battery"` y badges de sensores).
   - Al abrirse con posición `absolute bottom-full mb-2`, el popover que supere el borde superior de la tarjeta queda **recortado/invisible** por la regla CSS de `overflow: hidden` del elemento padre.
2. **Tablas Comparativas con `overflow-x-auto`**:
   - En `ComparisonModal.tsx` y `EreaderComparisonModal.tsx`, las tablas están envueltas en un contenedor con `overflow-x-auto`.
   - Los tooltips situados en columnas o encabezados pueden ser truncados por el scroll horizontal del contenedor o forzar la aparición de scrollbars no deseadas.
3. **Márgenes en Pantallas Móviles Pequeñas**:
   - La posición `left-1/2 -translate-x-1/2` centra el tooltip con respecto al botón de ayuda (de ~16px de ancho). Si el botón está situado cerca del borde izquierdo de la pantalla (ej. a 15px del margen), el tooltip de 288px se desplaza 144px a la izquierda, saliéndose de la pantalla por la izquierda en `-129px`.

---

### Eje 3: Badges, Tags, Price Chips, Rating Stars y Puntuaciones

Se evaluó la simetría y coherencia de los elementos gráficos entre Wearables y E-readers:

| Elemento Visual | Wearables (`DeviceCard.tsx`) | E-readers (`EreaderCard.tsx`) | Evaluación de Coherencia |
| :--- | :--- | :--- | :--- |
| **Badge de Marca** | `px-2.5 py-0.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700` | Idéntico | **100% Coherente** |
| **Badge Mejor Global** | Degradado Ámbar/Amarillo (`from-amber-500 to-yellow-400 text-slate-950`) + Icono `Star` | Degradado Ámbar/Amarillo (`from-amber-500 to-yellow-400 text-slate-950`) + Icono `Award` | **Excelente** |
| **Badge Mejor Presupuesto** | Degradado Esmeralda/Verde (`from-emerald-500 to-teal-400 text-slate-950`) + `DollarSign` | Degradado Esmeralda/Verde (`from-emerald-500 to-teal-400 text-slate-950`) + `DollarSign` | **100% Coherente** |
| **Badge Calidad/Precio** | Degradado Cian/Azul (`from-cyan-500 to-blue-400 text-slate-950`) + `Activity` | Degradado Púrpura/Índigo (`from-purple-500 to-indigo-400 text-white`) + `Star` | **Diferenciación Intencional Adecuada** |
| **Chip Precio / Batería** | `py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/60` | Idéntico formato + Fila adicional de Pantalla / PPI | **100% Coherente** |
| **Chips de Sensores / Features** | Micro-píldoras con tintes suaves (`bg-cyan-50 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300`, etc.) | Micro-píldoras (`bg-purple-50 dark:bg-purple-950`, `bg-amber-50`, `bg-blue-50`, etc.) | **100% Coherente** |
| **Botones de Acción** | `Detalles` (neutral) + `Comparar` (acento cian) | `Detalles` (neutral) + `Comparar` (acento ámbar) | **Excelente Simetría** |
| **Rating Stars** | Estrella con `fill-amber-500 dark:fill-amber-400` + valor numérico | Estrella con `fill-amber-500 dark:fill-amber-400` + valor numérico | **100% Coherente** |

---

### Eje 4: Accesibilidad (a11y), Contraste, Focus y Semántica

1. **Ratios de Contraste Cromático (WCAG 2.1)**:
   - Los textos normales sobre fondos oscuros (`text-slate-100` y `text-slate-300` sobre `bg-slate-950` / `bg-slate-900`) superan con holgura los 7:1 (nivel AAA).
   - Los textos en modo claro (`text-slate-900`, `text-slate-700` sobre `bg-white` y `bg-slate-50`) superan 10:1 (nivel AAA).
   - Las insignias de acento en modo claro (`text-cyan-800` sobre `bg-cyan-50`, `text-amber-800` sobre `bg-amber-50`, `text-emerald-800` sobre `bg-emerald-50`) tienen excelente legibilidad y cumplen AAA.
   - *Punto de atención menor*: En `EreaderFilterBar.tsx` (L321), `text-amber-600` en modo claro tiene un contraste de 3.8:1 sobre blanco; el uso de `text-amber-700` o `text-amber-800` en modo claro asegura >4.5:1 (AA).
2. **Navegación por Teclado e Indicadores de Foco**:
   - Los campos interactivos (`input`, `select`, `button`) cuentan con estilos de foco explícitos (`focus:ring-2 focus:ring-cyan-500/50` o `focus:ring-amber-500/50`).
   - Los modales implementan bloqueo de foco conceptual mediante bloqueo de scroll y atajo global `Escape` para retorno inmediato.
3. **Roles ARIA y Lectores de Pantalla**:
   - `index.html` cuenta con atributo obligatorio `lang="es"`.
   - `ViewLoadingFallback` incorpora `role="status"` y `aria-live="polite"`.
   - Modales y tooltips contienen `aria-label` descriptivos en español para botones de cierre y ayuda.

---

## 3. Plan de Recomendaciones de Remediación

Para completar el Milestone M3 con la máxima excelencia visual y funcional, se proponen las siguientes acciones concretas:

### Recomendación 1: Habilitar Soporte de Modo Claro en Guías Estratégicas
- Modificar `StrategicGuide.tsx` y `EreaderStrategicGuide.tsx` para reemplazar los contenedores rígidos oscuros por clases adaptativas:
  - `bg-slate-900/90` → `bg-white dark:bg-slate-900/90`
  - `border-slate-800` → `border-slate-200 dark:border-slate-800`
  - `text-white` → `text-slate-900 dark:text-white`
  - `text-slate-300` / `text-slate-400` → `text-slate-600 dark:text-slate-300`
  - Sub-tarjetas internas `bg-slate-950` → `bg-slate-50 dark:bg-slate-950`

### Recomendación 2: Resolver Recorte de Tooltips en Tarjetas
- En `DeviceCard.tsx` y `EreaderCard.tsx`, evaluar eliminar `overflow-hidden` del contenedor principal (o reubicarlo exclusivamente en la sección de imagen) para permitir que los tooltips flotantes superen los límites de la tarjeta sin ser cercenados.
- Alternativamente, asegurar que los tooltips internos dentro de tarjetas se abran hacia abajo o utilicen una posición calculada que no exceda los bordes.

### Recomendación 3: Optimizar Tooltips en Pantallas Móviles
- En `Tooltip.tsx` y `EreaderTooltip.tsx`, ajustar el contenedor para evitar desbordamientos en extremos:
  - Usar clases responsivas como `left-0 sm:left-1/2 sm:-translate-x-1/2` o `max-w-[calc(100vw-2.5rem)]` para prevenir que el popover quede cortado a la izquierda.

---

## 4. Conclusión

El diseño visual, la jerarquía y la experiencia de usuario de la plataforma demuestran una ejecución muy sólida y profesional. La implementación de las 3 recomendaciones anteriores dejará el Milestone M3 en un estado óptimo, 100% responsivo y plenamente accesible en cualquier condición de iluminación y dispositivo.
