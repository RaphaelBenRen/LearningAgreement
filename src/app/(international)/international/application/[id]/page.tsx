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
import { FileList } from '@/components/chat/FileUpload'
import { REQUIRED_ECTS } from '@/lib/utils/constants'
import type { Application, Course, Message, Profile, File as FileType } from '@/types/database'

type MessageWithSender = Message & { sender: Profile }

export default function InternationalApplicationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const applicationId = params.id as string

  const [loading, setLoading] = useState(true)
  const [application, setApplication] = useState<Application | null>(null)
  const [student, setStudent] = useState<Profile | null>(null)
  const [majorHead, setMajorHead] = useState<Profile | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [messages, setMessages] = useState<MessageWithSender[]>([])
  const [files, setFiles] = useState<FileType[]>([])
  const [currentUser, setCurrentUser] = useState<Profile | null>(null)
  const [validating, setValidating] = useState(false)

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

      if (profile?.role !== 'international') {
        router.push('/dashboard')
        return
      }
      setCurrentUser(profile)

      // Application
      const { data: app } = await supabase
        .from('applications')
        .select('*')
        .eq('id', applicationId)
        .single()

      if (!app) {
        router.push('/international/dashboard')
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

      // Responsable de majeure
      const { data: headData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', app.major_head_id)
        .single()
      setMajorHead(headData)

      // Cours
      const { data: coursesData } = await supabase
        .from('courses')
        .select('*')
        .eq('application_id', applicationId)
        .order('created_at')
      setCourses(coursesData || [])

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

  const totalEcts = courses.reduce((sum, c) => sum + c.ects, 0)
  const canValidateFinal = application?.status === 'validated_major'

  const handleFinalValidation = async () => {
    setValidating(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('applications')
      .update({ status: 'validated_final' })
      .eq('id', applicationId)

    if (!error) {
      setApplication((prev) => prev ? { ...prev, status: 'validated_final' } : null)

      // Webhook notification
      try {
        await fetch('/api/webhooks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'application_validated_final',
            application_id: applicationId,
          }),
        })
      } catch {
        // Ignorer
      }
    }

    setValidating(false)
  }

  const handleReject = async () => {
    const reason = prompt('Raison du refus :')
    if (!reason) return

    setValidating(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Ajouter un message avec la raison
    await supabase.from('messages').insert({
      application_id: applicationId,
      sender_id: user?.id,
      content: `Dossier refusé par le service international : ${reason}`,
    })

    const { error } = await supabase
      .from('applications')
      .update({ status: 'rejected' })
      .eq('id', applicationId)

    if (!error) {
      setApplication((prev) => prev ? { ...prev, status: 'rejected' } : null)
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
            href="/international/dashboard"
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

      {/* Infos */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-6">
          <h2 className="font-semibold text-gray-900">Université d&apos;accueil</h2>
          <p className="mt-1 text-gray-900">{application.university_name}</p>
          <p className="text-gray-600">{application.university_city}, {application.university_country}</p>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <h2 className="font-semibold text-gray-900">Responsable de majeure</h2>
          <p className="mt-1 text-gray-900">{majorHead?.full_name}</p>
          <p className="text-gray-600">{majorHead?.email}</p>
        </div>
      </div>

      {/* Cours */}
      <div className="rounded-xl border bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-gray-900">Cours validés</h2>
            <p className={`text-sm ${totalEcts >= REQUIRED_ECTS ? 'text-green-600' : 'text-orange-600'}`}>
              {totalEcts} / {REQUIRED_ECTS} ECTS
            </p>
          </div>
        </div>

        {courses.length === 0 ? (
          <p className="text-center py-8 text-gray-500">Aucun cours dans ce dossier.</p>
        ) : (
          <div className="space-y-3">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                canEdit={false}
                canValidate={false}
              />
            ))}
          </div>
        )}
      </div>

      {/* Actions de validation finale */}
      {canValidateFinal && (
        <div className="rounded-xl border-2 border-purple-200 bg-purple-50 p-6 space-y-4">
          <h2 className="font-semibold text-purple-900">Validation finale</h2>
          <p className="text-sm text-purple-700">
            Ce dossier a été validé par le responsable de majeure. Vous pouvez maintenant donner la validation finale.
          </p>
          <div className="flex gap-4">
            <Button
              onClick={handleFinalValidation}
              disabled={validating}
            >
              {validating ? 'Validation...' : 'Valider définitivement'}
            </Button>
            <Button
              variant="danger"
              onClick={handleReject}
              disabled={validating}
            >
              Refuser
            </Button>
          </div>
        </div>
      )}

      {application.status === 'validated_final' && (
        <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6">
          <div className="flex items-center gap-3">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h2 className="font-semibold text-green-900">Dossier validé</h2>
              <p className="text-sm text-green-700">
                Ce Learning Agreement a été validé définitivement.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Fichiers */}
      <div className="rounded-xl border bg-white p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Documents</h2>
        <FileList files={files} />
        {files.length === 0 && (
          <p className="text-gray-500 text-sm">Aucun document joint.</p>
        )}
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
