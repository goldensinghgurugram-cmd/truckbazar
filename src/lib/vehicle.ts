import { NOT_AVAILABLE } from '../data/helpers';
import type { Market, Vehicle } from '../types/vehicle';

export const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const modelUrl = (v: Vehicle) => `/${v.market}/${v.id}`;

export const hasPrice = (v: Vehicle): v is Vehicle & { price: number } => v.price !== null;

export const money = (v: Vehicle) => {
  if (v.price === null) return 'Price on request';
  if (v.max === null || v.max === v.price) return `₹${v.price.toFixed(2)} Lakh*`;
  return `₹${v.price.toFixed(2)} – ${v.max.toFixed(2)} Lakh*`;
};

export const priceNote = (v: Vehicle) => (hasPrice(v) ? 'Indicative ex-showroom' : 'Contact a dealer for current pricing');

const isKnown = (value?: string) => !!value && value !== NOT_AVAILABLE && !/^not applicable/i.test(value);

/** Every display specification for a vehicle, in a stable order. */
export function specs(v: Vehicle): [string, string][] {
  const rows: [string, string][] = [['Fuel type', v.fuel], ['Horsepower', v.hp !== null ? `${v.hp} HP` : NOT_AVAILABLE], ...Object.entries(v.specs)];
  if (v.transmission && !v.specs.Transmission) rows.push(['Transmission', v.transmission]);
  if (v.market === 'trucks') rows.push(['Tyres', v.tyres ? String(v.tyres) : NOT_AVAILABLE], ['Body type', v.bodyType || NOT_AVAILABLE]);
  if (v.application) rows.push(['Application', v.application]);
  rows.push(['Warranty', v.warranty || NOT_AVAILABLE]);
  return rows;
}

export const getSpec = (v: Vehicle, key: string) => {
  if (key === 'Price') return money(v);
  return specs(v).find(([k]) => k === key)?.[1] ?? NOT_AVAILABLE;
};

export const numberSpec = (v: Vehicle, key: string) => Number((v.specs[key] || '').replace(/,/g, '').match(/[\d.]+/)?.[0] || 0);

export const seatsOf = (v: Vehicle) => Number(v.specs['Passenger capacity']?.match(/\+\s*(\d+)/)?.[1] || 0);

export const usageOf = (v: Vehicle) => v.usage ?? (v.specs['Passenger capacity'] ? 'Passenger' : 'Cargo');

/** Features derived only from verified catalogue values, never invented. */
export function features(v: Vehicle): string[] {
  const list = [...(v.features || [])];
  if (v.fuel === 'Electric') list.push('Electric powertrain with zero tailpipe emissions');
  else list.push(`${v.fuel} engine`);
  if (isKnown(v.specs['Drive type'])) list.push(v.specs['Drive type'] === '4WD' ? 'Four-wheel drive (4WD)' : 'Two-wheel drive (2WD)');
  const transmission = v.specs.Transmission || v.transmission;
  if (isKnown(transmission)) list.push(`${transmission} transmission`);
  if (isKnown(v.specs['Lifting capacity'])) list.push(`Hydraulic lifting capacity of ${v.specs['Lifting capacity']}`);
  if (isKnown(v.specs.Payload)) list.push(`Rated payload of ${v.specs.Payload}`);
  if (isKnown(v.specs['Passenger capacity'])) list.push(`Seating for ${v.specs['Passenger capacity'].toLowerCase()}`);
  if (isKnown(v.specs.Battery)) list.push(`${v.specs.Battery} battery pack`);
  if (isKnown(v.specs.Range)) list.push(`Claimed range of ${v.specs.Range} (indicative)`);
  if (v.bodyType) list.push(`${v.bodyType} configuration`);
  return list;
}

/** Headline values shown on the detail page. */
export function highlights(v: Vehicle): [string, string][] {
  const efficiency: [string, string] = v.fuel === 'Electric' ? ['Range', v.specs.Range || NOT_AVAILABLE] : ['Mileage', v.specs.Mileage || NOT_AVAILABLE];
  const capacity: [string, string] = v.market === 'tractors' ? ['Horsepower', v.hp !== null ? `${v.hp} HP` : NOT_AVAILABLE] : v.specs.Payload ? ['Payload', v.specs.Payload] : ['Passenger capacity', v.specs['Passenger capacity'] || NOT_AVAILABLE];
  const engine: [string, string] = v.specs.Engine && isKnown(v.specs.Engine) ? ['Engine', v.specs.Engine] : v.specs.Motor ? ['Motor', v.specs.Motor] : ['Engine', v.specs.Engine || NOT_AVAILABLE];
  return [['Price', money(v)], capacity, engine, efficiency];
}

export function similarVehicles(v: Vehicle, pool: Vehicle[]) {
  return pool
    .filter(o => o.id !== v.id)
    .map(o => ({ o, score: o.tags.filter(t => v.tags.includes(t)).length * 100 - Math.abs((o.hp ?? 0) - (v.hp ?? 0)) }))
    .sort((a, b) => b.score - a.score)
    .map(({ o }) => o);
}

export const compareRows: Record<Market, string[]> = {
  trucks: ['Price', 'Engine', 'Horsepower', 'Payload', 'GVW', 'Mileage', 'Fuel type', 'Transmission', 'Tyres', 'Body type', 'Application', 'Dimensions', 'Motor', 'Battery', 'Range', 'Warranty'],
  tractors: ['Price', 'Engine', 'Horsepower', 'Cylinders', 'Drive type', 'Transmission', 'Lifting capacity', 'Fuel type', 'Application', 'Warranty'],
  'three-wheelers': ['Price', 'Engine', 'Motor', 'Horsepower', 'Fuel type', 'Passenger capacity', 'Payload', 'Range', 'Battery', 'Transmission', 'Warranty'],
};
