/** Normalises an Indian mobile number (+91, 91, 0 prefixes, spaces, dashes) to 10 digits, or returns null. */
export function normalizeIndianMobile(input: string): string | null {
  let digits = input.replace(/[\s\-().]/g, '');
  if (digits.startsWith('+91')) digits = digits.slice(3);
  else if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

export const validateName = (value: string) => {
  const name = value.trim();
  if (!name) return 'Please enter your full name.';
  if (name.length < 2 || !/^[\p{L}][\p{L} .'-]*$/u.test(name)) return 'Please enter a valid name using letters only.';
  return '';
};

export const validateMobile = (value: string) => {
  if (!value.trim()) return 'Please enter your mobile number.';
  return normalizeIndianMobile(value) ? '' : 'Enter a valid 10-digit Indian mobile number starting with 6, 7, 8 or 9.';
};

export const validateCity = (value: string) => {
  const city = value.trim();
  if (!city) return 'Please enter your city.';
  if (city.length < 2) return 'Please enter a valid city name.';
  return '';
};

export const validateEmail = (value: string) => {
  if (!value.trim()) return '';
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()) ? '' : 'Please enter a valid email address.';
};
