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
  // eventId TEXT NOT NULL UNIQUE,  -- 6 digit readable ID add later
  await SQBD.execAsync(`
    CREATE TABLE IF NOT EXISTS expense_events (
      id TEXT PRIMARY KEY,           -- UUID

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

export const deleteEventsTable = async () => {
  const SQBD = await getOrOpenDBConnection();
  await SQBD.execAsync(`
    DROP TABLE IF EXISTS expense_events;
  `);
};

export const deleteTransactionsTable = async () => {
  const SQBD = await getOrOpenDBConnection();
  await SQBD.execAsync(`
    DROP TABLE IF EXISTS event_transactions;
  `);
};

export const deleteAllTables = async () => {
  const SQBD = await getOrOpenDBConnection();

  const tables = await SQBD.getAllAsync<{
    name: string;
  }>(`
    SELECT name
    FROM sqlite_master
    WHERE type='table'
      AND name NOT LIKE 'sqlite_%';
  `);

  for (const table of tables) {
    await SQBD.execAsync(`DROP TABLE IF EXISTS ${table.name};`);
  }
};

export const clearAllData = async () => {
  const SQBD = await getOrOpenDBConnection();

  await SQBD.execAsync(`
    DELETE FROM event_transactions;
    DELETE FROM expense_events;
  `);
};

export const deleteDB = async () => {
  const SQBD = await getOrOpenDBConnection();
  await SQBD.closeAsync();
  await SQLite.deleteDatabaseAsync("zxpense.db");
};
