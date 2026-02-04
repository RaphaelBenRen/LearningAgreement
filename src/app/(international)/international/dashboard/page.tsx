import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ClientInternationalDashboard } from '@/components/dashboard/ClientInternationalDashboard'
import type { Application, Profile, AcademicYear, Major } from '@/types/database'

type ApplicationWithRelations = Application & {
  student: Profile
  major_head: Profile
  academic_year: AcademicYear
}

export default async function InternationalDashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Récupérer TOUTES les applications
  const { data: applications } = await supabase
    .from('applications')
    .select(`
      *,
      student:profiles!applications_student_id_fkey(*),
      major_head:profiles!applications_major_head_id_fkey(*),
      academic_year:academic_years(*)
    `)
    .order('updated_at', { ascending: false })

  // Récupérer les majeures pour les filtres
  const { data: majors } = await supabase
    .from('majors')
    .select('*')
    .order('name')

  return (
    <ClientInternationalDashboard
      applications={(applications || []) as unknown as ApplicationWithRelations[]}
      majors={majors || []}
    />
  )
}
