'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ApplicationCard } from '@/components/dashboard/ApplicationCard'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { DashboardFilterBar } from '@/components/dashboard/DashboardFilterBar'
import type { Application, ApplicationStatus, Profile, AcademicYear } from '@/types/database'

type ApplicationWithRelations = Application & {
    student: Profile
    academic_year: AcademicYear
}

interface ClientAdminDashboardProps {
    applications: ApplicationWithRelations[]
}

export function ClientAdminDashboard({ applications }: ClientAdminDashboardProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all')
    const [sortBy, setSortBy] = useState('updated_desc')

    // Stats derived from FULL list (unfiltered)
    const statusCounts = useMemo(() => {
        return applications.reduce((acc, app) => {
            acc[app.status] = (acc[app.status] || 0) + 1
            return acc
        }, {} as Record<ApplicationStatus, number>)
    }, [applications])

    const pendingCount = (statusCounts.submitted || 0)
    const revisionCount = (statusCounts.revision || 0)
    const validatedCount = (statusCounts.validated_major || 0) + (statusCounts.validated_final || 0)

    // Filtered list
    const filteredApplications = useMemo(() => {
        return applications
            .filter((app) => {
                // Status Filter
                if (statusFilter !== 'all' && app.status !== statusFilter) return false

                // Search Filter
                const searchLower = searchTerm.toLowerCase()
                const studentName = app.student?.full_name?.toLowerCase() || ''
                const city = app.university_city?.toLowerCase() || ''
                const uni = app.university_name?.toLowerCase() || ''

                return (
                    studentName.includes(searchLower) ||
                    city.includes(searchLower) ||
                    uni.includes(searchLower)
                )
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case 'created_desc':
                        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                    case 'created_asc':
                        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                    case 'name_asc':
                        return (a.student?.full_name || '').localeCompare(b.student?.full_name || '')
                    case 'updated_desc':
                    default:
                        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
                }
            })
    }, [applications, searchTerm, statusFilter, sortBy])

    // Pending actions (always show on top if exist, regardless of main list filter? 
    // Probably better to keep them separate as they are urgent items)
    // Logic: Keep "Pending" box as urgent. Main list is searchable.

    const pendingApplications = applications.filter(
        (app) => app.status === 'submitted'
    )

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
                    <p className="mt-1 text-3xl font-bold text-gray-900">{applications.length}</p>
                </div>
            </div>

            {/* Dossiers en attente d'action (Permanent Display for easy access) */}
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
                                            {app.student?.full_name}
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

            {/* Tous les dossiers (Searchable) */}
            <div>
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Tous les dossiers</h2>
                </div>

                <DashboardFilterBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                />

                <div className="mt-6">
                    {filteredApplications.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {filteredApplications.map((app) => (
                                <ApplicationCard
                                    key={app.id}
                                    application={app}
                                    href={`/admin/application/${app.id}`}
                                    showStudent
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center mt-6">
                            <p className="text-gray-500">Aucun dossier trouvé pour ces critères</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
