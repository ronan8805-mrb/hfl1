import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CommunityFeed } from '@/components/community/community-feed'

export default async function CommunityPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Community</h1>
        <p className="text-muted-foreground">
          Connect with Lee and fellow fighters. Share your progress, ask questions, and learn together.
        </p>
      </div>

      <CommunityFeed userId={user.id} />
    </div>
  )
}

