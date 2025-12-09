import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  const params = await searchParams
  const orderId = params.order_id

  // Verify purchase was successful
  if (orderId) {
    const { data: purchase } = await supabase
      .from('purchases')
      .select('*, courses(*)')
      .eq('revolut_order_id', orderId)
      .eq('user_id', user.id)
      .single()

    if (purchase && purchase.status === 'completed') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
              <p className="text-muted-foreground">
                Your course has been unlocked. Start learning now!
              </p>
            </div>
            <div className="space-y-3">
              <Link href="/dashboard" className="block">
                <Button variant="revolut" size="lg" className="w-full">
                  Go to Dashboard
                </Button>
              </Link>
              <Link href={`/dashboard/course/${(purchase.courses as any).slug}`} className="block">
                <Button variant="outline" size="lg" className="w-full">
                  Start Learning
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-3xl font-bold mb-2">Processing...</h1>
        <p className="text-muted-foreground">
          We&apos;re confirming your payment. You&apos;ll receive an email when it&apos;s complete.
        </p>
        <Link href="/dashboard">
          <Button variant="outline" size="lg">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}

