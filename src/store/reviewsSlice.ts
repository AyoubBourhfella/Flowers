import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';

export interface Review {
  id: string;
  productSlug: string;
  name: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string; // ISO
  status: 'pending' | 'approved' | 'rejected';
  images?: string[]; // data URLs
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
    addReview: (state, action: PayloadAction<Omit<Review, 'id' | 'createdAt' | 'status'>>) => {
      const review: Review = {
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        status: 'pending',
      };
      state.items.unshift(review);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items.slice(0, 500)));
      } catch {
        // ignore persistence errors (quota, privacy mode)
      }
    },
    approveReview: (state, action: PayloadAction<string>) => {
      const r = state.items.find((i) => i.id === action.payload);
      if (r) r.status = 'approved';
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items.slice(0, 500)));
      } catch {
        // ignore
      }
    },
    rejectReview: (state, action: PayloadAction<string>) => {
      const r = state.items.find((i) => i.id === action.payload);
      if (r) r.status = 'rejected';
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items.slice(0, 500)));
      } catch {
        // ignore
      }
    },
    deleteReview: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((r) => r.id !== action.payload);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items.slice(0, 500)));
      } catch {
        // ignore
      }
    },
  },
});

export const { addReview, approveReview, rejectReview, deleteReview } = reviewsSlice.actions;
export const selectReviewsForProduct = (slug: string) => (state: RootState) =>
  state.reviews.items.filter((r) => r.productSlug === slug && r.status === 'approved');
export const selectAggregateForProduct = (slug: string) => (state: RootState) => {
  const list = state.reviews.items.filter((r) => r.productSlug === slug);
  if (!list.length) return { count: 0, average: 0 };
  const sum = list.reduce((acc, r) => acc + r.rating, 0);
  return { count: list.length, average: sum / list.length };
};

export default reviewsSlice.reducer;
