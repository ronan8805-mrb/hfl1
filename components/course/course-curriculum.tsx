import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Clock, Lock } from 'lucide-react'

interface Course {
  id: string
  title: string
  lessons?: Array<{
    id: string
    title: string
    duration_seconds: number
    is_free: boolean
  }>
}

interface CourseCurriculumProps {
  course: Course
}

export function CourseCurriculum({ course }: CourseCurriculumProps) {
  const lessons = course.lessons || []

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    return `${minutes}m`
  }

  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">Course Curriculum</h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="curriculum">
          <AccordionTrigger className="text-xl">
            {lessons.length} Lessons • {Math.floor(lessons.reduce((acc, l) => acc + l.duration_seconds, 0) / 60)} minutes
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-4">
              {lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{lesson.title}</h3>
                        {lesson.is_free && (
                          <span className="text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded">
                            Free
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(lesson.duration_seconds)}</span>
                    </div>
                    {!lesson.is_free && (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  )
}

