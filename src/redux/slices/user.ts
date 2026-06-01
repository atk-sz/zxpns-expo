import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUserState } from '../../utils/interfaces';

const initialState: IUserState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
};

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setValue: (state, action: PayloadAction<Partial<IUserState>>) => {
      return { ...state, ...action.payload };
    },
    resetValue: () => initialState,
  },
});

export const { setValue, resetValue } = user.actions;
export default user.reducer;

export type { IUserState };
