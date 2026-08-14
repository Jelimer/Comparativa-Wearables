export interface EreaderTooltipDefinition {
  term: string;
  shortDescription: string;
  detailedExplanation: string;
  category: 'screen' | 'ergonomics' | 'software' | 'battery';
}

export const EREADER_TOOLTIP_DICTIONARY: Record<string, EreaderTooltipDefinition> = {
  carta_1300: {
    term: 'E-Ink Carta 1300 / 1200',
    shortDescription: 'Tinta electrónica de máximo contraste',
    detailedExplanation:
      'La tecnología Carta 1300/1200 proporciona hasta un 25% más de contraste entre el fondo blanco y las letras negras, con una tasa de refresco ultra rápida que elimina el parpadeo molesto al pasar página.',
    category: 'screen',
  },
  kaleido_3: {
    term: 'E-Ink Kaleido 3 (Color)',
    shortDescription: '4.096 colores + 300 PPI en texto',
    detailedExplanation:
      'Panel que combina una capa de tinta electrónica monocromática a 300 PPI con un filtro de color RGB a 150 PPI. Es perfecto para leer cómics, mangas, libros infantiles, gráficos y ver portadas a todo color sin emitir luz directa a los ojos.',
    category: 'screen',
  },
  colorsoft: {
    term: 'Colorsoft E-Ink (Amazon)',
    shortDescription: 'Tecnología de color con guía de luz personalizada',
    detailedExplanation:
      'El sistema de Amazon para pantallas a color utiliza transistores de óxido y micro deflectores de luz LED para ofrecer colores vibrantes y paso de página fluido conservando la textura de papel impreso.',
    category: 'screen',
  },
  warm_light: {
    term: 'Luz Cálida Ajustable (ComfortLight)',
    shortDescription: 'Eliminación de luz azul para lectura nocturna',
    detailedExplanation:
      'A diferencia de la luz fría blanca tradicional, la luz cálida mezcla LEDs ámbar para simular la luz de una vela o lámpara de mesa. Evita la fatiga visual nocturna y no altera los niveles de melatonina antes de dormir.',
    category: 'screen',
  },
  page_buttons: {
    term: 'Botones Físicos de Paso de Página',
    shortDescription: 'Control táctil ergonómico con una mano',
    detailedExplanation:
      'Botones mecánicos ubicados en el marco lateral que permiten avanzar y retroceder capítulos o páginas con solo presionar con el pulgar, evitando tener que levantar el dedo o tocar la pantalla.',
    category: 'ergonomics',
  },
  stylus: {
    term: 'Soporte para Lápiz Óptico (Stylus)',
    shortDescription: 'Toma de notas, dibujos y anotación de PDFs',
    detailedExplanation:
      'Capa digitalizadora (a menudo tecnología Wacom EMR) que no requiere batería y detecta presión e inclinación. Permite escribir a mano alzada en márgenes de libros, cuadernos digitales y documentos PDF como si fuera papel real.',
    category: 'software',
  },
  ipx8: {
    term: 'Resistencia al Agua IPX8',
    shortDescription: 'Sumergible hasta 2 metros en agua dulce',
    detailedExplanation:
      'Protección sellada que garantiza que el dispositivo puede sobrevivir a caídas accidentales en la bañera, piscina o lluvia intensa durante 60 minutos sin sufrir daños.',
    category: 'ergonomics',
  },
  android_open: {
    term: 'Android Abierto con Google Play',
    shortDescription: 'Instala cualquier app de lectura o productividad',
    detailedExplanation:
      'Dispositivos (como Onyx BOOX) que ejecutan Android completo. Te permiten tener la app de Kindle, Kobo, Storytel, Readwise, Libby, Google Play Libros y Dropbox en un mismo aparato sin depender de una sola tienda.',
    category: 'software',
  },
  formats: {
    term: 'Soporte Nativo de Formatos (EPUB / PDF / CBR)',
    shortDescription: 'Compatibilidad de archivos sin conversiones',
    detailedExplanation:
      'Capacidad de transferir libros directamente por cable o nube en formato EPUB, PDF, CBZ/CBR para cómics o TXT. Kobo y BOOX los abren de forma nativa; Kindle los adapta mediante su servicio "Send to Kindle".',
    category: 'software',
  },
  battery_weeks: {
    term: 'Batería en Semanas (E-Ink)',
    shortDescription: 'Consumo casi nulo de energía estática',
    detailedExplanation:
      'A diferencia de tablets o celulares que emiten luz constante y duran horas, la tinta electrónica es biestable (solo gasta microenergía cuando se refresca la pantalla), alcanzando entre 6 y 12 semanas por carga.',
    category: 'battery',
  },
};
