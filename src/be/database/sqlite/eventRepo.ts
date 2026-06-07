import { IExpenseEvent } from "@/utils/interfaces";
import { getOrOpenDBConnection } from "./database";

export const eventRepo = {
  async create(event: IExpenseEvent) {
    const SQBD = await getOrOpenDBConnection();

    await SQBD.runAsync(
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

  async getAll(): Promise<IExpenseEvent[]> {
    const SQBD = await getOrOpenDBConnection();

    const rows = await SQBD.getAllAsync<any>(`
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

  async remove(id: string) {
    const SQBD = await getOrOpenDBConnection();
    await SQBD.runAsync(`DELETE FROM expense_events WHERE id = ?`, [id]);
  },

  async update(id: string, event: IExpenseEvent) {
    const SQBD = await getOrOpenDBConnection();

    await SQBD.runAsync(
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
