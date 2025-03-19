import { useSQLiteContext } from "expo-sqlite";
import { ListPurchase } from "../types/listPurchase";

export function listPurchaseDatabase() {
  const database = useSQLiteContext();

  async function create(data: Omit<ListPurchase, "id">): Promise<void> {
    try {
      // Prepara a query SQL para inserir um registro na tabela list_purchase
      const statement = await database.prepareAsync(
        "insert into list_purchase (name, quantity, category) values (?, ?, ?)"
      );

      await statement.executeAsync({
        name: data.name,
        quantity: data.quantity,
        category: data.category,
      });
    } catch (e) {
      throw e;
    }
  }

  return { create };
}
