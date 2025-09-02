import { motion } from 'framer-motion';
import { Breadcrumbs } from '@/components/Breadcrumbs';

const sections = [
  {
    id: 'overview',
    title: 'Overview',
    body: 'This Cookie Policy explains how we use cookies and similar technologies to provide, protect, personalize, and improve our services.',
  },
  {
    id: 'types',
    title: 'Types of Cookies',
    body: 'We categorize cookies by purpose. Essential cookies are required for core functionality. Preference cookies remember user choices (like theme). Analytics cookies help us understand usage and improve performance. Marketing cookies are currently not used.',
  },
  {
    id: 'choices',
    title: 'Your Choices',
    body: 'On your first visit you can accept, reject, or customize non‑essential cookies. You can revisit preferences by clearing site data or we may add a settings link later. Browser settings also allow blocking or deleting cookies.',
  },
  {
    id: 'retention',
    title: 'Retention',
    body: 'Essential cookies typically expire at end of session or within 12 months. Analytics events are stored aggregated; raw local browser event storage is capped and cleared when consent is withdrawn.',
  },
  {
    id: 'updates',
    title: 'Updates',
    body: 'We may update this policy. Material changes will refresh the last updated date below.',
  },
];

const CookiePolicy = () => {
  return (
    <div className="container mx-auto px-4 pt-32 pb-32 max-w-4xl">
      <div className="mb-6">
        <Breadcrumbs />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </motion.div>

      <nav className="grid sm:grid-cols-3 gap-4 mb-14">
        {sections.map((s, i) => (
          <motion.a
            key={s.id}
            href={`#${s.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="block rounded-lg border border-sakura-pink/30 bg-white/60 dark:bg-white/5 backdrop-blur-sm px-4 py-3 text-sm font-medium hover:border-primary hover:text-primary transition"
          >
            {s.title}
          </motion.a>
        ))}
      </nav>

      <div className="space-y-16">
        {sections.map((sec, i) => (
          <motion.section
            key={sec.id}
            id={sec.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.05 * i }}
          >
            <h2 className="text-2xl font-semibold mb-3 font-playfair">{sec.title}</h2>
            <p className="text-muted-foreground leading-relaxed text-sm max-w-3xl mb-6">
              {sec.body}
            </p>
            {sec.id === 'types' && (
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>
                  <strong>Essential:</strong> Session management, security, network routing.
                </li>
                <li>
                  <strong>Preferences:</strong> Theme, locale, saved filters.
                </li>
                <li>
                  <strong>Analytics:</strong> Page views, feature engagement (aggregated).
                </li>
                <li>
                  <strong>Marketing:</strong> Not presently used; would require separate consent.
                </li>
              </ul>
            )}
          </motion.section>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        className="mt-24 rounded-2xl border border-sakura-pink/30 bg-gradient-to-r from-primary/10 via-sakura-light/30 to-primary/10 p-8 md:p-12 text-center shadow-soft"
      >
        <h3 className="font-playfair text-2xl font-semibold mb-3">Questions?</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-xl mx-auto">
          Reach out to our data team at{' '}
          <a href="mailto:privacy@example.com" className="text-primary underline">
            privacy@example.com
          </a>
          .
        </p>
        <a
          href="mailto:privacy@example.com"
          className="inline-block px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition shadow-elegant"
        >
          Contact Us
        </a>
      </motion.div>
    </div>
  );
};

export default CookiePolicy;
