import { brandsFor, collections, config } from '../data';
import type { Market, Vehicle } from '../types/vehicle';
import { numberSpec, seatsOf, usageOf } from './vehicle';

export const emptyFilters = {
  search: '', category: '', brand: '', minBudget: '', budget: '', fuel: '', hp: '', engine: '', drive: '', cylinders: '',
  payload: '', gvw: '', transmission: '', tyres: '', application: '', body: '', usage: '', seats: '', range: '', sort: '',
};
export type Filters = typeof emptyFilters;
export type FilterKey = keyof Filters;

export const sortOptions = ['Recommended', 'Price: Low to High', 'Price: High to Low', 'Power: High to Low'];

export interface FilterDefinition { key: FilterKey; label: string; values: string[]; labels?: string[] }

const uniq = <T,>(list: (T | undefined)[]) => [...new Set(list.filter((x): x is T => x !== undefined && x !== ''))];
const kg = (n: number) => `${n.toLocaleString('en-IN')} kg`;

export function parseFilters(search: string, brandName?: string): Filters {
  const query = new URLSearchParams(search);
  const next = { ...emptyFilters };
  (Object.keys(next) as FilterKey[]).forEach(key => { next[key] = query.get(key) || ''; });
  if (!next.usage && query.get('seating')) next.usage = query.get('seating') || '';
  if (brandName) next.brand = brandName;
  return next;
}

export function filtersToQuery(filters: Filters, brandName?: string) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (!value || (key === 'brand' && brandName) || (key === 'sort' && value === 'Recommended')) return;
    params.set(key, value);
  });
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export function filterDefinitions(market: Market): FilterDefinition[] {
  const data = collections[market];
  const cfg = config[market];
  const budgets = cfg.budgets.map(String);
  const common: FilterDefinition[] = [
    { key: 'brand', label: 'Brand', values: brandsFor(market) },
    { key: 'category', label: 'Category', values: cfg.categories },
    { key: 'minBudget', label: 'Minimum budget', values: budgets, labels: cfg.budgets.map(b => `Above ₹${b} Lakh`) },
    { key: 'budget', label: 'Maximum budget', values: budgets, labels: cfg.budgets.map(b => `Under ₹${b} Lakh`) },
  ];
  const hpSteps = market === 'tractors' ? [25, 35, 45, 50] : market === 'trucks' ? [30, 75, 100, 200] : [3, 8, 10];
  const hp: FilterDefinition = { key: 'hp', label: 'Minimum horsepower', values: hpSteps.map(String), labels: hpSteps.map(h => `${h} HP and above`) };
  const fuel: FilterDefinition = { key: 'fuel', label: 'Fuel type', values: uniq(data.map(v => v.fuel)) };

  if (market === 'trucks') return [
    ...common,
    { key: 'payload', label: 'Minimum payload', values: ['500', '1000', '5000', '20000'], labels: [500, 1000, 5000, 20000].map(kg) },
    { key: 'gvw', label: 'Minimum GVW', values: ['3000', '10000', '25000'], labels: [3000, 10000, 25000].map(kg) },
    hp, fuel,
    { key: 'transmission', label: 'Transmission', values: uniq(data.map(v => v.transmission)) },
    { key: 'tyres', label: 'Number of tyres', values: uniq(data.map(v => v.tyres)).sort((a, b) => a - b).map(String), labels: uniq(data.map(v => v.tyres)).sort((a, b) => a - b).map(t => `${t} tyres`) },
    { key: 'application', label: 'Application', values: uniq(data.map(v => v.application)) },
    { key: 'body', label: 'Body type', values: uniq(data.map(v => v.bodyType)) },
  ];
  if (market === 'tractors') return [
    ...common, hp,
    { key: 'engine', label: 'Minimum engine capacity', values: ['1000', '2000', '3000', '3500'], labels: ['1,000 cc', '2,000 cc', '3,000 cc', '3,500 cc'] },
    { key: 'cylinders', label: 'Cylinders', values: ['3', '4'] },
    { key: 'drive', label: 'Drive type', values: ['2WD', '4WD'] },
    { key: 'application', label: 'Farming application', values: uniq(data.map(v => v.application)) },
  ];
  return [
    ...common,
    { key: 'usage', label: 'Passenger or cargo', values: ['Passenger', 'Cargo'] },
    fuel,
    { key: 'seats', label: 'Minimum seating', values: ['3', '4'], labels: ['Driver + 3', 'Driver + 4'] },
    { key: 'payload', label: 'Minimum payload', values: ['500', '550'], labels: [500, 550].map(kg) },
    { key: 'range', label: 'Minimum EV range', values: ['80', '100', '150'], labels: ['80 km', '100 km', '150 km'] },
  ];
}

export function applyFilters(data: Vehicle[], f: Filters, brandName?: string): Vehicle[] {
  const q = f.search.trim().toLowerCase();
  const priceFiltered = !!(f.budget || f.minBudget);
  const result = data.filter(v =>
    (!q || `${v.brand} ${v.name}`.toLowerCase().includes(q)) &&
    (!f.brand || v.brand === f.brand) && (!brandName || v.brand === brandName) &&
    (!f.category || v.tags.includes(f.category) || (f.category === 'Electric Trucks' && v.fuel === 'Electric')) &&
    (!priceFiltered || v.price !== null) &&
    (!f.budget || (v.price ?? Infinity) <= +f.budget) &&
    (!f.minBudget || (v.max ?? v.price ?? 0) >= +f.minBudget) &&
    (!f.fuel || v.fuel === f.fuel) &&
    (!f.hp || (v.hp ?? 0) >= +f.hp) &&
    (!f.engine || numberSpec(v, 'Engine') >= +f.engine) &&
    (!f.drive || v.specs['Drive type'] === f.drive) &&
    (!f.cylinders || v.specs.Cylinders === f.cylinders) &&
    (!f.payload || numberSpec(v, 'Payload') >= +f.payload) &&
    (!f.gvw || numberSpec(v, 'GVW') >= +f.gvw) &&
    (!f.transmission || v.transmission === f.transmission) &&
    (!f.tyres || v.tyres === +f.tyres) &&
    (!f.application || v.application === f.application) &&
    (!f.body || v.bodyType === f.body) &&
    (!f.usage || usageOf(v) === f.usage) &&
    (!f.seats || seatsOf(v) >= +f.seats) &&
    (!f.range || (v.fuel === 'Electric' && numberSpec(v, 'Range') >= +f.range))
  );
  const priceOf = (v: Vehicle) => v.price;
  return result.sort((a, b) => {
    if (f.sort === 'Price: Low to High' || f.sort === 'Price: High to Low') {
      const pa = priceOf(a), pb = priceOf(b);
      if (pa === null || pb === null) return pa === pb ? 0 : pa === null ? 1 : -1;
      return f.sort === 'Price: Low to High' ? pa - pb : pb - pa;
    }
    if (f.sort === 'Power: High to Low') return (b.hp ?? -1) - (a.hp ?? -1);
    return 0;
  });
}
