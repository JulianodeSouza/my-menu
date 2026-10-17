import { get } from "~/services/api";
import { getItemCache, setItemCache } from "~/services/cache";
import { CategorieProps } from "~/types/categories";
import { IMeasuredUnit } from "~/types/measuredUnit";

export async function loadMeasuredUnits(): Promise<IMeasuredUnit[]> {
  try {
    const cachedUnits = await getItemCache<IMeasuredUnit[]>("measuredUnits");

    if (Array.isArray(cachedUnits)) {
      return cachedUnits;
    }

    const result = (await get("measuredUnits")) as IMeasuredUnit[];
    await setItemCache("measuredUnits", result);
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error loading measured units", error);
    return [];
  }
}

export async function loadCategories(): Promise<CategorieProps[]> {
  try {
    const cachedCategories = await getItemCache<CategorieProps[]>("categories");

    if (Array.isArray(cachedCategories)) {
      return cachedCategories;
    }

    const result = (await get("categories")) as CategorieProps[];
    await setItemCache("categories", result);
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error loading categories", error);
    return [];
  }
}
