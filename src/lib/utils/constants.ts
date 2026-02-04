import type { ApplicationStatus } from '@/types/database'

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  draft: 'Brouillon',
  submitted: 'Soumis',
  revision: 'En révision',
  validated_major: 'Validé par le responsable',
  validated_final: 'Validé (final)',
  rejected: 'Refusé',
}

export const APPLICATION_STATUS_COLORS: Record<ApplicationStatus, string> = {
  draft: 'bg-gray-100 text-gray-800',
  submitted: 'bg-blue-100 text-blue-800',
  revision: 'bg-yellow-100 text-yellow-800',
  validated_major: 'bg-purple-100 text-purple-800',
  validated_final: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

export const COURSE_LEVELS = ['M1', 'M2'] as const

export const ALLOWED_FILE_TYPES = ['application/pdf']
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 Mo

export const REQUIRED_ECTS = 30

export const EMAIL_DOMAINS = ['@ece.fr', '@edu.ece.fr']

export const LANGUAGES = [
  'Anglais',
  'Français',
  'Espagnol',
  'Allemand',
  'Italien',
  'Portugais',
  'Chinois',
  'Japonais',
  'Coréen',
  'Autre',
]
