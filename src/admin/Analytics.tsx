import { useEffect, useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getEvents, getEventMeta } from '@/lib/analytics';
import { RefreshCw } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface Stat {
  label: string;
  value: number;
}

function groupBy<T, K extends string | number>(items: T[], keyFn: (i: T) => K) {
  return items.reduce((acc, item) => {
    const k = keyFn(item);
    (acc[k] ||= []).push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

const AnalyticsPage = () => {
  const [version, setVersion] = useState(0);
  const [events, setEvents] = useState(() => getEvents());
  const [range, setRange] = useState<'24h' | '7d' | 'all'>('24h');
  useEffect(() => {
    setEvents(getEvents());
  }, [version]);

  // Filter by selected timeframe
  const now = Date.now();
  const ranged = events.filter((e) => {
    if (range === 'all') return true;
    const diff = now - e.ts;
    if (range === '24h') return diff <= 24 * 60 * 60 * 1000;
    if (range === '7d') return diff <= 7 * 24 * 60 * 60 * 1000;
    return true;
  });

  // Product centric metrics only
  const impressions = ranged.filter((e) => e.name === 'product_impression');
  const clicks = ranged.filter((e) => e.name === 'product_click');
  const productViews = ranged.filter((e) => e.name === 'product_view');
  const reviewSubmits = ranged.filter((e) => e.name === 'review_submit');
  const dwellEvents = ranged.filter((e) => e.name === 'product_dwell');

  const impressionsCount = impressions.length;
  const clicksCount = clicks.length;
  const productViewsCount = productViews.length;
  const reviewCount = reviewSubmits.length;
  const avgDwellMs = dwellEvents.length
    ? Math.round(
        dwellEvents.reduce((sum, e) => sum + (Number(e.props?.ms) || 0), 0) / dwellEvents.length
      )
    : 0;
  const medianDwellMs = useMemo(() => {
    if (!dwellEvents.length) return 0;
    const arr = dwellEvents.map((e) => Number(e.props?.ms) || 0).sort((a, b) => a - b);
    const mid = Math.floor(arr.length / 2);
    return arr.length % 2 ? arr[mid] : Math.round((arr[mid - 1] + arr[mid]) / 2);
  }, [dwellEvents]);
  const clickThroughRate = impressionsCount
    ? ((clicksCount / impressionsCount) * 100).toFixed(1)
    : '0.0';
  const viewRate = clicksCount ? ((productViewsCount / clicksCount) * 100).toFixed(1) : '0.0';
  const reviewConversion = productViewsCount
    ? ((reviewCount / productViewsCount) * 100).toFixed(1)
    : '0.0';

  // Per-product aggregation
  type ProdAgg = {
    slug: string;
    impressions: number;
    clicks: number;
    views: number;
    reviews: number;
    avgDwell: number;
  };
  const perProduct: Record<string, ProdAgg> = {};
  function ensure(slug: string) {
    if (!perProduct[slug])
      perProduct[slug] = {
        slug,
        impressions: 0,
        clicks: 0,
        views: 0,
        reviews: 0,
        avgDwell: 0,
      };
    return perProduct[slug];
  }
  impressions.forEach((e) => {
    const slug = String(e.props?.slug || '');
    if (!slug) return;
    ensure(slug).impressions++;
  });
  clicks.forEach((e) => {
    const slug = String(e.props?.slug || '');
    if (!slug) return;
    ensure(slug).clicks++;
  });
  productViews.forEach((e) => {
    const slug = String(e.props?.slug || '');
    if (!slug) return;
    ensure(slug).views++;
  });
  reviewSubmits.forEach((e) => {
    const slug = String(e.props?.slug || '');
    if (!slug) return;
    ensure(slug).reviews++;
  });
  const dwellBuckets: Record<string, number[]> = {};
  dwellEvents.forEach((e) => {
    const slug = String(e.props?.slug || '');
    if (!slug) return;
    (dwellBuckets[slug] ||= []).push(Number(e.props?.ms) || 0);
  });
  Object.entries(dwellBuckets).forEach(([slug, arr]) => {
    ensure(slug).avgDwell = Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
  });
  const productRowsBase = Object.values(perProduct)
    .filter((p) => p.views > 0 || p.impressions > 0)
    .map((p) => ({
      ...p,
      clickRate: p.impressions ? (p.clicks / p.impressions) * 100 : 0,
      viewRate: p.clicks ? (p.views / p.clicks) * 100 : 0,
      reviewRate: p.views ? (p.reviews / p.views) * 100 : 0,
    }));

  type SortField =
    | 'views'
    | 'impressions'
    | 'clicks'
    | 'reviews'
    | 'avgDwell'
    | 'clickRate'
    | 'viewRate'
    | 'reviewRate';
  const [sortField, setSortField] = useState<SortField>('views');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [refreshing, setRefreshing] = useState(false);

  const productRows = useMemo(() => {
    const arr = [...productRowsBase];
    const getVal = (o: (typeof productRowsBase)[number]) => {
      switch (sortField) {
        case 'views':
          return o.views;
        case 'impressions':
          return o.impressions;
        case 'clicks':
          return o.clicks;
        case 'reviews':
          return o.reviews;
        case 'avgDwell':
          return o.avgDwell;
        case 'clickRate':
          return o.clickRate;
        case 'viewRate':
          return o.viewRate;
        case 'reviewRate':
          return o.reviewRate;
        default:
          return 0;
      }
    };
    arr.sort((a, b) => {
      const av = getVal(a);
      const bv = getVal(b);
      if (av === bv) return 0;
      return sortDir === 'desc' ? (bv > av ? 1 : -1) : av > bv ? 1 : -1;
    });
    return arr;
  }, [productRowsBase, sortField, sortDir]);

  function formatDuration(ms: number) {
    if (ms < 1000) return ms + 'ms';
    const s = ms / 1000;
    if (s < 60) return (s < 10 ? s.toFixed(2) : s.toFixed(1)) + 's';
    const m = s / 60;
    if (m < 60) return (m < 10 ? m.toFixed(2) : m.toFixed(1)) + 'm';
    const h = m / 60;
    return (h < 10 ? h.toFixed(2) : h.toFixed(1)) + 'h';
  }

  // Search & pagination state
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = productRows.filter((r) =>
    !search.trim() ? true : r.slug.toLowerCase().includes(search.trim().toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  if (page > totalPages) setPage(totalPages); // adjust if filter shrinks set
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  function exportCSV() {
    const rows = [
      [
        'slug',
        'impressions',
        'clicks',
        'views',
        'reviews',
        'avg_dwell_ms',
        'click_rate_%',
        'view_rate_%',
        'review_rate_%',
      ],
    ];
    filtered.forEach((p) =>
      rows.push([
        p.slug,
        String(p.impressions),
        String(p.clicks),
        String(p.views),
        String(p.reviews),
        String(p.avgDwell),
        p.clickRate.toFixed(1),
        p.viewRate.toFixed(1),
        p.reviewRate.toFixed(1),
      ])
    );
    const csv = rows.map((r) => r.map((f) => '"' + f + '"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `product_analytics_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Product Performance</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Engagement with products (
            {range === '24h' ? 'last 24 hours' : range === '7d' ? 'last 7 days' : 'all time'}).
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="flex gap-1 bg-muted/50 rounded-md p-1 text-xs">
            {(['24h', '7d', 'all'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-2 py-1 rounded-md ${
                  range === r ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                } transition`}
              >
                {r}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setRefreshing(true);
              setVersion((v) => v + 1);
              setTimeout(() => setRefreshing(false), 350);
            }}
            className="gap-2"
            aria-busy={refreshing}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </Button>
          <Button variant="outline" size="sm" onClick={exportCSV}>
            Export CSV
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="p-4 flex flex-col gap-1">
          <span className="text-[11px] font-medium text-muted-foreground">Impressions</span>
          <span className="text-2xl font-semibold leading-none">{impressionsCount}</span>
          <span className="text-[11px] text-muted-foreground">cards seen</span>
        </Card>
        <Card className="p-4 flex flex-col gap-1">
          <span className="text-[11px] font-medium text-muted-foreground">Clicks</span>
          <span className="text-2xl font-semibold leading-none">{clicksCount}</span>
          <span className="text-[11px] text-muted-foreground">{clickThroughRate}% CTR</span>
        </Card>
        <Card className="p-4 flex flex-col gap-1">
          <span className="text-[11px] font-medium text-muted-foreground">Detail Views</span>
          <span className="text-2xl font-semibold leading-none">{productViewsCount}</span>
          <span className="text-[11px] text-muted-foreground">{viewRate}% from clicks</span>
        </Card>
        <Card className="p-4 flex flex-col gap-1">
          <span className="text-[11px] font-medium text-muted-foreground">Avg Dwell</span>
          <span className="text-2xl font-semibold leading-none">{formatDuration(avgDwellMs)}</span>
          <span className="text-[11px] text-muted-foreground">
            median {formatDuration(medianDwellMs)}
          </span>
        </Card>
        <Card className="p-4 flex flex-col gap-1">
          <span className="text-[11px] font-medium text-muted-foreground">Review Conv.</span>
          <span className="text-2xl font-semibold leading-none">{reviewConversion}%</span>
          <span className="text-[11px] text-muted-foreground">{reviewCount} reviews</span>
        </Card>
      </div>
      <Card className="p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-2">
          <div>
            <h2 className="text-sm font-medium">Per Product Breakdown</h2>
            <p className="text-[11px] text-muted-foreground mt-1">Sortable & filterable.</p>
          </div>
          <div className="flex flex-wrap gap-2 items-center text-xs">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search slug..."
              className="border rounded px-2 py-1 bg-background"
            />
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="border rounded px-2 py-1 bg-background"
            >
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}/page
                </option>
              ))}
            </select>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-7 px-2"
              >
                Prev
              </Button>
              <span className="text-[11px] text-muted-foreground">
                {page}/{totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="h-7 px-2"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-muted-foreground text-[10px] uppercase select-none">
                {(() => {
                  type Col = { key: string; label: string; sortable?: boolean };
                  const cols: Col[] = [
                    { key: 'slug', label: 'Slug', sortable: false },
                    { key: 'impressions', label: 'Impr' },
                    { key: 'clicks', label: 'Clicks' },
                    { key: 'views', label: 'Views' },
                    { key: 'reviews', label: 'Reviews' },
                    { key: 'avgDwell', label: 'Avg Dwell' },
                    { key: 'clickRate', label: 'CTR%' },
                    { key: 'viewRate', label: 'View%' },
                    { key: 'reviewRate', label: 'Rev%' },
                  ];
                  return cols;
                })().map((col) => (
                  <th
                    key={col.key}
                    className={`text-left py-1 px-2 ${
                      col.sortable === false ? '' : 'cursor-pointer hover:underline'
                    }`}
                    onClick={() => {
                      if (col.sortable === false) return;
                      if (sortField === col.key) {
                        setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
                      } else {
                        setSortField(col.key as SortField);
                        setSortDir('desc');
                      }
                      setPage(1);
                    }}
                  >
                    {col.label}
                    {sortField === col.key && (
                      <span className="ml-1">{sortDir === 'desc' ? '↓' : '↑'}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {paginated.map((p) => (
                  <motion.tr
                    key={p.slug}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="border-t"
                  >
                    <td className="py-1 px-2 font-medium">{p.slug}</td>
                    <td className="py-1 px-2">{p.impressions}</td>
                    <td className="py-1 px-2">{p.clicks}</td>
                    <td className="py-1 px-2">{p.views}</td>
                    <td className="py-1 px-2">{p.reviews}</td>
                    <td className="py-1 px-2">{formatDuration(p.avgDwell)}</td>
                    <td className="py-1 px-2">{p.clickRate.toFixed(1)}</td>
                    <td className="py-1 px-2">{p.viewRate.toFixed(1)}</td>
                    <td className="py-1 px-2">{p.reviewRate.toFixed(1)}</td>
                  </motion.tr>
                ))}
                {!paginated.length && (
                  <motion.tr
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={9} className="py-6 text-center text-muted-foreground">
                      No product data yet.
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        <div className="mt-4 space-y-2">
          <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            What each column means & how it's measured
          </h3>
          <ul className="text-[11px] text-muted-foreground grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            <li>
              <strong>Impr</strong>: Product card became visible (counted once per viewing session).
            </li>
            <li>
              <strong>Clicks</strong>: User clicked from listing to product detail.
            </li>
            <li>
              <strong>Views</strong>: Detail page fully loaded (stronger intent signal).
            </li>
            <li>
              <strong>Reviews</strong>: Posted reviews (advocacy & satisfaction proxy).
            </li>
            <li>
              <strong>Avg Dwell</strong>: Average open time of detail page (auto-scaled units).
            </li>
            <li>
              <strong>CTR%</strong>: Clicks ÷ Impressions * 100 (listing attractiveness).
            </li>
            <li>
              <strong>View%</strong>: Views ÷ Clicks * 100 (post-click follow-through).
            </li>
            <li>
              <strong>Rev%</strong>: Reviews ÷ Views * 100 (customer delight / advocacy).
            </li>
          </ul>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Sort to surface strengths: high CTR% = strong thumbnail/title; high Avg Dwell = rich
            content; high Rev% = loved product. Combine metrics for optimization (e.g. low CTR% but
            high View% suggests improving card presentation). All data stays local.
          </p>
          <p className="text-[11px] text-muted-foreground">
            CSV export applies current search (all filtered rows, dwell in raw ms).
          </p>
        </div>
      </Card>
    </div>
  );
};
export default AnalyticsPage;
