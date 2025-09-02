import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  tags?: string[];
}

interface FlowersState {
  items: FlowerItem[];
}

const LS_KEY = 'pf_flowers_v1';

function loadStored(): FlowerItem[] | null {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(LS_KEY) : null;
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FlowerItem[];
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function persist(items: FlowerItem[]) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LS_KEY, JSON.stringify(items.slice(0, 500)));
    }
  } catch {
    /* ignore */
  }
}

const initialState: FlowersState = {
  items: loadStored() || [
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
      tags: ['bestseller'],
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
      tags: [],
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
      tags: [],
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
      tags: ['limited'],
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
      tags: [],
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
      tags: ['premium'],
    },
  ],
};

const flowersSlice = createSlice({
  name: 'flowers',
  initialState,
  reducers: {
    addFlower(state, action: PayloadAction<FlowerItem>) {
      state.items.unshift(action.payload);
      persist(state.items);
    },
    updateFlower(state, action: PayloadAction<FlowerItem>) {
      const i = state.items.findIndex((f) => f.id === action.payload.id);
      if (i !== -1) state.items[i] = action.payload;
      persist(state.items);
    },
    deleteFlower(state, action: PayloadAction<{ id: string }>) {
      state.items = state.items.filter((f) => f.id !== action.payload.id);
      persist(state.items);
    },
  },
});

export const { addFlower, updateFlower, deleteFlower } = flowersSlice.actions;

export default flowersSlice.reducer;
export type FlowersStateType = FlowersState;
