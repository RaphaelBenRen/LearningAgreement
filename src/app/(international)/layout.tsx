import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout'

export default async function InternationalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'international') {
    redirect('/dashboard')
  }

  return (
    <AuthenticatedLayout user={profile}>
      {children}
    </AuthenticatedLayout>
  )
}
