import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { useLoader } from '../contexts/loader.context';
import ScreenView from "@/components/generic/ScreenView";
import { useTheme } from "@/hooks/useTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DevScreen: React.FC = (): React.JSX.Element => {
  const styles = useStyles();
  //   const { showLoader, hideLoader } = useLoader();

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
    // showLoader('Brrr...');
    setTimeout(() => {
      //   hideLoader();
    }, 3000);
  };

  const removeData = async () => {
    try {
      await AsyncStorage.clear();
      console.log("AsyncStorage cleared!");
      //   navigation.replace('PreScreen');
    } catch (e) {
      console.error("Failed to clear storage:", e);
    }
  };

  const goToHome = (): void => {
    navigation.navigate("Home");
  };

  const goToLogin = (): void => {
    navigation.navigate("Login");
  };

  const goToProfile = (): void => {
    navigation.navigate("Profile");
  };

  return (
    <ScreenView>
      <Text style={styles.text}>Dev Screen</Text>
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
    </ScreenView>
  );
};

const useStyles = () => {
  const theme = useTheme();

  return React.useMemo(
    () =>
      StyleSheet.create({
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
      }),
    [theme],
  );
};

export default DevScreen;
