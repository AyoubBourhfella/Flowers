import { createSlice } from '@reduxjs/toolkit';
import roseBouquet from '@/assets/rose-bouquet.jpg';
import tulipMix from '@/assets/tulip-mix.jpg';
import orchidArrangement from '@/assets/orchid-arrangement.jpg';

export interface BouquetItem {
  id: string;
  slug: string;
  image: string;
  title: string;
  description?: string;
  price: number;
  rating: number;
  reviews: number;
  category: string; // Romantic, Spring, Luxury
  badge?: string;
  stems?: number;
  colorPalette?: string[];
}

interface BouquetsState {
  items: BouquetItem[];
}

const initialState: BouquetsState = {
  items: [
    {
      id: 'romantic-rose-ensemble',
      slug: 'romantic-rose-ensemble',
      image: roseBouquet,
      title: 'Romantic Rose Ensemble',
      description: 'Classic romantic bouquet featuring premium red roses and lush greenery.',
      price: 99.5,
      rating: 4.9,
      reviews: 182,
      category: 'Romantic',
      badge: 'Popular',
      stems: 24,
      colorPalette: ['red', 'deep-pink'],
    },
    {
      id: 'spring-tulip-celebration',
      slug: 'spring-tulip-celebration',
      image: tulipMix,
      title: 'Spring Tulip Celebration',
      description: 'Vibrant tulip medley capturing the energy and color of spring.',
      price: 72.0,
      rating: 4.7,
      reviews: 94,
      category: 'Spring',
      stems: 30,
      colorPalette: ['pastel-pink', 'yellow', 'lavender'],
    },
    {
      id: 'orchid-luxury-centerpiece',
      slug: 'orchid-luxury-centerpiece',
      image: orchidArrangement,
      title: 'Orchid Luxury Centerpiece',
      description: 'Statement orchid centerpiece crafted for upscale gifting & interiors.',
      price: 189.0,
      rating: 5.0,
      reviews: 55,
      category: 'Luxury',
      badge: 'Signature',
      stems: 6,
      colorPalette: ['white', 'soft-green'],
    },
  ],
};

const bouquetsSlice = createSlice({ name: 'bouquets', initialState, reducers: {} });
export default bouquetsSlice.reducer;
export type BouquetsStateType = BouquetsState;
