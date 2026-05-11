"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (err) {
        setError(err.message);
        return;
      }
      router.refresh();
      router.push("/");
    } catch {
      setError("Connexion impossible.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="font-display text-center text-balance text-3xl font-black text-gray-900 dark:text-white sm:text-4xl">
        Connexion
      </h1>
      {message === "check_email" ? (
        <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-center text-sm text-green-900">
          Vérifiez votre boîte mail pour confirmer votre compte (si activé).
        </p>
      ) : null}
      <form onSubmit={onSubmit} className="mt-10 space-y-5">
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        ) : null}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Email
          </label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Mot de passe
          </label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-green-600 py-4 font-bold text-white hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "…" : "Se connecter"}
        </button>
      </form>
      <p className="mt-8 text-center text-sm">
        Pas encore de compte ?{" "}
        <Link href="/join" className="font-semibold text-green-700 dark:text-green-400">
          S’inscrire
        </Link>
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Chargement…</div>}>
      <SignInForm />
    </Suspense>
  );
}
