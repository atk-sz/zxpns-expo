import { IExpenseEvent } from "@/utils/interfaces";
import * as SQLite from "expo-sqlite";

export const eventRepo = {
  async create(event: IExpenseEvent, DB: SQLite.SQLiteDatabase): Promise<void> {
    await DB.runAsync(
      `
      INSERT INTO expense_events (
        id,
        event_id,
        title,
        start_date,
        end_date,
        is_multi_day,
        is_group_event,
        balance_amount,
        total_income,
        total_expense,
        synced
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        event.id,
        event.eventId,
        event.title,
        event.startDate,
        event.endDate ?? null,
        event.isMultiDay ? 1 : 0,
        event.isGroupEvent ? 1 : 0,
        event.balanceAmount,
        event.totalIncome,
        event.totalExpense,
        event.synced ? 1 : 0,
      ],
    );
  },

  async getAll(DB: SQLite.SQLiteDatabase): Promise<IExpenseEvent[]> {
    const rows = await DB.getAllAsync<any>(`
      SELECT *
      FROM expense_events
      ORDER BY start_date DESC
    `);

    return rows.map((row) => ({
      ...row,
      eventId: row.event_id,
      startDate: row.start_date,
      endDate: row.end_date ? row.end_date : null,
      isMultiDay: Boolean(row.is_multi_day),
      isGroupEvent: Boolean(row.is_group_event),
      balanceAmount: row.balance_amount,
      totalIncome: row.total_income,
      totalExpense: row.total_expense,
      synced: Boolean(row.synced),
    }));
  },

  async getById(id: string) {
    // ...
  },

  async remove(id: string, DB: SQLite.SQLiteDatabase) {
    await DB.runAsync(`DELETE FROM expense_events WHERE id = ?`, [id]);
  },

  async update(id: string, event: IExpenseEvent, DB: SQLite.SQLiteDatabase) {
    await DB.runAsync(
      `
    UPDATE expense_events
    SET
      title = ?,
      start_date = ?,
      end_date = ?,
      is_multi_day = ?
    WHERE id = ?
    `,
      [
        event.title,
        event.startDate,
        event.endDate ?? null,
        event.isMultiDay ? 1 : 0,
        id,
      ],
    );
  },
};
