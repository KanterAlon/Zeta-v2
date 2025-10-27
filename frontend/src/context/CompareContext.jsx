import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CompareContext = createContext();

const STORAGE_KEY = 'nut:compare-items';
const MAX_ITEMS = 10;

const readStorage = () => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) return parsed.filter(item => item?.code);
  } catch (err) {
    console.warn('CompareContext: error reading storage', err);
  }
  return [];
};

export const CompareProvider = ({ children }) => {
  const [items, setItems] = useState(() => readStorage());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.warn('CompareContext: error saving storage', err);
    }
  }, [items]);

  const addItem = useCallback((item) => {
    if (!item?.code) return;
    setItems(prev => {
      if (prev.some(p => p.code === item.code) || prev.length >= MAX_ITEMS) return prev;
      return [...prev, { code: item.code, name: item.name || 'Producto sin nombre', image: item.image || null }];
    });
  }, []);

  const removeItem = useCallback((code) => {
    setItems(prev => prev.filter(item => item.code !== code));
  }, []);

  const clearItems = useCallback(() => {
    setItems([]);
  }, []);

  const toggleItem = useCallback((item) => {
    if (!item?.code) return;
    setItems(prev => {
      if (prev.some(p => p.code === item.code)) {
        return prev.filter(p => p.code !== item.code);
      }
      if (prev.length >= MAX_ITEMS) return prev;
      return [...prev, { code: item.code, name: item.name || 'Producto sin nombre', image: item.image || null }];
    });
  }, []);

  const value = useMemo(() => ({
    items,
    addItem,
    removeItem,
    clearItems,
    toggleItem,
    hasItem: (code) => items.some(item => item.code === code),
    maxItems: MAX_ITEMS
  }), [items, addItem, removeItem, clearItems, toggleItem]);

  return (
    <CompareContext.Provider value={value}>
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
