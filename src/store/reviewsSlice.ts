import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';

export interface Review {
  id: string;
  productSlug: string;
  name: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string; // ISO
}

interface ReviewsState {
  items: Review[];
}

const STORAGE_KEY = 'pf_reviews_v1';

function loadInitial(): Review[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as Review[];
  } catch {
    // ignore corrupted localStorage
  }
  return [];
}

const initialState: ReviewsState = { items: loadInitial() };

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    addReview: (state, action: PayloadAction<Omit<Review, 'id' | 'createdAt'>>) => {
      const review: Review = {
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      state.items.unshift(review);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items.slice(0, 500)));
      } catch {
        // ignore persistence errors (quota, privacy mode)
      }
    },
  },
});

export const { addReview } = reviewsSlice.actions;
export const selectReviewsForProduct = (slug: string) => (state: RootState) =>
  state.reviews.items.filter((r) => r.productSlug === slug);
export const selectAggregateForProduct = (slug: string) => (state: RootState) => {
  const list = state.reviews.items.filter((r) => r.productSlug === slug);
  if (!list.length) return { count: 0, average: 0 };
  const sum = list.reduce((acc, r) => acc + r.rating, 0);
  return { count: list.length, average: sum / list.length };
};

export default reviewsSlice.reducer;
