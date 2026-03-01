"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions/admin";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, {});

  return (
    <form action={action} className="flex flex-col gap-4 w-full max-w-sm">
      {state.error && (
        <p className="text-red-400 text-sm">{state.error}</p>
      )}
      <input
        type="password"
        name="password"
        placeholder="Password"
        required
        autoFocus
        className="bg-white/5 border border-white/10 rounded px-3 py-2 text-foreground placeholder:text-secondary focus:outline-none focus:border-accent"
      />
      <button
        type="submit"
        disabled={pending}
        className="bg-accent text-bg font-medium rounded px-3 py-2 hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
