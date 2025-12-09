'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface MessagesListProps {
  userId: string
  selectedThread?: string
}

interface Thread {
  id: string
  other_user: {
    id: string
    full_name: string | null
    email: string
    avatar_url: string | null
  }
  last_message: {
    content: string
    created_at: string
    read: boolean
  }
  unread_count: number
}

export function MessagesList({ userId, selectedThread }: MessagesListProps) {
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Fetch message threads
    const fetchThreads = async () => {
      const { data: messages } = await supabase
        .from('messages')
        .select(`
          id,
          sender_id,
          recipient_id,
          content,
          created_at,
          read,
          sender:profiles!messages_sender_id_fkey(id, full_name, email, avatar_url),
          recipient:profiles!messages_recipient_id_fkey(id, full_name, email, avatar_url)
        `)
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .order('created_at', { ascending: false })

      if (messages) {
        // Group messages by thread (other user)
        const threadMap = new Map<string, Thread>()

        messages.forEach((msg: any) => {
          const otherUser = msg.sender_id === userId ? msg.recipient : msg.sender
          const threadId = otherUser.id

          if (!threadMap.has(threadId)) {
            threadMap.set(threadId, {
              id: threadId,
              other_user: otherUser,
              last_message: {
                content: msg.content,
                created_at: msg.created_at,
                read: msg.read,
              },
              unread_count: 0,
            })
          }

          const thread = threadMap.get(threadId)!
          if (!msg.read && msg.recipient_id === userId) {
            thread.unread_count++
          }
        })

        setThreads(Array.from(threadMap.values()))
      }

      setLoading(false)
    }

    fetchThreads()

    // Subscribe to new messages
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${userId}`,
        },
        () => {
          fetchThreads()
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${userId}`,
        },
        () => {
          fetchThreads()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, supabase])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Loading conversations...</p>
        </CardContent>
      </Card>
    )
  }

  if (threads.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center py-8">
            No messages yet. Start a conversation!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-2 overflow-y-auto">
      {threads.map((thread) => (
        <Link key={thread.id} href={`/dashboard/messages?thread=${thread.id}`}>
          <Card
            className={cn(
              'cursor-pointer hover:bg-accent transition-colors',
              selectedThread === thread.id && 'bg-accent border-primary'
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={thread.other_user.avatar_url || undefined} />
                  <AvatarFallback>
                    {thread.other_user.full_name?.charAt(0) || thread.other_user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold truncate">
                      {thread.other_user.full_name || 'Team Member'}
                    </h3>
                    {thread.unread_count > 0 && (
                      <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                        {thread.unread_count}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate mb-1">
                    {thread.last_message.content}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(thread.last_message.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

