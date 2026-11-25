import { allVehicles, brandsFor, collections, markets } from '../data';
import type { Market, Vehicle } from '../types/vehicle';
import { slug } from './vehicle';

export type Route =
  | { kind: 'root'; market: Market }
  | { kind: 'market'; market: Market }
  | { kind: 'listing'; market: Market; brandName?: string }
  | { kind: 'detail'; market: Market; vehicle: Vehicle; legacy: boolean }
  | { kind: 'compare'; market: Market }
  | { kind: 'news'; market: Market }
  | { kind: 'notfound'; market: Market };

export function resolveRoute(pathname: string): Route {
  const parts = pathname.split('/').filter(Boolean);
  if (!parts.length) return { kind: 'root', market: 'trucks' };
  if (pathname === '/compare') return { kind: 'compare', market: 'trucks' };
  if (pathname === '/news-reviews') return { kind: 'news', market: 'trucks' };
  if (parts[0] === 'vehicle' && parts.length === 2) {
    const id = parts[1] === 'treo' ? 'treo-yaari' : parts[1] === 'zor' ? 'treo-zor' : parts[1];
    const vehicle = allVehicles.find(v => v.id === id);
    return vehicle ? { kind: 'detail', market: vehicle.market, vehicle, legacy: true } : { kind: 'notfound', market: 'trucks' };
  }
  if (!markets.includes(parts[0] as Market)) return { kind: 'notfound', market: 'trucks' };
  const market = parts[0] as Market;
  if (parts.length === 1) return { kind: 'market', market };
  if (parts.length === 2) {
    if (parts[1] === 'vehicles') return { kind: 'listing', market };
    if (parts[1] === 'compare') return { kind: 'compare', market };
    if (parts[1] === 'news') return { kind: 'news', market };
    const vehicle = collections[market].find(v => v.id === parts[1]);
    if (vehicle) return { kind: 'detail', market, vehicle, legacy: false };
  }
  if (parts.length === 3 && parts[1] === 'brand') {
    const brandName = brandsFor(market).find(b => slug(b) === parts[2]);
    if (brandName) return { kind: 'listing', market, brandName };
  }
  return { kind: 'notfound', market };
}
