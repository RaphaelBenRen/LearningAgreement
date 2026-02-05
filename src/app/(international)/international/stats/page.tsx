import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { InternationalStats } from '@/components/dashboard/InternationalStats'
import type { Application, Profile, AcademicYear, Major } from '@/types/database'

type ApplicationWithRelations = Application & {
    student: Profile
    major_head: Profile
    academic_year: AcademicYear
}

export default async function InternationalStatsPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Check role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'international') {
        redirect('/dashboard')
    }

    // Récupérer TOUTES les applications
    const { data: applications } = await supabase
        .from('applications')
        .select(`
      *,
      student:profiles!applications_student_id_fkey(*),
      major_head:profiles!applications_major_head_id_fkey(*),
      academic_year:academic_years(*)
    `)
        .order('created_at', { ascending: false })

    // Récupérer les majeures
    const { data: majors } = await supabase
        .from('majors')
        .select('*')
        .order('name')

    return (
        <InternationalStats
            applications={(applications || []) as unknown as ApplicationWithRelations[]}
            majors={majors || []}
        />
    )
}
