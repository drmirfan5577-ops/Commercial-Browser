import { useContext } from "react";
import { AuthContext } from "@/lib/auth-context.ts";

export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("useAuth must be used within AuthProvider.");
  return auth;
}

export function useUser() {
  return useAuth().user;
}
