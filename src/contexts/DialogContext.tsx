import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState(() => () => {});

  const openModalConfirmation = (message, confirmCallback) => {
    setMessage(message);
    setOnConfirm(() => confirmCallback);
    setIsVisible(true);
  };

  const closeModalConfirmation = () => {
    setIsVisible(false);
    setMessage("");
    setOnConfirm(() => () => {});
  };

  return (
    <ModalContext.Provider
      value={{ isVisible, message, onConfirm, openModalConfirmation, closeModalConfirmation }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModalConfirmation = () => useContext(ModalContext);
