import { ToastProvider } from "@/contexts/toast.context";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "../redux/store";

export default function RootLayout() {
  return (
    <ToastProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </PersistGate>
      </Provider>
    </ToastProvider>
  );
}
