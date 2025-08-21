import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { motion } from 'framer-motion';
import roseImg from '@/assets/rose-bouquet.jpg';
import lilyImg from '@/assets/lily-arrangement.jpg';
import orchidImg from '@/assets/orchid-arrangement.jpg';
import tulipImg from '@/assets/tulip-mix.jpg';
import sunflowerImg from '@/assets/sunflower-bouquet.jpg';
import { Button } from './ui/button';

interface SlideItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  cta?: string;
  href?: string;
  badge?: string;
}

const slides: SlideItem[] = [
  {
    id: 'roses',
    title: 'Romantic Roses',
    subtitle: 'Express timeless love with our premium long‑stem roses.',
    image: roseImg,
    cta: 'Shop Roses',
    href: '/flowers?cat=Roses',
    badge: 'Bestseller',
  },
  {
    id: 'lilies',
    title: 'Elegant Lilies',
    subtitle: 'Graceful blooms that add sophistication to any space.',
    image: lilyImg,
    cta: 'Explore Lilies',
    href: '/flowers?cat=Lilies',
    badge: 'Elegant',
  },
  {
    id: 'orchids',
    title: 'Exotic Orchids',
    subtitle: 'Rare varieties curated for collectors & connoisseurs.',
    image: orchidImg,
    cta: 'View Orchids',
    href: '/flowers?cat=Orchids',
    badge: 'Limited',
  },
  {
    id: 'tulips',
    title: 'Spring Tulips',
    subtitle: 'Vibrant colors that celebrate new beginnings.',
    image: tulipImg,
    cta: 'Browse Tulips',
    href: '/flowers?cat=Tulips',
    badge: 'Seasonal',
  },
  {
    id: 'sunflowers',
    title: 'Radiant Sunflowers',
    subtitle: 'Bring warmth & joy with golden petals that glow.',
    image: sunflowerImg,
    cta: 'Shop Sunflowers',
    href: '/flowers?cat=Sunflowers',
    badge: 'Joy',
  },
];

const FeaturedCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [api, setApi] = useState<CarouselApi | null>(null);

  // Auto-play every 6s
  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    api.on('select', onSelect);
    onSelect();
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background via-sakura-light/20 to-background">
      <div className="container mx-auto max-w-7xl">
        <Carousel setApi={setApi} opts={{ loop: true, align: 'start' }} className="group">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold">Seasonal Highlights</h2>
              <p className="text-muted-foreground mt-2 max-w-xl">
                Explore curated floral themes trending this season. Swipe through inspiration and
                dive straight into the perfect category.
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <CarouselPrevious className="-left-2 relative translate-y-0" />
              <CarouselNext className="-right-2 relative translate-y-0" />
            </div>
          </div>
          <CarouselContent>
            {slides.map((s, index) => (
              <CarouselItem key={s.id} className="basis-full md:basis-1/2 lg:basis-2/5">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="relative h-80 md:h-96 overflow-hidden rounded-2xl shadow-soft group"
                >
                  <img
                    src={s.image}
                    alt={s.title}
                    className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/30 to-black/10" />
                  <div className="absolute top-4 left-4">
                    {s.badge && (
                      <span className="inline-block text-xs uppercase tracking-wide bg-primary text-primary-foreground px-3 py-1 rounded-full shadow">
                        {s.badge}
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-3">
                    <h3 className="text-2xl font-semibold text-white drop-shadow">{s.title}</h3>
                    <p className="text-white/80 text-sm leading-relaxed line-clamp-2 md:line-clamp-none">
                      {s.subtitle}
                    </p>
                    {s.href && s.cta && (
                      <Button
                        asChild
                        size="sm"
                        className="w-max bg-white/90 text-foreground hover:bg-white"
                      >
                        <a href={s.href}>{s.cta}</a>
                      </Button>
                    )}
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-6 gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => api && api.scrollTo(i)}
                className={`h-2.5 rounded-full transition-all ${
                  current === i ? 'w-6 bg-primary' : 'w-2.5 bg-primary/30 hover:bg-primary/60'
                }`}
              />
            ))}
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default FeaturedCarousel;
