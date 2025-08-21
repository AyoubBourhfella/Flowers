import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import heroImage from '@/assets/hero-sakura.jpg';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Beautiful sakura cherry blossoms"
          className="w-full h-full object-cover opacity-30 hero-entrance"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sakura-light/20 via-transparent to-background/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="hero-entrance">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-sakura-pink/30 mb-6">
            <Sparkles className="w-4 h-4 text-primary mr-2" />
            <span className="text-sm font-medium text-foreground">Premium Flower Collection</span>
          </div>

          <h1 className="font-playfair text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Where Nature's
            <span className="text-primary block float-animation">Beauty Blooms</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover our exquisite collection of fresh flowers and handcrafted bouquets. 
            Each bloom tells a story of elegance, crafted with passion and delivered with love.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant hover:shadow-glow transition-all duration-300 px-8 py-6 text-lg font-medium"
            >
              Explore Collection
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary/20 hover:bg-sakura-light/50 px-8 py-6 text-lg font-medium hover-lift"
            >
              Custom Bouquet
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary font-playfair">500+</div>
              <div className="text-sm text-muted-foreground">Flower Varieties</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary font-playfair">50K+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary font-playfair">24/7</div>
              <div className="text-sm text-muted-foreground">Fresh Delivery</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 content-fade-in">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;