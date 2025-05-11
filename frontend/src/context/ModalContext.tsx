import React, { createContext, useContext, useState } from 'react';

type ModalContextType = {
  masBuscadosModalOpen: boolean;
  setMasBuscadosModalOpen: (open: boolean) => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [masBuscadosModalOpen, setMasBuscadosModalOpen] = useState(false);
  return (
    <ModalContext.Provider value={{ masBuscadosModalOpen, setMasBuscadosModalOpen }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModalContext debe usarse dentro de ModalProvider');
  return ctx;
}; 