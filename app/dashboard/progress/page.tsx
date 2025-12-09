import { createClient } from '@/lib/supabase/server'
import { ProgressStats } from '@/components/dashboard/progress-stats'
import { CourseProgressList } from '@/components/dashboard/course-progress-list'

export default async function ProgressPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Get user's progress data
  const { data: progressData } = await supabase
    .from('user_progress')
    .select(`
      *,
      course_lessons (
        id,
        title,
        duration_seconds,
        courses (
          id,
          title,
          slug
        )
      )
    `)
    .eq('user_id', user.id)

  // Calculate stats
  const totalHours = progressData?.reduce((acc: number, p: any) => {
    return acc + (p.progress_seconds || 0)
  }, 0) || 0

  const completedLessons = progressData?.filter((p: any) => p.completed).length || 0
  const totalLessons = progressData?.length || 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Progress</h1>
        <p className="text-muted-foreground">
          Track your learning journey and achievements
        </p>
      </div>

      <ProgressStats
        totalHours={Math.floor(totalHours / 3600)}
        completedLessons={completedLessons}
        totalLessons={totalLessons}
      />

      <CourseProgressList progressData={progressData || []} />
    </div>
  )
}

