import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./index";

// here middleware serializableCheck is disabled to avoid unecessary warnings
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
