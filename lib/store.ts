import { create } from 'zustand';
import {
  loadUser, logout as storeLogout,
  updateGenres as storeUpdateGenres,
  updateBook as storeUpdateBook,
  removeBook as storeRemoveBook,
} from './user-store';
import { loadExchanges, addExchange as storeAdd, updateStatus as storeUpdate } from './exchange-store';
import type { UserData, BookData } from '@/types/onboarding';
import type { ExchangeRequest, ExchangeStatus } from './exchange-store';

interface AppStore {
  user: UserData | null;
  exchanges: ExchangeRequest[];
  init: () => void;
  refreshExchanges: () => void;
  addExchange: (req: Omit<ExchangeRequest, 'id' | 'requestedAt'>) => void;
  updateExchangeStatus: (id: string, status: ExchangeStatus) => void;
  updateGenres: (genres: string[]) => void;
  updateBook: (book: BookData) => void;
  removeBook: () => void;
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

  updateGenres: (genres) => {
    storeUpdateGenres(genres);
    set((s) => ({ user: s.user ? { ...s.user, genres } : null }));
  },

  updateBook: (book) => {
    storeUpdateBook(book);
    set((s) => ({ user: s.user ? { ...s.user, book } : null }));
  },

  removeBook: () => {
    storeRemoveBook();
    set((s) => ({ user: s.user ? { ...s.user, book: null } : null }));
  },

  logout: () => {
    storeLogout();
    set({ user: null, exchanges: [] });
  },
}));
