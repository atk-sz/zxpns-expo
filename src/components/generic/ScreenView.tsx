import { theme } from "@/constants/theme";
import React, { ReactNode } from "react";
import {
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";

type ScreenViewProps = {
  children: ReactNode;
};

const ScreenView: React.FC<ScreenViewProps> = ({ children }) => {
  const topPadding =
    Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) : 0;
  const { width } = Dimensions.get("window");
  const horizontalPadding = width * 0.05;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: topPadding, paddingHorizontal: horizontalPadding },
      ]}
    >
      {children}
    </View>
  );
};

export default ScreenView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primary,
  },
  title: {
    color: theme.text,
  },
});
