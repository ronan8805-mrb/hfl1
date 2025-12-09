import { createClient } from '@/lib/supabase/server'
import { MyCourses } from '@/components/dashboard/my-courses'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Get user's purchased courses
  const { data: purchases } = await supabase
    .from('purchases')
    .select(`
      *,
      courses (
        id,
        title,
        slug,
        thumbnail_url,
        duration_minutes,
        category
      )
    `)
    .eq('user_id', user.id)
    .eq('status', 'completed')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Continue your training journey.
        </p>
      </div>

      <MyCourses purchases={purchases || []} />
    </div>
  )
}

