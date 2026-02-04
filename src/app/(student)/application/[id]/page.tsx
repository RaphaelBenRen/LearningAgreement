'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { StatusTimeline } from '@/components/dashboard/StatusTimeline'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { MessageList } from '@/components/chat/MessageList'
import { MessageInput } from '@/components/chat/MessageInput'
import { formatFileSize } from '@/lib/utils/validators'
import type { Application, Message, Profile, File as FileType } from '@/types/database'

type MessageWithSender = Message & { sender: Profile }

export default function ApplicationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const applicationId = params.id as string
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(true)
  const [application, setApplication] = useState<Application | null>(null)
  const [messages, setMessages] = useState<MessageWithSender[]>([])
  const [files, setFiles] = useState<FileType[]>([])
  const [majorHead, setMajorHead] = useState<Profile | null>(null)
  const [currentUser, setCurrentUser] = useState<Profile | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setCurrentUser(profile)

      const { data: app } = await supabase
        .from('applications')
        .select('*')
        .eq('id', applicationId)
        .single()

      if (!app) {
        router.push('/dashboard')
        return
      }
      setApplication(app)

      const { data: head } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', app.major_head_id)
        .single()
      setMajorHead(head)

      const { data: messagesData } = await supabase
        .from('messages')
        .select('*, sender:profiles(*)')
        .eq('application_id', applicationId)
        .order('created_at')
      setMessages((messagesData || []) as MessageWithSender[])

      const { data: filesData } = await supabase
        .from('files')
        .select('*')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: false })
      setFiles(filesData || [])

      setLoading(false)
    }

    fetchData()
  }, [applicationId, router])

  const canEdit = application?.status === 'draft' || application?.status === 'revision'
  const canSubmit = canEdit && files.length > 0

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      setUploadError('Seuls les fichiers PDF sont acceptés')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Le fichier ne doit pas dépasser 10 Mo')
      return
    }

    setUploading(true)
    setUploadError(null)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    const fileName = `${applicationId}/${Date.now()}_${file.name}`
    const { error: uploadErr } = await supabase.storage
      .from('learning-agreements')
      .upload(fileName, file)

    if (uploadErr) {
      setUploadError('Erreur lors de l\'upload')
      setUploading(false)
      return
    }

    const { data, error: insertErr } = await supabase
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

    if (!insertErr && data) {
      setFiles((prev) => [data, ...prev])
    }

    setUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return

    if (!confirm('Êtes-vous sûr de vouloir soumettre votre dossier ?\n\nUne fois soumis, vous ne pourrez plus modifier vos documents tant que le responsable ne vous l\'aura pas demandé.')) {
      return
    }

    setSubmitting(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('applications')
      .update({ status: 'submitted' })
      .eq('id', applicationId)

    if (!error) {
      setApplication((prev) => prev ? { ...prev, status: 'submitted' } : null)
      toast.success('Dossier soumis avec succès !')
    } else {
      console.error('Submission error:', error)
      toast.error(`Erreur: ${error.message} (Code: ${error.code})`)
    }

    setSubmitting(false)
  }

  const handleDeleteFile = async (file: FileType) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) return

    const supabase = createClient()

    // 1. Supprimer du Storage
    const { error: storageError } = await supabase.storage
      .from('learning-agreements')
      .remove([file.file_path])

    if (storageError) {
      toast.error('Erreur lors de la suppression du fichier (Storage)')
      return
    }

    // 2. Supprimer de la table
    const { error: dbError } = await supabase
      .from('files')
      .delete()
      .eq('id', file.id)

    if (dbError) {
      toast.error('Erreur lors de la suppression du fichier (DB)')
    } else {
      setFiles((prev) => prev.filter((f) => f.id !== file.id))
      toast.success('Fichier supprimé')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="h-8 w-8 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    )
  }

  if (!application) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Retour
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">{application.university_name}</h1>
          <p className="text-gray-600">{application.university_city}, {application.university_country}</p>
        </div>
        <StatusBadge status={application.status} />
      </div>

      {/* Timeline */}
      <div className="rounded-xl border bg-white p-6">
        <StatusTimeline currentStatus={application.status} />
      </div>

      {/* Infos responsable */}
      <div className="rounded-xl border bg-white p-6">
        <h2 className="font-semibold text-gray-900">Responsable de majeure</h2>
        <p className="mt-1 text-gray-600">{majorHead?.full_name || 'Non défini'}</p>
        <p className="text-sm text-gray-500">{majorHead?.email}</p>
      </div>

      {/* Guide - Rappel des informations */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
        <h2 className="font-semibold text-blue-900 flex items-center gap-2">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          Rappel : Informations à inclure dans votre Learning Agreement
        </h2>
        <div className="mt-4 text-sm text-blue-800 space-y-3">
          <p><strong>Pour chaque cours sélectionné, indiquez :</strong></p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Intitulé du cours</li>
            <li>Langue d&apos;enseignement</li>
            <li>Descriptif en quelques lignes / Syllabus</li>
            <li>Lien web</li>
            <li>Niveau du cours (M1 ou M2)</li>
            <li>Date de début – Date de fin</li>
            <li>Nombre de crédits locaux (si hors Europe)</li>
            <li>Équivalence en ECTS</li>
            <li>Raisons du choix de ce cours</li>
          </ul>
          <p className="font-medium mt-3">🎯 Votre sélection doit totaliser l&apos;équivalent de 30 ECTS.</p>
        </div>
      </div>

      {/* Upload Learning Agreement */}
      <div className="space-y-6">
        {/* Mes Documents */}
        <div className="rounded-xl border bg-white p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Mes Documents (Étudiant)</h2>

          {canEdit && (
            <div className="mb-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="pdf-upload"
              />
              <label htmlFor="pdf-upload">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Upload en cours...
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                      Uploader mon Learning Agreement (PDF)
                    </>
                  )}
                </Button>
              </label>
              {uploadError && (
                <p className="mt-2 text-sm text-red-600">{uploadError}</p>
              )}
            </div>
          )}

          {files.filter(f => f.uploader_id === currentUser?.id).length > 0 ? (
            <div className="space-y-2">
              {files.filter(f => f.uploader_id === currentUser?.id).map((file) => (
                <FileItem
                  key={file.id}
                  file={file}
                  canDelete={canEdit && file.uploader_id === currentUser?.id}
                  onDelete={() => handleDeleteFile(file)}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Aucun fichier uploadé.</p>
          )}
        </div>

        {/* Documents Responsable */}
        <div className="rounded-xl border bg-white p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Documents Responsable Majeure</h2>
          {files.filter(f => f.uploader_id === application.major_head_id).length > 0 ? (
            <div className="space-y-2">
              {files.filter(f => f.uploader_id === application.major_head_id).map((file) => (
                <FileItem key={file.id} file={file} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Aucun document.</p>
          )}
        </div>

        {/* Documents International */}
        <div className="rounded-xl border bg-white p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Learning Agreement Signé par service Inter</h2>
          {files.filter(f => f.uploader_id !== application.student_id && f.uploader_id !== application.major_head_id).length > 0 ? (
            <div className="space-y-2">
              {files.filter(f => f.uploader_id !== application.student_id && f.uploader_id !== application.major_head_id).map((file) => (
                <FileItem key={file.id} file={file} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Aucun document.</p>
          )}
        </div>
      </div>

      {/* Soumettre */}
      {canEdit && (
        <div className="rounded-xl border bg-white p-6">
          <h2 className="font-semibold text-gray-900">Soumettre pour validation</h2>
          <p className="mt-1 text-sm text-gray-600">
            {files.length === 0
              ? 'Uploadez votre Learning Agreement en PDF avant de soumettre.'
              : 'Votre Learning Agreement est prêt à être soumis pour validation par votre responsable de majeure.'}
          </p>
          <Button
            className="mt-4"
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
          >
            {submitting ? 'Soumission en cours...' : 'Soumettre au responsable'}
          </Button>
        </div>
      )}

      {/* Statut après soumission */}
      {application.status === 'submitted' && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
          <h2 className="font-semibold text-blue-900">En attente de validation</h2>
          <p className="mt-1 text-sm text-blue-700">
            Votre Learning Agreement a été soumis. Votre responsable de majeure va l&apos;examiner.
          </p>
        </div>
      )}

      {application.status === 'validated_major' && (
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-6">
          <h2 className="font-semibold text-purple-900">Validé par le responsable</h2>
          <p className="mt-1 text-sm text-purple-700">
            Votre Learning Agreement a été validé par votre responsable de majeure.
            Il est maintenant en attente de validation finale par le Service International.
          </p>
        </div>
      )}

      {application.status === 'validated_final' && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-6">
          <div className="flex items-center gap-3">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h2 className="font-semibold text-green-900">Learning Agreement validé !</h2>
              <p className="text-sm text-green-700">
                Votre Learning Agreement a été validé par toutes les parties.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Guide étapes suivantes */}
      {(application.status === 'validated_major' || application.status === 'validated_final') && (
        <div className="rounded-xl border bg-gray-50 p-6">
          <h2 className="font-semibold text-gray-900">Prochaines étapes</h2>
          <div className="mt-4 text-sm text-gray-700 space-y-3">
            <div>
              <p className="font-medium">📝 Saisie sur Mobility Online</p>
              <p className="text-gray-600">Saisissez les cours validés dans Mobility Online.</p>
            </div>
            <div>
              <p className="font-medium">✉️ Envoi à l&apos;établissement d&apos;accueil</p>
              <p className="text-gray-600">Une fois signé par le Service International, envoyez le LA à votre établissement d&apos;accueil.</p>
            </div>
            <div>
              <p className="font-medium">📤 Dépôt de la version finale</p>
              <p className="text-gray-600">Déposez le LA finalisé (signé par toutes les parties) sur Mobility Online.</p>
            </div>
          </div>
        </div>
      )}

      {/* Guide modifications */}
      {application.status === 'revision' && (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6">
          <h2 className="font-semibold text-yellow-900">Modifications demandées</h2>
          <p className="mt-1 text-sm text-yellow-700">
            Votre responsable a demandé des modifications. Consultez les messages ci-dessous,
            corrigez votre Learning Agreement et re-soumettez-le.
          </p>
          <div className="mt-4 text-sm text-yellow-800">
            <p className="font-medium">En cas de modification :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Précisez les cours supprimés et ceux de remplacement</li>
              <li>Mettez à jour sur Mobility Online</li>
              <li>Remplissez la page 2 du LA &quot;Modification du programme d&apos;études&quot;</li>
            </ul>
          </div>
        </div>
      )}

      {/* Discussion */}
      <div className="rounded-xl border bg-white p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Discussion avec le responsable</h2>
        <div className="max-h-96 overflow-y-auto mb-4">
          <MessageList messages={messages} currentUserId={currentUser?.id || ''} />
        </div>
        <MessageInput
          applicationId={applicationId}
          onMessageSent={(msg) => setMessages((prev) => [...prev, msg])}
        />
      </div>
    </div>
  )
}

function FileItem({
  file,
  canDelete,
  onDelete
}: {
  file: FileType
  canDelete?: boolean
  onDelete?: () => void
}) {

  const [deleting, setDeleting] = useState(false)

  const handleDownload = async () => {
    const supabase = createClient()
    const { data } = await supabase.storage
      .from('learning-agreements')
      .createSignedUrl(file.file_path, 60)

    if (data?.signedUrl) {
      window.open(data.signedUrl, '_blank')
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (deleting) return
    setDeleting(true)
    onDelete?.()
    setDeleting(false)
  }

  return (
    <div
      className="flex w-full items-center gap-3 rounded-lg border bg-gray-50 p-3 text-left hover:bg-gray-100 group"
    >
      <button onClick={handleDownload} className="flex-1 flex items-center gap-3 min-w-0">
        <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        <div className="flex-1 min-w-0 text-left">
          <p className="truncate text-sm font-medium text-gray-900">{file.file_name}</p>
          <p className="text-xs text-gray-500">{formatFileSize(file.file_size)}</p>
        </div>
      </button>

      {canDelete && (
        <button
          onClick={handleDelete}
          className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
          title="Supprimer ce fichier"
        >
          {deleting ? (
            <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          )}
        </button>
      )}

      {/* Bouton download flèche est redondant avec clic principal, mais on le garde pour clarté si besoin */}
      <svg className="h-5 w-5 text-gray-400 group-hover:text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    </div>
  )
}
