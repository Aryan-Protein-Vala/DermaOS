import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { callOpenRouter } from '@/lib/openrouter'
import { db } from '@/lib/db'

const ROUTINE_PROMPT = `You are an expert dermatologist. Based on the user's skin profile, generate a complete personalized skincare routine.

Consider:
- Their skin type, sensitivity, and concerns
- Climate/region (India has humid climate, adjust for region)
- Budget-friendly options available (recommend both drugstore and premium)
- Ingredient interactions (don't recommend conflicting actives together)
- Time of day (separate AM and PM routines)

Respond ONLY with valid JSON in this format:
{
  "amRoutine": [
    { "step": 1, "category": "Cleanser", "product": "Gentle foaming cleanser", "why": "Remove overnight oil without stripping", "timing": "1 minute" }
  ],
  "pmRoutine": [
    { "step": 1, "category": "Oil Cleanser", "product": "Cleansing balm", "why": "Remove sunscreen and makeup", "timing": "1 minute" }
  ],
  "weeklyTreatments": [
    { "treatment": "Clay mask", "frequency": "1x per week", "why": "Deep cleanse pores" }
  ],
  "diet": {
    "increase": ["Omega-3 fatty acids", "Zinc-rich foods", "Vitamin C fruits"],
    "avoid": ["High dairy", "Processed sugar", "Excessive caffeine"],
    "hydration": "2-3 liters of water daily"
  },
  "lifestyle": [
    "Change pillowcase twice a week",
    "Avoid touching face",
    "8 hours sleep minimum"
  ],
  "warnings": ["Always patch test new products", "Introduce actives slowly"]
}`

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { skinType, sensitivity, concerns, region } = body

        // Check subscription
        const user = await db.user.findUnique({
            where: { email: session.user.email },
            select: { subscriptionStatus: true }
        })

        if (user?.subscriptionStatus !== 'active') {
            return NextResponse.json({ error: 'Pro subscription required for routine generation' }, { status: 403 })
        }

        const userPrompt = `Generate a personalized skincare routine for:
- Skin Type: ${skinType || 'Combination'}
- Sensitivity: ${sensitivity || 'Medium'}
- Concerns: ${concerns?.join(', ') || 'General maintenance'}
- Region: ${region || 'India'}

Make recommendations suitable for this region's climate and available products.`

        const aiResponse = await callOpenRouter([
            { role: 'system', content: ROUTINE_PROMPT },
            { role: 'user', content: userPrompt }
        ], {
            temperature: 0.7,
            max_tokens: 1500
        })

        // Parse JSON response
        let routineData
        try {
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                routineData = JSON.parse(jsonMatch[0])
            } else {
                throw new Error('No JSON found')
            }
        } catch (parseError) {
            console.error('Failed to parse routine response:', aiResponse)
            return NextResponse.json({ error: 'Failed to generate routine' }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            routine: routineData
        })

    } catch (error) {
        console.error('Routine generation error:', error)
        return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
    }
}
