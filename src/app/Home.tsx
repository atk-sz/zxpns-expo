import ScreenView from "@/components/generic/ScreenView";
import ExpenseEventsList from "@/components/lists/expense-events-list.component";
import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

const HomeScreen: React.FC = (): React.JSX.Element => {
  const styles = useStyles();
  const events = useSelector((state: any) => state.events);
  const { firstName, lastName } = useSelector((state: any) => state.user);

  return (
    <ScreenView>
      <View style={styles.container}>
        <Text style={styles.greeting}>
          Hi {`${firstName} ${lastName}`}! 👋 Welcome back
        </Text>
        <ExpenseEventsList expenses={events} />
      </View>
    </ScreenView>
  );
};

export default HomeScreen;

const useStyles = () => {
  const theme = useTheme();

  return React.useMemo(
    () =>
      StyleSheet.create({
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
      }),
    [theme],
  );
};
