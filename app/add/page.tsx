import { AddProjectWizard } from "@/frontend/components/add/AddProjectWizard";

export default function AddProjectPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
      <p className="text-sm font-bold uppercase tracking-wider text-green-700 dark:text-green-400">
        SHARE YOUR PROJECT
      </p>
      <h1 className="font-display mt-2 text-balance text-3xl font-black text-gray-900 dark:text-white md:text-5xl">
        Ajoutez un projet au catalogue
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Référencez un dépôt open source lié au Bénin, le vôtre ou celui que
        vous recommandez.
      </p>
      <AddProjectWizard />
    </div>
  );
}
