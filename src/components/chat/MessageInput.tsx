'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import type { Message, Profile } from '@/types/database'

interface MessageInputProps {
  applicationId: string
  onMessageSent: (message: Message & { sender: Profile }) => void
}

export function MessageInput({ applicationId, onMessageSent }: MessageInputProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('messages')
      .insert({
        application_id: applicationId,
        sender_id: user.id,
        content: content.trim(),
      })
      .select('*, sender:profiles(*)')
      .single()

    if (!error && data) {
      onMessageSent(data as Message & { sender: Profile })
      setContent('')
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <textarea
        className="flex-1 resize-none rounded-sm border border-slate-300 px-4 py-2 focus:border-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-900"
        placeholder="Écrivez votre message..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={2}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
          }
        }}
      />
      <Button type="submit" disabled={loading || !content.trim()}>
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      </Button>
    </form>
  )
}
