import { SQLiteDatabase } from "expo-sqlite";
import AppError from "~/app/types/errors";
import { ListPurchase } from "../app/types/listPurchase";

export default class ListPurchaseDatabase {
  private database: SQLiteDatabase;

  constructor(database: SQLiteDatabase) {
    this.database = database;
  }

  async create(data: Omit<ListPurchase, "id">): Promise<void> {
    // Prepara a query SQL para inserir um registro na tabela list_purchase
    const statement = await this.database.prepareAsync(
      "insert into list_purchase (name, quantity, category) values (:name, :quantity, :category)"
    );

    try {
      await statement.executeAsync([data.name, data.quantity, data.category]);
    } catch (e) {
      throw new AppError("Erro ao inserir item na lista de compras", e);
    } finally {
      // Finaliza a execução da query SQL
      await statement.finalizeAsync();
    }
  }

  async listAll(): Promise<ListPurchase[]> {
    try {
      const sql = `select * from list_purchase`;
      const result = await this.database.getAllAsync<ListPurchase>(sql);

      return result;
    } catch (e) {
      throw new AppError("Erro ao buscar itens na lista de compras", e);
    }
  }
}
