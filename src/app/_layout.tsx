import LoadingComponent from "@/components/loader/loading.component";
import { theme } from "@/constants/theme";
import { LoaderProvider } from "@/contexts/loader.context";
import { ToastProvider } from "@/contexts/toast.context";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import store from "../redux/store";

export default function RootLayout() {
  return (
    <LoaderProvider>
      <ToastProvider>
        <Provider store={store}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: theme.primary },
            }}
          >
            <Stack.Screen name="(drawer)" />
          </Stack>
        </Provider>
      </ToastProvider>
      <LoadingComponent />
    </LoaderProvider>
  );
}
