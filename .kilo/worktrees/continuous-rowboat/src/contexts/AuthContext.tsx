"use client";
import type { UserInfo } from "@/types/user.interface";
import { createContext, useContext } from "react";

export type AuthContextType = {
  user: UserInfo | null;
  loading: boolean;
  refetchUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refetchUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);
