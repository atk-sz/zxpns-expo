import { theme } from "@/constants/theme";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

type LoaderComponentProps = {};

const LoaderComponent: React.FC<LoaderComponentProps> = () => {
  // get values directly from Redux (rehydrated by redux-persist)
  const user = useSelector((state: any) => state.user);
  //  const rehydrated = useSelector((state: any) => state._persist?.rehydrated);

  useEffect(() => {
    // Add a small delay to ensure Redux has rehydrated
    const timer = setTimeout(() => {
      if (user?.firstName && user.firstName.length > 0) {
        // User exists → navigate to Dev/Home
        router.replace("/Dev");
        // router.replace('Home');
      } else {
        // No user → go to PreScreen
        router.replace("/PreScreen");
      }
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, [user, router]);

  // alternate method - very efficient
  //   useEffect(() => {
  //   if (!rehydrated) return; // wait for redux-persist if you use it

  //   const task = InteractionManager.runAfterInteractions(() => {
  //     if (user?.firstName && user.firstName.length > 0) {
  //       router.replace('Dev');
  //     } else {
  //       router.replace('PreScreen');
  //     }
  //   });

  //   return () => task.cancel();
  // }, [rehydrated, user, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.text}>Flash Screen will come Loading...</Text>
    </View>
  );
};

export default LoaderComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.primary,
  },
  text: {
    marginTop: 15,
    fontSize: 16,
    color: theme.text,
  },
});
