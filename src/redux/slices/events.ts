// redux/slices/events.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IExpenseEvent } from '../../utils/interfaces';

const initialState: IExpenseEvent[] = [];

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    initializeEvents: (state, action: PayloadAction<IExpenseEvent[]>) => {
      return action.payload;
    },
    clearAllEvents: () => [],
    addEvent: (state, action: PayloadAction<IExpenseEvent>) => {
      state.push(action.payload);
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      return state.filter(event => event.id !== action.payload);
    },
    updateEvent: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<IExpenseEvent> }>,
    ) => {
      const { id, updates } = action.payload;
      const index = state.findIndex(event => event.id === id);
      if (index !== -1) {
        state[index] = {
          ...state[index],
          ...updates,
        };
      }
    },
  },
});

export const {
  initializeEvents,
  clearAllEvents,
  addEvent,
  deleteEvent,
  updateEvent,
} = eventsSlice.actions;
export default eventsSlice.reducer;
