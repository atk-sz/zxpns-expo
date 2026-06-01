import { configureStore } from '@reduxjs/toolkit';
import persistedReducer from '.';
import { persistStore } from 'redux-persist';

// here middleware serializableCheck is disabled to avoid unecessary warnings
const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export default store;
