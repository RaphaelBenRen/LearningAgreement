'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils/validators'
import type { Course } from '@/types/database'

interface CourseCardProps {
  course: Course
  canEdit: boolean
  canValidate: boolean
  onDelete?: (id: string) => void
  onValidationChange?: (course: Course) => void
}

export function CourseCard({
  course,
  canEdit,
  canValidate,
  onDelete,
  onValidationChange,
}: CourseCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [validating, setValidating] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)

  const handleValidate = async (validated: boolean, reason?: string) => {
    setValidating(true)
    const supabase = createClient()

    const { data, error } = await supabase
      .from('courses')
      .update({
        is_validated: validated,
        rejection_reason: validated ? null : reason,
      })
      .eq('id', course.id)
      .select()
      .single()

    if (!error && data && onValidationChange) {
      onValidationChange(data)
    }

    setValidating(false)
    setShowRejectForm(false)
    setRejectionReason('')
  }

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) return

    const supabase = createClient()
    const { error } = await supabase.from('courses').delete().eq('id', course.id)

    if (!error && onDelete) {
      onDelete(course.id)
    }
  }

  const getStatusIcon = () => {
    if (course.is_validated === true) {
      return (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
          <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
      )
    }
    if (course.is_validated === false) {
      return (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
          <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      )
    }
    return (
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    )
  }

  return (
    <div className="rounded-sm border border-slate-200 bg-white">
      <div
        className="flex cursor-pointer items-center justify-between p-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-medium text-gray-900">{course.title}</h3>
            <p className="text-sm text-gray-500">
              {course.ects} ECTS • {course.language} • {course.level}
            </p>
          </div>
        </div>
        <svg
          className={`h-5 w-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>

      {expanded && (
        <div className="border-t px-4 py-4 space-y-4">
          <div className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <span className="text-gray-500">Période :</span>
              <p className="font-medium">{formatDate(course.start_date)} - {formatDate(course.end_date)}</p>
            </div>
            {course.local_credits && (
              <div>
                <span className="text-gray-500">Crédits locaux :</span>
                <p className="font-medium">{course.local_credits}</p>
              </div>
            )}
          </div>

          <div>
            <span className="text-sm text-gray-500">Description :</span>
            <p className="mt-1 text-sm">{course.description}</p>
          </div>

          <div>
            <span className="text-sm text-gray-500">Raison du choix :</span>
            <p className="mt-1 text-sm">{course.choice_reason}</p>
          </div>

          <a
            href={course.web_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            Voir le cours
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>

          {course.is_validated === false && course.rejection_reason && (
            <div className="rounded-lg bg-red-50 p-3">
              <p className="text-sm font-medium text-red-800">Raison du refus :</p>
              <p className="text-sm text-red-700">{course.rejection_reason}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            {canEdit && course.is_validated !== true && (
              <Button variant="danger" size="sm" onClick={handleDelete}>
                Supprimer
              </Button>
            )}

            {canValidate && course.is_validated === null && (
              <>
                <Button
                  size="sm"
                  onClick={() => handleValidate(true)}
                  disabled={validating}
                >
                  Valider
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setShowRejectForm(true)}
                  disabled={validating}
                >
                  Refuser
                </Button>
              </>
            )}

            {canValidate && course.is_validated !== null && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleValidate(null as unknown as boolean)}
                disabled={validating}
              >
                Réinitialiser
              </Button>
            )}
          </div>

          {showRejectForm && (
            <div className="rounded-lg bg-gray-50 p-4 space-y-3">
              <textarea
                className="w-full rounded-lg border p-3 text-sm"
                placeholder="Expliquez la raison du refus..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowRejectForm(false)}
                >
                  Annuler
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleValidate(false, rejectionReason)}
                  disabled={!rejectionReason.trim() || validating}
                >
                  Confirmer le refus
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
