import { field } from '../lib/ui';

interface TextFieldProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  inputMode?: 'text' | 'tel' | 'email';
  optional?: boolean;
}

export function TextField({ id, name, label, type = 'text', value, error, onChange, autoComplete, inputMode, optional }: TextFieldProps) {
  const errorId = `${id}-error`;
  return <label htmlFor={id} className="mb-4 block text-sm font-medium">{label}{optional && <span className="font-normal text-slate-600"> (optional)</span>}
    <input id={id} name={name} type={type} value={value} onChange={e => onChange(e.target.value)} autoComplete={autoComplete} inputMode={inputMode} aria-invalid={!!error} aria-describedby={error ? errorId : undefined} className={`${field} mt-2 ${error ? 'border-red-600' : ''}`} />
    {error && <span id={errorId} className="mt-1 block text-xs font-normal text-red-700">{error}</span>}
  </label>;
}
