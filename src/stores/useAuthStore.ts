import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  userHashId: string | null;
  login: (hashId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userHashId: null,
  login: (hashId: string) => set({ isAuthenticated: true, userHashId: hashId }),
  logout: () => set({ isAuthenticated: false, userHashId: null }),
}));
