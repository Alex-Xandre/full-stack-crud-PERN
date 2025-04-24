import { create } from 'zustand';

interface User {
  email: string;
  name: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User | null) => void;
  logout: () => void;
  setUser: (userData: User) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: (userData) => set({ isAuthenticated: true, user: userData }),
  logout: () => set({ isAuthenticated: false, user: null }),
  setUser: (userData) => set({ user: userData }),
}));

export default useAuthStore;
