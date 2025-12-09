import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { TestComponent } from '@/components/tests/test-component'

interface PageProps {
  params: Promise<{ slug: string; testId: string }>
}

export default async function TestPage({ params }: PageProps) {
  const { slug, testId } = await params
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

  // Get test with questions
  const { data: test } = await supabase
    .from('course_tests')
    .select('*')
    .eq('id', testId)
    .eq('course_id', course.id)
    .single()

  if (!test) {
    notFound()
  }

  // Get questions with options
  const { data: questions } = await supabase
    .from('test_questions')
    .select(`
      *,
      options:test_question_options(*),
      answers:test_question_answers(*)
    `)
    .eq('test_id', testId)
    .order('order', { ascending: true })

  // Get user's previous attempts
  const { data: attempts } = await supabase
    .from('user_test_attempts')
    .select('*')
    .eq('user_id', user.id)
    .eq('test_id', testId)
    .order('created_at', { ascending: false })
    .limit(1)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{test.title}</h1>
        {test.description && (
          <p className="text-muted-foreground">{test.description}</p>
        )}
        <p className="text-sm text-muted-foreground mt-2">
          Passing Grade: {test.passing_grade}% • {questions?.length || 0} questions
        </p>
      </div>

      <TestComponent
        test={test}
        questions={questions || []}
        userId={user.id}
        previousAttempt={attempts?.[0] || null}
      />
    </div>
  )
}

