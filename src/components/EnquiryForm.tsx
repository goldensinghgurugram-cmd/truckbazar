import { useId, useState } from 'react';
import type { FormEvent } from 'react';
import { isEnquiryApiConfigured, submitEnquiry } from '../lib/api';
import { orange } from '../lib/ui';
import { normalizeIndianMobile, validateCity, validateMobile, validateName } from '../lib/validation';
import { money } from '../lib/vehicle';
import type { Vehicle } from '../types/vehicle';
import { TextField } from './TextField';

export type EnquiryStatus = 'idle' | 'sent' | 'saved-locally';

interface EnquiryFormProps {
  vehicle: Vehicle;
  onStatus?: (status: EnquiryStatus) => void;
  onContinue?: () => void;
}

export function EnquiryForm({ vehicle, onStatus, onContinue }: EnquiryFormProps) {
  const id = useId();
  const [values, setValues] = useState({ name: '', phone: '', city: '' });
  const [errors, setErrors] = useState<Partial<Record<'name' | 'phone' | 'city' | 'consent', string>>>({});
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<EnquiryStatus>('idle');
  const [error, setError] = useState('');

  const update = (key: keyof typeof values) => (value: string) => {
    setValues(v => ({ ...v, [key]: value }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }));
  };

  const finish = (next: EnquiryStatus) => { setStatus(next); onStatus?.(next); };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const nextErrors = {
      name: validateName(values.name),
      phone: validateMobile(values.phone),
      city: validateCity(values.city),
      consent: consent ? '' : 'Please confirm to continue.',
    };
    setErrors(nextErrors);
    setError('');
    if (Object.values(nextErrors).some(Boolean)) return;
    setSubmitting(true);
    const result = await submitEnquiry({
      name: values.name.trim(), phone: normalizeIndianMobile(values.phone)!, city: values.city.trim(),
      vehicleId: vehicle.id, vehicleName: vehicle.name, market: vehicle.market, createdAt: new Date().toISOString(),
    });
    setSubmitting(false);
    if (result.status === 'error') setError(result.message);
    else finish(result.status);
  };

  if (status === 'sent') return <><p role="status" className="text-sm leading-7 text-green-800">Thank you. Your enquiry for {vehicle.name} has been submitted.</p><p className="mt-3 text-sm leading-7 text-slate-600">Our team will contact you on the mobile number you provided.</p>{onContinue && <button className={`${orange} mt-5`} onClick={onContinue}>Continue Exploring</button>}</>;
  if (status === 'saved-locally') return <><p role="status" className="text-sm leading-7 text-green-800">Your enquiry for {vehicle.name} has been saved on this browser.</p><p className="mt-3 text-sm leading-7 text-slate-600">No dealer has been contacted. The enquiry service is not connected yet, so this is a frontend demonstration.</p>{onContinue ? <button className={`${orange} mt-5`} onClick={onContinue}>Continue Exploring</button> : <button className={`${orange} mt-5`} onClick={() => { setValues({ name: '', phone: '', city: '' }); setConsent(false); finish('idle'); }}>Make Another Enquiry</button>}</>;

  return <form noValidate onSubmit={onSubmit}>
    <p className="mb-4 text-sm text-slate-600">{money(vehicle)} · {vehicle.price === null ? 'Ask the dealer for current pricing' : 'Indicative price'}</p>
    <TextField id={`${id}-name`} name="name" label="Full name" value={values.name} error={errors.name} onChange={update('name')} autoComplete="name" />
    <TextField id={`${id}-phone`} name="phone" label="Mobile number" type="tel" inputMode="tel" value={values.phone} error={errors.phone} onChange={update('phone')} autoComplete="tel-national" />
    <TextField id={`${id}-city`} name="city" label="City" value={values.city} error={errors.city} onChange={update('city')} autoComplete="address-level2" />
    <label className="flex min-h-11 items-start gap-2 text-sm leading-6 text-slate-600"><input type="checkbox" checked={consent} onChange={e => { setConsent(e.target.checked); setErrors(er => ({ ...er, consent: '' })); }} aria-invalid={!!errors.consent} className="mt-1.5 accent-orange-600" />{isEnquiryApiConfigured ? 'I agree to be contacted about this enquiry by phone.' : 'I understand this demo saves my details only on this browser and does not contact a dealer.'}</label>
    {errors.consent && <p className="text-xs text-red-700">{errors.consent}</p>}
    {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
    <button className={`${orange} mt-4 w-full`} disabled={submitting} aria-busy={submitting}>{submitting ? 'Submitting…' : isEnquiryApiConfigured ? 'Submit Enquiry' : 'Save Demo Enquiry'}</button>
  </form>;
}
