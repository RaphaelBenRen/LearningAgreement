import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import type { ApplicationStatus, Major } from '@/types/database'

export default async function InternationalDashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Récupérer TOUTES les applications
  const { data: applications } = await supabase
    .from('applications')
    .select(`
      *,
      student:profiles!applications_student_id_fkey(*),
      major_head:profiles!applications_major_head_id_fkey(*),
      academic_year:academic_years(*)
    `)
    .order('updated_at', { ascending: false })

  // Récupérer les majeures pour les filtres
  const { data: majors } = await supabase
    .from('majors')
    .select('*')
    .order('name')

  // Stats
  const statusCounts = applications?.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1
    return acc
  }, {} as Record<ApplicationStatus, number>) || {}

  const waitingForFinal = applications?.filter((app) => app.status === 'validated_major') || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Service International</h1>
        <p className="mt-1 text-gray-600">Vue globale de tous les Learning Agreements</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-500">Brouillon</p>
          <p className="mt-1 text-3xl font-bold text-gray-400">{statusCounts.draft || 0}</p>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-500">Soumis</p>
          <p className="mt-1 text-3xl font-bold text-blue-600">{statusCounts.submitted || 0}</p>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-500">Validé Respo</p>
          <p className="mt-1 text-3xl font-bold text-purple-600">{statusCounts.validated_major || 0}</p>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-500">Validé Final</p>
          <p className="mt-1 text-3xl font-bold text-green-600">{statusCounts.validated_final || 0}</p>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-500">Total</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{applications?.length || 0}</p>
        </div>
      </div>

      {/* Dossiers en attente de validation finale */}
      {waitingForFinal.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            En attente de validation finale ({waitingForFinal.length})
          </h2>
          <div className="space-y-4">
            {waitingForFinal.map((app) => (
              <Link
                key={app.id}
                href={`/international/application/${app.id}`}
                className="block rounded-xl border-2 border-purple-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {(app.student as { full_name: string })?.full_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {app.university_name} - {app.university_city}, {app.university_country}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Responsable : {(app.major_head as { full_name: string })?.full_name}
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-purple-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Donner la validation finale
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tous les dossiers avec filtres */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Tous les dossiers</h2>

        {/* Liste des majeures pour contexte */}
        <div className="mb-4 flex flex-wrap gap-2">
          {majors?.map((major: Major) => (
            <span
              key={major.id}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
            >
              {major.name}
            </span>
          ))}
        </div>

        {applications && applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-gray-500">
                  <th className="pb-3 font-medium">Étudiant</th>
                  <th className="pb-3 font-medium">Université</th>
                  <th className="pb-3 font-medium">Responsable</th>
                  <th className="pb-3 font-medium">Statut</th>
                  <th className="pb-3 font-medium">Année</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="py-4">
                      <p className="font-medium text-gray-900">
                        {(app.student as { full_name: string })?.full_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(app.student as { email: string })?.email}
                      </p>
                    </td>
                    <td className="py-4">
                      <p className="text-gray-900">{app.university_name}</p>
                      <p className="text-xs text-gray-500">
                        {app.university_city}, {app.university_country}
                      </p>
                    </td>
                    <td className="py-4 text-sm text-gray-600">
                      {(app.major_head as { full_name: string })?.full_name}
                    </td>
                    <td className="py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-4 text-sm text-gray-500">
                      {(app.academic_year as { year: string })?.year}
                    </td>
                    <td className="py-4">
                      <Link
                        href={`/international/application/${app.id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        Voir →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-500">Aucun dossier pour le moment</p>
          </div>
        )}
      </div>
    </div>
  )
}
