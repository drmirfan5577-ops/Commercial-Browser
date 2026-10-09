import { createContext } from "react";
import type { CallbackResult, User } from "@netlify/identity";

export type AuthState = {
  user: User | null;
  isLoading: boolean;
  callback: CallbackResult | null;
  error: string | null;
  refresh: () => Promise<void>;
  clearCallback: () => void;
};

export const AuthContext = createContext<AuthState | null>(null);
