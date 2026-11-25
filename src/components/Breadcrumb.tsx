import { config } from '../data';
import { useApp } from '../lib/app-context';
import type { Market } from '../types/vehicle';

export function Breadcrumb({ market, current }: { market: Market; current?: string }) {
  const { link } = useApp();
  return <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-600"><a {...link('/')} className="flex min-h-11 items-center text-[#bc3517]">Home</a><span>›</span><a {...link(`/${market}`)} className="flex min-h-11 items-center text-[#bc3517]">{config[market].name}</a>{current && <><span>›</span><span aria-current="page">{current}</span></>}</nav>;
}
