import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Star, Truck, ShieldCheck, Flower2, Share2, ArrowLeft, Info } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import {
  addReview,
  selectAggregateForProduct,
  selectReviewsForProduct,
} from '@/store/reviewsSlice';
import { useAppSelector } from '@/hooks/useAppSelector';
import { showPrices } from '@/lib/featureFlags';

const Product = () => {
  const { slug } = useParams<{ slug: string }>();
  const items = useAppSelector((s) => s.flowers.items);
  const dispatch = useAppDispatch();
  const reviews = useAppSelector(selectReviewsForProduct(slug || ''));
  const aggregate = useAppSelector(selectAggregateForProduct(slug || ''));
  const product = items.find((p) => p.slug === slug);
  const relatedItems = items.filter((p) => p.slug !== slug).slice(0, 3);
  const [formName, setFormName] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formComment, setFormComment] = useState('');

  const displayRating = useMemo(() => {
    if (aggregate.count > 0) return { rating: aggregate.average, count: aggregate.count };
    return { rating: product?.rating || 0, count: product?.reviews || 0 };
  }, [aggregate, product]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-24">
        <p className="mb-6">Product not found.</p>
        <Button asChild>
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    );
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

          {/* Rating */}
          <div
            className="flex items-center gap-2 mb-4"
            itemProp="aggregateRating"
            itemScope
            itemType="https://schema.org/AggregateRating"
          >
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(displayRating.rating) ? 'text-gold fill-current' : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-sm text-muted-foreground">
              <span itemProp="ratingValue">{displayRating.rating.toFixed(1)}</span> •{' '}
              <span itemProp="reviewCount">{displayRating.count}</span> reviews
            </span>
          </div>

          {/* Price / Info */}
          {showPrices ? (
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          ) : (
            <div className="mb-6 p-4 rounded-lg border border-sakura-pink/30 bg-muted/30 flex gap-3 text-sm leading-relaxed">
              <Info className="w-5 h-5 text-primary shrink-0" />
              <div>
                Pricing for this arrangement is available upon request. Contact us for a tailored
                quote based on stem count, size, and delivery preferences.
              </div>
            </div>
          )}

          {/* Description */}
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {product.description ||
              'Beautifully arranged premium flowers perfect for all occasions. Hand-selected stems with vibrant colors and long-lasting freshness.'}
          </p>

          {/* Highlights */}
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

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button asChild className="bg-primary">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/#flowers">Explore more</Link>
            </Button>
            <Button variant="ghost" className="gap-2">
              <Share2 className="w-4 h-4" /> Share
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-20 border-t border-sakura-pink/20 pt-12" id="reviews">
        <h2 className="font-playfair text-2xl font-semibold mb-4">Customer Reviews</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Overall {displayRating.rating.toFixed(1)} based on {displayRating.count} review(s).
        </p>
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
              })
            );
            setFormName('');
            setFormComment('');
            setFormRating(5);
          }}
          className="mb-10 grid gap-4 sm:grid-cols-3"
        >
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
            <select
              value={formRating}
              onChange={(e) => setFormRating(Number(e.target.value))}
              className="border rounded px-3 py-2 text-sm bg-transparent"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} star{r !== 1 && 's'}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1 sm:col-span-1 md:col-span-1 lg:col-span-1">
            <label className="text-xs font-medium uppercase tracking-wide">Comment</label>
            <textarea
              value={formComment}
              onChange={(e) => setFormComment(e.target.value)}
              className="border rounded px-3 py-2 text-sm min-h-[90px] bg-transparent"
              required
              placeholder="Share your experience"
            />
          </div>
          <div className="sm:col-span-3 flex items-center gap-3">
            <Button type="submit" className="">
              Submit Review
            </Button>
            <span className="text-[11px] text-muted-foreground">
              Your review appears instantly & is stored locally.
            </span>
          </div>
        </form>
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
              <meta itemProp="datePublished" content={r.createdAt} />
              <meta itemProp="reviewRating" content={String(r.rating)} />
            </div>
          ))}
          {!reviews.length && (
            <p className="text-sm text-muted-foreground">No reviews yet. Be the first.</p>
          )}
        </div>
      </div>

      {/* Related items */}
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
      {/* JSON-LD */}
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
