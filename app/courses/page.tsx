import { createClient } from '@/lib/supabase/server'
import { DesktopNav } from '@/components/navigation/desktop-nav'
import { MobileNav } from '@/components/navigation/mobile-nav'
import { CourseFilters } from '@/components/courses/course-filters'
import { CourseCard } from '@/components/courses/course-card'

export default async function CoursesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch published courses from database
  const { data: dbCourses } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  // Use database courses or fallback to mock data
  const courses = dbCourses && dbCourses.length > 0 ? dbCourses : [
    {
      id: '1',
      title: 'Shanghai Fight Camp: Complete Striking System',
      slug: 'shanghai-fight-camp',
      description: 'Master the complete striking system used at the UFC Performance Institute Shanghai. Learn combinations, footwork, and fight IQ.',
      price: 29,
      currency: 'EUR',
      thumbnail_url: '/img-2.webp',
      video_preview_url: '/videos/striking-preview.mp4',
      category: 'Striking',
      level: 'all',
      duration_minutes: 180,
    },
    {
      id: '2',
      title: 'The McGregor Lead Hand',
      slug: 'mcgregor-lead-hand',
      description: 'Detailed breakdown of Conor McGregor\'s devastating lead hand technique and how to implement it in your game.',
      price: 29,
      currency: 'EUR',
      thumbnail_url: '/img-1.webp',
      video_preview_url: '/videos/lead-hand-preview.mp4',
      category: 'Technique',
      level: 'intermediate',
      duration_minutes: 90,
    },
    {
      id: '3',
      title: '7-Day Fight IQ Challenge',
      slug: '7-day-challenge',
      description: 'Transform your fight IQ in just 7 days with daily technique breakdowns and strategic thinking exercises.',
      price: 29,
      currency: 'EUR',
      thumbnail_url: '/img-3.jpg',
      video_preview_url: '/videos/fight-iq-preview.mp4',
      category: 'Strategy',
      level: 'all',
      duration_minutes: 120,
    },
    {
      id: '4',
      title: 'Advanced Combinations',
      slug: 'advanced-combinations',
      description: 'High-level striking combinations and setups used by professional fighters.',
      price: 29,
      currency: 'EUR',
      thumbnail_url: '/img-6.png',
      video_preview_url: '/videos/combinations-preview.mp4',
      category: 'Striking',
      level: 'advanced',
      duration_minutes: 150,
    },
    {
      id: '5',
      title: 'Footwork Fundamentals',
      slug: 'footwork-fundamentals',
      description: 'Master the footwork patterns that create angles and opportunities in the cage.',
      price: 29,
      currency: 'EUR',
      thumbnail_url: '/img-5.png',
      video_preview_url: '/videos/footwork-preview.mp4',
      category: 'Movement',
      level: 'beginner',
      duration_minutes: 120,
    },
    {
      id: '6',
      title: 'Cage Control Mastery',
      slug: 'cage-control',
      description: 'Learn how to control the octagon and dictate the pace of the fight.',
      price: 29,
      currency: 'EUR',
      thumbnail_url: '/img-4.jpg',
      video_preview_url: '/videos/cage-control-preview.mp4',
      category: 'Strategy',
      level: 'intermediate',
      duration_minutes: 100,
    },
  ]

  return (
    <>
      <DesktopNav user={user} />
      <main className="min-h-screen pb-20 md:pb-8">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              All Courses
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Choose from our growing library of professional MMA training courses
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 flex-shrink-0">
              <CourseFilters />
            </aside>

            <div className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-muted-foreground">
                  {courses.length} courses available
                </p>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <MobileNav />
    </>
  )
}

