import type { RouteMeta } from '@/components/Breadcrumbs';

export const ROUTES: RouteMeta[] = [
  { path: '/', label: 'Home' },
  { path: '/flowers', label: 'Flowers', parent: '/' },
  { path: '/bouquets', label: 'Bouquets', parent: '/' },
  { path: '/occasions', label: 'Occasions', parent: '/' },
  { path: '/custom-bouquet', label: 'Custom Bouquet', parent: '/' },
  { path: '/product/:slug', label: 'Product', parent: '/flowers', dynamic: true },
  { path: '/about', label: 'About', parent: '/' },
  { path: '/delivery', label: 'Delivery', parent: '/' },
  { path: '/care-guide', label: 'Care Guide', parent: '/' },
  { path: '/privacy', label: 'Privacy', parent: '/' },
  { path: '/terms', label: 'Terms', parent: '/' },
  { path: '/search', label: 'Search', parent: '/' },
];

export const routeIndex = new Map(ROUTES.map((r) => [r.path, r]));
