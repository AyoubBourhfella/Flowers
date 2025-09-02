// Simple in-browser analytics with cookie consent gating.
// Tracks page views, events, and keeps an in-memory + localStorage queue for durability.
// Only activates if analytics consent is granted (cookie category 'analytics').

export type AnalyticsEvent = {
  id: string;
  type: 'page_view' | 'event';
  name: string;
  ts: number;
  path?: string;
  props?: Record<string, unknown>;
};

const STORAGE_KEY = 'pf_analytics_events_v1';

let buffer: AnalyticsEvent[] = [];
let consentGranted = false;

function loadBuffer() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) buffer = JSON.parse(raw) as AnalyticsEvent[];
  } catch (e) {
    // ignore parse errors
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(buffer.slice(-500))); // cap
  } catch (e) {
    // ignore storage errors
  }
}

export function setAnalyticsConsent(granted: boolean) {
  consentGranted = granted;
  if (granted) {
    // flush a synthetic session start event
    trackEvent('session_start', { path: window.location.pathname });
  }
}

export function isAnalyticsEnabled() {
  return consentGranted;
}

export function trackPageView(path: string) {
  if (!consentGranted) return;
  const evt: AnalyticsEvent = {
    id: crypto.randomUUID(),
    type: 'page_view',
    name: 'page_view',
    ts: Date.now(),
    path,
  };
  buffer.push(evt);
  persist();
}

export function trackEvent(name: string, props?: Record<string, unknown>) {
  if (!consentGranted) return;
  const evt: AnalyticsEvent = {
    id: crypto.randomUUID(),
    type: 'event',
    name,
    ts: Date.now(),
    path: window.location.pathname,
    props,
  };
  buffer.push(evt);
  persist();
}

export function getEvents(): AnalyticsEvent[] {
  return buffer.slice();
}

// Friendly event metadata (do not localize yet; keeps raw event names stable)
export const EVENT_META: Record<string, { label: string; category: string; description?: string }> =
  {
    session_start: {
      label: 'Session Start',
      category: 'Session',
      description: 'First event after consent granted.',
    },
    product_view: {
      label: 'Product Viewed',
      category: 'Catalog',
      description: 'A product detail page was opened.',
    },
    review_submit: {
      label: 'Review Submitted',
      category: 'Engagement',
      description: 'User posted a product review.',
    },
    product_impression: {
      label: 'Product Card Viewed',
      category: 'Catalog',
      description: 'Product card appeared in viewport.',
    },
    product_click: {
      label: 'Product Card Clicked',
      category: 'Catalog',
      description: 'User clicked product card view button.',
    },
    product_dwell: {
      label: 'Product Dwell Time',
      category: 'Catalog',
      description: 'Time spent on a product detail page (ms).',
    },
    search_submit: {
      label: 'Search Performed',
      category: 'Search',
      description: 'User executed a search query.',
    },
    filter_category: {
      label: 'Category Filter Changed',
      category: 'Filters',
      description: 'User changed the category filter.',
    },
    filter_price_max: {
      label: 'Price Filter Adjusted',
      category: 'Filters',
      description: 'User adjusted max price slider.',
    },
    filter_search_apply: {
      label: 'Filter Search Applied',
      category: 'Filters',
      description: 'User applied search in filters panel.',
    },
    filter_search_clear: {
      label: 'Filter Search Cleared',
      category: 'Filters',
      description: 'User cleared search input in filters panel.',
    },
    filter_sort: {
      label: 'Sort Option Changed',
      category: 'Filters',
      description: 'User selected a new sort option.',
    },
    consent_accept_all: {
      label: 'Consent Accept All',
      category: 'Consent',
      description: 'User accepted all cookie categories.',
    },
    consent_reject: {
      label: 'Consent Rejected',
      category: 'Consent',
      description: 'User rejected non-essential cookies.',
    },
    consent_customize: {
      label: 'Consent Customized',
      category: 'Consent',
      description: 'User saved a custom consent selection.',
    },
  };

export function getEventMeta(name: string) {
  return EVENT_META[name] || { label: name, category: 'Other' };
}

loadBuffer();
