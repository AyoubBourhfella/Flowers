import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Gift, Sparkles, HeartHandshake, GlassWater, Shield } from 'lucide-react';
import type { FlowerItem } from '@/store/flowersSlice';
import type { BouquetItem } from '@/store/bouquetsSlice';
import { useAppSelector } from '@/hooks/useAppSelector';
import ProductCard from '@/components/ProductCard';

interface OccasionDef {
  key: string;
  title: string;
  tagline: string;
  gradient: string;
  icon: JSX.Element;
  matches: (p: FlowerItem | BouquetItem) => boolean;
}

const OCCASIONS: OccasionDef[] = [
  {
    key: 'romance',
    title: 'Romance',
    tagline: 'Express love with timeless blooms',
    gradient: 'from-rose-500 to-pink-500',
    icon: <Heart className="w-6 h-6" />,
    matches: (p) => /rose|romantic/i.test(p.title) || ['Roses', 'Romantic'].includes(p.category),
  },
  {
    key: 'birthday',
    title: 'Birthday',
    tagline: 'Bright & cheerful celebrations',
    gradient: 'from-amber-400 to-orange-500',
    icon: <Sparkles className="w-6 h-6" />,
    matches: (p) =>
      /tulip|sunflower|celebration|bright/i.test(p.title) ||
      ['Tulips', 'Seasonal', 'Spring'].includes(p.category),
  },
  {
    key: 'sympathy',
    title: 'Sympathy',
    tagline: 'Gentle comfort & support',
    gradient: 'from-slate-400 to-slate-600',
    icon: <HeartHandshake className="w-6 h-6" />,
    matches: (p) =>
      /lily|orchid|white/i.test(p.title) || ['Lilies', 'Orchids'].includes(p.category),
  },
  {
    key: 'congrats',
    title: 'Congratulations',
    tagline: 'Milestones & achievements',
    gradient: 'from-emerald-400 to-teal-500',
    icon: <Gift className="w-6 h-6" />,
    matches: (p) =>
      /luxury|premium|ensemble|centerpiece/i.test(p.title) ||
      ['Luxury', 'Premium'].includes(p.category),
  },
  {
    key: 'wellness',
    title: 'Wellness',
    tagline: 'Calming herbal & soothing tones',
    gradient: 'from-indigo-400 to-violet-500',
    icon: <GlassWater className="w-6 h-6" />,
    matches: (p) => /lavender|aromatic/i.test(p.title) || ['Herbal'].includes(p.category),
  },
];

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const Occasions = () => {
  const query = useQuery();
  const selected = query.get('type') || '';
  const navigate = useNavigate();
  const flowers = useAppSelector((s) => s.flowers.items);
  const bouquets = useAppSelector((s) => s.bouquets.items);
  const all = [...flowers, ...bouquets];
  const occasion = OCCASIONS.find((o) => o.key === selected);
  const filtered = occasion ? all.filter((p) => occasion.matches(p)) : [];

  return (
    <div className="container mx-auto px-4 pt-24 pb-20">
      <div className="max-w-3xl mb-12">
        <h1 className="font-playfair text-4xl font-bold mb-4">Shop by Occasion</h1>
        <p className="text-muted-foreground leading-relaxed">
          Choose an occasion to see curated floral selections tailored for that special moment.
          Thoughtfully grouped to make gifting effortless.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
        {OCCASIONS.map((o) => {
          const active = o.key === selected;
          return (
            <motion.button
              key={o.key}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/occasions?type=${o.key}`)}
              className={
                'relative group rounded-2xl p-5 text-left overflow-hidden border transition focus:outline-none focus:ring-2 focus:ring-primary/40 ' +
                (active
                  ? 'border-primary/60 bg-primary/5 shadow-md'
                  : 'border-sakura-pink/30 hover:border-primary/50 bg-gradient-to-br from-muted/40 to-background')
              }
            >
              <div
                className={
                  'w-12 h-12 rounded-xl mb-4 flex items-center justify-center text-white shadow-inner bg-gradient-to-br ' +
                  o.gradient
                }
              >
                {o.icon}
              </div>
              <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
                {o.title}
                {active && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/15 text-primary font-medium">
                    Selected
                  </span>
                )}
              </h3>
              <p className="text-sm text-muted-foreground leading-snug line-clamp-2">{o.tagline}</p>
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none transition"
                aria-hidden
              />
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence initial={false} mode="wait">
        {occasion && (
          <motion.section
            key={occasion.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="font-playfair text-2xl font-semibold mb-1">
                  {occasion.title} Picks
                </h2>
                <p className="text-muted-foreground text-sm max-w-xl">
                  Tailored stems & arrangements that suit {occasion.title.toLowerCase()} moments.
                </p>
              </div>
              <button
                onClick={() => navigate('/occasions')}
                className="text-xs px-3 py-2 rounded-md border border-sakura-pink/30 hover:border-primary/60 hover:text-primary transition"
              >
                Clear selection
              </button>
            </div>
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No curated items yet for this occasion.
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((p) => (
                <ProductCard
                  key={p.slug}
                  slug={p.slug}
                  image={p.image}
                  title={p.title}
                  price={`$${p.price.toFixed(2)}`}
                  originalPrice={
                    'originalPrice' in p && p.originalPrice
                      ? `$${p.originalPrice.toFixed(2)}`
                      : undefined
                  }
                  rating={p.rating}
                  reviews={p.reviews}
                  badge={p.badge}
                  description={p.description}
                />
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Occasions;
