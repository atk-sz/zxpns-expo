import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICurEvent } from "../../utils/interfaces";

const initialState: ICurEvent = {
  eventDetails: {
    id: "",
    title: "",
    startDate: "",
    isMultiDay: false,
    isGroupEvent: false,
    balanceAmount: "0",
    totalIncome: "0",
    totalExpense: "0",
    endDate: "",
    eventId: "",
    synced: false,
  },
  transactions: [],
};

const curEventSlice = createSlice({
  name: "curEvent",
  initialState,
  reducers: {
    saveCurEvent: (_, action: PayloadAction<ICurEvent>) => action.payload,
    clearCurEvent: () => initialState,
  },
});

export const { saveCurEvent, clearCurEvent } = curEventSlice.actions;

export default curEventSlice.reducer;
