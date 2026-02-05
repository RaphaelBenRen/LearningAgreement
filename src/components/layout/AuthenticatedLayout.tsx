'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'
import { NotificationBell } from '@/components/ui/NotificationBell'

interface AuthenticatedLayoutProps {
  children: React.ReactNode
  user: Profile
}

export function AuthenticatedLayout({ children, user }: AuthenticatedLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'international':
        return 'Service International'
      case 'major_head':
        return 'Responsable de Majeure'
      default:
        return 'Étudiant'
    }
  }

  const getDashboardLink = () => {
    switch (user.role) {
      case 'international':
        return '/international/dashboard'
      case 'major_head':
        return '/admin/dashboard'
      default:
        return '/dashboard'
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-50/80 backdrop-blur-md border-b-0 border-transparent pt-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href={getDashboardLink()} className="text-xl font-bold text-blue-900 flex items-center gap-2">
                <div className="h-8 w-8 bg-blue-900 rounded-sm flex items-center justify-center text-white font-bold text-lg">LA</div>
                <span className="font-serif">Learning Agreement</span>
              </Link>

              {/* Separator */}
              <div className="hidden md:block h-8 w-px bg-blue-100" />

              {/* Page Title & Subtitle in Header */}
              <div className="hidden md:flex flex-col justify-center">
                <h1 className="text-lg font-serif font-bold text-blue-900 leading-tight">
                  {user.role === 'international' ? 'Service International' :
                    user.role === 'major_head' ? 'Espace Responsable' :
                      'Mon Learning Agreement'}
                </h1>
                <p className="text-xs text-blue-700">
                  {user.role === 'international' ? (pathname.includes('/application/') ? 'Détail du dossier' : 'Vue globale de tous les Learning Agreements') :
                    user.role === 'major_head' ? 'Gestion des étudiants' :
                      'Espace Étudiant'}
                </p>
              </div>
            </div>

            {/* Right Side: Notification Bell + User Menu */}
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-6 mr-4">
                <Link
                  href={getDashboardLink()}
                  className={`text-sm font-medium transition-colors font-serif ${pathname === getDashboardLink()
                    ? 'text-blue-900 font-bold'
                    : 'text-slate-400 hover:text-blue-900'
                    }`}
                >
                  Tableau de bord
                </Link>
                {user.role === 'international' && (
                  <Link
                    href="/international/stats"
                    className={`text-sm font-medium transition-colors font-serif ${pathname === '/international/stats'
                      ? 'text-blue-900 font-bold'
                      : 'text-slate-400 hover:text-blue-900'
                      }`}
                  >
                    Statistiques
                  </Link>
                )}
              </nav>
              <NotificationBell />

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-3 rounded-sm px-3 py-2 hover:bg-slate-50 transition-colors"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-blue-900">{user.full_name}</p>
                    <p className="text-xs text-blue-700">{getRoleLabel(user.role)}</p>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-white text-blue-900 font-semibold border border-blue-100">
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                </button>

                {menuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setMenuOpen(false)}
                    />
                    <div className="absolute right-0 z-20 mt-2 w-48 rounded-sm border border-slate-200 bg-white py-1 shadow-md">
                      <div className="px-4 py-2 border-b border-slate-100 sm:hidden">
                        <p className="text-sm font-medium text-slate-900">{user.full_name}</p>
                        <p className="text-xs text-slate-500">{getRoleLabel(user.role)}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                        </svg>
                        Se déconnecter
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
