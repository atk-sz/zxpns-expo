import { transactionRepo } from "@/be/database/sqlite/transactionRepo";
import { saveCurEvent } from "@/redux/slices/event";
import { RootState } from "@/redux/store";
import {
  ICurEvent,
  IEventTransaction,
  IExpenseEvent,
} from "@/utils/interfaces";
import {
  computeRunningBalances,
  recomputeFromIndex,
} from "@/utils/transactions";
import { useSQLiteContext } from "expo-sqlite";
import { useDispatch, useSelector } from "react-redux";

const findInsertIndex = (
  transactions: IEventTransaction[],
  newDate: Date,
): number => {
  let index = 0;
  for (let i = 0; i < transactions.length; i++) {
    if (newDate >= new Date(transactions[i].date)) {
      index = i + 1;
    } else {
      break;
    }
  }
  return index;
};

const recalcTotals = (
  state: ICurEvent,
): {
  newIncomingAmount: string;
  newOutgoingAmount: string;
  newBalanceAmount: string;
} => {
  const incoming = state.transactions
    .filter((t) => t.type === "incoming")
    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

  const outgoing = state.transactions
    .filter((t) => t.type === "outgoing")
    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

  return {
    newIncomingAmount: incoming.toString(),
    newOutgoingAmount: outgoing.toString(),
    newBalanceAmount: (incoming - outgoing).toString(),
  };
};

const useTransactionsHandler = () => {
  const db = useSQLiteContext();
  const dispatch = useDispatch();
  const curEvent = useSelector((state: RootState) => state.curEvent);

  const addTransaction = async (newTransaction: IEventTransaction) => {
    // re-initialise a copy of current event
    const tempCurEvent: ICurEvent = {
      ...curEvent,
      eventDetails: { ...curEvent.eventDetails },
      transactions: [...curEvent.transactions],
    };

    // find insert index based on date
    const newTransactionDate = new Date(newTransaction.date);
    const insertIndex = findInsertIndex(
      curEvent.transactions,
      newTransactionDate,
    );

    // create a temp copy of transactions to calculate balances for event(balanceAmountNow is only for curEvent)
    const tempTransactions = [
      ...curEvent.transactions.slice(0, insertIndex),
      { ...newTransaction, balanceAmountNow: 0 },
      ...curEvent.transactions.slice(insertIndex),
    ];

    // update transactions with new balances for current event to diplay
    const tempTransactionsWithBalance = recomputeFromIndex(
      tempTransactions,
      insertIndex,
    );
    tempCurEvent.transactions = tempTransactionsWithBalance;

    // recompute totals for current event & DB
    const { newIncomingAmount, newOutgoingAmount, newBalanceAmount } =
      recalcTotals(tempCurEvent);
    // DB action
    await transactionRepo.create(
      newTransaction,
      {
        balance: newBalanceAmount,
        expense: newOutgoingAmount,
        income: newIncomingAmount,
      },
      tempCurEvent.eventDetails.id,
      db,
    );
    // since DB action is completed without error, update current event with new totals
    tempCurEvent.eventDetails.balanceAmount = newBalanceAmount;
    tempCurEvent.eventDetails.totalExpense = newOutgoingAmount;
    tempCurEvent.eventDetails.totalIncome = newIncomingAmount;
    dispatch(saveCurEvent(tempCurEvent));
  };

  const getEventTransactions = async (foundEvent: IExpenseEvent) => {
    // get transactions for current event from DB
    const transactions = await transactionRepo.getTransactionsByEventId(
      foundEvent.id,
      db,
    );
    // updated transactions with running balances
    const transactionsWithBalance = computeRunningBalances(transactions);
    dispatch(
      saveCurEvent({
        eventDetails: foundEvent,
        transactions: transactionsWithBalance,
      }),
    );
  };

  const deleteTransaction = async (id: string) => {
    // initialise a copy of current event
    const tempCurEvent: ICurEvent = {
      ...curEvent,
      eventDetails: { ...curEvent.eventDetails },
      transactions: [...curEvent.transactions],
    };
    // find index of transaction to delete
    const idx = tempCurEvent.transactions.findIndex((t) => t.id === id);
    if (idx === -1) return;

    // delete transaction from copy of current event & recompute balances & again update the copy of current event
    tempCurEvent.transactions.splice(idx, 1);
    const tempTransactionsWithBalance = recomputeFromIndex(
      tempCurEvent.transactions,
      idx,
    );
    tempCurEvent.transactions = tempTransactionsWithBalance;

    // recompute totals from copy of current event to update both DB & current event
    const { newIncomingAmount, newOutgoingAmount, newBalanceAmount } =
      recalcTotals(tempCurEvent);

    // DB action
    await transactionRepo.removeTransaction(
      id,
      {
        balance: newBalanceAmount,
        expense: newOutgoingAmount,
        income: newIncomingAmount,
      },
      tempCurEvent.eventDetails.id,
      db,
    );
    // since DB action is completed without error, update current event with latest totals
    tempCurEvent.eventDetails.balanceAmount = newBalanceAmount;
    tempCurEvent.eventDetails.totalExpense = newOutgoingAmount;
    tempCurEvent.eventDetails.totalIncome = newIncomingAmount;
    dispatch(saveCurEvent(tempCurEvent));
  };

  return {
    addTransaction,
    getEventTransactions,
    deleteTransaction,
  };
};

export default useTransactionsHandler;
