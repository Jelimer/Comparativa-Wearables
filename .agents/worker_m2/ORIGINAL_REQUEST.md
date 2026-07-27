## 2026-07-27T19:37:54Z
Eres Worker para el desarrollo y publicación de la Web App de Comparativa de Wearables.

Tu directorio de trabajo es: `c:\Users\jelim\.gemini\antigravity\scratch\comparativa-wearables\.agents\worker_m2`
El raíz del proyecto es: `c:\Users\jelim\.gemini\antigravity\scratch\comparativa-wearables`

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Instrucciones y Objetivos para Milestone 2 y Milestone 3:

1. **Dataset (`src/data/wearables.ts`)**:
   - Lee `.agents/explorer_m1/handoff.md` y `.agents/explorer_m1/dataset.ts`.
   - Crea `src/data/wearables.ts` e `src/types/wearable.ts` con todos los 15 wearables (Google Pixel Watch 4, Sense 2, Charge 6, Fitbit Air, Garmin Epix Pro, CIRQA, Samsung Galaxy Watch Ultra 2, Galaxy Watch 9, Galaxy Ring, Oura Ring 4, Signal Ring, RingConn Gen 2, Whoop 4.0/Peak, Apple Watch Series 10, Xiaomi Smart Band 9).

2. **Configuración e Inicialización Frontend**:
   - Inicializa un proyecto Vite + React + TypeScript + Tailwind CSS en la raíz del proyecto.
   - Instala paquetes requeridos (ej. `lucide-react`, `framer-motion` o `clsx` / `tailwind-merge` según sea conveniente).
   - Asegura la configuración de `package.json`, `vite.config.ts`, `tailwind.config.js`, `tsconfig.json`, e `index.html`.

3. **Desarrollo de Componentes Frontend (UI Premium & Responsive en Español)**:
   - `Header.tsx`: Título del proyecto, badge de versión 2026, selector de modo oscuro/claro y estadísticas rápidas.
   - `HeroSection.tsx`: Presentación llamativa de la comparativa de dispositivos biométricos de salud y rendimiento.
   - `FilterBar.tsx`: Filtros interactivos multidimensionales:
     * Por marca (Todas, Google/Fitbit, Garmin, Samsung, Oura, Whoop, RingConn, Signal, Apple, Xiaomi).
     * Por categoría (Smartwatches, Pulseras/Bands, Anillos Inteligentes).
     * Por ecosistema (iOS, Android, Samsung).
     * Por tipo de cobro (Sin suscripción vs Requiere suscripción).
     * Por rango de precio y batería.
     * Por sensores médicos presentes (ECG, SpO2, cEDA/Estrés, Composición Corporal, Presión Arterial, GPS, Temp cutánea).
     * Campo de búsqueda por texto en tiempo real.
   - `DeviceCard.tsx`: Tarjeta interactiva con la imagen oficial del producto, precio, batería, sensores clave, badges de recomendación ("Mejor Opción Global", "Más Económica", "Mejor Calidad/Precio"), botón de detalles y botón de "Añadir a Comparar" (máximo 4 dispositivos).
   - `DeviceGrid.tsx`: Grid fluido y responsive con indicador de resultados encontrados y ordenamiento (precio, batería, puntuación, nombre).
   - `ComparisonModal.tsx`: Vista detallada de comparación lado a lado (Side-by-Side) entre dispositivos seleccionados (hasta 4):
     * Matriz de especificaciones comparadas (Precio, Batería, Suscripción, Ecosistema).
     * Matriz de sensores médicos (ECG, SpO2, cEDA, BIA, Presión Arterial, etc.) con iconos visuales de disponible/no disponible.
     * Cuadro comparativo de pros y contras lado a lado.
     * Resumen con llamada a cuál es la mejor opción dentro del grupo comparado.
   - `RecommendationBanner.tsx`: Sección destacada de recomendaciones finales basadas en el informe (Mejor Opción Global, Opción Más Económica, Mejor Calidad/Precio) con resumen ejecutivo.
   - `StrategicGuide.tsx`: Guía interactiva de 4 pasos (Compatibilidad de Smartphone, Sincronización Health Connect, Calculadora de TCO a 3 años, Matriz de estilo de vida).
   - `Footer.tsx`: Pie de página con créditos, enlaces y nota metodológica.

4. **Verificación de Compilación Local**:
   - Ejecuta `npm run build` o `npx tsc && npx vite build` y verifica que compila 100% limpio sin errores de TypeScript ni de bundle.
   - Registra el resultado del comando y la salida de compilación en tu reporte.

5. **Configuración Git y Push a Remote**:
   - Inicializa el repositorio git local en la raíz si no estuviera inicializado.
   - Configura el remoto: `git remote add origin https://github.com/Jelimer/Comparativa-Wearables` (o ajusta si ya existe).
   - Agrega todos los archivos (`git add .`), realiza el commit (`git commit -m "feat: Implement Wearable Comparison Web App with Whoop, official images and filters"`).
   - Haz push de la rama principal (`git push -u origin main` o `master`).

6. **Entrega de Reporte**:
   - Crea `.agents/worker_m2/handoff.md` con tu reporte (Observation, Logic Chain, Caveats, Conclusion, Verification Method).
   - Envía un mensaje a Orchestrator con `send_message` cuando termines.
