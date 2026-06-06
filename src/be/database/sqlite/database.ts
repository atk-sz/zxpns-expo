import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

export const getOrOpenDBConnection = async () => {
  if (db) return db;

  db = await SQLite.openDatabaseAsync("zxpense.db");

  await db.execAsync(`
    PRAGMA foreign_keys = ON;
  `);

  return db;
};

export const createEventsTable = async () => {
  const SQBD = await getOrOpenDBConnection();
  await SQBD.execAsync(`
    CREATE TABLE IF NOT EXISTS expense_events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      startDate TEXT NOT NULL,
      endDate TEXT,
      isMultiDay INTEGER NOT NULL,
      isGroupEvent INTEGER NOT NULL,
      balanceAmount TEXT NOT NULL,
      incomingAmount TEXT NOT NULL,
      outgoingAmount TEXT NOT NULL,
      open INTEGER NOT NULL,
      synced INTEGER NOT NULL
    );
  `);
};

export const createTransactionsTable = async () => {
  const SQBD = await getOrOpenDBConnection();
  await SQBD.execAsync(`
  CREATE TABLE IF NOT EXISTS event_transactions (
    id TEXT PRIMARY KEY,
    amount TEXT NOT NULL,
    balanceAmountNow TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    eventId TEXT NOT NULL,
    worth TEXT,
    itemName TEXT,
    synced INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (eventId) REFERENCES expense_events(id) ON DELETE CASCADE
  );
`);
};

export const getAllTables = async () => {
  const SQBD = await getOrOpenDBConnection();
  const tables = await SQBD.getAllAsync(`
    SELECT name
    FROM sqlite_master
    WHERE type='table'
    ORDER BY name;
  `);
  return tables;
};
