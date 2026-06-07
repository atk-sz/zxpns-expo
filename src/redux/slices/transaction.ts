import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IEventTransactionWithBalance } from "../../utils/interfaces";

const initialState: IEventTransactionWithBalance = {
  id: "",
  amount: "",
  balanceAmountNow: 0,
  type: "incoming",
  description: "",
  date: "",
  eventId: "",
  synced: false,
};

const curTransactionSlice = createSlice({
  name: "curTransaction",
  initialState,
  reducers: {
    saveCurTransaction: (
      _,
      action: PayloadAction<IEventTransactionWithBalance>,
    ) => action.payload,
    clearCurTransaction: () => initialState,
  },
});

export const { saveCurTransaction, clearCurTransaction } =
  curTransactionSlice.actions;
export default curTransactionSlice.reducer;
