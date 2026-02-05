import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-50/80 backdrop-blur-md border-b-0 border-transparent pt-4">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-blue-900 rounded-sm flex items-center justify-center text-white font-bold text-lg">LA</div>
              <span className="text-xl font-bold text-blue-900 font-serif">Learning Agreement</span>
            </div>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="rounded-sm px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-50 transition-colors"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="rounded-sm bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 transition-colors"
              >
                Inscription
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-blue-900 font-serif sm:text-5xl">
            Gérez votre Learning Agreement
            <br />
            <span className="text-blue-700">simplement</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Plateforme dédiée aux étudiants ING5 de l&apos;ECE Paris pour faciliter
            la validation de vos cours en échange international.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/register"
              className="rounded-sm bg-blue-900 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-800 transition-colors"
            >
              Commencer maintenant
            </Link>
            <Link
              href="/login"
              className="rounded-sm border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
            >
              J&apos;ai déjà un compte
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-blue-900 font-serif">
              Saisie simplifiée
            </h3>
            <p className="mt-2 text-gray-600">
              Renseignez vos cours via un formulaire structuré avec tous les détails nécessaires.
            </p>
          </div>

          <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-blue-900 font-serif">
              Validation rapide
            </h3>
            <p className="mt-2 text-gray-600">
              Suivez l&apos;avancement de votre dossier en temps réel et recevez des notifications.
            </p>
          </div>

          <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-purple-100">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-blue-900 font-serif">
              Communication centralisée
            </h3>
            <p className="mt-2 text-gray-600">
              Échangez directement avec votre responsable de majeure sans perdre le fil.
            </p>
          </div>
        </div>

        {/* Process */}
        <div className="mt-24">
          <h3 className="text-center text-2xl font-bold text-blue-900 font-serif">
            Comment ça marche ?
          </h3>
          <div className="mt-12 flex w-full items-center justify-between px-10 sm:px-24">
            {/* Step 1 */}
            <div className="flex flex-1 items-center">
              <div className="relative flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-600 bg-blue-600 text-white font-bold">
                  1
                </div>
                <span className="absolute -bottom-10 w-40 text-center text-sm font-medium text-blue-900 font-serif">Créez votre compte</span>
                <span className="absolute -bottom-16 w-40 text-center text-xs text-gray-500">Avec votre email ECE</span>
              </div>
              <div className="h-px flex-1 mx-4 bg-slate-200" />
            </div>

            {/* Step 2 */}
            <div className="flex flex-1 items-center">
              <div className="relative flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-600 bg-blue-600 text-white font-bold">
                  2
                </div>
                <span className="absolute -bottom-10 w-40 text-center text-sm font-medium text-blue-900 font-serif">Saisissez vos cours</span>
                <span className="absolute -bottom-16 w-40 text-center text-xs text-gray-500">Avec tous les détails</span>
              </div>
              <div className="h-px flex-1 mx-4 bg-slate-200" />
            </div>

            {/* Step 3 */}
            <div className="flex flex-1 items-center">
              <div className="relative flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-600 bg-blue-600 text-white font-bold">
                  3
                </div>
                <span className="absolute -bottom-10 w-40 text-center text-sm font-medium text-blue-900 font-serif">Soumettez au responsable</span>
                <span className="absolute -bottom-16 w-40 text-center text-xs text-gray-500">De votre majeure</span>
              </div>
              <div className="h-px flex-1 mx-4 bg-slate-200" />
            </div>

            {/* Step 4 */}
            <div className="flex flex-none items-center">
              <div className="relative flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-600 bg-blue-600 text-white font-bold">
                  4
                </div>
                <span className="absolute -bottom-10 w-40 text-center text-sm font-medium text-blue-900 font-serif">Validation finale</span>
                <span className="absolute -bottom-16 w-40 text-center text-xs text-gray-500">Par le service inter</span>
              </div>
            </div>
          </div>
          {/* Spacer for bottom labels */}
          <div className="h-16" />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            ECE Paris - Plateforme Learning Agreement - {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
