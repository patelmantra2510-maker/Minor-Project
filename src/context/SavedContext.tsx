import React, { createContext, useContext, useEffect, useState } from 'react';

interface SavedContextType {
  savedIds: string[];
  recentlyViewedIds: string[];
  toggleSave: (id: string) => void;
  isSaved: (id: string) => boolean;
  addRecentlyViewed: (id: string) => void;
  clearSaved: () => void;
}

const SavedContext = createContext<SavedContextType | undefined>(undefined);

export const SavedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('vidyasetu_saved_ids');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('vidyasetu_recent_ids');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('vidyasetu_saved_ids', JSON.stringify(savedIds));
  }, [savedIds]);

  useEffect(() => {
    localStorage.setItem('vidyasetu_recent_ids', JSON.stringify(recentlyViewedIds));
  }, [recentlyViewedIds]);

  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const isSaved = (id: string) => savedIds.includes(id);

  const addRecentlyViewed = (id: string) => {
    setRecentlyViewedIds((prev) => {
      const filtered = prev.filter((item) => item !== id);
      // Keep only 5 most recent
      return [id, ...filtered].slice(0, 5);
    });
  };

  const clearSaved = () => {
    setSavedIds([]);
  };

  return (
    <SavedContext.Provider
      value={{
        savedIds,
        recentlyViewedIds,
        toggleSave,
        isSaved,
        addRecentlyViewed,
        clearSaved,
      }}
    >
      {children}
    </SavedContext.Provider>
  );
};

export const useSaved = () => {
  const context = useContext(SavedContext);
  if (!context) {
    throw new Error('useSaved must be used within a SavedProvider');
  }
  return context;
};
