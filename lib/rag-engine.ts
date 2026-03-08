import { db as prisma } from './db'
import { Product } from '@prisma/client'

interface UserProfile {
    skinType?: string
    sensitivity?: string
    concerns?: string[]
}

interface ProductMatch {
    id: string
    name: string
    brand: string
    category: string
    image: string
    priceInr: number | null
    priceUsd: number | null
    affiliateUrl: string | null
    ingredientsIncis: string[]
    skinTypes: string[]
    concerns: string[]
    region: string
    matchScore: number
    matchReasons: string[]
}

/**
 * Find products that match a user's skin profile
 */
export async function findMatchingProducts(
    profile: UserProfile,
    options: {
        limit?: number
        region?: 'IN' | 'GLOBAL'
        category?: string
    } = {}
): Promise<ProductMatch[]> {
    const { limit = 12, region, category } = options

    // Build query filters
    const where: any = {}

    if (region) {
        where.region = region
    }

    if (category) {
        where.category = category
    }

    // Fetch products
    const products = await prisma.product.findMany({
        where,
        take: limit * 3, // Fetch more to allow for scoring
    })

    // Score each product
    const scoredProducts: ProductMatch[] = products.map(product => {
        let score = 0
        const reasons: string[] = []

        // Match skin type
        if (profile.skinType && product.skinTypes.length > 0) {
            const skinTypeMatch = product.skinTypes.some(
                st => st.toLowerCase() === profile.skinType?.toLowerCase()
            )
            if (skinTypeMatch) {
                score += 30
                reasons.push(`Suitable for ${profile.skinType} skin`)
            }
        }

        // Match concerns
        if (profile.concerns && profile.concerns.length > 0 && product.concerns.length > 0) {
            const matchingConcerns = profile.concerns.filter(c =>
                product.concerns.some(pc =>
                    pc.toLowerCase().includes(c.toLowerCase()) ||
                    c.toLowerCase().includes(pc.toLowerCase())
                )
            )

            if (matchingConcerns.length > 0) {
                score += matchingConcerns.length * 20
                reasons.push(`Targets: ${matchingConcerns.join(', ')}`)
            }
        }

        // Bonus for having ingredients listed (more trustworthy)
        if (product.ingredientsIncis.length > 0) {
            score += 10
        }

        // Bonus for having price
        if (product.priceInr || product.priceUsd) {
            score += 5
        }

        return {
            id: product.id,
            name: product.name,
            brand: product.brand,
            category: product.category,
            image: product.image,
            priceInr: product.priceInr,
            priceUsd: product.priceUsd,
            affiliateUrl: product.affiliateUrl,
            ingredientsIncis: product.ingredientsIncis,
            skinTypes: product.skinTypes,
            concerns: product.concerns,
            region: product.region,
            matchScore: score,
            matchReasons: reasons
        }
    })

    // Sort by score and return top matches
    return scoredProducts
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit)
}

/**
 * Ingredient-based product search
 */
export async function searchByIngredients(
    ingredients: string[],
    options: { limit?: number; exclude?: string[] } = {}
): Promise<ProductMatch[]> {
    const { limit = 10, exclude = [] } = options

    const products = await prisma.product.findMany({
        where: {
            ingredientsIncis: {
                hasSome: ingredients.map(i => i.toLowerCase())
            }
        },
        take: limit * 2
    })

    // Score based on ingredient overlap
    const scored = products.map(product => {
        const productIngredients = product.ingredientsIncis.map(i => i.toLowerCase())
        const searchIngredients = ingredients.map(i => i.toLowerCase())

        const matches = searchIngredients.filter(i =>
            productIngredients.some(pi => pi.includes(i) || i.includes(pi))
        )

        // Check for excluded ingredients (bad for user)
        const badMatches = exclude.filter(e =>
            productIngredients.some(pi => pi.includes(e.toLowerCase()))
        )

        const score = (matches.length * 20) - (badMatches.length * 30)

        return {
            id: product.id,
            name: product.name,
            brand: product.brand,
            category: product.category,
            image: product.image,
            priceInr: product.priceInr,
            priceUsd: product.priceUsd,
            affiliateUrl: product.affiliateUrl,
            ingredientsIncis: product.ingredientsIncis,
            skinTypes: product.skinTypes,
            concerns: product.concerns,
            region: product.region,
            matchScore: Math.max(0, score),
            matchReasons: matches.length > 0
                ? [`Contains: ${matches.slice(0, 3).join(', ')}`]
                : []
        }
    })

    return scored
        .filter(p => p.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit)
}

/**
 * Get personalized recommendations based on AI analysis
 */
export async function getPersonalizedRecommendations(
    analysisResult: any,
    region: 'IN' | 'GLOBAL' = 'GLOBAL'
): Promise<{
    routine: {
        morning: ProductMatch[]
        evening: ProductMatch[]
    }
    topPicks: ProductMatch[]
}> {
    const profile: UserProfile = {
        skinType: analysisResult?.skinType,
        concerns: analysisResult?.concerns?.map((c: any) => c.name || c) || []
    }

    // Get products by category for routine
    const cleansers = await findMatchingProducts(profile, { limit: 3, region, category: 'cleanser' })
    const serums = await findMatchingProducts(profile, { limit: 3, region, category: 'serum' })
    const moisturizers = await findMatchingProducts(profile, { limit: 3, region, category: 'moisturizer' })
    const sunscreens = await findMatchingProducts(profile, { limit: 3, region, category: 'sunscreen' })
    const treatments = await findMatchingProducts(profile, { limit: 3, region, category: 'treatment' })

    return {
        routine: {
            morning: [
                cleansers[0],
                serums[0],
                moisturizers[0],
                sunscreens[0]
            ].filter(Boolean),
            evening: [
                cleansers[0],
                treatments[0] || serums[1],
                moisturizers[0]
            ].filter(Boolean)
        },
        topPicks: await findMatchingProducts(profile, { limit: 6, region })
    }
}
