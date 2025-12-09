import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { VideoPlayer } from '@/components/video/video-player'
import { CourseLessonsList } from '@/components/course/course-lessons-list'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ lesson?: string; test?: string }>
}

export default async function CourseViewPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { lesson: lessonId, test: testId } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  // Get course
  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!course) {
    notFound()
  }

  // Check if user has access
  const { data: purchase } = await supabase
    .from('purchases')
    .select('*')
    .eq('course_id', course.id)
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .single()

  if (!purchase && course.instructor_id !== user.id) {
    redirect(`/course/${slug}`)
  }

  // Get lessons
  const { data: lessons } = await supabase
    .from('course_lessons')
    .select('*')
    .eq('course_id', course.id)
    .order('order', { ascending: true })

  // Get tests
  const { data: tests } = await supabase
    .from('course_tests')
    .select('*')
    .eq('course_id', course.id)
    .order('order', { ascending: true })

  const currentLesson = lessonId
    ? lessons?.find((l: any) => l.id === lessonId)
    : lessons?.[0]

  // If test is selected, redirect to test page
  if (testId) {
    redirect(`/dashboard/course/${slug}/test/${testId}`)
  }

  if (!currentLesson && (!lessons || lessons.length === 0)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <p className="text-muted-foreground">{course.description}</p>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">No lessons available yet.</p>
        </div>
        <div className="lg:col-span-1">
          <CourseLessonsList
            courseId={course.id}
            lessons={lessons || []}
            tests={tests || []}
            currentLessonId={currentLesson?.id}
            userId={user.id}
          />
        </div>
      </div>
    )
  }

  // Get user progress for this lesson
  const { data: progress } = currentLesson ? await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('lesson_id', currentLesson.id)
    .single() : { data: null }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
        <p className="text-muted-foreground">{course.description}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Video Player */}
        {currentLesson && (
          <div className="lg:col-span-2">
            <VideoPlayer
              src={currentLesson.video_url}
              title={currentLesson.title}
              onProgress={async (progressSeconds) => {
                // Update progress in background
                if (progressSeconds > 0) {
                  await supabase.from('user_progress').upsert({
                    user_id: user.id,
                    lesson_id: currentLesson.id,
                    progress_seconds: Math.floor(progressSeconds),
                    completed: progressSeconds >= currentLesson.duration_seconds * 0.9, // 90% watched = complete
                    last_watched_at: new Date().toISOString(),
                  })
                }
              }}
              onComplete={async () => {
                // Mark as completed
                await supabase.from('user_progress').upsert({
                  user_id: user.id,
                  lesson_id: currentLesson.id,
                  completed: true,
                  progress_seconds: currentLesson.duration_seconds,
                  last_watched_at: new Date().toISOString(),
                })
              }}
              className="aspect-video"
            />

            <div className="mt-6">
              <h2 className="text-2xl font-bold mb-4">{currentLesson.title}</h2>
              {currentLesson.description && (
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {currentLesson.description}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Lessons & Tests Sidebar */}
        <div className="lg:col-span-1">
          <CourseLessonsList
            courseId={course.id}
            lessons={lessons || []}
            tests={tests || []}
            currentLessonId={currentLesson?.id}
            userId={user.id}
          />
        </div>
      </div>
    </div>
  )
}

