import type { ApplicationStatus } from '@/types/database'
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_COLORS } from '@/lib/utils/constants'

interface StatusBadgeProps {
  status: ApplicationStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${APPLICATION_STATUS_COLORS[status]}`}
    >
      {APPLICATION_STATUS_LABELS[status]}
    </span>
  )
}
