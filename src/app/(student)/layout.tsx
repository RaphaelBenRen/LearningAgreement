import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout'

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Si pas de profil, le créer automatiquement
  if (profileError || !profile) {
    const { data: newProfile } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name || 'Utilisateur',
        role: 'student',
      })
      .select()
      .single()

    if (newProfile) {
      return (
        <AuthenticatedLayout user={newProfile}>
          {children}
        </AuthenticatedLayout>
      )
    }

    // Si toujours pas de profil, erreur
    redirect('/login')
  }

  // Rediriger selon le rôle
  if (profile.role === 'major_head') {
    redirect('/admin/dashboard')
  }
  if (profile.role === 'international') {
    redirect('/international/dashboard')
  }

  return (
    <AuthenticatedLayout user={profile}>
      {children}
    </AuthenticatedLayout>
  )
}
