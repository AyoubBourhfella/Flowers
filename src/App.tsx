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
import PageTransition from '@/components/PageTransition';
import SakuraPetals from './components/SakuraPetals';
import Occasions from './pages/Occasions';
import CustomBouquet from './pages/CustomBouquet';
import AppLoader from '@/components/AppLoader';

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLoader>
          <SakuraPetals />
          <Navigation />
          <AnimatedRoutes />
          <Footer />
        </AppLoader>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
