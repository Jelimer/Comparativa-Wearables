# Project: Comparativa Wearables y E-readers — Auditoría y Optimización Agosto 2026

## Architecture
- Documentation: `informe_wearables_salud.md` y `informe_ereaders_kindles.md` (Markdown reports con tablas y alertas GitHub).
- Web Application: React 18 + Vite + TypeScript + TailwindCSS (`src/components/`, `src/data/`, `src/types/`, `public/images/`).
- Performance Architecture: Code-splitting con `React.lazy` + `Suspense`, memoización con `React.memo` + `useCallback`, `vite.config.ts` manual chunks.
- UI/UX & Design System: Modo oscuro y claro con contraste accesible, diseño responsivo móvil a ultrawide, modales accesibles con bloqueo de scroll y cabeceras fijas, microinteracciones.
- Build & Deploy Pipeline: Compilación limpia (`npm run build`), Git commit y sincronización remota con GitHub (`https://github.com/Jelimer/Comparativa-Wearables`) para despliegue en Vercel.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Exactitud de Informes y Datasets | Verificación 100% de datos a agosto 2026 y marcas autorizadas exclusivas. | M1 | Survey E1 |
| 2 | Sincronización de Filtros y Contadores | Ajuste de precio máximo inicial de e-readers (600€), contadores (21 wearables / 18 ereaders) y fechas (agosto 2026). | M1 | Survey E1, E3 |
| 3 | Optimización de Filtrado y Búsqueda | Búsqueda con normalización previa fuera del bucle y descartes rápidos. | M1 | Survey E2 |
| 4 | Code-Splitting y Bundle Chunks | Implementación de `React.lazy` para vistas/modales/guías y `manualChunks` en `vite.config.ts`. | M2 | Survey E2 |
| 5 | Memoización de Renderizado | Aplicar `React.memo` en `DeviceCard`, `EreaderCard`, barras de filtros y `useCallback` en handlers. | M2 | Survey E2 |
| 6 | Modo Claro / Modo Oscuro Accesible | Soporte completo de modo claro/oscuro eliminando bloqueos de clases oscuras fijas y garantizando contraste. | M3 | Survey E3 |
| 7 | Modales y Tablas Comparativas | Bloqueo de scroll, tecla Escape, clic en backdrop y columnas sticky en mobile. | M3 | Survey E3 |
| 8 | Tooltips y Responsividad Ultrawide | Tooltips responsivos sin desbordamiento y soporte de rejilla para monitores 2xl/3xl. | M3 | Survey E3 |
| 9 | Microinteracciones y Transiciones | Animaciones suaves en tabs, botones, badges y hover de tarjetas. | M3 | Survey E3 |
| 10 | Verificación y Compilación Limpia | `npm run build` sin errores ni advertencias de TypeScript. | M4 | Request & Survey |
| 11 | Auditoría Forense de Integridad | Verificación independiente de autenticidad sin hardcoding ni evasiones. | M4 | System Protocol |
| 12 | Git Commit y Despliegue en GitHub/Vercel | Commit de todos los cambios y `git push origin main` hacia el repositorio remoto. | M4 | Request |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Data Sync & Search Algorithm | Ajustes de filtros por defecto, contadores, fechas y optimización de búsqueda | none | DONE |
| M2 | Performance & Code Splitting | `React.lazy`, `Suspense`, `manualChunks` y `React.memo` en tarjetas/filtros | M1 | DONE |
| M3 | UI/UX, Themes & Responsiveness | Soporte Dark/Light, modales accesibles, tooltips responsivos, rejillas ultrawide | M2 | DONE |
| M4 | Verification, Build & Deploy | `npm run build`, auditoría de integridad, git commit y push a `origin main` | M3 | IN_PROGRESS |

## Interface Contracts
### Data & Filter Contract
- `FilterState` y `EreaderFilterState` manejan rangos de precios coherentes con los datos (`maxPrice: 600`).
- Los contadores de dispositivos se computan dinámicamente o reflejan `wearables.length` (21) y `ereaders.length` (18).
### Component Rendering Contract
- Las vistas `WearablesView` y `EreadersView` se cargan de forma diferida con `Suspense` y fallback skeleton / spinner.
- Los modales pesados (`CompareModal`, `EreaderCompareModal`, `BuyingGuide`, `EreaderBuyingGuide`) se cargan diferidos on-demand.

## Code Layout
- `informe_wearables_salud.md` — Informe técnico Markdown de wearables.
- `informe_ereaders_kindles.md` — Informe técnico Markdown de e-readers.
- `src/data/wearables.ts` — Dataset TypeScript de 21 wearables.
- `src/data/ereaders.ts` — Dataset TypeScript de 18 e-readers.
- `src/components/` — Componentes React (Tarjetas, Filtros, Grids, Modales, Guías).
- `src/types/` — Definiciones de interfaces TypeScript.
- `src/App.tsx` — Contenedor principal de la aplicación.
- `vite.config.ts` — Configuración de compilación y empaquetado Vite.
- `tailwind.config.js` — Configuración de estilos y tema Tailwind.
