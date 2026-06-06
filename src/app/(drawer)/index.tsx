import ScreenView from "@/components/generic/ScreenView";
import { theme } from "@/constants/theme";
import { useLoader } from "@/contexts/loader.context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import {
  createTransactionsTable
} from "@/be/database/sqlite/database";
import { testDB } from "@/be/database/supabase/transaction";
import useEventsHandler from "@/hooks/useEvents.hook";
import Icon from "@expo/vector-icons/Ionicons";
import { useNavigation } from "expo-router";
import { DrawerActions } from "expo-router/build/react-navigation";

const DevScreen: React.FC = (): React.JSX.Element => {
  const { showLoader, hideLoader } = useLoader();
  const navigation = useNavigation();
  const { getAllEvents } = useEventsHandler();

  // to acces data from async storage
  // const loadUser = async () => {
  //   try {
  //     const persistedState = await AsyncStorage.getItem('persist:root');
  //     console.log('persistedState', persistedState);
  //     if (persistedState) {
  //       const parsedState = JSON.parse(persistedState);
  //       console.log('parsedState', parsedState);

  //       // user slice is stringified JSON, so parse it again
  //       const userState = JSON.parse(parsedState.user);
  //       console.log('userState', userState);
  //       // setUser(userState)
  //     }
  //   } catch (err) {
  //     console.error('Error loading user:', err);
  //   }
  // };

  const showLoaderFn = (): void => {
    showLoader("Brrr...");
    setTimeout(() => {
      hideLoader();
    }, 3000);
  };

  const removeData = async () => {
    try {
      await AsyncStorage.clear();
      // router.replace("/PreScreen");
    } catch (e) {
      console.error("Failed to clear storage:", e);
    }
  };

  const goToHome = (): void => {
    router.push("/Home");
  };

  const goToLogin = (): void => {
    router.push("/Login");
  };

  const goToProfile = (): void => {
    console.log("clicked");
    testDB();
  };

  const devPress = async () => {
    console.log("clicked devPress");
    try {
      const res = await createTransactionsTable();
      // const res = await getDb();
      // const res = await getAllExpenseEvents();
      console.log("res");
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ScreenView>
      <Text style={styles.text}>Dev Screen</Text>
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      >
        <Icon name="menu" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.container1}>
        <TouchableOpacity style={styles.btn} onPress={showLoaderFn}>
          <Text>Show Loading</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={removeData}>
          <Text>Remove Data</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.btn} onPress={goToHome}>
        <Text>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={goToProfile}>
        <Text>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={goToLogin}>
        <Text>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={devPress}>
        <Text>Create DB/Table</Text>
      </TouchableOpacity>
    </ScreenView>
  );
};

export default DevScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  text: {
    fontSize: 30,
    color: theme.text,
  },
  container1: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  btn: {
    backgroundColor: "#00ff00",
    margin: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
