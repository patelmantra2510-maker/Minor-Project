import React, { createContext, useContext, useState } from 'react';

interface CompareContextType {
  compareIds: string[];
  addToCompare: (id: string) => boolean;
  removeFromCompare: (id: string) => void;
  toggleCompare: (id: string) => boolean;
  clearCompare: () => void;
  isComparing: (id: string) => boolean;
  isCompareModalOpen: boolean;
  openCompareModal: () => void;
  closeCompareModal: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const addToCompare = (id: string): boolean => {
    if (compareIds.includes(id)) return true;
    if (compareIds.length >= 3) {
      alert('You can compare a maximum of 3 scholarships at a time.');
      return false;
    }
    setCompareIds((prev) => [...prev, id]);
    return true;
  };

  const removeFromCompare = (id: string) => {
    setCompareIds((prev) => prev.filter((item) => item !== id));
  };

  const toggleCompare = (id: string): boolean => {
    if (compareIds.includes(id)) {
      removeFromCompare(id);
      return false;
    } else {
      return addToCompare(id);
    }
  };

  const clearCompare = () => {
    setCompareIds([]);
  };

  const isComparing = (id: string) => compareIds.includes(id);

  const openCompareModal = () => setIsCompareModalOpen(true);
  const closeCompareModal = () => setIsCompareModalOpen(false);

  return (
    <CompareContext.Provider
      value={{
        compareIds,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        clearCompare,
        isComparing,
        isCompareModalOpen,
        openCompareModal,
        closeCompareModal,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
