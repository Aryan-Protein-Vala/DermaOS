import Link from "next/link"

export function Footer() {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <p className="font-mono text-xl font-bold text-foreground mb-4">DermaOS</p>
            <p className="font-mono text-xs text-muted-foreground">Skincare is biology, not marketing.</p>
          </div>
          <div>
            <p className="font-mono text-xs font-bold text-foreground mb-4">Product</p>
            <div className="space-y-2">
              <Link href="#marketplace" className="block font-mono text-xs text-muted-foreground hover:text-foreground">
                Marketplace
              </Link>
              <Link href="#scanner" className="block font-mono text-xs text-muted-foreground hover:text-foreground">
                Skin Scanner
              </Link>
              <Link href="#" className="block font-mono text-xs text-muted-foreground hover:text-foreground">
                Pricing
              </Link>
            </div>
          </div>
          <div>
            <p className="font-mono text-xs font-bold text-foreground mb-4">Company</p>
            <div className="space-y-2">
              <Link href="/about" className="block font-mono text-xs text-muted-foreground hover:text-foreground">
                About
              </Link>
              <Link href="/blog" className="block font-mono text-xs text-muted-foreground hover:text-foreground">
                Blog
              </Link>
            </div>
          </div>
          <div>
            <p className="font-mono text-xs font-bold text-foreground mb-4">Legal</p>
            <div className="space-y-2">
              <Link href="/privacy" className="block font-mono text-xs text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link href="/terms" className="block font-mono text-xs text-muted-foreground hover:text-foreground">
                Terms
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-[#E5E5E5]">
          <p className="font-mono text-xs text-muted-foreground text-center">© 2025 DermaOS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
