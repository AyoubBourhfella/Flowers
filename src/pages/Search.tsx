import { useLocation } from 'react-router-dom';
import { useMemo, useRef } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Search as SearchIcon } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const SearchPage = () => {
  const q = useQuery().get('q')?.trim().toLowerCase() || '';
  const flowerItems = useAppSelector((s) => s.flowers.items);
  const bouquetItems = useAppSelector((s) => s.bouquets.items);
  const all = [...flowerItems, ...bouquetItems];
  const results = q
    ? all.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q)
      )
    : [];
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="container mx-auto px-4 pt-24 pb-16">
      <div className="mb-6">
        <Breadcrumbs />
      </div>
      <h1 className="font-playfair text-3xl font-bold mb-6">Search</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const val = inputRef.current?.value.trim();
          if (val) window.location.replace(`/search?q=${encodeURIComponent(val)}`);
        }}
        className="relative max-w-md mb-8"
        role="search"
        aria-label="Search products"
      >
        <input
          ref={inputRef}
          defaultValue={q}
          placeholder="Search flowers, bouquets..."
          className="w-full rounded-full bg-background/70 border border-sakura-pink/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 px-5 py-3 text-sm outline-none pr-11"
        />
        <SearchIcon className="w-4 h-4 absolute top-3 right-5 text-muted-foreground" />
      </form>
      <p className="text-muted-foreground mb-6 text-sm">
        {q ? (
          <>
            Showing {results.length} result{results.length !== 1 && 's'} for{' '}
            <span className="font-medium text-foreground">{q}</span>
          </>
        ) : (
          'Enter a search term to begin.'
        )}
      </p>
      {q && results.length === 0 && (
        <p className="text-sm text-muted-foreground">No matches found.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {results.map((p) => {
          const hasOriginal = (obj: typeof p): obj is typeof p & { originalPrice: number } => {
            if (!Object.prototype.hasOwnProperty.call(obj, 'originalPrice')) return false;
            const record = obj as unknown as Record<string, unknown>;
            const val = record['originalPrice'];
            return typeof val === 'number';
          };
          const hasDescription = (obj: typeof p): obj is typeof p & { description: string } => {
            if (!Object.prototype.hasOwnProperty.call(obj, 'description')) return false;
            const record = obj as unknown as Record<string, unknown>;
            const val = record['description'];
            return typeof val === 'string';
          };
          return (
            <ProductCard
              key={p.id}
              slug={p.slug}
              image={p.image}
              title={p.title}
              price={`$${p.price.toFixed(2)}`}
              originalPrice={hasOriginal(p) ? `$${p.originalPrice.toFixed(2)}` : undefined}
              rating={p.rating}
              reviews={p.reviews}
              badge={p.badge}
              description={hasDescription(p) ? p.description : undefined}
            />
          );
        })}
      </div>
    </div>
  );
};
export default SearchPage;
