export function SetupBanner() {
  return (
    <div className="border-b border-amber-200 bg-amber-100 px-4 py-3 text-center text-sm text-amber-950 dark:bg-amber-950/40 dark:text-amber-100 dark:border-amber-800">
      Supabase n’est pas configuré. Copiez{" "}
      <code className="rounded bg-amber-200/60 px-1.5 py-0.5">env.example</code> vers{" "}
      <code className="rounded bg-amber-200/60 px-1.5 py-0.5">.env.local</code> et renseignez vos clés.
    </div>
  );
}
