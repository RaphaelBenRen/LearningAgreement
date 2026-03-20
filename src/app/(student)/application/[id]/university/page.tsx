'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { UniversityInfoPanel } from '@/components/dashboard/UniversityInfoPanel'
import type { University } from '@/types/database'

export default function StudentUniversityInfoPage() {
  const params = useParams()
  const router = useRouter()
  const applicationId = params.id as string

  const [university, setUniversity] = useState<University | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: app } = await supabase
        .from('applications')
        .select('*, university:universities(*)')
        .eq('id', applicationId)
        .single()

      if (!app) { router.push('/dashboard'); return }

      if (app.university) {
        setUniversity(app.university as University)
      } else {
        const { data: uni } = await supabase
          .from('universities')
          .select('*')
          .ilike('name', app.university_name)
          .limit(1)
          .single()

        if (uni) setUniversity(uni)
      }

      setLoading(false)
    }

    fetchData()
  }, [applicationId, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="h-8 w-8 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    )
  }

  if (!university) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="rounded-sm border border-slate-200 bg-white p-8 text-center text-slate-500">
          Aucune information trouvée pour cette université.
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl">
      <UniversityInfoPanel university={university} />
    </div>
  )
}
