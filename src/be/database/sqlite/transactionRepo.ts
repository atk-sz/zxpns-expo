import { IEventTransaction } from "@/utils/interfaces";
import { getOrOpenDBConnection } from "./database";

export const transactionRepo = {
  async create(
    transaction: IEventTransaction,
    newTotals: { income: string; expense: string; balance: string },
    eventId: string,
  ) {
    const { income, expense, balance } = newTotals;
    const SQBD = await getOrOpenDBConnection();

    await SQBD.withTransactionAsync(async () => {
      await SQBD.runAsync(
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

      await SQBD.runAsync(
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

  async getAllTransactions() {
    const SQBD = await getOrOpenDBConnection();
    return await SQBD.getAllAsync<IEventTransaction>(
      `
    SELECT *
    FROM event_transactions
    ORDER BY date ASC
    `,
    );
  },

  async getTransactionsByEventId(eventId: string) {
    const SQBD = await getOrOpenDBConnection();

    return await SQBD.getAllAsync<IEventTransaction>(
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
  ) {
    const { income, expense, balance } = newTotals;
    const SQBD = await getOrOpenDBConnection();

    await SQBD.withTransactionAsync(async () => {
      await SQBD.runAsync(
        `
        DELETE FROM event_transactions
        WHERE id = ?
        `,
        [transactionId],
      );

      await SQBD.runAsync(
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
