import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { courseId, amount, currency } = await request.json()

    if (!courseId || !amount || !currency) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create Revolut checkout link via API
    // This is a placeholder - implement actual Revolut Business API integration
    const revolutApiKey = process.env.REVOLUT_API_KEY
    const merchantId = process.env.REVOLUT_MERCHANT_ID

    if (!revolutApiKey || !merchantId) {
      return NextResponse.json(
        { error: 'Revolut API not configured' },
        { status: 500 }
      )
    }

    // Create order in Revolut
    const revolutResponse = await fetch('https://b2b.revolut.com/api/1.0/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${revolutApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency,
        customer_id: user.id,
        description: `Hammond's Fight Lab - Course Purchase`,
        merchant_order_ext_ref: `course-${courseId}-${Date.now()}`,
        capture_mode: 'AUTOMATIC',
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?order_id={order_id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/course/${courseId}`,
      }),
    })

    if (!revolutResponse.ok) {
      const error = await revolutResponse.text()
      console.error('Revolut API error:', error)
      return NextResponse.json(
        { error: 'Failed to create Revolut checkout' },
        { status: 500 }
      )
    }

    const order = await revolutResponse.json()

    // Store pending purchase in Supabase
    await supabase.from('purchases').insert({
      user_id: user.id,
      course_id: courseId,
      revolut_order_id: order.id,
      amount: amount,
      currency: currency,
      status: 'pending',
    })

    // Return checkout URL
    return NextResponse.json({
      checkoutUrl: order.checkout_url || `https://pay.revolut.com/${order.public_id}`,
      orderId: order.id,
    })
  } catch (error: any) {
    console.error('Checkout creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

