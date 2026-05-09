export function SetupBanner() {
  return (
    <div className="bg-amber-100 border-b border-amber-200 px-6 py-3 text-center text-sm text-amber-950">
      Supabase n’est pas configuré. Copiez{" "}
      <code className="rounded bg-amber-200/60 px-1.5 py-0.5">env.example</code> vers{" "}
      <code className="rounded bg-amber-200/60 px-1.5 py-0.5">.env.local</code> et renseignez vos clés.
    </div>
  );
}
