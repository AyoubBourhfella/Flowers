export const BRAND_NAME = import.meta.env.VITE_SITE_NAME || 'PetalFlow';
export const BRAND_TAGLINE = import.meta.env.VITE_SITE_TAGLINE || 'Crafting Digital Beauty';
export const BRAND_GITHUB = import.meta.env.VITE_CONTACT_GITHUB || 'https://github.com';
export const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'hello@example.com';
export const CONTACT_PHONE = import.meta.env.VITE_CONTACT_PHONE || '+1 (555) 123-4567';
export const CONTACT_ADDRESS =
  import.meta.env.VITE_CONTACT_ADDRESS || '123 Blossom Ave, Floral City';
export const HERO_IMAGE = import.meta.env.VITE_HERO_IMAGE || '';
export const BRAND_LOGO = import.meta.env.VITE_BRAND_LOGO || '';
export const resolveHeroImage = (fallback: string) => (HERO_IMAGE ? HERO_IMAGE : fallback);
