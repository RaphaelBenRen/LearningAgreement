'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { DashboardFilterBar } from '@/components/dashboard/DashboardFilterBar'
import type { Application, ApplicationStatus, Profile, AcademicYear, Major } from '@/types/database'
import { NotificationBell } from '@/components/ui/NotificationBell'

type ApplicationWithRelations = Application & {
    student: Profile
    major_head: Profile
    academic_year: AcademicYear
}

interface ClientInternationalDashboardProps {
    applications: ApplicationWithRelations[]
    majors: Major[]
}

export function ClientInternationalDashboard({ applications, majors }: ClientInternationalDashboardProps) {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all')
    const [sortBy, setSortBy] = useState('updated_desc')
    const [majorFilter, setMajorFilter] = useState<string | 'all'>('all')

    // Stats derived from FULL list
    const statusCounts = useMemo(() => {
        return applications.reduce((acc, app) => {
            acc[app.status] = (acc[app.status] || 0) + 1
            return acc
        }, {} as Record<ApplicationStatus, number>)
    }, [applications])

    // Filtered list
    const filteredApplications = useMemo(() => {
        return applications
            .filter((app) => {
                // Status Filter
                if (statusFilter !== 'all' && app.status !== statusFilter) return false

                // Major Filter
                if (majorFilter !== 'all') {
                    const studentMajorId = app.student?.major_id
                    const headMajorId = app.major_head?.major_id

                    if (studentMajorId) {
                        // Si l'étudiant a une majeure, on filtre uniquement dessus
                        if (studentMajorId !== majorFilter) return false
                    } else {
                        // Sinon (étudiant sans majeure), on utilise celle du responsable
                        if (headMajorId !== majorFilter) return false
                    }
                }

                // Search Filter
                const searchLower = searchTerm.toLowerCase()
                const studentName = app.student?.full_name?.toLowerCase() || ''
                const city = app.university_city?.toLowerCase() || ''
                const uni = app.university_name?.toLowerCase() || ''
                const majorHead = app.major_head?.full_name?.toLowerCase() || ''

                return (
                    studentName.includes(searchLower) ||
                    city.includes(searchLower) ||
                    uni.includes(searchLower) ||
                    majorHead.includes(searchLower)
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
    }, [applications, searchTerm, statusFilter, sortBy, majorFilter]) // Add majorFilter dependency

    const waitingForFinal = applications.filter((app) => app.status === 'validated_major')

    return (
        <div className="space-y-8">
            {/* Header supprimé car déplacé dans le layout */}
            <div className="pt-2"></div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
                <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-slate-500">Brouillon</p>
                    <p className="mt-1 text-3xl font-bold text-slate-400">{statusCounts.draft || 0}</p>
                </div>
                <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-slate-500">Soumis</p>
                    <p className="mt-1 text-3xl font-bold text-blue-900">{statusCounts.submitted || 0}</p>
                </div>
                <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-slate-500">Validé Respo</p>
                    <p className="mt-1 text-3xl font-bold text-purple-900">{statusCounts.validated_major || 0}</p>
                </div>
                <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-slate-500">Validé Final</p>
                    <p className="mt-1 text-3xl font-bold text-emerald-700">{statusCounts.validated_final || 0}</p>
                </div>
                <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm col-span-2 lg:col-span-1">
                    <p className="text-sm text-slate-500">Total</p>
                    <p className="mt-1 text-3xl font-bold text-slate-900">{applications.length}</p>
                </div>
            </div>

            {/* Dossiers en attente de validation finale */}
            {waitingForFinal.length > 0 && (
                <div>
                    <h2 className="mb-4 text-lg font-semibold text-blue-900 font-serif">
                        En attente de validation finale ({waitingForFinal.length})
                    </h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {waitingForFinal.map((app) => (
                            <Link
                                key={app.id}
                                href={`/international/application/${app.id}`}
                                className="block rounded-sm border-2 border-purple-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md hover:border-purple-200"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-semibold text-blue-900">
                                            {app.student?.full_name}
                                        </p>
                                        <p className="text-sm text-slate-600">
                                            {app.university_name} - {app.university_city}, {app.university_country}
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Responsable : {app.major_head?.full_name}
                                        </p>
                                    </div>
                                    <StatusBadge status={app.status} />
                                </div>
                                <div className="mt-4 flex items-center gap-2 text-sm text-purple-800 font-medium">
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
                <h2 className="mb-4 text-lg font-semibold text-blue-900 font-serif">Tous les dossiers</h2>

                {/* Filtres par Majeure */}
                <div className="mb-4 flex flex-wrap gap-2">
                    <button
                        onClick={() => setMajorFilter('all')}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${majorFilter === 'all'
                            ? 'bg-blue-900 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Toutes
                    </button>
                    {majors?.map((major: Major) => (
                        <button
                            key={major.id}
                            onClick={() => setMajorFilter(major.id)}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${majorFilter === major.id
                                ? 'bg-blue-900 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {major.name}
                        </button>
                    ))}
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
                        <div className="overflow-x-auto rounded-sm border border-slate-200 bg-white shadow-sm">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-slate-50 text-left text-xs font-medium uppercase tracking-wider text-blue-900">
                                        <th className="px-6 py-3">Étudiant</th>
                                        <th className="px-6 py-3">Université</th>
                                        <th className="px-6 py-3">Responsable</th>
                                        <th className="px-6 py-3">Majeure</th>
                                        <th className="px-6 py-3">Statut</th>
                                        <th className="px-6 py-3">Année</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {filteredApplications.map((app) => {
                                        // Helper to find major name
                                        const studentMajor = majors.find(m => m.id === app.student?.major_id)
                                        const headMajor = majors.find(m => m.id === app.major_head?.major_id)
                                        const displayMajor = studentMajor?.name || headMajor?.name || '-'
                                        const isInferred = !studentMajor && headMajor

                                        return (
                                            <tr
                                                key={app.id}
                                                onClick={() => router.push(`/international/application/${app.id}`)}
                                                className="hover:bg-slate-50 cursor-pointer transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-gray-900">
                                                        {app.student?.full_name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {app.student?.email}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-gray-900">{app.university_name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {app.university_city}, {app.university_country}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {app.major_head?.full_name}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {displayMajor}
                                                    {isInferred && <span className="ml-1 text-xs text-slate-400" title="Déduit du responsable">(R)</span>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <StatusBadge status={app.status} />
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {app.academic_year?.year}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="rounded-sm border-2 border-dashed border-slate-300 p-12 text-center">
                            <p className="text-slate-500">Aucun dossier trouvé pour ces critères</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
