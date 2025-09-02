import { useEffect, useState } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import {
  setFlashSaleActive,
  scheduleFlashSale,
  setFlashSaleEndsAt,
  setFlashSaleDiscountPct,
  setFlashSaleApplyDiscount,
  setFlashSaleLoop,
} from '@/store/uiFlagsSlice';
import { dataProvider } from '@/services/dataProvider';
import { getEvents } from '@/lib/analytics';
import { RefreshCcw, Flame } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const [stats, setStats] = useState<{ flowers: number; bouquets: number } | null>(null);
  const [analytics, setAnalytics] = useState<{ pv: number; ev: number }>({ pv: 0, ev: 0 });
  const [refreshing, setRefreshing] = useState(false);
  const flashSaleActive = useAppSelector((s) => s.uiFlags.flashSaleActive);
  const flashSaleEndsAt = useAppSelector((s) => s.uiFlags.flashSaleEndsAt);
  const dispatch = useAppDispatch();
  // Flash sale duration (minutes) – keep numeric state plus an uncontrolled text buffer so multi-digit entry isn't clamped mid-typing
  const [duration, setDuration] = useState(30);
  const [durationInput, setDurationInput] = useState('30');
  const discount = useAppSelector((s) => s.uiFlags.flashSaleDiscountPct) ?? 20;
  // Text buffer for discount so typing "10" doesn't instantly clamp the initial "1" to 5
  const [discountInput, setDiscountInput] = useState<string>(() => String(discount));
  const applyDiscount = useAppSelector((s) => s.uiFlags.flashSaleApplyDiscount);
  const loop = useAppSelector((s) => s.uiFlags.flashSaleLoop);
  const lastDuration = useAppSelector((s) => s.uiFlags.flashSaleLastDuration);
  // Sync discount input when external (slider / toggle) changes discount value
  useEffect(() => {
    setDiscountInput(String(discount));
  }, [discount]);
  // Sync duration input if duration state changes via slider
  useEffect(() => {
    setDurationInput(String(duration));
  }, [duration]);
  function load() {
    Promise.all([dataProvider.listFlowers(), dataProvider.listBouquets()]).then(([f, b]) => {
      setStats({ flowers: f.length, bouquets: b.length });
    });
    const evts = getEvents();
    const pv = evts.filter((e) => e.type === 'page_view').length;
    const ev = evts.filter((e) => e.type === 'event' && e.name !== 'session_start').length;
    setAnalytics({ pv, ev });
  }
  useEffect(() => {
    load();
    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, []);
  function manualRefresh() {
    setRefreshing(true);
    setTimeout(() => {
      load();
      setRefreshing(false);
    }, 300);
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between max-w-4xl">
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <button
          onClick={manualRefresh}
          disabled={refreshing}
          className="text-xs inline-flex items-center gap-1 px-3 py-1.5 rounded border hover:bg-pink-50 disabled:opacity-50"
        >
          <RefreshCcw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>
      <Card className="max-w-4xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Flame className="w-4 h-4 text-primary" /> Flash Sale
          </CardTitle>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Run urgency campaigns with optional dynamic discount. Toggle active state, set a
            duration, and choose a discount. You can also run a banner only (turn off Apply
            Discount).
          </p>
        </CardHeader>
        <CardContent className="pt-0 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex items-center gap-3">
              <Switch
                checked={flashSaleActive}
                onCheckedChange={(v) =>
                  v
                    ? dispatch(scheduleFlashSale({ durationMinutes: duration }))
                    : dispatch(setFlashSaleActive(false))
                }
                aria-label="Toggle flash sale"
              />
              <div className="text-sm font-medium">
                {flashSaleActive ? 'Active' : 'Inactive'}
                <div className="text-xs text-muted-foreground font-normal">
                  {flashSaleActive && flashSaleEndsAt
                    ? `Ends ${new Date(flashSaleEndsAt).toLocaleTimeString()}`
                    : 'Not running'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={loop}
                onCheckedChange={(v) => dispatch(setFlashSaleLoop(!!v))}
                aria-label="Loop flash sale"
              />
              <span className="text-xs text-muted-foreground">
                Loop{lastDuration ? ` (${lastDuration}m)` : ''}
              </span>
            </div>
            {flashSaleActive && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => dispatch(setFlashSaleActive(false))}
              >
                Stop
              </Button>
            )}
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide">
                <span>Duration (minutes)</span>
                <span className="text-muted-foreground">{duration}m</span>
              </div>
              <Slider
                value={[duration]}
                min={5}
                max={360}
                step={5}
                onValueChange={([v]) => setDuration(v)}
                disabled={flashSaleActive}
              />
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  className="w-24 h-8 text-sm"
                  value={durationInput}
                  min={5}
                  max={720}
                  step={5}
                  disabled={flashSaleActive}
                  onChange={(e) => {
                    // Allow empty for easier replacement
                    const val = e.target.value;
                    if (/^\d*$/.test(val)) setDurationInput(val);
                  }}
                  onBlur={() => {
                    const num = Number(durationInput);
                    if (!isNaN(num)) {
                      const clamped = Math.min(720, Math.max(5, Math.round(num)));
                      setDuration(clamped);
                      setDurationInput(String(clamped));
                    } else {
                      setDurationInput(String(duration));
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      (e.target as HTMLInputElement).blur();
                    }
                  }}
                />
                {!flashSaleActive && (
                  <Button
                    size="sm"
                    onClick={() => dispatch(scheduleFlashSale({ durationMinutes: duration }))}
                  >
                    Start
                  </Button>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide">
                <span>Discount %</span>
                <span className="text-muted-foreground">
                  {applyDiscount && discount ? `${discount}%` : 'None'}
                </span>
              </div>
              <Slider
                value={[applyDiscount ? discount : 0]}
                min={5}
                max={90}
                step={5}
                disabled={!applyDiscount}
                onValueChange={([v]) => dispatch(setFlashSaleDiscountPct(v))}
              />
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={applyDiscount}
                    onCheckedChange={(v) => dispatch(setFlashSaleApplyDiscount(!!v))}
                    aria-label="Apply discount"
                  />
                  <span className="text-xs">Apply discount</span>
                </div>
                {applyDiscount && (
                  <Input
                    type="number"
                    className="w-24 h-8 text-sm"
                    value={discountInput}
                    min={5}
                    max={90}
                    step={1}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d*$/.test(val)) setDiscountInput(val);
                    }}
                    onBlur={() => {
                      const num = Number(discountInput);
                      if (!isNaN(num)) {
                        const clamped = Math.min(90, Math.max(5, Math.round(num)));
                        dispatch(setFlashSaleDiscountPct(clamped));
                        setDiscountInput(String(clamped));
                      } else {
                        setDiscountInput(String(discount));
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        (e.target as HTMLInputElement).blur();
                      }
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl">
        <AnimatePresence initial={false}>
          <motion.div
            key="flowers"
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 rounded-lg border bg-white"
          >
            <div className="text-xs uppercase text-muted-foreground">Flowers</div>
            <div className="text-2xl font-bold">{stats ? stats.flowers : '—'}</div>
          </motion.div>
          <motion.div
            key="bouquets"
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 rounded-lg border bg-white"
          >
            <div className="text-xs uppercase text-muted-foreground">Bouquets</div>
            <div className="text-2xl font-bold">{stats ? stats.bouquets : '—'}</div>
          </motion.div>
          <motion.div
            key="pv"
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 rounded-lg border bg-white"
          >
            <div className="text-xs uppercase text-muted-foreground">Page Views (local)</div>
            <div className="text-2xl font-bold">{analytics.pv}</div>
          </motion.div>
          <motion.div
            key="ev"
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 rounded-lg border bg-white"
          >
            <div className="text-xs uppercase text-muted-foreground">Events (local)</div>
            <div className="text-2xl font-bold">{analytics.ev}</div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
