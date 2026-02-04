import { EMAIL_DOMAINS, ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from './constants'

export function isValidEceEmail(email: string): boolean {
  return EMAIL_DOMAINS.some((domain) => email.toLowerCase().endsWith(domain))
}

export function isValidPdfFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Seuls les fichiers PDF sont acceptés' }
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'Le fichier ne doit pas dépasser 10 Mo' }
  }

  return { valid: true }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'Ko', 'Mo', 'Go']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
