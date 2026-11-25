import type { Market, MarketConfig, Vehicle } from '../types/vehicle';
import { trucks } from './trucks';
import { tractors } from './tractors';
import { threeWheelers } from './threeWheelers';

export { trucks, tractors, threeWheelers };

export const markets: Market[] = ['trucks', 'tractors', 'three-wheelers'];

export const collections: Record<Market, Vehicle[]> = { trucks, tractors, 'three-wheelers': threeWheelers };

export const allVehicles: Vehicle[] = [...trucks, ...tractors, ...threeWheelers];

export const config: Record<Market, MarketConfig> = {
  trucks: {
    name: 'Trucks', singular: 'Truck', line: 'The right truck. The next big opportunity.',
    categories: ['Heavy Commercial Vehicles', 'Medium Commercial Vehicles', 'Light Commercial Vehicles', 'Mini Trucks', 'Pickup Trucks', 'Tipper Trucks', 'Tractor Trailers', 'Electric Trucks'],
    budgets: [5, 10, 25, 50],
    brands: ['Tata', 'Ashok Leyland', 'Eicher', 'BharatBenz', 'Mahindra', 'Force', 'Volvo', 'Scania'],
  },
  tractors: {
    name: 'Tractors', singular: 'Tractor', line: 'More power to your farm. More possibilities ahead.',
    categories: ['Mini Tractors', 'Utility Tractors', '2WD Tractors', '4WD Tractors', 'Agriculture Tractors', 'Heavy Duty Tractors'],
    budgets: [6, 7, 8, 10],
    brands: ['Mahindra', 'Swaraj', 'Sonalika', 'John Deere', 'Massey Ferguson', 'Eicher', 'New Holland', 'Farmtrac'],
  },
  'three-wheelers': {
    name: 'Three-Wheelers', singular: 'Three-Wheeler', line: 'Small wheels. Bigger business possibilities.',
    categories: ['Passenger Auto Rickshaws', 'Electric Rickshaws', 'Cargo Three-Wheelers', 'Electric Cargo Rickshaws', 'Diesel Three-Wheelers', 'CNG Three-Wheelers'],
    budgets: [2, 3, 4, 5],
    brands: ['Mahindra', 'Bajaj', 'Piaggio', 'TVS'],
  },
};

export const homepageSections: Record<Market, string[]> = {
  trucks: ['Mini Trucks', 'Pickup Trucks', 'Light Commercial Vehicles', 'Medium Commercial Vehicles', 'Heavy Commercial Vehicles', 'Tipper Trucks', 'Tractor Trailers', 'Electric Trucks'],
  tractors: ['Mini Tractors', 'Utility Tractors', '2WD Tractors', '4WD Tractors', 'Agriculture Tractors', 'Heavy Duty Tractors'],
  'three-wheelers': config['three-wheelers'].categories,
};

/** Configured brands first (in display order), followed by any extra brands present in the data. */
export const brandsFor = (market: Market) =>
  [...new Set([...config[market].brands, ...collections[market].map(v => v.brand)])];
