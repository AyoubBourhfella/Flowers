import { motion } from 'framer-motion';
import SakuraPetals from '@/components/SakuraPetals';
import Hero from '@/components/Hero';
import ProductShowcase from '@/components/ProductShowcase';
import FeaturedCarousel from '@/components/FeaturedCarousel';
import { motion as m } from 'framer-motion';
import { Flower2, Leaf, Gift, Mail } from 'lucide-react';
// Global loader handled by AppLoader wrapper

const Index = () => {
  const showContent = true;

  return (
    <div className="relative min-h-screen">
      <motion.div className="relative min-h-screen pointer-events-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: showContent ? 1 : 0, scale: showContent ? 1 : 0.98 }}
          transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
        >
          <Hero />
        </motion.div>

        {/* Product Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 50 }}
          transition={{ duration: 0.8, delay: 1, ease: 'easeOut' }}
        >
          <ProductShowcase />
        </motion.div>

        {/* Featured Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 50 }}
          transition={{ duration: 0.8, delay: 1.1, ease: 'easeOut' }}
        >
          <FeaturedCarousel />
        </motion.div>

        {/* Categories Section */}
        <motion.section
          className="py-16 px-4"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 60 }}
          transition={{ duration: 0.8, delay: 1.2, ease: 'easeOut' }}
        >
          <div className="container mx-auto max-w-7xl">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-center mb-10">
              Shop by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Roses', href: '/flowers?cat=Roses' },
                { label: 'Lilies', href: '/flowers?cat=Lilies' },
                { label: 'Tulips', href: '/flowers?cat=Tulips' },
                { label: 'Orchids', href: '/flowers?cat=Orchids' },
              ].map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-sakura-light/60 to-white border border-sakura-pink/20 p-6 shadow-soft hover:shadow-glow transition-all"
                >
                  <span className="font-medium text-lg text-foreground group-hover:text-primary transition-colors">
                    {c.label}
                  </span>
                  <span className="block text-xs text-muted-foreground mt-1">
                    Explore {c.label}
                  </span>
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-primary transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Value Props Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-background to-sakura-light/10">
          <div className="container mx-auto max-w-7xl">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-center mb-14">
              Why Choose Us
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: <Flower2 className="w-8 h-8 text-primary" />,
                  title: 'Farm‑Fresh Blooms',
                  desc: 'Sourced daily from sustainable growers for maximum freshness.',
                },
                {
                  icon: <Leaf className="w-8 h-8 text-primary" />,
                  title: 'Eco Packaging',
                  desc: 'Recyclable, minimal packaging that protects petals & planet.',
                },
                {
                  icon: <Gift className="w-8 h-8 text-primary" />,
                  title: 'Artisan Design',
                  desc: 'Each bouquet handcrafted by experienced floral stylists.',
                },
                {
                  icon: <Mail className="w-8 h-8 text-primary" />,
                  title: 'Care Guidance',
                  desc: 'Included tips to keep your arrangement vibrant longer.',
                },
              ].map((v, i) => (
                <m.div
                  key={v.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="p-6 rounded-2xl border border-sakura-pink/20 bg-white/60 dark:bg-white/5 backdrop-blur-sm shadow-soft hover:shadow-glow transition-all group"
                >
                  <div className="mb-4 inline-flex p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition">
                    {v.icon}
                  </div>
                  <h3 className="font-semibold mb-2 text-lg">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </m.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
          <div className="container mx-auto max-w-6xl relative">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-center mb-14">
              Loved By Flower Enthusiasts
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  quote:
                    'The arrangement was breathtaking and lasted nearly two weeks — exceeded expectations!',
                  name: 'Amelia R.',
                  tag: 'Birthday Gift',
                },
                {
                  quote:
                    'Fast delivery and the roses opened beautifully over days. Will reorder for sure.',
                  name: 'Daniel P.',
                  tag: 'Anniversary',
                },
                {
                  quote:
                    'Their custom bouquet captured exactly what I imagined. Incredible attention to detail.',
                  name: 'Sophia L.',
                  tag: 'Custom Design',
                },
              ].map((t, i) => (
                <m.blockquote
                  key={t.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="relative p-6 rounded-2xl bg-gradient-to-br from-sakura-light/50 to-white dark:from-white/10 dark:to-white/5 border border-sakura-pink/20 shadow-soft"
                >
                  <p className="text-sm leading-relaxed text-muted-foreground">“{t.quote}”</p>
                  <footer className="mt-4 flex items-center justify-between">
                    <span className="font-medium text-sm">{t.name}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {t.tag}
                    </span>
                  </footer>
                </m.blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="relative overflow-hidden rounded-3xl border border-sakura-pink/30 bg-gradient-to-r from-primary/10 via-sakura-light/30 to-primary/10 p-10 md:p-16 text-center shadow-soft">
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.8),transparent_60%)]" />
              <m.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="relative font-playfair text-3xl md:text-4xl font-bold mb-6"
              >
                Stay in Bloom
              </m.h2>
              <m.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="relative text-muted-foreground max-w-2xl mx-auto mb-8"
              >
                Join our newsletter for seasonal guides, care tips, and early access to limited
                floral drops.
              </m.p>
              <m.form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const input = form.querySelector('input');
                  if (input) {
                    input.value = '';
                  }
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3 rounded-full border border-sakura-pink/30 bg-white/60 dark:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-inner"
                />
                <button
                  type="submit"
                  className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 shadow-elegant transition"
                >
                  Subscribe
                </button>
              </m.form>
              <m.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="relative text-xs mt-4 text-muted-foreground"
              >
                We respect your privacy. Unsubscribe anytime.
              </m.p>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default Index;
