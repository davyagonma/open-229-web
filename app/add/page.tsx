import { AddProjectWizard } from "@/frontend/components/add/AddProjectWizard";

export default function AddProjectPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-sm font-bold uppercase tracking-wider text-green-700">
        SHARE YOUR PROJECT
      </p>
      <h1 className="font-display mt-2 text-4xl font-black text-gray-900 md:text-5xl">
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
