import { create } from 'zustand';
import { loadUser, logout as storeLogout } from './user-store';
import { loadExchanges, addExchange as storeAdd, updateStatus as storeUpdate } from './exchange-store';
import type { UserData } from '@/types/onboarding';
import type { ExchangeRequest, ExchangeStatus } from './exchange-store';

interface AppStore {
  user: UserData | null;
  exchanges: ExchangeRequest[];
  init: () => void;
  refreshExchanges: () => void;
  addExchange: (req: Omit<ExchangeRequest, 'id' | 'requestedAt'>) => void;
  updateExchangeStatus: (id: string, status: ExchangeStatus) => void;
  logout: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  exchanges: [],

  init: () => set({ user: loadUser(), exchanges: loadExchanges() }),

  refreshExchanges: () => set({ exchanges: loadExchanges() }),

  addExchange: (req) => {
    const newReq = storeAdd(req);
    set((s) => ({ exchanges: [...s.exchanges, newReq] }));
  },

  updateExchangeStatus: (id, status) => {
    storeUpdate(id, status);
    set((s) => ({
      exchanges: s.exchanges.map((e) => (e.id === id ? { ...e, status } : e)),
    }));
  },

  logout: () => {
    storeLogout();
    set({ user: null, exchanges: [] });
  },
}));
