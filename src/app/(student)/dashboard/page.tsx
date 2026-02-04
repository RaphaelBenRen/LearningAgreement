import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ApplicationCard } from '@/components/dashboard/ApplicationCard'
import { StatusTimeline } from '@/components/dashboard/StatusTimeline'

export default async function StudentDashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Récupérer le profil et la majeure
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, majors(*)')
    .eq('id', user.id)
    .single()

  // Récupérer l'année scolaire courante
  const { data: currentYear } = await supabase
    .from('academic_years')
    .select('*')
    .eq('is_current', true)
    .single()

  // Récupérer les applications de l'étudiant
  const { data: applications } = await supabase
    .from('applications')
    .select('*, academic_year:academic_years(*)')
    .eq('student_id', user.id)
    .order('created_at', { ascending: false })

  const currentApplication = applications?.find(
    (app) => app.academic_year_id === currentYear?.id
  )

  const hasCurrentApplication = !!currentApplication

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mon Learning Agreement</h1>
          <p className="mt-1 text-gray-600">
            Année scolaire {currentYear?.year || 'Non définie'}
          </p>
        </div>

        {!hasCurrentApplication && (
          <Link
            href="/application/new"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Créer mon dossier
          </Link>
        )}
      </div>

      {/* Dossier actuel */}
      {currentApplication ? (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {currentApplication.university_name}
              </h2>
              <p className="text-gray-600">
                {currentApplication.university_city}, {currentApplication.university_country}
              </p>
            </div>
            <Link
              href={`/application/${currentApplication.id}`}
              className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
            >
              Voir le dossier
            </Link>
          </div>

          <div className="mt-6">
            <StatusTimeline currentStatus={currentApplication.status} />
          </div>

          {(currentApplication.status === 'draft' || currentApplication.status === 'revision') && (
            <div className="mt-6 rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-blue-800">
                <strong>Action requise :</strong>{' '}
                {currentApplication.status === 'draft'
                  ? 'Complétez votre dossier et soumettez-le à votre responsable de majeure.'
                  : 'Votre responsable a demandé des modifications. Consultez les commentaires et corrigez votre dossier.'}
              </p>
              <Link
                href={`/application/${currentApplication.id}`}
                className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Modifier mon dossier →
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Aucun dossier pour cette année
          </h3>
          <p className="mt-2 text-gray-500">
            Créez votre dossier Learning Agreement pour commencer le processus de validation.
          </p>
          <Link
            href="/application/new"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Créer mon dossier
          </Link>
        </div>
      )}

      {/* Historique */}
      {applications && applications.length > 1 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Historique</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {applications
              .filter((app) => app.id !== currentApplication?.id)
              .map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  href={`/application/${app.id}`}
                />
              ))}
          </div>
        </div>
      )}

      {/* Infos */}
      <div className="rounded-xl border bg-white p-6">
        <h3 className="font-semibold text-gray-900">Informations</h3>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-gray-500">Majeure</dt>
            <dd className="font-medium text-gray-900">
              {(profile as { majors?: { name: string } })?.majors?.name || 'Non définie'}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Email</dt>
            <dd className="font-medium text-gray-900">{profile?.email}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
