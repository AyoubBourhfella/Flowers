import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

import roseBouquet from '@/assets/rose-bouquet.jpg';
import lilyArrangement from '@/assets/lily-arrangement.jpg';
import sunflowerBouquet from '@/assets/sunflower-bouquet.jpg';
import tulipMix from '@/assets/tulip-mix.jpg';
import lavenderBunch from '@/assets/lavender-bunch.jpg';
import orchidArrangement from '@/assets/orchid-arrangement.jpg';

const products = [
  {
    image: roseBouquet,
    title: "Premium Rose Bouquet",
    price: "$89.99",
    originalPrice: "$120.00",
    rating: 4.9,
    reviews: 247,
    badge: "Bestseller"
  },
  {
    image: lilyArrangement,
    title: "Elegant White Lily Arrangement",
    price: "$65.99",
    rating: 4.8,
    reviews: 163
  },
  {
    image: sunflowerBouquet,
    title: "Bright Sunflower Collection",
    price: "$45.99",
    rating: 4.7,
    reviews: 89
  },
  {
    image: tulipMix,
    title: "Pastel Tulip Mix",
    price: "$55.99",
    originalPrice: "$70.00",
    rating: 4.8,
    reviews: 134,
    badge: "Limited"
  },
  {
    image: lavenderBunch,
    title: "Aromatic Lavender Bundle",
    price: "$35.99",
    rating: 4.6,
    reviews: 78
  },
  {
    image: orchidArrangement,
    title: "Luxury Orchid Arrangement",
    price: "$125.99",
    rating: 5.0,
    reviews: 92,
    badge: "Premium"
  }
];

const ProductShowcase = () => {
  return (
    <section className="py-20 px-4 bg-background" id="flowers">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16 content-fade-in">
          <div className="inline-flex items-center px-4 py-2 bg-sakura-light/50 rounded-full border border-sakura-pink/30 mb-6">
            <span className="text-sm font-medium text-foreground">Featured Collection</span>
          </div>
          
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-6">
            Handpicked Flowers
            <span className="text-primary block">For Every Occasion</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our carefully curated selection of premium flowers and arrangements, 
            each crafted with love and delivered fresh to your doorstep.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {products.map((product, index) => (
            <div 
              key={index} 
              className="content-fade-in"
              style={{ animationDelay: `${index * 0.1 + 2}s` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center content-fade-in">
          <Button 
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant hover:shadow-glow transition-all duration-300 px-8 py-6 text-lg font-medium"
          >
            View All Flowers
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;