import { createContext, useContext } from 'react';
import type { Dispatch, MouseEvent, SetStateAction } from 'react';
import type { Market, Vehicle } from '../types/vehicle';

export type CompareState = Partial<Record<Market, string[]>>;

export interface AppContextValue {
  go: (path: string) => void;
  link: (href: string) => { href: string; onClick: (e: MouseEvent<HTMLAnchorElement>) => void };
  ask: (v: Vehicle) => void;
  toggle: (v: Vehicle) => void;
  compared: CompareState;
  setCompared: Dispatch<SetStateAction<CompareState>>;
}

export const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppContext');
  return ctx;
}
