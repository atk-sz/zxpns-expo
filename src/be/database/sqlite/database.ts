import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseAsync("zxpense.db");

export const openConnection = async () => {
  return await SQLite.openDatabaseAsync("zxpense.db");
};

export const getAllTables = async () => {
  const SQBD = await openConnection();
  const tables = await SQBD.getAllAsync(`
    SELECT name
    FROM sqlite_master
    WHERE type='table'
    ORDER BY name;
  `);
  return tables;
};
