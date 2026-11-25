import { config, markets } from '../data';
import { isEnquiryApiConfigured } from '../lib/api';
import { useApp } from '../lib/app-context';

export function Footer() {
  const { link } = useApp();
  return <footer className="mt-8 bg-[#172b3f] text-white"><div className="mx-auto grid max-w-[1240px] gap-7 px-5 py-9 md:grid-cols-4"><div><h2 className="text-xl font-extrabold">cargo<span className="text-orange-500">junction</span></h2><p className="mt-3 text-sm leading-7 text-slate-300">Three specialist marketplaces.<br />The right vehicle for every ambition.</p></div>{markets.map(m => <div key={m}><h3 className="mb-3 text-sm font-bold">{config[m].name} Marketplace</h3>{[{ name: `Explore ${config[m].name}`, href: `/${m}` }, { name: 'All Models & Filters', href: `/${m}/vehicles` }, { name: `Compare ${config[m].name}`, href: `/${m}/compare` }, { name: 'News & Reviews', href: `/${m}/news` }].map(l => <a key={l.href} {...link(l.href)} className="flex min-h-11 items-center text-sm text-slate-300 hover:text-white focus-visible:ring-2 focus-visible:ring-orange-500">{l.name}</a>)}</div>)}</div><p className="border-t border-slate-600 px-5 py-5 text-center text-xs leading-6 text-slate-300">© {new Date().getFullYear()} Cargo Junction · Indicative prices & specifications · {isEnquiryApiConfigured ? 'Verify final prices with an authorised dealer.' : 'Enquiries are stored on this browser only.'}</p></footer>;
}
