import { useId, useState } from 'react';
import type { FormEvent } from 'react';
import { clearProfile, isAuthApiConfigured, submitAuth } from '../lib/api';
import type { Profile } from '../lib/api';
import { btn, orange, outline } from '../lib/ui';
import { normalizeIndianMobile, validateEmail, validateMobile, validateName } from '../lib/validation';
import { Modal } from './Modal';
import { TextField } from './TextField';

interface AuthModalProps {
  profile: Profile | null;
  onProfile: (profile: Profile | null) => void;
  close: () => void;
}

export function AuthModal({ profile, onProfile, close }: AuthModalProps) {
  const id = useId();
  const [register, setRegister] = useState(false);
  const [values, setValues] = useState({ name: '', phone: '', email: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof values, string>>>({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const preview = !isAuthApiConfigured;

  const update = (key: keyof typeof values) => (value: string) => {
    setValues(v => ({ ...v, [key]: value }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const nextErrors = { phone: validateMobile(values.phone), ...(register ? { name: validateName(values.name), email: validateEmail(values.email) } : {}) };
    setErrors(nextErrors);
    setError('');
    if (Object.values(nextErrors).some(Boolean)) return;
    setSubmitting(true);
    const result = await submitAuth(register ? 'register' : 'login', { phone: normalizeIndianMobile(values.phone)!, ...(register ? { name: values.name.trim(), email: values.email.trim() || undefined } : {}) });
    setSubmitting(false);
    if (!result.ok) { setError(result.message); return; }
    onProfile(result.profile);
    close();
  };

  const title = profile ? (preview ? 'Your local preview profile' : 'Your account') : register ? `Register${preview ? ' · Preview' : ''}` : `Login${preview ? ' · Preview' : ''}`;

  return <Modal title={title} close={close}>
    {preview && <p className="mb-5 text-sm leading-7 text-slate-600">Account authentication is not connected. Your details are kept on this browser only. This does not create a real account or sign you in.</p>}
    {profile ? <><p className="mb-1 font-semibold">{profile.name}</p>{profile.phone && <p className="mb-4 text-sm text-slate-600">Mobile ••••••{profile.phone.slice(-4)}</p>}<button className={outline} onClick={() => { clearProfile(); onProfile(null); close(); }}>{preview ? 'Clear Local Profile' : 'Log Out'}</button></>
      : <form noValidate onSubmit={onSubmit}>
        {register && <TextField id={`${id}-name`} name="name" label="Full name" value={values.name} error={errors.name} onChange={update('name')} autoComplete="name" />}
        <TextField id={`${id}-phone`} name="phone" label="Mobile number" type="tel" inputMode="tel" value={values.phone} error={errors.phone} onChange={update('phone')} autoComplete="tel-national" />
        {register && <TextField id={`${id}-email`} name="email" label="Email" type="email" inputMode="email" optional value={values.email} error={errors.email} onChange={update('email')} autoComplete="email" />}
        {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
        <button className={`${orange} mt-5 w-full`} disabled={submitting} aria-busy={submitting}>{submitting ? 'Please wait…' : preview ? (register ? 'Create Local Preview Profile' : 'Use Local Preview Profile') : register ? 'Register' : 'Login'}</button>
        <button type="button" className={`${btn} mt-2 w-full text-[#bc3517]`} onClick={() => { setRegister(!register); setErrors({}); setError(''); }}>{register ? `Already registered? Login${preview ? ' preview' : ''}` : `New here? Register${preview ? ' preview' : ''}`}</button>
      </form>}
  </Modal>;
}
