import { btn, panel } from '../lib/ui';
import type { Vehicle } from '../types/vehicle';
import { VehicleCard } from './VehicleCard';

export function VehicleSection({ title, list, onViewAll }: { title: string; list: Vehicle[]; onViewAll: () => void }) {
  return <section className={panel}>
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><h2 className="text-xl font-bold text-[#172b3f]">{title}</h2><button className={`${btn} text-[#bc3517]`} onClick={onViewAll}>View all →</button></div>
    {list.length ? <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{list.slice(0, 4).map(v => <VehicleCard key={v.id} v={v} />)}</div> : <p className="rounded-lg bg-slate-50 p-5 text-sm leading-6 text-slate-600">No {title.toLowerCase()} in this catalogue yet. Use “View all” to check this category or adjust the filters. No unrelated models are shown.</p>}
  </section>;
}
