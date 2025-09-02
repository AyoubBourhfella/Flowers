import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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
  tags?: string[];
}

interface BouquetsState {
  items: BouquetItem[];
}

const LS_KEY = 'pf_bouquets_v1';

function loadStored(): BouquetItem[] | null {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(LS_KEY) : null;
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BouquetItem[];
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function persist(items: BouquetItem[]) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LS_KEY, JSON.stringify(items.slice(0, 500)));
    }
  } catch {
    /* ignore */
  }
}

const initialState: BouquetsState = {
  items: loadStored() || [
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
      tags: ['romantic'],
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
      tags: ['spring'],
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
      tags: ['luxury', 'premium'],
    },
  ],
};

const bouquetsSlice = createSlice({
  name: 'bouquets',
  initialState,
  reducers: {
    addBouquet(state, action: PayloadAction<BouquetItem>) {
      state.items.unshift(action.payload);
      persist(state.items);
    },
    updateBouquet(state, action: PayloadAction<BouquetItem>) {
      const i = state.items.findIndex((b) => b.id === action.payload.id);
      if (i !== -1) state.items[i] = action.payload;
      persist(state.items);
    },
    deleteBouquet(state, action: PayloadAction<{ id: string }>) {
      state.items = state.items.filter((b) => b.id !== action.payload.id);
      persist(state.items);
    },
  },
});
export const { addBouquet, updateBouquet, deleteBouquet } = bouquetsSlice.actions;
export default bouquetsSlice.reducer;
export type BouquetsStateType = BouquetsState;
