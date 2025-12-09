import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { DesktopNav } from '@/components/navigation/desktop-nav'
import { MobileNav } from '@/components/navigation/mobile-nav'
import { HeroSection } from '@/components/home/hero-section'
import { FeaturedCourses } from '@/components/home/featured-courses'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { TrustBar } from '@/components/home/trust-bar'
import { Footer } from '@/components/footer/footer'

async function getUser() {
  try {
    const supabase = await createClient()
    if (supabase && typeof supabase.auth !== 'undefined') {
      const { data } = await supabase.auth.getUser()
      return data?.user || null
    }
  } catch (error) {
    // Environment variables not set
  }
  return null
}

export default async function HomePage() {
  const user = await getUser()

  return (
    <div className="min-h-screen bg-background">
      <DesktopNav user={user} />
      <main className="pb-20 md:pb-0">
        <Suspense fallback={<div className="h-[90vh]" />}>
          <HeroSection />
        </Suspense>
        <TrustBar />
        <Suspense fallback={<div className="py-20" />}>
          <FeaturedCourses />
        </Suspense>
        <TestimonialsSection />
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}
