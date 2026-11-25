import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

export function Modal({ title, close, children }: { title: string; close: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(close);
  closeRef.current = close;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const elements = () => ref.current?.querySelectorAll<HTMLElement>('button,input,select,a,textarea');
    elements()?.[0]?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current();
      const items = elements(); if (e.key !== 'Tab' || !items?.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    const overflow = document.body.style.overflow; document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handler);
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#172b3f]/70 p-4" onClick={close}><div ref={ref} role="dialog" aria-modal="true" aria-labelledby="dialog-title" className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl" onClick={e => e.stopPropagation()}><div className="mb-4 flex items-center justify-between gap-3"><h2 id="dialog-title" className="text-xl font-bold text-[#172b3f]">{title}</h2><button onClick={close} className="min-h-11 min-w-11 text-2xl" aria-label="Close dialog">×</button></div>{children}</div></div>;
}
