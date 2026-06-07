import { transactionRepo } from "@/be/database/sqlite/transactionRepo";
import { saveCurEvent } from "@/redux/slices/event";
import { RootState } from "@/redux/store";
import {
  ICurEvent,
  IEventTransaction,
  IExpenseEvent,
} from "@/utils/interfaces";
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
  const dispatch = useDispatch();
  const curEvent = useSelector((state: RootState) => state.curEvent);

  const addTransaction = async (newTransaction: IEventTransaction) => {
    const tempCurEvent: ICurEvent = {
      ...curEvent,
      eventDetails: { ...curEvent.eventDetails },
      transactions: [...curEvent.transactions],
    };

    const newTransactionDate = new Date(newTransaction.date);
    const insertIndex = findInsertIndex(
      curEvent.transactions,
      newTransactionDate,
    );

    const tempTransactions = [
      ...curEvent.transactions.slice(0, insertIndex),
      newTransaction,
      ...curEvent.transactions.slice(insertIndex),
    ];

    tempCurEvent.transactions = tempTransactions;

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
    );
    tempCurEvent.eventDetails.balanceAmount = newBalanceAmount;
    tempCurEvent.eventDetails.totalExpense = newOutgoingAmount;
    tempCurEvent.eventDetails.totalIncome = newIncomingAmount;
    dispatch(saveCurEvent(tempCurEvent));
  };

  const getEventTransactions = async (foundEvent: IExpenseEvent) => {
    const transactions = await transactionRepo.getTransactionsByEventId(
      foundEvent.id,
    );
    dispatch(
      saveCurEvent({
        eventDetails: foundEvent,
        transactions: transactions,
      }),
    );
  };

  const deleteTransaction = async (id: string) => {
    const tempCurEvent: ICurEvent = {
      ...curEvent,
      eventDetails: { ...curEvent.eventDetails },
      transactions: [...curEvent.transactions],
    };
    const idx = tempCurEvent.transactions.findIndex((t) => t.id === id);
    if (idx === -1) return;
    tempCurEvent.transactions.splice(idx, 1);
    const { newIncomingAmount, newOutgoingAmount, newBalanceAmount } =
      recalcTotals(tempCurEvent);

    await transactionRepo.removeTransaction(
      id,
      {
        balance: newBalanceAmount,
        expense: newOutgoingAmount,
        income: newIncomingAmount,
      },
      tempCurEvent.eventDetails.id,
    );
    tempCurEvent.eventDetails.balanceAmount = newBalanceAmount;
    tempCurEvent.eventDetails.totalExpense = newOutgoingAmount;
    tempCurEvent.eventDetails.totalIncome = newIncomingAmount;
    dispatch(saveCurEvent(tempCurEvent));
  };

  return { addTransaction, getEventTransactions, deleteTransaction };
};

export default useTransactionsHandler;
