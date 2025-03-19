import { type SQLiteDatabase } from "expo-sqlite";

export async function initializeDatabase(database: SQLiteDatabase) {
  await database.execAsync(`
    create table if not exists categories (
      idCategory integer primary key autoincrement,
      name text not null)`);

  await database.execAsync(`
    create table if not exists list_purchase (
      id integer primary key autoincrement,
      name text not null,
      quantity integer not null,
      category integer not null)`);
}
