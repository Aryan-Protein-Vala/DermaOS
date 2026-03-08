import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { callOpenRouter, SKIN_ANALYSIS_SYSTEM_PROMPT } from '@/lib/openrouter'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { skinDescription, age, gender, climate, concerns, image } = body

        if (!skinDescription) {
            return NextResponse.json({ error: 'Skin description is required' }, { status: 400 })
        }

        // Check user's subscription status
        const user = await db.user.findUnique({
            where: { email: session.user.email },
            select: { subscriptionStatus: true, skinProfile: true }
        })

        const hasAccess = user?.subscriptionStatus === 'active'

        if (!hasAccess) {
            return NextResponse.json({ error: 'Pro subscription required for AI analysis' }, { status: 403 })
        }

        // Build the user prompt with all the details
        const userPrompt = `Please analyze my skin based on the following information:

DESCRIPTION: ${skinDescription}
${age ? `AGE: ${age}` : ''}
${gender ? `GENDER: ${gender}` : ''}
${concerns?.length ? `MAIN CONCERNS: ${concerns.join(', ')}` : ''}

${image ? 'NOTE: A skin photo has also been provided for visual analysis.' : ''}

Based on ALL the information provided above, provide a comprehensive and PERSONALIZED skin analysis. 
Make sure your recommendations are specific to the concerns and description mentioned.
Provide detailed routine recommendations tailored to these specific needs.`

        console.log('=== AI SKIN ANALYSIS REQUEST ===')
        console.log('User:', session.user.email)
        console.log('Description:', skinDescription)
        console.log('Concerns:', concerns)
        console.log('Has Image:', !!image)

        // Build messages array - include image if provided
        type MessageContent = string | { type: string; text?: string; image_url?: { url: string } }[]

        const messages: { role: 'system' | 'user' | 'assistant'; content: MessageContent }[] = [
            { role: 'system', content: SKIN_ANALYSIS_SYSTEM_PROMPT }
        ]

        // If image is provided, send as multimodal content
        if (image) {
            messages.push({
                role: 'user',
                content: [
                    {
                        type: 'image_url',
                        image_url: {
                            url: image // base64 image data URL
                        }
                    },
                    {
                        type: 'text',
                        text: userPrompt
                    }
                ]
            })
        } else {
            messages.push({
                role: 'user',
                content: userPrompt
            })
        }

        // Call OpenRouter with vision-capable model if image is provided
        const aiResponse = await callOpenRouter(messages, {
            model: image ? 'openai/gpt-4o-mini' : undefined, // Use vision model for images
            temperature: 0.8,
            max_tokens: 2000
        })

        console.log('=== AI RESPONSE ===')
        console.log('Response length:', aiResponse.length)
        console.log('Response preview:', aiResponse.substring(0, 300))

        // Parse the JSON response
        let analysisData
        try {
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                analysisData = JSON.parse(jsonMatch[0])
            } else {
                throw new Error('No JSON found in response')
            }
        } catch (parseError) {
            console.error('Failed to parse AI response:', aiResponse)
            return NextResponse.json({
                error: 'Failed to parse analysis',
                rawResponse: aiResponse
            }, { status: 500 })
        }

        // Save analysis to user profile
        await db.user.update({
            where: { email: session.user.email },
            data: {
                skinProfile: analysisData
            }
        })

        return NextResponse.json({
            success: true,
            analysis: analysisData
        })

    } catch (error) {
        console.error('Skin analysis error:', error)
        return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
    }
}
