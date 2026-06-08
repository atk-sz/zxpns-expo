import { initializeDB } from "@/be/database/sqlite/database";
import LoadingComponent from "@/components/loader/loading.component";
import { theme } from "@/constants/theme";
import { LoaderProvider } from "@/contexts/loader.context";
import { ToastProvider } from "@/contexts/toast.context";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { Provider } from "react-redux";
import store from "../redux/store";

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="zxpense.db" onInit={initializeDB}>
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
    </SQLiteProvider>
  );
}
