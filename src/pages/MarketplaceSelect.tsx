import { Icon } from '../components/Icon';
import { Photo } from '../components/Photo';
import { collections, config, markets } from '../data';
import { useApp } from '../lib/app-context';
import { SITE_NAME, absoluteUrl, useSeo } from '../lib/seo';
import { orange } from '../lib/ui';

export function MarketplaceSelect() {
  const { link } = useApp();
  useSeo({
    title: 'Trucks, Tractors & Three-Wheelers in India – Prices & Specs',
    description: 'Explore independent truck, tractor and three-wheeler marketplaces on Cargo Junction. Compare indicative prices, specifications and models across Tata, Mahindra, Ashok Leyland, Swaraj, Bajaj and more.',
    path: '/',
    jsonLd: [
      { '@context': 'https://schema.org', '@type': 'Organization', name: SITE_NAME, url: absoluteUrl('/'), logo: absoluteUrl('/favicon.png') },
      { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: absoluteUrl('/') },
    ],
  });
  return <div className="mx-auto max-w-[1240px] space-y-8 px-5 py-10 md:py-14">
    <section className="text-center"><span className="text-xs font-bold tracking-[2px] text-[#bc3517]">ONE BRAND. THREE SPECIALIST MARKETPLACES.</span><h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#172b3f] md:text-4xl">The right vehicle.<br className="md:hidden" /> The next big opportunity.</h1><p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">Choose your marketplace to explore the vehicles, prices and specifications that matter to your business.</p></section>
    <div className="grid gap-5 lg:grid-cols-3">{markets.map(m => <section key={m} className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 bg-white px-5 pt-5"><Photo vehicle={collections[m][0]} className="h-52 w-full" eager /></div><div className="flex flex-1 flex-col p-6"><h2 className="text-2xl font-bold text-[#172b3f]">{config[m].name} Marketplace</h2><p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{m === 'trucks' ? 'From mini trucks to heavy haulers. Find the right capacity for every load.' : m === 'tractors' ? 'From compact tractors to farm workhorses. Find the power your land needs.' : 'Passenger autos, electric rickshaws and cargo carriers for the everyday entrepreneur.'}</p><p className="mt-4 text-xs text-slate-600">{config[m].categories.slice(0, 3).join(' · ')}</p><a {...link(`/${m}`)} className={`${orange} mt-6 w-full`}>Explore {config[m].name} →</a></div></section>)}</div>
    <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-6 md:grid-cols-3">{['Category-specific specifications', 'Side-by-side comparisons', 'Transparent indicative prices'].map(t => <div key={t} className="flex items-center gap-3 text-sm font-semibold text-[#203d55]"><Icon name="check" className="text-green-700" />{t}</div>)}</section>
  </div>;
}
