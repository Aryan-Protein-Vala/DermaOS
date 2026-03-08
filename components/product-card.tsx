"use client"

import { useState } from "react"
import Image from "next/image"
import { Info, HelpCircle, ExternalLink, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Product {
  id: string
  name: string
  brand: string
  price: number
  image: string
  category: string
  grade?: string | null
  gradeReason?: string | null
  affiliateUrl?: string | null
  ingredientsIncis?: string[]
  skinTypes?: string[]
  concerns?: string[]
}

interface ProductCardProps {
  product: Product
  isLoggedIn: boolean
  hasPremium?: boolean
  currencySymbol?: string
}

export function ProductCard({ product, isLoggedIn, hasPremium = false, currencySymbol = "$" }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showIngredients, setShowIngredients] = useState(false)

  const grade = product.grade
  const gradeReason = product.gradeReason

  const getGradeColor = (g: string | null | undefined) => {
    if (!g) return "bg-gray-400"
    if (g === "A") return "bg-green-500"
    if (g === "B") return "bg-green-400"
    if (g === "C") return "bg-yellow-500"
    if (g === "D") return "bg-orange-500"
    if (g === "F") return "bg-red-500"
    return "bg-gray-400"
  }

  const handleBuyClick = () => {
    if (product.affiliateUrl) {
      window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const handleViewIngredients = () => {
    setShowIngredients(true)
    setIsHovered(false)
  }

  return (
    <>
      <div
        className="group border border-[#E5E5E5] bg-white hover:shadow-lg transition-shadow"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image */}
        <div className="relative aspect-square bg-[#F5F5F5] overflow-hidden">
          <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-contain p-4" />

          {/* Hover Overlay */}
          {isHovered && (
            <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center gap-2">
              <Button
                variant="outline"
                className="font-mono text-xs border-foreground rounded-none bg-transparent"
                onClick={handleViewIngredients}
              >
                View Ingredients
              </Button>
              {product.affiliateUrl && (
                <Button
                  onClick={handleBuyClick}
                  className="font-mono text-xs bg-foreground text-background hover:bg-foreground/90 rounded-none"
                >
                  Buy Now <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 border-t border-[#E5E5E5]">
          <p className="font-mono text-xs text-muted-foreground">{product.brand}</p>
          <h3 className="font-mono text-sm font-medium text-foreground mt-1 line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          <div className="flex items-center justify-between mt-3">
            <p className="font-mono text-sm font-bold text-foreground">
              {currencySymbol}{product.price.toFixed(2)}
            </p>

            {/* Grade Badge */}
            {isLoggedIn && hasPremium && grade ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`w-7 h-7 rounded-full ${getGradeColor(grade)} flex items-center justify-center cursor-help`}>
                      <span className="font-mono text-xs font-bold text-white">{grade}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="font-mono text-xs">{gradeReason || "Based on your skin profile"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : isLoggedIn && !hasPremium ? (
              <Link
                href="#scanner"
                className="flex items-center gap-1 text-amber-600 hover:text-amber-700 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="font-mono text-xs">Pro</span>
              </Link>
            ) : (
              <Link
                href="#scanner"
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Info className="w-4 h-4" />
                <span className="font-mono text-xs">Unlock</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Ingredients Modal */}
      {showIngredients && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col rounded-none border border-[#E5E5E5]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#E5E5E5]">
              <div>
                <p className="font-mono text-xs text-muted-foreground">{product.brand}</p>
                <h3 className="font-mono text-lg font-bold text-foreground">{product.name}</h3>
              </div>
              <button
                onClick={() => setShowIngredients(false)}
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Skin Types */}
              {product.skinTypes && product.skinTypes.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-mono text-sm font-bold text-foreground mb-2">Best For</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.skinTypes.map((type, i) => (
                      <span key={i} className="px-2 py-1 bg-green-100 text-green-800 font-mono text-xs">
                        {type} Skin
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Concerns */}
              {product.concerns && product.concerns.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-mono text-sm font-bold text-foreground mb-2">Targets</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.concerns.map((concern, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 font-mono text-xs">
                        {concern}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Ingredients */}
              <div>
                <h4 className="font-mono text-sm font-bold text-foreground mb-2">Ingredients</h4>
                {product.ingredientsIncis && product.ingredientsIncis.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {product.ingredientsIncis.map((ingredient, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 font-mono text-xs">
                        {ingredient}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="font-mono text-sm text-muted-foreground">
                    Ingredient list not available for this product.
                  </p>
                )}
              </div>

              {/* Grade */}
              {grade && (
                <div className="mt-4 p-3 bg-gray-50 border border-[#E5E5E5]">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${getGradeColor(grade)} flex items-center justify-center`}>
                      <span className="font-mono text-sm font-bold text-white">{grade}</span>
                    </div>
                    <div>
                      <p className="font-mono text-sm font-bold text-foreground">Your Match Grade</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {gradeReason || "Based on your skin profile"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E5E5E5] flex gap-2">
              <Button
                variant="outline"
                className="flex-1 font-mono text-sm rounded-none"
                onClick={() => setShowIngredients(false)}
              >
                Close
              </Button>
              {product.affiliateUrl && (
                <Button
                  onClick={handleBuyClick}
                  className="flex-1 font-mono text-sm bg-foreground text-background hover:bg-foreground/90 rounded-none"
                >
                  Buy Now <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
