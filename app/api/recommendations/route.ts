import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { findMatchingProducts, getPersonalizedRecommendations } from '@/lib/rag-engine'
import { db as prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)

        const skinType = searchParams.get('skinType')
        const concerns = searchParams.get('concerns')?.split(',') || []
        const region = (searchParams.get('region') as 'IN' | 'GLOBAL') || 'GLOBAL'
        const category = searchParams.get('category')
        const limit = parseInt(searchParams.get('limit') || '12')
        const personalized = searchParams.get('personalized') === 'true'

        // If personalized, get user's skin profile
        if (personalized) {
            const session = await getServerSession(authOptions)

            if (!session?.user?.email) {
                return NextResponse.json(
                    { error: 'Authentication required for personalized recommendations' },
                    { status: 401 }
                )
            }

            const user = await prisma.user.findUnique({
                where: { email: session.user.email },
                select: { skinProfile: true, skinType: true, concerns: true }
            })

            if (!user?.skinProfile && !user?.skinType) {
                return NextResponse.json(
                    { error: 'Complete your skin analysis first for personalized recommendations' },
                    { status: 400 }
                )
            }

            // Get personalized recommendations based on AI analysis
            const recommendations = await getPersonalizedRecommendations(
                user.skinProfile || { skinType: user.skinType, concerns: user.concerns },
                region
            )

            return NextResponse.json({
                personalized: true,
                routine: recommendations.routine,
                topPicks: recommendations.topPicks
            })
        }

        // Standard recommendations based on query params
        const products = await findMatchingProducts(
            { skinType: skinType || undefined, concerns },
            { limit, region, category: category || undefined }
        )

        return NextResponse.json({
            products,
            count: products.length,
            filters: { skinType, concerns, region, category }
        })

    } catch (error) {
        console.error('Recommendations API error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch recommendations' },
            { status: 500 }
        )
    }
}
