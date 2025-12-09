import { createClient } from '@/lib/supabase/server'
import { DesktopNav } from '@/components/navigation/desktop-nav'
import { MobileNav } from '@/components/navigation/mobile-nav'
import { CourseHero } from '@/components/course/course-hero'
import { CourseCurriculum } from '@/components/course/course-curriculum'
import { CourseInstructor } from '@/components/course/course-instructor'
import { CourseReviews } from '@/components/course/course-reviews'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function CoursePage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Mock course data - replace with actual Supabase query
  const course = {
    id: '1',
    title: 'Shanghai Fight Camp: Complete Striking System',
    slug: 'shanghai-fight-camp',
    description: 'Master the complete striking system used at the UFC Performance Institute Shanghai. This comprehensive course covers everything from basic fundamentals to advanced combinations, footwork patterns, and fight IQ development.',
    longDescription: `Join Lee Hammond at the UFC Performance Institute in Shanghai for an in-depth look at professional-level striking. This course is designed for fighters of all levels who want to elevate their game.

You'll learn:
- Fundamental striking mechanics and proper form
- Advanced combinations and setups
- Footwork patterns that create angles
- Fight IQ and strategic thinking
- How to implement techniques in sparring and competition

Each lesson includes detailed breakdowns, slow-motion analysis, and practical drills you can do at home or in the gym.`,
    price: 29,
    currency: 'EUR',
    thumbnail_url: '/images/courses/striking.jpg',
    video_preview_url: '/videos/striking-preview.mp4',
    category: 'Striking',
    level: 'all',
    duration_minutes: 180,
    lessons: [
      { id: '1', title: 'Introduction to Striking Fundamentals', duration_seconds: 600, is_free: true },
      { id: '2', title: 'The Jab: Your Most Important Weapon', duration_seconds: 900, is_free: false },
      { id: '3', title: 'Cross and Power Punches', duration_seconds: 1200, is_free: false },
      { id: '4', title: 'Hooks and Uppercuts', duration_seconds: 1100, is_free: false },
      { id: '5', title: 'Combinations: Putting It Together', duration_seconds: 1500, is_free: false },
      { id: '6', title: 'Footwork and Angles', duration_seconds: 1800, is_free: false },
      { id: '7', title: 'Defense and Counter-Striking', duration_seconds: 1600, is_free: false },
      { id: '8', title: 'Fight IQ: Reading Your Opponent', duration_seconds: 1400, is_free: false },
    ],
  }

  if (!course) {
    notFound()
  }

  return (
    <>
      <DesktopNav user={user} />
      <main className="min-h-screen pb-20 md:pb-8">
        <CourseHero course={course} user={user} />
        <div className="container mx-auto px-4 py-12 space-y-16">
          <CourseCurriculum course={course} />
          <CourseInstructor />
          <CourseReviews courseId={course.id} />
        </div>
      </main>
      <MobileNav />
    </>
  )
}

