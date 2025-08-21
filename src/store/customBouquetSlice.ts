import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import type { FlowerItem } from './flowersSlice';
import type { RootState } from '.';

export interface CustomStem {
  id: string; // flower id
  title: string;
  image: string;
  price: number; // per stem price (derived from flower price / base factor)
  quantity: number;
}

export interface CustomBouquet {
  id: string;
  name: string;
  stems: CustomStem[];
  totalPrice: number;
  createdAt: string;
}

interface BuilderState {
  name: string;
  stems: CustomStem[];
}

interface CustomBouquetState {
  builder: BuilderState;
  saved: CustomBouquet[];
}

const initialState: CustomBouquetState = {
  builder: { name: '', stems: [] },
  saved: [],
};

function computeTotal(stems: CustomStem[]) {
  return stems.reduce((sum, s) => sum + s.price * s.quantity, 0);
}

const customBouquetSlice = createSlice({
  name: 'customBouquet',
  initialState,
  reducers: {
    setName(state, action: PayloadAction<string>) {
      state.builder.name = action.payload;
    },
    addStem(state, action: PayloadAction<{ flower: FlowerItem }>) {
      const { flower } = action.payload;
      const existing = state.builder.stems.find((s) => s.id === flower.id);
      // Derive a per stem price heuristic: base price / 8 (approx stems per arrangement) rounded to 2 decimals
      const perStem = Number((flower.price / 8).toFixed(2));
      if (existing) {
        existing.quantity += 1;
      } else {
        state.builder.stems.push({
          id: flower.id,
          title: flower.title,
          image: flower.image,
          price: perStem,
          quantity: 1,
        });
      }
    },
    decrementStem(state, action: PayloadAction<{ id: string }>) {
      const stem = state.builder.stems.find((s) => s.id === action.payload.id);
      if (!stem) return;
      stem.quantity -= 1;
      if (stem.quantity <= 0) {
        state.builder.stems = state.builder.stems.filter((s) => s.id !== stem.id);
      }
    },
    setStemQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const stem = state.builder.stems.find((s) => s.id === action.payload.id);
      if (!stem) return;
      stem.quantity = Math.max(0, Math.min(99, action.payload.quantity));
      if (stem.quantity === 0) {
        state.builder.stems = state.builder.stems.filter((s) => s.id !== stem.id);
      }
    },
    resetBuilder(state) {
      state.builder = { name: '', stems: [] };
    },
    saveCurrent(state) {
      if (state.builder.stems.length === 0) return;
      const total = computeTotal(state.builder.stems);
      const bouquet: CustomBouquet = {
        id: nanoid(),
        name: state.builder.name || 'Custom Bouquet',
        stems: JSON.parse(JSON.stringify(state.builder.stems)),
        totalPrice: Number(total.toFixed(2)),
        createdAt: new Date().toISOString(),
      };
      state.saved.unshift(bouquet);
      state.builder = { name: '', stems: [] };
    },
    deleteSaved(state, action: PayloadAction<{ id: string }>) {
      state.saved = state.saved.filter((b) => b.id !== action.payload.id);
    },
  },
});

export const {
  setName,
  addStem,
  decrementStem,
  setStemQuantity,
  resetBuilder,
  saveCurrent,
  deleteSaved,
} = customBouquetSlice.actions;
export default customBouquetSlice.reducer;

// Selectors
export const selectBuilder = (s: RootState) => s.customBouquet.builder;
export const selectSavedBouquets = (s: RootState) => s.customBouquet.saved;
export const selectBuilderTotal = (s: RootState) => computeTotal(s.customBouquet.builder.stems);
