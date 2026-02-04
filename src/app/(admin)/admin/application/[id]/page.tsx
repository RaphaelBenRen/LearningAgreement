'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { StatusTimeline } from '@/components/dashboard/StatusTimeline'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { CourseCard } from '@/components/forms/CourseCard'
import { MessageList } from '@/components/chat/MessageList'
import { MessageInput } from '@/components/chat/MessageInput'
import { FileList, FileUpload } from '@/components/chat/FileUpload'
import { REQUIRED_ECTS } from '@/lib/utils/constants'
import type { Application, Course, Message, Profile, File as FileType } from '@/types/database'

type MessageWithSender = Message & { sender: Profile }

export default function AdminApplicationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const applicationId = params.id as string

  const [loading, setLoading] = useState(true)
  const [application, setApplication] = useState<Application | null>(null)
  const [student, setStudent] = useState<Profile | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [messages, setMessages] = useState<MessageWithSender[]>([])
  const [files, setFiles] = useState<FileType[]>([])
  const [currentUser, setCurrentUser] = useState<Profile | null>(null)
  const [validating, setValidating] = useState(false)
  const [revisionReason, setRevisionReason] = useState('')
  const [showRevisionForm, setShowRevisionForm] = useState(false)

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

      // Application
      const { data: app } = await supabase
        .from('applications')
        .select('*')
        .eq('id', applicationId)
        .single()

      if (!app || app.major_head_id !== user.id) {
        router.push('/admin/dashboard')
        return
      }
      setApplication(app)

      // Étudiant
      const { data: studentData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', app.student_id)
        .single()
      setStudent(studentData)

      // Messages
      const { data: messagesData } = await supabase
        .from('messages')
        .select('*, sender:profiles(*)')
        .eq('application_id', applicationId)
        .order('created_at')
      setMessages((messagesData || []) as MessageWithSender[])

      // Fichiers
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

  const handleValidateApplication = async () => {
    if (!confirm(`Confirmez-vous la validation du dossier de ${student?.full_name} ?`)) {
      return
    }

    setValidating(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('applications')
      .update({ status: 'validated_major' })
      .eq('id', applicationId)

    if (!error) {
      setApplication((prev) => prev ? { ...prev, status: 'validated_major' } : null)

      // Webhook notification
      try {
        await fetch('/api/webhooks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'application_validated_major',
            application_id: applicationId,
          }),
        })
      } catch {
        // Ignorer
      }
    }

    setValidating(false)
  }

  const handleRequestRevision = async () => {
    if (!revisionReason.trim()) return
    setValidating(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Ajouter un message avec la raison
    await supabase.from('messages').insert({
      application_id: applicationId,
      sender_id: user?.id,
      content: `Révision demandée : ${revisionReason}`,
    })

    // Changer le statut
    const { error } = await supabase
      .from('applications')
      .update({ status: 'revision' })
      .eq('id', applicationId)

    if (!error) {
      setApplication((prev) => prev ? { ...prev, status: 'revision' } : null)
      setShowRevisionForm(false)
      setRevisionReason('')

      // Recharger les messages
      const { data: messagesData } = await supabase
        .from('messages')
        .select('*, sender:profiles(*)')
        .eq('application_id', applicationId)
        .order('created_at')
      setMessages((messagesData || []) as MessageWithSender[])
    }

    setValidating(false)
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
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Retour
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">{student?.full_name}</h1>
          <p className="text-gray-600">{student?.email}</p>
        </div>
        <StatusBadge status={application.status} />
      </div>

      {/* Timeline */}
      <div className="rounded-xl border bg-white p-6">
        <StatusTimeline currentStatus={application.status} />
      </div>

      {/* Infos université */}
      <div className="rounded-xl border bg-white p-6">
        <h2 className="font-semibold text-gray-900">Université d&apos;accueil</h2>
        <p className="mt-1 text-gray-900">{application.university_name}</p>
        <p className="text-gray-600">{application.university_city}, {application.university_country}</p>
      </div>

      {/* Actions de validation */}
      {application.status === 'submitted' && (
        <div className="rounded-xl border bg-white p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Actions</h2>
          <div className="flex gap-4">
            <Button
              onClick={handleValidateApplication}
              disabled={validating}
            >
              {validating ? 'Validation...' : 'Valider le dossier'}
            </Button>

            <Button
              variant="secondary"
              onClick={() => setShowRevisionForm(true)}
              disabled={validating}
            >
              Demander une révision
            </Button>
          </div>

          {showRevisionForm && (
            <div className="rounded-lg bg-gray-50 p-4 space-y-3">
              <textarea
                className="w-full rounded-lg border p-3 text-sm"
                placeholder="Expliquez les modifications attendues..."
                value={revisionReason}
                onChange={(e) => setRevisionReason(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowRevisionForm(false)}
                >
                  Annuler
                </Button>
                <Button
                  size="sm"
                  onClick={handleRequestRevision}
                  disabled={!revisionReason.trim() || validating}
                >
                  Envoyer la demande
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Fichiers */}
      <div className="space-y-6">
        {/* Fichiers Étudiant */}
        <div className="rounded-xl border bg-white p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Documents Étudiant</h2>
          <FileList files={files.filter(f => f.uploader_id === application.student_id)} />
          {files.filter(f => f.uploader_id === application.student_id).length === 0 && (
            <p className="text-gray-500 text-sm">Aucun document.</p>
          )}
        </div>

        {/* Fichiers Responsable */}
        <div className="rounded-xl border bg-white p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Documents Responsable Majeure</h2>
          <FileList files={files.filter(f => f.uploader_id === application.major_head_id)} />
          <div className="mt-4">
            <FileUpload
              applicationId={applicationId}
              onFileUploaded={(newFile) => setFiles((prev) => [newFile, ...prev])}
            />
          </div>
        </div>

        {/* Fichiers International */}
        <div className="rounded-xl border bg-white p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Documents Service International</h2>
          <FileList files={files.filter(f => f.uploader_id !== application.student_id && f.uploader_id !== application.major_head_id)} />
          {files.filter(f => f.uploader_id !== application.student_id && f.uploader_id !== application.major_head_id).length === 0 && (
            <p className="text-gray-500 text-sm">Aucun document.</p>
          )}
        </div>
      </div>

      {/* Discussion */}
      <div className="rounded-xl border bg-white p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Discussion</h2>
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
