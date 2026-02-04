import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ClientAdminDashboard } from '@/components/dashboard/ClientAdminDashboard'
import type { Application, Profile, AcademicYear } from '@/types/database'

type ApplicationWithRelations = Application & {
  student: Profile
  academic_year: AcademicYear
}

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Récupérer les applications gérées par ce responsable
  const { data: applications } = await supabase
    .from('applications')
    .select(`
      *,
      student:profiles!applications_student_id_fkey(*),
      academic_year:academic_years(*)
    `)
    .eq('major_head_id', user.id)
    .order('updated_at', { ascending: false })

  return (
    <ClientAdminDashboard
      applications={(applications || []) as unknown as ApplicationWithRelations[]}
    />
  )
}
