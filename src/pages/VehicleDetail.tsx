import { useState } from 'react';
import { EnquiryForm } from '../components/EnquiryForm';
import { Icon } from '../components/Icon';
import { Photo } from '../components/Photo';
import { VehicleSection } from '../components/VehicleSection';
import { collections, config } from '../data';
import { useApp } from '../lib/app-context';
import { absoluteUrl, breadcrumbLd, useSeo } from '../lib/seo';
import { btn, field, orange, outline, panel } from '../lib/ui';
import { features, hasPrice, highlights, modelUrl, money, similarVehicles, specs } from '../lib/vehicle';
import type { Vehicle } from '../types/vehicle';

export function VehicleDetail({ vehicle: detail }: { vehicle: Vehicle }) {
  const { ask, toggle, compared, go } = useApp();
  const cfg = config[detail.market];
  const gallery = detail.gallery?.length ? detail.gallery : detail.image ? [detail.image] : [];
  const [activeImage, setActiveImage] = useState(0);
  const variants = detail.variants?.length ? detail.variants : [`${detail.fuel} · Standard`];
  const [variant, setVariant] = useState(variants[0]);
  const inCompare = (compared[detail.market] || []).includes(detail.id);
  const similar = similarVehicles(detail, collections[detail.market]);
  const specRows = specs(detail);
  const featureList = features(detail);

  useSeo({
    title: `${detail.name} Price in India, Specifications & Features`,
    description: `${detail.name} ${hasPrice(detail) ? `price ${money(detail).replace('*', '')} (indicative ex-showroom)` : 'price on request'}. View ${detail.brand} ${cfg.singular.toLowerCase()} specifications${detail.hp !== null ? `, ${detail.hp} HP` : ''}, ${detail.fuel.toLowerCase()} engine details and compare with similar ${cfg.name.toLowerCase()}.`,
    path: modelUrl(detail),
    image: detail.image,
    type: 'product',
    jsonLd: [
      breadcrumbLd([{ name: 'Home', path: '/' }, { name: cfg.name, path: `/${detail.market}` }, { name: detail.name, path: modelUrl(detail) }]),
      {
        '@context': 'https://schema.org', '@type': 'Product', name: detail.name, brand: { '@type': 'Brand', name: detail.brand }, category: detail.tags[0],
        url: absoluteUrl(modelUrl(detail)), ...(detail.image ? { image: detail.image } : {}),
        additionalProperty: specRows.filter(([, v]) => v !== 'Not available').map(([name, value]) => ({ '@type': 'PropertyValue', name, value })),
        ...(hasPrice(detail) ? { offers: { '@type': 'AggregateOffer', priceCurrency: 'INR', lowPrice: Math.round(detail.price * 100000), highPrice: Math.round((detail.max ?? detail.price) * 100000), availability: 'https://schema.org/InStock' } } : {}),
      },
    ],
  });

  return <>
    <section className={`${panel} grid gap-7 md:grid-cols-2`}>
      <div>
        {gallery.length ? <Photo vehicle={detail} src={gallery[activeImage]} alt={`${detail.name} image ${activeImage + 1} of ${gallery.length}`} className="h-72 w-full" eager /> : <Photo vehicle={detail} className="h-72 w-full" />}
        {gallery.length > 1 && <div className="mt-3 flex gap-2 overflow-x-auto" role="group" aria-label="Image gallery">{gallery.map((src, i) => <button key={src} aria-label={`Show image ${i + 1}`} aria-pressed={activeImage === i} onClick={() => setActiveImage(i)} className={`shrink-0 rounded-md border p-1 ${activeImage === i ? 'border-[#d93d1c]' : 'border-slate-200'}`}><Photo vehicle={detail} src={src} alt="" className="h-14 w-20" /></button>)}</div>}
      </div>
      <div><p className="text-sm text-slate-600">{detail.brand} · {detail.tags[0]}</p><h1 className="mt-3 text-3xl font-bold text-[#172b3f]">{detail.name}</h1><p className="mt-5 text-2xl font-bold">{money(detail)}</p><p className="mt-2 text-sm text-slate-600">{hasPrice(detail) ? 'Indicative ex-showroom · Verify with dealer' : 'Price not yet verified · Contact a dealer'}</p><label className="mt-5 block text-sm font-medium">Variant<select className={`${field} mt-2`} value={variant} onChange={e => setVariant(e.target.value)}>{variants.map(v => <option key={v}>{v}</option>)}</select></label><div className="mt-5 flex flex-wrap gap-3"><button className={orange} onClick={() => ask(detail)}>Get Best Price</button><button className={outline} onClick={() => toggle(detail)} aria-pressed={inCompare}>{inCompare ? '✓ Added to Compare' : '+ Compare'}</button><button className={btn} onClick={() => go(`/${detail.market}/compare?ids=${[...new Set([detail.id, ...(compared[detail.market] || [])])].filter(Boolean).slice(0, 3).join(',')}`)}>Compare competitors →</button></div></div>
    </section>
    <section className={panel}><h2 className="mb-5 text-xl font-bold text-[#172b3f]">{detail.name} Key Highlights</h2><dl className="grid grid-cols-2 gap-3 md:grid-cols-4">{highlights(detail).map(([k, v]) => <div key={k} className="rounded-lg border border-slate-200 p-4"><dt className="text-xs text-slate-600">{k}</dt><dd className="mt-1 text-sm font-bold text-[#172b3f]">{v}</dd></div>)}</dl></section>
    <section className={panel}><h2 className="text-xl font-bold text-[#172b3f]">About {detail.name}</h2><p className="mt-3 text-sm leading-7 text-slate-600">The {detail.name} is a {detail.hp !== null ? `${detail.hp} HP ` : ''}{detail.fuel.toLowerCase()} {cfg.singular.toLowerCase()} from {detail.brand} for {detail.tags[0].toLowerCase()}{detail.application ? `, suited to ${detail.application.toLowerCase()}` : ''}. Compare its specifications, capacity and price with other {cfg.name.toLowerCase()} before choosing. Request a dealer demonstration to confirm suitability for your daily work.</p></section>
    <section className={panel}><h2 className="mb-5 text-xl font-bold text-[#172b3f]">Full {cfg.singular} Specifications</h2><div className="overflow-x-auto"><table className="w-full text-left text-sm"><tbody>{specRows.map(([key, value]) => <tr key={key} className="border-b border-slate-100"><th className="w-1/2 p-4 font-medium text-slate-600">{key}</th><td className="p-4 font-semibold">{value}</td></tr>)}</tbody></table></div><p className="mt-4 text-xs leading-6 text-slate-600">Specifications are representative and may vary by variant. *EV range is indicative, not guaranteed. “Not available” means the value has not been verified for this catalogue. Verify current pricing and specifications with the manufacturer.</p></section>
    <section className={panel}><h2 className="mb-4 text-xl font-bold text-[#172b3f]">{detail.name} Features</h2><ul className="grid gap-3 md:grid-cols-2">{featureList.map(f => <li key={f} className="flex items-center gap-3 text-sm font-semibold text-[#203d55]"><Icon name="check" className="text-green-700" />{f}</li>)}</ul></section>
    <section className={panel}><h2 className="mb-4 text-xl font-bold text-[#172b3f]">{detail.name} Variants</h2><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-slate-200"><th className="p-3">Variant</th><th className="p-3">Fuel type</th><th className="p-3">Indicative price</th></tr></thead><tbody>{variants.map(v => <tr key={v} className="border-b border-slate-100"><td className="p-3 font-semibold">{v}</td><td className="p-3">{detail.fuel}</td><td className="p-3">{variants.length === 1 ? money(detail) : 'Price on request'}</td></tr>)}</tbody></table></div></section>
    <VehicleSection title="Similar Models & Competitors" list={similar} onViewAll={() => go(`/${detail.market}/vehicles?category=${encodeURIComponent(detail.tags[0])}`)} />
    <section className={`${panel} grid gap-7 md:grid-cols-2`} aria-labelledby="price-enquiry"><div><h2 id="price-enquiry" className="text-xl font-bold text-[#172b3f]">Get the best price for {detail.name}</h2><p className="mt-3 text-sm leading-7 text-slate-600">Share your details to request on-road pricing for the {variant} variant in your city.</p></div><EnquiryForm key={detail.id} vehicle={detail} /></section>
    <section className={panel}><h2 className="mb-3 text-xl font-bold text-[#172b3f]">Frequently Asked Questions</h2>{[['What is the price?', hasPrice(detail) ? `${money(detail)} indicative ex-showroom. On-road price varies by city and variant.` : 'The price has not been verified for this catalogue. Contact a dealer for the current price.'], ['What are the key specifications?', specRows.slice(0, 4).map(([k, v]) => `${k}: ${v}`).join(' · ')], ['How do I contact a dealer?', 'Use the price enquiry form or the Dealer Enquiry button. Until an enquiry service is connected, details are saved on this browser only and no dealer is contacted.']].map(([q, a]) => <details className="border-b border-slate-200 py-3" key={q}><summary className="min-h-11 cursor-pointer text-sm font-semibold">{q}</summary><p className="pb-3 text-sm leading-7 text-slate-600">{a}</p></details>)}<button className={`${orange} mt-5`} onClick={() => ask(detail)}>Dealer Enquiry</button></section>
  </>;
}
