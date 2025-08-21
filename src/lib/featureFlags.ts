// Centralized feature flags pulling from Vite env vars
// Usage: import { showPrices } from '@/lib/featureFlags'

export const showPrices: boolean = (import.meta.env.VITE_SHOW_PRICES ?? 'true') !== 'false';
