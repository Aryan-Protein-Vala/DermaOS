import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { razorpay, SUBSCRIPTION_PLANS, PlanId } from '@/lib/razorpay'

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { planId, region } = await request.json()

        if (!planId || !SUBSCRIPTION_PLANS[planId as PlanId]) {
            return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
        }

        const plan = SUBSCRIPTION_PLANS[planId as PlanId]
        const amount = region === 'IN' ? plan.priceInr : plan.priceUsd
        const currency = region === 'IN' ? 'INR' : 'USD'

        const order = await razorpay.orders.create({
            amount: amount * 100, // Razorpay expects amount in paise/cents
            currency,
            receipt: `receipt_${Date.now()}`,
            notes: {
                userId: (session.user as any).id,
                planId,
                email: session.user.email,
            },
        })

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
        })
    } catch (error) {
        console.error('Create order error:', error)
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        )
    }
}
