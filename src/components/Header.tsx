import { config, markets } from '../data';
import { useApp } from '../lib/app-context';
import { outline } from '../lib/ui';
import type { Market } from '../types/vehicle';
import { Icon } from './Icon';

interface HeaderProps {
  market: Market;
  pathname: string;
  menu: boolean;
  setMenu: (open: boolean) => void;
  profileName?: string;
  onLogin: () => void;
}

export function Header({ market, pathname, menu, setMenu, profileName, onLogin }: HeaderProps) {
  const { link } = useApp();
  const nav = [...markets.map(m => ({ label: config[m].name, href: `/${m}` })), { label: 'News & Reviews', href: `/${market}/news` }, { label: 'Compare', href: `/${market}/compare` }];
  return <>
    <div className="border-b border-slate-200 bg-[#f7f8fa]"><div className="mx-auto flex min-h-8 max-w-[1240px] items-center justify-between px-5 text-xs text-slate-600"><span>India’s commercial vehicle discovery platform</span><span className="hidden md:block">Three marketplaces. One trusted journey.</span></div></div>
    <header className="border-b border-[#e3e6e9] bg-white">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-4 px-5 py-4">
        <a {...link('/')} aria-label="Cargo Junction home" className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-orange-600"><span className="rounded-md bg-[#f04b27] p-2 text-white"><Icon className="h-7 w-7" /></span><span className="text-left text-[23px] font-extrabold leading-6 tracking-tight text-[#172b3f]">cargo<span className="text-[#d93d1c]">junction</span><span className="block text-xs font-medium tracking-wider text-slate-600">YOUR BUSINESS. YOUR VEHICLE.</span></span></a>
        <div className="ml-auto hidden items-center gap-2 md:flex"><span className="text-sm text-slate-600">Your city</span><select aria-label="Your city" className="min-h-11 bg-white px-2 text-sm"><option>New Delhi</option><option>Mumbai</option><option>Pune</option><option>Bengaluru</option><option>Chennai</option></select></div>
        <button className={`${outline} ml-auto md:ml-3`} onClick={onLogin}>{profileName ? `Hi, ${profileName.split(' ')[0]}` : 'Login / Register'}</button><button aria-label="Toggle navigation" aria-expanded={menu} className="min-h-11 min-w-11 text-2xl lg:hidden" onClick={() => setMenu(!menu)}>☰</button>
      </div>
      <nav aria-label="Main navigation" className={`${menu ? 'block' : 'hidden'} border-t border-slate-100 lg:block`}><div className="mx-auto flex max-w-[1240px] flex-wrap gap-x-8 px-5">{nav.map(n => <a {...link(n.href)} key={n.label} aria-current={pathname === n.href || (markets.some(m => n.href === `/${m}`) && pathname.startsWith(`${n.href}/`)) ? 'page' : undefined} className={`flex min-h-12 items-center border-b-2 px-2 text-sm font-semibold focus-visible:ring-2 focus-visible:ring-orange-600 ${pathname.startsWith(n.href) ? 'border-[#f04b27] text-[#bc3517]' : 'border-transparent text-[#203d55] hover:text-[#bc3517]'}`}>{n.label}</a>)}</div></nav>
    </header>
  </>;
}
