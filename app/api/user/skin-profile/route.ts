import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await db.user.findUnique({
            where: { email: session.user.email },
            select: {
                skinProfile: true,
                subscriptionStatus: true,
            }
        })

        return NextResponse.json({
            skinProfile: user?.skinProfile || null,
            subscriptionStatus: user?.subscriptionStatus || 'free',
        })
    } catch (error) {
        console.error('Failed to fetch skin profile:', error)
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
    }
}
