import ToastComponent from "@/components/toast/toast.component";
import useToastHandler from "@/hooks/useToast.hook";
import React, { createContext, ReactNode, useContext } from "react";
import { IToastContextType } from "../utils/interfaces";

const ToastContext = createContext<IToastContextType | undefined>(undefined);

export const useToast = (): IToastContextType => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const { visible, message, type, showToast } = useToastHandler();

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && <ToastComponent message={message} type={type} />}
    </ToastContext.Provider>
  );
};
