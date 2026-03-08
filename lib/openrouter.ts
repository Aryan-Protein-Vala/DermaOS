// OpenRouter AI Client for DermaOS
// Uses gpt-4o-mini via OpenRouter for skin analysis

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

interface ChatMessage {
    role: 'system' | 'user' | 'assistant'
    content: string | { type: string; text?: string; image_url?: { url: string } }[]
}

interface OpenRouterResponse {
    id: string
    choices: {
        message: {
            role: string
            content: string
        }
        finish_reason: string
    }[]
    usage: {
        prompt_tokens: number
        completion_tokens: number
        total_tokens: number
    }
}

export async function callOpenRouter(
    messages: ChatMessage[],
    options?: {
        model?: string
        temperature?: number
        max_tokens?: number
    }
): Promise<string> {
    const apiKey = process.env.OPENROUTER_API_KEY

    if (!apiKey) {
        throw new Error('OPENROUTER_API_KEY is not set')
    }

    const model = options?.model || process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini'

    const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://dermaos.com',
            'X-Title': 'DermaOS',
        },
        body: JSON.stringify({
            model,
            messages,
            temperature: options?.temperature ?? 0.7,
            max_tokens: options?.max_tokens ?? 1000,
        }),
    })

    if (!response.ok) {
        const errorText = await response.text()
        console.error('OpenRouter API error:', errorText)
        throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const data: OpenRouterResponse = await response.json()

    if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from OpenRouter')
    }

    return data.choices[0].message.content
}

// Skin Analysis Prompt
export const SKIN_ANALYSIS_SYSTEM_PROMPT = `You are an expert dermatologist AI assistant for DermaOS. 
Your job is to analyze skin based on user descriptions and provide personalized skincare advice.

When analyzing skin, you should determine:
1. Skin Type (Oily, Dry, Combination, Normal)
2. Sensitivity Level (Low, Medium, High)
3. Primary Concerns (choose from: Acne, Texture, Hyperpigmentation, Fine Lines, Dehydration, Redness, Large Pores, Dark Circles, Dullness)
4. Skin Metric Scores (0-100 scale) with current value and 4-week prediction after following your routine
5. AM Skincare Routine (4-5 steps)
6. PM Skincare Routine (4-5 steps)
7. Diet Recommendations (foods to increase and avoid)
8. Lifestyle Tips (2-3 actionable tips)

Always respond in valid JSON format with the following structure:
{
  "skinType": "string",
  "sensitivity": "string",
  "concerns": ["array of concerns"],
  "hydrationLevel": "Low/Medium/High",
  "oilLevel": "Low/Medium/High",
  "metrics": {
    "oiliness": { "current": 0-100, "predicted": 0-100 },
    "hydration": { "current": 0-100, "predicted": 0-100 },
    "acne": { "current": 0-100, "predicted": 0-100 },
    "texture": { "current": 0-100, "predicted": 0-100 },
    "elasticity": { "current": 0-100, "predicted": 0-100 },
    "pigmentation": { "current": 0-100, "predicted": 0-100 }
  },
  "overallScore": { "current": 0-100, "predicted": 0-100 },
  "amRoutine": [
    { "step": 1, "product": "string", "purpose": "string" }
  ],
  "pmRoutine": [
    { "step": 1, "product": "string", "purpose": "string" }
  ],
  "diet": {
    "increase": ["array"],
    "avoid": ["array"]
  },
  "lifestyleTips": ["array"],
  "summary": "A brief 2-3 sentence personalized summary"
}

IMPORTANT: For metrics, higher scores mean BETTER skin health.
- Oiliness: 100 = perfectly balanced, 0 = extremely oily
- Hydration: 100 = well hydrated, 0 = very dehydrated
- Acne: 100 = clear skin, 0 = severe acne
- Texture: 100 = smooth, 0 = very rough
- Elasticity: 100 = firm and youthful, 0 = loss of elasticity
- Pigmentation: 100 = even tone, 0 = severe hyperpigmentation

The "predicted" value should show realistic improvement after 4 weeks of following your recommended routine.`

// Routine Generation Prompt
export const ROUTINE_GENERATION_PROMPT = `Based on the user's skin profile, generate a complete personalized skincare routine.

Consider:
- Their skin type and sensitivity
- Climate/region (India has humid climate)
- Budget-friendly options available in their region
- Ingredient interactions (don't recommend conflicting actives)

Respond in valid JSON format.`
