import type { Market } from '../types/vehicle';

/**
 * Backend integration points. Set these in Vercel project environment variables
 * to connect real services; until then the app clearly runs in local preview mode.
 */
const ENQUIRY_API_URL = import.meta.env.VITE_ENQUIRY_API_URL;
const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL;

export const isEnquiryApiConfigured = !!ENQUIRY_API_URL;
export const isAuthApiConfigured = !!AUTH_API_URL;

export interface EnquiryPayload {
  name: string;
  phone: string;
  city: string;
  vehicleId: string;
  vehicleName: string;
  market: Market;
  createdAt: string;
}

export type SubmitResult =
  | { status: 'sent' }
  | { status: 'saved-locally' }
  | { status: 'error'; message: string };

const LOCAL_ENQUIRIES = 'cargo-enquiries';

export async function submitEnquiry(payload: EnquiryPayload): Promise<SubmitResult> {
  if (ENQUIRY_API_URL) {
    try {
      const response = await fetch(ENQUIRY_API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) return { status: 'error', message: 'We could not submit your enquiry right now. Please try again in a moment.' };
      return { status: 'sent' };
    } catch {
      return { status: 'error', message: 'Network error. Check your connection and try again.' };
    }
  }
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_ENQUIRIES) || '[]');
    localStorage.setItem(LOCAL_ENQUIRIES, JSON.stringify([...existing, payload]));
    return { status: 'saved-locally' };
  } catch {
    return { status: 'error', message: 'Your browser could not save this enquiry. Please allow local storage and try again.' };
  }
}

export interface Profile { name: string; phone: string }

const LOCAL_PROFILE = 'cargo-local-profile';
const LEGACY_PROFILE_NAME = 'cargo-local-name';

export function loadProfile(): Profile | null {
  try {
    const stored = localStorage.getItem(LOCAL_PROFILE);
    if (stored) return JSON.parse(stored) as Profile;
    const legacyName = localStorage.getItem(LEGACY_PROFILE_NAME);
    return legacyName ? { name: legacyName, phone: '' } : null;
  } catch {
    return null;
  }
}

export async function submitAuth(kind: 'login' | 'register', data: { name?: string; phone: string; email?: string }): Promise<{ ok: true; profile: Profile } | { ok: false; message: string }> {
  if (AUTH_API_URL) {
    try {
      const response = await fetch(`${AUTH_API_URL.replace(/\/$/, '')}/${kind}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(data) });
      if (!response.ok) return { ok: false, message: kind === 'login' ? 'Login failed. Check your details and try again.' : 'Registration failed. Please try again.' };
      const body = await response.json().catch(() => ({}));
      return { ok: true, profile: { name: body.name || data.name || 'Customer', phone: data.phone } };
    } catch {
      return { ok: false, message: 'Network error. Check your connection and try again.' };
    }
  }
  const profile: Profile = { name: data.name || `Guest ••${data.phone.slice(-4)}`, phone: data.phone };
  try {
    localStorage.setItem(LOCAL_PROFILE, JSON.stringify(profile));
    return { ok: true, profile };
  } catch {
    return { ok: false, message: 'Local storage is unavailable in this browser.' };
  }
}

export function clearProfile() {
  try { localStorage.removeItem(LOCAL_PROFILE); localStorage.removeItem(LEGACY_PROFILE_NAME); } catch { /* storage unavailable */ }
}
