"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Menu, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { LoginDialog } from "@/components/auth/login-dialog"
import { UserMenu } from "@/components/auth/user-menu"
import { useAuth } from "@/context/auth-context"
import { useRegion } from "@/context/region-context"

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isAuthenticated, isLoading } = useAuth()
  const { region, toggleRegion } = useRegion()

  return (
    <nav className="sticky top-0 z-50 bg-[#FAFAFA] border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Logo + Search + Nav */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href="/" className="font-mono text-xl font-bold tracking-tight text-foreground">
              DermaOS
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:flex relative">
              {isSearchOpen ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    className="w-48 h-8 text-sm font-mono bg-white border-[#E5E5E5] rounded-md"
                    autoFocus
                    onBlur={() => setIsSearchOpen(false)}
                  />
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="#marketplace"
                className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Shop
              </Link>
              <Link
                href="#scanner"
                className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                My Skin
              </Link>
            </div>
          </div>

          {/* Right Side - Region + Auth */}
          <div className="hidden md:flex items-center gap-4">
            {/* Region Toggle - Clean Pill Style */}
            <button
              onClick={toggleRegion}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F0F0F0] hover:bg-[#E5E5E5] transition-colors"
              title="Switch region"
            >
              <span className="text-sm">{region === "IN" ? "🇮🇳" : "🌍"}</span>
              <span className="font-mono text-xs font-medium text-foreground">
                {region === "IN" ? "INR" : "USD"}
              </span>
            </button>

            {/* Auth */}
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-[#E5E5E5] animate-pulse" />
            ) : isAuthenticated ? (
              <UserMenu />
            ) : (
              <LoginDialog />
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-foreground" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#E5E5E5] py-4 space-y-4">
            <Input
              type="text"
              placeholder="Search products..."
              className="w-full h-10 text-sm font-mono bg-white border-[#E5E5E5]"
            />
            <Link href="#marketplace" className="block font-mono text-sm text-muted-foreground hover:text-foreground">
              Shop
            </Link>
            <Link href="#scanner" className="block font-mono text-sm text-muted-foreground hover:text-foreground">
              My Skin
            </Link>
            <button
              onClick={toggleRegion}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0F0F0] hover:bg-[#E5E5E5] transition-colors"
            >
              <span className="text-sm">{region === "IN" ? "🇮🇳" : "🌍"}</span>
              <span className="font-mono text-xs font-medium">
                {region === "IN" ? "India (INR)" : "Global (USD)"}
              </span>
            </button>
            <div className="pt-2">
              {isAuthenticated ? <UserMenu /> : <LoginDialog />}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
