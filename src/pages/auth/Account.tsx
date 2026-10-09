import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  acceptInvite,
  getSettings,
  login,
  logout,
  requestPasswordRecovery,
  signup,
  updateUser,
} from "@netlify/identity";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth.ts";

export default function Account() {
  const {
    user,
    isLoading,
    callback,
    error: callbackError,
    refresh,
    clearCallback,
  } = useAuth();
  const [mode, setMode] = useState<"login" | "signup" | "recover">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const settings = useQuery({
    queryKey: ["identity-settings"],
    queryFn: getSettings,
    retry: false,
  });
  const settingPassword =
    callback?.type === "recovery" || callback?.type === "invite";

  useEffect(() => {
    if (callback && !settingPassword) {
      setMessage(
        callback.type === "confirmation"
          ? "Email confirmed. Your account is ready."
          : "Your account has been verified.",
      );
      clearCallback();
    }
  }, [callback, settingPassword, clearCallback]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      if (callback?.type === "invite") {
        if (!callback.token) throw new Error("Invalid invitation.");
        await acceptInvite(callback.token, password);
        clearCallback();
        setMessage("Invitation accepted. Your account is ready.");
      } else if (callback?.type === "recovery") {
        await updateUser({ password });
        clearCallback();
        setMessage("Your password has been updated.");
      } else if (mode === "recover") {
        await requestPasswordRecovery(email);
        setMessage(
          "If an account exists, a password reset link is on its way. Check your inbox.",
        );
      } else if (mode === "signup") {
        await signup(email, password, { full_name: name });
        setMessage(
          "Account created. Check your inbox if email confirmation is required.",
        );
      } else {
        await login(email, password);
      }
      setPassword("");
      await refresh();
    } catch {
      setError(
        "Unable to complete this request. Check your details and any confirmation email, then try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    setBusy(true);
    setError(null);
    try {
      await logout();
      await refresh();
      setMessage("You are signed out.");
    } catch {
      await refresh();
      setError("Unable to confirm sign-out. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const title = settingPassword
    ? "Set your password"
    : user
      ? "Your account"
      : mode === "signup"
        ? "Create an account"
        : mode === "recover"
          ? "Reset your password"
          : "Welcome back";
  const fieldClass =
    "w-full rounded-xl border border-emerald-200/20 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20";

  return (
    <main
      className="min-h-screen bg-[#09271e] px-6 py-10 text-emerald-50"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="mx-auto max-w-sm">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-emerald-200 hover:text-white"
        >
          <ArrowLeft size={16} /> Back to browser
        </Link>
        <div className="mb-8 mt-12 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200/20 bg-emerald-300/10">
          <LockKeyhole size={24} />
        </div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
          EvEr SmArT BrOwSeR
        </p>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mb-7 mt-3 text-sm leading-relaxed text-emerald-100/65">
          Sign in to keep your theme across visits. Browsing and hubs are
          available without an account.
        </p>
        {(error || callbackError) && (
          <p
            role="alert"
            className="mb-5 rounded-xl border border-red-300/30 bg-red-300/10 p-4 text-sm text-red-100"
          >
            {error || callbackError}
          </p>
        )}
        {message && (
          <p
            role="status"
            className="mb-5 rounded-xl border border-emerald-300/30 bg-emerald-300/10 p-4 text-sm"
          >
            {message}
          </p>
        )}
        {isLoading ? (
          <div role="status" className="animate-pulse space-y-4">
            <p>Checking your account…</p>
            <div className="h-12 rounded-xl bg-white/10" />
            <div className="h-12 rounded-xl bg-white/10" />
          </div>
        ) : user && !settingPassword ? (
          <section className="rounded-2xl border border-emerald-200/20 bg-white/5 p-5">
            <p className="font-semibold">{user.name || "Signed in"}</p>
            <p className="mt-1 break-all text-sm text-emerald-100/65">
              {user.email}
            </p>
            <Link
              to="/"
              className="mt-6 block rounded-xl bg-emerald-200 px-4 py-3 text-center text-sm font-semibold text-emerald-950"
            >
              Continue browsing
            </Link>
            <button
              disabled={busy}
              onClick={() => void signOut()}
              className="mt-4 w-full py-2 text-sm text-emerald-100/75 disabled:opacity-50"
            >
              {busy ? "Signing out…" : "Sign out"}
            </button>
          </section>
        ) : (
          <form onSubmit={(event) => void submit(event)} className="space-y-5">
            {mode === "signup" && !settingPassword && (
              <label className="block text-sm">
                Name
                <input
                  className={`${fieldClass} mt-2`}
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  maxLength={100}
                />
              </label>
            )}
            {!settingPassword && (
              <label className="block text-sm">
                Email
                <input
                  className={`${fieldClass} mt-2`}
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>
            )}
            {(settingPassword || mode !== "recover") && (
              <label className="block text-sm">
                {settingPassword ? "New password" : "Password"}
                <input
                  className={`${fieldClass} mt-2`}
                  type="password"
                  autoComplete={
                    settingPassword || mode === "signup"
                      ? "new-password"
                      : "current-password"
                  }
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={settingPassword || mode === "signup" ? 8 : 1}
                />
              </label>
            )}
            <button
              disabled={busy || settings.isPending}
              type="submit"
              className="w-full rounded-xl bg-emerald-200 px-4 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-100 disabled:opacity-50"
            >
              {busy
                ? "Please wait…"
                : settingPassword
                  ? "Save password"
                  : mode === "signup"
                    ? "Create account"
                    : mode === "recover"
                      ? "Send reset link"
                      : "Sign in"}
            </button>
            {!settingPassword && (
              <div className="flex flex-wrap justify-between gap-3 text-xs text-emerald-200">
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === "login" ? "recover" : "login");
                    setError(null);
                    setPassword("");
                  }}
                >
                  {mode === "login" ? "Forgot password?" : "Back to sign in"}
                </button>
                {mode !== "signup" &&
                  settings.data &&
                  !settings.data.disableSignup && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signup");
                        setError(null);
                        setPassword("");
                      }}
                    >
                      Create an account
                    </button>
                  )}
              </div>
            )}
            {settings.isError && (
              <p className="text-xs text-emerald-100/65">
                Account settings are unavailable. Try signing in again after the
                site finishes deploying.
              </p>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
