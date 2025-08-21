import { createSlice } from '@reduxjs/toolkit';

import roseBouquet from '@/assets/rose-bouquet.jpg';
import lilyArrangement from '@/assets/lily-arrangement.jpg';
import sunflowerBouquet from '@/assets/sunflower-bouquet.jpg';
import tulipMix from '@/assets/tulip-mix.jpg';
import lavenderBunch from '@/assets/lavender-bunch.jpg';
import orchidArrangement from '@/assets/orchid-arrangement.jpg';

export interface FlowerItem {
  id: string;
  slug: string;
  image: string;
  title: string;
  description?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
  category: string; // e.g., Rose, Lily, Seasonal, Luxury
}

interface FlowersState {
  items: FlowerItem[];
}

const initialState: FlowersState = {
  items: [
    {
      id: 'rose-bouquet',
      slug: 'premium-rose-bouquet',
      image: roseBouquet,
      title: 'Premium Rose Bouquet',
      description:
        'A romantic selection of long-stem premium roses, hand tied with seasonal foliage.',
      price: 89.99,
      originalPrice: 120.0,
      rating: 4.9,
      reviews: 247,
      badge: 'Bestseller',
      category: 'Roses',
    },
    {
      id: 'white-lily-arrangement',
      slug: 'elegant-white-lily-arrangement',
      image: lilyArrangement,
      title: 'Elegant White Lily Arrangement',
      description:
        'Fragrant white lilies arranged for purity and grace, perfect for serene gifting.',
      price: 65.99,
      rating: 4.8,
      reviews: 163,
      category: 'Lilies',
    },
    {
      id: 'sunflower-collection',
      slug: 'bright-sunflower-collection',
      image: sunflowerBouquet,
      title: 'Bright Sunflower Collection',
      description: 'Cheerful sunflowers bringing warmth and sunshine to any room or celebration.',
      price: 45.99,
      rating: 4.7,
      reviews: 89,
      category: 'Seasonal',
    },
    {
      id: 'pastel-tulip-mix',
      slug: 'pastel-tulip-mix',
      image: tulipMix,
      title: 'Pastel Tulip Mix',
      description: 'Soft pastel tulips in a spectrum of spring hues symbolising renewal and joy.',
      price: 55.99,
      originalPrice: 70.0,
      rating: 4.8,
      reviews: 134,
      badge: 'Limited',
      category: 'Tulips',
    },
    {
      id: 'lavender-bundle',
      slug: 'aromatic-lavender-bundle',
      image: lavenderBunch,
      title: 'Aromatic Lavender Bundle',
      description: 'Soothing, naturally dried lavender stems ideal for calming spaces and décor.',
      price: 35.99,
      rating: 4.6,
      reviews: 78,
      category: 'Herbal',
    },
    {
      id: 'orchid-arrangement',
      slug: 'luxury-orchid-arrangement',
      image: orchidArrangement,
      title: 'Luxury Orchid Arrangement',
      description: 'An elevated orchid display exuding refinement and lasting elegance.',
      price: 125.99,
      rating: 5.0,
      reviews: 92,
      badge: 'Premium',
      category: 'Orchids',
    },
  ],
};

const flowersSlice = createSlice({
  name: 'flowers',
  initialState,
  reducers: {},
});

export default flowersSlice.reducer;
export type FlowersStateType = FlowersState;
