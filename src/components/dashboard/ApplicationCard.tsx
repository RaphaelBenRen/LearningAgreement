import Link from 'next/link'
import type { Application, Profile, AcademicYear } from '@/types/database'
import { StatusBadge } from './StatusBadge'
import { formatDate } from '@/lib/utils/validators'

interface ApplicationCardProps {
  application: Application & {
    student?: Profile
    academic_year?: AcademicYear
  }
  href: string
  showStudent?: boolean
}

export function ApplicationCard({ application, href, showStudent = false }: ApplicationCardProps) {
  return (
    <Link
      href={href}
      className="block rounded-sm border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md hover:border-blue-200"
    >
      <div className="flex items-start justify-between">
        <div>
          {showStudent && application.student && (
            <p className="font-semibold text-blue-900">{application.student.full_name}</p>
          )}
          <p className={`${showStudent ? 'text-sm text-slate-600' : 'font-semibold text-blue-900'}`}>
            {application.university_name}
          </p>
          <p className="text-sm text-gray-500">
            {application.university_city}, {application.university_country}
          </p>
        </div>
        <StatusBadge status={application.status} />
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-gray-500">
          {application.academic_year?.year || 'Année inconnue'}
        </span>
        <span className="text-gray-400">
          Créé le {formatDate(application.created_at)}
        </span>
      </div>
    </Link>
  )
}
