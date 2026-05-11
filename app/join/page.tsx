"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function JoinPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!agree) {
      setError("Veuillez accepter les conditions.");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const origin = window.location.origin;
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${origin}/auth/callback?next=/`,
          data: {
            username: username.trim(),
            display_name: username.trim(),
          },
        },
      });
      if (err) {
        setError(err.message);
        return;
      }
      router.push("/signin?message=check_email");
    } catch {
      setError("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 sm:py-20">
      <p className="text-center text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
        Built for Developers by Developers
      </p>
      <h1 className="font-display mt-4 text-center text-balance text-3xl font-black text-gray-900 dark:text-white md:text-5xl">
        REJOIGNEZ OPEN-229
      </h1>
      <p className="mt-4 text-center text-gray-600 dark:text-neutral-400">
        Cartographions ensemble l’open source du Bénin.
      </p>

      <form onSubmit={onSubmit} className="mt-12 space-y-5">
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        ) : null}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Username
          </label>
          <input
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-green-600"
            autoComplete="username"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Email
          </label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-green-600"
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
            minLength={6}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-green-600"
            autoComplete="new-password"
          />
        </div>
        <label className="flex items-start gap-3 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-1"
          />
          J’accepte les conditions d’utilisation et la politique de
          confidentialité.
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-green-600 py-4 text-lg font-bold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "…" : "Créer mon compte"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        Déjà inscrit ?{" "}
        <Link href="/signin" className="font-semibold text-green-700 dark:text-green-400">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
