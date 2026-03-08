"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import { MarketplaceFilters } from "@/components/marketplace-filters"
import { SlidersHorizontal, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { useRegion } from "@/context/region-context"
import { useSkinProfile } from "@/context/skin-profile-context"

// Fallback static products (when DB is empty)
const staticProducts = [
  { id: "1", name: "CeraVe Hydrating Cleanser", brand: "CeraVe", price: 15.99, priceInr: 1299, priceUsd: 15.99, image: "/cerave-hydrating-cleanser-bottle.jpg", category: "cleanser", grade: null, gradeReason: null },
  { id: "2", name: "The Ordinary Niacinamide 10%", brand: "The Ordinary", price: 6.5, priceInr: 549, priceUsd: 6.5, image: "/the-ordinary-niacinamide-serum-bottle.jpg", category: "serum", grade: null, gradeReason: null },
  { id: "3", name: "La Roche-Posay Toleriane", brand: "La Roche-Posay", price: 29.99, priceInr: 2499, priceUsd: 29.99, image: "/la-roche-posay-toleriane-moisturizer.jpg", category: "moisturizer", grade: null, gradeReason: null },
  { id: "4", name: "CeraVe PM Facial Moisturizing", brand: "CeraVe", price: 17.49, priceInr: 1449, priceUsd: 17.49, image: "/cerave-pm-moisturizer-bottle.jpg", category: "moisturizer", grade: null, gradeReason: null },
  { id: "5", name: "The Ordinary Hyaluronic Acid", brand: "The Ordinary", price: 8.9, priceInr: 749, priceUsd: 8.9, image: "/the-ordinary-hyaluronic-acid-serum.jpg", category: "serum", grade: null, gradeReason: null },
  { id: "6", name: "La Roche-Posay Effaclar", brand: "La Roche-Posay", price: 31.99, priceInr: 2649, priceUsd: 31.99, image: "/la-roche-posay-effaclar-cleanser.jpg", category: "cleanser", grade: null, gradeReason: null },
  { id: "7", name: "CeraVe Retinol Serum", brand: "CeraVe", price: 19.99, priceInr: 1649, priceUsd: 19.99, image: "/cerave-retinol-serum-bottle.jpg", category: "serum", grade: null, gradeReason: null },
  { id: "8", name: "The Ordinary AHA 30% BHA 2%", brand: "The Ordinary", price: 9.6, priceInr: 799, priceUsd: 9.6, image: "/the-ordinary-aha-bha-peeling-solution.jpg", category: "treatment", grade: null, gradeReason: null },
  { id: "9", name: "La Roche-Posay Anthelios SPF 50", brand: "La Roche-Posay", price: 35.99, priceInr: 2999, priceUsd: 35.99, image: "/la-roche-posay-anthelios-sunscreen.jpg", category: "sunscreen", grade: null, gradeReason: null },
  { id: "10", name: "CeraVe Eye Repair Cream", brand: "CeraVe", price: 14.99, priceInr: 1249, priceUsd: 14.99, image: "/cerave-eye-cream-jar.jpg", category: "eye cream", grade: null, gradeReason: null },
  { id: "11", name: "The Ordinary Caffeine Solution", brand: "The Ordinary", price: 7.9, priceInr: 649, priceUsd: 7.9, image: "/the-ordinary-caffeine-eye-serum.jpg", category: "eye cream", grade: null, gradeReason: null },
  { id: "12", name: "La Roche-Posay Cicaplast", brand: "La Roche-Posay", price: 16.99, priceInr: 1399, priceUsd: 16.99, image: "/la-roche-posay-cicaplast-balm.jpg", category: "treatment", grade: null, gradeReason: null },
]

interface Product {
  id: string
  name: string
  brand: string
  price: number
  priceInr: number
  priceUsd: number
  image: string
  category: string
  grade: string | null
  gradeReason: string | null
}

export function MarketplaceSection() {
  const { isAuthenticated } = useAuth()
  const { region, currencySymbol } = useRegion()
  const { skinProfile, hasPremium } = useSkinProfile()

  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [filters, setFilters] = useState({
    budget: [] as string[],
    concern: [] as string[],
    type: [] as string[],
  })

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams()
        if (filters.type.length > 0) params.set("type", filters.type[0])
        if (filters.budget.length > 0) params.set("budget", filters.budget[0])

        const res = await fetch(`/api/products?${params.toString()}`)
        const data = await res.json()

        if (data.products && data.products.length > 0) {
          setProducts(data.products)
        } else {
          // Use static products if DB is empty
          const filtered = applyClientFilters(staticProducts)
          setProducts(filtered)
        }
      } catch (error) {
        console.error("Failed to fetch products:", error)
        // Fallback to static products
        const filtered = applyClientFilters(staticProducts)
        setProducts(filtered)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [filters, region, skinProfile])

  // Client-side filtering for static products
  const applyClientFilters = (prods: Product[]) => {
    return prods.filter((product) => {
      if (filters.type.length > 0 && !filters.type.includes(product.category)) {
        return false
      }
      if (filters.budget.length > 0) {
        const price = region === "IN" ? product.priceInr : product.priceUsd
        const budgetMatch = filters.budget.some((b) => {
          if (b === "$" && price < (region === "IN" ? 1000 : 10)) return true
          if (b === "$$" && price >= (region === "IN" ? 1000 : 10) && price < (region === "IN" ? 2000 : 25)) return true
          if (b === "$$$" && price >= (region === "IN" ? 2000 : 25)) return true
          return false
        })
        if (!budgetMatch) return false
      }
      return true
    }).map(p => ({
      ...p,
      price: region === "IN" ? p.priceInr : p.priceUsd
    }))
  }

  return (
    <section id="marketplace" className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="font-mono text-2xl md:text-3xl font-bold text-foreground">Marketplace</h2>
            <p className="font-mono text-sm text-muted-foreground mt-2">
              {isLoading ? "Loading..." : `${products.length} products`} • Filtered for your skin
            </p>
          </div>

          {/* Mobile Filter Toggle */}
          <Button
            variant="outline"
            className="md:hidden font-mono text-sm border-[#E5E5E5] rounded-none bg-transparent"
            onClick={() => setShowMobileFilters(true)}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <MarketplaceFilters filters={filters} setFilters={setFilters} />
          </div>

          {/* Mobile Filters Overlay */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 bg-white md:hidden overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-mono text-lg font-bold">Filters</h3>
                  <button onClick={() => setShowMobileFilters(false)}>
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <MarketplaceFilters filters={filters} setFilters={setFilters} />
                <Button
                  className="w-full mt-8 font-mono rounded-none bg-foreground text-background"
                  onClick={() => setShowMobileFilters(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isLoggedIn={isAuthenticated}
                    hasPremium={hasPremium}
                    currencySymbol={currencySymbol}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
