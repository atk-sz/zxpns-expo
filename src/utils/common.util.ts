import { Colors } from "@/constants/theme";
import { IEventTransaction, ITransactionType } from "./interfaces";

export const generateId = (title?: string, length: number = 7) => {
  const unique = Math.random()
    .toString(36)
    .substring(2, 2 + length);
  if (title) {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return `${slug}-${unique}`;
  }
  return unique;
};

export const getTypeColor = (type: ITransactionType) => {
  switch (type) {
    case "incoming":
      return Colors.dark.success;
    case "outgoing":
      return Colors.dark.error;
    case "item":
      return Colors.dark.orange;
    default:
      return Colors.dark.text;
  }
};

export const getTypeIcon = (type: string) => {
  switch (type) {
    case "incoming":
      return "cash-plus";
    case "outgoing":
      return "cash-minus";
    case "item":
      return "package-variant";
    default:
      return "cash";
  }
};

export const getTypeLabel = (type: string) => {
  switch (type) {
    case "incoming":
      return "Income";
    case "outgoing":
      return "Expense";
    case "item":
      return "Item Transaction";
    default:
      return "Transaction";
  }
};

export const formatAmount = (amount: string) => {
  return parseFloat(amount).toLocaleString();
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${month}-${day}-${year}`;
};

export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatDateLong = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const truncateText = (text: string, limit: number) => {
  return text.length > limit ? text.substring(0, limit) + "..." : text;
};

export const getCountOfTransactions = (transactions: IEventTransaction[]) => {
  const outgoingTransactionsCount = transactions.filter(
    (t) => t.type === "outgoing",
  ).length;
  const incomingTransactionsCount = transactions.filter(
    (t) => t.type === "incoming",
  ).length;
  const itemTransactionsCount = transactions.filter(
    (t) => t.type === "item",
  ).length;
  return {
    outgoing: outgoingTransactionsCount,
    incoming: incomingTransactionsCount,
    item: itemTransactionsCount,
    total:
      outgoingTransactionsCount +
      incomingTransactionsCount +
      itemTransactionsCount,
  };
};
