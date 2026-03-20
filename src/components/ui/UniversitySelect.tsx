'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { University } from '@/types/database'

interface UniversitySelectProps {
  value: University | null
  onChange: (university: University | null) => void
  required?: boolean
}

// Supprime les accents d'une chaîne pour permettre une recherche insensible aux accents
function normalize(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

export function UniversitySelect({ value, onChange, required }: UniversitySelectProps) {
  const [query, setQuery] = useState('')
  const [allUniversities, setAllUniversities] = useState<University[]>([])
  const [results, setResults] = useState<University[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Charger toutes les universités une seule fois
  useEffect(() => {
    const fetchAll = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('universities')
        .select('*')
        .order('country')
        .order('city')
        .order('name')

      setAllUniversities(data || [])
      setLoading(false)
    }
    fetchAll()
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filtrage local insensible aux accents
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([])
      return
    }

    const normalizedQuery = normalize(query)
    const filtered = allUniversities.filter((uni) =>
      normalize(uni.name).includes(normalizedQuery) ||
      normalize(uni.city).includes(normalizedQuery) ||
      normalize(uni.country).includes(normalizedQuery)
    ).slice(0, 20)

    setResults(filtered)
  }, [query, allUniversities])

  const handleSelect = (uni: University) => {
    onChange(uni)
    setQuery('')
    setIsOpen(false)
  }

  const handleClear = () => {
    onChange(null)
    setQuery('')
    setIsOpen(false)
    inputRef.current?.focus()
  }

  // If a university is selected, show it
  if (value) {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Université d&apos;accueil
          </label>
          <div className="flex items-center gap-2 rounded-sm border border-blue-200 bg-blue-50 px-4 py-2.5">
            <div className="flex-1">
              <p className="font-medium text-blue-900">{value.name}</p>
              <p className="text-sm text-blue-700">{value.city}, {value.country}</p>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="rounded-full p-1 text-blue-400 hover:bg-blue-100 hover:text-blue-600"
              title="Changer d'université"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
            <input
              type="text"
              value={value.city}
              disabled
              className="block w-full rounded-sm border border-slate-200 bg-slate-100 px-4 py-2.5 text-slate-600 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
            <input
              type="text"
              value={value.country}
              disabled
              className="block w-full rounded-sm border border-slate-200 bg-slate-100 px-4 py-2.5 text-slate-600 cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    )
  }

  // Search mode
  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Université d&apos;accueil
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Rechercher une université, ville ou pays..."
          required={required}
          className="block w-full rounded-sm border border-slate-300 px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-blue-900 focus:ring-blue-900"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {loading ? (
            <svg className="h-5 w-5 animate-spin text-slate-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          )}
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-sm border border-slate-200 bg-white shadow-lg max-h-72 overflow-y-auto">
          {results.map((uni) => (
            <button
              key={uni.id}
              type="button"
              onClick={() => handleSelect(uni)}
              className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-slate-100 last:border-0 transition-colors"
            >
              <p className="font-medium text-slate-900">{uni.name}</p>
              <p className="text-sm text-slate-500">{uni.city}, {uni.country}</p>
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {isOpen && query.length >= 2 && !loading && results.length === 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-sm border border-slate-200 bg-white shadow-lg p-4 text-center text-sm text-slate-500">
          Aucune université trouvée pour &quot;{query}&quot;
        </div>
      )}
    </div>
  )
}
