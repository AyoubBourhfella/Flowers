import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import {
  Star,
  Truck,
  ShieldCheck,
  Flower2,
  Share2,
  ArrowLeft,
  Info,
  MessageSquarePlus,
} from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import type { FlowerItem } from '@/store/flowersSlice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { addReview, selectReviewsForProduct } from '@/store/reviewsSlice';
import { setFlashSaleActive, setFlashSaleEndsAt } from '@/store/uiFlagsSlice';
import { useAppSelector } from '@/hooks/useAppSelector';
import { showPrices } from '@/lib/featureFlags';
import { trackEvent } from '@/lib/analytics';
import MultiImageDropInput from '@/components/admin/MultiImageDropInput';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

import { Progress } from '@/components/ui/progress';
import { Flame, Users } from 'lucide-react';

const FlashSaleBanner = ({
  endsAt,
  viewerCount,
  now,
  discountPct,
  applyDiscount,
}: {
  endsAt: string;
  viewerCount: number;
  now: number;
  discountPct: number | null | undefined;
  applyDiscount: boolean;
}) => {
  const endMs = Date.parse(endsAt);
  const msLeft = Math.max(0, endMs - now);
  const totalSec = Math.floor(msLeft / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  // Progress (reverse: time remaining vs full span) – assume max duration 6h for bar scaling fallback
  const MAX_WINDOW_MS = 6 * 3600 * 1000;
  const elapsedRatio = 1 - Math.min(1, msLeft / MAX_WINDOW_MS);
  const hh = h.toString().padStart(2, '0');
  const mm = m.toString().padStart(2, '0');
  const ss = s.toString().padStart(2, '0');
  return (
    <div className="group relative mb-5 w-full overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-pink-50 to-rose-50 p-4 shadow-sm ring-1 ring-primary/10 animate-in fade-in slide-in-from-top-2">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.6),transparent_60%)] pointer-events-none" />
      <div className="relative flex flex-col gap-3">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Flame className="w-4 h-4 animate-pulse" /> Flash Sale
              {applyDiscount && discountPct ? (
                <span className="text-[10px] font-semibold tracking-wide text-red-600 bg-red-100/70 px-2 py-0.5 rounded-md border border-red-200 shadow-inner">
                  -{discountPct}%
                </span>
              ) : (
                <span className="text-[10px] font-medium tracking-wide text-primary/70 bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                  Live now
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
              {viewerCount} viewing
            </div>
          </div>
          {/* Digital clock */}
          <div
            className="flex items-stretch gap-1 font-mono text-base md:text-2xl font-semibold tracking-wider select-none"
            aria-label="Flash sale time remaining"
            role="timer"
          >
            {[...hh].map((d, i) => (
              <span
                key={`h${i}`}
                className="px-2 md:px-3 py-1 rounded-md bg-primary/15 border border-primary/30 shadow-inner backdrop-blur-sm"
              >
                {d}
              </span>
            ))}
            <span className="px-0.5 md:px-1 py-1 text-primary animate-pulse">:</span>
            {[...mm].map((d, i) => (
              <span
                key={`m${i}`}
                className="px-2 md:px-3 py-1 rounded-md bg-primary/15 border border-primary/30 shadow-inner backdrop-blur-sm"
              >
                {d}
              </span>
            ))}
            <span className="px-0.5 md:px-1 py-1 text-primary animate-pulse">:</span>
            {[...ss].map((d, i) => (
              <span
                key={`s${i}`}
                className="px-2 md:px-3 py-1 rounded-md bg-primary/15 border border-primary/30 shadow-inner backdrop-blur-sm"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-1 w-full">
          <Progress
            value={Math.round(elapsedRatio * 100)}
            className="h-2 overflow-visible bg-primary/10"
          />
          <div className="flex justify-between text-[10px] uppercase tracking-wide text-muted-foreground">
            <span>Started</span>
            <span>Ending Soon</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Product = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const flowerItems = useAppSelector((s) => s.flowers.items);
  const bouquetItems = useAppSelector((s) => s.bouquets.items);
  const dispatch = useAppDispatch();
  const reviews = useAppSelector(selectReviewsForProduct(slug || ''));
  const flashSaleActive = useAppSelector((s) => s.uiFlags.flashSaleActive);
  const flashSaleEndsAt = useAppSelector((s) => s.uiFlags.flashSaleEndsAt);
  const flashSaleDiscountPct = useAppSelector((s) => s.uiFlags.flashSaleDiscountPct);
  const flashSaleApplyDiscount = useAppSelector((s) => s.uiFlags.flashSaleApplyDiscount);
  const flashSaleLoop = useAppSelector((s) => s.uiFlags.flashSaleLoop);
  const flashSaleLastDuration = useAppSelector((s) => s.uiFlags.flashSaleLastDuration);
  const allItems = [...flowerItems, ...bouquetItems];
  const product = allItems.find((p) => p.slug === slug);
  const relatedItems = allItems.filter((p) => p.slug !== slug).slice(0, 3);
  // Determine if product is a flower by membership instead of relying on optional originalPrice
  const isFlowerItem = (p: typeof product): p is FlowerItem => {
    if (!p) return false;
    return flowerItems.some((f) => f.id === p.id);
  };
  const hasTags = (p: typeof product): p is FlowerItem & { tags: string[] } => {
    if (!p) return false;
    const rec = p as unknown as { tags?: unknown };
    return Array.isArray(rec.tags);
  };
  const [formName, setFormName] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formComment, setFormComment] = useState('');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [hover, setHover] = useState(0);
  const [openReview, setOpenReview] = useState(false);
  const { toast } = useToast();
  const [now, setNow] = useState(Date.now());
  const [viewerCount, setViewerCount] = useState(() => 12 + Math.floor(Math.random() * 20));

  // Tick for countdown (1s) and slower viewer fluctuation (random 4-7s)
  useEffect(() => {
    if (!flashSaleActive) return;
    const tick = setInterval(() => setNow(Date.now()), 1000);
    let viewerTimer: number | null = null;
    function scheduleViewer() {
      if (!flashSaleActive) return;
      const delay = 4000 + Math.random() * 3000; // 4-7s
      viewerTimer = window.setTimeout(() => {
        setViewerCount((c) => {
          const magnitude = Math.random() < 0.2 ? 2 : 1;
          const delta = Math.random() < 0.5 ? -magnitude : magnitude;
          const next = c + delta;
          return Math.min(99, Math.max(5, next));
        });
        scheduleViewer();
      }, delay);
    }
    scheduleViewer();
    return () => {
      clearInterval(tick);
      if (viewerTimer) clearTimeout(viewerTimer);
    };
  }, [flashSaleActive]);

  // Auto deactivate or loop restart when expired
  useEffect(() => {
    if (flashSaleActive && flashSaleEndsAt) {
      if (Date.now() > Date.parse(flashSaleEndsAt)) {
        if (flashSaleLoop && flashSaleLastDuration) {
          // restart
          dispatch(
            setFlashSaleEndsAt(new Date(Date.now() + flashSaleLastDuration * 60000).toISOString())
          );
        } else {
          dispatch(setFlashSaleActive(false));
        }
      }
    }
  }, [flashSaleActive, flashSaleEndsAt, now, dispatch, flashSaleLoop, flashSaleLastDuration]);

  const displayRating = useMemo(() => {
    if (reviews.length > 0) {
      const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
      return { rating: avg, count: reviews.length };
    }
    return { rating: 0, count: 0 };
  }, [reviews]);

  useEffect(() => {
    if (product) trackEvent('product_view', { slug: product.slug, price: product.price });
  }, [product]);

  // Dwell time tracking
  useEffect(() => {
    if (!product) return;
    const start = performance.now();
    const visHandler = () => {
      if (document.visibilityState === 'hidden') {
        const dur = Math.round(performance.now() - start);
        trackEvent('product_dwell', { slug: product.slug, ms: dur, final: false });
      }
    };
    document.addEventListener('visibilitychange', visHandler);
    return () => {
      document.removeEventListener('visibilitychange', visHandler);
      const duration = Math.round(performance.now() - start);
      trackEvent('product_dwell', { slug: product.slug, ms: duration, final: true });
    };
  }, [product]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-24">
        <p className="mb-6">Product not found.</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  // Determine listing & explore paths based on item type
  const listingPath = isFlowerItem(product) ? '/flowers' : '/bouquets';
  const explorePath = `${listingPath}?cat=${encodeURIComponent(product.category || '')}`;

  function handleBack() {
    // Prefer history back if coming from another page within app
    if (window.history.length > 1) navigate(-1);
    else navigate(listingPath);
  }

  async function handleShare() {
    const url = window.location.href;
    const shareData = {
      title: product.title,
      text: `Check out this ${isFlowerItem(product) ? 'flower' : 'bouquet'}: ${product.title}`,
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        toast({ title: 'Link copied', description: 'Product URL copied to clipboard.' });
      }
    } catch (e) {
      // Fallback attempt to copy if share cancelled or failed
      try {
        await navigator.clipboard.writeText(url);
        toast({ title: 'Link copied', description: 'Product URL copied to clipboard.' });
      } catch {
        toast({ title: 'Share failed', description: 'Unable to share this product.' });
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mb-6">
        <Breadcrumbs currentLabel={product.title} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <Card className="overflow-hidden">
          <img src={product.image} alt={product.title} className="w-full h-[420px] object-cover" />
        </Card>
        <div>
          <div className="flex items-center gap-2 mb-3">
            {product.badge && (
              <Badge className="bg-primary text-primary-foreground">{product.badge}</Badge>
            )}
          </div>
          <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-2">{product.title}</h1>
          {flashSaleActive && flashSaleEndsAt && (
            <FlashSaleBanner
              endsAt={flashSaleEndsAt}
              viewerCount={viewerCount}
              now={now}
              discountPct={flashSaleDiscountPct}
              applyDiscount={flashSaleApplyDiscount}
            />
          )}

          <div
            className="flex items-center gap-2 mb-4"
            itemProp="aggregateRating"
            itemScope
            itemType="https://schema.org/AggregateRating"
          >
            {[...Array(5)].map((_, i) => {
              const filled = i + 1 <= Math.round(displayRating.rating);
              return (
                <Star
                  key={i}
                  className={`w-4 h-4 ${filled ? 'text-gold fill-current' : 'text-gray-300'}`}
                />
              );
            })}
            <span className="text-sm text-muted-foreground">
              <span itemProp="ratingValue">{displayRating.rating.toFixed(1)}</span> ·{' '}
              <span itemProp="reviewCount">{displayRating.count}</span>
            </span>
          </div>

          {showPrices ? (
            (() => {
              const basePrice = product.price;
              const discountPct =
                flashSaleActive && flashSaleEndsAt && flashSaleApplyDiscount
                  ? flashSaleDiscountPct
                  : null;
              const discounted =
                discountPct != null
                  ? Math.max(0.5, Number((basePrice * (1 - discountPct / 100)).toFixed(2)))
                  : null;
              return (
                <div className="flex items-end gap-3 mb-6 flex-wrap">
                  {discounted ? (
                    <>
                      <span className="text-3xl font-bold text-primary">
                        ${discounted.toFixed(2)}
                      </span>
                      <span className="text-muted-foreground line-through text-lg">
                        ${basePrice.toFixed(2)}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-red-500 text-white text-xs font-semibold tracking-wide">
                        -{discountPct}%
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-primary">${basePrice.toFixed(2)}</span>
                  )}
                  {!discounted && isFlowerItem(product) && product.originalPrice && (
                    <span className="text-muted-foreground line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              );
            })()
          ) : (
            <div className="mb-6 p-4 rounded-lg border border-sakura-pink/30 bg-muted/30 flex gap-3 text-sm leading-relaxed">
              <Info className="w-5 h-5 text-primary shrink-0" />
              <div>
                Pricing for this arrangement is available upon request. Contact us for a tailored
                quote based on stem count, size, and delivery preferences.
              </div>
            </div>
          )}

          <p className="text-muted-foreground mb-6 leading-relaxed">
            {product.description ||
              'Beautifully arranged premium flowers perfect for all occasions. Hand-selected stems with vibrant colors and long-lasting freshness.'}
          </p>
          {hasTags(product) && product.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {product.tags.map((t: string) => (
                <span
                  key={t}
                  className="text-[10px] tracking-wide uppercase px-2 py-0.5 rounded bg-pink-100 text-pink-700"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Flower2 className="w-4 h-4 text-primary" /> Fresh-cut premium stems
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Truck className="w-4 h-4 text-primary" /> Same-day delivery
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground">
              <ShieldCheck className="w-4 h-4 text-primary" /> 7-day freshness guarantee
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleBack} className="bg-primary" aria-label="Go back to listing">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <Button variant="outline" asChild aria-label="Explore more in category">
              <Link to={explorePath}>Explore more</Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="gap-2"
              onClick={handleShare}
              aria-label="Share product"
            >
              <Share2 className="w-4 h-4" /> Share
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-20 border-t border-sakura-pink/20 pt-12" id="reviews">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="font-playfair text-2xl font-semibold">Customer Reviews</h2>
            <p className="text-sm text-muted-foreground">
              Overall {displayRating.rating.toFixed(1)} based on {displayRating.count} review(s).
            </p>
          </div>
          <Dialog open={openReview} onOpenChange={setOpenReview}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <MessageSquarePlus className="w-4 h-4" /> Write a Review
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Share Your Experience</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!slug) return;
                  if (!formName.trim() || !formComment.trim()) return;
                  dispatch(
                    addReview({
                      productSlug: slug,
                      name: formName.trim(),
                      rating: formRating,
                      comment: formComment.trim(),
                      images: formImages,
                    })
                  );
                  trackEvent('review_submit', { slug, rating: formRating });
                  setFormName('');
                  setFormComment('');
                  setFormRating(5);
                  setFormImages([]);
                  setOpenReview(false);
                  toast({
                    title: 'Review submitted',
                    description: 'Thanks! Your review will be visible after approval.',
                  });
                }}
                className="grid gap-5"
              >
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium uppercase tracking-wide">Name</label>
                    <input
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="border rounded px-3 py-2 text-sm bg-transparent"
                      required
                      placeholder="Your name"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium uppercase tracking-wide">Rating</label>
                    <div className="flex items-center gap-1 px-1">
                      {[1, 2, 3, 4, 5].map((r) => (
                        <button
                          type="button"
                          key={r}
                          onClick={() => setFormRating(r)}
                          onMouseEnter={() => setHover(r)}
                          onMouseLeave={() => setHover(0)}
                          className="p-1"
                          aria-label={`Rate ${r}`}
                        >
                          <Star
                            className={`w-5 h-5 ${
                              (hover || formRating) >= r
                                ? 'text-gold fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 sm:col-span-3">
                    <label className="text-xs font-medium uppercase tracking-wide">Comment</label>
                    <textarea
                      value={formComment}
                      onChange={(e) => setFormComment(e.target.value)}
                      className="border rounded px-3 py-2 text-sm min-h-[120px] bg-transparent"
                      required
                      placeholder="What did you like? What could be better?"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="text-xs font-medium uppercase tracking-wide mb-1 block">
                      Images (optional)
                    </label>
                    <MultiImageDropInput values={formImages} onChange={setFormImages} />
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Up to 4 images. Stored locally & shown after approval.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button type="submit">Submit Review</Button>
                  <span className="text-[11px] text-muted-foreground">
                    Appears as pending until approved.
                  </span>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          itemScope
          itemType="https://schema.org/ItemList"
        >
          {reviews.map((r) => (
            <div
              key={r.id}
              className="p-4 rounded-lg border border-sakura-pink/30 bg-muted/30 text-sm space-y-2"
              itemProp="review"
              itemScope
              itemType="https://schema.org/Review"
            >
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className={`w-3.5 h-3.5 ${
                      j < r.rating ? 'text-gold fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-[11px] text-muted-foreground" itemProp="author">
                  {r.name}
                </span>
              </div>
              <p className="leading-snug" itemProp="reviewBody">
                {r.comment}
              </p>
              {r.images && r.images.length > 0 && (
                <div className="flex gap-2 flex-wrap pt-1">
                  {r.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="review"
                      className="w-14 h-14 object-cover rounded border"
                    />
                  ))}
                </div>
              )}
              <meta itemProp="datePublished" content={r.createdAt} />
              <meta itemProp="reviewRating" content={String(r.rating)} />
            </div>
          ))}
          {!reviews.length && (
            <p className="text-sm text-muted-foreground">No reviews yet. Be the first.</p>
          )}
        </div>
      </div>

      <div className="mt-16">
        <h2 className="font-playfair text-2xl font-semibold mb-6">You may also like</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedItems.map((p) => (
            <Card key={p.id} className="overflow-hidden">
              <Link to={`/product/${p.slug}`} className="block">
                <img src={p.image} alt={p.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <div className="font-medium">{p.title}</div>
                  <div className="text-sm text-muted-foreground">${p.price.toFixed(2)}</div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>
      {product && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: product.title,
              image: [product.image],
              description: product.description,
              sku: product.id,
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: displayRating.rating.toFixed(1),
                reviewCount: displayRating.count,
              },
              offers: showPrices
                ? {
                    '@type': 'Offer',
                    priceCurrency: 'USD',
                    price: product.price.toFixed(2),
                    availability: 'https://schema.org/InStock',
                  }
                : undefined,
              review: reviews.slice(0, 20).map((r) => ({
                '@type': 'Review',
                author: r.name,
                reviewBody: r.comment,
                datePublished: r.createdAt,
                reviewRating: { '@type': 'Rating', ratingValue: r.rating },
              })),
            }),
          }}
        />
      )}
    </div>
  );
};

export default Product;
{
  /* Related items */
}
