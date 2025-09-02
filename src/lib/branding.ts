const LS_BRANDING_KEY = 'pf_branding_overrides_v1';

interface BrandingOverrides {
  siteName?: string;
  tagline?: string;
  heroImage?: string;
  email?: string;
  phone?: string;
  address?: string;
  github?: string;
  showPrices?: boolean;
}

function loadBrandingOverrides(): BrandingOverrides | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LS_BRANDING_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BrandingOverrides;
  } catch {
    return null;
  }
}

export const ENABLE_ADMIN = import.meta.env.VITE_ENABLE_ADMIN === 'true';
export const USE_LARAVEL = import.meta.env.VITE_USE_LARAVEL === 'true';
export const LARAVEL_API_BASE = import.meta.env.VITE_LARAVEL_API_BASE || '';

const overrides = (!USE_LARAVEL && ENABLE_ADMIN ? loadBrandingOverrides() : null) || {};

export const BRAND_NAME = overrides.siteName || import.meta.env.VITE_SITE_NAME || 'PetalFlow';
export const BRAND_TAGLINE =
  overrides.tagline || import.meta.env.VITE_SITE_TAGLINE || 'Crafting Digital Beauty';
export const BRAND_GITHUB =
  overrides.github || import.meta.env.VITE_CONTACT_GITHUB || 'https://github.com';
export const CONTACT_EMAIL =
  overrides.email || import.meta.env.VITE_CONTACT_EMAIL || 'hello@example.com';
export const CONTACT_PHONE =
  overrides.phone || import.meta.env.VITE_CONTACT_PHONE || '+1 (555) 123-4567';
export const CONTACT_ADDRESS =
  overrides.address || import.meta.env.VITE_CONTACT_ADDRESS || '123 Blossom Ave, Floral City';
export const HERO_IMAGE = overrides.heroImage || import.meta.env.VITE_HERO_IMAGE || '';
export const BRAND_LOGO = import.meta.env.VITE_BRAND_LOGO || '';
export const resolveHeroImage = (fallback: string) => (HERO_IMAGE ? HERO_IMAGE : fallback);
export const SHOW_PRICES =
  typeof overrides.showPrices === 'boolean'
    ? overrides.showPrices
    : (import.meta.env.VITE_SHOW_PRICES ?? 'true') !== 'false';

export function saveBrandingOverrides(data: BrandingOverrides) {
  try {
    localStorage.setItem(LS_BRANDING_KEY, JSON.stringify(data));
    window.location.reload();
  } catch {
    // ignore
  }
}
