export type IUserState = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type ICurEvent = {
  eventDetails: IExpenseEvent;
  transactions: IEventTransactionWithBalance[];
};

export type IToastType = "success" | "error" | "info";

export interface IToastContextType {
  showToast: (message: string, type?: IToastType) => void;
}

export interface IExpenseEvent {
  id: string;
  eventId: string;
  title: string;
  startDate: string;
  isMultiDay: boolean;
  endDate?: string;
  isGroupEvent: boolean;
  balanceAmount: string;
  totalIncome: string;
  totalExpense: string;
  synced: boolean;
}

export type ITransactionType = "incoming" | "outgoing" | "item";

export interface IEventTransaction {
  id: string;
  amount: string;
  type: ITransactionType;
  description: string;
  date: string;
  eventId: string;
  worth?: string;
  itemName?: string;
  synced: boolean;
}

export interface IEventTransactionWithBalance extends IEventTransaction {
  balanceAmountNow: number;
}

export interface ITransactionsCount {
  incoming: number;
  outgoing: number;
  item: number;
  total: number;
}
