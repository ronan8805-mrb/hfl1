'use client'

import { Button } from '@/components/ui/button'
import { RevolutPayButton } from '@/components/payments/revolut-pay-button'
import { User } from '@supabase/supabase-js'
import { Clock, BarChart, Users } from 'lucide-react'
import { useState } from 'react'

interface Course {
  id: string
  title: string
  slug: string
  description: string
  longDescription?: string
  price: number
  currency: string
  thumbnail_url: string
  video_preview_url?: string | null
  category: string
  level: string
  duration_minutes: number
}

interface CourseHeroProps {
  course: Course
  user: User | null
}

export function CourseHero({ course, user }: CourseHeroProps) {
  const [showVideo, setShowVideo] = useState(false)

  return (
    <section className="relative">
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Video/Thumbnail */}
          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
            {showVideo && course.video_preview_url ? (
              <video
                src={course.video_preview_url}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setShowVideo(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
                >
                  <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center hover:scale-110 transition-transform">
                    <svg
                      className="w-10 h-10 text-white ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </button>
              </>
            )}
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div>
              <span className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
                {course.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-muted-foreground mb-6">{course.description}</p>
            </div>

            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <span>{Math.floor(course.duration_minutes / 60)}h {course.duration_minutes % 60}m</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart className="w-5 h-5 text-muted-foreground" />
                <span className="capitalize">{course.level}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-muted-foreground" />
                <span>1,234 students</span>
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold">€{course.price}</span>
                <span className="text-muted-foreground line-through">€99</span>
              </div>

              {user ? (
                <RevolutPayButton
                  courseId={course.id}
                  amount={course.price}
                  currency={course.currency}
                  className="w-full"
                />
              ) : (
                <div className="space-y-3">
                  <RevolutPayButton
                    courseId={course.id}
                    amount={course.price}
                    currency={course.currency}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    You&apos;ll be able to access this course immediately after purchase
                  </p>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-border">
              <h3 className="font-semibold mb-3">What you&apos;ll learn:</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Professional-level striking techniques</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Advanced combinations and setups</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Footwork patterns that create angles</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Fight IQ and strategic thinking</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

