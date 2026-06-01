import LoadingComponent from "@/components/loader/loading.component";
import { theme } from "@/constants/theme";
import { LoaderProvider } from "@/contexts/loader.context";
import { ToastProvider } from "@/contexts/toast.context";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "../redux/store";

export default function RootLayout() {
  return (
    <LoaderProvider>
      <ToastProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: theme.primary },
              }}
            />
          </PersistGate>
        </Provider>
      </ToastProvider>
      <LoadingComponent />
    </LoaderProvider>
  );
}
