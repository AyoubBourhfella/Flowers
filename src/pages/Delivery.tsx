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

const levels = [
  {
    tier: 'Same‑Day',
    cutoff: '2:00 PM local',
    window: '3–7 PM',
    fee: 'Dynamic (distance)',
    notes: 'Available weekdays; limited weekend slots.',
  },
  {
    tier: 'Express AM',
    cutoff: '5:00 PM prior day',
    window: '8–11 AM',
    fee: '$9.95 + distance',
    notes: 'Priority handling, limited quantity.',
  },
  {
    tier: 'Standard',
    cutoff: '11:59 PM prior day',
    window: '11 AM – 6 PM',
    fee: 'From $4.95',
    notes: 'Most cost‑effective.',
  },
  {
    tier: 'Scheduled',
    cutoff: '48h prior',
    window: 'Chosen 2‑hr window',
    fee: 'Varies',
    notes: 'Ideal for events & gifting precision.',
  },
];

const faqs = [
  {
    q: 'What areas do you serve?',
    a: 'Primary metro core + 25km radius. Remote or rural zones currently excluded.',
  },
  {
    q: 'Weather delays?',
    a: 'Severe weather may shift windows; we notify by email/SMS with revised ETA.',
  },
  {
    q: 'Recipient not home?',
    a: 'We attempt contact; if unreachable we may leave in a shaded safe spot or reschedule (re‑delivery fee may apply).',
  },
  {
    q: 'Can I change address?',
    a: 'If route assignment has not begun we can update—contact support ASAP with order ID.',
  },
  {
    q: 'Do you deliver to hospitals?',
    a: 'Yes where allowed—please include ward/room details; substitutions may occur for restricted species.',
  },
];

const Delivery = () => {
  return (
    <div className="container mx-auto px-4 pt-32 pb-32 max-w-5xl">
      <div className="mb-6">
        <Breadcrumbs />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 max-w-3xl"
      >
        <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Delivery Information</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Transparent delivery options designed for freshness and reliability. Choose the service
          level that matches your timing needs.
        </p>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="mb-20"
      >
        <h2 className="text-2xl font-semibold mb-4 font-playfair">Service Levels</h2>
        <div className="rounded-xl border border-sakura-pink/30 overflow-hidden bg-white/60 dark:bg-white/5 backdrop-blur-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tier</TableHead>
                <TableHead>Cutoff</TableHead>
                <TableHead>Delivery Window</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {levels.map((l) => (
                <TableRow key={l.tier}>
                  <TableCell className="font-medium whitespace-nowrap">{l.tier}</TableCell>
                  <TableCell>{l.cutoff}</TableCell>
                  <TableCell>{l.window}</TableCell>
                  <TableCell>{l.fee}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[240px]">
                    {l.notes}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Fees shown may vary by distance, weight, and promotional adjustments.
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="mb-20 max-w-3xl"
      >
        <h2 className="text-2xl font-semibold mb-4 font-playfair">Freshness & Handling</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Arrangements are hydrated, temperature‑staged, and transported upright in cushioned
          carriers. We minimize transit time and avoid extreme heat exposure to preserve vase life.
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="mb-20 max-w-3xl"
      >
        <h2 className="text-2xl font-semibold mb-4 font-playfair">Delivery FAQ</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        className="rounded-2xl border border-sakura-pink/30 bg-gradient-to-r from-primary/10 via-sakura-light/30 to-primary/10 p-8 md:p-12 text-center"
      >
        <h3 className="font-playfair text-2xl font-semibold mb-3">Need a custom delivery?</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-xl mx-auto">
          Event logistics or large orders can be coordinated directly. Reach out with timing,
          quantity, and location details.
        </p>
        <a
          href="mailto:deliveries@example.com"
          className="inline-block px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition shadow-elegant"
        >
          Contact Delivery Team
        </a>
      </motion.div>
    </div>
  );
};

export default Delivery;
