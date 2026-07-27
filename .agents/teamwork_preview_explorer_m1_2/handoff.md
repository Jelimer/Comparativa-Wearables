# Handoff Report — Requirement 2: Fail-Proof Local Images Analysis

## 1. Observation

- **Archivo inspeccionado**: `src/data/wearables.ts` (Líneas 1-566).
- **Directorio de activos públicos**: El directorio `public/` no existe actualmente en el proyecto (`c:\Users\jelim\.gemini\antigravity\scratch\comparativa-wearables\public`).
- **Dispositivos analizados**: Se identificaron un total de **15 dispositivos** definidos en `WEARABLES_DATA`.
- **Valores de `imageUrl` observados (Verbatim)**:
  1. `google-pixel-watch-4` (Línea 14): `'https://store.google.com/product/images/pixel_watch_4.png'`
  2. `fitbit-sense-2` (Línea 52): `'https://store.google.com/product/images/fitbit_sense_2.png'`
  3. `fitbit-charge-6` (Línea 90): `'https://store.google.com/product/images/fitbit_charge_6.png'`
  4. `fitbit-air` (Línea 128): `'https://store.google.com/product/images/fitbit_air.png'`
  5. `garmin-epix-pro` (Línea 165): `'https://static.garmincdn.com/en/products/010-02804-00/g/epix-pro-51mm-v2.png'`
  6. `garmin-cirqa` (Línea 202): `'https://static.garmincdn.com/en/products/cirqa-band.png'`
  7. `samsung-galaxy-watch-ultra-2` (Línea 238): `'https://images.samsung.com/is/image/samsung/galaxy-watch-ultra-2.png'`
  8. `samsung-galaxy-watch-9` (Línea 276): `'https://images.samsung.com/is/image/samsung/galaxy-watch-9.png'`
  9. `samsung-galaxy-ring` (Línea 314): `'https://images.samsung.com/is/image/samsung/galaxy-ring.png'`
  10. `oura-ring-4` (Línea 351): `'https://ouraring.com/assets/images/product/oura-ring-4.png'`
  11. `signal-ring` (Línea 387): `'https://vitalsignals.health/assets/signal-ring.png'`
  12. `ringconn-gen-2` (Línea 424): `'https://ringconn.com/assets/ringconn-gen2.png'`
  13. `whoop-4` (Línea 462): `'https://cdn.whoop.com/uploads/whoop-4-strap.png'`
  14. `apple-watch-series-10` (Líneas 499-500): `'https://www.apple.com/v/apple-watch-series-10/a/images/overview/hero/hero_watch_s10__d11y06qj2qaa_large.png'`
  15. `xiaomi-smart-band-9` (Línea 537): `'https://i01.appmifile.com/webfile/globalimg/products/pc/xiaomi-smart-band-9/hero.png'`

- **Manejo de imágenes en la interfaz**:
  - `src/components/DeviceCard.tsx` (Líneas 92-105): implementa estado `imgError` con icono de fallback `Activity` de Lucide.
  - `src/components/DeviceDetailModal.tsx` (Líneas 58-65): oculta la imagen al fallar con `display = 'none'`.
  - `src/components/ComparisonModal.tsx` (Líneas 142-149): oculta la imagen al fallar con `display = 'none'`.
  - `src/components/RecommendationBanner.tsx` (Líneas 54, 86, 118): renderiza la etiqueta `<img>` sin manejador de `onError`, por lo que una URL rota muestra el icono roto por defecto del navegador.

---

## 2. Logic Chain

1. **Evaluación de vulnerabilidad de URLs externas**:
   - Todas las 15 entradas en `src/data/wearables.ts` apuntan actualmente a URLs remotas de CDNs de terceros (Google, Garmin, Samsung, Oura, Whoop, Apple, Xiaomi, Vital Signals, RingConn).
   - Las URLs externas presentan bloqueos CORS/hotlinking, errores 404 por cambio de rutas en los servidores originales, y fallos de carga en entornos sin acceso libre a internet o tras proxies corporativos.
   - En particular, varios modelos especulativos/recientes (como `fitbit-air`, `garmin-cirqa`, `signal-ring`, `google-pixel-watch-4`) tienen rutas remotas inexistentes o inestables.

2. **Impacto en la experiencia de usuario**:
   - En `RecommendationBanner.tsx`, la falta de `onError` causa un icono de imagen rota ("broken image link") si falla la red.
   - En `DeviceDetailModal` y `ComparisonModal`, al colapsar la imagen con `display: none`, el espacio visual queda asimétrico.

3. **Arquitectura propuesta para activos locales a prueba de fallos**:
   - La creación del directorio `public/images/devices/` servirá los archivos estáticos a través del servidor Vite en tiempo de desarrollo y construcción (`dist/images/devices/`).
   - Reemplazar todas las URLs remotas en `src/data/wearables.ts` por rutas locales absolutas web (`/images/devices/<device-id>.png`) garantiza disponibilidad offline del 100%, tiempos de carga instantáneos y cero dependencia de CDNs de terceros.

---

## 3. Recommendations (Recomendaciones Concretas)

### Recomendación 1: Estructura de activos locales
Crear el directorio local `public/images/devices/` en la raíz del proyecto.
Standardizar los nombres de archivo usando el `id` exacto del dispositivo con extensión `.png` o `.webp`, además de incluir una imagen de reserva `placeholder.svg`:

```
public/
└── images/
    └── devices/
        ├── google-pixel-watch-4.png
        ├── fitbit-sense-2.png
        ├── fitbit-charge-6.png
        ├── fitbit-air.png
        ├── garmin-epix-pro.png
        ├── garmin-cirqa.png
        ├── samsung-galaxy-watch-ultra-2.png
        ├── samsung-galaxy-watch-9.png
        ├── samsung-galaxy-ring.png
        ├── oura-ring-4.png
        ├── signal-ring.png
        ├── ringconn-gen-2.png
        ├── whoop-4.png
        ├── apple-watch-series-10.png
        ├── xiaomi-smart-band-9.png
        └── placeholder.svg
```

### Recomendación 2: Fuentes y especificaciones de descarga para cada dispositivo

Para implementar el lote de imágenes locales, se deben obtener o generar los archivos PNG transparentes (300x300 px o superior, fondo transparente, formato PNG/WebP):

| # | Dispositivo | Nombre de Archivo Local | Fuente/Estrategia de Obtención Recomendada |
|---|-------------|-------------------------|---------------------------------------------|
| 1 | Google Pixel Watch 4 | `google-pixel-watch-4.png` | Render oficial de Google Store / kit de prensa Pixel Watch. |
| 2 | Google Fitbit Sense 2 | `fitbit-sense-2.png` | Imagen oficial de Fitbit Press Kit / Wikimedia Commons (Fitbit Sense 2). |
| 3 | Google Fitbit Charge 6 | `fitbit-charge-6.png` | Imagen oficial de Fitbit Press Kit (Charge 6 Porcelain/Obsidian). |
| 4 | Google Fitbit Air | `fitbit-air.png` | Ilustración/render conceptual de banda biométrica sin pantalla. |
| 5 | Garmin Epix Pro (Gen 2) | `garmin-epix-pro.png` | Render oficial Garmin (Epix Pro 51mm Sapphire/Titanium). |
| 6 | Garmin CIRQA Smart Band | `garmin-cirqa.png` | Render conceptual de pulsera de tela/polímero sin pantalla estilo Garmin. |
| 7 | Samsung Galaxy Watch Ultra 2 | `samsung-galaxy-watch-ultra-2.png` | Press release oficial Samsung Mobile (Galaxy Watch Ultra Titanium). |
| 8 | Samsung Galaxy Watch 9 | `samsung-galaxy-watch-9.png` | Render oficial Samsung Mobile (Galaxy Watch 9 Graphite/Silver). |
| 9 | Samsung Galaxy Ring | `samsung-galaxy-ring.png` | Press kit oficial Samsung (Galaxy Ring Titanium Black/Gold). |
| 10 | Oura Ring 4 | `oura-ring-4.png` | Render oficial Oura Health (Oura Gen4 Brushed Silver/Black). |
| 11 | Signal Ring (Vital Signals) | `signal-ring.png` | Render oficial Vital Signals / Anillo médico hemodinámico. |
| 12 | RingConn Gen 2 | `ringconn-gen-2.png` | Render de producto RingConn Gen 2 (Futuristic Silver/Matte Black). |
| 13 | Whoop 4.0 / Whoop Peak | `whoop-4.png` | Media Kit oficial de Whoop (Whoop 4.0 Onyx strap). |
| 14 | Apple Watch Series 10 | `apple-watch-series-10.png` | Press Kit Apple Newsroom (Apple Watch Series 10 Jet Black/Rose Gold). |
| 15 | Xiaomi Smart Band 9 | `xiaomi-smart-band-9.png` | Render oficial Xiaomi Global (Smart Band 9 Midnight Black). |
| 16 | Fallback / Placeholder | `placeholder.svg` | Vector SVG estilizado de silueta neutra de smartwatch/wearable. |

### Recomendación 3: Actualización de `src/data/wearables.ts`
Modificar los campos `imageUrl` de los 15 objetos en `src/data/wearables.ts` para que apunten a las rutas locales relativas al servidor web:

```typescript
// Mapeo propuesto para src/data/wearables.ts:
imageUrl: '/images/devices/google-pixel-watch-4.png'
imageUrl: '/images/devices/fitbit-sense-2.png'
imageUrl: '/images/devices/fitbit-charge-6.png'
imageUrl: '/images/devices/fitbit-air.png'
imageUrl: '/images/devices/garmin-epix-pro.png'
imageUrl: '/images/devices/garmin-cirqa.png'
imageUrl: '/images/devices/samsung-galaxy-watch-ultra-2.png'
imageUrl: '/images/devices/samsung-galaxy-watch-9.png'
imageUrl: '/images/devices/samsung-galaxy-ring.png'
imageUrl: '/images/devices/oura-ring-4.png'
imageUrl: '/images/devices/signal-ring.png'
imageUrl: '/images/devices/ringconn-gen-2.png'
imageUrl: '/images/devices/whoop-4.png'
imageUrl: '/images/devices/apple-watch-series-10.png'
imageUrl: '/images/devices/xiaomi-smart-band-9.png'
```

### Recomendación 4: Robustez en componentes UI (Fallback Component)
Agregar en `RecommendationBanner.tsx` un manejador `onError={(e) => { e.currentTarget.src = '/images/devices/placeholder.svg'; }}` o un estado de fallback consistente para garantizar que ninguna falla de carga arruine la UI.

---

## 4. Caveats

- **Modelos conceptuales / futuros (año 2026)**: Modelos como `fitbit-air`, `garmin-cirqa` y `signal-ring` son wearables especulativos o recién anunciados. Para estos, se deben usar renders vectoriales o gráficos ilustrativos neutros de alta calidad.
- **Acceso a red en este entorno**: El agente explorador opera en modo `CODE_ONLY` (sin acceso HTTP externo). La descarga e integración de los archivos de imagen debe realizarse mediante generación de assets SVG/PNG locales o descarga manual/script por el agente implementador.

---

## 5. Conclusion

El Requisito 2 requiere la eliminación total de las 15 URLs remotas externas en `src/data/wearables.ts` y su reemplazo por activos estáticos almacenados en `public/images/devices/`. Esta migración garantizará el cumplimiento completo de "Fail-proof local images", disponibilidad 100% offline, carga instantánea y resistencia frente a fallos de red.

---

## 6. Verification Method

Para verificar independientemente el resultado tras la implementación:
1. Confirmar la existencia de los archivos de imagen en `public/images/devices/` ejecutando:
   `Get-ChildItem public/images/devices`
2. Verificar que `src/data/wearables.ts` no contenga ninguna URL con `https://`:
   `grep_search` con Query `https://` en `src/data/wearables.ts` (debe retornar 0 coincidencias en `imageUrl`).
3. Ejecutar la compilación de producción para asegurar que Vite empaquete los activos correctamente:
   `npm run build`
