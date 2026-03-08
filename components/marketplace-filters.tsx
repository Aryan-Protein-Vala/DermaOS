"use client"

import type React from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface FiltersProps {
  filters: {
    budget: string[]
    concern: string[]
    type: string[]
  }
  setFilters: React.Dispatch<
    React.SetStateAction<{
      budget: string[]
      concern: string[]
      type: string[]
    }>
  >
}

export function MarketplaceFilters({ filters, setFilters }: FiltersProps) {
  const toggleFilter = (category: "budget" | "concern" | "type", value: string) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value],
    }))
  }

  return (
    <div className="space-y-8">
      {/* Budget */}
      <div>
        <h4 className="font-mono text-sm font-bold text-foreground mb-4">Budget</h4>
        <div className="space-y-3">
          {[
            { value: "$", label: "Under $10" },
            { value: "$$", label: "$10 - $25" },
            { value: "$$$", label: "$25+" },
          ].map((item) => (
            <div key={item.value} className="flex items-center gap-3">
              <Checkbox
                id={`budget-${item.value}`}
                checked={filters.budget.includes(item.value)}
                onCheckedChange={() => toggleFilter("budget", item.value)}
                className="rounded-none border-[#E5E5E5]"
              />
              <Label
                htmlFor={`budget-${item.value}`}
                className="font-mono text-sm text-muted-foreground cursor-pointer"
              >
                {item.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Skin Concern */}
      <div>
        <h4 className="font-mono text-sm font-bold text-foreground mb-4">Skin Concern</h4>
        <div className="space-y-3">
          {["Acne", "Aging", "Dryness", "Hyperpigmentation", "Sensitivity"].map((concern) => (
            <div key={concern} className="flex items-center gap-3">
              <Checkbox
                id={`concern-${concern}`}
                checked={filters.concern.includes(concern.toLowerCase())}
                onCheckedChange={() => toggleFilter("concern", concern.toLowerCase())}
                className="rounded-none border-[#E5E5E5]"
              />
              <Label htmlFor={`concern-${concern}`} className="font-mono text-sm text-muted-foreground cursor-pointer">
                {concern}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Product Type */}
      <div>
        <h4 className="font-mono text-sm font-bold text-foreground mb-4">Product Type</h4>
        <div className="space-y-3">
          {["cleanser", "serum", "moisturizer", "sunscreen", "treatment", "eye cream"].map((type) => (
            <div key={type} className="flex items-center gap-3">
              <Checkbox
                id={`type-${type}`}
                checked={filters.type.includes(type)}
                onCheckedChange={() => toggleFilter("type", type)}
                className="rounded-none border-[#E5E5E5]"
              />
              <Label
                htmlFor={`type-${type}`}
                className="font-mono text-sm text-muted-foreground cursor-pointer capitalize"
              >
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
