import { theme } from "@/constants/theme";
import { IEventTransaction, ITransactionType } from "./interfaces";

// generate unique id with optional title prefix
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
      return theme.success;
    case "outgoing":
      return theme.error;
    case "item":
      return theme.warning;
    default:
      return theme.text;
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

// add commas based locality number format
export const formatAmount = (amount: string) => {
  return parseFloat(amount).toLocaleString();
};

// format date to "DD-MMM-YYYY" format
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

  return `${day}-${month}-${year}`;
};

// format date to "YYYY-MM-DD" format
export const formatDateISO = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// format date to "YYYY-MM-DDTHH:mm" format for input type="datetime-local"
export const formatDateTimeISO = (date: Date) => {
  return `${formatDateISO(date)}T${formatTime24hrs(date)}`;
};

// format date to "hh:mm AM/PM" format
export const formatTime12hrs = (date: string | Date) => {
  let dateObj: Date;
  if (typeof date === "string") {
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }
  return dateObj.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// format date to "HH:mm" format
export const formatTime24hrs = (date: string | Date) => {
  let dateObj: Date;
  if (typeof date === "string") {
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

// format date to "Monday, January 1, 2020" format
export const formatDateLong = (date: string | Date) => {
  let dateObj: Date;
  if (typeof date === "string") {
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }
  return dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// truncate text with ellipsis if it exceeds the limit
export const truncateText = (text: string, limit: number) => {
  return text.length > limit ? text.substring(0, limit) + "..." : text;
};

// get count of incoming, outgoing and item transactions
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
