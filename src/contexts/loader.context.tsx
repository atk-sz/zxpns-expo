import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ILoaderContext {
  loading: boolean;
  message: string;
  showLoader: (msg?: string) => void;
  hideLoader: () => void;
}

const LoaderContext = createContext<ILoaderContext | undefined>(undefined);

export const LoaderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Loading...');

  const showLoader = (msg = 'Loading...') => {
    setMessage(msg);
    setLoading(true);
  };

  const hideLoader = () => {
    setLoading(false);
    setMessage('Loading...');
  };

  return (
    <LoaderContext.Provider value={{ loading, message, showLoader, hideLoader }}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }
  return context;
};
