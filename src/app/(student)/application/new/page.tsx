'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { Profile, AcademicYear } from '@/types/database'

export default function NewApplicationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [majorHeads, setMajorHeads] = useState<Profile[]>([])
  const [currentYear, setCurrentYear] = useState<AcademicYear | null>(null)

  const [formData, setFormData] = useState({
    majorHeadId: '',
    universityName: '',
    universityCity: '',
    universityCountry: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      // Récupérer les responsables de majeure
      const { data: heads } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'major_head')
        .order('full_name')

      if (heads) setMajorHeads(heads)

      // Récupérer l'année courante
      const { data: year } = await supabase
        .from('academic_years')
        .select('*')
        .eq('is_current', true)
        .single()

      if (year) setCurrentYear(year)

      // Vérifier si l'étudiant a déjà un dossier cette année
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Récupérer le profil de l'étudiant pour sa majeure
        const { data: profile } = await supabase
          .from('profiles')
          .select('major_id')
          .eq('id', user.id)
          .single()

        // Filtrer les responsables selon la majeure de l'étudiant
        if (profile?.major_id && heads) {
          const filteredHeads = heads.filter(h => h.major_id === profile.major_id)
          // Si on a des responsables correspondants, on ne garde qu'eux. 
          // Sinon (cas bizarroïde), on garde la liste complète ou on gère le cas.
          if (filteredHeads.length > 0) {
            setMajorHeads(filteredHeads)
            // Auto-select if only one
            if (filteredHeads.length === 1) {
              setFormData(prev => ({ ...prev, majorHeadId: filteredHeads[0].id }))
            }
          }
        }

        if (year) {
          const { data: existingApp } = await supabase
            .from('applications')
            .select('id')
            .eq('student_id', user.id)
            .eq('academic_year_id', year.id)
            .single()

          if (existingApp) {
            router.push(`/application/${existingApp.id}`)
          }
        }
      }
    }

    fetchData()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!formData.majorHeadId || !formData.universityName || !formData.universityCity || !formData.universityCountry) {
      setError('Veuillez remplir tous les champs')
      setLoading(false)
      return
    }

    if (!currentYear) {
      setError('Aucune année scolaire active')
      setLoading(false)
      return
    }

    const selectedHead = majorHeads.find(h => h.id === formData.majorHeadId)
    const confirmMessage = `Veuillez vérifier les informations :\n\n- Responsable : ${selectedHead?.full_name}\n- Université : ${formData.universityName}\n- Ville : ${formData.universityCity}\n- Pays : ${formData.universityCountry}\n\nConfirmez-vous la création de ce dossier ?`

    if (!confirm(confirmMessage)) {
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { data, error: insertError } = await supabase
      .from('applications')
      .insert({
        student_id: user.id,
        major_head_id: formData.majorHeadId,
        academic_year_id: currentYear.id,
        university_name: formData.universityName,
        university_city: formData.universityCity,
        university_country: formData.universityCountry,
        status: 'draft',
      })
      .select()
      .single()

    if (insertError) {
      if (insertError.code === '23505') {
        setError('Vous avez déjà un dossier pour cette année scolaire')
      } else {
        setError(insertError.message)
      }
      setLoading(false)
      return
    }

    router.push(`/application/${data.id}`)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Retour au tableau de bord
        </Link>
      </div>

      <div className="rounded-sm border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-blue-900 font-serif">Créer mon dossier Learning Agreement</h1>
        <p className="mt-2 text-slate-600">
          Année scolaire {currentYear?.year || 'Non définie'}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="rounded-sm bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <Select
            id="majorHead"
            label="Responsable de majeure"
            value={formData.majorHeadId}
            onChange={(e) => setFormData({ ...formData, majorHeadId: e.target.value })}
            options={majorHeads.map((head) => ({
              value: head.id,
              label: head.full_name,
            }))}
            placeholder="Sélectionnez votre responsable"
            required
          />

          <div className="border-t pt-6">
            <h2 className="mb-4 font-semibold text-gray-900">Université d&apos;accueil</h2>

            <div className="space-y-4">
              <Input
                id="universityName"
                label="Nom de l'université"
                value={formData.universityName}
                onChange={(e) => setFormData({ ...formData, universityName: e.target.value })}
                placeholder="Ex: Technical University of Munich"
                required
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  id="universityCity"
                  label="Ville"
                  value={formData.universityCity}
                  onChange={(e) => setFormData({ ...formData, universityCity: e.target.value })}
                  placeholder="Ex: Munich"
                  required
                />

                <Input
                  id="universityCountry"
                  label="Pays"
                  value={formData.universityCountry}
                  onChange={(e) => setFormData({ ...formData, universityCountry: e.target.value })}
                  placeholder="Ex: Allemagne"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Création...' : 'Créer mon dossier'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
