import { theme } from "@/constants/theme";
import { formatDateLong, truncateText } from "@/utils/common.util";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IExpenseEvent } from "../../utils/interfaces";

interface IExpenseItemProps {
  item: IExpenseEvent;
  onEventPress: (event: IExpenseEvent) => void;
  handleEditEvent: (eventId: string) => void;
  handleDeleteEvent: (eventId: string) => void;
}

const ExpenseItemComponent: React.FC<IExpenseItemProps> = ({
  item,
  onEventPress,
  handleDeleteEvent,
  handleEditEvent,
}) => {
  return (
    <TouchableOpacity
      style={styles.expenseItem}
      onPress={() => {
        onEventPress(item);
      }}
    >
      <View style={styles.expenseContent}>
        <View style={styles.expenseInfo}>
          <Text style={styles.expenseTitle}>
            {truncateText(item.title, 15)}
          </Text>
          <Text style={styles.expenseDate}>
            {formatDateLong(item.startDate)}
          </Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleEditEvent(item.id)}
          >
            <Icon name="pencil" size={20} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={() => handleDeleteEvent(item.id)}
          >
            <Icon name="delete" size={20} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ExpenseItemComponent;

const styles = StyleSheet.create({
  expenseItem: {
    backgroundColor: theme.secondary,
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  expenseContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    color: theme.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  expenseDate: {
    color: theme.text,
    fontSize: 14,
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionBtn: {
    padding: 8,
    borderRadius: 6,
  },
  deleteBtn: {},
});
