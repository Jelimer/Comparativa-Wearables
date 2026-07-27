# Project: Comparativa Wearables Web App

## Architecture
Aplicación Web SPA construida con Vite, React, TypeScript y Tailwind CSS para despliegue óptimo e instantáneo en Vercel.
- **Componentes de UI**: Header, FilterBar, DeviceGrid, DeviceCard, ComparisonDrawer/Modal, RecommendationSection, FeatureMatrix, Footer.
- **Estado Global/Contexto**: React Context / Custom Hooks (`useWearables`) para manejar selección de filtros, búsqueda, lista de comparación (hasta 4 dispositivos lado a lado) y modo oscuro/claro.
- **Datos de Dispositivos**: `src/data/wearables.ts` estructurado con tipos TypeScript estrictos (`Wearable`), métricas médicas, pros/contras, precios, batería, URLs de imágenes oficiales, badges ("Mejor Opción Global", "Más Económica", "Mejor Calidad/Precio").

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Recolección de Datos & Imágenes Oficiales | Extraer todos los wearables de `informe_wearables_salud.md` + investigar especificaciones e imágenes oficiales de Whoop 4.0/5.0, Apple Watch Series/Ultra, Xiaomi, etc. | none | IN_PROGRESS |
| 2 | Desarrollo Frontend & UI Premium | Inicializar proyecto Vite React Tailwind y construir la UI interactiva (Filtros, Grid, Comparador Side-by-Side, Recomendaciones) | M1 | PLANNED |
| 3 | Verificación de Build & Git Push | Ejecutar `npm run build` sin errores, inicializar Git, commit y push a `https://github.com/Jelimer/Comparativa-Wearables` | M2 | PLANNED |
| 4 | Auditoría Forense de Integridad | Auditoría forense independiente para garantizar que no hay mocks tramposos, el código es genuino y compila perfectamente | M3 | PLANNED |

## Interface Contracts & Data Schema
```typescript
export interface Wearable {
  id: string;
  name: string;
  brand: 'Google/Fitbit' | 'Garmin' | 'Samsung' | 'Oura' | 'Whoop' | 'RingConn' | 'Signal' | 'Apple' | 'Xiaomi';
  category: 'smartwatch' | 'band' | 'ring';
  priceUsd: number;
  batteryLife: string; // e.g. "24-36h", "7 días", "10 días"
  batteryHours: number; // para ordenamiento por batería
  subscriptionRequired: boolean;
  subscriptionCost?: string; // e.g. "$6/mes" o "$30/mes"
  imageUrl: string; // URL real del sitio oficial de la marca
  officialSiteUrl: string;
  ecosystem: ('iOS' | 'Android' | 'Samsung')[];
  rating: number; // 1-5
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
```

## Code Layout
```
c:\Users\jelim\.gemini\antigravity\scratch\comparativa-wearables\
├── .agents/                    # Metadatos de coordinación de subagentes
├── public/                     # Assets estáticos y favicons
├── src/
│   ├── components/             # Componentes modulares React
│   │   ├── Header.tsx
│   │   ├── FilterBar.tsx
│   │   ├── DeviceCard.tsx
│   │   ├── ComparisonModal.tsx
│   │   ├── RecommendationBanner.tsx
│   │   └── Footer.tsx
│   ├── data/
│   │   └── wearables.ts        # Dataset completo con todos los wearables + Whoop + URLs de imágenes oficiales
│   ├── types/
│   │   └── wearable.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── index.html
├── ORIGINAL_REQUEST.md
├── informe_wearables_salud.md
└── PROJECT.md
```
