import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Flower2, Leaf, Truck, ShieldCheck } from 'lucide-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';

const fakeStats = [
  { label: 'Arrangements Crafted', value: '12,450+' },
  { label: 'Happy Customers', value: '8,900+' },
  { label: 'Same‑Day Deliveries', value: '4,300+' },
  { label: 'Sustainability Score', value: 'A+' },
];

const values = [
  {
    icon: Flower2,
    title: 'Artistry',
    desc: 'Design-first philosophy with timeless floral aesthetics.',
  },
  { icon: Leaf, title: 'Sustainability', desc: 'Locally sourced stems & recyclable packaging.' },
  { icon: Truck, title: 'Speed', desc: 'Express & same-day delivery in major cities.' },
  { icon: ShieldCheck, title: 'Quality', desc: '7‑day freshness guarantee on premium lines.' },
];

const About = () => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 900); // fake latency
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-24 max-w-6xl">
      <div className="mb-6">
        <Breadcrumbs />
      </div>
      <div className="max-w-3xl mb-12">
        <Badge className="mb-4">Our Story</Badge>
        <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-6">About PetalFlow</h1>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Founded in 2021, PetalFlow started as a boutique studio blending modern design with
          traditional floral craftsmanship. Today we partner with responsible growers to deliver
          refined arrangements that celebrate seasonality, color harmony, and emotional impact.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          We believe flowers are a language. Our mission is to help you speak it beautifully—whether
          it’s a quiet thank you, a bold celebration, or a gentle remembrance.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-16">
        {fakeStats.map((s) => (
          <Card key={s.label} className="p-6 text-center hover:shadow-glow transition-shadow">
            <div className="text-3xl font-bold font-playfair text-primary mb-2">{s.value}</div>
            <div className="text-sm uppercase tracking-wide text-muted-foreground font-medium">
              {s.label}
            </div>
          </Card>
        ))}
      </div>

      {/* Values */}
      <div className="mb-20">
        <h2 className="font-playfair text-3xl font-semibold mb-8">What We Value</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <Card key={v.title} className="p-6 relative overflow-hidden group">
              <div className="w-10 h-10 rounded-full bg-sakura-light flex items-center justify-center mb-4 text-primary">
                <v.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-5 bg-primary transition-opacity" />
            </Card>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div>
          <h2 className="font-playfair text-3xl font-semibold mb-4">Get in Touch</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Have a custom event, partnership idea, or just want to say hi? Send us a note—our floral
            concierge responds within business hours.
          </p>
          <ul className="text-sm space-y-2 mb-8 text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Email:</span> hello@petalflow.example
            </li>
            <li>
              <span className="font-medium text-foreground">Studio:</span> 128 Blossom Ave, Bloom
              City
            </li>
            <li>
              <span className="font-medium text-foreground">Phone:</span> (555) 014-2211
            </li>
            <li>
              <span className="font-medium text-foreground">Hours:</span> Mon–Sat 9:00–18:00
            </li>
          </ul>
        </div>
        <Card className="p-6 shadow-soft">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input required placeholder="Your name" disabled={sending || sent} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  required
                  placeholder="you@example.com"
                  disabled={sending || sent}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Input required placeholder="Subject" disabled={sending || sent} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                required
                rows={5}
                placeholder="How can we help?"
                disabled={sending || sent}
              />
            </div>
            <div className="pt-2 flex items-center gap-4">
              <Button type="submit" disabled={sending || sent} className="bg-primary">
                {sending ? 'Sending...' : sent ? 'Sent ✔' : 'Send Message'}
              </Button>
              {sent && <span className="text-sm text-green-600">We received your message.</span>}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default About;
