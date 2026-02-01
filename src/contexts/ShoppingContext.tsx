import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useApi } from "~/ApiContext";
import { setInfoToast } from "~/store/reducers/geral";
import { IListPurchaseView, ShoppingContextType, ShoppingProviderProps } from "~/types/shopList";
import { getLengthTotalOfList, getTotalMarkedItems } from "~/utils/sumUtils";
import { useModalConfirmation } from "./DialogContext";

const ShoppingContext = createContext<ShoppingContextType | undefined>(undefined);

export const ShoppingProvider: React.FC<ShoppingProviderProps> = ({ children }) => {
  const confirmationModal = useModalConfirmation();
  const [shoppingList, setShoppingList] = useState<IListPurchaseView[]>([]);
  const [loadItems, setLoadItems] = useState<boolean>(false);
  const [totalPurchase, setTotalPurchase] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [refreshItems, setRefreshItems] = useState<boolean>(false);
  const [anyItemMarked, setAnyItemMarked] = useState(false);

  const { getApi, postApi } = useApi();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchShoppingList = async () => {
      const results = await getApi("list-supermarket");
      setShoppingList(results);
      setRefreshItems(false);
    };

    if (loadItems || refreshItems) {
      setLoadItems(false);
      fetchShoppingList();
    }
  }, [loadItems, refreshItems]);

  useEffect(() => {
    const calculateDerivedValues = () => {
      const totalItems = getLengthTotalOfList(shoppingList);
      const markedItems = getTotalMarkedItems(shoppingList);
      const totalCost = shoppingList.reduce(
        (sum, list) => sum + list.items.reduce((subSum, item) => subSum + (item.amount || 0), 0),
        0
      );

      setProgress(totalItems > 0 ? Math.round((markedItems / totalItems) * 100) : 0);
      setTotalPurchase(totalCost);
      checkMarkedItems();
    };

    calculateDerivedValues();
  }, [shoppingList]);

  const checkMarkedItems = () => {
    const hasMarkedItems = shoppingList.some((list) =>
      list.items.some((item) => item.checked && item.amount > 0 && item.totalCaught)
    );
    setAnyItemMarked(hasMarkedItems);
  };

  const finishPurchase = useCallback(async () => {
    confirmationModal.openModalConfirmation("Deseja realmente finalizar a compra?", async () => {
      await postApi("list-supermarket/finish-purchase");

      dispatch(
        setInfoToast({
          open: true,
          message: "Compra finalizada com sucesso!",
          type: "success",
        })
      );
      setLoadItems(true);
    });
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
    anyItemMarked,
    setAnyItemMarked,
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
