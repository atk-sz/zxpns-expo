import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IEventTransaction, IExpenseEvent } from "../../utils/interfaces";

type ICurEvent = {
  eventDetails: IExpenseEvent;
  transactions: IEventTransaction[];
};

const initialState: ICurEvent = {
  eventDetails: {
    id: "",
    title: "",
    startDate: "",
    isMultiDay: false,
    isGroupEvent: false,
    balanceAmount: "0",
    incomingAmount: "0",
    outgoingAmount: "0",
    endDate: "",
    open: true,
    synced: false,
  },
  transactions: [],
};

// 🔹 Utility: Recalculate overall totals
const recalcTotals = (state: ICurEvent) => {
  const incoming = state.transactions
    .filter((t) => t.type === "incoming")
    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

  const outgoing = state.transactions
    .filter((t) => t.type === "outgoing")
    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

  state.eventDetails.incomingAmount = incoming.toString();
  state.eventDetails.outgoingAmount = outgoing.toString();
  state.eventDetails.balanceAmount = (incoming - outgoing).toString();
};

// 🔹 Utility: Recalculate balanceAmountNow for all transactions
const recalcRunningBalances = (state: ICurEvent) => {
  let runningBalance = 0;

  state.transactions.forEach((t) => {
    const amt = parseFloat(t.amount.toString());

    if (t.type === "incoming") {
      runningBalance += amt;
    } else {
      runningBalance -= amt;
    }

    t.balanceAmountNow = runningBalance.toString();
  });
};

// 🔹 Utility: Find correct insert index by date
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

const curEventSlice = createSlice({
  name: "curEvent",
  initialState,
  reducers: {
    saveCurEvent: (_, action: PayloadAction<ICurEvent>) => action.payload,
    clearCurEvent: () => initialState,
    addTransactionToCurEvent: (
      state,
      action: PayloadAction<IEventTransaction>,
    ) => {
      const newTransaction = { ...action.payload };
      const newTransactionDate = new Date(newTransaction.date);

      // Find correct insert index
      const insertIndex = findInsertIndex(
        state.transactions,
        newTransactionDate,
      );

      // Insert at calculated index
      state.transactions.splice(insertIndex, 0, newTransaction);

      // Recalculate everything
      recalcTotals(state);
      recalcRunningBalances(state);
    },

    deleteTransactionFromCurEvent: (state, action: PayloadAction<string>) => {
      const idx = state.transactions.findIndex((t) => t.id === action.payload);
      if (idx === -1) return;

      state.transactions.splice(idx, 1);

      recalcTotals(state);
      recalcRunningBalances(state);
    },

    updateTransactionInCurEvent: (
      state,
      action: PayloadAction<{
        id: string;
        updatedTransaction: Partial<IEventTransaction>;
      }>,
    ) => {
      const { id, updatedTransaction } = action.payload;
      const idx = state.transactions.findIndex((t) => t.id === id);
      if (idx === -1) return;

      Object.assign(state.transactions[idx], updatedTransaction);

      recalcTotals(state);
      recalcRunningBalances(state);
    },
  },
});

export const {
  saveCurEvent,
  clearCurEvent,
  addTransactionToCurEvent,
  deleteTransactionFromCurEvent,
  updateTransactionInCurEvent,
} = curEventSlice.actions;

export default curEventSlice.reducer;
