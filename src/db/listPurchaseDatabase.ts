import { useSQLiteContext } from "expo-sqlite";
import AppError from "~/types/errors";
import { ListPurchase } from "../types/listPurchase";

export function useListPurchaseDatabase() {
  const database = useSQLiteContext();

  async function create(data: Omit<ListPurchase, "id">): Promise<void> {
    // Prepara a query SQL para inserir um registro na tabela list_purchase
    const statement = await database.prepareAsync(
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

  async function listAllItems(): Promise<ListPurchase[]> {
    try {
      const sql = `
      select lp.*,
      c.name as category 
      from list_purchase lp
      inner join categories c on lp.category = c.idCategory`;

      const result = await database.getAllAsync<ListPurchase>(sql);

      return result;
    } catch (e) {
      throw new AppError("Erro ao buscar itens na lista de compras", e);
    }
  }

  async function getItemById(id: number): Promise<ListPurchase> {
    try {
      const sql = `
      select lp.*,
      c.name as category 
      from list_purchase lp
      inner join categories c on lp.category = c.idCategory
      where lp.id = ?`;

      const result = await database.getFirstAsync<ListPurchase>(sql, [id]);

      return result;
    } catch (e) {
      console.error(e);
      throw new AppError("Erro ao buscar item na lista de compras");
    }
  }

  async function updateCheck(id: number, itemChecked: boolean): Promise<void> {
    const statement = await database.prepareAsync(
      `update list_purchase set checked = ? where id = ?`
    );

    try {
      await statement.executeAsync([itemChecked, id]);
    } catch (e) {
      throw new AppError("Erro ao atualizar item na lista de compras", e);
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function updateItem(id: number, data: Omit<ListPurchase, "id">) {
    const statement = await database.prepareAsync(
      `update list_purchase set name = ?, quantity = ?, category = ? where id = ?`
    );

    try {
      await statement.executeAsync([data.name, data.quantity, data.category, id]);
    } catch (e) {
      throw new AppError("Erro ao atualizar item na lista de compras", e);
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function removeItem(id: number): Promise<void> {
    const statement = await database.prepareAsync(`delete from list_purchase where id = ?`);

    try {
      await statement.executeAsync([id]);
    } catch (e) {
      throw new AppError("Erro ao remover item na lista de compras", e);
    } finally {
      await statement.finalizeAsync();
    }
  }

  return {
    create,
    listAllItems,
    getItemById,
    updateCheck,
    updateItem,
    removeItem,
  };
}
