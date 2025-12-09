import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('revolut-signature')

    // Verify webhook signature
    const webhookSecret = process.env.REVOLUT_WEBHOOK_SECRET
    if (!webhookSecret) {
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex')

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(body)

    // Handle different event types
    if (event.type === 'ORDER_COMPLETED') {
      const orderId = event.data.id
      const status = event.data.state

      const supabase = await createClient()

      // Find purchase by Revolut order ID
      const { data: purchase } = await supabase
        .from('purchases')
        .select('*')
        .eq('revolut_order_id', orderId)
        .single()

      if (purchase) {
        // Update purchase status
        await supabase
          .from('purchases')
          .update({ status: status === 'COMPLETED' ? 'completed' : 'failed' })
          .eq('id', purchase.id)

        // If completed, ensure user has access (course unlock happens automatically via RLS)
        if (status === 'COMPLETED') {
          // Send welcome email, etc.
          console.log(`Course unlocked for user ${purchase.user_id}`)
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

