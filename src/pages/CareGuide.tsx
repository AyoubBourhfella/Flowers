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

const essentials = [
  {
    title: 'Trim Stems',
    desc: 'Re-cut 1–2 cm at a 45° under water every 48 hours to open xylem pathways.',
  },
  {
    title: 'Clean Water',
    desc: 'Change vase water daily. Rinse bacteria film. Cloudy water shortens vase life.',
  },
  {
    title: 'Nutrition',
    desc: 'Use flower food (balances sugar + acid + biocide) for hydration and bloom longevity.',
  },
  {
    title: 'Placement',
    desc: 'Display away from direct sun, drafts, heating vents, and ripening fruit (ethylene gas).',
  },
  {
    title: 'Prune & Refresh',
    desc: 'Remove wilted heads promptly; decaying tissue accelerates microbial growth.',
  },
];

const environment = [
  {
    factor: 'Water Temp',
    target: 'Cool (10–18°C)',
    note: 'Cool slows respiration; avoid ice or hot water.',
  },
  { factor: 'Room Temp', target: '18–22°C', note: 'Higher temps accelerate opening & wilting.' },
  {
    factor: 'Light',
    target: 'Indirect bright',
    note: 'Direct sun causes heat stress & rapid transpiration.',
  },
  {
    factor: 'Ethylene',
    target: 'Low exposure',
    note: 'Keep away from fruit bowls & cigarette smoke.',
  },
];

const troubleshooting = [
  {
    q: 'Stems turning slimy',
    a: 'Change water, trim stems higher above infected tissue, clean vase with mild bleach solution.',
  },
  {
    q: 'Heads drooping early',
    a: 'Re-cut stems deeper; ensure no foliage sits below water line; consider adding fresh preservative.',
  },
  {
    q: 'Cloudy water fast',
    a: 'Increase water change frequency and remove decaying foliage submerged in water.',
  },
  {
    q: 'Petals browning edges',
    a: 'Likely heat or low humidity; relocate to cooler indirect light and mist lightly (avoid dense blooms).',
  },
];

const speciesNotes = [
  {
    title: 'Roses',
    desc: 'Remove guard petals; keep stems well hydrated—recut if neck bending appears.',
  },
  { title: 'Tulips', desc: 'Keep cool; they continue to grow—rotate vase to maintain form.' },
  {
    title: 'Lilies',
    desc: 'Remove pollen anthers when open to prolong petals and prevent staining.',
  },
  { title: 'Orchids', desc: 'Prefer stable temps & gentle misting—avoid direct drafts.' },
];

const CareGuide = () => {
  return (
    <div className="container mx-auto px-4 pt-32 pb-32 max-w-5xl">
      <div className="mb-6">
        <Breadcrumbs />
      </div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Flower Care Guide</h1>
        <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
          Get the most from your arrangement with professional post‑harvest techniques distilled
          into simple steps.
        </p>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="mb-20"
      >
        <h2 className="text-2xl font-semibold mb-6 font-playfair">Essentials</h2>
        <ul className="grid sm:grid-cols-2 gap-6">
          {essentials.map((e, i) => (
            <motion.li
              key={e.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * i }}
              className="p-4 rounded-lg border border-sakura-pink/30 bg-white/60 dark:bg-white/5 backdrop-blur-sm"
            >
              <h3 className="font-medium mb-1">{e.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{e.desc}</p>
            </motion.li>
          ))}
        </ul>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="mb-20"
      >
        <h2 className="text-2xl font-semibold mb-4 font-playfair">Ideal Environment</h2>
        <div className="rounded-xl border border-sakura-pink/30 overflow-hidden bg-white/60 dark:bg-white/5 backdrop-blur-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Factor</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {environment.map((env) => (
                <TableRow key={env.factor}>
                  <TableCell className="font-medium whitespace-nowrap">{env.factor}</TableCell>
                  <TableCell>{env.target}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[320px]">
                    {env.note}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="mb-20 max-w-3xl"
      >
        <h2 className="text-2xl font-semibold mb-4 font-playfair">Species Notes</h2>
        <ul className="space-y-4">
          {speciesNotes.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.04 * i }}
              className="border-l-4 border-primary pl-4"
            >
              <span className="font-medium">{s.title}:</span>{' '}
              <span className="text-muted-foreground text-sm">{s.desc}</span>
            </motion.li>
          ))}
        </ul>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="mb-20 max-w-3xl"
      >
        <h2 className="text-2xl font-semibold mb-4 font-playfair">Troubleshooting</h2>
        <Accordion type="single" collapsible className="w-full">
          {troubleshooting.map((t) => (
            <AccordionItem key={t.q} value={t.q}>
              <AccordionTrigger className="text-left">{t.q}</AccordionTrigger>
              <AccordionContent>{t.a}</AccordionContent>
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
        <h3 className="font-playfair text-2xl font-semibold mb-3">Care Questions?</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-xl mx-auto">
          Send us a photo of your arrangement and our floral specialists will advise within 24
          hours.
        </p>
        <a
          href="mailto:care@example.com"
          className="inline-block px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition shadow-elegant"
        >
          Ask a Floral Specialist
        </a>
      </motion.div>
    </div>
  );
};

export default CareGuide;
