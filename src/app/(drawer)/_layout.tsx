import DrawerContent from "@/components/generic/DrawerContent";
import { theme } from "@/constants/theme";
import { Drawer } from "expo-router/drawer";

export default function RootLayout() {
  return (
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
      <Drawer.Screen name="Home" />
    </Drawer>
  );
}
