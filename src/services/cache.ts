import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 HOURS in milliseconds

type CacheEntry<T> = {
  data: T;
  cachedAt: number;
};

export async function getItemCache<T>(key: string): Promise<T | undefined> {
  try {
    const cachedValue = await AsyncStorage.getItem(key);

    if (!cachedValue) {
      return undefined;
    }

    const cached = JSON.parse(cachedValue) as CacheEntry<T>;
    const isValid =
      typeof cached.cachedAt === "number" && Date.now() - cached.cachedAt < CACHE_TTL;

    if (!isValid) {
      await AsyncStorage.removeItem(key);
      return undefined;
    }

    return cached.data;
  } catch (error) {
    console.error(`Error getting cached item: ${key}`, error);
    return undefined;
  }
}

export async function setItemCache<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(
      key,
      JSON.stringify({
        data: value,
        cachedAt: Date.now(),
      })
    );
  } catch (error) {
    console.error(`Error caching item: ${key}`, error);
  }
}

export async function removeItemCache(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing cached item: ${key}`, error);
  }
}
