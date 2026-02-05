'use client'

import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { ApplicationStatus } from '@/types/database'

interface DashboardFilterBarProps {
    searchTerm: string
    onSearchChange: (value: string) => void
    statusFilter: ApplicationStatus | 'all'
    onStatusFilterChange: (value: ApplicationStatus | 'all') => void
    sortBy: string
    onSortChange: (value: string) => void
}

export function DashboardFilterBar({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    sortBy,
    onSortChange,
}: DashboardFilterBarProps) {
    return (
        <div className="flex flex-col gap-4 rounded-sm border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-end">
            <div className="flex-1">
                <Input
                    id="search"
                    label="Rechercher"
                    placeholder="Nom étudiant, Ville, Université..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="rounded-sm border-slate-300 focus:border-blue-900 focus:ring-blue-900"
                />
            </div>

            <div className="w-full md:w-48">
                <Select
                    id="status"
                    label="Statut"
                    value={statusFilter}
                    onChange={(e) => onStatusFilterChange(e.target.value as ApplicationStatus | 'all')}
                    options={[
                        { value: 'all', label: 'Tous les statuts' },
                        { value: 'draft', label: 'Brouillon' },
                        { value: 'submitted', label: 'Soumis' },
                        { value: 'revision', label: 'En révision' },
                        { value: 'validated_major', label: 'Validé (Majeure)' },
                        { value: 'validated_final', label: 'Validé (Final)' },
                        { value: 'rejected', label: 'Refusé' },
                    ]}
                    className="rounded-sm border-slate-300 focus:border-blue-900 focus:ring-blue-900"
                />
            </div>

            <div className="w-full md:w-48">
                <Select
                    id="sort"
                    label="Trier par"
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value)}
                    options={[
                        { value: 'updated_desc', label: 'Dernière mise à jour' },
                        { value: 'created_desc', label: 'Plus récent' },
                        { value: 'created_asc', label: 'Plus ancien' },
                        { value: 'name_asc', label: 'Nom étudiant (A-Z)' },
                    ]}
                    className="rounded-sm border-slate-300 focus:border-blue-900 focus:ring-blue-900"
                />
            </div>
        </div>
    )
}
