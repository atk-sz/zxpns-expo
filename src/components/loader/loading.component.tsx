import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useLoader } from "../../contexts/loader.context";

const LoadingComponent: React.FC = () => {
  const styles = useStyles();
  const theme = useTheme();
  const { loading, message } = useLoader();

  if (!loading) return null;

  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color={theme.secondary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

export default LoadingComponent;

const useStyles = () => {
  const theme = useTheme();

  return React.useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          ...StyleSheet.absoluteFill,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        },
        text: {
          marginTop: 12,
          color: theme.text,
        },
      }),
    [theme],
  );
};
