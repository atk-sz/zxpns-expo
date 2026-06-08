import ScreenView from "@/components/generic/ScreenView";
import { theme } from "@/constants/theme";
import { useLoader } from "@/contexts/loader.context";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// import { testDB } from "@/be/database/supabase/transaction";
import {
  clearAllData,
  getAllTables
} from "@/be/database/sqlite/database";
import { supabase } from "@/configs/supabase.config";
import { useToast } from "@/contexts/toast.context";
import useEventsHandler from "@/hooks/useEvents.hook";
import { signOut } from "@/services/auth.service";
import Icon from "@expo/vector-icons/Ionicons";
import { useNavigation } from "expo-router";
import { DrawerActions } from "expo-router/build/react-navigation";
import { useSQLiteContext } from "expo-sqlite";

const DevScreen: React.FC = (): React.JSX.Element => {
  const { showLoader, hideLoader } = useLoader();
  const navigation = useNavigation();
  const { getAllEvents } = useEventsHandler();
  const { showToast } = useToast();
  const db = useSQLiteContext();

  const showLoaderFn = (): void => {
    showLoader("Brrr...");
    setTimeout(() => {
      hideLoader();
    }, 3000);
  };

  const removeData = async () => {
    try {
      await clearAllData(db);
      console.log("removed all tables");
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
    // testDB();
  };

  const devPress = async () => {
    console.log("clicked devPress");
    try {
      let res = "ntg";
      // await createEventsTable();
      // await createTransactionsTable();
      res = (await getAllTables(db)) as any;
      // res = (await transactionRepo.getAllTransactions()) as any;
      // res = (await eventRepo.getAll()) as any;
      // res = (await transactionRepo.getTransactionsByEventId(
      //   "4e15a577-ccc7-428b-976d-3592e396d4c1",
      // )) as any;
      //  res = await getAllEvents();
      console.log("res");
      console.log(res);
      console.log(res.length);
    } catch (e) {
      console.log(e);
    }
  };

  const checkLogin = async () => {
    console.log("clicked checkLogin");
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;
      if (!session) throw "no session";
      showToast("You are logged in", "success");
      console.log("session");
      console.log("session");
      console.log("session");
      console.log(session);
    } catch (e) {
      console.log(e);
      showToast("You are not logged in", "error");
    }
  };

  const onLogoutPress = async () => {
    console.log("clicked logout");
    try {
      await signOut();
      showToast("Logout successful!", "success");
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
      <TouchableOpacity style={styles.btn} onPress={checkLogin}>
        <Text>Login check</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={onLogoutPress}>
        <Text>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.push("/UpdatePassword")}
      >
        <Text>Update password</Text>
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
