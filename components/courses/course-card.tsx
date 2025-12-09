'use client'

import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Clock, BarChart } from 'lucide-react'
import { useState } from 'react'

interface Course {
  id: string
  title: string
  slug: string
  description: string
  price: number
  currency: string
  thumbnail_url: string
  video_preview_url?: string | null
  category: string
  level: string
  duration_minutes: number
}

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card 
      className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 bg-card/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/course/${course.slug}`}>
        <div className="relative aspect-video overflow-hidden bg-muted">
          {isHovered && course.video_preview_url ? (
            <video
              src={course.video_preview_url}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
          <div className="absolute top-3 right-3">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {course.category}
            </span>
          </div>
        </div>
      </Link>

      <CardContent className="p-6">
        <Link href={`/course/${course.slug}`}>
          <h3 className="text-xl font-bold mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
            {course.title}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{Math.floor(course.duration_minutes / 60)}h {course.duration_minutes % 60}m</span>
          </div>
          <div className="flex items-center gap-1">
            <BarChart className="w-4 h-4" />
            <span className="capitalize">{course.level}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex items-center justify-between">
        <div className="text-2xl font-bold text-foreground">
          €{course.price}
        </div>
        <Link href={`/course/${course.slug}`}>
          <Button variant="revolut">
            View Course
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

