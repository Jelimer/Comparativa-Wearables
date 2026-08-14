export type EreaderBrand = 'Amazon Kindle' | 'Rakuten Kobo' | 'Onyx BOOX' | 'PocketBook';

export type EreaderCategory = 'compact' | 'standard' | 'large_note' | 'color';

export type ScreenTech =
  | 'Carta 1200'
  | 'Carta 1300'
  | 'Kaleido 3 (Color)'
  | 'Colorsoft E-Ink'
  | 'E-Ink Carta HD'
  | 'Mobius E-Ink';

export type EreaderRecommendationTag =
  | 'best_overall'
  | 'best_budget'
  | 'best_value'
  | 'best_color'
  | 'best_notes';

export interface Ereader {
  id: string;
  name: string;
  brand: EreaderBrand;
  category: EreaderCategory;
  priceUsd: number;
  rating: number;
  recommendationTag?: EreaderRecommendationTag;
  screenSize: number; // e.g. 6.0, 6.8, 7.0, 10.2
  screenResolution: string; // e.g. '300 ppi (1448 × 1072)'
  ppi: number;
  colorPpi?: number;
  screenTech: ScreenTech;
  colorScreen: boolean;
  frontlight: boolean;
  warmLight: boolean; // Luz cálida regulable
  pageTurnButtons: boolean; // Botones físicos para pasar página
  stylusSupport: boolean; // Compatible con lápiz óptico / notas
  waterproof: string; // e.g. 'IPX8 (2m en agua dulce)', 'No resistente'
  storageGb: number;
  batteryLife: string; // e.g. 'Hasta 10 semanas', 'Hasta 6 semanas'
  weightGrams: number;
  usbPort: string; // 'USB-C'
  wirelessCharging?: boolean;
  ecosystem: string[]; // ['Amazon Kindle Store', 'Audible', 'Kindle Unlimited']
  supportedFormats: string[]; // ['EPUB', 'PDF', 'MOBI', 'AZW3', 'CBZ', 'CBR', 'TXT']
  audiobookSupport: boolean; // Bluetooth / Altavoz
  openAndroid: boolean; // Permite Google Play (ej. BOOX)
  subscriptionEco?: string; // 'Kindle Unlimited ($11.99/mes)', 'Kobo Plus ($9.99/mes)'
  pros: string[];
  cons: string[];
  description: string;
  imageUrl: string;
  officialSiteUrl: string;
  bestFor: string;
}

export interface EreaderFilterState {
  searchQuery: string;
  selectedBrands: EreaderBrand[];
  selectedCategories: EreaderCategory[];
  selectedScreenSizes: ('compact_6' | 'mid_7' | 'large_8_plus')[];
  colorScreenOnly: boolean;
  warmLightOnly: boolean;
  pageTurnButtonsOnly: boolean;
  stylusSupportOnly: boolean;
  waterproofOnly: boolean;
  audiobookOnly: boolean;
  openAndroidOnly: boolean;
  maxPrice: number;
  sortBy: 'price_asc' | 'price_desc' | 'rating_desc' | 'screen_desc' | 'name_asc';
}
