import type { University } from '@/types/database'

interface UniversityInfoPanelProps {
  university: University
}

export function UniversityInfoPanel({ university }: UniversityInfoPanelProps) {
  const hasDetails = university.teaching_language || university.semester_dates || university.housing_info

  return (
    <div className="space-y-8">
      {/* Hero header */}
      <div className="rounded-sm border border-slate-200 bg-white overflow-hidden">
        <div className="bg-blue-900 px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white font-serif">{university.name}</h1>
              <p className="mt-2 text-blue-200 text-lg">{university.city}, {university.country}</p>
            </div>
            <span className="self-start rounded-full bg-blue-800 border border-blue-700 px-4 py-1 text-sm text-blue-200 whitespace-nowrap">
              {university.region}
            </span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-3 px-8 py-5 border-b border-slate-100 bg-slate-50">
          {university.erasmus_plus !== null && (
            <span className={`inline-flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium ${
              university.erasmus_plus
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              <span className="text-base">{university.erasmus_plus ? '\u2705' : '\u274C'}</span>
              Bourse Erasmus+
            </span>
          )}
          {university.supplement_fee && (
            <span className={`inline-flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium ${
              university.supplement_fee === '0\u20AC'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}>
              {'Suppl\u00E9ment financier : '}{university.supplement_fee}
            </span>
          )}
        </div>
      </div>

      {!hasDetails && (
        <div className="rounded-sm border-2 border-dashed border-slate-300 p-12 text-center text-slate-500">
          Les informations d{'\\'}{'e9'}taill{'\\'}{'e9'}es pour cette destination ne sont pas encore disponibles.
        </div>
      )}

      {hasDetails && (
        <>
          {/* Infos principales */}
          <div className="grid gap-6 lg:grid-cols-3">
            {university.teaching_language && (
              <InfoCard
                icon={<LanguageIcon />}
                title="Langue d'enseignement"
                content={university.teaching_language}
                color="blue"
              />
            )}
            {university.semester_dates && (
              <InfoCard
                icon={<CalendarIcon />}
                title="Dates du semestre"
                content={university.semester_dates}
                color="indigo"
              />
            )}
            {university.visa_info && (
              <InfoCard
                icon={<VisaIcon />}
                title="Visa"
                content={university.visa_info}
                color="purple"
              />
            )}
          </div>

          {/* Budget & Logement */}
          <div className="grid gap-6 lg:grid-cols-2">
            {university.monthly_budget && (
              <div className="rounded-sm border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-emerald-50 text-emerald-700">
                    <BudgetIcon />
                  </div>
                  <h3 className="font-semibold text-slate-900">Budget</h3>
                </div>
                <p className="text-slate-700 leading-relaxed">{university.monthly_budget}</p>
              </div>
            )}
            {university.health_info && (
              <div className="rounded-sm border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-rose-50 text-rose-700">
                    <HealthIcon />
                  </div>
                  <h3 className="font-semibold text-slate-900">Couverture sant&eacute;</h3>
                </div>
                <p className="text-slate-700 leading-relaxed">{university.health_info}</p>
              </div>
            )}
          </div>

          {/* Logement - pleine largeur */}
          {university.housing_info && (
            <div className="rounded-sm border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-sky-50 text-sky-700">
                  <HousingIcon />
                </div>
                <h3 className="font-semibold text-slate-900">Logement</h3>
              </div>
              <p className="text-slate-700 leading-relaxed">{university.housing_info}</p>
            </div>
          )}
        </>
      )}

      {/* Notes */}
      {university.additional_notes && (
        <div className="rounded-sm border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div>
              <p className="font-semibold text-amber-900">Notes importantes</p>
              <p className="mt-1 text-amber-800 leading-relaxed">{university.additional_notes}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InfoCard({ icon, title, content, color }: { icon: React.ReactNode; title: string; content: string; color: string }) {
  const bgColors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700',
    indigo: 'bg-indigo-50 text-indigo-700',
    purple: 'bg-purple-50 text-purple-700',
  }

  return (
    <div className="rounded-sm border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-sm ${bgColors[color]}`}>
          {icon}
        </div>
        <h3 className="font-semibold text-slate-900">{title}</h3>
      </div>
      <p className="text-slate-700 leading-relaxed">{content}</p>
    </div>
  )
}

function LanguageIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  )
}

function BudgetIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
    </svg>
  )
}

function HousingIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  )
}

function VisaIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
    </svg>
  )
}

function HealthIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  )
}
