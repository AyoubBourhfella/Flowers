import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ROUTES } from '@/lib/routeMeta';
import { AnimatePresence } from 'framer-motion';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Product from './pages/Product';
import Flowers from './pages/Flowers';
import Bouquets from './pages/Bouquets';
import About from './pages/About';
import SearchPage from './pages/Search';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Delivery from './pages/Delivery';
import CareGuide from './pages/CareGuide';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AdminToggle from '@/components/AdminToggle';
import PageTransition from '@/components/PageTransition';
import SakuraPetals from './components/SakuraPetals';
import Occasions from './pages/Occasions';
import CustomBouquet from './pages/CustomBouquet';
import AppLoader from '@/components/AppLoader';
import { ENABLE_ADMIN } from '@/lib/branding';
import AdminLayout from '@/admin/AdminLayout';
import Dashboard from '@/admin/Dashboard';
import FlowersList from '@/admin/FlowersList';
import BouquetsList from '@/admin/BouquetsList';
import BrandingSettings from '@/admin/BrandingSettings';
import FeatureFlagsSettings from '@/admin/FeatureFlagsSettings';
import CatalogMeta from '@/admin/CatalogMeta';
import CookiePolicy from '@/pages/CookiePolicy';
import { CookieConsentBanner, AnalyticsDebugger } from '@/components/CookieConsent';
import { trackPageView } from '@/lib/analytics';
import AnalyticsPage from '@/admin/Analytics';
import ReviewsModeration from '@/admin/ReviewsModeration';

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  // track page views when path changes (consent gated inside tracker)
  if (typeof window !== 'undefined') {
    trackPageView(location.pathname + location.search);
  }
  // Build breadcrumb list for JSON-LD (simple split on path segments).
  const segments = location.pathname.split('/').filter(Boolean);
  const breadcrumbItems = [
    '/',
    ...segments.map((_, i, arr) => '/' + arr.slice(0, i + 1).join('/')),
  ];
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((url, idx) => {
      const meta = ROUTES.find((r) => r.path === url || r.path.replace('/:slug', '') === url);
      return {
        '@type': 'ListItem',
        position: idx + 1,
        name: meta
          ? meta.label
          : url === '/'
          ? 'Home'
          : decodeURIComponent(url.split('/').pop() || ''),
        item: window.location.origin + url,
      };
    }),
  };
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Index />
            </PageTransition>
          }
        />
        <Route
          path="/product/:slug"
          element={
            <PageTransition>
              <Product />
            </PageTransition>
          }
        />
        <Route
          path="/flowers"
          element={
            <PageTransition>
              <Flowers />
            </PageTransition>
          }
        />
        <Route
          path="/bouquets"
          element={
            <PageTransition>
              <Bouquets />
            </PageTransition>
          }
        />
        <Route
          path="/custom-bouquet"
          element={
            <PageTransition>
              <CustomBouquet />
            </PageTransition>
          }
        />
        <Route
          path="/occasions"
          element={
            <PageTransition>
              <Occasions />
            </PageTransition>
          }
        />
        <Route
          path="/about"
          element={
            <PageTransition>
              <About />
            </PageTransition>
          }
        />
        <Route
          path="/search"
          element={
            <PageTransition>
              <SearchPage />
            </PageTransition>
          }
        />
        <Route
          path="/privacy"
          element={
            <PageTransition>
              <Privacy />
            </PageTransition>
          }
        />
        <Route
          path="/cookie-policy"
          element={
            <PageTransition>
              <CookiePolicy />
            </PageTransition>
          }
        />
        <Route
          path="/terms"
          element={
            <PageTransition>
              <Terms />
            </PageTransition>
          }
        />
        <Route
          path="/delivery"
          element={
            <PageTransition>
              <Delivery />
            </PageTransition>
          }
        />
        <Route
          path="/care-guide"
          element={
            <PageTransition>
              <CareGuide />
            </PageTransition>
          }
        />
        {ENABLE_ADMIN && (
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="flowers" element={<FlowersList />} />
            <Route path="bouquets" element={<BouquetsList />} />
            <Route path="catalog" element={<CatalogMeta />} />
            <Route path="branding" element={<BrandingSettings />} />
            <Route path="flags" element={<FeatureFlagsSettings />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="reviews" element={<ReviewsModeration />} />
          </Route>
        )}
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
      </Routes>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </AnimatePresence>
  );
};

const ChromeWrapper = () => {
  const location = useLocation();
  const inAdmin = location.pathname.startsWith('/admin');
  return (
    <>
      {!inAdmin && <Navigation />}
      <AnimatedRoutes />
      {!inAdmin && <Footer />}
      <AdminToggle />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLoader>
          <SakuraPetals />
          <ChromeWrapper />
          <CookieConsentBanner />
          <AnalyticsDebugger />
        </AppLoader>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
