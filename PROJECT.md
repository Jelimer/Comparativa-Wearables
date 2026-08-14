# Project: Comparativa Wearables — Agosto 2026 Audit Update

## Architecture
- Documentation: `informe_wearables_salud.md` (Markdown report with GitHub tables and GitHub callouts/alerts).
- Web Application: React + Vite + TypeScript web application (`src/data/wearables.ts`, `src/components/`, `public/images/devices/`).
- Build & Deploy Pipeline: Vite build (`npm run build`), Git repository -> GitHub (`https://github.com/Jelimer/Comparativa-Wearables`) -> Vercel deployment.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Auditoría Agosto 2026 - Marcas Autorizadas | Búsqueda y recopilación de especificaciones de Google/Fitbit, Garmin, Samsung, Oura, Whoop, RingConn, Signal Ring, Apple, Xiaomi. | M1, M2 | Survey |
| 2 | Actualización de `informe_wearables_salud.md` | Inclusión de Pixel Watch 5, Galaxy Watch Ultra 2 / 9, Galaxy Ring update, Garmin CIRQA, Oura Ring 5, Whoop 5.0 / MG, RingConn Gen 2, Signal Ring, Apple Watch Ultra 3, Xiaomi Smart Band 10 Pro. Tablas GitHub y alertas intactas. Exclusión estricta de marcas no autorizadas. | M1 | Request & Survey |
| 3 | Actualización de dataset TypeScript | Actualizar `src/data/wearables.ts` con todos los nuevos modelos y especificaciones técnicas actualizadas a agosto 2026. | M2 | Request & Survey |
| 4 | Descarga de Imágenes Oficiales | Descargar/generar imágenes oficiales de los nuevos dispositivos y almacenarlas localmente en `public/images/devices/`. | M2 | Request & Survey |
| 5 | Compilación Local sin Errores | Ejecutar `npm run build` localmente y verificar que compila con 0 errores. | M3 | Request |
| 6 | Verificación de Auditoría e Integridad | Ejecutar revisión y auditoría forense sin cheating/hardcoding. | M3 | System Protocol |
| 7 | Git Commit & Push a GitHub | Commitear todos los cambios y hacer push a `https://github.com/Jelimer/Comparativa-Wearables` para desplegar en Vercel. | M3 | Request |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Document Update | Actualizar `informe_wearables_salud.md` con nuevos modelos y parches de software a agosto de 2026 | none | DONE |
| M2 | Dataset & Image Assets | Actualizar dataset React/TS (`src/data/wearables.ts`) y descargar imágenes en `public/images/devices/` | M1 | DONE |
| M3 | Build, Audit & Deploy | Probar compilación `npm run build`, auditoría de integridad, git commit y push a GitHub | M2 | DONE |

## Interface Contracts
### Document ↔ Web Dataset
- Los identificadores de dispositivos y especificaciones técnicas coinciden exactamente entre `informe_wearables_salud.md` y `src/data/wearables.ts`.
- Las imágenes en `public/images/devices/<id>.*` se corresponden con la propiedad `image` del dataset en TypeScript.

## Code Layout
- `informe_wearables_salud.md` — Informe Markdown de salud y wearables.
- `src/data/wearables.ts` — Dataset TypeScript con la lista de dispositivos.
- `src/types/` — Definiciones de tipos TypeScript para wearables.
- `public/images/devices/` — Imágenes estáticas locales de los dispositivos.
- `package.json` — Scripts de compilación y dependencias.
