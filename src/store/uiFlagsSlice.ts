import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIFlagsState {
  flashSaleActive: boolean;
  flashSaleEndsAt: string | null; // ISO timestamp
  flashSaleDiscountPct: number | null; // percentage 5-90
  flashSaleApplyDiscount: boolean; // whether to apply price reduction
  flashSaleLoop: boolean; // auto restart when finished
  flashSaleLastDuration: number | null; // minutes of last scheduled sale
}

const LS_KEY = 'pf_ui_flags_v1';

function loadInitial(): UIFlagsState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as UIFlagsState;
  } catch {
    // ignore parse errors
  }
  return {
    flashSaleActive: false,
    flashSaleEndsAt: null,
    flashSaleDiscountPct: null,
    flashSaleApplyDiscount: true,
    flashSaleLoop: false,
    flashSaleLastDuration: null,
  };
}

function persist(state: UIFlagsState) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    // ignore persistence errors
  }
}

const initialState: UIFlagsState = loadInitial();

const uiFlagsSlice = createSlice({
  name: 'uiFlags',
  initialState,
  reducers: {
    setFlashSaleActive(state, action: PayloadAction<boolean>) {
      state.flashSaleActive = action.payload;
      if (!state.flashSaleActive) {
        state.flashSaleEndsAt = null;
        // keep discount for next time
      }
      persist(state);
    },
    setFlashSaleEndsAt(state, action: PayloadAction<string | null>) {
      state.flashSaleEndsAt = action.payload;
      persist(state);
    },
    scheduleFlashSale(state, action: PayloadAction<{ durationMinutes: number }>) {
      state.flashSaleActive = true;
      const ends = new Date(Date.now() + action.payload.durationMinutes * 60000).toISOString();
      state.flashSaleEndsAt = ends;
      state.flashSaleLastDuration = action.payload.durationMinutes;
      persist(state);
    },
    setFlashSaleDiscountPct(state, action: PayloadAction<number | null>) {
      if (action.payload === null) {
        state.flashSaleDiscountPct = null;
      } else {
        const clamped = Math.max(5, Math.min(90, Math.round(action.payload)));
        state.flashSaleDiscountPct = clamped;
      }
      persist(state);
    },
    setFlashSaleApplyDiscount(state, action: PayloadAction<boolean>) {
      state.flashSaleApplyDiscount = action.payload;
      persist(state);
    },
    setFlashSaleLoop(state, action: PayloadAction<boolean>) {
      state.flashSaleLoop = action.payload;
      persist(state);
    },
  },
});

export const {
  setFlashSaleActive,
  setFlashSaleEndsAt,
  scheduleFlashSale,
  setFlashSaleDiscountPct,
  setFlashSaleApplyDiscount,
  setFlashSaleLoop,
} = uiFlagsSlice.actions;
export default uiFlagsSlice.reducer;
