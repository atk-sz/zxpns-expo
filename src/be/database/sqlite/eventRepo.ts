import { IExpenseEvent } from "@/utils/interfaces";
import { openConnection } from "./database";

export const eventRepo = {
  async create(event: IExpenseEvent) {
    const SQBD = await openConnection();

    await SQBD.runAsync(
      `
      INSERT INTO expense_events (
        id,
        title,
        startDate,
        endDate,
        isMultiDay,
        isGroupEvent,
        balanceAmount,
        incomingAmount,
        outgoingAmount,
        open,
        synced
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        event.id,
        event.title,
        event.startDate,
        event.endDate ?? null,
        event.isMultiDay ? 1 : 0,
        event.isGroupEvent ? 1 : 0,
        event.balanceAmount,
        event.incomingAmount,
        event.outgoingAmount,
        event.open ? 1 : 0,
        event.synced ? 1 : 0,
      ],
    );
  },

  async getAll(): Promise<IExpenseEvent[]> {
    const SQBD = await openConnection();

    const rows = await SQBD.getAllAsync<any>(`
      SELECT *
      FROM expense_events
      ORDER BY startDate DESC
    `);

    return rows.map((row) => ({
      ...row,
      isMultiDay: Boolean(row.isMultiDay),
      isGroupEvent: Boolean(row.isGroupEvent),
      open: Boolean(row.open),
      synced: Boolean(row.synced),
      transactions: [],
    }));
  },

  async getById(id: string) {
    // ...
  },

  async remove(id: string) {
    const SQBD = await openConnection();
    await SQBD.runAsync(`DELETE FROM expense_events WHERE id = ?`, [id]);
  },

  async update(id: string, event: IExpenseEvent) {
    const SQBD = await openConnection();

    await SQBD.runAsync(
      `
    UPDATE expense_events
    SET
      title = ?,
      startDate = ?,
      endDate = ?,
      isMultiDay = ?,
      isGroupEvent = ?,
      balanceAmount = ?,
      incomingAmount = ?,
      outgoingAmount = ?,
      open = ?,
      synced = ?
    WHERE id = ?
    `,
      [
        event.title,
        event.startDate,
        event.endDate ?? null,
        event.isMultiDay ? 1 : 0,
        event.isGroupEvent ? 1 : 0,
        event.balanceAmount,
        event.incomingAmount,
        event.outgoingAmount,
        event.open ? 1 : 0,
        event.synced ? 1 : 0,
        id,
      ],
    );
  },
};
