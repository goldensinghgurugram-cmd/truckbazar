import type { ReactNode } from 'react';
import { collections } from '../data';
import { panel } from '../lib/ui';
import type { Market, NewsArticle } from '../types/vehicle';
import { Photo } from './Photo';

interface NewsSectionProps {
  market: Market;
  title: string;
  articles: NewsArticle[];
  heading?: 'h1' | 'h2';
  toolbar?: ReactNode;
}

export function NewsSection({ market, title, articles, heading = 'h2', toolbar }: NewsSectionProps) {
  const data = collections[market];
  const Heading = heading;
  const ArticleHeading = heading === 'h1' ? 'h2' : 'h3';
  return <section className={panel} id="news"><Heading className="mb-5 text-xl font-bold text-[#172b3f]">{title}</Heading><p className="mb-4 text-sm text-slate-600">Original Cargo Junction guides & explainers · Not live news</p>
    {toolbar}
    {articles.length ? <div className="grid gap-4 md:grid-cols-3">{articles.map((a, i) => {
      const vehicle = data.find(v => v.id === a.vehicleId) || data[i % data.length];
      return <article className="rounded-lg border border-slate-200 p-4" key={a.slug} id={a.slug}><Photo vehicle={vehicle} className="mb-3 h-32 w-full" /><p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#bc3517]">{a.type}</p><details><summary className="min-h-11 cursor-pointer text-base font-bold text-[#172b3f]"><ArticleHeading className="inline">{a.title}</ArticleHeading></summary>{a.body.map(p => <p key={p} className="mt-3 text-sm leading-7 text-slate-600">{p}</p>)}</details><p className="mt-2 text-sm text-slate-600">{a.summary}</p></article>;
    })}</div> : <p className="rounded-lg bg-slate-50 p-5 text-sm leading-6 text-slate-600">No articles in this category yet.</p>}
  </section>;
}
