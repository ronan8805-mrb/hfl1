import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface CourseReviewsProps {
  courseId: string
}

export function CourseReviews({ courseId }: CourseReviewsProps) {
  // Mock reviews - replace with actual Supabase query
  const reviews = [
    {
      id: '1',
      user_name: 'Marcus Chen',
      user_avatar: '/avatars/marcus.jpg',
      rating: 5,
      content: 'This course completely transformed my striking. Lee\'s teaching style is clear and the techniques are immediately applicable. Worth every euro!',
      created_at: '2024-01-15',
    },
    {
      id: '2',
      user_name: 'Sarah Mitchell',
      user_avatar: '/avatars/sarah.jpg',
      rating: 5,
      content: 'As a beginner, I was worried this might be too advanced, but Lee breaks everything down perfectly. The progression is excellent.',
      created_at: '2024-01-10',
    },
    {
      id: '3',
      user_name: 'James Rodriguez',
      user_avatar: '/avatars/james.jpg',
      rating: 5,
      content: 'Finally, a course from someone who actually fights. No fluff, just real techniques that work in competition.',
      created_at: '2024-01-05',
    },
  ]

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Student Reviews</h2>
        <div className="text-right">
          <div className="text-2xl font-bold">4.9</div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className="w-5 h-5 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">Based on {reviews.length} reviews</p>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage src={review.user_avatar} alt={review.user_name} />
                  <AvatarFallback>
                    {review.user_name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold">{review.user_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 text-yellow-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.content}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-6 bg-green-500/10 border border-green-500/20 rounded-lg">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <div className="font-semibold">30-Day Money-Back Guarantee</div>
            <div className="text-sm text-muted-foreground">
              Not satisfied? Get a full refund within 30 days, no questions asked.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

