import { useState } from 'react';
import { NewsSection } from '../components/NewsSection';
import { config } from '../data';
import { articles, newsTypes } from '../data/news';
import { breadcrumbLd, useSeo } from '../lib/seo';
import { btn } from '../lib/ui';
import type { Market, NewsType } from '../types/vehicle';

export function News({ market, search }: { market: Market; search: string }) {
  const cfg = config[market];
  const marketArticles = articles.filter(a => a.market === market);
  const available = newsTypes.filter(t => marketArticles.some(a => a.type === t));
  const initial = new URLSearchParams(search).get('type') as NewsType | null;
  const [type, setType] = useState<NewsType | ''>(initial && available.includes(initial) ? initial : '');
  const list = type ? marketArticles.filter(a => a.type === type) : marketArticles;

  const choose = (next: NewsType | '') => {
    setType(next);
    history.replaceState({}, '', `${location.pathname}${next ? `?type=${encodeURIComponent(next)}` : ''}`);
  };

  useSeo({
    title: `${cfg.singular} News, Reviews & Buying Guides`,
    description: `Original ${cfg.singular.toLowerCase()} buying guides, specification reviews, electric vehicle explainers and industry updates from Cargo Junction.`,
    path: `/${market}/news`,
    type: 'article',
    jsonLd: [breadcrumbLd([{ name: 'Home', path: '/' }, { name: cfg.name, path: `/${market}` }, { name: 'News & Reviews', path: `/${market}/news` }])],
  });

  const toolbar = <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filter articles by type">{(['', ...available] as (NewsType | '')[]).map(t => <button key={t || 'all'} aria-pressed={type === t} onClick={() => choose(t)} className={`${btn} ${type === t ? 'bg-[#d93d1c] text-white' : 'border border-slate-200 bg-slate-50 text-[#203d55]'}`}>{t || 'All'}</button>)}</div>;

  return <NewsSection market={market} heading="h1" title={`Latest ${cfg.singular} News & Reviews`} articles={list} toolbar={toolbar} />;
}
