import { config } from '../data';
import { useApp } from '../lib/app-context';
import { orange } from '../lib/ui';
import type { Market } from '../types/vehicle';

export function CompareBar({ market }: { market: Market }) {
  const { compared, setCompared, go } = useApp();
  const ids = (compared[market] || []).filter(Boolean);
  if (!ids.length) return null;
  return <div className="fixed right-3 bottom-3 z-30 flex max-w-[calc(100%-24px)] items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-xl"><span className="text-sm font-semibold" aria-live="polite">{ids.length}/3 {config[market].name.toLowerCase()} selected</span><button className={orange} onClick={() => go(`/${market}/compare?ids=${ids.join(',')}`)}>Compare →</button><button className="min-h-11 min-w-11 text-xl" aria-label="Clear comparison" onClick={() => setCompared(old => ({ ...old, [market]: [] }))}>×</button></div>;
}
