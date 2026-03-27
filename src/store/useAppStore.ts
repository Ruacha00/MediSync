import { useContext } from 'react';
import { AppContext } from './appStoreContext';

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppStore must be used within AppProvider');
  return ctx;
}
