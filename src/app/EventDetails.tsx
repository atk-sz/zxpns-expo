import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  IEventTransaction,
  IEventTransactionWithBalance,
  ITransactionsCount,
} from "../utils/interfaces";

import EventTransactionForm from "@/components/forms/event-transaction-form.component";
import ScreenView from "@/components/generic/ScreenView";
import TransactionItemComponent from "@/components/list-items/TransactionItem.component";
import { theme } from "@/constants/theme";
import useTransactionsHandler from "@/hooks/useTransactions.hook";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../contexts/toast.context";
import { saveCurTransaction } from "../redux/slices/transaction";
import { RootState } from "../redux/store";
import {
  formatAmount,
  getCountOfTransactions,
  getTypeColor,
} from "../utils/common.util";

const EventDetailsScreen: React.FC = () => {
  const { id } = useLocalSearchParams();
  const { showToast } = useToast();
  const { addTransaction } = useTransactionsHandler();
  const insets = useSafeAreaInsets();
  const curEvent = useSelector((state: RootState) => state.curEvent);
  const [showForm, setShowForm] = useState(false);
  const [transactionsCount, setTransactionsCount] =
    useState<ITransactionsCount>({
      incoming: 0,
      outgoing: 0,
      item: 0,
      total: 0,
    });
  const dispatch = useDispatch();

  const handleNewTransactionSubmit = async (
    newTransaction: IEventTransaction,
  ) => {
    try {
      await addTransaction(newTransaction);
      setShowForm(false);
      showToast("Transaction added successfully!", "success");
    } catch (error) {
      console.log("failed to add transaction", error);
      showToast("Failed to add transaction", "error");
    }
  };

  const handleTransactionPress = (transaction: IEventTransaction) => {
    dispatch(saveCurTransaction(transaction));
    router.push({
      pathname: "/TransactionDetails",
      params: {
        transactionId: transaction.id,
        eventId: id,
      },
    });
  };

  const handleEventDetailsPress = () => {
    router.push({
      pathname: "/EventInfo",
      params: { id },
    });
  };

  const renderTransactionItem = ({
    item,
  }: {
    item: IEventTransactionWithBalance;
  }) => (
    <TransactionItemComponent item={item} onPress={handleTransactionPress} />
  );

  useEffect(() => {
    const counts: ITransactionsCount = getCountOfTransactions(
      curEvent.transactions,
    );
    setTransactionsCount(counts);
  }, [curEvent.transactions]);

  return (
    <ScreenView>
      <View style={styles.container}>
        <Text style={styles.title}>
          {curEvent?.eventDetails?.title || "Event Details"}
        </Text>

        <View style={styles.row}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Income</Text>
            <Text style={[styles.cardValue, styles.incomeText]}>
              {formatAmount(curEvent.eventDetails.totalIncome)}
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Expense</Text>
            <Text style={[styles.cardValue, styles.expenseText]}>
              {formatAmount(curEvent.eventDetails.totalExpense)}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.card, styles.balanceCard]}>
            <Text style={styles.cardLabel}>Balance</Text>
            <Text style={[styles.cardValue, styles.balanceText]}>
              {formatAmount(curEvent.eventDetails.balanceAmount)}
            </Text>
          </View>
        </View>

        {/* Transactions List */}
        <View style={styles.transactionsContainer}>
          <View style={styles.transactionsHeaderContainer}>
            <Text style={styles.transactionsTitle}>
              All Transactions({transactionsCount.total}){" "}
            </Text>
            <View style={styles.transactionsSubTitle}>
              <View style={styles.transactionsCounts}>
                <Icon
                  name="arrow-up-thin"
                  size={20}
                  color={getTypeColor("incoming")}
                />
                <Text style={[{ color: getTypeColor("incoming") }]}>
                  {transactionsCount.incoming}
                </Text>
              </View>
              <View style={styles.transactionsCounts}>
                <Icon
                  name="arrow-down-thin"
                  size={20}
                  color={getTypeColor("outgoing")}
                />
                <Text style={[{ color: getTypeColor("outgoing") }]}>
                  {transactionsCount.outgoing}
                </Text>
              </View>
              <View style={styles.transactionsCounts}>
                <Icon
                  name="arrow-up-down"
                  size={17}
                  color={getTypeColor("item")}
                />
                <Text style={[{ color: getTypeColor("item") }]}>
                  {formatAmount(`${transactionsCount.item}`)}
                </Text>
              </View>
            </View>
          </View>
          <FlatList
            data={[...curEvent.transactions].reverse()}
            renderItem={renderTransactionItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.transactionsList}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </View>

      {/* Event Details FAB - Left side */}
      <TouchableOpacity
        style={[
          styles.fab,
          styles.eventDetailsFab,
          {
            bottom: insets.bottom + 20,
            left: 20,
            backgroundColor: theme.info,
          },
        ]}
        onPress={handleEventDetailsPress}
      >
        <Icon name="information" size={30} color={theme.text} />
      </TouchableOpacity>

      {/* Add Transaction FAB - Right side */}
      <TouchableOpacity
        style={[
          styles.fab,
          {
            bottom: insets.bottom + 20,
            right: 20,
            backgroundColor: theme.secondary,
          },
        ]}
        onPress={() => setShowForm(true)}
      >
        <Icon name="plus" size={45} color={theme.text} />
      </TouchableOpacity>

      <EventTransactionForm
        visible={showForm}
        eventId={id as string}
        onClose={() => setShowForm(false)}
        onSubmit={handleNewTransactionSubmit}
      />
    </ScreenView>
  );
};

export default EventDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primary,
    padding: 16,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: theme.text,
    textTransform: "uppercase",
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  card: {
    flex: 1,
    backgroundColor: theme.darkGrey,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: "center",
    elevation: 3,
    shadowColor: theme.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  balanceCard: {
    marginHorizontal: 8,
  },
  cardLabel: {
    fontSize: 14,
    color: theme.lightGrey,
    marginBottom: 8,
    fontWeight: "500",
  },
  cardValue: {
    fontSize: 21,
    fontWeight: "bold",
  },
  incomeText: {
    color: theme.success,
  },
  expenseText: {
    color: theme.error,
  },
  balanceText: {
    color: theme.info,
    fontSize: 24,
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: theme.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  eventDetailsFab: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  // Transaction List Styles
  transactionsContainer: {
    flex: 1,
    width: "100%",
    marginTop: 10,
  },
  transactionsHeaderContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingLeft: 4,
  },
  transactionsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.text,
  },
  transactionsSubTitle: {
    flexDirection: "row",
  },
  transactionsCounts: {
    flexDirection: "row",
    alignItems: "center",
  },
  transactionsList: {
    paddingBottom: 100, // Extra space for FAB !IMPORTANT
  },
  balanceAmount: {
    fontSize: 14,
    color: theme.info,
    fontWeight: "600",
  },
  separator: {
    height: 12,
  },
});
