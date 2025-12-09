import { CourseCard } from '@/components/courses/course-card'
import { createClient } from '@/lib/supabase/server'

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

export async function FeaturedCourses() {
  const supabase = await createClient()
  
  // Fetch published courses from database
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(3)

  // Fallback to mock data if no courses in database
  const featuredCourses = courses && courses.length > 0 ? courses : [
    {
      id: '1',
      title: 'Shanghai Fight Camp: Complete Striking System',
      slug: 'shanghai-fight-camp',
      description: 'Master the complete striking system used at the UFC Performance Institute Shanghai.',
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
      description: 'Detailed breakdown of Conor McGregor\'s devastating lead hand technique.',
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
      description: 'Transform your fight IQ in just 7 days with daily technique breakdowns.',
      price: 29,
      currency: 'EUR',
      thumbnail_url: '/img-3.jpg',
      video_preview_url: '/videos/fight-iq-preview.mp4',
      category: 'Strategy',
      level: 'all',
      duration_minutes: 120,
    },
  ]

  if (!featuredCourses || featuredCourses.length === 0) {
    return null
  }

  return (
    <section id="featured" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured Courses
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start your journey with these hand-picked courses designed to elevate your game
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {featuredCourses.map((course: Course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/courses"
            className="inline-flex items-center text-red-600 hover:text-red-500 font-semibold text-lg"
          >
            View All Courses
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

