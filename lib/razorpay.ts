import Razorpay from 'razorpay'

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Missing Razorpay environment variables')
}

export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

export const SUBSCRIPTION_PLANS = {
    monthly: {
        id: 'monthly',
        name: 'Pro Monthly',
        priceInr: 749,
        priceUsd: 9,
        period: 'monthly',
    },
    yearly: {
        id: 'yearly',
        name: 'Pro Yearly',
        priceInr: 5999,
        priceUsd: 79,
        period: 'yearly',
    },
    'one-time': {
        id: 'one-time',
        name: 'Single Scan',
        priceInr: 399,
        priceUsd: 4.99,
        period: 'one-time',
    },
} as const

export type PlanId = keyof typeof SUBSCRIPTION_PLANS
