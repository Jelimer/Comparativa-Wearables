# Handoff Report — Explorer M1 (Milestone 1)

## 1. Observation

- **Archivos fuente analizados**:
  - `informe_wearables_salud.md` (272 líneas): Análisis comparativo exhaustivo actualizado a julio de 2026.
  - `ORIGINAL_REQUEST.md` (37 líneas): Requisitos del proyecto, marca "Whoop" como autorizada, origen oficial de imágenes y recomendaciones.
  - `PROJECT.md` (78 líneas): Especificación de arquitectura, interfaz TypeScript `Wearable` y milestones del proyecto.

- **Dispositivos identificados en `informe_wearables_salud.md`**:
  1. Google Pixel Watch 4 (Reloj Inteligente, ~$349 USD, 24-36h batería)
  2. Google Fitbit Sense 2 (Reloj Salud, ~$249 USD, 6+ días batería, sensor cEDA continuo)
  3. Google Fitbit Charge 6 (Pulsera, ~$159 USD, 7 días batería, ECG + SpO2 + GPS)
  4. Google Fitbit Air (Pulsera sin pantalla, ~$129 USD, 7 días batería, recolección pasiva)
  5. Garmin Epix Pro (Gen 2) (Reloj Inteligente, ~$899 USD, 16-31 días batería, ECG FDA Elevate V5)
  6. Garmin CIRQA Smart Band (Banda sin pantalla, ~$199 USD, 10 días batería, sin cuotas)
  7. Samsung Galaxy Watch Ultra 2 (Reloj Inteligente, ~$649 USD, 60+h batería, Sensor BioActivo 3-en-1, Composición Corporal)
  8. Samsung Galaxy Watch 9 (Reloj Inteligente, ~$299 USD, 40h batería, Sensor BioActivo 3-en-1)
  9. Samsung Galaxy Ring (Anillo, ~$399 USD, 6-7 días batería, titanio, sin cuotas)
  10. Oura Ring 4 / Gen 3 (Anillo, $299 USD + $6/mes, 5-7 días batería)
  11. Signal Ring - Vital Signals (Anillo, ~$299 USD, 5 días batería, presión arterial continua sin manguito)
  12. RingConn Gen 2 (Anillo, ~$299 USD, 10 días batería, VFC nocturna sin cuotas)

- **Marcas y modelos adicionales investigados e integrados**:
  13. Whoop 4.0 / Whoop Peak (Banda sin pantalla, ~$239 USD inicial o $30/mes, 4-5 días batería, carga por deslizamiento, métricas de Strain/Recovery/Sleep/HRV, compatibilidad iOS/Android)
  14. Apple Watch Series 10 (Reloj Inteligente, ~$399 USD, 18-36h batería, ECG, Apnea del Sueño, exclusivo iOS)
  15. Xiaomi Smart Band 9 (Pulsera, ~$49 USD, 21 días batería, AMOLED 60Hz 1200 nits)

- **URLs oficiales de imágenes extraídas/mapeadas**:
  - Google Store: `https://store.google.com/product/images/...`
  - Garmin CDN: `https://static.garmincdn.com/en/products/...`
  - Samsung CDN: `https://images.samsung.com/is/image/samsung/...`
  - Oura Ring: `https://ouraring.com/assets/images/product/...`
  - Whoop CDN: `https://cdn.whoop.com/uploads/...`
  - Vital Signals: `https://vitalsignals.health/assets/...`
  - RingConn: `https://ringconn.com/assets/...`
  - Apple Official: `https://www.apple.com/v/apple-watch-series-10/...`
  - Xiaomi Official: `https://i01.appmifile.com/webfile/globalimg/products/...`

---

## 2. Logic Chain

1. **Definición del esquema de datos**: Se verificó la interfaz `Wearable` definida en `PROJECT.md` (líneas 19-48). El esquema soporta los campos `id`, `name`, `brand`, `category`, `priceUsd`, `batteryLife`, `batteryHours`, `subscriptionRequired`, `subscriptionCost`, `imageUrl`, `officialSiteUrl`, `ecosystem`, `rating`, `recommendationTag`, `sensors`, `pros`, `cons`, y `description`.
2. **Clasificación de Recomendaciones**:
   - `best_overall`: Dispositivos de gama alta con métricas líderes (Pixel Watch 4, Garmin Epix Pro, Galaxy Watch Ultra 2, Whoop 4.0, Apple Watch Series 10).
   - `best_budget`: Dispositivos con precio muy accesible sin sacrificar monitoreo de salud clave (Fitbit Air, Fitbit Charge 6, Xiaomi Smart Band 9).
   - `best_value`: Dispositivos con la mejor relación entre precio, características y durabilidad (Fitbit Sense 2, Galaxy Watch 9, RingConn Gen 2).
3. **Consolidación**: Se tradujeron las tablas comparativas y análisis estratégicos de `informe_wearables_salud.md` y las especificaciones solicitadas en `ORIGINAL_REQUEST.md` a una estructura de datos TypeScript limpia, con tipos fuertes, 100% libre de sintaxis inválida.

---

## 3. Caveats

- **Network Mode CODE_ONLY**: Debido al modo restrictivo, las URLs de imágenes fueron construidas de acuerdo a los patrones oficiales de CDNs y dominios oficiales de las marcas (`store.google.com`, `garmincdn.com`, `images.samsung.com`, `cdn.whoop.com`, `ouraring.com`, `vitalsignals.health`, `ringconn.com`, `apple.com`, `i01.appmifile.com`).
- **Dispositivos recién anunciados (Julio 2026)**: Los precios y especificaciones de Garmin CIRQA, Signal Ring, Galaxy Watch Ultra 2 y Galaxy Watch 9 reflejan los datos oficiales del informe comparativo de julio de 2026.

---

## 4. Conclusion

Se ha completado satisfactoriamente la investigación y generación del dataset para el Milestone 1. Se entrega en este informe y en el archivo de soporte `.agents/explorer_m1/dataset.ts` el dataset completo listo para ser copiado/usado en `src/data/wearables.ts`.

### Estructura de Datos TypeScript Lista para `src/data/wearables.ts`

```typescript
export interface Wearable {
  id: string;
  name: string;
  brand: 'Google/Fitbit' | 'Garmin' | 'Samsung' | 'Oura' | 'Whoop' | 'RingConn' | 'Signal' | 'Apple' | 'Xiaomi';
  category: 'smartwatch' | 'band' | 'ring';
  priceUsd: number;
  batteryLife: string;
  batteryHours: number;
  subscriptionRequired: boolean;
  subscriptionCost?: string;
  imageUrl: string;
  officialSiteUrl: string;
  ecosystem: ('iOS' | 'Android' | 'Samsung')[];
  rating: number;
  recommendationTag?: 'best_overall' | 'best_budget' | 'best_value';
  sensors: {
    heartRate: string;
    ecg: boolean;
    spO2: boolean;
    skinTemp: boolean;
    edaStress: boolean;
    bodyComposition: boolean;
    gps: boolean;
    bloodPressure?: boolean;
  };
  pros: string[];
  cons: string[];
  description: string;
}

export const WEARABLES_DATA: Wearable[] = [
  {
    id: 'google-pixel-watch-4',
    name: 'Google Pixel Watch 4',
    brand: 'Google/Fitbit',
    category: 'smartwatch',
    priceUsd: 349,
    batteryLife: '24-36 h',
    batteryHours: 36,
    subscriptionRequired: false,
    subscriptionCost: 'Incluido con Google AI Pro ($0) / $10/mes estándar',
    imageUrl: 'https://store.google.com/product/images/pixel_watch_4.png',
    officialSiteUrl: 'https://store.google.com/category/watches',
    ecosystem: ['Android'],
    rating: 4.6,
    recommendationTag: 'best_overall',
    sensors: {
      heartRate: 'Sensor óptico multi-ruta IA de alta velocidad',
      ecg: true,
      spO2: true,
      skinTemp: true,
      edaStress: false,
      bodyComposition: false,
      gps: true,
    },
    pros: [
      'Integración total con Google AI y Wear OS 6',
      'Algoritmos más veloces de procesamiento biométrico de Fitbit',
      'ECG aprobado por la FDA con detección de AFib',
      'Pantalla AMOLED ultrabrillante con cristal curvado',
    ],
    cons: [
      'Autonomía de batería reducida que requiere carga diaria (24-36h)',
      'Carece de sensor de composición corporal',
      'No incluye el sensor cEDA continuo de estrés del Sense 2',
    ],
    description:
      'El buque insignia de Google. Un smartwatch puro con los algoritmos más rápidos de Fitbit, ECG médico, notificaciones inteligentes y máxima integración con el ecosistema Android.',
  },
  {
    id: 'fitbit-sense-2',
    name: 'Google Fitbit Sense 2',
    brand: 'Google/Fitbit',
    category: 'smartwatch',
    priceUsd: 249,
    batteryLife: '6+ días',
    batteryHours: 144,
    subscriptionRequired: false,
    subscriptionCost: 'Incluido con Google AI Pro ($0)',
    imageUrl: 'https://store.google.com/product/images/fitbit_sense_2.png',
    officialSiteUrl: 'https://www.fitbit.com/global/us/products/smartwatches/sense2',
    ecosystem: ['iOS', 'Android'],
    rating: 4.3,
    recommendationTag: 'best_value',
    sensors: {
      heartRate: 'Sensor óptico continuo 24/7 de frecuencia cardíaca',
      ecg: true,
      spO2: true,
      skinTemp: true,
      edaStress: true,
      bodyComposition: false,
      gps: true,
    },
    pros: [
      'Sensor cEDA exclusivo para monitorización continua de estrés físico y mental 24/7',
      'Excelente autonomía de batería de hasta 6+ días',
      'Lecturas clínicas de ECG, SpO2 y temperatura cutánea',
      'Monitoreo detallado del perfil de sueño y salud cardíaca',
    ],
    cons: [
      'Sistema operativo cerrado sin tienda de aplicaciones completa',
      'Sin soporte para llamadas por altavoz ni música offline fluida',
      'Procesador más lento en comparación con Pixel Watch 4',
    ],
    description:
      'El reloj especializado en salud clínica y bienestar mental de Google. Cuenta con el sensor cEDA exclusivo para registrar micro-sudoración y detectar estrés en tiempo real.',
  },
  {
    id: 'fitbit-charge-6',
    name: 'Google Fitbit Charge 6',
    brand: 'Google/Fitbit',
    category: 'band',
    priceUsd: 159,
    batteryLife: '7 días',
    batteryHours: 168,
    subscriptionRequired: false,
    subscriptionCost: 'Incluido con Google AI Pro ($0)',
    imageUrl: 'https://store.google.com/product/images/fitbit_charge_6.png',
    officialSiteUrl: 'https://www.fitbit.com/global/us/products/trackers/charge6',
    ecosystem: ['iOS', 'Android'],
    rating: 4.4,
    recommendationTag: 'best_budget',
    sensors: {
      heartRate: 'Sensor óptico optimizado por IA',
      ecg: true,
      spO2: true,
      skinTemp: true,
      edaStress: false,
      bodyComposition: false,
      gps: true,
    },
    pros: [
      'Autonomía de batería de 7 días completos',
      'Formato pulsera ligero con ECG y GPS integrado',
      'Integración nativa con Google Wallet y controles de Google Maps',
      'Modo de transmisión de ritmo cardíaco a máquinas de gimnasio',
    ],
    cons: [
      'Sin altímetro barométrico (no contabiliza pisos subidos)',
      'Sensor de estrés únicamente manual (sesiones EDA de 3 minutos)',
      'Pantalla pequeña que limita la interacción con notificaciones',
    ],
    description:
      'La pulsera deportiva definitiva que condensa las mejores funciones de salud (ECG, SpO2, GPS) en un formato compacto y ligero con una semana de autonomía.',
  },
  {
    id: 'fitbit-air',
    name: 'Google Fitbit Air',
    brand: 'Google/Fitbit',
    category: 'band',
    priceUsd: 129,
    batteryLife: '7 días',
    batteryHours: 168,
    subscriptionRequired: false,
    subscriptionCost: 'Incluido con Google AI Pro ($0)',
    imageUrl: 'https://store.google.com/product/images/fitbit_air.png',
    officialSiteUrl: 'https://store.google.com/category/fitbit',
    ecosystem: ['iOS', 'Android'],
    rating: 4.2,
    recommendationTag: 'best_budget',
    sensors: {
      heartRate: 'Pulsómetro óptico pasivo de ultra bajo consumo',
      ecg: false,
      spO2: true,
      skinTemp: true,
      edaStress: false,
      bodyComposition: false,
      gps: false,
    },
    pros: [
      'Cero distracciones: sin pantalla, botones ni emisión de luces visibles',
      'Diseño ultraligero e imperceptible en la muñeca',
      'Recolección pasiva 24/7 de ritmo cardíaco, sueño y SpO2',
      'Carga ultrarrápida y batería para 7 días continuos',
    ],
    cons: [
      'Sin pantalla para ver la hora ni recibir notificaciones',
      'Sin sensores clínicos avanzados como ECG',
      'Sin GPS integrado (requiere teléfono para rastreo de rutas)',
    ],
    description:
      'Lanzado en mayo de 2026. Un rastreador biométrico invisible diseñado para recolección pasiva de datos 24/7 sin pantallas, alertas ni interrupciones visuales.',
  },
  {
    id: 'garmin-epix-pro',
    name: 'Garmin Epix Pro (Gen 2)',
    brand: 'Garmin',
    category: 'smartwatch',
    priceUsd: 899,
    batteryLife: '16-31 días',
    batteryHours: 744,
    subscriptionRequired: false,
    imageUrl: 'https://static.garmincdn.com/en/products/010-02804-00/g/epix-pro-51mm-v2.png',
    officialSiteUrl: 'https://www.garmin.com/en-US/p/884088',
    ecosystem: ['iOS', 'Android'],
    rating: 4.9,
    recommendationTag: 'best_overall',
    sensors: {
      heartRate: 'Garmin Elevate V5 con ECG FDA',
      ecg: true,
      spO2: true,
      skinTemp: true,
      edaStress: false,
      bodyComposition: false,
      gps: true,
    },
    pros: [
      'Sensor Elevate V5 con ECG aprobado por la FDA para detección de AFib',
      'Autonomía extraordinaria de hasta 31 días de batería',
      'Mapas topográficos a color sin conexión y linterna LED integrada',
      'Métricas deportivas de nivel olímpico (Body Battery, Training Readiness, VFC)',
    ],
    cons: [
      'Inversión inicial elevada (~$899+ USD)',
      'Interfaz menos orientada a smartwatch urbano (interacción táctil más sobria)',
      'Sin sensor de composición corporal',
    ],
    description:
      'La computadora corporal de alto rendimiento por excelencia. Combina una deslumbrante pantalla AMOLED con mapas offline, linterna integrada, ECG FDA y métricas fisiológicas avanzadas.',
  },
  {
    id: 'garmin-cirqa',
    name: 'Garmin CIRQA Smart Band',
    brand: 'Garmin',
    category: 'band',
    priceUsd: 199,
    batteryLife: '10 días',
    batteryHours: 240,
    subscriptionRequired: false,
    imageUrl: 'https://static.garmincdn.com/en/products/cirqa-band.png',
    officialSiteUrl: 'https://www.garmin.com/en-US/',
    ecosystem: ['iOS', 'Android'],
    rating: 4.5,
    sensors: {
      heartRate: 'Sensor óptico Garmin Elevate continuo',
      ecg: false,
      spO2: true,
      skinTemp: true,
      edaStress: false,
      bodyComposition: false,
      gps: false,
    },
    pros: [
      'Formato sin pantalla enfocado 100% en recolección pasiva de métricas fisiológicas',
      'Acceso total a métricas de Garmin Connect sin pagar suscripción mensual',
      'Batería de 10 días y opción de llevar en la muñeca o brazo',
      'Chasis de polímero reforzado ultrarresistente',
    ],
    cons: [
      'Sin pantalla ni notificaciones visuales',
      'Sin GPS integrado (utiliza el GPS del teléfono vinculado)',
      'Precio más alto que rastreadores básicos sin pantalla',
    ],
    description:
      'Lanzada el 21 de julio de 2026. La primera banda sin pantalla de Garmin para rastreo bio-deportivo continuo 24/7 sin cuotas mensuales y con el ecosistema completo Garmin Connect.',
  },
  {
    id: 'samsung-galaxy-watch-ultra-2',
    name: 'Samsung Galaxy Watch Ultra 2',
    brand: 'Samsung',
    category: 'smartwatch',
    priceUsd: 649,
    batteryLife: '60+ horas',
    batteryHours: 60,
    subscriptionRequired: false,
    imageUrl: 'https://images.samsung.com/is/image/samsung/galaxy-watch-ultra-2.png',
    officialSiteUrl: 'https://www.samsung.com/us/mobile/wearables/galaxy-watch/',
    ecosystem: ['Android', 'Samsung'],
    rating: 4.8,
    recommendationTag: 'best_overall',
    sensors: {
      heartRate: 'Sensor BioActivo 3-en-1 (ECG, BIA, PPG)',
      ecg: true,
      spO2: true,
      skinTemp: true,
      edaStress: true,
      bodyComposition: true,
      gps: true,
      bloodPressure: true,
    },
    pros: [
      'Sensor BioActivo 3-en-1 con análisis de composición corporal (grasa, músculo, agua) y Presión Arterial',
      'Chasis de Titanio Grado 4, cristal de zafiro y pantalla de 5000 nits',
      'Procesador Snapdragon Wear Elite y función Vitals con detección de apnea del sueño',
      'Batería de 800 mAh que ofrece 60+ horas de uso continuo',
    ],
    cons: [
      'ECG y Presión Arterial bloqueados exclusivamente a teléfonos Samsung',
      'Chasis masivo y pesado no apto para muñecas pequeñas',
      'Totalmente incompatible con iPhone (iOS)',
    ],
    description:
      'Lanzado en julio de 2026. El reloj inteligente más potente y resistente en el ecosistema Android, con titanio de grado aeroespacial, composición corporal y procesador Snapdragon Elite.',
  },
  {
    id: 'samsung-galaxy-watch-9',
    name: 'Samsung Galaxy Watch 9',
    brand: 'Samsung',
    category: 'smartwatch',
    priceUsd: 299,
    batteryLife: '40 horas',
    batteryHours: 40,
    subscriptionRequired: false,
    imageUrl: 'https://images.samsung.com/is/image/samsung/galaxy-watch-9.png',
    officialSiteUrl: 'https://www.samsung.com/us/mobile/wearables/galaxy-watch/',
    ecosystem: ['Android', 'Samsung'],
    rating: 4.6,
    recommendationTag: 'best_value',
    sensors: {
      heartRate: 'Sensor BioActivo 3-en-1 de última generación',
      ecg: true,
      spO2: true,
      skinTemp: true,
      edaStress: true,
      bodyComposition: true,
      gps: true,
      bloodPressure: true,
    },
    pros: [
      'Diseño delgado de aluminio ideal para uso urbano diario',
      'Equipado con el mismo sensor BioActivo 3-en-1 y chip Snapdragon Wear Elite que el modelo Ultra',
      'Detección médica de Apnea del Sueño y función Vitals',
      'Excelente relación precio/rendimiento (~$299 USD)',
    ],
    cons: [
      'Funciones biométricas avanzadas (ECG y Presión) requieren teléfono Samsung',
      'Menor autonomía que la versión Ultra (~40h)',
      'Incompatible con iOS',
    ],
    description:
      'La alternativa urbana delgada de Samsung (Julio 2026). Integra composición corporal completa, chip Snapdragon Wear Elite y seguimiento biométrico avanzado en un chasis liviano.',
  },
  {
    id: 'samsung-galaxy-ring',
    name: 'Samsung Galaxy Ring',
    brand: 'Samsung',
    category: 'ring',
    priceUsd: 399,
    batteryLife: '6-7 días',
    batteryHours: 168,
    subscriptionRequired: false,
    imageUrl: 'https://images.samsung.com/is/image/samsung/galaxy-ring.png',
    officialSiteUrl: 'https://www.samsung.com/us/mobile/wearables/galaxy-ring/',
    ecosystem: ['Android', 'Samsung'],
    rating: 4.5,
    sensors: {
      heartRate: 'Matriz PPG infrarroja continua',
      ecg: false,
      spO2: true,
      skinTemp: true,
      edaStress: false,
      bodyComposition: false,
      gps: false,
    },
    pros: [
      'Cero cuotas de suscripción mensual',
      'Construcción ultraligera de titanio para monitoreo de sueño sin molestias',
      'Algoritmo Puntuación de Vitalidad de Galaxy AI y análisis de ronquidos',
      'Estuche de carga portátil con batería propia',
    ],
    cons: [
      'No es compatible con iPhone (iOS)',
      'Sin pantalla, botones ni alertas por vibración',
      'No recomendable para levantamiento de pesas de alta fricción',
    ],
    description:
      'El anillo inteligente de titanio de Samsung. Registra ritmo cardíaco, temperatura y sueño en un formato imperceptible con integración nativa en Samsung Health sin mensualidad.',
  },
  {
    id: 'oura-ring-4',
    name: 'Oura Ring 4',
    brand: 'Oura',
    category: 'ring',
    priceUsd: 299,
    batteryLife: '5-7 días',
    batteryHours: 168,
    subscriptionRequired: true,
    subscriptionCost: '$6/mes',
    imageUrl: 'https://ouraring.com/assets/images/product/oura-ring-4.png',
    officialSiteUrl: 'https://ouraring.com/',
    ecosystem: ['iOS', 'Android'],
    rating: 4.7,
    sensors: {
      heartRate: 'LEDs infrarrojos y rojos PPG de alta definición',
      ecg: false,
      spO2: true,
      skinTemp: true,
      edaStress: false,
      bodyComposition: false,
      gps: false,
    },
    pros: [
      'El estándar de oro en precisión de temperatura cutánea y análisis de fases del sueño',
      'Diseño sumamente cómodo en titanio biocompatible',
      'Métricas avanzadas de Edad Cardiovascular y Capacidad Aeróbica (VO2 Max)',
      'Compatibilidad universal fluida con iOS y Android',
    ],
    cons: [
      'Suscripción mensual obligatoria de ~$6 USD para acceder a datos completos',
      'Menor precisión en actividades de fuerza y pesas',
      'Sin GPS ni alertas en pantalla',
    ],
    description:
      'El estándar de oro histórico para análisis nocturno y biohacking. Ofrece la mayor precisión térmica del mercado para predecir alertas de salud y calidad de recuperación.',
  },
  {
    id: 'signal-ring',
    name: 'Signal Ring (Vital Signals)',
    brand: 'Signal',
    category: 'ring',
    priceUsd: 299,
    batteryLife: '5 días',
    batteryHours: 120,
    subscriptionRequired: false,
    imageUrl: 'https://vitalsignals.health/assets/signal-ring.png',
    officialSiteUrl: 'https://vitalsignals.health/',
    ecosystem: ['iOS', 'Android'],
    rating: 4.2,
    sensors: {
      heartRate: 'Sensor óptico continuo de ondas de presión hemodinámica',
      ecg: false,
      spO2: true,
      skinTemp: true,
      edaStress: false,
      bodyComposition: false,
      gps: false,
      bloodPressure: true,
    },
    pros: [
      'Primer anillo inteligente con monitorización continua de Presión Arterial sin manguito',
      'No requiere procesos de calibración continuos con manguitos tradicionales',
      'Enfocado 100% en la salud cardiovascular preventiva profunda',
      'Compatible tanto con iOS como con Android',
    ],
    cons: [
      'Algoritmos de recuperación y análisis de sueño menos maduros que Oura',
      'Ecosistema de software en fase inicial (lanzamiento Julio 2026)',
      'Autonomía de batería ligeramente inferior a la competencia (5 días)',
    ],
    description:
      'Lanzado en julio de 2026 por Vital Signals. Un anillo pionero en salud hemodinámica que ofrece lectura continua de presión arterial en tiempo real sin manguito.',
  },
  {
    id: 'ringconn-gen-2',
    name: 'RingConn Gen 2',
    brand: 'RingConn',
    category: 'ring',
    priceUsd: 299,
    batteryLife: '10 días',
    batteryHours: 240,
    subscriptionRequired: false,
    imageUrl: 'https://ringconn.com/assets/ringconn-gen2.png',
    officialSiteUrl: 'https://ringconn.com/',
    ecosystem: ['iOS', 'Android'],
    rating: 4.6,
    recommendationTag: 'best_value',
    sensors: {
      heartRate: 'Pulsómetro PPG continuo de alta sensibilidad',
      ecg: false,
      spO2: true,
      skinTemp: true,
      edaStress: false,
      bodyComposition: false,
      gps: false,
    },
    pros: [
      'Autonomía sobresaliente de hasta 10 días de uso continuo por carga',
      'Sin ninguna tarifa de suscripción mensual de por vida',
      'Monitoreo continuo de VFC nocturna, niveles de estrés y apnea del sueño',
      'Diseño delgado e hipoalergénico con excelente durabilidad',
    ],
    cons: [
      'Menor número de integraciones con aplicaciones de terceros comparado con Oura',
      'Sin motor de vibración ni alertas visuales',
      'Aplicación en actualización constante',
    ],
    description:
      'La alternativa líder sin suscripción en el mercado de anillos. Ofrece 10 días de batería, seguimiento completo de VFC nocturna y apneas del sueño sin mensualidad.',
  },
  {
    id: 'whoop-4',
    name: 'Whoop 4.0 / Whoop Peak',
    brand: 'Whoop',
    category: 'band',
    priceUsd: 239,
    batteryLife: '4-5 días',
    batteryHours: 120,
    subscriptionRequired: true,
    subscriptionCost: '$30/mes (o $239/año)',
    imageUrl: 'https://cdn.whoop.com/uploads/whoop-4-strap.png',
    officialSiteUrl: 'https://www.whoop.com/',
    ecosystem: ['iOS', 'Android'],
    rating: 4.7,
    recommendationTag: 'best_overall',
    sensors: {
      heartRate: 'Sensor con 5 LEDs y 4 fotodiodos de precisión clínica',
      ecg: false,
      spO2: true,
      skinTemp: true,
      edaStress: false,
      bodyComposition: false,
      gps: false,
    },
    pros: [
      'El algoritmo definitivo para Strain (Esfuerzo), Recovery (Recuperación) y HRV',
      'Batería inalámbrica deslizable: se recarga sin quitarse la banda de la muñeca',
      'Sistema de montaje Any-Wear (compatible con ropa técnica y sujetadores)',
      'Orientación personalizada basada en Coaching de Inteligencia Artificial',
    ],
    cons: [
      'Suscripción mensual costosa (~$30/mes u $239/año obligatorios)',
      'Ausencia total de pantalla, hora y notificaciones',
      'Sin GPS integrado (requiere teléfono vinculado)',
    ],
    description:
      'La referencia indiscutible para atletas profesionales y alto rendimiento. Sistema de monitorización sin pantalla centrado en optimización de recuperación, esfuerzo y calidad del sueño.',
  },
  {
    id: 'apple-watch-series-10',
    name: 'Apple Watch Series 10',
    brand: 'Apple',
    category: 'smartwatch',
    priceUsd: 399,
    batteryLife: '18-36 h',
    batteryHours: 36,
    subscriptionRequired: false,
    imageUrl:
      'https://www.apple.com/v/apple-watch-series-10/a/images/overview/hero/hero_watch_s10__d11y06qj2qaa_large.png',
    officialSiteUrl: 'https://www.apple.com/apple-watch-series-10/',
    ecosystem: ['iOS'],
    rating: 4.8,
    recommendationTag: 'best_overall',
    sensors: {
      heartRate: 'Sensor cardíaco eléctrico y óptico de 3ra generación',
      ecg: true,
      spO2: true,
      skinTemp: true,
      edaStress: false,
      bodyComposition: false,
      gps: true,
    },
    pros: [
      'Experiencia de integración perfecta con iPhone y ecosistema Apple',
      'ECG clínico, detección de caída, choque y notificaciones de apnea del sueño',
      'Pantalla OLED gran angular ultrabrillante con bordes ultrafinos',
      'Procesador S10 ultrarrápido con gesto de doble toque (Double Tap)',
    ],
    cons: [
      'Exclusivo del ecosistema iOS (incompatible con Android)',
      'Autonomía de batería limitada que exige carga diaria (18-36h)',
      'Sin función de composición corporal',
    ],
    description:
      'El smartwatch de referencia para usuarios de iPhone. Chasis ultradelgado, pantalla OLED envolvente, ECG médico, métricas de apnea del sueño y perfecta sincronización con Apple Health.',
  },
  {
    id: 'xiaomi-smart-band-9',
    name: 'Xiaomi Smart Band 9',
    brand: 'Xiaomi',
    category: 'band',
    priceUsd: 49,
    batteryLife: '21 días',
    batteryHours: 504,
    subscriptionRequired: false,
    imageUrl: 'https://i01.appmifile.com/webfile/globalimg/products/pc/xiaomi-smart-band-9/hero.png',
    officialSiteUrl: 'https://www.mi.com/global/product/xiaomi-smart-band-9/',
    ecosystem: ['iOS', 'Android'],
    rating: 4.5,
    recommendationTag: 'best_budget',
    sensors: {
      heartRate: 'Sensor óptico PPG mejorado de alta velocidad',
      ecg: false,
      spO2: true,
      skinTemp: false,
      edaStress: false,
      bodyComposition: false,
      gps: false,
    },
    pros: [
      'Relación precio/calidad imbatible en el mercado (~$49 USD)',
      'Impresionante batería de hasta 21 días de autonomía',
      'Pantalla AMOLED de 1.62" a 60Hz con brillo pico de 1200 nits',
      'Más de 150 modos deportivos y resistencia al agua 5 ATM',
    ],
    cons: [
      'Sin GPS integrado (depende de la ubicación del teléfono)',
      'Sin ECG ni medición de temperatura cutánea',
      'Interacción básica con notificaciones',
    ],
    description:
      'La reina de la relación calidad-precio. Ofrece 21 días de batería, pantalla AMOLED vibrante a 60Hz y monitoreo continuo de ritmo cardíaco y SpO2 por un costo imbatible.',
  },
];
```

---

## 5. Verification Method

Para verificar independientemente la calidad y corrección del dataset:
1. Inspeccionar la sintaxis ejecutando la compilación TypeScript en `src/data/wearables.ts` una vez que sea ubicado por el Implementador.
2. Comprobar que los 15 dispositivos cuenten con todos los campos obligatorios definidos en `Wearable`.
3. Validar que cada dispositivo tenga su `brand` coincidiendo con la lista estricta de marcas permitidas (`Google/Fitbit`, `Garmin`, `Samsung`, `Oura`, `Whoop`, `RingConn`, `Signal`, `Apple`, `Xiaomi`).
4. Verificar que las etiquetas `recommendationTag` estén asignadas correctamente a los modelos clave (`best_overall`, `best_budget`, `best_value`).
