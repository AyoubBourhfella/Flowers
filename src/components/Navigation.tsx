import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, ShoppingBag, Heart, Search } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="nav-slide-in fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-sakura-pink/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-sakura rounded-full flex items-center justify-center shadow-soft">
              <span className="text-white font-playfair font-bold text-lg">🌸</span>
            </div>
            <span className="font-playfair font-bold text-xl text-foreground">Sakura Blooms</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-foreground hover:text-primary transition-colors font-medium">
              Home
            </a>
            <a href="#flowers" className="text-foreground hover:text-primary transition-colors font-medium">
              Flowers
            </a>
            <a href="#bouquets" className="text-foreground hover:text-primary transition-colors font-medium">
              Bouquets
            </a>
            <a href="#occasions" className="text-foreground hover:text-primary transition-colors font-medium">
              Occasions
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium">
              About
            </a>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hover:bg-sakura-light/50">
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-sakura-light/50">
              <Heart className="w-4 h-4" />
            </Button>
            <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90 shadow-soft">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Cart
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-sakura-pink/20 pt-4">
            <div className="flex flex-col space-y-3">
              <a href="#home" className="text-foreground hover:text-primary transition-colors font-medium">
                Home
              </a>
              <a href="#flowers" className="text-foreground hover:text-primary transition-colors font-medium">
                Flowers
              </a>
              <a href="#bouquets" className="text-foreground hover:text-primary transition-colors font-medium">
                Bouquets
              </a>
              <a href="#occasions" className="text-foreground hover:text-primary transition-colors font-medium">
                Occasions
              </a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium">
                About
              </a>
              <div className="flex items-center space-x-2 pt-2">
                <Button variant="ghost" size="sm">
                  <Search className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Cart
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;