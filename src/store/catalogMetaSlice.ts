import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CatalogMetaState {
  flowerCategories: string[];
  bouquetCategories: string[];
  tags: string[]; // global tag vocabulary e.g. limited, bestseller, premium, seasonal
  badges: string[]; // product badges like Bestseller, Limited, Premium
}

const LS_KEY = 'pf_catalog_meta_v1';

function loadStored(): CatalogMetaState | null {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(LS_KEY) : null;
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CatalogMetaState;
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}

function persist(state: CatalogMetaState) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    }
  } catch {
    /* ignore */
  }
}

const initialState: CatalogMetaState = loadStored() || {
  flowerCategories: ['Roses', 'Lilies', 'Seasonal', 'Tulips', 'Herbal', 'Orchids'],
  bouquetCategories: ['Romantic', 'Spring', 'Luxury'],
  tags: ['limited', 'bestseller', 'premium', 'romantic', 'spring', 'luxury'],
  badges: ['Bestseller', 'Limited', 'Premium', 'Popular', 'Signature'],
};

const catalogMetaSlice = createSlice({
  name: 'catalogMeta',
  initialState,
  reducers: {
    addFlowerCategory(state, action: PayloadAction<string>) {
      const v = action.payload.trim();
      if (v && !state.flowerCategories.includes(v)) state.flowerCategories.push(v);
      persist(state);
    },
    removeFlowerCategory(state, action: PayloadAction<string>) {
      state.flowerCategories = state.flowerCategories.filter((c) => c !== action.payload);
      persist(state);
    },
    addBouquetCategory(state, action: PayloadAction<string>) {
      const v = action.payload.trim();
      if (v && !state.bouquetCategories.includes(v)) state.bouquetCategories.push(v);
      persist(state);
    },
    removeBouquetCategory(state, action: PayloadAction<string>) {
      state.bouquetCategories = state.bouquetCategories.filter((c) => c !== action.payload);
      persist(state);
    },
    addTag(state, action: PayloadAction<string>) {
      const v = action.payload.trim();
      if (v && !state.tags.includes(v)) state.tags.push(v);
      persist(state);
    },
    removeTag(state, action: PayloadAction<string>) {
      state.tags = state.tags.filter((t) => t !== action.payload);
      persist(state);
    },
    addBadge(state, action: PayloadAction<string>) {
      const v = action.payload.trim();
      if (v && !state.badges.includes(v)) state.badges.push(v);
      persist(state);
    },
    removeBadge(state, action: PayloadAction<string>) {
      state.badges = state.badges.filter((b) => b !== action.payload);
      persist(state);
    },
  },
});

export const {
  addFlowerCategory,
  removeFlowerCategory,
  addBouquetCategory,
  removeBouquetCategory,
  addTag,
  removeTag,
  addBadge,
  removeBadge,
} = catalogMetaSlice.actions;
export default catalogMetaSlice.reducer;
