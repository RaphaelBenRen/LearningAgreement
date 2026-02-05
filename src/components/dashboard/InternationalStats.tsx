'use client'

import { useMemo } from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from 'recharts'
import type { Application, Profile, Major } from '@/types/database'

type ApplicationWithRelations = Application & {
    student: Profile
    major_head: Profile
}

interface InternationalStatsProps {
    applications: ApplicationWithRelations[]
    majors: Major[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];
const STATUS_COLORS: Record<string, string> = {
    draft: '#94a3b8', // slate-400
    submitted: '#1e3a8a', // blue-900
    revision: '#d97706', // amber-600
    validated_major: '#581c87', // purple-900
    validated_final: '#047857', // emerald-700
    rejected: '#b91c1c', // red-700
}

const STATUS_LABELS: Record<string, string> = {
    draft: 'Brouillon',
    submitted: 'Soumis',
    revision: 'En révision',
    validated_major: 'Validé Resp.',
    validated_final: 'Validé Final',
    rejected: 'Rejeté',
}

export function InternationalStats({ applications, majors }: InternationalStatsProps) {

    // KPI: Total Students (Unique Student IDs)
    const totalStudents = useMemo(() => {
        const studentIds = new Set(applications.map(app => app.student_id))
        return studentIds.size
    }, [applications])

    // KPI: Validation Rate (Final Validation)
    const validationRate = useMemo(() => {
        if (applications.length === 0) return 0
        const validated = applications.filter(app => app.status === 'validated_final').length
        return Math.round((validated / applications.length) * 100)
    }, [applications])

    // CHART: Status Distribution
    const statusData = useMemo(() => {
        const counts: Record<string, number> = {}
        applications.forEach(app => {
            counts[app.status] = (counts[app.status] || 0) + 1
        })
        return Object.keys(STATUS_LABELS).map(status => ({
            name: STATUS_LABELS[status],
            value: counts[status] || 0,
            color: STATUS_COLORS[status]
        })).filter(item => item.value > 0)
    }, [applications])

    // CHART: Major Distribution
    const majorData = useMemo(() => {
        const counts: Record<string, number> = {}
        applications.forEach(app => {
            // Logic similar to dashboard filter: prioritize student major, fallback to head major
            const majorId = app.student?.major_id || app.major_head?.major_id
            if (majorId) {
                counts[majorId] = (counts[majorId] || 0) + 1
            } else {
                counts['unknown'] = (counts['unknown'] || 0) + 1
            }
        })

        return Object.keys(counts).map((majorId, index) => {
            const majorName = majors.find(m => m.id === majorId)?.name || 'Inconnu'
            return {
                name: majorName,
                value: counts[majorId],
                color: COLORS[index % COLORS.length]
            }
        }).sort((a, b) => b.value - a.value)
    }, [applications, majors])

    // CHART: Top Universities
    const universityData = useMemo(() => {
        const counts: Record<string, number> = {}
        applications.forEach(app => {
            const uni = app.university_name || 'Inconnue'
            counts[uni] = (counts[uni] || 0) + 1
        })

        return Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10) // Top 10
    }, [applications])

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-blue-900 font-serif">Tableau de bord Statistique</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-slate-500">Total Dossiers</p>
                    <p className="mt-2 text-3xl font-bold text-blue-900">{applications.length}</p>
                </div>
                <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-slate-500">Étudiants Uniques</p>
                    <p className="mt-2 text-3xl font-bold text-indigo-900">{totalStudents}</p>
                </div>
                <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-slate-500">Taux Validation Finale</p>
                    <p className="mt-2 text-3xl font-bold text-emerald-700">{validationRate}%</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Status Chart */}
                <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-6 text-lg font-semibold text-gray-900">État des dossiers</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Major Chart */}
                <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-6 text-lg font-semibold text-gray-900">Répartition par Majeure</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={majorData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }: any) => `${(percent * 100).toFixed(0)}%`}
                                >
                                    {majorData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend layout="vertical" align="right" verticalAlign="middle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* University Chart */}
                <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                    <h3 className="mb-6 text-lg font-semibold text-gray-900">Top 10 Universités demandées</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={universityData}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" name="Nombre de dossiers" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}
