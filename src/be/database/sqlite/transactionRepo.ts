import { IEventTransaction } from "@/utils/interfaces";
import * as SQLite from "expo-sqlite";

export const transactionRepo = {
  async create(
    transaction: IEventTransaction,
    newTotals: { income: string; expense: string; balance: string },
    eventId: string,
    DB: SQLite.SQLiteDatabase,
  ) {
    const { income, expense, balance } = newTotals;

    await DB.withTransactionAsync(async () => {
      await DB.runAsync(
        `
    INSERT INTO event_transactions (
      id,
      amount,
      type,
      description,
      date,
      event_id,
      worth,
      item_name,
      synced
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
        [
          transaction.id,
          transaction.amount,
          transaction.type,
          transaction.description ?? null,
          transaction.date,
          transaction.eventId,
          transaction.worth ?? null,
          transaction.itemName ?? null,
          transaction.synced,
        ],
      );

      await DB.runAsync(
        `
    UPDATE expense_events
    SET
      total_income = ?,
      total_expense = ?,
      balance_amount = ?
    WHERE id = ?
    `,
        [income, expense, balance, eventId],
      );
    });
  },

  async getAllTransactions(DB: SQLite.SQLiteDatabase) {
    return await DB.getAllAsync<IEventTransaction>(
      `
    SELECT *
    FROM event_transactions
    ORDER BY date ASC
    `,
    );
  },

  async getTransactionsByEventId(eventId: string, DB: SQLite.SQLiteDatabase) {
    return await DB.getAllAsync<IEventTransaction>(
      `
    SELECT *
    FROM event_transactions
    WHERE event_id = ?
    ORDER BY date ASC
    `,
      [eventId],
    );
  },

  async removeTransaction(
    transactionId: string,
    newTotals: { income: string; expense: string; balance: string },
    eventId: string,
    DB: SQLite.SQLiteDatabase,
  ) {
    const { income, expense, balance } = newTotals;

    await DB.withTransactionAsync(async () => {
      await DB.runAsync(
        `
        DELETE FROM event_transactions
        WHERE id = ?
        `,
        [transactionId],
      );

      await DB.runAsync(
        `
        UPDATE expense_events
        SET
          total_income = ?,
          total_expense = ?,
          balance_amount = ?
        WHERE id = ?
        `,
        [income, expense, balance, eventId],
      );
    });
  },
};
