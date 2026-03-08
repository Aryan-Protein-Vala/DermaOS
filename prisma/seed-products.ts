import { PrismaClient } from '@prisma/client'
import path from 'path'
import {
    parseGlobalSkincare,
    parseIndianSkincare,
    extractBrand,
    normalizeCategory,
    convertPrice
} from '../lib/product-data'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding products from CSV files...\n')

    // Clear existing products
    console.log('Clearing existing products...')
    await prisma.product.deleteMany()

    // Parse CSV files
    const globalCsvPath = path.resolve('./global-skincare.csv')
    const indianCsvPath = path.resolve('./indian-skincare.csv')

    // Seed global products
    console.log('\n📦 Processing global-skincare.csv...')
    const globalProducts = parseGlobalSkincare(globalCsvPath)
    console.log(`Found ${globalProducts.length} products`)

    let globalCount = 0
    for (const product of globalProducts.slice(0, 200)) { // Limit to 200 for initial seed
        try {
            const prices = convertPrice(product.price, product.currency)

            await prisma.product.create({
                data: {
                    name: product.name,
                    brand: extractBrand(product.name),
                    category: normalizeCategory(product.type),
                    image: '/placeholder-product.jpg', // Default image
                    ingredientsIncis: product.ingredients,
                    affiliateUrl: product.url,
                    priceUsd: prices.usd,
                    priceInr: prices.inr,
                    region: 'GLOBAL',
                    skinTypes: [], // Will be inferred from ingredients later
                    concerns: [],
                    regions: ['GLOBAL'],
                    globalSuitability: {}
                }
            })
            globalCount++
        } catch (e) {
            console.warn(`Failed to seed product: ${product.name}`)
        }
    }
    console.log(`✅ Seeded ${globalCount} global products`)

    // Seed Indian products
    console.log('\n📦 Processing indian-skincare.csv...')
    const indianProducts = parseIndianSkincare(indianCsvPath)
    console.log(`Found ${indianProducts.length} products`)

    let indianCount = 0
    for (const product of indianProducts) {
        try {
            // Check if product already exists (by name)
            const existing = await prisma.product.findFirst({
                where: { name: { contains: product.name, mode: 'insensitive' } }
            })

            if (!existing) {
                await prisma.product.create({
                    data: {
                        name: product.name,
                        brand: extractBrand(product.name),
                        category: 'other', // Will be categorized from concerns
                        image: product.image || '/placeholder-product.jpg',
                        ingredientsIncis: [],
                        affiliateUrl: product.url,
                        priceUsd: null,
                        priceInr: null, // Price not in CSV, needs manual entry
                        region: 'IN',
                        skinTypes: product.skinTypes.map(s => s.trim()),
                        concerns: product.concerns.map(c => c.trim()),
                        regions: ['IN'],
                        globalSuitability: {}
                    }
                })
                indianCount++
            }
        } catch (e) {
            console.warn(`Failed to seed product: ${product.name}`)
        }
    }
    console.log(`✅ Seeded ${indianCount} Indian products`)

    // Summary
    const totalProducts = await prisma.product.count()
    console.log(`\n🎉 Total products in database: ${totalProducts}`)
}

main()
    .catch((e) => {
        console.error('Seed failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
