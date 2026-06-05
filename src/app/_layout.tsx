import DrawerContent from "@/components/generic/DrawerContent";
import LoadingComponent from "@/components/loader/loading.component";
import { theme } from "@/constants/theme";
import { LoaderProvider } from "@/contexts/loader.context";
import { ToastProvider } from "@/contexts/toast.context";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "../redux/store";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LoaderProvider>
        <ToastProvider>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <Drawer
                drawerContent={(props) => <DrawerContent {...props} />}
                screenOptions={{
                  headerShown: false,
                  drawerPosition: "left",
                  swipeEdgeWidth: 0,
                  // drawerType: "slide",
                  drawerStyle: {
                    backgroundColor: theme.dark,
                    width: 280,
                  },
                  overlayColor: "rgba(0,0,0,0.6)",
                  drawerContentStyle: { backgroundColor: theme.dark },
                }}
              >
                <Drawer.Screen name="index" />
              </Drawer>
            </PersistGate>
          </Provider>
        </ToastProvider>
        <LoadingComponent />
      </LoaderProvider>
    </GestureHandlerRootView>
  );
}
