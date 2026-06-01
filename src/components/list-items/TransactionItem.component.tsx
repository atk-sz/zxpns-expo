import { theme } from "@/constants/theme";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import {
  formatAmount,
  formatDate,
  getTypeColor,
  getTypeIcon,
} from "../../utils/common.util";
import { IEventTransaction } from "../../utils/interfaces";

interface ITransactionItemProps {
  item: IEventTransaction;
  onPress: (transaction: IEventTransaction) => void;
}

const TransactionItemComponent: React.FC<ITransactionItemProps> = ({
  item,
  onPress,
}) => {
  const scaleAnim = new Animated.Value(1);
  const opacityAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 300,
        friction: 8,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.7,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 8,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Pressable
      onPress={() => onPress(item)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.transactionItem,
          {
            backgroundColor: getTypeColor(item.type) + "20",
            borderLeftColor: getTypeColor(item.type),
            borderLeftWidth: 4,
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        {/* Row 1: Icon and Amount */}
        <View style={styles.row1}>
          <Icon
            name={getTypeIcon(item.type)}
            size={24}
            color={getTypeColor(item.type)}
          />
          <Text style={[styles.amountText, { color: getTypeColor(item.type) }]}>
            {formatAmount(item.amount)}
          </Text>
        </View>

        {/* Row 2: Item details OR Description */}
        <View style={styles.row2}>
          {item.type === "item" ? (
            <View style={styles.itemDetails}>
              {item.itemName && (
                <Text style={styles.itemName}>Item: {item.itemName}</Text>
              )}
              {item.worth && (
                <Text style={styles.itemWorth}>
                  Worth: {formatAmount(item.worth)}
                </Text>
              )}
            </View>
          ) : (
            <>
              {item.description && (
                <Text
                  style={styles.description}
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
                  {item.description}
                </Text>
              )}
            </>
          )}
        </View>

        {/* Row 3: DateTime and Balance Amount */}
        <View style={styles.row3}>
          <Text style={styles.dateTime}>{formatDate(item.date)}</Text>
          <Text style={styles.dateTime}>
            Bal: {formatAmount(item.balanceAmountNow)}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default TransactionItemComponent;

const styles = StyleSheet.create({
  transactionItem: {
    backgroundColor: theme.darkGrey,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    position: "relative",
  },
  row1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  amountText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  row2: {
    marginBottom: 12,
  },
  itemDetails: {
    flexDirection: "column",
  },
  itemName: {
    fontSize: 14,
    color: theme.text,
    fontWeight: "500",
    marginBottom: 4,
  },
  itemWorth: {
    fontSize: 14,
    color: theme.text,
    fontWeight: "500",
  },
  description: {
    fontSize: 14,
    color: theme.text,
    fontStyle: "italic",
  },
  row3: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.lightGrey + "30",
  },
  dateTime: {
    fontSize: 12,
    color: theme.lightGrey,
  },
});
