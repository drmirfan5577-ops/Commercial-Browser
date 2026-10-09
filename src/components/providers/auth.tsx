import { useCallback, useEffect, useState } from "react";
import { getUser, handleAuthCallback, onAuthChange } from "@netlify/identity";
import type { CallbackResult, User } from "@netlify/identity";
import { AuthContext } from "@/lib/auth-context.ts";

let initialCallback: Promise<CallbackResult | null> | undefined;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [callback, setCallback] = useState<CallbackResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const currentUser = await getUser();
    setUser(currentUser);
    if (currentUser) setError(null);
  }, []);
  const clearCallback = useCallback(() => setCallback(null), []);

  useEffect(() => {
    let active = true;
    const unsubscribe = onAuthChange((_event, currentUser) => {
      if (active) setUser(currentUser);
    });
    initialCallback ??= handleAuthCallback();
    void (async () => {
      try {
        const result = await initialCallback;
        const currentUser = await getUser();
        if (active) {
          setCallback(result ?? null);
          setUser(currentUser);
        }
      } catch {
        if (active)
          setError(
            "The sign-in link could not be verified. Please request a new link.",
          );
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, callback, error, refresh, clearCallback }}
    >
      {children}
    </AuthContext.Provider>
  );
}
