import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="font-display text-4xl font-black text-gray-900">404</h1>
      <p className="mt-2 text-gray-600">Page ou projet introuvable.</p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700"
      >
        Retour à l’accueil
      </Link>
    </div>
  );
}
