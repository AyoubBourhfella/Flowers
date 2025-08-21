import { motion } from 'framer-motion';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const coreSections = [
  {
    id: 'intro',
    title: 'Introduction',
    body: 'We value your privacy and are committed to protecting your personal information. This policy details what we collect, how we use it, and the choices you have.',
  },
  {
    id: 'data',
    title: 'Data We Collect',
    body: 'We collect only what we need to operate and improve our services. Below is a breakdown of categories of data.',
  },
  {
    id: 'use',
    title: 'How We Use Data',
    body: 'Processing orders, delivering products, personalizing recommendations, improving performance, detecting abuse, and communicating transactional or marketing messages (with consent).',
  },
  {
    id: 'cookies',
    title: 'Cookies & Tracking',
    body: 'We use essential cookies for core site features, preference cookies to remember settings, and analytics cookies to understand usage. You can opt-out of non-essential cookies via browser settings.',
  },
  {
    id: 'rights',
    title: 'Your Rights',
    body: 'You may request access, correction, deletion, restriction, portability, or objection to processing. You can also withdraw consent for marketing at any time.',
  },
];

const dataTable = [
  {
    category: 'Identity',
    examples: 'Name, email',
    purpose: 'Account & order identification',
    retention: 'As long as account active',
  },
  {
    category: 'Order',
    examples: 'Items purchased, totals',
    purpose: 'Fulfillment & support',
    retention: '7 years (tax/audit)',
  },
  {
    category: 'Device',
    examples: 'Browser, OS, IP (truncated)',
    purpose: 'Security & analytics',
    retention: '30 days (raw logs)',
  },
  {
    category: 'Usage',
    examples: 'Pages viewed, actions',
    purpose: 'Improve UX & features',
    retention: 'Aggregated after 90 days',
  },
];

const faqs = [
  {
    q: 'Can I delete my data?',
    a: 'Yes. Send a request and we will remove or anonymize non‑required records subject to legal retention.',
  },
  {
    q: 'Do you sell personal data?',
    a: 'No. We never sell your personal information to third parties.',
  },
  {
    q: 'Where is data stored?',
    a: 'Secure cloud infrastructure with regional redundancy and encryption at rest & in transit.',
  },
  {
    q: "Children's privacy?",
    a: 'Our services are not directed to children under 13 and we do not knowingly collect their data.',
  },
];

const Privacy = () => {
  return (
    <div className="container mx-auto px-4 pt-32 pb-32 max-w-4xl">
      <div className="mb-6">
        <Breadcrumbs />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </motion.div>

      {/* Table of Contents */}
      <nav className="grid sm:grid-cols-3 gap-4 mb-14">
        {coreSections.map((s, i) => (
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

      {/* Core Sections */}
      <div className="space-y-16">
        {coreSections.map((sec, i) => (
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
            {sec.id === 'data' && (
              <div className="overflow-hidden rounded-xl border border-sakura-pink/30 bg-white/50 dark:bg-white/5">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Examples</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Retention</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataTable.map((row) => (
                      <TableRow key={row.category}>
                        <TableCell className="font-medium">{row.category}</TableCell>
                        <TableCell>{row.examples}</TableCell>
                        <TableCell>{row.purpose}</TableCell>
                        <TableCell>{row.retention}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </motion.section>
        ))}
      </div>

      {/* FAQ */}
      <div className="mt-24">
        <h2 className="text-2xl font-semibold mb-6 font-playfair">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Contact CTA */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        className="mt-24 rounded-2xl border border-sakura-pink/30 bg-gradient-to-r from-primary/10 via-sakura-light/30 to-primary/10 p-8 md:p-12 text-center shadow-soft"
      >
        <h3 className="font-playfair text-2xl font-semibold mb-3">Need clarification?</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-xl mx-auto">
          Reach out to our privacy team at{' '}
          <a href="mailto:privacy@example.com" className="text-primary underline">
            privacy@example.com
          </a>{' '}
          and we will respond within 48 hours.
        </p>
        <a
          href="mailto:privacy@example.com"
          className="inline-block px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition shadow-elegant"
        >
          Contact Privacy Team
        </a>
      </motion.div>
    </div>
  );
};

export default Privacy;
