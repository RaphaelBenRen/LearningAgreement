import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ApplicationCard } from '@/components/dashboard/ApplicationCard'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import type { ApplicationStatus } from '@/types/database'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Récupérer les applications gérées par ce responsable
  const { data: applications } = await supabase
    .from('applications')
    .select(`
      *,
      student:profiles!applications_student_id_fkey(*),
      academic_year:academic_years(*)
    `)
    .eq('major_head_id', user.id)
    .order('updated_at', { ascending: false })

  // Compter par statut
  const statusCounts = applications?.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1
    return acc
  }, {} as Record<ApplicationStatus, number>) || {}

  const pendingCount = (statusCounts.submitted || 0)
  const revisionCount = (statusCounts.revision || 0)
  const validatedCount = (statusCounts.validated_major || 0) + (statusCounts.validated_final || 0)

  // Filtrer les dossiers en attente d'action
  const pendingApplications = applications?.filter(
    (app) => app.status === 'submitted'
  ) || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="mt-1 text-gray-600">Gestion des Learning Agreements de vos étudiants</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-500">En attente</p>
          <p className="mt-1 text-3xl font-bold text-blue-600">{pendingCount}</p>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-500">En révision</p>
          <p className="mt-1 text-3xl font-bold text-yellow-600">{revisionCount}</p>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-500">Validés</p>
          <p className="mt-1 text-3xl font-bold text-green-600">{validatedCount}</p>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-500">Total</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{applications?.length || 0}</p>
        </div>
      </div>

      {/* Dossiers en attente d'action */}
      {pendingApplications.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            En attente de validation ({pendingApplications.length})
          </h2>
          <div className="space-y-4">
            {pendingApplications.map((app) => (
              <Link
                key={app.id}
                href={`/admin/application/${app.id}`}
                className="block rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {(app.student as { full_name: string })?.full_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {app.university_name} - {app.university_city}, {app.university_country}
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-blue-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                  Examiner le dossier
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tous les dossiers */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Tous les dossiers</h2>
        {applications && applications.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {applications.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                href={`/admin/application/${app.id}`}
                showStudent
              />
            ))}
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
