export type IUserState = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type IToastType = "success" | "error" | "info";

export interface IToastContextType {
  showToast: (message: string, type?: IToastType) => void;
}

export interface IExpenseEvent {
  id: string;
  title: string;
  startDate: string;
  isMultiDay: boolean;
  isGroupEvent: boolean;
  balanceAmount: string;
  incomingAmount: string;
  outgoingAmount: string;
  endDate?: string;
  transactions: IEventTransaction[];
  open: boolean;
  synced: boolean;
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
  synced: boolean;
}

export interface ITransactionsCount {
  incoming: number;
  outgoing: number;
  item: number;
  total: number;
}
