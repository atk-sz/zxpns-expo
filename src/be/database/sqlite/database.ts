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
      id TEXT PRIMARY KEY,           -- UUID

      event_id TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT,
      is_multi_day INTEGER NOT NULL,
      is_group_event INTEGER NOT NULL,

      balance_amount TEXT NOT NULL,
      total_income TEXT NOT NULL,
      total_expense TEXT NOT NULL,

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
    type TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    event_id TEXT NOT NULL,
    worth TEXT,
    item_name TEXT,

    synced INTEGER NOT NULL DEFAULT 0,

    FOREIGN KEY (event_id)
      REFERENCES expense_events(id)
      ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_transactions_event_date
  ON event_transactions(event_id, date);
`);
};

// above i have added indexing on event_id and date for transactions table
// this helps in getting transactions by event_id and date as SQLite(or anyothe DB) supports indexing
// whats indexing? indexing is a way to speed up queries on a database by creating a secondary index for foreign keys
// example here is: if there are 4 events E1 E2 E3 E4 & each have 100 transactions
// and if we dont do indexing then sqlite will have to search for each transaction for each event
// but with indexing SQLite will create a secondary index for event_id behind the event_transactions table where each event index has 100 transactions
// therefor there are only 4 indexes & it will only have to search for each event once(thats only 4 times) & then return 100 transactions for that event

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
