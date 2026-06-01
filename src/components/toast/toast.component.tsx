import { theme } from "@/constants/theme";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, Text } from "react-native";

const screenWidth = Dimensions.get("window").width;

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
}

const ToastComponent: React.FC<ToastProps> = ({ message, type }) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(30)).current;

  const backgroundColor =
    type === "success"
      ? theme.success
      : type === "error"
        ? theme.error
        : theme.info;

  useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate out after 3 seconds
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 30,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }, 2500);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          backgroundColor,
          opacity: opacityAnim,
          transform: [{ translateY: translateYAnim }],
        },
      ]}
    >
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    top: 50,
    left: screenWidth * 0.1,
    width: screenWidth * 0.8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    zIndex: 999,
    alignItems: "center",
  },
  toastText: {
    color: "#fff",
    fontWeight: "500",
    textAlign: "center",
  },
});

export default ToastComponent;
