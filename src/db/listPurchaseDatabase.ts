import { useSQLiteContext } from "expo-sqlite";
import AppError from "~/types/errors";
import { IItemChecked, IListPurchase } from "../types/listPurchase";

export function useListPurchaseDatabase() {
  const database = useSQLiteContext();

  async function finishPurchase(): Promise<void> {
    const statement = await database.prepareAsync(`delete from list_purchase where checked = 1`);

    try {
      await statement.executeAsync();
    } catch (e) {
      throw new AppError("Erro ao finalizar compras", e);
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function create(data: Omit<IListPurchase, "id">): Promise<void> {
    // Prepara a query SQL para inserir um registro na tabela list_purchase
    const statement = await database.prepareAsync(
      "insert into list_purchase (name, quantity, category, measuredUnit) values (:name, :quantity, :category, :measuredUnit)"
    );

    try {
      await statement.executeAsync([data.name, data.quantity, data.category, data.measuredUnit]);
    } catch (e) {
      throw new AppError("Erro ao inserir item na lista de compras", e);
    } finally {
      // Finaliza a execução da query SQL
      await statement.finalizeAsync();
    }
  }

  async function listAllItems(): Promise<IListPurchase[]> {
    try {
      const sql = `
      select lp.*,
      c.name as category,
      mu.name as measuredUnit
      from list_purchase lp
      inner join categories c on lp.category = c.idCategory
      inner join measured_unit mu on lp.measuredUnit = mu.id`;

      const result = await database.getAllAsync<IListPurchase>(sql);

      return result;
    } catch (e) {
      throw new AppError("Erro ao buscar itens na lista de compras", e);
    }
  }

  async function getItemById(id: number): Promise<IListPurchase> {
    try {
      const sql = `
      select lp.*,
      c.name as category 
      from list_purchase lp
      inner join categories c on lp.category = c.idCategory
      where lp.id = ?`;

      const result = await database.getFirstAsync<IListPurchase>(sql, [id]);

      return result;
    } catch (e) {
      console.error(e);
      throw new AppError("Erro ao buscar item na lista de compras");
    }
  }

  async function markItemList(id: number, data: IItemChecked): Promise<void> {
    const statement = await database.prepareAsync(
      `update list_purchase set checked = ?, totalCaught = ?, amount = ? where id = ?`
    );

    try {
      await statement.executeAsync([data.itemChecked, data.totalCaught, data.amount, id]);
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
    markItemList,
    removeItem,
    finishPurchase,
  };
}
