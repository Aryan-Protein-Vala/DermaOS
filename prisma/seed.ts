import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const products = [
    // Cleansers
    {
        name: "Salicylic Acid 2% Face Wash",
        brand: "Minimalist",
        category: "Cleanser",
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
        ingredientsIncis: ["Salicylic Acid", "Niacinamide", "Zinc"],
        priceInr: 349,
        priceUsd: 4.99,
        regions: ["IN", "GLOBAL"],
        affiliateUrl: "https://amazon.in/dp/B08L5WLHKD",
        globalSuitability: {
            oily: { score: 95, reason: "Salicylic acid controls oil and unclogs pores" },
            dry: { score: 45, reason: "May be too drying for dry skin" },
            combination: { score: 80, reason: "Great for oily T-zone" },
            normal: { score: 70, reason: "Good for occasional breakouts" },
            sensitive: { score: 40, reason: "Salicylic acid can irritate sensitive skin" },
            acne: { score: 95, reason: "Excellent for acne-prone skin" },
        }
    },
    {
        name: "Hydrating Facial Cleanser",
        brand: "CeraVe",
        category: "Cleanser",
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400",
        ingredientsIncis: ["Ceramides", "Hyaluronic Acid", "Niacinamide"],
        priceInr: 899,
        priceUsd: 14.99,
        regions: ["IN", "GLOBAL"],
        affiliateUrl: "https://amazon.in/dp/B01MSSDEPK",
        globalSuitability: {
            oily: { score: 60, reason: "Gentle but may not control oil" },
            dry: { score: 95, reason: "Ceramides restore moisture barrier" },
            combination: { score: 75, reason: "Good for dry cheeks" },
            normal: { score: 85, reason: "Excellent daily cleanser" },
            sensitive: { score: 90, reason: "Fragrance-free and gentle" },
            acne: { score: 55, reason: "Non-comedogenic but no active ingredients" },
        }
    },
    {
        name: "Squalane Cleanser",
        brand: "The Ordinary",
        category: "Cleanser",
        image: "https://images.unsplash.com/photo-1556228841-a3d04c4c4e70?w=400",
        ingredientsIncis: ["Squalane", "Sucrose Stearate", "Ethyl Macadamiate"],
        priceInr: 599,
        priceUsd: 8.99,
        regions: ["IN", "GLOBAL"],
        affiliateUrl: "https://amazon.in/dp/B0754HYG6Z",
        globalSuitability: {
            oily: { score: 50, reason: "Oil-based, may feel heavy" },
            dry: { score: 90, reason: "Squalane deeply hydrates" },
            combination: { score: 65, reason: "Better for dry areas" },
            normal: { score: 80, reason: "Gentle makeup remover" },
            sensitive: { score: 85, reason: "Minimal ingredients" },
            acne: { score: 40, reason: "Oil cleansers can clog pores" },
        }
    },

    // Serums
    {
        name: "Niacinamide 10% + Zinc 1%",
        brand: "The Ordinary",
        category: "Serum",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400",
        ingredientsIncis: ["Niacinamide", "Zinc PCA", "Tamarindus Indica Seed Gum"],
        priceInr: 590,
        priceUsd: 6.99,
        regions: ["IN", "GLOBAL"],
        affiliateUrl: "https://amazon.in/dp/B06VSX2B8G",
        globalSuitability: {
            oily: { score: 95, reason: "Controls sebum production excellently" },
            dry: { score: 70, reason: "Good but add hydration" },
            combination: { score: 90, reason: "Balances oil in T-zone" },
            normal: { score: 85, reason: "Great for pore minimizing" },
            sensitive: { score: 75, reason: "Start with lower frequency" },
            acne: { score: 90, reason: "Reduces inflammation and redness" },
        }
    },
    {
        name: "Alpha Arbutin 2% Serum",
        brand: "Minimalist",
        category: "Serum",
        image: "https://images.unsplash.com/photo-1617897903246-719242758050?w=400",
        ingredientsIncis: ["Alpha Arbutin", "Hyaluronic Acid", "Lactic Acid"],
        priceInr: 545,
        priceUsd: 7.99,
        regions: ["IN", "GLOBAL"],
        affiliateUrl: "https://amazon.in/dp/B08KGS8J4K",
        globalSuitability: {
            oily: { score: 80, reason: "Lightweight, won't add oil" },
            dry: { score: 80, reason: "Contains hyaluronic acid" },
            combination: { score: 85, reason: "Works for all areas" },
            normal: { score: 85, reason: "Excellent for even skin tone" },
            sensitive: { score: 80, reason: "Gentler than Vitamin C" },
            acne: { score: 70, reason: "Helps with post-acne marks" },
        }
    },
    {
        name: "Hyaluronic Acid 2% + B5",
        brand: "The Ordinary",
        category: "Serum",
        image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400",
        ingredientsIncis: ["Hyaluronic Acid", "Panthenol", "Ahnfeltia Concinna Extract"],
        priceInr: 590,
        priceUsd: 8.99,
        regions: ["IN", "GLOBAL"],
        affiliateUrl: "https://amazon.in/dp/B06VSX1G97",
        globalSuitability: {
            oily: { score: 75, reason: "Lightweight hydration" },
            dry: { score: 95, reason: "Maximum hydration" },
            combination: { score: 85, reason: "Hydrates without oil" },
            normal: { score: 90, reason: "Perfect daily hydration" },
            sensitive: { score: 90, reason: "Very gentle formula" },
            acne: { score: 70, reason: "Won't cause breakouts" },
        }
    },
    {
        name: "Vitamin C 10% Serum",
        brand: "Minimalist",
        category: "Serum",
        image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400",
        ingredientsIncis: ["Ethyl Ascorbic Acid", "Acetyl Glucosamine", "Centella Asiatica"],
        priceInr: 695,
        priceUsd: 9.99,
        regions: ["IN", "GLOBAL"],
        affiliateUrl: "https://amazon.in/dp/B08L5VJXMK",
        globalSuitability: {
            oily: { score: 80, reason: "Lightweight formula" },
            dry: { score: 75, reason: "May need extra hydration" },
            combination: { score: 80, reason: "Good for brightening" },
            normal: { score: 90, reason: "Excellent for glow" },
            sensitive: { score: 55, reason: "Vitamin C can irritate" },
            acne: { score: 65, reason: "Focus on other actives first" },
        }
    },
    {
        name: "Retinol 0.3%",
        brand: "The Ordinary",
        category: "Serum",
        image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400",
        ingredientsIncis: ["Retinol", "Squalane", "Jojoba Esters"],
        priceInr: 590,
        priceUsd: 6.99,
        regions: ["IN", "GLOBAL"],
        affiliateUrl: "https://amazon.in/dp/B06VSX1KJ9",
        globalSuitability: {
            oily: { score: 85, reason: "Helps with pores and texture" },
            dry: { score: 60, reason: "Can be drying, use sparingly" },
            combination: { score: 75, reason: "Start slow" },
            normal: { score: 80, reason: "Great anti-aging" },
            sensitive: { score: 30, reason: "Too strong for sensitive skin" },
            acne: { score: 85, reason: "Excellent for acne and marks" },
        }
    },

    // Moisturizers
    {
        name: "Daily Moisturizing Lotion",
        brand: "CeraVe",
        category: "Moisturizer",
        image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400",
        ingredientsIncis: ["Ceramides", "Hyaluronic Acid", "MVE Technology"],
        priceInr: 999,
        priceUsd: 15.99,
        regions: ["IN", "GLOBAL"],
        affiliateUrl: "https://amazon.in/dp/B000YJ2SLG",
        globalSuitability: {
            oily: { score: 55, reason: "May be too heavy for oily skin" },
            dry: { score: 95, reason: "Perfect ceramide restoration" },
            combination: { score: 70, reason: "Use on dry areas only" },
            normal: { score: 85, reason: "Excellent daily moisturizer" },
            sensitive: { score: 90, reason: "Dermatologist recommended" },
            acne: { score: 60, reason: "Non-comedogenic but rich" },
        }
    },
    {
        name: "Moisturizing Cream",
        brand: "Neutrogena",
        category: "Moisturizer",
        image: "https://images.unsplash.com/photo-1556229094-5c7e70c94c9d?w=400",
        ingredientsIncis: ["Glycerin", "Dimethicone", "Cetearyl Alcohol"],
        priceInr: 399,
        priceUsd: 6.99,
        regions: ["IN", "GLOBAL"],
        affiliateUrl: "https://amazon.in/dp/B003BYCWZE",
        globalSuitability: {
            oily: { score: 65, reason: "Lightweight option available" },
            dry: { score: 85, reason: "Good hydration" },
            combination: { score: 75, reason: "Works for most" },
            normal: { score: 80, reason: "Reliable daily use" },
            sensitive: { score: 70, reason: "Fragrance-free version available" },
            acne: { score: 65, reason: "Oil-free formula" },
        }
    },
    {
        name: "Sepicalm 3% + HA Moisturizer",
        brand: "Minimalist",
        category: "Moisturizer",
        image: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400",
        ingredientsIncis: ["Sepicalm", "Hyaluronic Acid", "Squalane"],
        priceInr: 449,
        priceUsd: 5.99,
        regions: ["IN", "GLOBAL"],
        affiliateUrl: "https://amazon.in/dp/B08KGSZN8Q",
        globalSuitability: {
            oily: { score: 75, reason: "Lightweight gel texture" },
            dry: { score: 80, reason: "Good hydration with HA" },
            combination: { score: 85, reason: "Balances all areas" },
            normal: { score: 85, reason: "Perfect everyday moisturizer" },
            sensitive: { score: 95, reason: "Sepicalm calms irritation" },
            acne: { score: 75, reason: "Non-comedogenic" },
        }
    },

    // Sunscreens
    {
        name: "Ultra Matte Sunscreen SPF 50+",
        brand: "Minimalist",
        category: "Sunscreen",
        image: "https://images.unsplash.com/photo-1556227702-d1e4e7b5c232?w=400",
        ingredientsIncis: ["Zinc Oxide", "Titanium Dioxide", "Silica"],
        priceInr: 499,
        priceUsd: 6.99,
        regions: ["IN", "GLOBAL"],
        affiliateUrl: "https://amazon.in/dp/B09H2KQPWM",
        globalSuitability: {
            oily: { score: 95, reason: "Matte finish controls shine" },
            dry: { score: 55, reason: "Matte formula can be drying" },
            combination: { score: 80, reason: "Great for T-zone" },
            normal: { score: 75, reason: "Good protection" },
            sensitive: { score: 85, reason: "Mineral filters are gentle" },
            acne: { score: 90, reason: "Won't clog pores" },
        }
    },
    {
        name: "Ultra Light SPF 50+ Sunscreen",
        brand: "La Shield",
        category: "Sunscreen",
        image: "https://images.unsplash.com/photo-1556227834-09f1de7a7d14?w=400",
        ingredientsIncis: ["Octinoxate", "Avobenzone", "Oxybenzone"],
        priceInr: 625,
        priceUsd: 8.99,
        regions: ["IN", "GLOBAL"],
        affiliateUrl: "https://amazon.in/dp/B07Q2V5Z1P",
        globalSuitability: {
            oily: { score: 85, reason: "Ultra light formula" },
            dry: { score: 70, reason: "Light, may need moisturizer" },
            combination: { score: 80, reason: "Works well" },
            normal: { score: 85, reason: "Excellent daily SPF" },
            sensitive: { score: 50, reason: "Chemical filters may irritate" },
            acne: { score: 80, reason: "Non-comedogenic" },
        }
    },
    {
        name: "UV Doux Silicone Sunscreen SPF 50+",
        brand: "Brinton",
        category: "Sunscreen",
        image: "https://images.unsplash.com/photo-1556227702-d1e4e7b5c232?w=400",
        ingredientsIncis: ["Octocrylene", "Bemotrizinol", "Dimethicone"],
        priceInr: 545,
        priceUsd: 7.99,
        regions: ["IN", "GLOBAL"],
        affiliateUrl: "https://amazon.in/dp/B08QVDX2DQ",
        globalSuitability: {
            oily: { score: 60, reason: "Silicone may feel heavy" },
            dry: { score: 85, reason: "Silicone locks in moisture" },
            combination: { score: 70, reason: "Better for dry areas" },
            normal: { score: 80, reason: "Smooth application" },
            sensitive: { score: 80, reason: "Dermatologist approved" },
            acne: { score: 55, reason: "Silicone can trap oil" },
        }
    },

    // Exfoliators
    {
        name: "AHA 25% + PHA 5% + BHA 2% Peeling Solution",
        brand: "Minimalist",
        category: "Exfoliator",
        image: "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=400",
        ingredientsIncis: ["Glycolic Acid", "Lactic Acid", "Salicylic Acid"],
        priceInr: 599,
        priceUsd: 8.99,
        regions: ["IN", "GLOBAL"],
        affiliateUrl: "https://amazon.in/dp/B08L5YL4Z8",
        globalSuitability: {
            oily: { score: 90, reason: "Great for texture and pores" },
            dry: { score: 50, reason: "Too strong, may over-dry" },
            combination: { score: 75, reason: "Use on oily areas" },
            normal: { score: 70, reason: "Once weekly treatment" },
            sensitive: { score: 20, reason: "Too strong for sensitive skin" },
            acne: { score: 85, reason: "Excellent for acne" },
        }
    },
    {
        name: "AHA 30% + BHA 2% Peeling Solution",
        brand: "The Ordinary",
        category: "Exfoliator",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400",
        ingredientsIncis: ["Glycolic Acid", "Lactic Acid", "Salicylic Acid", "Tartaric Acid"],
        priceInr: 700,
        priceUsd: 8.99,
        regions: ["IN", "GLOBAL"],
        affiliateUrl: "https://amazon.in/dp/B071D4D5QT",
        globalSuitability: {
            oily: { score: 90, reason: "Excellent for oily skin" },
            dry: { score: 40, reason: "Very drying" },
            combination: { score: 70, reason: "Use sparingly" },
            normal: { score: 65, reason: "Strong treatment" },
            sensitive: { score: 10, reason: "Do not use" },
            acne: { score: 90, reason: "Great for acne skin" },
        }
    },

    // Toners
    {
        name: "PHA 3% Toner",
        brand: "Minimalist",
        category: "Toner",
        image: "https://images.unsplash.com/photo-1601612628452-9e99ced43524?w=400",
        ingredientsIncis: ["Gluconolactone", "Lactobionic Acid", "Niacinamide"],
        priceInr: 349,
        priceUsd: 4.99,
        regions: ["IN", "GLOBAL"],
        affiliateUrl: "https://amazon.in/dp/B08L5WM2YK",
        globalSuitability: {
            oily: { score: 80, reason: "Gentle exfoliation" },
            dry: { score: 75, reason: "PHAs are hydrating" },
            combination: { score: 80, reason: "Balanced formula" },
            normal: { score: 85, reason: "Perfect daily toner" },
            sensitive: { score: 90, reason: "PHAs are gentle on skin" },
            acne: { score: 70, reason: "Mild exfoliation" },
        }
    },
    {
        name: "Glycolic Acid 7% Toning Solution",
        brand: "The Ordinary",
        category: "Toner",
        image: "https://images.unsplash.com/photo-1617897903246-719242758050?w=400",
        ingredientsIncis: ["Glycolic Acid", "Amino Acids", "Aloe Vera"],
        priceInr: 750,
        priceUsd: 9.99,
        regions: ["IN", "GLOBAL"],
        affiliateUrl: "https://amazon.in/dp/B072K5NCS5",
        globalSuitability: {
            oily: { score: 90, reason: "Excellent for texture" },
            dry: { score: 55, reason: "May be too drying" },
            combination: { score: 75, reason: "Good for oily T-zone" },
            normal: { score: 80, reason: "Great exfoliating toner" },
            sensitive: { score: 35, reason: "Glycolic can irritate" },
            acne: { score: 85, reason: "Helps with acne marks" },
        }
    },

    // Eye Creams
    {
        name: "Caffeine Solution 5% + EGCG",
        brand: "The Ordinary",
        category: "Eye Care",
        image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400",
        ingredientsIncis: ["Caffeine", "EGCG", "Glycerin"],
        priceInr: 520,
        priceUsd: 7.99,
        regions: ["IN", "GLOBAL"],
        affiliateUrl: "https://amazon.in/dp/B06VS8ZJYB",
        globalSuitability: {
            oily: { score: 80, reason: "Lightweight" },
            dry: { score: 70, reason: "May need extra hydration" },
            combination: { score: 80, reason: "Works well" },
            normal: { score: 85, reason: "Great for puffiness" },
            sensitive: { score: 75, reason: "Generally well tolerated" },
            acne: { score: 80, reason: "Won't cause breakouts" },
        }
    },
]

async function main() {
    console.log('🌱 Starting seed...')

    // Clear existing products
    await prisma.product.deleteMany()
    console.log('🗑️  Cleared existing products')

    // Insert new products
    for (const product of products) {
        await prisma.product.create({
            data: product,
        })
    }

    console.log(`✅ Seeded ${products.length} products`)
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
