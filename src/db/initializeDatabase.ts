import { type SQLiteDatabase } from "expo-sqlite";
import { ISystemConfigs } from "~/types/systemConfigs";

export async function initializeDatabase(database: SQLiteDatabase) {
  await database.execAsync(`
    create table if not exists categories (
      id_category integer primary key autoincrement,
      name text not null)`);

  await database.execAsync(`
    create table if not exists list_purchase (
    id integer primary key autoincrement,
    name text not null,
    quantity integer not null,
    checked integer not null default 0,    
    amount real,
    totalCaught real,
    category integer not null,
    measuredUnit integer not null,
    FOREIGN KEY (category) REFERENCES categories(id_category) ON DELETE CASCADE,
    FOREIGN KEY (measuredUnit) REFERENCES measured_unit(id) ON DELETE CASCADE
    );`);

  await database.execAsync(`create table if not exists measured_unit (
    id integer primary key autoincrement,
    name text not null)`);

  await database.execAsync(
    `create table if not exists system_config (
    id integer primary key autoincrement,
    firstStart integer not null)`
  );

  const config: ISystemConfigs = await database.getFirstAsync("select * from system_config");

  if (!config || config.firstStart) {
    await database.execAsync("insert into system_config (firstStart) values (1)");

    await database.execAsync("insert into categories (name) VALUES ('Bebidas')");
    await database.execAsync("insert into categories (name) VALUES ('Frutas')");
    await database.execAsync("insert into categories (name) VALUES ('Carnes')");
    await database.execAsync("insert into categories (name) VALUES ('Laticínios')");
    await database.execAsync("insert into categories (name) VALUES ('Limpeza')");
    await database.execAsync("insert into categories (name) VALUES ('Higiene')");
    await database.execAsync("insert into categories (name) VALUES ('Legumes')");
    await database.execAsync("insert into categories (name) VALUES ('Temperos')");
    await database.execAsync("insert into categories (name) VALUES ('Não perecíveis')");

    await database.execAsync("insert into measured_unit (name) VALUES ('kg')");
    await database.execAsync("insert into measured_unit (name) VALUES ('g')");
    await database.execAsync("insert into measured_unit (name) VALUES ('un')");

    await database.execAsync("update system_config set firstStart = 0");
  }
}
