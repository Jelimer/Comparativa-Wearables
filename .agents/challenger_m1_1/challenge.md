# Reporte de Desafío y Pruebas Empíricas — Milestone 1
**Rol**: EMPIRICAL CHALLENGER (Critic / Specialist)
**Fecha**: Agosto 2026
**Veredicto**: `APPROVE`

---

## Challenge Summary

**Overall risk assessment**: LOW

Tras una evaluación exhaustiva y ejecución de un arnés de pruebas automatizado de 62 aserciones sobre los conjuntos de datos completos (`WEARABLES_DATA`: 21 dispositivos; `EREADERS_DATA`: 18 dispositivos), se valida que los cambios implementados por Worker en el Milestone 1 cumplen rigurosamente con los requisitos de negocio y especificaciones de la arquitectura.

---

## Challenges & Attack Surface Analysis

### Challenge 1: Límite superior por defecto del filtro de precio en E-readers
- **Hipótesis desafiada**: Si `maxPrice` inicial estuviese por debajo de 580$, dispositivos insignia como el *reMarkable Paper Pro* ($579) o *BOOX Note Air 3 C* ($499) quedarían ocultos sin que el usuario haya aplicado filtros deliberadamente.
- **Escenario de prueba empírica**: Comparar el estado inicial (`INITIAL_EREADER_FILTERS.maxPrice = 600`) vs un filtro restrictivo de 500$.
- **Resultado empírico**:
  - Con `maxPrice = 600`: Se retornan **18/18 e-readers** (100% del catálogo).
  - Con `maxPrice = 500`: Se retornan **17/18 e-readers** (se excluye exactamente *reMarkable Paper Pro* a $579).
- **Veredicto**: Robusto. El límite de 600$ cubre el 100% de los modelos de e-readers sin truncamiento.

### Challenge 2: Límite superior por defecto del filtro de precio en Wearables
- **Hipótesis desafiada**: Verificar que el precio máximo de catálogo ($899 para *Garmin Epix Pro Gen 2*) se encuentre contenido dentro del rango inicial de 1000$.
- **Resultado empírico**:
  - `max(priceUsd)` en wearables es $899.
  - Con `maxPrice = 1000`: Se retornan **21/21 wearables** (100% del catálogo).
  - Con `maxPrice = 300`: Se retornan exactamente 11 dispositivos económicos/gama media.
  - Con `maxPrice = 40`: Se retornan 0 dispositivos (el dispositivo más económico es *Xiaomi Smart Band 9* a $49).
- **Veredicto**: Robusto.

### Challenge 3: Normalización y Sensibilidad a Mayúsculas/Minúsculas en Búsqueda de Texto
- **Hipótesis desafiada**: Cadenas en mayúsculas, minúsculas, con espacios redundantes o sin coincidencias podrían causar excepciones o inconsistencias en los resultados.
- **Escenarios de prueba**:
  - Query `"oura"` == `"OURA"` == `"OuRa"` (4 resultados idénticos en los 3 casos: *Oura Ring 5*, *Oura Ring 4*, y modelos con mención cruzada).
  - Query `"   oura   "` con espacios en blanco iniciales/finales genera exactamente los mismos 4 resultados gracias al hoisting de `.trim().toLowerCase()`.
  - Query `"     "` (solo espacios) no filtra ningún registro y retorna **21 wearables / 18 e-readers**.
  - Query `"zzz_random_nonexistent_999"` retorna **0 resultados** de forma limpia sin errores de ejecución.
- **Veredicto**: Robusto.

### Challenge 4: Alcance Multidimensional de Búsqueda vs Filtro Específico de Marca
- **Observación empírica**: Se verificó el comportamiento cuando el usuario busca un término de marca en el cuadro de búsqueda vs cuando pulsa el botón de filtro de marca.
  - **Filtro de Marca `selectedBrands: ['Amazon Kindle']`**: Devuelve **exactamente los 6 modelos** de Amazon Kindle.
  - **Búsqueda textual `searchQuery: 'kindle'`**: Devuelve **10 modelos** (los 6 de Amazon Kindle + 4 modelos de competidores como Lenovo Smart Paper, Kobo Elipsa 2E, BOOX Palma y BOOX Page que comparan explícitamente sus ventajas o compatibilidad con la app Kindle en sus pros/cons/descripción).
  - **Filtro de Marca `selectedBrands: ['Google/Fitbit']`**: Devuelve **exactamente los 5 modelos** autorizados de Google/Fitbit.
  - **Búsqueda textual `searchQuery: 'pixel'`**: Devuelve **3 modelos** (Pixel Watch 5, Pixel Watch 4 y Fitbit Sense 2 que compara su UI con el Pixel Watch).
- **Conclusión de UX**: Este comportamiento es el esperado para un comparador técnico omnibox, donde el usuario que busca "kindle" desea encontrar tanto los Kindles como las alternativas que compiten contra él, mientras que el selector de facetas restringe estrictamente por fabricante.

### Challenge 5: Descarte Rápido (Fast-Fail) y Algoritmo de Ordenación
- **Eficiencia computacional**:
  1. Comparaciones numéricas $O(1)$ (`priceUsd`, `batteryHours`)
  2. Banderas booleanas $O(1)$ (`sensors`, `colorScreenOnly`, etc.)
  3. Comprobaciones de arrays pequeños $O(k)$ (`selectedBrands`, `selectedCategories`)
  4. Búsqueda de texto en strings $O(n \cdot m)$ ejecutada exclusivamente al final sobre los sobrevivientes.
- **Ordenaciones verificadas**:
  - `price_asc`: $49 (*Xiaomi Band 9*) $\to$ $899 (*Garmin Epix Pro*).
  - `price_desc`: $899 $\to$ $49.
  - `battery_desc`: 744h (31 días) $\to$ 36h.
  - `screen_desc`: 11.8" (*reMarkable Paper Pro*) $\to$ 6.0" (*Kindle Básico*).
- **Veredicto**: Ordenaciones 100% matemáticas y estables.

---

## Stress Test Results Matrix (62 / 62 Passed)

| Suite | Pruebas | Exitosas | Fallidas | Estado |
|---|---|---|---|---|
| 1. Integridad de Datasets & IDs únicos | 4 | 4 | 0 | **PASS** |
| 2. Estado Inicial (21 wearables, 18 ereaders) | 2 | 2 | 0 | **PASS** |
| 3. Límites de Precios y Umbrales (1000$ / 600$) | 4 | 4 | 0 | **PASS** |
| 4. Filtros de Marca Individuales (9 Wearables, 6 Ereaders) | 15 | 15 | 0 | **PASS** |
| 5. Filtros de Categoría Formato (3 Wearables, 4 Ereaders) | 7 | 7 | 0 | **PASS** |
| 6. Sensores Médicos & Banderas de Hardware (7 Sensores, 7 Ereader Toggles) | 14 | 14 | 0 | **PASS** |
| 7. Normalización y Resiliencia de Búsqueda | 8 | 8 | 0 | **PASS** |
| 8. Algoritmos de Ordenación Multicriterio | 4 | 4 | 0 | **PASS** |
| 9. Combinaciones Complejas Multifiltro | 4 | 4 | 0 | **PASS** |
| **TOTAL** | **62** | **62** | **0** | **PASS (100%)** |

---

## Build Verification

- **Comando ejecutado**: `npm run build` (`tsc && vite build`)
- **Resultado**: Código de salida 0
- **Módulos transformados**: 1607 módulos
- **Errores de TypeScript**: 0
- **Advertencias de compilación**: 0
- **Tamaño de salida**:
  - `dist/index.html`: 1.04 kB (gzip: 0.58 kB)
  - `dist/assets/index-Cb0T2FFj.css`: 46.68 kB (gzip: 7.92 kB)
  - `dist/assets/index-DNqcrzAj.js`: 367.10 kB (gzip: 95.37 kB)

---

## Veredicto Final

**VEREDICTO**: `APPROVE`

El trabajo realizado en el Milestone 1 por Worker cumple con el 100% de los criterios de aceptación técnicos, la integridad de los datos a agosto de 2026, la consistencia de contadores dinámicos y la robustez del motor de búsqueda y filtrado.
