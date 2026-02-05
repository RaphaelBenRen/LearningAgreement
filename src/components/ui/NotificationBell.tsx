'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Notification {
    id: string
    message: string
    link: string | null
    created_at: string
    is_read: boolean
}

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)
    const supabase = createClient()
    const router = useRouter()

    const fetchNotifications = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (data) {
            setNotifications(data)
            setUnreadCount(data.filter(n => !n.is_read).length)
        }
    }

    useEffect(() => {
        fetchNotifications()

        // Subscribe to new notifications
        const subscription = supabase
            .channel('notifications')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'notifications',
                },
                () => {
                    fetchNotifications()
                }
            )
            .subscribe()

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        await supabase.from('notifications').delete().eq('id', id)
        setNotifications(prev => prev.filter(n => n.id !== id))
        setUnreadCount(prev => prev - (notifications.find(n => n.id === id)?.is_read ? 0 : 1))
    }

    const handleClick = async (notification: Notification) => {
        if (!notification.is_read) {
            await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('id', notification.id)

            setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n))
            setUnreadCount(prev => Math.max(0, prev - 1))
        }
        setIsOpen(false)
    }

    return (
        <div className="relative z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
                <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="fixed inset-x-4 top-16 z-50 mx-auto w-auto max-w-sm rounded-sm border border-slate-200 bg-white shadow-xl sm:absolute sm:right-0 sm:inset-auto sm:mt-2 sm:w-80">
                        <div className="border-b border-slate-100 px-4 py-3 bg-slate-50">
                            <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length > 0 ? (
                                <div className="divide-y divide-slate-100">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`relative flex items-start gap-4 p-4 transition-colors hover:bg-slate-50 ${!notification.is_read ? 'bg-blue-50/50' : ''
                                                }`}
                                        >
                                            <Link
                                                href={notification.link || '#'}
                                                onClick={() => handleClick(notification)}
                                                className="flex-1"
                                            >
                                                <p className={`text-sm ${!notification.is_read ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>
                                                    {notification.message}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-400">
                                                    {new Date(notification.created_at).toLocaleDateString()}
                                                </p>
                                            </Link>
                                            <button
                                                onClick={(e) => handleDelete(notification.id, e)}
                                                className="text-slate-400 hover:text-red-500"
                                                title="Supprimer"
                                            >
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-slate-500">
                                    <p className="text-sm">Aucune notification</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
