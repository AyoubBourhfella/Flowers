import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import heroImage from '@/assets/hero-sakura.jpg';
import { BRAND_TAGLINE, resolveHeroImage, BRAND_NAME } from '@/lib/branding';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { useRef } from 'react';

const Hero = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section
      ref={targetRef}
      className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden"
    >
      {/* Background Image with Parallax Effect */}
      <motion.div style={{ y, opacity, scale }} className="absolute inset-0 z-0">
        <img
          src={resolveHeroImage(heroImage)}
          alt={`${BRAND_NAME} hero background`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sakura-light/10 via-transparent to-background/80" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-sakura-pink/30 mb-6"
            whileHover={{
              scale: 1.05,
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              transition: { duration: 0.2 },
            }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-4 h-4 text-primary " />
            </motion.div>
            <span className="text-sm font-medium text-foreground ml-2">{BRAND_TAGLINE}</span>
          </motion.div>
        </motion.div>

        <motion.div className="relative mb-6" variants={itemVariants}>
          <motion.h1 className="font-playfair text-5xl md:text-7xl font-bold text-foreground leading-tight">
            <span className="sr-only">Where Nature's Beauty Blooms</span>
            {/* Layered word animations (Slider Revolution style) */}
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.4, ease: 'easeOut' }}
                className="inline-block"
              >
                Where Nature's
              </motion.span>
            </span>
            <span className="block overflow-hidden text-primary">
              <motion.span
                initial={{ y: '110%', rotate: 6, scale: 1.1, opacity: 0 }}
                animate={{ y: 0, rotate: 0, scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.65, ease: 'easeOut' }}
                whileHover={{ scale: 1.05, textShadow: '0 0 28px rgba(236,72,153,0.55)' }}
                className="inline-block will-change-transform"
              >
                Beauty Blooms
              </motion.span>
            </span>
            {/* Accent floating petals */}
            <motion.span
              aria-hidden
              initial={{ opacity: 0, y: -10, scale: 0.8 }}
              animate={{ opacity: 1, y: [-4, 4, -4], scale: 1 }}
              transition={{ duration: 6, delay: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -right-10 top-4 text-primary text-5xl pointer-events-none select-none"
            >
              ✿
            </motion.span>
            <motion.span
              aria-hidden
              initial={{ opacity: 0, x: -10, scale: 0.7 }}
              animate={{ opacity: 1, x: [0, 6, 0], scale: 1 }}
              transition={{ duration: 5, delay: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-0 -bottom-8 text-primary/70 text-4xl pointer-events-none select-none"
            >
              ❀
            </motion.span>
          </motion.h1>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          Discover our exquisite collection of fresh flowers and handcrafted bouquets. Each bloom
          tells a story of elegance, crafted with passion and delivered with love.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <motion.div
            whileHover={{
              scale: 1.03,
              boxShadow: '0 10px 32px -4px rgba(236,72,153,0.35)',
              transition: { duration: 0.25, ease: 'easeOut' },
            }}
            whileTap={{ scale: 0.94 }}
            className="relative group"
          >
            <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-r from-primary/30 via-primary/10 to-transparent blur-xl" />
            <Button
              asChild
              size="lg"
              className="relative bg-primary hover:bg-primary/85 text-primary-foreground shadow-elegant hover:shadow-glow transition-all duration-300 px-8 py-6 text-lg font-medium border border-primary/50"
            >
              <Link to="/flowers">
                Explore Collection
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block"
                >
                  <ArrowRight className="ml-2 w-5 h-5" />
                </motion.div>
              </Link>
            </Button>
          </motion.div>
          <motion.div
            whileHover={{
              scale: 1.03,
              transition: { duration: 0.25, ease: 'easeOut' },
            }}
            whileTap={{ scale: 0.94 }}
            className="relative group"
          >
            <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-r from-primary/20 via-transparent to-primary/10 blur-xl" />
            <Button
              asChild
              variant="outline"
              size="lg"
              className="relative border-primary/30 hover:border-primary/50 hover:bg-primary/5 px-8 py-6 text-lg font-medium backdrop-blur-sm"
            >
              <Link to="/custom-bouquet">Custom Bouquet</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-8 max-w-md mx-auto">
          {[
            { number: '500+', label: 'Flower Varieties' },
            { number: '50K+', label: 'Happy Customers' },
            { number: '24/7', label: 'Fresh Delivery' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              whileHover={{
                scale: 1.1,
                y: -5,
                transition: { duration: 0.2, type: 'spring', stiffness: 300 },
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
            >
              <motion.div
                className="text-2xl font-bold text-primary font-playfair"
                animate={{
                  textShadow: [
                    '0 0 0px rgba(236, 72, 153, 0)',
                    '0 0 10px rgba(236, 72, 153, 0.3)',
                    '0 0 0px rgba(236, 72, 153, 0)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
              >
                {stat.number}
              </motion.div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
