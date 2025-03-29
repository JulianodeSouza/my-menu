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
      checked integer not null default 0,
      category integer not null,
      FOREIGN KEY (category) REFERENCES categories(idCategory) ON DELETE CASCADE)`);

  // await database.execAsync(`create table if not exists system (firstStart integer not null)`);

  // await database.execAsync(`insert into categories (name) VALUES ('Bebidas')`);
  // await database.execAsync(`insert into categories (name) VALUES ('Frutas')`);
  // await database.execAsync(`insert into categories (name) VALUES ('Carnes')`);
  // await database.execAsync(`insert into categories (name) VALUES ('Laticínios')`);
  // await database.execAsync(`insert into categories (name) VALUES ('Limpeza')`);
  // await database.execAsync(`insert into categories (name) VALUES ('Higiene')`);
  // await database.execAsync(`insert into categories (name) VALUES ('Legumes')`);
  // await database.execAsync(`insert into categories (name) VALUES ('Temperos')`);
  // await database.execAsync(`insert into categories (name) VALUES ('Não perecíveis')`);
}
