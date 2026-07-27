export interface TooltipItem {
  id: string;
  title: string;
  category: 'sensor' | 'metrica' | 'modelo_negocio';
  shortDesc: string;
  detailedExplanation: string;
  clinicalRelevance?: string;
}

export const TOOLTIP_DICTIONARY: Record<string, TooltipItem> = {
  ecg: {
    id: 'ecg',
    title: 'Electrocardiograma (ECG)',
    category: 'sensor',
    shortDesc: 'Registro de la actividad eléctrica cardíaca en reposo.',
    detailedExplanation: 'Utiliza electrodos en el bisel o chasis para registrar el ritmo eléctrico del corazón durante 30 segundos.',
    clinicalRelevance: 'Detecta Fibrilación Auricular (AFib), una causa común de arritmias y accidentes cerebrovasculares.',
  },
  spO2: {
    id: 'spO2',
    title: 'Saturación de Oxígeno (SpO2)',
    category: 'sensor',
    shortDesc: 'Porcentaje de hemoglobina oxigenada en la sangre periférica.',
    detailedExplanation: 'Sensores ópticos de luz roja e infrarroja miden la absorción de luz por los capilares sanguíneos.',
    clinicalRelevance: 'Indicador clave de apneas nocturnas, hipoxia y adaptación a altitudes elevadas (Valor normal: 95%-100%).',
  },
  hrv: {
    id: 'hrv',
    title: 'Variabilidad de Frecuencia Cardíaca (HRV)',
    category: 'metrica',
    shortDesc: 'Variación en milisegundos entre latidos cardíacos consecutivos.',
    detailedExplanation: 'Mide la flexibilidad del Sistema Nervioso Autónomo (balance entre sistema simpático y parasimpático).',
    clinicalRelevance: 'Una HRV alta indica excelente recuperación física, resiliencia al estrés y baja fatiga muscular.',
  },
  skinTemp: {
    id: 'skinTemp',
    title: 'Temperatura Cutánea Nocturna',
    category: 'sensor',
    shortDesc: 'Desviación de la temperatura de la piel respecto al rango basal.',
    detailedExplanation: 'Monitoriza micro-variaciones de la temperatura periférica durante las fases de sueño profundo.',
    clinicalRelevance: 'Permite anticipar infecciones, fiebre incipiente, sobreentrenamiento y seguimiento del ciclo menstrual.',
  },
  edaStress: {
    id: 'edaStress',
    title: 'Actividad Electrodérmica (cEDA / Estrés)',
    category: 'sensor',
    shortDesc: 'Medición de la respuesta de sudoración microscópica de la piel.',
    detailedExplanation: 'Registra cambios en la conductancia galvánica inducidos por la activación del sistema nervioso simpático.',
    clinicalRelevance: 'Identifica eventos de estrés físico y emocional agudo en tiempo real para ejercicios de respiración.',
  },
  bodyComposition: {
    id: 'bodyComposition',
    title: 'Composición Corporal (BIA)',
    category: 'sensor',
    shortDesc: 'Análisis de Impedancia Bioeléctrica desde la muñeca.',
    detailedExplanation: 'Envía microcorrientes eléctricas seguras para calcular la resistencia diferencial de tejidos grasos y magros.',
    clinicalRelevance: 'Estima porcentaje de grasa corporal, masa muscular esquelética, agua corporal y tasa metabólica basal.',
  },
  gps: {
    id: 'gps',
    title: 'GPS Integrado / GNSS Multi-banda',
    category: 'metrica',
    shortDesc: 'Módulo de localización satelital autónomo en el hardware.',
    detailedExplanation: 'Permite registrar rutas, ritmo y distancia exacta al aire libre sin depender de llevar el teléfono inteligente.',
    clinicalRelevance: 'Indispensable para la precisión de métricas de ritmo, desnivel acumulado y cálculo del VO2 Max.',
  },
  subscription: {
    id: 'subscription',
    title: 'Modelo de Suscripción (SaaS)',
    category: 'modelo_negocio',
    shortDesc: 'Pago mensual obligatorio para acceder a métricas avanzadas.',
    detailedExplanation: 'Marcas como Whoop u Oura requieren una cuota periódica ($6 a $30/mes) para desbloquear la app y análisis.',
    clinicalRelevance: 'Impacta significativamente el Costo Total de Propiedad (TCO) acumulado a 3 años de uso.',
  },
  battery: {
    id: 'battery',
    title: 'Autonomía de Batería (Horas/Días)',
    category: 'metrica',
    shortDesc: 'Duración continua de funcionamiento por carga de hardware.',
    detailedExplanation: 'Varía desde 24-48 horas en smartwatches AMOLED hasta 10-31 días en pulseras biométricas y anillos.',
    clinicalRelevance: 'Crucial para garantizar monitorización ininterrumpida de salud y sueño sin pausas de recarga nocturna.',
  },
};
