import { NOT_AVAILABLE } from '../data/helpers';
import { useApp } from '../lib/app-context';
import { outline } from '../lib/ui';
import { modelUrl, money, priceNote } from '../lib/vehicle';
import type { Vehicle } from '../types/vehicle';
import { Photo } from './Photo';

export function VehicleCard({ v }: { v: Vehicle }) {
  const { link, go, ask, toggle, compared } = useApp();
  const selected = (compared[v.market] || []).includes(v.id);
  const keys = v.market === 'trucks' ? ['Payload', 'GVW'] : v.market === 'tractors' ? ['Engine', 'Drive type', 'Cylinders'] : [v.specs.Payload ? 'Payload' : 'Passenger capacity', ...(v.fuel === 'Electric' ? ['Range', 'Battery'] : ['Engine'])];
  const detailLink = link(modelUrl(v));
  return <article className="group min-w-0 overflow-hidden rounded-lg border border-[#e3e6e9] bg-white transition-shadow hover:shadow-md">
    <a {...detailLink} aria-label={`${v.name} details`} className="block w-full cursor-pointer p-4 focus-visible:ring-2 focus-visible:ring-orange-600"><Photo vehicle={v} className="h-40 w-full transition-transform group-hover:scale-105" /></a>
    <div className="px-4 pb-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-600">{v.brand}</p><a {...detailLink} className="flex min-h-11 items-center text-left text-base font-bold text-[#172b3f] focus-visible:ring-2 focus-visible:ring-orange-600">{v.name}</a>
      <p className="text-base font-bold">{money(v)}</p><p className="mt-1 text-xs text-slate-600">{priceNote(v)}</p>
      <dl className="my-3 min-h-30 space-y-1.5 border-y border-slate-100 py-3 text-sm text-slate-600"><div className="flex justify-between gap-2"><dt>Power · Fuel</dt><dd className="text-right font-medium">{v.hp !== null ? `${v.hp} HP` : NOT_AVAILABLE} · {v.fuel}</dd></div>{keys.map(k => <div key={k} className="flex justify-between gap-2"><dt>{k}</dt><dd className="text-right font-medium">{v.specs[k] || NOT_AVAILABLE}</dd></div>)}</dl>
      <button className={`${outline} w-full`} onClick={() => ask(v)}>Get Best Price →</button><div className="flex items-center justify-between gap-2"><button className="min-h-11 text-sm font-medium text-[#203d55]" onClick={() => go(modelUrl(v))}>View Details</button><label className="flex min-h-11 cursor-pointer items-center gap-2 text-xs text-slate-600"><input className="accent-[#d93d1c]" type="checkbox" checked={selected} onChange={() => toggle(v)} />Compare</label></div>
    </div>
  </article>;
}
