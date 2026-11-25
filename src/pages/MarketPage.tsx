import { useMemo, useState } from 'react';
import { FilterSelect } from '../components/FilterSelect';
import { Icon } from '../components/Icon';
import { NewsSection } from '../components/NewsSection';
import { Photo } from '../components/Photo';
import { VehicleCard } from '../components/VehicleCard';
import { VehicleSection } from '../components/VehicleSection';
import { brandsFor, collections, config, homepageSections } from '../data';
import { articles } from '../data/news';
import { useApp } from '../lib/app-context';
import { applyFilters, emptyFilters, filterDefinitions, filtersToQuery, parseFilters, sortOptions } from '../lib/filters';
import type { FilterKey, Filters } from '../lib/filters';
import { absoluteUrl, breadcrumbLd, useSeo } from '../lib/seo';
import { btn, field, orange, outline, panel } from '../lib/ui';
import { modelUrl, slug } from '../lib/vehicle';
import type { Market } from '../types/vehicle';

const PAGE_SIZE = 6;

interface MarketPageProps {
  market: Market;
  isHome: boolean;
  pathname: string;
  search: string;
  brandName?: string;
}

export function MarketPage({ market, isHome, pathname, search, brandName }: MarketPageProps) {
  const { go, link } = useApp();
  const cfg = config[market], data = collections[market];
  const [filters, setFilterState] = useState<Filters>(() => parseFilters(search, brandName));
  const [page, setPage] = useState(1);
  const [mobileFilters, setMobileFilters] = useState(false);
  const definitions = useMemo(() => filterDefinitions(market), [market]);
  const filtered = useMemo(() => applyFilters(data, filters, brandName), [data, filters, brandName]);
  const sort = filters.sort || 'Recommended';

  const setFilters = (next: Filters) => {
    setFilterState(next);
    setPage(1);
    if (isHome) return;
    history.replaceState({}, '', pathname + filtersToQuery(next, brandName));
  };
  const setFilter = (key: FilterKey, value: string) => setFilters({ ...filters, [key]: value });
  const reset = () => setFilters({ ...emptyFilters, brand: brandName || '' });
  const listing = (key?: FilterKey, value?: string) => go(`/${market}/vehicles${key ? `?${key}=${encodeURIComponent(value || '')}` : ''}`);
  const brandLink = (brand: string) => `/${market}/brand/${slug(brand)}`;

  const categoryTitle = filters.category;
  const catalogueTitle = categoryTitle || `${brandName ? `${brandName} ` : ''}${cfg.name}`;
  const CatalogueHeading = isHome ? 'h2' : 'h1';
  const canonicalPath = pathname + (!isHome && !brandName && filters.category ? `?category=${encodeURIComponent(filters.category)}` : '');
  const crumbs = [{ name: 'Home', path: '/' }, { name: cfg.name, path: `/${market}` }, ...(isHome ? [] : [{ name: brandName || filters.category || 'All Models', path: canonicalPath }])];
  useSeo({
    title: isHome ? `${cfg.name} in India – Prices, Specifications & Comparison` : brandName ? `${brandName} ${cfg.name} Price in India – Models & Specifications` : `${catalogueTitle} Price in India – Models & Filters`,
    description: isHome
      ? `Explore ${cfg.name.toLowerCase()} in India on Cargo Junction. Compare indicative prices and specifications from ${cfg.brands.slice(0, 5).join(', ')} and more.`
      : `Browse ${filtered.length} ${catalogueTitle.toLowerCase()} on Cargo Junction. Filter by brand, budget and specifications and compare models side by side.`,
    path: canonicalPath,
    jsonLd: [
      breadcrumbLd(crumbs),
      { '@context': 'https://schema.org', '@type': 'ItemList', name: `${catalogueTitle} in India`, itemListElement: filtered.slice(0, 20).map((v, i) => ({ '@type': 'ListItem', position: i + 1, url: absoluteUrl(modelUrl(v)), name: v.name })) },
    ],
  });

  const visibleDefinitions = definitions.filter(f => !brandName || f.key !== 'brand');
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const marketArticles = articles.filter(a => a.market === market).slice(0, 3);

  return <>
    {isHome && <>
      <section className={`${panel} relative overflow-hidden bg-[#edf3f2]`}><div className="grid items-center gap-5 md:grid-cols-[1.15fr_1fr]"><div><span className="text-xs font-bold tracking-wider text-[#33704a]">CARGO JUNCTION · {cfg.name.toUpperCase()} MARKETPLACE</span><h1 className="mt-4 max-w-lg text-3xl leading-tight font-extrabold tracking-tight text-[#172b3f]">{cfg.line}</h1><p className="mt-3 text-sm leading-7 text-slate-700">Explore {cfg.name.toLowerCase()}, compare prices and specifications, and choose with confidence. Only {cfg.name.toLowerCase()}. All in one place.</p><a href="#catalogue" className={`${orange} mt-5`}>Explore {cfg.name} →</a></div><Photo vehicle={data[0]} className="h-56 w-full rounded-lg bg-white p-4" eager /></div></section>
      <section className={panel}><h2 className="mb-4 text-xl font-bold text-[#172b3f]">Find your perfect {cfg.singular.toLowerCase()}</h2><form className="grid items-end gap-3 md:grid-cols-4" onSubmit={e => { e.preventDefault(); go(`/${market}/vehicles${filtersToQuery(filters)}`); }}>
        <FilterSelect label="Brand" value={filters.brand} values={brandsFor(market)} onChange={v => setFilter('brand', v)} />
        <FilterSelect label="Maximum budget" value={filters.budget} values={cfg.budgets.map(String)} labels={cfg.budgets.map(b => `Under ₹${b} Lakh`)} onChange={v => setFilter('budget', v)} />
        {market === 'tractors'
          ? <FilterSelect label="Drive type" value={filters.drive} values={['2WD', '4WD']} onChange={v => setFilter('drive', v)} />
          : <FilterSelect label="Fuel type" value={filters.fuel} values={[...new Set(data.map(v => v.fuel))]} onChange={v => setFilter('fuel', v)} />}
        <button className={orange}><Icon name="search" />Search {cfg.name}</button></form></section>
      <section><h2 className="mb-4 text-xl font-bold text-[#172b3f]">Popular {cfg.singular} Categories</h2><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{cfg.categories.map(cat => <button key={cat} onClick={() => listing('category', cat)} className="flex min-h-20 items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 text-left text-sm font-semibold text-[#203d55] hover:border-orange-500 focus-visible:ring-2 focus-visible:ring-orange-600"><Icon className="text-[#d93d1c]" />{cat === 'Heavy Commercial Vehicles' ? 'Heavy Trucks' : cat === 'Medium Commercial Vehicles' ? 'Medium Trucks' : cat === 'Agriculture Tractors' ? 'Farm Tractors' : cat}<span className="ml-auto">→</span></button>)}</div></section>
      <VehicleSection title={`Latest ${cfg.name}`} list={data} onViewAll={() => listing()} />
      <VehicleSection title={`Popular ${market === 'tractors' ? 'Tractor Models' : cfg.name}`} list={[...data].filter(v => v.price !== null).reverse()} onViewAll={() => listing()} />
      {homepageSections[market].map(cat => <VehicleSection key={cat} title={cat} list={data.filter(v => v.tags.includes(cat) || (cat === 'Electric Trucks' && v.fuel === 'Electric'))} onViewAll={() => listing('category', cat)} />)}
      <section className={panel}><h2 className="mb-5 text-xl font-bold text-[#172b3f]">Popular {cfg.singular} Brands</h2><div className="grid grid-cols-2 gap-4 md:grid-cols-4">{brandsFor(market).map(b => <a className="flex min-h-24 items-center justify-center rounded-lg border border-slate-200 px-4 text-center text-lg font-bold text-[#203d55] hover:border-orange-500 focus-visible:ring-2 focus-visible:ring-orange-600" {...link(brandLink(b))} key={b}>{b} →</a>)}</div></section>
      {market === 'tractors' && <section className={panel}><h2 className="mb-4 text-xl font-bold text-[#172b3f]">Tractors by HP</h2><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{[25, 35, 45, 50].map(hp => <button className={`${btn} border border-slate-200 bg-slate-50 text-[#203d55]`} key={hp} onClick={() => listing('hp', String(hp))}>{hp} HP & above →</button>)}</div></section>}
      <section className={panel}><h2 className="mb-4 text-xl font-bold text-[#172b3f]">{cfg.name} by Budget</h2><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{cfg.budgets.map(b => <button key={b} className={`${btn} border border-slate-200 bg-slate-50 text-[#203d55]`} onClick={() => listing('budget', String(b))}>Under ₹{b} Lakh →</button>)}</div></section>
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#e1e9f1] bg-[#edf3f8] p-6"><div className="flex items-center gap-4"><Icon name="compare" className="h-9 w-9 text-[#203d55]" /><div><h2 className="text-xl font-bold text-[#172b3f]">Compare {cfg.name}</h2><p className="mt-2 text-sm text-slate-600">Prices, performance and specifications, side by side.</p></div></div><button className={outline} onClick={() => go(`/${market}/compare`)}>Start Comparing →</button></section>
      <NewsSection market={market} title={`Latest ${cfg.singular} News & Reviews`} articles={marketArticles} />
    </>}
    <section id="catalogue" className="scroll-mt-5"><CatalogueHeading className="text-2xl font-bold text-[#172b3f]">{isHome ? `Explore All ${cfg.name}` : `${catalogueTitle} in India`}</CatalogueHeading><p className="mt-3 text-sm leading-7 text-slate-600">Browse our independent {cfg.name.toLowerCase()} catalogue. Filter by {market === 'tractors' ? 'horsepower, engine capacity, drive type, cylinders' : market === 'trucks' ? 'payload, GVW, fuel type, tyres, application' : 'fuel type, passenger or cargo application, seating, range'}, brand and budget. Prices and specifications are indicative; models marked “Price on request” have not been verified yet.</p>
      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[240px_1fr]"><button className={`${outline} lg:hidden`} aria-expanded={mobileFilters} onClick={() => setMobileFilters(!mobileFilters)}>{mobileFilters ? 'Hide Filters' : 'Show Filters'}</button><aside aria-label={`${cfg.name} filters`} className={`${mobileFilters ? 'block' : 'hidden'} ${panel} space-y-4 lg:block`}><div className="flex items-center justify-between"><h2 className="font-bold">Filters</h2><button className="min-h-11 text-sm text-[#bc3517]" onClick={reset}>Reset all</button></div>{visibleDefinitions.map(f => <FilterSelect key={f.key} label={f.label} value={filters[f.key]} values={f.values} labels={f.labels} onChange={v => setFilter(f.key, v)} />)}</aside>
        <div className="min-w-0"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><p aria-live="polite" className="text-sm font-semibold">{filtered.length} {cfg.name.toLowerCase()} found</p><select className={`${field} max-w-56`} aria-label="Sort vehicles" value={sort} onChange={e => setFilter('sort', e.target.value === 'Recommended' ? '' : e.target.value)}>{sortOptions.map(o => <option key={o}>{o}</option>)}</select></div><input className={`${field} mb-4`} type="search" aria-label={`Search ${cfg.name}`} placeholder={`Search ${cfg.name.toLowerCase()} by brand or model…`} value={filters.search} onChange={e => setFilter('search', e.target.value)} />{filtered.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map(v => <VehicleCard key={v.id} v={v} />)}</div> : <div className={`${panel} text-center`}><h3 className="font-bold">No matching {cfg.name.toLowerCase()}</h3><p className="my-3 text-sm text-slate-600">{brandName ? `No ${brandName} models are listed for these filters yet.` : 'This catalogue has no models for these filters.'} No other marketplace’s vehicles are shown.</p><button className={outline} onClick={reset}>Clear filters</button></div>}{pageCount > 1 && <nav aria-label="Catalogue pagination" className="mt-5 flex justify-center gap-2">{Array.from({ length: pageCount }, (_, i) => <button key={i} aria-label={`Page ${i + 1}`} aria-current={page === i + 1 ? 'page' : undefined} onClick={() => { setPage(i + 1); document.getElementById('catalogue')?.scrollIntoView(); }} className={`${btn} ${page === i + 1 ? 'bg-[#d93d1c] text-white' : 'border border-slate-200 bg-white'}`}>{i + 1}</button>)}</nav>}</div>
      </div>
    </section>
    <section className="py-4"><h2 className="text-xl font-bold text-[#172b3f]">Discover the right {cfg.singular.toLowerCase()} in India</h2><p className="mt-3 text-sm leading-7 text-slate-600">Cargo Junction’s {cfg.name.toLowerCase()} marketplace brings category-specific prices, brands and specifications together. Explore {cfg.categories.slice(0, 4).join(', ').toLowerCase()} and compare models for your requirements. Prices are indicative ex-showroom values; confirm current variants, specifications and on-road prices with an authorised dealer.</p></section>
  </>;
}
