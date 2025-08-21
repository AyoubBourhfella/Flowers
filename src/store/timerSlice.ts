import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Tracks precise timings for loading and hero display without estimation
export interface TimerState {
  appStart: number | null; // performance.now() at app start
  loadingStart: number | null;
  loadingEnd: number | null;
  contentShown: number | null; // when main content is revealed
}

const initialState: TimerState = {
  appStart: typeof performance !== 'undefined' ? performance.now() : null,
  loadingStart: null,
  loadingEnd: null,
  contentShown: null,
};

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    markAppStart(state, action: PayloadAction<number | undefined>) {
      state.appStart =
        action.payload ?? (typeof performance !== 'undefined' ? performance.now() : Date.now());
    },
    markLoadingStart(state, action: PayloadAction<number | undefined>) {
      state.loadingStart =
        action.payload ?? (typeof performance !== 'undefined' ? performance.now() : Date.now());
    },
    markLoadingEnd(state, action: PayloadAction<number | undefined>) {
      state.loadingEnd =
        action.payload ?? (typeof performance !== 'undefined' ? performance.now() : Date.now());
    },
    markContentShown(state, action: PayloadAction<number | undefined>) {
      state.contentShown =
        action.payload ?? (typeof performance !== 'undefined' ? performance.now() : Date.now());
    },
    resetTimers() {
      return initialState;
    },
  },
});

export const { markAppStart, markLoadingStart, markLoadingEnd, markContentShown, resetTimers } =
  timerSlice.actions;
export default timerSlice.reducer;
