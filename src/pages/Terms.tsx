import { motion } from 'framer-motion';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const sections = [
  {
    id: 'agreement',
    title: 'Agreement to Terms',
    body: 'By accessing or using the site you confirm that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree, you may not use the services.',
  },
  {
    id: 'accounts',
    title: 'Accounts & Security',
    body: 'You are responsible for maintaining the confidentiality of your credentials and for all activities under your account. Notify us immediately of unauthorized use.',
  },
  {
    id: 'orders',
    title: 'Orders & Acceptance',
    body: 'Your submission of an order is an offer to purchase. We may accept or decline for reasons including stock limitations, suspected fraud, or pricing errors. Unaccepted charges will be refunded.',
  },
  {
    id: 'pricing',
    title: 'Pricing & Availability',
    body: 'Prices, descriptions, and availability may change without notice. We strive for accuracy but may correct errors prior to fulfillment. Promotional pricing may be time‑limited.',
  },
  {
    id: 'substitutions',
    title: 'Floral Substitutions',
    body: 'Minor variations and substitutions of equal or greater value may occur due to seasonality or supply, preserving the overall style and value of the arrangement.',
  },
  {
    id: 'ip',
    title: 'Intellectual Property',
    body: 'All trademarks, logos, copy, product photography, illustrations, and code are the property of PetalFlow or its licensors and protected by IP laws. Limited personal license only.',
  },
  {
    id: 'conduct',
    title: 'Acceptable Use',
    body: 'You agree not to: misuse the service, deploy automated scraping, introduce malware, attempt unauthorized access, or interfere with normal operation.',
  },
  {
    id: 'returns',
    title: 'Cancellations & Returns',
    body: 'Perishable nature means cancellations are accepted until preparation begins. Quality issues must be reported with photos within 24 hours for resolution or partial refund.',
  },
  {
    id: 'liability',
    title: 'Limitation of Liability',
    body: 'To the fullest extent permitted by law we disclaim liability for indirect, incidental, special, consequential, or punitive damages, or loss of profit, data, or goodwill.',
  },
  {
    id: 'changes',
    title: 'Changes to These Terms',
    body: 'We may revise Terms. Material changes will update the date below; continued use constitutes acceptance of revised Terms.',
  },
  {
    id: 'law',
    title: 'Governing Law',
    body: 'These Terms are governed by applicable local law without regard to conflict-of-law principles. Venue lies in the courts of competent jurisdiction in our principal location.',
  },
];

const faqs = [
  {
    q: 'Can I cancel after placing an order?',
    a: 'Yes, if preparation has not started. Contact support promptly with your order ID.',
  },
  {
    q: 'What if stems differ from the photo?',
    a: 'Seasonal substitutions of comparable or greater value may occur while preserving style and palette.',
  },
  {
    q: 'Do you offer refunds for wilted flowers?',
    a: 'Report within 24 hours with photos; we will offer a replacement or partial refund case‑by‑case.',
  },
  {
    q: 'Are promotions stackable?',
    a: 'Unless explicitly stated, discount codes and promotions cannot be combined.',
  },
];

const Terms = () => {
  return (
    <div className="container mx-auto px-4 pt-32 pb-32 max-w-4xl">
      <div className="mb-6">
        <Breadcrumbs />
      </div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </motion.div>

      <div className="space-y-16">
        {sections.map((sec, i) => (
          <motion.section
            key={sec.id}
            id={sec.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, delay: 0.04 * i }}
          >
            <h2 className="text-2xl font-semibold mb-3 font-playfair">{sec.title}</h2>
            <p className="text-muted-foreground leading-relaxed text-sm max-w-3xl">{sec.body}</p>
          </motion.section>
        ))}
      </div>

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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        className="mt-24 rounded-2xl border border-sakura-pink/30 bg-gradient-to-r from-sakura-light/30 via-primary/10 to-sakura-light/30 p-8 md:p-12 text-center"
      >
        <h3 className="font-playfair text-2xl font-semibold mb-3">Need clarification?</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-xl mx-auto">
          Contact our legal team at{' '}
          <a href="mailto:legal@example.com" className="text-primary underline">
            legal@example.com
          </a>{' '}
          before proceeding if you have any questions about these Terms.
        </p>
        <a
          href="mailto:legal@example.com"
          className="inline-block px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition shadow-elegant"
        >
          Contact Legal
        </a>
      </motion.div>
    </div>
  );
};

export default Terms;
