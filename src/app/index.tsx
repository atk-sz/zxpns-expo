import ScreenView from "@/components/generic/ScreenView";
import { StyleSheet, Text } from "react-native";

export default function Index() {
  return (
    <ScreenView>
      <Text style={styles.container}>
        Edit src/app/index.tsx to edit this screen.
      </Text>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
