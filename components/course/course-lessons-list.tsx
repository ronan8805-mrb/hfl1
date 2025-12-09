'use client'

import Link from 'next/link'
import { CheckCircle, Lock, Play, FileQuestion } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface Lesson {
  id: string
  title: string
  duration_seconds: number
  is_free: boolean
  order: number
}

interface Test {
  id: string
  title: string
  description: string | null
  passing_grade: number
  order: number
}

interface CourseLessonsListProps {
  courseId: string
  lessons: Lesson[]
  tests?: Test[]
  currentLessonId?: string
  userId: string
}

export function CourseLessonsList({ lessons, tests = [], currentLessonId, userId }: CourseLessonsListProps) {
  // Mock progress - replace with actual query
  const lessonProgress: Record<string, { completed: boolean; progress: number }> = {}
  const testAttempts: Record<string, { passed: boolean; score: number }> = {}

  // Combine lessons and tests, sort by order
  const allItems = [
    ...lessons.map(l => ({ ...l, type: 'lesson' as const })),
    ...tests.map(t => ({ ...t, type: 'test' as const }))
  ].sort((a, b) => a.order - b.order)

  return (
    <Card>
      <CardContent className="p-0">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold">Course Content</h3>
          <p className="text-sm text-muted-foreground">
            {lessons.length} lessons • {tests.length} tests
          </p>
        </div>
        <div className="divide-y divide-border max-h-[calc(100vh-12rem)] overflow-y-auto">
          {allItems.map((item, index) => {
            if (item.type === 'lesson') {
              const lesson = item
              const isActive = lesson.id === currentLessonId
              const progress = lessonProgress[lesson.id]
              const isCompleted = progress?.completed || false

              return (
                <Link
                  key={lesson.id}
                  href={`?lesson=${lesson.id}`}
                  className={cn(
                    'block p-4 hover:bg-accent transition-colors',
                    isActive && 'bg-accent border-l-4 border-red-600'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-muted-foreground flex items-center justify-center">
                          <span className="text-xs">{index + 1}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={cn(
                          'font-medium text-sm',
                          isActive && 'text-red-600'
                        )}>
                          {lesson.title}
                        </h4>
                        {lesson.is_free && (
                          <span className="text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded">
                            Free
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{Math.floor(lesson.duration_seconds / 60)}m</span>
                        {progress && progress.progress > 0 && (
                          <Progress value={(progress.progress / lesson.duration_seconds) * 100} className="w-16 h-1" />
                        )}
                      </div>
                    </div>
                    {isActive && (
                      <Play className="w-4 h-4 text-red-600 flex-shrink-0" />
                    )}
                  </div>
                </Link>
              )
            } else {
              const test = item
              const attempt = testAttempts[test.id]
              const isPassed = attempt?.passed || false
              const score = attempt?.score || 0

              return (
                <Link
                  key={test.id}
                  href={`?test=${test.id}`}
                  className={cn(
                    'block p-4 hover:bg-accent transition-colors',
                    'border-l-4 border-blue-600'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {isPassed ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <FileQuestion className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">
                          {test.title}
                        </h4>
                        <span className="text-xs bg-blue-500/20 text-blue-500 px-2 py-0.5 rounded">
                          Test
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Pass: {test.passing_grade}%</span>
                        {attempt && (
                          <span className={cn(
                            'font-semibold',
                            isPassed ? 'text-green-500' : 'text-red-500'
                          )}>
                            {score}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            }
          })}
        </div>
      </CardContent>
    </Card>
  )
}

