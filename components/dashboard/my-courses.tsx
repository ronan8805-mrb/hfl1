'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { Play, Download } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Purchase {
  id: string
  course_id: string
  courses: {
    id: string
    title: string
    slug: string
    thumbnail_url: string
    duration_minutes: number
    category: string
  }
}

interface MyCoursesProps {
  purchases: Purchase[]
}

export function MyCourses({ purchases }: MyCoursesProps) {
  const [offlineMode, setOfflineMode] = useState<Record<string, boolean>>({})

  if (purchases.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-semibold mb-4">No courses yet</h3>
        <p className="text-muted-foreground mb-6">
          Start your training journey by purchasing your first course
        </p>
        <Link href="/courses">
          <Button variant="revolut" size="lg">
            Browse Courses
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Courses</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {purchases.map((purchase) => {
          const course = purchase.courses
          // Mock progress - replace with actual user progress query
          const progress = 35
          const completedLessons = 3
          const totalLessons = 8

          return (
            <Card key={purchase.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <Link href={`/dashboard/course/${course.slug}`}>
                <div className="relative aspect-video bg-muted">
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {course.category}
                    </span>
                  </div>
                </div>
              </Link>

              <CardContent className="p-6">
                <Link href={`/dashboard/course/${course.slug}`}>
                  <h3 className="text-xl font-bold mb-2 hover:text-red-600 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                </Link>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      {completedLessons} of {totalLessons} lessons
                    </span>
                    <span className="font-semibold">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/course/${course.slug}`} className="flex-1">
                    <Button variant="default" className="w-full">
                      <Play className="mr-2 h-4 w-4" />
                      Continue
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setOfflineMode(prev => ({
                      ...prev,
                      [course.id]: !prev[course.id]
                    }))}
                    title={offlineMode[course.id] ? 'Disable offline' : 'Enable offline'}
                  >
                    <Download className={cn(
                      "h-4 w-4",
                      offlineMode[course.id] && "text-red-600"
                    )} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

