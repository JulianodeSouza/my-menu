import axios from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";

const axiosInstance = axios.create({
  timeout: 5000,
  baseURL: getUrlBase(),
  headers: getHeaders(),
});

export async function get(endpoint: string, params?: any): Promise<any> {
  let queryString = "";

  if (params) {
    queryString = "?" + new URLSearchParams(params).toString();
  }

  const fullUrl = endpoint + queryString;
  const result = await axiosInstance.get(fullUrl);

  return result.data;
}

export async function post(endpoint: string, data?: any): Promise<any> {
  const result = await axiosInstance.post(endpoint, data);
  return result.data;
}

export async function put(endpoint: string, data: any): Promise<any> {
  const result = await axiosInstance.put(endpoint, data);

  return result.data;
}

export async function remove(endpoint: string): Promise<any> {
  const result = await axiosInstance.delete(endpoint);
  return result.data;
}

function getUrlBase(): string {
  // Usa a URL definida nas variáveis de ambiente
  const apiUrl = Constants.expoConfig?.extra?.apiUrl;
  const apiPort = Constants.expoConfig?.extra?.apiPort;
  const hostUri = Constants.expoConfig?.hostUri;
  const debuggerHost = hostUri?.split(":")[0];

  // Se apiUrl está explicitamente definida, usar
  if (apiUrl) {
    return apiUrl;
  }

  if (Platform.OS === "android" && !Constants.isDevice) {
    return `http://10.0.2.2:${apiPort}`;
  }

  if (debuggerHost) {
    return `http://${debuggerHost}:${apiPort}`;
  }

  // Fallback para emulador Android
  return `http://10.0.2.2:${apiPort}`;
}

function getHeaders(): Record<string, string> {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  return headers;
}
