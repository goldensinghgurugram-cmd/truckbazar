import { useEffect, useState } from 'react';
import type { Vehicle } from '../types/vehicle';
import { Icon } from './Icon';

interface PhotoProps {
  vehicle: Vehicle;
  className?: string;
  src?: string;
  alt?: string;
  eager?: boolean;
}

export function Photo({ vehicle, className = '', src, alt, eager = false }: PhotoProps) {
  const image = src ?? vehicle.image;
  const [failed, setFailed] = useState(!image);
  useEffect(() => setFailed(!image), [image]);
  return failed || !image
    ? <div role="img" aria-label={`${vehicle.name} image unavailable`} className={`flex items-center justify-center gap-2 bg-slate-50 text-slate-600 ${className}`}><Icon className="h-12 w-12" /><span className="text-sm">{vehicle.name}</span></div>
    : <img src={image} alt={alt ?? vehicle.name} loading={eager ? 'eager' : 'lazy'} decoding="async" className={`object-contain ${className}`} onError={() => setFailed(true)} />;
}
