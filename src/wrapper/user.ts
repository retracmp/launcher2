import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type UserManager = {
  _token: string | null;
  _user: User | null;

  login: (token: string) => void;
  logout: () => void;

  load: (user: User) => void;
};

export const useUserManager = create<UserManager>()(
  persist(
    (set) => ({
      _token: null,
      _user: null,

      login: (token) => {
        set({ _token: token });
      },
      logout: () => {
        set({ _token: null, _user: null });
      },

      load: (user) => {
        set({ _user: user });
      },
    }),
    {
      name: "token",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ _token: s._token }),
    }
  )
);
