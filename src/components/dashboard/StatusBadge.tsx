import type { ApplicationStatus } from '@/types/database'

interface StatusBadgeProps {
  status: ApplicationStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    draft: { label: 'Brouillon', className: 'bg-slate-100 text-slate-700 border-slate-200' },
    submitted: { label: 'Soumis', className: 'bg-blue-50 text-blue-700 border-blue-200' },
    revision: { label: 'En révision', className: 'bg-amber-50 text-amber-700 border-amber-200' },
    validated_major: { label: 'Validé (Majeure)', className: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    validated_final: { label: 'Validé (Final)', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    rejected: { label: 'Refusé', className: 'bg-red-50 text-red-700 border-red-200' },
  }

  const { label, className } = config[status]

  return (
    <span className={`inline-flex items-center rounded border px-2.5 py-0.5 text-xs font-semibold ${className}`}>
      {label}
    </span>
  )
}
