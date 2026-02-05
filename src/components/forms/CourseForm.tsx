'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { COURSE_LEVELS, LANGUAGES } from '@/lib/utils/constants'
import type { Course, CourseLevel } from '@/types/database'

interface CourseFormProps {
  applicationId: string
  onCourseAdded: (course: Course) => void
  onClose: () => void
}

export function CourseForm({ applicationId, onCourseAdded, onClose }: CourseFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    language: '',
    description: '',
    webLink: '',
    level: '' as CourseLevel | '',
    startDate: '',
    endDate: '',
    localCredits: '',
    ects: '',
    choiceReason: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()

    const { data, error: insertError } = await supabase
      .from('courses')
      .insert({
        application_id: applicationId,
        title: formData.title,
        language: formData.language,
        description: formData.description,
        web_link: formData.webLink,
        level: formData.level as CourseLevel,
        start_date: formData.startDate,
        end_date: formData.endDate,
        local_credits: formData.localCredits ? parseInt(formData.localCredits) : null,
        ects: parseInt(formData.ects),
        choice_reason: formData.choiceReason,
      })
      .select()
      .single()

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    onCourseAdded(data)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Ajouter un cours</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-sm bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <Input
            id="title"
            label="Intitulé du cours"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Ex: Advanced Machine Learning"
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              id="language"
              label="Langue d'enseignement"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              options={LANGUAGES.map((lang) => ({ value: lang, label: lang }))}
              placeholder="Sélectionnez"
              required
            />

            <Select
              id="level"
              label="Niveau du cours"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value as CourseLevel })}
              options={COURSE_LEVELS.map((level) => ({ value: level, label: level }))}
              placeholder="Sélectionnez"
              required
            />
          </div>

          <Textarea
            id="description"
            label="Description / Syllabus"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Décrivez le contenu du cours en quelques lignes..."
            rows={3}
            required
          />

          <Input
            id="webLink"
            label="Lien web"
            type="url"
            value={formData.webLink}
            onChange={(e) => setFormData({ ...formData, webLink: e.target.value })}
            placeholder="https://..."
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="startDate"
              label="Date de début"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />

            <Input
              id="endDate"
              label="Date de fin"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="localCredits"
              label="Crédits locaux (hors Europe)"
              type="number"
              min="0"
              value={formData.localCredits}
              onChange={(e) => setFormData({ ...formData, localCredits: e.target.value })}
              placeholder="Optionnel"
            />

            <Input
              id="ects"
              label="Équivalence ECTS"
              type="number"
              min="1"
              max="30"
              value={formData.ects}
              onChange={(e) => setFormData({ ...formData, ects: e.target.value })}
              required
            />
          </div>

          <Textarea
            id="choiceReason"
            label="Raison du choix de ce cours"
            value={formData.choiceReason}
            onChange={(e) => setFormData({ ...formData, choiceReason: e.target.value })}
            placeholder="Expliquez pourquoi vous avez choisi ce cours..."
            rows={3}
            required
          />

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Ajout...' : 'Ajouter le cours'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
