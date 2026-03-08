import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { calculateGrade } from "@/lib/grading-engine"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

interface Product {
    id: string
    name: string
    brand: string
    category: string
    image: string
    ingredientsIncis: string[]
    priceInr: number
    priceUsd: number
    regions: string[]
    globalSuitability: unknown
    createdAt: Date
}

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams
        const budget = searchParams.get("budget")
        const type = searchParams.get("type")
        const skinType = searchParams.get("skinType")

        // Get region from cookie
        const cookieStore = await cookies()
        const region = cookieStore.get("DERMA_REGION")?.value || "GLOBAL"

        // Get user session for skin profile
        const session = await getServerSession(authOptions)
        let userSkinProfile = null

        if (session?.user) {
            const user = await db.user.findUnique({
                where: { id: (session.user as any).id },
                select: { skinProfile: true },
            })
            userSkinProfile = user?.skinProfile as any
        }

        // Override with query param if provided
        if (skinType) {
            const parts = skinType.match(/([A-Z][a-z]+)/g) || []
            if (parts.length >= 1) {
                userSkinProfile = {
                    type: parts[0],
                    sensitivity: parts[1] || "Resistant",
                }
            }
        }

        // Build query
        const where: any = {
            regions: { has: region },
        }

        if (type) {
            where.category = { equals: type, mode: "insensitive" }
        }

        // Fetch products
        let products: Product[] = await db.product.findMany({
            where,
            orderBy: { createdAt: "desc" },
        })

        // Apply budget filter
        if (budget) {
            const priceField = region === "IN" ? "priceInr" : "priceUsd"
            products = products.filter((p: Product) => {
                const price = region === "IN" ? p.priceInr : p.priceUsd
                if (budget === "$" && price < 10) return true
                if (budget === "$$" && price >= 10 && price < 25) return true
                if (budget === "$$$" && price >= 25) return true
                return false
            })
        }

        // Transform products with grades and correct pricing
        const transformedProducts = products.map((product: Product) => {
            const { grade, reason } = calculateGrade(
                product.globalSuitability as any,
                userSkinProfile
            )

            return {
                id: product.id,
                name: product.name,
                brand: product.brand,
                category: product.category,
                image: product.image,
                price: region === "IN" ? product.priceInr : product.priceUsd,
                priceInr: product.priceInr,
                priceUsd: product.priceUsd,
                grade: userSkinProfile ? grade : null,
                gradeReason: userSkinProfile ? reason : null,
                ingredientsCount: product.ingredientsIncis.length,
            }
        })

        return NextResponse.json({
            products: transformedProducts,
            region,
            currency: region === "IN" ? "INR" : "USD",
            hasProfile: !!userSkinProfile,
        })
    } catch (error) {
        console.error("Products API error:", error)
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }
}
