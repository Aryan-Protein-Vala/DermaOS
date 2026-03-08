import fs from 'fs'
import path from 'path'

interface GlobalProduct {
    name: string
    url: string
    type: string
    ingredients: string[]
    price: number | null
    currency: string
}

interface IndianProduct {
    skinTypes: string[]
    name: string
    concerns: string[]
    url: string
    image: string
}

/**
 * Parse the global-skincare.csv file
 */
export function parseGlobalSkincare(csvPath: string): GlobalProduct[] {
    const content = fs.readFileSync(csvPath, 'utf-8')
    const lines = content.split('\n')
    const products: GlobalProduct[] = []

    // Skip header
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        try {
            // CSV format: product_name,product_url,product_type,clean_ingreds,price
            // Ingredients are in JSON array format within quotes
            const match = line.match(/^([^,]+),([^,]+),([^,]+),"(\[.*?\])",(£|₹|\$)?([0-9.]+)?/)

            if (match) {
                const [, name, url, type, ingredientsStr, currency, priceStr] = match

                // Parse ingredients from JSON-like string
                let ingredients: string[] = []
                try {
                    ingredients = JSON.parse(ingredientsStr.replace(/'/g, '"'))
                } catch {
                    // If JSON parse fails, try splitting by comma
                    ingredients = ingredientsStr.replace(/[\[\]']/g, '').split(',').map(s => s.trim())
                }

                products.push({
                    name: name.trim(),
                    url: url.trim(),
                    type: type.toLowerCase().trim(),
                    ingredients: ingredients.filter(i => i.length > 0),
                    price: priceStr ? parseFloat(priceStr) : null,
                    currency: currency || '£'
                })
            }
        } catch (e) {
            // Skip malformed lines
            console.warn(`Skipping line ${i}: parse error`)
        }
    }

    return products
}

/**
 * Parse the indian-skincare.csv file
 */
export function parseIndianSkincare(csvPath: string): IndianProduct[] {
    const content = fs.readFileSync(csvPath, 'utf-8')
    const lines = content.split('\n')
    const products: IndianProduct[] = []

    // Skip header
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        try {
            // CSV format: Skin type,Product,Concern,product_url,product_pic
            // Skin type and Concern can have multiple values in quotes

            // Handle quoted fields properly
            const fields: string[] = []
            let current = ''
            let inQuotes = false

            for (const char of line) {
                if (char === '"') {
                    inQuotes = !inQuotes
                } else if (char === ',' && !inQuotes) {
                    fields.push(current.trim())
                    current = ''
                } else {
                    current += char
                }
            }
            fields.push(current.trim())

            if (fields.length >= 5) {
                const [skinTypeStr, name, concernStr, url, image] = fields

                // Parse skin types (comma-separated within the field)
                const skinTypes = skinTypeStr
                    .split(',')
                    .map(s => s.trim())
                    .filter(s => s.length > 0)

                // Parse concerns (comma-separated within the field)
                const concerns = concernStr
                    .split(',')
                    .map(s => s.trim())
                    .filter(s => s.length > 0)

                if (name && url) {
                    products.push({
                        skinTypes,
                        name: name.trim(),
                        concerns,
                        url: url.trim(),
                        image: image?.trim() || ''
                    })
                }
            }
        } catch (e) {
            console.warn(`Skipping line ${i}: parse error`)
        }
    }

    return products
}

/**
 * Extract brand from product name
 */
export function extractBrand(productName: string): string {
    const knownBrands = [
        'The Ordinary', 'CeraVe', 'La Roche-Posay', 'Clinique', 'Neutrogena',
        'Estée Lauder', 'Avène', 'First Aid Beauty', 'Weleda', 'Embryolisse',
        'NIOD', 'Elemis', 'Origins', 'Elizabeth Arden', 'Murad', 'Caudalie',
        'COSRX', 'Dr.Jart+', 'PIXI', 'Lancôme', 'Dermalogica', 'REN',
        'Mama Mio', 'Bulldog', 'AMELIORATE', 'Egyptian Magic', 'JASON',
        'Dot & Key', 'Mamaearth', 'Dr. Sheth', 'Minimalist', 'Plum',
        'Foxtale', 'The Derma Co', 'Kama Ayurveda', 'Forest Essentials',
        'Earth Rhythm', 'Fixderma', 'Suganda', 'Dermabay', 'MFine',
        'Rivona', 'SkinQ', 'Pure Bubbles', 'Conscious Chemist'
    ]

    for (const brand of knownBrands) {
        if (productName.toLowerCase().includes(brand.toLowerCase())) {
            return brand
        }
    }

    // Extract first word(s) before common keywords
    const match = productName.match(/^([A-Za-z'.&]+(?:\s+[A-Za-z'.&]+)?)\s/)
    return match ? match[1] : 'Unknown'
}

/**
 * Normalize category from product type
 */
export function normalizeCategory(type: string): string {
    const typeMap: Record<string, string> = {
        'moisturiser': 'moisturizer',
        'moisturizer': 'moisturizer',
        'serum': 'serum',
        'cleanser': 'cleanser',
        'face wash': 'cleanser',
        'sunscreen': 'sunscreen',
        'sun protection': 'sunscreen',
        'toner': 'toner',
        'mask': 'mask',
        'treatment': 'treatment',
        'eye cream': 'eye cream',
        'scrub': 'exfoliator',
        'exfoliation': 'exfoliator',
        'peel': 'exfoliator'
    }

    const lowerType = type.toLowerCase()

    for (const [key, value] of Object.entries(typeMap)) {
        if (lowerType.includes(key)) {
            return value
        }
    }

    return 'other'
}

/**
 * Convert GBP price to USD and INR
 */
export function convertPrice(price: number | null, currency: string): { usd: number | null, inr: number | null } {
    if (price === null) return { usd: null, inr: null }

    // Approximate conversion rates
    const rates: Record<string, { toUsd: number, toInr: number }> = {
        '£': { toUsd: 1.27, toInr: 105 },
        '$': { toUsd: 1, toInr: 83 },
        '₹': { toUsd: 0.012, toInr: 1 }
    }

    const rate = rates[currency] || rates['$']

    return {
        usd: Math.round(price * rate.toUsd * 100) / 100,
        inr: Math.round(price * rate.toInr)
    }
}
