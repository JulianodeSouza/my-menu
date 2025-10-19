import React, { createContext, ReactNode, useContext } from "react";
import { useDispatch } from "react-redux";
import { get, post, put, remove } from "./services/api";
import { setInfoToast } from "./store/reducers/geral";

interface ApiContextType {
  getApi: (url: string, params?: any) => Promise<any>;
  postApi: (url: string, data?: object) => Promise<any>;
  putApi: (url: string, data?: object) => Promise<any>;
  deleteApi: (url: string) => Promise<any>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

interface ApiProviderProps {
  children: ReactNode;
}

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const dispatch = useDispatch();

  const getApi = async (url: string, params: any) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await get(url, params);
        resolve(result);
      } catch (e: any) {
        console.error("Error in GET request:", e);
        let message = "Houve um erro ao buscar os dados. Por favor, tente novamente.";

        if (e.status !== 200 && e.response.data.message) {
          message = e.response.data.message;
        }

        dispatch(
          setInfoToast({
            open: true,
            message: message,
            type: "error",
          })
        );

        reject(e);
      }
    });

    return promise;
  };

  const postApi = async (url: string, data = {}) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await post(url, data);
        resolve(result);
      } catch (e: any) {
        let message = "Houve um erro ao salvar os dados. Por favor, tente novamente.";

        if (e.status !== "200" && e.response.data) {
          message = e.response.data.message;
        }

        dispatch(
          setInfoToast({
            open: true,
            message: message,
            type: "error",
          })
        );

        reject(e);
      }
    });

    return promise;
  };

  const putApi = async (url: string, data = {}) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await put(url, data);
        resolve(result);
      } catch (e: any) {
        console.error("Error in GET request:", e);
        let message = "Houve um erro ao alterar os dados. Por favor, tente novamente.";

        if (e.status !== "200" && e.response.data) {
          message = e.response.data.message;
        }

        dispatch(
          setInfoToast({
            open: true,
            message: message,
            type: "error",
          })
        );

        reject(e);
      }
    });

    return promise;
  };

  const deleteApi = async (url: string) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await remove(url);
        resolve(result);
      } catch (e: any) {
        console.error("Error in GET request:", e);
        let message = "Houve um erro ao remover os dados. Por favor, tente novamente.";

        if (e.status !== "200" && e.response.data) {
          message = e.response.data.message;
        }

        dispatch(
          setInfoToast({
            open: true,
            message: message,
            type: "error",
          })
        );

        reject(e);
      }
    });

    return promise;
  };

  return (
    <ApiContext.Provider value={{ getApi, postApi, putApi, deleteApi }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};
