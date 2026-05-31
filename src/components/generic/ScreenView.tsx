import { useTheme } from "@/hooks/useTheme";
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
  const styles = useStyles();

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

const useStyles = () => {
  const theme = useTheme();

  return React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.primary,
        },
        title: {
          color: theme.text,
        },
      }),
    [theme],
  );
};
