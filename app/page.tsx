import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { MarketplaceSection } from "@/components/marketplace-section"
import { ScannerSection } from "@/components/scanner-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      <HeroSection />
      <MarketplaceSection />
      <ScannerSection />
      <Footer />
    </main>
  )
}
