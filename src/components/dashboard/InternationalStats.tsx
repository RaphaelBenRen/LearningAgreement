'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
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
import type { Application, Profile, Major, University } from '@/types/database'

type ApplicationWithRelations = Application & {
    student: Profile
    major_head: Profile
    university?: University | null
}

interface InternationalStatsProps {
    applications: ApplicationWithRelations[]
    majors: Major[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];
const STATUS_COLORS: Record<string, string> = {
    draft: '#94a3b8',
    submitted: '#1e3a8a',
    revision: '#d97706',
    validated_major: '#581c87',
    validated_final: '#047857',
    modification_requested: '#ea580c',
    rejected: '#b91c1c',
}

const STATUS_LABELS: Record<string, string> = {
    draft: 'Brouillon',
    submitted: 'Soumis',
    revision: 'En révision',
    validated_major: 'Validé Resp.',
    validated_final: 'Validé Final',
    modification_requested: 'Modif. demandée',
    rejected: 'Rejeté',
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload
        return (
            <div className="rounded-lg border border-slate-100 bg-white/95 p-4 shadow-xl backdrop-blur-sm">
                <p className="mb-2 text-sm font-semibold text-slate-900">{data.fullName}</p>
                <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                    <p className="text-sm font-medium text-slate-700">
                        {data.value} dossier{data.value > 1 ? 's' : ''}
                    </p>
                </div>
            </div>
        )
    }
    return null
}

export function InternationalStats({ applications, majors }: InternationalStatsProps) {
    const router = useRouter()

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
            statusKey: status,
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
            const major = majors.find(m => m.id === majorId)
            const majorLabel = major?.code || major?.name || 'Inconnu'
            return {
                name: majorLabel,
                value: counts[majorId],
                color: COLORS[index % COLORS.length]
            }
        }).filter(item => item.name !== 'Inconnu').sort((a, b) => b.value - a.value)
    }, [applications, majors])

    // CHART: Top Universities
    const universityData = useMemo(() => {
        const counts: Record<string, number> = {}
        applications.forEach(app => {
            const uni = app.university?.name || app.university_name || 'Inconnue'
            counts[uni] = (counts[uni] || 0) + 1
        })

        const shortenUniName = (name: string): string => {
            // Extraire l'acronyme entre parenthèses s'il existe : "University of X (ABC)" → "ABC"
            // Extraire l'acronyme entre parenthèses et nettoyer
            const acronymMatch = name.match(/\(([^)]+)\)\s*$/)
            if (acronymMatch) return acronymMatch[1].replace(/[()]/g, '').trim()
            // Noms connus courts
            if (name.length > 25) {
                // Prendre les initiales des mots principaux (ignorer of, de, di, du, etc.)
                const words = name.split(/\s+/).filter(w => !['of', 'de', 'di', 'du', 'the', 'and', 'et', 'la', 'le', 'des', 'in'].includes(w.toLowerCase()))
                if (words.length >= 3) {
                    return words.map(w => w[0]).join('').toUpperCase().slice(0, 6)
                }
            }
            return name.length > 20 ? name.slice(0, 20) + '…' : name
        }

        return Object.entries(counts)
            .map(([name, value]) => ({ name: shortenUniName(name), fullName: name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10)
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
                                    onClick={(data) => {
                                        const status = data?.payload?.statusKey || data?.statusKey;
                                        if (status) {
                                            router.push(`/international/dashboard?status=${status}`);
                                        }
                                    }}
                                    style={{ cursor: 'pointer' }}
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
                                    top: 10,
                                    right: 15,
                                    left: -15,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 11 }}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 11 }}
                                    allowDecimals={false}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                                <Bar 
                                    dataKey="value" 
                                    radius={[6, 6, 0, 0]}
                                    maxBarSize={48}
                                    animationDuration={1500}
                                >
                                    {universityData.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={index < 3 ? '#2563eb' : '#93c5fd'} 
                                            className="transition-all duration-300 hover:opacity-80"
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}
