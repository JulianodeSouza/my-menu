import { useSQLiteContext } from "expo-sqlite";
import { ICategories } from "~/types/categories";
import AppError from "~/types/errors";

export function useCategoryDatabase() {
  const database = useSQLiteContext();

  async function create(data: Omit<ICategories, "idCategory">) {
    // Prepara a query SQL para inserir um registro na tabela list_purchase
    const statement = await database.prepareAsync("insert into categories (name) values (:name)");

    try {
      await statement.executeAsync([data.name]);
    } catch (e) {
      throw new AppError("Erro ao inserir categoria", e);
    } finally {
      // Finaliza a execução da query SQL
      await statement.finalizeAsync();
    }
  }

  async function listAllCategories(): Promise<ICategories[]> {
    try {
      const sql = `select * from categories`;
      const result = await database.getAllAsync<ICategories>(sql);

      return result;
    } catch (e) {
      throw new AppError("Erro ao buscar categorias", e);
    }
  }

  async function removeCategory(idCategory: number) {
    const statement = await database.prepareAsync("delete from categories where idCategory = ?");

    try {
      await statement.executeAsync([idCategory]);
    } catch (e) {
      throw new AppError("Erro ao remover categoria", e);
    }
  }

  return {
    create,
    listAllCategories,
    removeCategory,
  };
}
