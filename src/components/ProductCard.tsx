import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { showPrices } from '@/lib/featureFlags';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface ProductCardProps {
  slug: string;
  image: string;
  title: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviews: number;
  badge?: string;
  description?: string;
}

const ProductCard = ({
  slug,
  image,
  title,
  price,
  originalPrice,
  rating,
  reviews,
  badge,
  description,
}: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Card className="group relative overflow-hidden bg-gradient-card backdrop-blur-sm border-0 shadow-soft hover-lift">
        <div className="relative overflow-hidden rounded-t-lg">
          {badge && (
            <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
              {badge}
            </div>
          )}

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
                  i < Math.floor(rating) ? 'text-gold fill-current' : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">({reviews})</span>
          </div>

          <h3 className="font-playfair font-semibold text-lg text-foreground line-clamp-2 mb-1">
            {title}
          </h3>
          {description && (
            <div className="text-xs text-muted-foreground mb-2 leading-relaxed line-clamp-2">
              {description}
            </div>
          )}

          {showPrices ? (
            <div className="flex items-center space-x-2 mb-3">
              <span className="font-bold text-primary text-xl">{price}</span>
              {originalPrice && (
                <span className="text-muted-foreground line-through text-sm">{originalPrice}</span>
              )}
            </div>
          ) : (
            <div className="mb-3 text-xs text-muted-foreground flex items-start gap-1 leading-relaxed">
              <Info className="w-3.5 h-3.5 mt-0.5 text-primary" />
              <span>Premium fresh-cut stems • Pricing available on request</span>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              asChild
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft hover:shadow-glow transition-all duration-300"
              size="sm"
            >
              <Link to={`/product/${slug}`}>View</Link>
            </Button>
            {description && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="px-2">
                    Info
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="font-playfair text-xl">{title}</DialogTitle>
                    <DialogDescription className="text-xs">
                      Overview & Description
                    </DialogDescription>
                  </DialogHeader>
                  <div className="text-sm leading-relaxed space-y-3">
                    <p>{description}</p>
                    <p className="text-xs text-muted-foreground">
                      This is a preview. Visit the product page for reviews, ratings & full
                      specifications.
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
