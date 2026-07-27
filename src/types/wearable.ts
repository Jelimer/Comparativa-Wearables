export type BrandType =
  | 'Google/Fitbit'
  | 'Garmin'
  | 'Samsung'
  | 'Oura'
  | 'Whoop'
  | 'RingConn'
  | 'Signal'
  | 'Apple'
  | 'Xiaomi';

export type CategoryType = 'smartwatch' | 'band' | 'ring';

export type EcosystemType = 'iOS' | 'Android' | 'Samsung';

export type RecommendationTag = 'best_overall' | 'best_budget' | 'best_value';

export interface WearableSensors {
  heartRate: string;
  ecg: boolean;
  spO2: boolean;
  skinTemp: boolean;
  edaStress: boolean;
  bodyComposition: boolean;
  gps: boolean;
  bloodPressure?: boolean;
}

export interface Wearable {
  id: string;
  name: string;
  brand: BrandType;
  category: CategoryType;
  priceUsd: number;
  batteryLife: string;
  batteryHours: number;
  subscriptionRequired: boolean;
  subscriptionCost?: string;
  imageUrl: string;
  officialSiteUrl: string;
  ecosystem: EcosystemType[];
  rating: number;
  recommendationTag?: RecommendationTag;
  sensors: WearableSensors;
  pros: string[];
  cons: string[];
  description: string;
}

export interface FilterState {
  searchQuery: string;
  selectedBrands: BrandType[];
  selectedCategories: CategoryType[];
  selectedEcosystems: EcosystemType[];
  selectedSubscriptions: ('free' | 'subscription')[];
  maxPrice: number;
  minBatteryHours: number;
  requiredSensors: {
    ecg: boolean;
    spO2: boolean;
    edaStress: boolean;
    bodyComposition: boolean;
    bloodPressure: boolean;
    gps: boolean;
    skinTemp: boolean;
  };
  sortBy: 'price_asc' | 'price_desc' | 'battery_desc' | 'rating_desc' | 'name_asc';
}
