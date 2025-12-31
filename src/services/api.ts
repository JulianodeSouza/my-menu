import axios from "axios";
import Constants from "expo-constants";

const axiosInstance = axios.create({
  timeout: 30000,
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
  // Produção
  if (!__DEV__) {
    return "http://44.221.138.71:21200/";
  }

  // Desenvolvimento - Obtém o IP do host do Expo
  const debuggerHost = Constants.expoConfig?.hostUri?.split(":")[0];

  if (debuggerHost) {
    // Usa o IP detectado pelo Expo (funciona em dispositivos físicos e emuladores)
    return `http://${debuggerHost}:21200/`;
  }

  // Fallback para emulador Android
  return "http://10.0.2.2:21200/";
}

function getHeaders(): Record<string, string> {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  return headers;
}
