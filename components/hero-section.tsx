import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal leading-tight text-foreground text-balance">
              Skincare is Biology,
              <br />
              <span className="italic">Not Marketing.</span>
            </h1>
            <p className="font-mono text-base md:text-lg text-muted-foreground max-w-md">
              The first marketplace that filters by YOUR DNA.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                className="font-mono text-sm h-12 px-8 border-foreground text-foreground hover:bg-foreground hover:text-background rounded-none bg-transparent"
                asChild
              >
                <Link href="#marketplace">Go to Marketplace</Link>
              </Button>
              <Button
                className="font-mono text-sm h-12 px-8 bg-foreground text-background hover:bg-foreground/90 rounded-none"
                asChild
              >
                <Link href="#scanner">Analyze My Skin</Link>
              </Button>
            </div>
          </div>

          {/* Right - Product Grid */}
          <div className="grid grid-cols-3 gap-4">
            {[
              "/cerave-hydrating-cleanser-bottle.jpg",
              "/the-ordinary-niacinamide-serum-bottle.jpg",
              "/la-roche-posay-toleriane-moisturizer.jpg",
              "/la-roche-posay-anthelios-sunscreen.jpg",
              "/the-ordinary-aha-bha-peeling-solution.jpg",
              "/cerave-retinol-serum-bottle.jpg",
            ].map((src, i) => (
              <div
                key={i}
                className="aspect-square bg-white border border-[#E5E5E5] flex items-center justify-center p-2"
              >
                <div className="relative w-full h-full bg-[#FAFAFA] flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="Product" className="object-contain w-full h-full p-2" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 pt-12 border-t border-[#E5E5E5]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="font-mono text-3xl md:text-4xl font-bold text-foreground">14,000+</p>
              <p className="font-mono text-sm text-muted-foreground mt-1">Products Analyzed</p>
            </div>
            <div>
              <p className="font-mono text-3xl md:text-4xl font-bold text-foreground">2,847</p>
              <p className="font-mono text-sm text-muted-foreground mt-1">Active Ingredients</p>
            </div>
            <div>
              <p className="font-mono text-3xl md:text-4xl font-bold text-foreground">98.2%</p>
              <p className="font-mono text-sm text-muted-foreground mt-1">Match Accuracy</p>
            </div>
            <div>
              <p className="font-mono text-3xl md:text-4xl font-bold text-foreground">50k+</p>
              <p className="font-mono text-sm text-muted-foreground mt-1">Skin Profiles</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
