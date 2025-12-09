import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MessagesList } from '@/components/messages/messages-list'
import { MessageThread } from '@/components/messages/message-thread'

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ thread?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  const params = await searchParams
  const threadId = params.thread

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-4rem)]">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">Messages</h1>
        <p className="text-muted-foreground">
          Direct messaging with Lee Hammond and the team
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 h-[calc(100vh-12rem)]">
        <MessagesList userId={user.id} selectedThread={threadId} />
        {threadId ? (
          <MessageThread threadId={threadId} userId={user.id} />
        ) : (
          <div className="hidden md:flex items-center justify-center border border-border rounded-lg bg-card/50">
            <p className="text-muted-foreground">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  )
}

