import { configureStore } from '@reduxjs/toolkit';
import timerReducer from './timerSlice';
import flowersReducer from './flowersSlice';
import bouquetsReducer from './bouquetsSlice';
import customBouquetReducer from './customBouquetSlice';
import reviewsReducer from './reviewsSlice';
import catalogMetaReducer from './catalogMetaSlice';
import uiFlagsReducer from './uiFlagsSlice';

export const store = configureStore({
  reducer: {
    timer: timerReducer,
    flowers: flowersReducer,
    bouquets: bouquetsReducer,
    customBouquet: customBouquetReducer,
    reviews: reviewsReducer,
    catalogMeta: catalogMetaReducer,
    uiFlags: uiFlagsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
