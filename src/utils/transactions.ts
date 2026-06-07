import { IEventTransaction, IEventTransactionWithBalance } from "./interfaces";

export const computeRunningBalances = (
  transactions: IEventTransaction[],
): IEventTransactionWithBalance[] => {
  let balance = 0;

  return transactions.map((tx) => {
    const amount = Number(tx.amount) || 0;

    switch (tx.type) {
      case "incoming":
        balance += amount;
        break;

      case "outgoing":
        balance -= amount;
        break;
    }

    return {
      ...tx,
      balanceAmountNow: balance,
    };
  });
};

export const recomputeFromIndex = (
  transactions: IEventTransactionWithBalance[], // already sorted by date ASC
  fromIndex: number,
): IEventTransactionWithBalance[] => {
  // Balance just before the affected index
  const balanceBefore =
    fromIndex > 0 ? transactions[fromIndex - 1].balanceAmountNow : 0;

  let balance = balanceBefore;

  const updated = transactions.slice(fromIndex).map((tx) => {
    const amount = Number(tx.amount) || 0;
    switch (tx.type) {
      case "incoming":
        balance += amount;
        break;
      case "outgoing":
        balance -= amount;
        break;
    }
    return { ...tx, balanceAmountNow: balance };
  });

  // Merge: untouched prefix + recomputed suffix
  return [...transactions.slice(0, fromIndex), ...updated];
};
