import { configureStore } from '@reduxjs/toolkit';
import timerReducer from './timerSlice';
import flowersReducer from './flowersSlice';
import bouquetsReducer from './bouquetsSlice';
import customBouquetReducer from './customBouquetSlice';
import reviewsReducer from './reviewsSlice';

export const store = configureStore({
  reducer: {
    timer: timerReducer,
    flowers: flowersReducer,
    bouquets: bouquetsReducer,
    customBouquet: customBouquetReducer,
    reviews: reviewsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
