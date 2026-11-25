import { useEffect } from 'react';

export const SITE_NAME = 'Cargo Junction';

const origin = () => (import.meta.env.VITE_SITE_URL || location.origin).replace(/\/$/, '');

export const absoluteUrl = (path: string) => (/^https?:\/\//.test(path) ? path : `${origin()}${path.startsWith('/') ? path : `/${path}`}`);

interface SeoOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
  jsonLd?: object[];
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.content = content;
}

export function applySeo({ title, description, path, image, type = 'website', noindex, jsonLd = [] }: SeoOptions) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const url = absoluteUrl(path);
  const img = absoluteUrl(image || '/images/highway-truck.png');
  document.title = fullTitle;
  upsertMeta('name', 'description', description);
  upsertMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow');
  upsertMeta('property', 'og:site_name', SITE_NAME);
  upsertMeta('property', 'og:title', fullTitle);
  upsertMeta('property', 'og:description', description);
  upsertMeta('property', 'og:url', url);
  upsertMeta('property', 'og:type', type === 'product' ? 'website' : type);
  upsertMeta('property', 'og:image', img);
  upsertMeta('property', 'og:locale', 'en_IN');
  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', fullTitle);
  upsertMeta('name', 'twitter:description', description);
  upsertMeta('name', 'twitter:image', img);
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
  canonical.href = url;
  let script = document.getElementById('structured-data') as HTMLScriptElement | null;
  if (!script) { script = document.createElement('script'); script.id = 'structured-data'; script.type = 'application/ld+json'; document.head.appendChild(script); }
  script.textContent = JSON.stringify(jsonLd.length === 1 ? jsonLd[0] : jsonLd);
}

export function useSeo(options: SeoOptions) {
  const key = JSON.stringify(options);
  useEffect(() => { applySeo(options); }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
}

export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: absoluteUrl(item.path) })),
});
