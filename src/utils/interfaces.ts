export type IUserState = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export interface IExpenseEvent {
  id: string;
  title: string;
  startDate: string;
  isMultiDay: boolean;
  balanceAmount: string;
  incomingAmount: string;
  outgoingAmount: string;
  endDate?: string;
  transactions: IEventTransaction[];
  open: boolean;
}

export type ITransactionType = "incoming" | "outgoing" | "item";

export interface IEventTransaction {
  id: string;
  amount: string;
  balanceAmountNow: string;
  type: ITransactionType;
  description: string;
  date: string;
  eventId: string;
  worth?: string;
  itemName?: string;
}
