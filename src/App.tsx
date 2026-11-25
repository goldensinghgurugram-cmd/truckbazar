import { useEffect, useMemo, useState } from 'react';
import type { MouseEvent } from 'react';
import { AuthModal } from './components/AuthModal';
import { Breadcrumb } from './components/Breadcrumb';
import { CompareBar } from './components/CompareBar';
import { EnquiryForm } from './components/EnquiryForm';
import type { EnquiryStatus } from './components/EnquiryForm';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Modal } from './components/Modal';
import { loadProfile } from './lib/api';
import type { Profile } from './lib/api';
import { AppContext } from './lib/app-context';
import type { AppContextValue, CompareState } from './lib/app-context';
import { resolveRoute } from './lib/routes';
import { modelUrl } from './lib/vehicle';
import { Compare } from './pages/Compare';
import { MarketPage } from './pages/MarketPage';
import { MarketplaceSelect } from './pages/MarketplaceSelect';
import { News } from './pages/News';
import { NotFound } from './pages/NotFound';
import { VehicleDetail } from './pages/VehicleDetail';
import type { Vehicle } from './types/vehicle';

const currentUrl = () => location.pathname + location.search;

export default function App() {
  const [url, setUrl] = useState(currentUrl);
  const [menu, setMenu] = useState(false);
  const [compared, setCompared] = useState<CompareState>({});
  const [enquiry, setEnquiry] = useState<Vehicle | null>(null);
  const [enquiryStatus, setEnquiryStatus] = useState<EnquiryStatus>('idle');
  const [authOpen, setAuthOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(loadProfile);

  const [rawPath, search = ''] = url.split(/(?=\?)/);
  const pathname = rawPath.replace(/\/+$/, '') || '/';
  const route = useMemo(() => resolveRoute(pathname), [pathname]);
  const { market } = route;

  useEffect(() => {
    const pop = () => setUrl(currentUrl());
    addEventListener('popstate', pop);
    return () => removeEventListener('popstate', pop);
  }, []);

  useEffect(() => {
    if (route.kind !== 'detail' || !route.legacy) return;
    const canonical = modelUrl(route.vehicle) + search;
    history.replaceState({}, '', canonical);
    setUrl(canonical);
  }, [route, search]);

  const ctx = useMemo<AppContextValue>(() => {
    const go = (next: string) => { history.pushState({}, '', next); setUrl(next); setMenu(false); window.scrollTo(0, 0); };
    return {
      go,
      link: (href: string) => ({
        href,
        onClick: (e: MouseEvent<HTMLAnchorElement>) => {
          if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
          e.preventDefault();
          go(href);
        },
      }),
      ask: (v: Vehicle) => { setEnquiryStatus('idle'); setEnquiry(v); },
      toggle: (v: Vehicle) => setCompared(old => {
        const ids = (old[v.market] || []).filter(Boolean);
        return { ...old, [v.market]: ids.includes(v.id) ? ids.filter(id => id !== v.id) : [...ids.slice(-2), v.id] };
      }),
      compared,
      setCompared,
    };
  }, [compared]);

  const crumb = route.kind === 'detail' ? route.vehicle.name
    : route.kind === 'listing' ? route.brandName || 'All Models'
    : route.kind === 'compare' ? 'Compare'
    : route.kind === 'news' ? 'News & Reviews'
    : undefined;

  const page = (() => {
    switch (route.kind) {
      case 'root': return null;
      case 'market': return <MarketPage key={url} market={market} isHome pathname={pathname} search={search} />;
      case 'listing': return <MarketPage key={url} market={market} isHome={false} pathname={pathname} search={search} brandName={route.brandName} />;
      case 'detail': return <VehicleDetail key={route.vehicle.id} vehicle={route.vehicle} />;
      case 'compare': return <Compare key={market} market={market} search={search} />;
      case 'news': return <News key={market} market={market} search={search} />;
      case 'notfound': return <NotFound market={market} pathname={pathname} />;
    }
  })();

  const enquiryTitle = enquiryStatus === 'sent' ? 'Enquiry sent' : enquiryStatus === 'saved-locally' ? 'Enquiry saved locally' : `Enquire about ${enquiry?.name}`;

  return <AppContext.Provider value={ctx}>
    <div className="min-h-screen overflow-x-hidden bg-[#f7f8fa] font-sans text-[#282c32]">
      <Header market={market} pathname={pathname} menu={menu} setMenu={setMenu} profileName={profile?.name} onLogin={() => setAuthOpen(true)} />
      <main>
        {route.kind === 'root' ? <MarketplaceSelect /> : <div className="mx-auto max-w-[1240px] space-y-6 px-5 py-5">
          {route.kind !== 'market' && route.kind !== 'notfound' && <Breadcrumb market={market} current={crumb} />}
          {page}
        </div>}
      </main>
      <Footer />
      {route.kind !== 'root' && route.kind !== 'compare' && <CompareBar market={market} />}
      {enquiry && <Modal title={enquiryTitle} close={() => setEnquiry(null)}><EnquiryForm key={enquiry.id} vehicle={enquiry} onStatus={setEnquiryStatus} onContinue={() => setEnquiry(null)} /></Modal>}
      {authOpen && <AuthModal profile={profile} onProfile={setProfile} close={() => setAuthOpen(false)} />}
    </div>
  </AppContext.Provider>;
}
