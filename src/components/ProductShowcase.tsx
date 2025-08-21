import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { useAppSelector } from '@/hooks/useAppSelector';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const ProductShowcase = () => {
  return (
    <section className="py-20 px-4 bg-background" id="flowers">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center px-4 py-2 bg-sakura-light/50 rounded-full border border-sakura-pink/30 mb-6"
          >
            <span className="text-sm font-medium text-foreground">Featured Collection</span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-6"
          >
            Handpicked Flowers
            <span className="text-primary block">For Every Occasion</span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Discover our carefully curated selection of premium flowers and arrangements,
            <br className="hidden sm:block" />
            each crafted with love and delivered fresh to your doorstep.
          </motion.p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          {useAppSelector((s) => s.flowers.items).map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard
                image={product.image}
                title={product.title}
                price={`$${product.price.toFixed(2)}`}
                originalPrice={
                  product.originalPrice ? `$${product.originalPrice.toFixed(2)}` : undefined
                }
                rating={product.rating}
                reviews={product.reviews}
                badge={product.badge}
                slug={product.slug}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant hover:shadow-glow transition-all duration-300 px-8 py-6 text-lg font-medium"
          >
            <a href="#flowers">
              View All Flowers
              <ArrowRight className="ml-2 w-5 h-5 inline" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductShowcase;
