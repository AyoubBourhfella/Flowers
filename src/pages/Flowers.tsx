import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import ProductCard from '@/components/ProductCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { showPrices } from '@/lib/featureFlags';
import { Input } from '@/components/ui/input';
import { Breadcrumbs } from '@/components/Breadcrumbs';

const Flowers = () => {
  const items = useAppSelector((s) => s.flowers.items);
  const location = useLocation();
  const navigate = useNavigate();
  const categories = useMemo(
    () => Array.from(new Set(items.map((i) => i.category))).sort(),
    [items]
  );

  const [category, setCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');

  // Sync category from query param (?cat=Tulips)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const catParam = params.get('cat');
    if (catParam) {
      const match = categories.find(
        (c) => c.toLowerCase() === decodeURIComponent(catParam).toLowerCase()
      );
      if (match && match !== category) {
        setCategory(match);
      }
    }
  }, [location.search, categories, category]);

  // Update URL when category changes (keep other filters local only)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (category === 'all') {
      params.delete('cat');
    } else {
      params.set('cat', category);
    }
    const newSearch = params.toString();
    const target = newSearch ? `?${newSearch}` : '';
    if (target !== location.search) {
      navigate({ pathname: location.pathname, search: target }, { replace: true });
    }
  }, [category, location.pathname, location.search, navigate]);

  const filtered = useMemo(() => {
    return items
      .filter((i) => (category === 'all' ? true : i.category === category))
      .filter((i) => (showPrices ? i.price >= priceRange[0] && i.price <= priceRange[1] : true))
      .filter((i) => i.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        switch (sort) {
          case 'price-asc':
            return showPrices ? a.price - b.price : 0;
          case 'price-desc':
            return showPrices ? b.price - a.price : 0;
          case 'rating':
            return b.rating - a.rating;
          default:
            return 0;
        }
      });
  }, [items, category, priceRange, search, sort]);
  const hasFilters =
    category !== 'all' ||
    (showPrices && priceRange[1] !== 200) ||
    search !== '' ||
    sort !== 'featured';
  const [advancedOpen, setAdvancedOpen] = useState(false);

  return (
    <motion.div
      className="container mx-auto px-4 pt-24 pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mb-4">
        <Breadcrumbs />
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <motion.h1 layoutId="flowers-title" className="font-playfair text-4xl font-bold">
          All Flowers
        </motion.h1>
        <div className="flex flex-wrap gap-2 items-center">
          <Button
            variant={advancedOpen ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAdvancedOpen((o) => !o)}
            className="gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </Button>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCategory('all');
                if (showPrices) setPriceRange([0, 200]);
                setSearch('');
                setSort('featured');
              }}
              className="text-xs"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Active filter chips */}
      <AnimatePresence>
        {hasFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-4 flex flex-wrap gap-2"
          >
            {category !== 'all' && (
              <Badge variant="secondary" className="gap-1 pr-1">
                {category}
                <button
                  onClick={() => setCategory('all')}
                  className="hover:text-primary transition"
                  aria-label="Remove category"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {showPrices && priceRange[1] !== 200 && (
              <Badge variant="secondary" className="gap-1 pr-1">
                Max ${priceRange[1]}
                <button
                  onClick={() => setPriceRange([0, 200])}
                  className="hover:text-primary transition"
                  aria-label="Reset price"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {search && (
              <Badge variant="secondary" className="gap-1 pr-1">
                Search: {search}
                <button
                  onClick={() => setSearch('')}
                  className="hover:text-primary transition"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {sort !== 'featured' && (
              <Badge variant="secondary" className="gap-1 pr-1">
                {sort}
                <button
                  onClick={() => setSort('featured')}
                  className="hover:text-primary transition"
                  aria-label="Reset sort"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsible advanced panel */}
      <AnimatePresence initial={false}>
        {advancedOpen && (
          <motion.div
            key="advanced"
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-xl border border-sakura-pink/30 bg-white/60 dark:bg-white/5 backdrop-blur-sm p-5 mb-8 shadow-soft"
          >
            <div className="grid gap-6 md:grid-cols-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide font-medium text-muted-foreground">
                  Category
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {showPrices && (
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wide font-medium text-muted-foreground">
                    Max Price: ${priceRange[1]}
                  </label>
                  <Slider
                    value={[priceRange[1]]}
                    min={0}
                    max={200}
                    step={1}
                    onValueChange={(v) => setPriceRange([0, v[0] || 0])}
                    className="mt-4"
                  />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide font-medium text-muted-foreground">
                  Search
                </label>
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide font-medium text-muted-foreground">
                  Sort
                </label>
                <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    {showPrices && <SelectItem value="price-asc">Price: Low to High</SelectItem>}
                    {showPrices && <SelectItem value="price-desc">Price: High to Low</SelectItem>}
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.07, delayChildren: 0.1 },
          },
        }}
      >
        <AnimatePresence>
          {filtered.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.4 }}
            >
              <ProductCard
                slug={p.slug}
                image={p.image}
                title={p.title}
                price={`$${p.price.toFixed(2)}`}
                originalPrice={p.originalPrice ? `$${p.originalPrice.toFixed(2)}` : undefined}
                rating={p.rating}
                reviews={p.reviews}
                badge={p.badge}
                description={p.description}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
export default Flowers;
