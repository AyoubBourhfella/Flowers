import { Flower2, Github, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  BRAND_NAME,
  BRAND_GITHUB,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_ADDRESS,
  BRAND_TAGLINE,
} from '@/lib/branding';

const year = new Date().getFullYear();

const links = {
  shop: [
    { label: 'All Flowers', href: '/flowers' },
    { label: 'Bouquets', href: '/bouquets' },
    { label: 'Roses', href: '/flowers?cat=Roses' },
    { label: 'Lilies', href: '/flowers?cat=Lilies' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/about#contact' },
  ],
  info: [
    { label: 'Care Guide', href: '/care-guide' },
    { label: 'Delivery', href: '/delivery' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
  ],
};

const Footer = () => {
  return (
    <footer className="mt-24 border-t border-sakura-pink/20 bg-gradient-to-b from-background to-sakura-light/20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_70%_20%,rgba(236,72,153,0.25),transparent_70%)]" />
      <div className="container mx-auto max-w-7xl px-4 relative py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Flower2 className="w-6 h-6 text-primary" />
              <span className="font-playfair text-xl font-semibold">{BRAND_NAME}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-xs">
              {BRAND_TAGLINE}
            </p>
            <div className="flex gap-3">
              <a
                href={BRAND_GITHUB}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-sakura-pink/30 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="w-9 h-9 rounded-full border border-sakura-pink/30 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 col-span-2 lg:col-span-2 md:order-none order-last">
            <div>
              <h3 className="font-semibold mb-4 text-sm tracking-wide text-foreground/80">Shop</h3>
              <ul className="space-y-2 text-sm">
                {links.shop.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-muted-foreground hover:text-primary transition"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-sm tracking-wide text-foreground/80">
                Company
              </h3>
              <ul className="space-y-2 text-sm">
                {links.company.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-muted-foreground hover:text-primary transition"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-sm tracking-wide text-foreground/80">Info</h3>
              <ul className="space-y-2 text-sm">
                {links.info.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-muted-foreground hover:text-primary transition"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-sm tracking-wide text-foreground/80">
              Get in Touch
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2 items-start">
                <Phone className="w-4 h-4 mt-0.5 text-primary" />
                <span>{CONTACT_PHONE}</span>
              </li>
              <li className="flex gap-2 items-start">
                <Mail className="w-4 h-4 mt-0.5 text-primary" />
                <span>{CONTACT_EMAIL}</span>
              </li>
              <li className="flex gap-2 items-start">
                <MapPin className="w-4 h-4 mt-0.5 text-primary" />
                <span>{CONTACT_ADDRESS}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 pt-8 border-t border-sakura-pink/20 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground"
        >
          <p>
            © {year} {BRAND_NAME}. All rights reserved.
          </p>
          <p className="flex gap-2">
            <span>Made with</span>
            <span className="text-primary">❤</span>
            <span>and petals.</span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
