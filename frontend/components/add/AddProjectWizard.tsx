"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  CATEGORY_OPTIONS,
  STATUS_OPTIONS,
  TECH_PRESETS,
} from "@/lib/constants";
import type { ProjectCategory, ProjectStatus } from "@/lib/types/database";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

const STEPS = 6;

type ExtraContributor = { name: string };

export function AddProjectWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [sessionReady, setSessionReady] = useState(false);
  const [unauth, setUnauth] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [category, setCategory] = useState<ProjectCategory>("web_app");
  const [status, setStatus] = useState<ProjectStatus>("active");
  const [github, setGithub] = useState("");
  const [gitlab, setGitlab] = useState("");
  const [demo, setDemo] = useState("");
  const [stack, setStack] = useState<string[]>([]);
  const [customTech, setCustomTech] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [keyFeatures, setKeyFeatures] = useState("");
  const [guidelines, setGuidelines] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [extras, setExtras] = useState<ExtraContributor[]>([]);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSessionReady(true);
      if (!session) {
        setUnauth(true);
        return;
      }
      const { data: prof } = await supabase
        .from("profiles")
        .select("display_name, username")
        .eq("id", session.user.id)
        .maybeSingle();
      if (prof?.display_name) setContactName(prof.display_name);
    })();
  }, []);

  function toggleTech(t: string) {
    setStack((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  }

  function addCustomTech() {
    const t = customTech.trim();
    if (!t || stack.includes(t)) return;
    setStack((s) => [...s, t]);
    setCustomTech("");
  }

  function addExtraContributor() {
    setExtras((x) => [...x, { name: "" }]);
  }

  function updateExtra(i: number, name: string) {
    setExtras((prev) => {
      const n = [...prev];
      n[i] = { name };
      return n;
    });
  }

  function removeExtra(i: number) {
    setExtras((prev) => prev.filter((_, j) => j !== i));
  }

  function canAdvance(): boolean {
    switch (step) {
      case 1:
        return name.trim().length >= 2 && shortDesc.trim().length >= 10;
      case 2:
        return true;
      case 3:
        return stack.length > 0;
      case 4:
        return true;
      case 5:
        return contactName.trim().length >= 1;
      default:
        return true;
    }
  }

  async function submit() {
    setError(null);
    setSubmitting(true);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setUnauth(true);
        return;
      }

      const contributors = [
        {
          display_name: contactName.trim(),
          role: "Primary contact",
        },
        ...extras
          .map((e) => e.name.trim())
          .filter(Boolean)
          .map((display_name) => ({
            display_name,
            role: "Contributor",
          })),
      ];

      const body = {
        name: name.trim(),
        short_description: shortDesc.trim(),
        full_description: fullDesc.trim() || null,
        category,
        status,
        github_url: github.trim() || null,
        gitlab_url: gitlab.trim() || null,
        demo_url: demo.trim() || null,
        license: null,
        contributing_url: guidelines.trim() || null,
        key_features: keyFeatures.trim() || null,
        stack,
        contributors,
        is_published: true,
      };

      const res = await fetch("/api/v1/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(body),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          typeof json.error === "string"
            ? json.error
            : "Impossible d’enregistrer le projet."
        );
        return;
      }
      const slug = json.data?.slug as string | undefined;
      if (slug) router.push(`/projects/${slug}`);
      else router.push("/search");
    } catch {
      setError("Erreur réseau.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!sessionReady) {
    return <p className="py-12 text-center text-gray-500">Chargement…</p>;
  }
  if (unauth) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-8 text-center">
        <p className="font-semibold text-amber-900">
          Connectez-vous pour ajouter un projet.
        </p>
        <Link
          href="/signin"
          className="mt-4 inline-block font-bold text-indigo-600 underline"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  const pct = Math.round((step / STEPS) * 100);

  return (
    <div className="mt-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-gray-600">
          Étape {step} / {STEPS}
        </p>
        <div className="h-2 flex-1 max-w-md overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-green-600 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-sm font-bold text-gray-900">{pct}%</span>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-2">
        {Array.from({ length: STEPS }, (_, i) => (
          <div
            key={i}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
              i + 1 <= step
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {i + 1 < step ? <Check className="h-4 w-4" /> : i + 1}
          </div>
        ))}
      </div>

      {error ? (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      {step === 1 ? (
        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold">Project basics</h2>
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Nom du projet *
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Catégorie *
            </label>
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as ProjectCategory)
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Description courte *
            </label>
            <textarea
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">Statut</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold">Liens</h2>
          <div>
            <label className="mb-2 block text-sm font-semibold">GitHub</label>
            <input
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="https://github.com/..."
              className="w-full rounded-xl border border-gray-200 px-4 py-3"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">GitLab</label>
            <input
              value={gitlab}
              onChange={(e) => setGitlab(e.target.value)}
              placeholder="https://gitlab.com/..."
              className="w-full rounded-xl border border-gray-200 px-4 py-3"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Démo live
            </label>
            <input
              value={demo}
              onChange={(e) => setDemo(e.target.value)}
              placeholder="https://"
              className="w-full rounded-xl border border-gray-200 px-4 py-3"
            />
          </div>
        </section>
      ) : null}

      {step === 3 ? (
        <section>
          <h2 className="font-display mb-4 text-2xl font-bold">Stack</h2>
          <div className="mb-4 flex flex-wrap gap-2">
            {TECH_PRESETS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => toggleTech(t)}
                className={
                  stack.includes(t)
                    ? "rounded-xl bg-green-600 px-3 py-2 text-sm font-bold text-white"
                    : "rounded-xl bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                }
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={customTech}
              onChange={(e) => setCustomTech(e.target.value)}
              placeholder="Autre techno"
              className="flex-1 rounded-xl border border-gray-200 px-4 py-3"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomTech())}
            />
            <button
              type="button"
              onClick={addCustomTech}
              className="rounded-xl bg-gray-900 px-4 py-3 font-semibold text-white"
            >
              Add
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Sélectionné : {stack.length ? stack.join(", ") : "—"}
          </p>
        </section>
      ) : null}

      {step === 4 ? (
        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold">Détails</h2>
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Description longue (markdown possible)
            </label>
            <textarea
              value={fullDesc}
              onChange={(e) => setFullDesc(e.target.value)}
              rows={8}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 font-mono text-sm"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Points clés
            </label>
            <textarea
              value={keyFeatures}
              onChange={(e) => setKeyFeatures(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-gray-200 px-4 py-3"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">
              URL contributing (optionnel)
            </label>
            <input
              value={guidelines}
              onChange={(e) => setGuidelines(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3"
            />
          </div>
        </section>
      ) : null}

      {step === 5 ? (
        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold">Contributeurs</h2>
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Contact principal *
            </label>
            <input
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="mb-3 w-full rounded-xl border border-gray-200 px-4 py-3"
              placeholder="Nom"
            />
            <input
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              type="email"
              className="w-full rounded-xl border border-gray-200 px-4 py-3"
              placeholder="Email (optionnel, non affiché publiquement)"
            />
          </div>
          {extras.map((ex, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={ex.name}
                onChange={(e) => updateExtra(i, e.target.value)}
                placeholder="Nom contributeur"
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3"
              />
              <button
                type="button"
                onClick={() => removeExtra(i)}
                className="text-sm text-red-600"
              >
                Retirer
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addExtraContributor}
            className="text-sm font-semibold text-indigo-600"
          >
            + Contributeur
          </button>
        </section>
      ) : null}

      {step === 6 ? (
        <section>
          <h2 className="font-display mb-6 text-2xl font-bold">Vérification</h2>
          <dl className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6">
            <div>
              <dt className="text-xs font-bold uppercase text-gray-400">
                Nom
              </dt>
              <dd className="text-lg font-semibold">{name || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase text-gray-400">
                Catégorie
              </dt>
              <dd>{CATEGORY_OPTIONS.find((c) => c.value === category)?.label}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase text-gray-400">
                Description
              </dt>
              <dd className="text-gray-600">{shortDesc || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase text-gray-400">
                Stack
              </dt>
              <dd>{stack.join(", ") || "—"}</dd>
            </div>
          </dl>
          <p className="mt-6 text-sm text-gray-500">
            En soumettant, vous acceptez les règles de la communauté open-229
            (projets documentés, véritablement open source).
          </p>
        </section>
      ) : null}

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 disabled:opacity-40"
        >
          <ChevronLeft className="h-5 w-5" /> Retour
        </button>
        {step < STEPS ? (
          <button
            type="button"
            onClick={() => canAdvance() && setStep((s) => s + 1)}
            disabled={!canAdvance()}
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700 disabled:opacity-40"
          >
            Suivant <ChevronRight className="h-5 w-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={submitting || !canAdvance()}
            className="rounded-xl bg-gray-900 px-8 py-4 font-bold text-white hover:bg-black disabled:opacity-50"
          >
            {submitting ? "Envoi…" : "Publier le projet"}
          </button>
        )}
      </div>
    </div>
  );
}
