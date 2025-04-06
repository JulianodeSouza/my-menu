import { useSQLiteContext } from "expo-sqlite";
import { ICategories } from "~/types/categories";
import AppError from "~/types/errors";
import { IMeasuredUnit } from "~/types/measuredUnit";

export function useMeasuredUnitDatabase() {
  const database = useSQLiteContext();

  async function create(data: Omit<IMeasuredUnit, "id">) {
    const statement = await database.prepareAsync(
      "insert into measured_unit (name) values (:name)"
    );

    try {
      await statement.executeAsync([data.name]);
    } catch (e) {
      throw new AppError("Erro ao inserir categoria", e);
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function listAllMeasuredUnits(): Promise<IMeasuredUnit[]> {
    try {
      const sql = `select * from measured_unit`;
      const result = await database.getAllAsync<IMeasuredUnit>(sql);

      return result;
    } catch (e) {
      throw new AppError("Erro ao buscar categorias", e);
    }
  }

  return { create, listAllMeasuredUnits };
}
