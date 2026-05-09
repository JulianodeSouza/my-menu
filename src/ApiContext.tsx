import React, { createContext, ReactNode, useContext } from "react";
import { useDispatch } from "react-redux";
import { get, post, put, remove } from "./services/api";
import { setInfoToast } from "./store/reducers/geral";
import { getErrorMessage } from "./utils/errorUtils";

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
        console.error("Error in GET request: ");
        console.error(e);
        const errorInfo = getErrorMessage(e, "fetch");

        dispatch(
          setInfoToast({
            open: true,
            message: errorInfo.message,
            type: errorInfo.type,
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
        const errorInfo = getErrorMessage(e, "save");

        dispatch(
          setInfoToast({
            open: true,
            message: errorInfo.message,
            type: errorInfo.type,
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
        console.error("Error in PUT request:", e);
        const errorInfo = getErrorMessage(e, "update");

        dispatch(
          setInfoToast({
            open: true,
            message: errorInfo.message,
            type: errorInfo.type,
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
        console.error("Error in DELETE request:", e);
        const errorInfo = getErrorMessage(e, "delete");

        dispatch(
          setInfoToast({
            open: true,
            message: errorInfo.message,
            type: errorInfo.type,
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
