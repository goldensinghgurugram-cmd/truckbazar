import { config } from '../data';
import { useApp } from '../lib/app-context';
import { useSeo } from '../lib/seo';
import { orange, panel } from '../lib/ui';
import type { Market } from '../types/vehicle';

export function NotFound({ market, pathname }: { market: Market; pathname: string }) {
  const { go } = useApp();
  useSeo({ title: 'Page Not Found', description: 'This page could not be found on Cargo Junction.', path: pathname, noindex: true });
  return <section className={panel}><h1 className="text-2xl font-bold">Page not found</h1><p className="my-4 text-sm text-slate-600">This model or brand isn’t in the catalogue.</p><button className={orange} onClick={() => go(`/${market}`)}>Explore {config[market].name}</button></section>;
}
