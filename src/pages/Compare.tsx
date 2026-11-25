import { useEffect, useState } from 'react';
import { collections, config, markets } from '../data';
import { useApp } from '../lib/app-context';
import { breadcrumbLd, useSeo } from '../lib/seo';
import { field, panel } from '../lib/ui';
import { compareRows, getSpec, modelUrl } from '../lib/vehicle';
import type { Market } from '../types/vehicle';

export function Compare({ market, search }: { market: Market; search: string }) {
  const { compared, setCompared, go, link } = useApp();
  const cfg = config[market], data = collections[market];
  const selected = compared[market] || [];
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    const ids = (new URLSearchParams(search).get('ids') || '').split(',').filter(id => data.some(v => v.id === id)).slice(0, 3);
    if (ids.length) setCompared(old => ({ ...old, [market]: ids }));
    setSeeded(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedKey = selected.join(',');
  useEffect(() => {
    if (!seeded) return;
    const ids = selected.filter(Boolean);
    history.replaceState({}, '', `${location.pathname}${ids.length ? `?ids=${ids.join(',')}` : ''}`);
  }, [seeded, selectedKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const chosen = selected.filter(Boolean).map(id => data.find(v => v.id === id)).filter(v => !!v);
  useSeo({
    title: chosen.length > 1 ? `Compare ${chosen.map(v => v.name).join(' vs ')}` : `Compare ${cfg.name} in India – Price & Specifications`,
    description: `Compare up to three ${cfg.name.toLowerCase()} side by side on price, engine, horsepower, ${market === 'tractors' ? 'cylinders, drive type and lifting capacity' : 'payload, fuel type and transmission'}.`,
    path: `/${market}/compare`,
    jsonLd: [breadcrumbLd([{ name: 'Home', path: '/' }, { name: cfg.name, path: `/${market}` }, { name: 'Compare', path: `/${market}/compare` }])],
  });

  return <section className={panel}><div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-bold text-[#172b3f]">Compare {cfg.name}</h1><select aria-label="Comparison marketplace" className={`${field} max-w-52`} value={market} onChange={e => go(`/${e.target.value}/compare`)}>{markets.map(m => <option value={m} key={m}>{config[m].name}</option>)}</select></div><p className="mt-3 text-sm text-slate-600">Choose up to three {cfg.name.toLowerCase()}. Comparisons never mix marketplaces.</p>
    <div className="my-6 grid gap-3 md:grid-cols-3">{[0, 1, 2].map(i => <select aria-label={`Compare vehicle ${i + 1}`} className={field} key={i} value={selected[i] || ''} onChange={e => setCompared(old => { const next = [...(old[market] || [])]; next[i] = e.target.value; return { ...old, [market]: next.filter((id, idx) => id || idx < i) }; })}><option value="">Select {cfg.singular.toLowerCase()}</option>{data.map(v => <option key={v.id} value={v.id} disabled={selected.includes(v.id) && selected[i] !== v.id}>{v.name}</option>)}</select>)}</div>
    {chosen.length ? <div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left text-sm"><thead><tr><th className="p-3">Specification</th>{chosen.map(v => <th className="p-3" key={v.id}><a {...link(modelUrl(v))} className="text-[#172b3f] hover:text-[#bc3517]">{v.name}</a></th>)}</tr></thead><tbody>{compareRows[market].map(key => <tr className="border-t border-slate-200" key={key}><th className="p-4 font-medium text-slate-600">{key}</th>{chosen.map(v => <td key={v.id} className="p-4">{getSpec(v, key)}</td>)}</tr>)}</tbody></table></div>
      : <p className="rounded-lg bg-slate-50 p-5 text-sm leading-6 text-slate-600">Select at least one {cfg.singular.toLowerCase()} above to start comparing.</p>}
  </section>;
}
