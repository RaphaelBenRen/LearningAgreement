'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const getErrorMessage = (errorMsg: string) => {
    if (errorMsg.includes('Invalid login credentials')) {
      return 'Email ou mot de passe incorrect'
    }
    if (errorMsg.includes('Email not confirmed')) {
      return 'Email non confirmé. Contactez l\'administrateur.'
    }
    if (errorMsg.includes('Invalid email')) {
      return 'Format d\'email invalide'
    }
    return errorMsg
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(getErrorMessage(authError.message))
        setLoading(false)
        return
      }

      if (!data.user) {
        setError('Erreur de connexion')
        setLoading(false)
        return
      }

      // Récupérer le rôle pour rediriger
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (profile?.role === 'international') {
        router.push('/international/dashboard')
      } else if (profile?.role === 'major_head') {
        router.push('/admin/dashboard')
      } else {
        router.push('/dashboard')
      }

      router.refresh()
    } catch (err) {
      console.error('Login error:', err)
      setError('Une erreur est survenue')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-900 transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Retour à l&apos;accueil
        </Link>
        <div className="rounded-sm border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <Link href="/" className="text-2xl font-bold text-blue-900">
              Learning Agreement
            </Link>
            <p className="mt-2 text-gray-600">Connectez-vous à votre compte</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="rounded-sm bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-sm border border-slate-300 px-4 py-3 focus:border-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-900"
                placeholder="prenom.nom@edu.ece.fr"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-sm border border-slate-300 px-4 py-3 focus:border-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-900"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-sm bg-blue-900 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Pas encore de compte ?{' '}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-700">
              S&apos;inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
