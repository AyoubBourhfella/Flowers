import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  Flower2,
  Menu,
  Search,
  X,
  ChevronDown,
  ShoppingBasket,
  Info,
  Shield,
  Heart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BRAND_NAME } from '@/lib/branding';
import { useIsMobile } from '@/hooks/use-mobile';

// Visual navigation tile model
interface NavTile {
  label: string;
  description?: string;
  href: string;
  icon?: JSX.Element;
  accent?: string; // gradient classes
  badge?: string;
}

const shopTiles: NavTile[] = [
  {
    label: 'All Flowers',
    description: 'Browse every seasonal bloom',
    href: '/flowers',
    icon: <Flower2 className="w-5 h-5" />,
    accent: 'from-pink-400 to-rose-500',
  },
  {
    label: 'Bouquets',
    description: 'Curated arrangements & sets',
    href: '/bouquets',
    icon: <ShoppingBasket className="w-5 h-5" />,
    accent: 'from-fuchsia-400 to-pink-500',
  },
  {
    label: 'Occasions',
    description: 'Birthday • Romance • Sympathy',
    href: '/occasions',
    icon: <Heart className="w-5 h-5" />,
    accent: 'from-rose-400 to-pink-600',
  },
  {
    label: 'Custom Bouquet',
    description: 'Design your own arrangement',
    href: '/custom-bouquet',
    icon: <Flower2 className="w-5 h-5" />,
    accent: 'from-amber-400 to-pink-500',
    badge: 'New',
  },
];

const infoTiles: NavTile[] = [
  {
    label: 'Search',
    description: 'Find specific stems or bouquets',
    href: '/search',
    icon: <Search className="w-5 h-5" />,
    accent: 'from-indigo-400 to-purple-500',
  },
  {
    label: 'Care Guide',
    description: 'Keep blooms vibrant longer',
    href: '/care-guide',
    icon: <Shield className="w-5 h-5" />,
    accent: 'from-emerald-400 to-teal-500',
  },
  {
    label: 'Delivery',
    description: 'Areas • timelines • same‑day',
    href: '/delivery',
    icon: <Info className="w-5 h-5" />,
    accent: 'from-sky-400 to-indigo-500',
  },
  {
    label: 'About',
    description: 'Story & sustainability',
    href: '/about',
    icon: <Info className="w-5 h-5" />,
    accent: 'from-purple-400 to-violet-500',
  },
];

const floatingBgVariants: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, scale: 0.97, y: 8, transition: { duration: 0.18 } },
};

const Navigation = () => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState<'shop' | 'info' | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement | null>(null);

  // Close menus on navigation
  useEffect(() => {
    setOpen(false);
    setMega(null);
  }, [location.pathname]);

  // Keyboard shortcuts (Esc to close, / to focus search)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMega(null);
        setOpen(false);
      }
      if (e.key === '/' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchRef.current?.value?.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const baseLink = 'text-sm font-medium transition px-2 py-1 rounded-md relative';

  const MegaPanel = ({ type }: { type: 'shop' | 'info' }) => {
    const tiles = type === 'shop' ? shopTiles : infoTiles;
    return (
      <motion.div
        key={type}
        variants={floatingBgVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="absolute left-0 -translate-x-1/2 top-full mt-4 w-[min(1000px,92vw)] z-40"
      >
        <div className="relative rounded-2xl border border-sakura-pink/30 bg-background/90 backdrop-blur-xl shadow-xl p-8 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(circle_at_65%_35%,white,transparent_70%)]">
            <div className="absolute -top-24 -right-16 w-96 h-96 bg-gradient-to-br from-pink-300/20 to-rose-400/10 rounded-full blur-3xl" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            {tiles.map((t) => (
              <NavLink
                key={t.href}
                to={t.href}
                className={({ isActive }) =>
                  cn(
                    'group rounded-xl border border-sakura-pink/20 hover:border-primary/50 bg-gradient-to-br from-muted/40 to-background p-4 flex flex-col gap-3 hover:shadow-md transition duration-300',
                    isActive && 'border-primary/60'
                  )
                }
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-white shadow-inner',
                    t.accent
                  )}
                >
                  {t.icon}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm tracking-wide">{t.label}</span>
                    {t.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/15 text-primary font-medium">
                        {t.badge}
                      </span>
                    )}
                  </div>
                  {t.description && (
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {t.description}
                    </p>
                  )}
                </div>
              </NavLink>
            ))}
            <div className="hidden lg:flex flex-col justify-between rounded-xl border border-dashed border-sakura-pink/40 p-5 bg-muted/30">
              <div>
                <h4 className="font-semibold text-sm mb-2">Quick Search</h4>
                <p className="text-xs text-muted-foreground mb-4">Press / to focus</p>
                <form onSubmit={handleSearch} className="relative group">
                  <input
                    ref={searchRef}
                    placeholder="Find a rose, lily..."
                    className="w-full rounded-lg bg-background/60 border border-sakura-pink/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 px-3 py-2 text-sm outline-none"
                  />
                  <Search className="w-4 h-4 absolute top-2.5 right-3 text-muted-foreground" />
                </form>
              </div>
              <div className="text-[10px] flex flex-wrap gap-2 opacity-70 mt-6">
                {[
                  'Sustainable sourcing',
                  'Artisan crafted',
                  'Same‑day delivery',
                  'Freshness guarantee',
                ].map((b) => (
                  <span key={b} className="px-2 py-1 rounded-full border border-sakura-pink/30">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative w-full z-50">
      <header className="absolute  w-full top-0 backdrop-blur-xl bg-background/70 border-b border-sakura-pink/20 supports-[backdrop-filter]:bg-background/50">
        <nav className="mx-auto max-w-7xl px-4 flex items-center gap-4 h-16">
          <Link
            to="/"
            className="flex items-center gap-2 font-playfair text-lg font-semibold group"
          >
            <div className="relative">
              <Flower2 className="w-6 h-6 text-primary" />
              <motion.span
                layoutId="brand-glow"
                className="absolute inset-0 rounded-full -z-10 bg-primary/40 blur-xl opacity-0 group-hover:opacity-100 transition"
              />
            </div>
            <span>{BRAND_NAME}</span>
          </Link>
          {!isMobile && (
            <div className="flex items-center gap-2 ml-6">
              <button
                onMouseEnter={() => setMega('shop')}
                onFocus={() => setMega('shop')}
                className={cn(
                  baseLink,
                  'group flex items-center gap-1 hover:text-primary',
                  mega === 'shop' && 'text-primary'
                )}
              >
                <span>Shop</span>
                <ChevronDown
                  className={cn('w-4 h-4 transition-transform', mega === 'shop' && 'rotate-180')}
                />
              </button>
              <button
                onMouseEnter={() => setMega('info')}
                onFocus={() => setMega('info')}
                className={cn(
                  baseLink,
                  'group flex items-center gap-1 hover:text-primary',
                  mega === 'info' && 'text-primary'
                )}
              >
                <span>Info</span>
                <ChevronDown
                  className={cn('w-4 h-4 transition-transform', mega === 'info' && 'rotate-180')}
                />
              </button>
              <NavLink
                to="/search"
                className={({ isActive }) =>
                  cn(baseLink, 'hover:text-primary', isActive && 'text-primary')
                }
              >
                Search
              </NavLink>
            </div>
          )}
          <div className="flex-1" />
          {!isMobile && (
            <form
              onSubmit={handleSearch}
              className="relative w-60 group"
              role="search"
              aria-label="Site search"
            >
              <input
                ref={searchRef}
                placeholder="Search products... /"
                aria-label="Search products"
                className="w-full rounded-full bg-background/70 border border-sakura-pink/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 px-4 py-2 text-sm outline-none transition pr-10"
              />
              <Search className="w-4 h-4 absolute top-2.5 right-4 text-muted-foreground group-focus-within:text-primary" />
            </form>
          )}
          {isMobile && (
            <button
              aria-label="Toggle menu"
              onClick={() => setOpen((o) => !o)}
              className="p-2 rounded-md border border-sakura-pink/30 hover:border-primary/50 hover:text-primary transition"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </nav>
        <div onMouseLeave={() => setMega(null)} className="relative">
          <AnimatePresence>{!isMobile && mega && <MegaPanel type={mega} />}</AnimatePresence>
        </div>
      </header>

      <AnimatePresence>
        {isMobile && open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            aria-modal="true"
            role="dialog"
          >
            <div
              className="absolute inset-0 bg-background/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              className="absolute top-0 right-0 h-full w-[82%] bg-background border-l border-sakura-pink/20 shadow-xl flex flex-col overflow-y-auto"
            >
              <div className="p-5 flex items-center justify-between border-b border-sakura-pink/20">
                <Link
                  to="/"
                  className="flex items-center gap-2 font-playfair text-lg font-semibold"
                  onClick={() => setOpen(false)}
                >
                  <Flower2 className="w-6 h-6 text-primary" /> PetalFlow
                </Link>
                <button onClick={() => setOpen(false)} className="p-2 rounded-md hover:bg-muted/50">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5">
                <form
                  onSubmit={(e) => {
                    handleSearch(e);
                    setOpen(false);
                  }}
                  className="relative mb-6"
                >
                  <input
                    ref={searchRef}
                    placeholder="Search..."
                    className="w-full rounded-lg bg-background/70 border border-sakura-pink/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 px-4 py-3 text-sm outline-none"
                  />
                  <Search className="w-4 h-4 absolute top-3.5 right-4 text-muted-foreground" />
                </form>
                <div className="space-y-8">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Shop
                    </p>
                    <div className="grid gap-3">
                      {shopTiles.map((t) => (
                        <NavLink
                          key={t.href}
                          to={t.href}
                          onClick={() => setOpen(false)}
                          className={({ isActive }) =>
                            cn(
                              'flex items-start gap-3 p-3 rounded-lg border border-sakura-pink/20 bg-muted/30 hover:border-primary/50 transition',
                              isActive && 'border-primary/60 bg-primary/5'
                            )
                          }
                        >
                          <div
                            className={cn(
                              'w-9 h-9 rounded-md bg-gradient-to-br flex items-center justify-center text-white text-xs shrink-0',
                              t.accent
                            )}
                          >
                            {t.icon}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium leading-none">{t.label}</span>
                              {t.badge && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/15 text-primary font-medium">
                                  {t.badge}
                                </span>
                              )}
                            </div>
                            {t.description && (
                              <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1">
                                {t.description}
                              </p>
                            )}
                          </div>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Info
                    </p>
                    <div className="grid gap-3">
                      {infoTiles.map((t) => (
                        <NavLink
                          key={t.href}
                          to={t.href}
                          onClick={() => setOpen(false)}
                          className={({ isActive }) =>
                            cn(
                              'flex items-start gap-3 p-3 rounded-lg border border-sakura-pink/20 bg-muted/30 hover:border-primary/50 transition',
                              isActive && 'border-primary/60 bg-primary/5'
                            )
                          }
                        >
                          <div
                            className={cn(
                              'w-9 h-9 rounded-md bg-gradient-to-br flex items-center justify-center text-white text-xs shrink-0',
                              t.accent
                            )}
                          >
                            {t.icon}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium leading-none">{t.label}</span>
                              {t.badge && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/15 text-primary font-medium">
                                  {t.badge}
                                </span>
                              )}
                            </div>
                            {t.description && (
                              <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1">
                                {t.description}
                              </p>
                            )}
                          </div>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-auto p-5 text-[11px] text-muted-foreground border-t border-sakura-pink/20">
                <p>© {new Date().getFullYear()} PetalFlow</p>
                <p className="mt-1">Bloom beautifully anywhere.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navigation;
