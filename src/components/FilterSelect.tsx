import { field } from '../lib/ui';

interface FilterSelectProps {
  label: string;
  value: string;
  values: string[];
  labels?: string[];
  onChange: (value: string) => void;
}

export function FilterSelect({ label, value, values, labels, onChange }: FilterSelectProps) {
  return <label className="block text-sm font-medium">{label}<select className={`${field} mt-2 font-normal`} value={value} onChange={e => onChange(e.target.value)}><option value="">All {label.toLowerCase()}</option>{values.map((v, i) => <option value={v} key={v}>{labels?.[i] || v}</option>)}</select></label>;
}
