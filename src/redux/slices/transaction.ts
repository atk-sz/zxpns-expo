import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IEventTransaction } from '../../utils/interfaces';

const initialState: IEventTransaction = {
  id: '',
  amount: '',
  balanceAmountNow: '',
  type: 'incoming',
  description: '',
  date: '',
  eventId: '',
};

const curTransactionSlice = createSlice({
  name: 'curTransaction',
  initialState,
  reducers: {
    saveCurTransaction: (state, action: PayloadAction<IEventTransaction>) =>
      action.payload,
    clearCurTransaction: () => initialState,
  },
});

export const { saveCurTransaction, clearCurTransaction } =
  curTransactionSlice.actions;
export default curTransactionSlice.reducer;
