import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useApi } from "~/ApiContext";
import { setInfoToast } from "~/store/reducers/geral";
import { IListPurchaseView, ShoppingContextType, ShoppingProviderProps } from "~/types/shopList";

const ShoppingContext = createContext<ShoppingContextType | undefined>(undefined);

export const ShoppingProvider: React.FC<ShoppingProviderProps> = ({ children }) => {
  const [shoppingList, setShoppingList] = useState<IListPurchaseView[]>([]);
  const [loadItems, setLoadItems] = useState<boolean>(false);
  const [totalPurchase, setTotalPurchase] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [refreshItems, setRefreshItems] = useState<boolean>(false);

  const { getApi, postApi } = useApi();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchShoppingList = async () => {
      try {
        const results = await getApi("list-supermarket");
        setShoppingList(results);
        setRefreshItems(false);
      } catch (error) {}
    };

    if (loadItems || refreshItems) {
      setLoadItems(false);
      fetchShoppingList();
    }
  }, [loadItems, refreshItems]);

  const finishPurchase = useCallback(async () => {
    try {
      await postApi("list-supermarket/finish-purchase");

      dispatch(
        setInfoToast({
          open: true,
          message: "Compra finalizada com sucesso!",
          type: "success",
        })
      );
      setLoadItems(true);
    } catch (error) {
      console.error("Error finishing purchase:", error);
      dispatch(
        setInfoToast({
          open: true,
          message: "Erro ao finalizar compra. Tente novamente.",
          type: "error",
        })
      );
    }
  }, [postApi, dispatch]);

  const value: ShoppingContextType = {
    shoppingList,
    progress,
    setProgress,
    setShoppingList,
    loadItems,
    setLoadItems,
    totalPurchase,
    setTotalPurchase,
    refreshItems,
    setRefreshItems,
    finishPurchase,
  };

  return <ShoppingContext.Provider value={value}>{children}</ShoppingContext.Provider>;
};

export const useShoppingContext = () => {
  const context = useContext(ShoppingContext);
  if (!context) {
    throw new Error("useShoppingContext must be used within a ShoppingProvider");
  }
  return context;
};
