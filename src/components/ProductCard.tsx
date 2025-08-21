import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  image: string;
  title: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviews: number;
  badge?: string;
}

const ProductCard = ({ image, title, price, originalPrice, rating, reviews, badge }: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <Card className="group relative overflow-hidden bg-gradient-card backdrop-blur-sm border-0 shadow-soft hover-lift">
      <div className="relative overflow-hidden rounded-t-lg">
        {badge && (
          <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
            {badge}
          </div>
        )}
        
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart 
            className={`w-4 h-4 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-600'}`} 
          />
        </button>

        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center space-x-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < Math.floor(rating)
                  ? 'text-gold fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({reviews})</span>
        </div>

        <h3 className="font-playfair font-semibold text-lg text-foreground line-clamp-2 mb-2">
          {title}
        </h3>

        <div className="flex items-center space-x-2 mb-3">
          <span className="font-bold text-primary text-xl">{price}</span>
          {originalPrice && (
            <span className="text-muted-foreground line-through text-sm">{originalPrice}</span>
          )}
        </div>

        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft hover:shadow-glow transition-all duration-300"
          size="sm"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;