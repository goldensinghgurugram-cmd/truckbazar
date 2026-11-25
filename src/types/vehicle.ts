export type Market = 'trucks' | 'tractors' | 'three-wheelers';

export type FuelType = 'Diesel' | 'Electric' | 'CNG' | 'Petrol';

export type Usage = 'Passenger' | 'Cargo';

/**
 * A single catalogue model. Shaped so it can be returned as-is from a future
 * database or API. Prices are indicative ex-showroom values in lakh rupees;
 * `null` means the price has not been verified and is shown as "Price on request".
 */
export interface Vehicle {
  id: string;
  market: Market;
  name: string;
  brand: string;
  price: number | null;
  max: number | null;
  image?: string;
  gallery?: string[];
  tags: string[];
  fuel: FuelType;
  hp: number | null;
  /** Display specifications. Unknown values must be "Not available". */
  specs: Record<string, string>;
  transmission?: string;
  tyres?: number;
  application?: string;
  bodyType?: string;
  usage?: Usage;
  variants?: string[];
  features?: string[];
  warranty?: string;
}

export interface MarketConfig {
  name: string;
  singular: string;
  line: string;
  categories: string[];
  budgets: number[];
  brands: string[];
}

export type NewsType =
  | 'Commercial Vehicle News'
  | 'Tractor News'
  | 'Electric Vehicle News'
  | 'New Launches'
  | 'Reviews'
  | 'Buying Guides'
  | 'Industry Updates';

export interface NewsArticle {
  slug: string;
  market: Market;
  type: NewsType;
  title: string;
  summary: string;
  body: string[];
  vehicleId?: string;
}
