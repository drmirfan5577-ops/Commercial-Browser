import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./use-auth.ts";

export type AppData = {
  customApps: {
    _id: string;
    name: string;
    nameUrdu?: string;
    url: string;
    icon: string;
    row: number;
    position: number;
    isActive: boolean;
  }[];
  tickers: { _id: string; message: string; isActive: boolean; order: number }[];
  theme: string | null;
};

export function useAppData() {
  const { user, isLoading } = useAuth();
  return useQuery<AppData>({
    queryKey: ["app-data", user?.id ?? "guest"],
    enabled: !isLoading,
    staleTime: 30_000,
    refetchInterval: 60_000,
    queryFn: async ({ signal }) => {
      const response = await fetch("/api/app-data", {
        credentials: "same-origin",
        signal,
      });
      if (!response.ok)
        throw new Error(
          "Live content is unavailable. Showing built-in apps and messages.",
        );
      return response.json();
    },
  });
}

export function useSaveTheme() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ["app-data", user?.id ?? "guest"];
  return useMutation({
    scope: { id: "save-theme" },
    mutationFn: async (theme: string) => {
      if (!user) throw new Error("Sign in to save your theme.");
      const response = await fetch("/api/preferences", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme }),
      });
      if (!response.ok)
        throw new Error("Your theme could not be saved. Please try again.");
      return response.json() as Promise<{ theme: string }>;
    },
    onSuccess: ({ theme }) => {
      queryClient.setQueryData<AppData>(queryKey, (previous) =>
        previous ? { ...previous, theme } : previous,
      );
      void queryClient.invalidateQueries({ queryKey });
    },
  });
}
