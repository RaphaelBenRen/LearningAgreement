import type { ApplicationStatus } from '@/types/database'

interface StatusTimelineProps {
  currentStatus: ApplicationStatus
}

const steps = [
  { status: 'draft', label: 'Brouillon' },
  { status: 'submitted', label: 'Soumis' },
  { status: 'validated_major', label: 'Validé Respo' },
  { status: 'validated_final', label: 'Validé Final' },
] as const

const statusOrder: Record<ApplicationStatus, number> = {
  draft: 0,
  submitted: 1,
  revision: 1, // Même niveau que soumis
  validated_major: 2,
  validated_final: 3,
  rejected: -1,
}

export function StatusTimeline({ currentStatus }: StatusTimelineProps) {
  const currentIndex = statusOrder[currentStatus]
  const isRejected = currentStatus === 'rejected'
  const isRevision = currentStatus === 'revision'

  if (isRejected) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4">
        <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span className="font-medium text-red-800">Dossier refusé</span>
      </div>
    )
  }

  return (
    <div className="w-full">
      {isRevision && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-yellow-50 p-3">
          <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <span className="text-sm font-medium text-yellow-800">
            Révision demandée - veuillez corriger votre dossier
          </span>
        </div>
      )}

      <div className="flex w-full items-center justify-between px-10 sm:px-24">
        {steps.map((step, index) => {
          const isCompleted = currentIndex >= index
          const isCurrent = currentIndex === index
          const isLast = index === steps.length - 1

          return (
            <div key={step.status} className={`flex items-center ${isLast ? 'flex-none' : 'flex-1'}`}>
              {/* Step Circle & Label */}
              <div className="relative flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${isCompleted
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-gray-300 bg-white text-gray-400'
                    } ${isCurrent ? 'ring-2 ring-blue-200' : ''}`}
                >
                  {isCompleted && index < currentIndex ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    <span className="text-xs font-bold">{index + 1}</span>
                  )}
                </div>
                <span
                  className={`absolute -bottom-6 w-32 text-center text-xs font-medium ${isCompleted ? 'text-blue-600' : 'text-gray-400'
                    }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting Line (if not last) */}
              {!isLast && (
                <div
                  className={`h-0.5 flex-1 mx-4 ${currentIndex > index ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                />
              )}
            </div>
          )
        })}
      </div>
      {/* Spacer for bottom labels */}
      <div className="h-4" />
    </div>
  )
}
