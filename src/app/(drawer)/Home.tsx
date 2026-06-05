import ScreenView from "@/components/generic/ScreenView";
import ExpenseEventsList from "@/components/lists/expense-events-list.component";
import { theme } from "@/constants/theme";
import Icon from "@expo/vector-icons/Ionicons";
import { useNavigation } from "expo-router";
import { DrawerActions } from "expo-router/build/react-navigation";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

const HomeScreen: React.FC = (): React.JSX.Element => {
  const navigation = useNavigation();
  const events = useSelector((state: any) => state.events);

  const { firstName, lastName } = useSelector((state: any) => state.user);

  return (
    <ScreenView>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Icon name="menu" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.greeting}>
          Hi {`${firstName} ${lastName}`}! 👋 Welcome back
        </Text>
        <ExpenseEventsList expenses={events} />
      </View>
    </ScreenView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primary,
    padding: 16,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.text,
    marginBottom: 16,
    lineHeight: 28,
    textAlign: "center",
  },
});
