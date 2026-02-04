'use client'

import { formatDateTime } from '@/lib/utils/validators'
import type { Message, Profile } from '@/types/database'

interface MessageWithSender extends Message {
  sender: Profile
}

interface MessageListProps {
  messages: MessageWithSender[]
  currentUserId: string
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <svg className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
        <p>Aucun message pour le moment</p>
        <p className="text-sm">Commencez la discussion ci-dessous</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const isOwn = message.sender_id === currentUserId

        return (
          <div
            key={message.id}
            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-3 ${
                isOwn
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {!isOwn && (
                <p className="mb-1 text-xs font-medium text-gray-600">
                  {message.sender.full_name}
                </p>
              )}
              <p className="whitespace-pre-wrap text-sm">{message.content}</p>
              <p
                className={`mt-1 text-xs ${
                  isOwn ? 'text-blue-200' : 'text-gray-400'
                }`}
              >
                {formatDateTime(message.created_at)}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
