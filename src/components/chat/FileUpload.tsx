'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { isValidPdfFile, formatFileSize } from '@/lib/utils/validators'
import type { File as FileType } from '@/types/database'

interface FileUploadProps {
  applicationId: string
  onFileUploaded: (file: FileType) => void
}

export function FileUpload({ applicationId, onFileUploaded }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    // Validation
    const validation = isValidPdfFile(file)
    if (!validation.valid) {
      setError(validation.error || 'Fichier invalide')
      return
    }

    setUploading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setError('Non connecté')
      setUploading(false)
      return
    }

    // Upload vers Supabase Storage
    const fileName = `${applicationId}/${Date.now()}_${file.name}`
    const { error: uploadError } = await supabase.storage
      .from('learning-agreements')
      .upload(fileName, file)

    if (uploadError) {
      setError('Erreur lors de l\'upload')
      setUploading(false)
      return
    }

    // Enregistrer dans la table files
    const { data, error: insertError } = await supabase
      .from('files')
      .insert({
        application_id: applicationId,
        uploader_id: user.id,
        file_name: file.name,
        file_path: fileName,
        file_size: file.size,
      })
      .select()
      .single()

    if (insertError) {
      setError('Erreur lors de l\'enregistrement')
    } else if (data) {
      onFileUploaded(data)
    }

    setUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileSelect}
        className="hidden"
        id="file-upload"
      />

      <label htmlFor="file-upload">
        <Button
          type="button"
          variant="secondary"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Upload...
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
              </svg>
              Joindre un PDF
            </>
          )}
        </Button>
      </label>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

interface FileListProps {
  files: FileType[]
}

export function FileList({ files }: FileListProps) {
  const supabase = createClient()

  const handleDownload = async (file: FileType) => {
    const { data } = await supabase.storage
      .from('learning-agreements')
      .createSignedUrl(file.file_path, 60)

    if (data?.signedUrl) {
      window.open(data.signedUrl, '_blank')
    }
  }

  if (files.length === 0) return null

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700">Fichiers joints</h4>
      <div className="space-y-2">
        {files.map((file) => (
          <button
            key={file.id}
            onClick={() => handleDownload(file)}
            className="flex w-full items-center gap-3 rounded-lg border bg-gray-50 p-3 text-left hover:bg-gray-100"
          >
            <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">{file.file_name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(file.file_size)}</p>
            </div>
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}
