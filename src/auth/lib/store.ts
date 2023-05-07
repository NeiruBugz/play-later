import { create } from "zustand";

export interface User {
  uid: string;
  authorized: boolean;
  username: string;
  avatarUrl?: string;
}

export interface AuthStore extends User {
  setUser: (payload: User) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  uid: "",
  authorized: false,
  username: "",
  avatarUrl: "",
  setUser: (payload) => set(payload),
}));

export { useAuthStore };
