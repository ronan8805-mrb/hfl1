import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Play } from 'lucide-react'

interface ProgressData {
  id: string
  completed: boolean
  progress_seconds: number
  course_lessons: {
    id: string
    title: string
    duration_seconds: number
    courses: {
      id: string
      title: string
      slug: string
    }
  }
}

interface CourseProgressListProps {
  progressData: ProgressData[]
}

export function CourseProgressList({ progressData }: CourseProgressListProps) {
  // Group progress by course
  const courseMap = new Map<string, {
    course: { id: string; title: string; slug: string }
    lessons: Array<{ completed: boolean; progress: number; total: number }>
  }>()

  progressData.forEach((item) => {
    const courseId = item.course_lessons.courses.id
    if (!courseMap.has(courseId)) {
      courseMap.set(courseId, {
        course: item.course_lessons.courses,
        lessons: [],
      })
    }
    const course = courseMap.get(courseId)!
    course.lessons.push({
      completed: item.completed,
      progress: item.progress_seconds,
      total: item.course_lessons.duration_seconds,
    })
  })

  const courses = Array.from(courseMap.values())

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No progress data yet. Start a course to track your progress!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Course Progress</h2>
      {courses.map(({ course, lessons }) => {
        const totalProgress = lessons.reduce((acc, l) => acc + l.progress, 0)
        const totalDuration = lessons.reduce((acc, l) => acc + l.total, 0)
        const progressPercent = totalDuration > 0 ? (totalProgress / totalDuration) * 100 : 0
        const completedCount = lessons.filter(l => l.completed).length

        return (
          <Card key={course.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Link href={`/dashboard/course/${course.slug}`}>
                    <h3 className="text-xl font-bold mb-2 hover:text-red-600 transition-colors">
                      {course.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {completedCount} of {lessons.length} lessons completed
                  </p>
                </div>
                <Link href={`/dashboard/course/${course.slug}`}>
                  <Button variant="outline">
                    <Play className="mr-2 h-4 w-4" />
                    Continue
                  </Button>
                </Link>
              </div>
              <Progress value={progressPercent} className="h-3" />
              <p className="text-sm text-muted-foreground mt-2">
                {Math.round(progressPercent)}% complete
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

